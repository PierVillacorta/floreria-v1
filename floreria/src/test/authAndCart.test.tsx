import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/payments/Chekout";
import { PaymentSuccess } from "../pages/payments/PaymentSucess";
import { PaymentError } from "../pages/payments/PaymentError";
import { useAuthStore, type AuhtResponse } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { renderWithRouter, makeCartProduct } from "./helpers";

type AuthFn = (...args: string[]) => Promise<AuhtResponse>;
const customer = { id: 1, full_name: "Ana", email: "ana@gmail.com", role: "CUSTOMER" as const, account_status: "ACTIVE" as const };

describe("Login", () => {
  let loginMock: ReturnType<typeof vi.fn<AuthFn>>;

  beforeEach(() => {
    loginMock = vi.fn<AuthFn>().mockResolvedValue({ success: false, message: "Datos incorrectos" });
    useAuthStore.setState({ login: loginMock });
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  const campos = () => ({
    email: screen.getByLabelText("Email") as HTMLInputElement,
    password: screen.getByLabelText("Contraseña") as HTMLInputElement,
    enviar: screen.getByRole("button", { name: "INICIAR SESIÓN" }),
  });

  it("renderiza título, campos, botón y enlace a registro", () => {
    renderWithRouter(<Login />, "/login");
    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
    const { email, password, enviar } = campos();
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(enviar).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Registrate" })).toHaveAttribute("href", "/register");
  });

  it("actualiza el estado de los inputs al escribir", async () => {
    renderWithRouter(<Login />, "/login");
    const { email, password } = campos();
    await userEvent.type(email, "ana@gmail.com");
    await userEvent.type(password, "1234");
    expect(email).toHaveValue("ana@gmail.com");
    expect(password).toHaveValue("1234");
  });

  it("no muestra errores al inicio", () => {
    renderWithRouter(<Login />, "/login");
    expect(screen.queryByText(/obligatorios|Solo se permiten|debe tener entre/)).not.toBeInTheDocument();
  });

  it("campos vacíos: muestra error y NO llama a login", async () => {
    renderWithRouter(<Login />, "/login");
    await userEvent.click(campos().enviar);
    expect(await screen.findByText("Todos los campos son obligatorios")).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("rechaza correos con dominio no permitido", async () => {
    renderWithRouter(<Login />, "/login");
    const { email, password, enviar } = campos();
    await userEvent.type(email, "ana@hotmail.com");
    await userEvent.type(password, "1234");
    await userEvent.click(enviar);
    expect(await screen.findByText(/Solo se permiten correos/)).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("rechaza contraseñas fuera del rango 4-10", async () => {
    renderWithRouter(<Login />, "/login");
    const { email, password, enviar } = campos();
    await userEvent.type(email, "ana@gmail.com");
    await userEvent.type(password, "123");
    await userEvent.click(enviar);
    expect(await screen.findByText("La contraseña debe tener entre 4 y 10 caracteres")).toBeInTheDocument();
  });

  it("credenciales incorrectas: muestra el error y limpia los campos", async () => {
    renderWithRouter(<Login />, "/login");
    const { email, password, enviar } = campos();
    await userEvent.type(email, "ana@gmail.com");
    await userEvent.type(password, "malaclave");
    await userEvent.click(enviar);
    expect(await screen.findByText("Datos incorrectos")).toBeInTheDocument();
    expect(loginMock).toHaveBeenCalledWith("ana@gmail.com", "malaclave");
    await waitFor(() => {
      expect(email).toHaveValue("");
      expect(password).toHaveValue("");
    });
  });

  it("login exitoso: alerta y navega a '/'", async () => {
    loginMock.mockResolvedValue({ success: true, message: "Bienvenido!" });
    renderWithRouter(<Login />, "/login");
    const { email, password, enviar } = campos();
    await userEvent.type(email, "ana@gmail.com");
    await userEvent.type(password, "1234");
    await userEvent.click(enviar);
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Bienvenido!"));
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
  });
});

describe("Register", () => {
  let registerMock: ReturnType<typeof vi.fn<AuthFn>>;

  beforeEach(() => {
    registerMock = vi.fn<AuthFn>().mockResolvedValue({ success: false, message: "El correo ya esta registrado" });
    useAuthStore.setState({ register: registerMock });
  });

  const campos = () => ({
    nombre: screen.getByLabelText("Nombre") as HTMLInputElement,
    email: screen.getByLabelText("Email") as HTMLInputElement,
    password: screen.getByLabelText("Contraseña") as HTMLInputElement,
    enviar: screen.getByRole("button", { name: "REGISTRARSE" }),
  });
  const llenar = async (n: string, e: string, p: string) => {
    const c = campos();
    if (n) await userEvent.type(c.nombre, n);
    if (e) await userEvent.type(c.email, e);
    if (p) await userEvent.type(c.password, p);
    await userEvent.click(c.enviar);
  };

  it("renderiza título, campos y enlace a login", () => {
    renderWithRouter(<Register />, "/register");
    expect(screen.getByRole("heading", { name: "REGISTRATE" })).toBeInTheDocument();
    expect(campos().nombre).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute("href", "/login");
  });

  it("exige todos los campos", async () => {
    renderWithRouter(<Register />, "/register");
    await llenar("Ana", "", "1234");
    expect(await screen.findByText("Todos los campos son obligatorios")).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
  });

  it("valida el dominio del correo", async () => {
    renderWithRouter(<Register />, "/register");
    await llenar("Ana", "ana@hotmail.com", "1234");
    expect(await screen.findByText(/Solo se permiten correos/)).toBeInTheDocument();
  });

  it("valida el largo de la contraseña", async () => {
    renderWithRouter(<Register />, "/register");
    await llenar("Ana", "ana@gmail.com", "12");
    expect(await screen.findByText("La contraseña debe tener entre 4 y 10 caracteres")).toBeInTheDocument();
  });

  it("si el backend rechaza: muestra el error y limpia los campos", async () => {
    renderWithRouter(<Register />, "/register");
    await llenar("Ana", "ana@gmail.com", "1234");
    expect(registerMock).toHaveBeenCalledWith("Ana", "ana@gmail.com", "1234");
    expect(await screen.findByText("El correo ya esta registrado")).toBeInTheDocument();
    await waitFor(() => expect(campos().nombre).toHaveValue(""));
  });

  it("registro exitoso navega a /login", async () => {
    registerMock.mockResolvedValue({ success: true, message: "Cuenta creada correctamente!!" });
    renderWithRouter(<Register />, "/register");
    await llenar("Ana", "ana@gmail.com", "1234");
    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/login"));
  });
});

describe("Cart", () => {
  const rosas = makeCartProduct({ product_id: 1, product_name: "Rosas", price: 10000, amount: 2 });
  const lirios = makeCartProduct({ product_id: 2, product_name: "Lirios", price: 5000, amount: 1 });

  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null });
    useCartStore.setState({ cart: [] });
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("carrito vacío: muestra 'No hay productos'", () => {
    renderWithRouter(<Cart />, "/cart");
    expect(screen.getByText("No hay productos")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "PAGAR" })).not.toBeInTheDocument();
  });

  it("lista un ítem por producto", () => {
    useCartStore.setState({ cart: [rosas, lirios] });
    renderWithRouter(<Cart />, "/cart");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Rosas")).toBeInTheDocument();
    expect(screen.getByText("Lirios")).toBeInTheDocument();
  });

  it("calcula total y cantidad de productos", () => {
    useCartStore.setState({ cart: [rosas, lirios] });
    renderWithRouter(<Cart />, "/cart");
    expect(screen.getByText("$25.000")).toBeInTheDocument(); // 2×10.000 + 5.000
    expect(screen.getByText("Productos").nextElementSibling).toHaveTextContent("3");
  });

  it("los botones + y − cambian la cantidad", async () => {
    useCartStore.setState({ cart: [lirios] });
    renderWithRouter(<Cart />, "/cart");
    await userEvent.click(screen.getByRole("button", { name: "+" }));
    expect(useCartStore.getState().cart[0].amount).toBe(2);
    await userEvent.click(screen.getByRole("button", { name: "−" }));
    expect(useCartStore.getState().cart[0].amount).toBe(1);
  });

  it("el botón × elimina el producto", async () => {
    useCartStore.setState({ cart: [rosas, lirios] });
    renderWithRouter(<Cart />, "/cart");
    await userEvent.click(screen.getByRole("button", { name: "Eliminar Rosas" }));
    expect(useCartStore.getState().cart.map((p) => p.product_id)).toEqual([2]);
  });

  it("PAGAR sin sesión: alerta y redirige a /login", async () => {
    useCartStore.setState({ cart: [rosas] });
    renderWithRouter(<Cart />, "/cart");
    await userEvent.click(screen.getByRole("button", { name: "PAGAR" }));
    expect(window.alert).toHaveBeenCalled();
    expect(screen.getByTestId("location")).toHaveTextContent("/login");
  });

  it("PAGAR con sesión: redirige a /checkout", async () => {
    useAuthStore.setState({ user: customer });
    useCartStore.setState({ cart: [rosas] });
    renderWithRouter(<Cart />, "/cart");
    await userEvent.click(screen.getByRole("button", { name: "PAGAR" }));
    expect(window.alert).not.toHaveBeenCalled();
    expect(screen.getByTestId("location")).toHaveTextContent("/checkout");
  });
});

describe("Checkout", () => {
  const rosas = makeCartProduct({ product_id: 1, product_name: "Rosas", price: 10000, amount: 2 });

  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null });
    useCartStore.setState({ cart: [rosas] });
  });
  afterEach(() => vi.restoreAllMocks());

  const llenarYPagar = async () => {
    await userEvent.type(screen.getByPlaceholderText("Tu nombre"), "Ana");
    await userEvent.type(screen.getByPlaceholderText("tu@email.com"), "ana@gmail.com");
    await userEvent.type(screen.getByPlaceholderText("Ej: Av. Providencia 1234"), "Calle 1");
    await userEvent.type(screen.getByPlaceholderText("Ej: Región Metropolitana"), "RM");
    await userEvent.type(screen.getByPlaceholderText("Ej: Providencia"), "Providencia");
    await userEvent.click(screen.getByRole("button", { name: /PAGAR/ }));
  };

  it("carrito vacío: muestra mensaje y enlace a la tienda", () => {
    useCartStore.setState({ cart: [] });
    renderWithRouter(<Checkout />, "/checkout");
    expect(screen.getByText("Tu carrito está vacío")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver a la tienda" })).toHaveAttribute("href", "/");
  });

  it("muestra el resumen de productos y el total", () => {
    renderWithRouter(<Checkout />, "/checkout");
    expect(screen.getByText("Rosas × 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /PAGAR \$20\.000/ })).toBeInTheDocument();
  });

  it("precarga los datos del usuario con sesión", () => {
    useAuthStore.setState({ user: { ...customer, address: "Av. Siempre Viva 742", region: "RM", commune: "Maipú" } });
    renderWithRouter(<Checkout />, "/checkout");
    expect(screen.getByPlaceholderText("Tu nombre")).toHaveValue("Ana");
    expect(screen.getByPlaceholderText("tu@email.com")).toHaveValue("ana@gmail.com");
    expect(screen.getByPlaceholderText("Ej: Av. Providencia 1234")).toHaveValue("Av. Siempre Viva 742");
  });

  it("formulario vacío: muestra los 5 errores y no navega", async () => {
    renderWithRouter(<Checkout />, "/checkout");
    await userEvent.click(screen.getByRole("button", { name: /PAGAR/ }));
    expect(screen.getByText("El nombre es obligatorio")).toBeInTheDocument();
    expect(screen.getByText("El correo es obligatorio")).toBeInTheDocument();
    expect(screen.getByText("La dirección es obligatoria")).toBeInTheDocument();
    expect(screen.getByText("La región es obligatoria")).toBeInTheDocument();
    expect(screen.getByText("La comuna es obligatoria")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/checkout");
  });

  it("el error de un campo desaparece al escribir en él", async () => {
    renderWithRouter(<Checkout />, "/checkout");
    await userEvent.click(screen.getByRole("button", { name: /PAGAR/ }));
    await userEvent.type(screen.getByPlaceholderText("Tu nombre"), "A");
    expect(screen.queryByText("El nombre es obligatorio")).not.toBeInTheDocument();
  });

  it("pago exitoso (random > 0.2): vacía el carrito y va a /payment-success", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9);
    renderWithRouter(<Checkout />, "/checkout");
    await llenarYPagar();
    expect(screen.getByTestId("location")).toHaveTextContent("/payment-success");
    expect(useCartStore.getState().cart).toEqual([]);
  });

  it("pago fallido (random ≤ 0.2): conserva el carrito y va a /payment-error", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.1);
    renderWithRouter(<Checkout />, "/checkout");
    await llenarYPagar();
    expect(screen.getByTestId("location")).toHaveTextContent("/payment-error");
    expect(useCartStore.getState().cart).toHaveLength(1);
  });
});

