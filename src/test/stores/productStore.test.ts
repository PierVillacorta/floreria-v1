import { useProductStore } from "../../store/productStore";
import { emptyResponse, jsonResponse, makeProduct } from "../helpers";

describe("productStore", () => {
  const p1 = makeProduct({ product_id: 1, product_name: "Rosas" });
  const p2 = makeProduct({ product_id: 2, product_name: "Tulipanes" });

  beforeEach(() => {
    useProductStore.setState({ products: [], categories: [], loading: false, error: null });
  });
  afterEach(() => vi.restoreAllMocks());

  it("fetchProducts normaliza campos nulos y guarda la lista", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse([{ ...p1, image_url: null, description: null }, p2]),
    );
    await useProductStore.getState().fetchProducts();
    const { products, loading } = useProductStore.getState();
    expect(products).toHaveLength(2);
    expect(products[0].image_url).toBe("");
    expect(products[0].description).toBe("");
    expect(loading).toBe(false);
  });

  it("createProduct añade el producto retornado por el servidor", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(p1, 201));
    const { product_id: _id, ...nuevo } = p1;
    const res = await useProductStore.getState().createProduct(nuevo);
    expect(res).toEqual({ success: true, message: "Producto creado" });
    expect(useProductStore.getState().products).toEqual([p1]);
  });

  it("updateProduct reemplaza el producto actualizado", async () => {
    useProductStore.setState({ products: [p1, p2] });
    const actualizado = { ...p1, price: 19990 };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(actualizado));
    const { product_id: _id, ...payload } = actualizado;
    const res = await useProductStore.getState().updateProduct(1, payload);
    expect(res.success).toBe(true);
    expect(useProductStore.getState().products[0].price).toBe(19990);
  });

  it("deleteProduct remueve el producto ante 204", async () => {
    useProductStore.setState({ products: [p1, p2] });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(emptyResponse(204));
    const res = await useProductStore.getState().deleteProduct(1);
    expect(res.success).toBe(true);
    expect(useProductStore.getState().products.map((p) => p.product_id)).toEqual([2]);
  });

  it("CRUD de categorías y manejo de conflicto 409 al eliminar", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      jsonResponse({ category_id: 1, category_name: "Rosas" }, 201),
    );
    expect((await useProductStore.getState().createCategory("Rosas")).success).toBe(true);

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      jsonResponse({ category_id: 1, category_name: "Rosas Premium" }),
    );
    expect((await useProductStore.getState().updateCategory(1, "Rosas Premium")).success).toBe(true);

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      jsonResponse({ detail: "Tiene 3 productos asociados" }, 409),
    );
    const delFail = await useProductStore.getState().deleteCategory(1);
    expect(delFail).toEqual({ success: false, message: "Tiene 3 productos asociados" });
  });
});