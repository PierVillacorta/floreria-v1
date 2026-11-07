import { useProductStore } from "../store/productStore";
import { jsonResponse, makeProduct } from "./helpers";

const fetchSeq = (...bodies: unknown[]) => {
  const spy = vi.spyOn(globalThis, "fetch");
  bodies.forEach((b) => spy.mockResolvedValueOnce(jsonResponse(b)));
  return spy;
};

describe("productStore (fetch mockeado)", () => {
  const p1 = makeProduct({ product_id: 1, product_name: "Rosas" });
  const p2 = makeProduct({ product_id: 2, product_name: "Tulipanes" });

  beforeEach(() => {
    useProductStore.setState({ products: [], categories: [], loading: false, error: null });
  });
  afterEach(() => vi.restoreAllMocks());

  it("fetchProducts guarda los productos y apaga loading", async () => {
    fetchSeq({ items: [p1, p2] });
    await useProductStore.getState().fetchProducts();
    expect(useProductStore.getState().products).toHaveLength(2);
    expect(useProductStore.getState().loading).toBe(false);
  });

  it("fetchProducts guarda un error si falla la red", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("down"));
    await useProductStore.getState().fetchProducts();
    expect(useProductStore.getState().error).toBe("No se pudieron cargar los productos");
    expect(useProductStore.getState().loading).toBe(false);
  });

  it("fetchCategories guarda las categorías", async () => {
    fetchSeq({ items: [{ category_id: 1, category_name: "Rosas" }] });
    await useProductStore.getState().fetchCategories();
    expect(useProductStore.getState().categories).toEqual([{ category_id: 1, category_name: "Rosas" }]);
  });

  it("fetchCategories guarda un error si falla la red", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("down"));
    await useProductStore.getState().fetchCategories();
    expect(useProductStore.getState().error).toBe("No se pudieron cargar las categorias");
  });

  it("createProduct OK vuelve a pedir la lista de productos", async () => {
    const spy = fetchSeq({ status: "OK" }, { items: [p1] });
    const { product_id: _id, ...nuevo } = p1;
    const res = await useProductStore.getState().createProduct(nuevo);
    expect(res).toEqual({ success: true, message: "Producto Creado" });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(useProductStore.getState().products).toHaveLength(1);
  });

  it("createProduct informa error si el status no es OK", async () => {
    fetchSeq({ status: "ERROR" });
    const { product_id: _id, ...nuevo } = p1;
    const res = await useProductStore.getState().createProduct(nuevo);
    expect(res).toEqual({ success: false, message: "No se pudo crear" });
  });

  it("updateProduct actualiza solo el producto indicado", async () => {
    useProductStore.setState({ products: [p1, p2] });
    fetchSeq({ status: "OK" });
    const res = await useProductStore.getState().updateProduct(1, { price: 999 });
    expect(res.success).toBe(true);
    expect(useProductStore.getState().products.find((p) => p.product_id === 1)?.price).toBe(999);
    expect(useProductStore.getState().products.find((p) => p.product_id === 2)?.price).toBe(15000);
  });

  it("updateProduct informa error si falla", async () => {
    fetchSeq({ status: "ERROR" });
    const res = await useProductStore.getState().updateProduct(1, { price: 1 });
    expect(res).toEqual({ success: false, message: "No se pudo actualizar" });
  });

  it("deleteProduct elimina el producto de la lista", async () => {
    useProductStore.setState({ products: [p1, p2] });
    fetchSeq({ status: "OK" });
    const res = await useProductStore.getState().deleteProduct(1);
    expect(res.success).toBe(true);
    expect(useProductStore.getState().products.map((p) => p.product_id)).toEqual([2]);
  });

  it("deleteProduct no modifica la lista si falla", async () => {
    useProductStore.setState({ products: [p1] });
    fetchSeq({ status: "ERROR" });
    const res = await useProductStore.getState().deleteProduct(1);
    expect(res.success).toBe(false);
    expect(useProductStore.getState().products).toHaveLength(1);
  });

  it("updateCategory renombra la categoría en el store", async () => {
    useProductStore.setState({ categories: [{ category_id: 1, category_name: "Viejo" }] });
    fetchSeq({ status: "OK" });
    const res = await useProductStore.getState().updateCategory(1, "Nuevo");
    expect(res.success).toBe(true);
    expect(useProductStore.getState().categories[0].category_name).toBe("Nuevo");
  });

  it("deleteCategory informa cuántos productos la usan (HAS_PRODUCTS)", async () => {
    useProductStore.setState({ categories: [{ category_id: 1, category_name: "Rosas" }] });
    fetchSeq({ status: "HAS_PRODUCTS", count: 3 });
    const res = await useProductStore.getState().deleteCategory(1);
    expect(res.success).toBe(false);
    expect(res.message).toContain("3 producto(s)");
    expect(useProductStore.getState().categories).toHaveLength(1);
  });

  it("deleteCategory OK la quita del store", async () => {
    useProductStore.setState({ categories: [{ category_id: 1, category_name: "Rosas" }] });
    fetchSeq({ status: "OK" });
    const res = await useProductStore.getState().deleteCategory(1);
    expect(res).toEqual({ success: true, message: "Categoría eliminada" });
    expect(useProductStore.getState().categories).toHaveLength(0);
  });

  it("deleteCategory maneja error de red", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("x"));
    const res = await useProductStore.getState().deleteCategory(1);
    expect(res).toEqual({ success: false, message: "Error de conexión" });
  });
});