import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from "../../pages/Login";
import { Register } from "../../pages/Register";
import { Cart } from "../../pages/Cart";
import { Checkout } from "../../pages/payments/Chekout";
import { PaymentSuccess } from "../../pages/payments/PaymentSucess";
import { PaymentError } from "../../pages/payments/PaymentError";
import { MyOrders } from "../../pages/MyOrders";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useOrderStore } from "../../store/orderStore";
import { useProductStore } from "../../store/productStore";
import {GoogleOAuthProvider} from '@react-oauth/google'
import { makeCartProduct, makeOrder, makeOrderSummary, makeUser, renderWithRouter } from "../helpers";

describe("Login y Register", () => {
  beforeEach(() => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("Login valida campos y navega a '/' si tiene éxito", async () => {
    const loginMock = vi.fn().mockResolvedValue({ success: true, message: "Bienvenido!" });
    useAuthStore.setState({ login: loginMock });
    renderWithRouter(
    <GoogleOAuthProvider clientId="test-client-id">
        <Login />
    </GoogleOAuthProvider>,
    "/login",);

    await userEvent.click(screen.getByRole("button", { name: "INICIAR SESIÓN" }));
    expect(await screen.findByText("Todos los campos son obligatorios")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Email"), "ana@gmail.com");
    await userEvent.type(screen.getByLabelText("Contraseña"), "1234");
    await userEvent.click(screen.getByRole("button", { name: "INICIAR SESIÓN" }));

    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/));
  });

  it("Register envía el payload completo y navega a /login", async () => {
    const registerMock = vi.fn().mockResolvedValue({ success: true, message: "OK" });
    useAuthStore.setState({ register: registerMock });
    renderWithRouter(<Register />, "/register");

    await userEvent.type(screen.getByLabelText("Nombre"), "Ana");
    await userEvent.type(screen.getByLabelText("Email"), "ana@gmail.com");
    await userEvent.type(screen.getByLabelText("Calle y número"), "Calle 1");
    await userEvent.type(screen.getByLabelText("Región"), "RM");
    await userEvent.type(screen.getByLabelText("Comuna"), "Santiago");
    await userEvent.type(screen.getByLabelText("Contraseña"), "1234");
    await userEvent.click(screen.getByRole("button", { name: "REGISTRARSE" }));

    expect(registerMock).toHaveBeenCalledWith({
      full_name: "Ana",
      email: "ana@gmail.com",
      address: "Calle 1",
      region: "RM",
      commune: "Santiago",
      password: "1234",
    });
    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/login"));
  });
});

describe("Cart, Checkout y Páginas de Pago", () => {
  const rosas = makeCartProduct({ product_id: 1, product_name: "Rosas", price: 10000, amount: 2 });

  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: makeUser() });
    useCartStore.setState({ cart: [rosas] });
    useProductStore.setState({ fetchProducts: vi.fn() });
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("Cart permite modificar cantidades y navegar a /checkout", async () => {
    renderWithRouter(<Cart />, "/cart");
    expect(screen.getByText("$20.000")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "PAGAR" }));
    expect(screen.getByTestId("location")).toHaveTextContent("/checkout");
  });

  it("Checkout PAID vacía el carrito y navega a /payment-success", async () => {
    const order = makeOrder({ status: "PAID" });
    useOrderStore.setState({ createOrder: vi.fn().mockResolvedValue({ success: true, data: order }) });
    renderWithRouter(<Checkout />, "/checkout");

    await userEvent.click(screen.getByRole("button", { name: /PAGAR \$20\.000/ }));
    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/payment-success"));
    expect(useCartStore.getState().cart).toEqual([]);
  });

  it("Checkout FAILED conserva el carrito y navega a /payment-error", async () => {
    const order = makeOrder({ status: "FAILED" });
    useOrderStore.setState({ createOrder: vi.fn().mockResolvedValue({ success: true, data: order }) });
    renderWithRouter(<Checkout />, "/checkout");

    await userEvent.click(screen.getByRole("button", { name: /PAGAR/ }));
    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/payment-error"));
    expect(useCartStore.getState().cart).toHaveLength(1);
  });

  it("PaymentSuccess y PaymentError muestran la orden recibida", async () => {
    const order = makeOrder({ order_id: 777 });
    const { unmount } = renderWithRouter(<PaymentSuccess />, {
      pathname: "/payment-success",
      state: { order },
    });
    expect(screen.getByRole("heading", { name: /¡Compra realizada! #777/ })).toBeInTheDocument();
    unmount();

    renderWithRouter(<PaymentError />, { pathname: "/payment-error", state: { order } });
    expect(screen.getByRole("heading", { name: /No se pudo realizar el pago #777/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "VOLVER A INTENTAR" }));
    expect(screen.getByTestId("location")).toHaveTextContent("/checkout");
  });
});

describe("MyOrders", () => {
  it("redirige a /login sin sesión y lista órdenes cuando hay usuario", async () => {
    useAuthStore.setState({ user: null });
    const { unmount } = renderWithRouter(<MyOrders />, "/my-orders");
    expect(screen.getByTestId("location")).toHaveTextContent("/login");
    unmount();

    useAuthStore.setState({ user: makeUser() });
    useOrderStore.setState({
      orders: [makeOrderSummary({ order_id: 88, total: 15000 })],
      loading: false,
      error: null,
      fetchMyOrders: vi.fn(),
    });
    renderWithRouter(<MyOrders />, "/my-orders");
    expect(screen.getByText("#88")).toBeInTheDocument();
    expect(screen.getByText("$15.000")).toBeInTheDocument();
  });
});