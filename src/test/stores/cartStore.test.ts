import { useCartStore } from "../../store/cartStore";
import { makeProduct } from "../helpers";

describe("cartStore", () => {
  const rosas = makeProduct({ product_id: 1, price: 15000, stock: 2 });
  const tulipanes = makeProduct({ product_id: 2, product_name: "Tulipanes", price: 8000, stock: 5 });

  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ cart: [] });
  });

  it("agrega productos y respeta el stock máximo", () => {
    expect(useCartStore.getState().addProduct(rosas).success).toBe(true);
    expect(useCartStore.getState().addProduct(rosas).success).toBe(true);
    expect(useCartStore.getState().addProduct(rosas)).toEqual({
      success: false,
      message: "Alcanzaste el stock máximo disponible",
    });
    expect(useCartStore.getState().cart[0].amount).toBe(2);
  });

  it("no agrega productos sin stock", () => {
    const agotado = makeProduct({ product_id: 9, stock: 0 });
    expect(useCartStore.getState().addProduct(agotado).success).toBe(false);
    expect(useCartStore.getState().cart).toHaveLength(0);
  });

  it("increaseQuantity y decreaseQuantity respetan límites (1 .. stock)", () => {
    const s = useCartStore.getState();
    s.addProduct(rosas);
    s.increaseQuantity(1);
    s.increaseQuantity(1); // stock máximo es 2
    expect(useCartStore.getState().cart[0].amount).toBe(2);

    s.decreaseQuantity(1);
    s.decreaseQuantity(1); // mínimo es 1
    expect(useCartStore.getState().cart[0].amount).toBe(1);
  });

  it("calcula total, elimina ítems, vacía y persiste en localStorage", () => {
    const s = useCartStore.getState();
    s.addProduct(rosas);
    s.addProduct(tulipanes);
    expect(useCartStore.getState().getTotal()).toBe(23000);
    expect(JSON.parse(localStorage.getItem("floreria-cart")!).state.cart).toHaveLength(2);

    s.deleteProduct(1);
    expect(useCartStore.getState().cart.map((p) => p.product_id)).toEqual([2]);

    s.clearCart();
    expect(useCartStore.getState().cart).toEqual([]);
  });
});