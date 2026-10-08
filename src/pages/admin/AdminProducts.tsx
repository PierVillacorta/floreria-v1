import { useEffect, useState } from "react";
import { useProductStore } from "../../store/productStore";
import { Loading } from "../../components/Loading";
import { ProductModal } from "../../components/modals/ProductModal";
import type { Product, ProductForm } from "../../types/types";

const emptyForm: ProductForm = {
  product_name: "", price: 0, stock: 0, description: "", critical_stock: 0, image_url: "", category_id: 0,
};

export const AdminProducts = () => {
  const { products, categories, loading, error, fetchProducts, fetchCategories, createProduct, updateProduct, deleteProduct } = useProductStore();
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"edit" | "create">("edit");

  useEffect(() => {
    if (products.length === 0) fetchProducts();
    if (categories.length === 0) fetchCategories();
  }, []);

  const toggleModal = (show: boolean) => {
    const modal = document.getElementById("modal_product") as HTMLDialogElement;
    if (modal) show ? modal.showModal() : modal.close();
  };

  const openEdit = (product: Product) => {
    setMode("edit");
    setSelected(product);
    setForm({
      product_name: product.product_name, price: product.price, stock: product.stock,
      description: product.description, critical_stock: product.critical_stock ?? 0,
      image_url: product.image_url, category_id: Number(product.category_id),
    });
    toggleModal(true);
  };

  const openCreate = () => {
    setMode("create");
    setSelected(null);
    setForm({ ...emptyForm, category_id: Number(categories[0]?.category_id ?? 0) });
    toggleModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["price", "stock", "critical_stock", "category_id"].includes(name) ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    if (!form.product_name.trim()) return alert("El nombre es obligatorio");
    setSaving(true);
    const result = mode === "edit" ? await updateProduct(selected!.product_id, form) : await createProduct(form as any);
    setSaving(false);
    if (result.success) toggleModal(false);
    else alert(result.message);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar este producto?")) {
      const result = await deleteProduct(id);
      if (!result.success) alert(result.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase mb-2">Productos</h1>
          <p className="text-brown-pc/60">Gestión del inventario</p>
        </div>
        <button onClick={openCreate} className="btn bg-amber-950 text-white hover:bg-amber-900 border-none font-semibold cursor-pointer">
          + Nuevo producto
        </button>
      </div>

      <div className="rounded-2xl border border-amber-900/10 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brown-pc text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Producto</th>
              <th className="px-6 py-4 text-left">Precio</th>
              <th className="px-6 py-4 text-left">Stock</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-900/5">
            {products.map((p) => {
              const isCritical = p.critical_stock !== undefined && p.stock <= p.critical_stock;
              return (
                <tr key={p.product_id} className="hover:bg-amber-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image_url} alt={p.product_name} className="h-10 w-10 rounded-lg object-cover" />
                      <p className="font-semibold">{p.product_name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">${p.price.toLocaleString("es-CL")}</td>
                  <td className="px-6 py-4">{p.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${isCritical ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {isCritical ? "⚠️ Crítico" : "OK"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button onClick={() => openEdit(p)} className="text-amber-800 hover:text-amber-600 font-semibold text-xs uppercase cursor-pointer">Editar</button>
                    <button onClick={() => handleDelete(p.product_id)} className="text-red-500 hover:text-red-700 font-semibold text-xs uppercase cursor-pointer">Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ProductModal mode={mode} form={form} categories={categories} saving={saving} onChange={handleChange} onSave={handleSave} />
    </div>
  );
};