import { useCartStore } from "../store/cartStore";
import { makeProduct } from "./helpers";

describe("cartStore", () => {
  const rosas = makeProduct({ product_id: 1, price: 15000 });
  const tulipanes = makeProduct({ product_id: 2, product_name: "Tulipanes", price: 8000 });

  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ cart: [] });
  });

  it("inicia vacío con total 0", () => {
    expect(useCartStore.getState().cart).toEqual([]);
    expect(useCartStore.getState().getTotal()).toBe(0);
  });

  it("addProduct agrega un producto nuevo con amount 1", () => {
    useCartStore.getState().addProduct(rosas);
    expect(useCartStore.getState().cart).toHaveLength(1);
    expect(useCartStore.getState().cart[0].amount).toBe(1);
  });

  it("addProduct sobre un producto existente suma cantidad sin duplicar", () => {
    useCartStore.getState().addProduct(rosas);
    useCartStore.getState().addProduct(rosas);
    expect(useCartStore.getState().cart).toHaveLength(1);
    expect(useCartStore.getState().cart[0].amount).toBe(2);
  });

  it("increaseQuantity y decreaseQuantity modifican la cantidad", () => {
    const s = useCartStore.getState();
    s.addProduct(rosas);
    s.increaseQuantity(1);
    expect(useCartStore.getState().cart[0].amount).toBe(2);
    s.decreaseQuantity(1);
    expect(useCartStore.getState().cart[0].amount).toBe(1);
  });

  it("decreaseQuantity nunca baja de 1", () => {
    const s = useCartStore.getState();
    s.addProduct(rosas);
    s.decreaseQuantity(1);
    expect(useCartStore.getState().cart[0].amount).toBe(1);
  });

  it("deleteProduct elimina solo el producto indicado", () => {
    const s = useCartStore.getState();
    s.addProduct(rosas);
    s.addProduct(tulipanes);
    s.deleteProduct(1);
    expect(useCartStore.getState().cart.map((p) => p.product_id)).toEqual([2]);
  });

  it("getTotal suma precio × cantidad", () => {
    const s = useCartStore.getState();
    s.addProduct(rosas);
    s.addProduct(rosas);
    s.addProduct(tulipanes);
    expect(useCartStore.getState().getTotal()).toBe(38000);
  });

  it("clearCart vacía el carrito", () => {
    useCartStore.getState().addProduct(rosas);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().cart).toEqual([]);
  });

  it("persiste en localStorage con la clave 'floreria-cart'", () => {
    useCartStore.getState().addProduct(rosas);
    expect(JSON.parse(localStorage.getItem("floreria-cart")!).state.cart).toHaveLength(1);
  });
});