import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "../../components/ProductCard";
import { useCartStore } from "../../store/cartStore";
import { renderWithRouter, makeProduct } from "../helpers";

describe("ProductCard", () => {
  const product = makeProduct({
    product_id: 7,
    product_name: "Orquídea",
    price: 22000,
    description: "Planta de interior",
  });

  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ cart: [] });
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("muestra nombre, descripción y precio recibidos por props", () => {
    renderWithRouter(<ProductCard product={product} />);
    expect(screen.getByRole("heading", { name: "Orquídea" })).toBeInTheDocument();
    expect(screen.getByText("Planta de interior")).toBeInTheDocument();
    expect(screen.getByText("$22000")).toBeInTheDocument();
  });

  it("el enlace 'Ver producto' apunta al detalle", () => {
    renderWithRouter(<ProductCard product={product} />);
    expect(screen.getByRole("link", { name: "Ver producto" })).toHaveAttribute("href", "/product/7");
  });

  it("click en 'Agregar al carro' deja el producto en el carrito", async () => {
    renderWithRouter(<ProductCard product={product} />);
    await userEvent.click(screen.getByRole("button", { name: "Agregar al carro" }));
    expect(useCartStore.getState().cart).toHaveLength(1);
    expect(useCartStore.getState().cart[0].product_name).toBe("Orquídea");
  });
});