describe("PaymentSuccess", () => {
  const state = {
    form: { full_name: "Ana", email: "ana@gmail.com", address: "Calle 1", region: "RM", commune: "Providencia", notes: "Timbre 2" },
    total: 20000,
    cart: [makeCartProduct({ product_id: 1, product_name: "Rosas", price: 10000, amount: 2 })],
  };

  it("sin información de orden muestra aviso y enlace", () => {
    renderWithRouter(<PaymentSuccess />, "/payment-success");
    expect(screen.getByText("No hay información de la orden.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver a la tienda" })).toHaveAttribute("href", "/");
  });

  it("con datos muestra confirmación, entrega, productos y total", () => {
    renderWithRouter(<PaymentSuccess />, { pathname: "/payment-success", state });
    expect(screen.getByRole("heading", { name: /¡Compra realizada! #\d{5}/ })).toBeInTheDocument();
    expect(screen.getByText(/ana@gmail\.com/, { selector: "p" })).toBeInTheDocument();
    expect(screen.getByText("Calle 1")).toBeInTheDocument();
    expect(screen.getByText("Timbre 2")).toBeInTheDocument();
    expect(screen.getByText("Rosas × 2")).toBeInTheDocument();
    expect(screen.getByText("Total pagado").nextElementSibling).toHaveTextContent("$20.000");
  });

  it("oculta 'Indicaciones' si no hay notas", () => {
    renderWithRouter(<PaymentSuccess />, { pathname: "/payment-success", state: { ...state, form: { ...state.form, notes: "" } } });
    expect(screen.queryByText("Indicaciones")).not.toBeInTheDocument();
  });
});

describe("PaymentError", () => {
  it("muestra el error con número de orden y las acciones", () => {
    renderWithRouter(<PaymentError />, "/payment-error");
    expect(screen.getByRole("heading", { name: /No se pudo realizar el pago #\d{5}/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "VOLVER A LA TIENDA" })).toHaveAttribute("href", "/");
  });

  it("'VOLVER A INTENTAR' navega a /checkout", async () => {
    renderWithRouter(<PaymentError />, "/payment-error");
    await userEvent.click(screen.getByRole("button", { name: "VOLVER A INTENTAR" }));
    expect(screen.getByTestId("location")).toHaveTextContent("/checkout");
  });
});