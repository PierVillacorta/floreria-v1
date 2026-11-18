import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Cart } from "../../pages/Cart";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { renderWithRouter, makeCartProduct } from "../helpers";

describe("Cart", () => {
  const rosas = makeCartProduct({ product_id: 1, product_name: "Rosas", price: 10000, amount: 1 });
  const tulipanes = makeCartProduct({ product_id: 2, product_name: "Tulipanes", price: 5000, amount: 2 });

  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ cart: [] });
    useAuthStore.setState({ user: null, token: null });
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("carrito vacío: muestra 'No hay productos' y oculta PAGAR", () => {
    renderWithRouter(<Cart />, "/cart");
    expect(screen.getByText("No hay productos")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "PAGAR" })).not.toBeInTheDocument();
  });

  it("muestra un ítem por producto y el total", () => {
    useCartStore.setState({ cart: [rosas, tulipanes] });
    renderWithRouter(<Cart />, "/cart");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("$20.000")).toBeInTheDocument();
  });

  it("el botón + aumenta la cantidad", async () => {
    useCartStore.setState({ cart: [rosas] });
    renderWithRouter(<Cart />, "/cart");
    await userEvent.click(screen.getByRole("button", { name: "+" }));
    expect(useCartStore.getState().cart[0].amount).toBe(2);
  });

  it("PAGAR sin sesión avisa y redirige a /login", async () => {
    useCartStore.setState({ cart: [rosas] });
    renderWithRouter(<Cart />, "/cart");
    await userEvent.click(screen.getByRole("button", { name: "PAGAR" }));
    expect(window.alert).toHaveBeenCalled();
    expect(screen.getByTestId("location")).toHaveTextContent("/login");
  });
});