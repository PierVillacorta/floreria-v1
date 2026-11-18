import { useCartStore } from "../../store/cartStore";
import { makeProduct } from "../helpers";

describe("cartStore", () => {
  const rosas = makeProduct({ product_id: 1, price: 15000 });
  const tulipanes = makeProduct({ product_id: 2, product_name: "Tulipanes", price: 8000 });

  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ cart: [] });
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("addProduct agrega un producto nuevo con cantidad 1", () => {
    useCartStore.getState().addProduct(rosas);
    expect(useCartStore.getState().cart).toHaveLength(1);
    expect(useCartStore.getState().cart[0].amount).toBe(1);
  });

  it("addProduct sobre uno existente suma cantidad sin duplicar", () => {
    useCartStore.getState().addProduct(rosas);
    useCartStore.getState().addProduct(rosas);
    expect(useCartStore.getState().cart).toHaveLength(1);
    expect(useCartStore.getState().cart[0].amount).toBe(2);
  });

  it("decreaseQuantity nunca baja de 1", () => {
    useCartStore.getState().addProduct(rosas);
    useCartStore.getState().decreaseQuantity(1);
    expect(useCartStore.getState().cart[0].amount).toBe(1);
  });

  it("getTotal suma precio × cantidad y deleteProduct quita solo el indicado", () => {
    const s = useCartStore.getState();
    s.addProduct(rosas);
    s.addProduct(tulipanes);
    s.increaseQuantity(2);
    expect(useCartStore.getState().getTotal()).toBe(15000 + 8000 * 2);

    useCartStore.getState().deleteProduct(1);
    expect(useCartStore.getState().cart.map((p) => p.product_id)).toEqual([2]);
  });
});