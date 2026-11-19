import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../../store/productStore";
import { useAuthStore } from "../../store/authStore";
import { Loading } from "../../components/Loading";
import { ProductModal } from "../../components/modals/ProductModal";
import { formatCLP } from "../../utils/format";
import type { Product, ProductForm } from "../../types/types";

const emptyForm: ProductForm = {
  product_code: "",
  product_name: "",
  price: 0,
  stock: 0,
  description: "",
  critical_stock: 0,
  image_url: "",
  category_id: 0,
};

export const AdminProducts = () => {
  const {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"edit" | "create">("edit");
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (products.length === 0) fetchProducts();
    if (categories.length === 0) fetchCategories();
  }, []);

  const toggleModal = (show: boolean) => {
    const modal = document.getElementById("modal_product") as HTMLDialogElement | null;
    if (modal) show ? modal.showModal() : modal.close();
  };

  const openEdit = (product: Product) => {
    setMode("edit");
    setSelected(product);
    setForm({
      product_code: product.product_code,
      product_name: product.product_name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      critical_stock: product.critical_stock ?? 0,
      image_url: product.image_url,
      category_id: product.category_id,
    });
    toggleModal(true);
  };

  const openCreate = () => {
    setMode("create");
    setSelected(null);
    setForm({ ...emptyForm, category_id: categories[0]?.category_id ?? 0 });
    toggleModal(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const isNumericField = ["price", "stock", "critical_stock", "category_id"].includes(name);
    setForm((prev) => ({
      ...prev,
      [name]: isNumericField ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSave = async () => {
    if (!form.product_code.trim()) return alert("El código del producto es obligatorio");
    if (!form.product_name.trim()) return alert("El nombre es obligatorio");

    setSaving(true);
    const result =
      mode === "edit"
        ? await updateProduct(selected!.product_id, form)
        : await createProduct(form);
    setSaving(false);

    if (result.success) toggleModal(false);
    else alert(result.message);
  };

  const handleDelete = async (product: Product) => {
    if (confirm(`¿Eliminar ${product.product_name}?`)) {
      const result = await deleteProduct(product.product_id);
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 font-semibold p-4">{error}</p>;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight">
            Productos
          </h1>
          <p className="text-brown-pc/60">
            {isAdmin ? "Gestión del inventario" : "Consulta del inventario"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="btn bg-amber-950 text-white hover:bg-amber-900 border-none font-semibold cursor-pointer w-full sm:w-auto"
          >
            + Nuevo producto
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-amber-900/10 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-150">
            <thead className="bg-brown-pc text-white uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/5">
              {products.map((p) => {
                const isCritical =
                  p.critical_stock !== undefined && p.stock <= p.critical_stock;
                return (
                  <tr key={p.product_id} className="hover:bg-amber-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url}
                          alt={p.product_name}
                          className="h-10 w-10 rounded-lg object-cover shrink-0 bg-gray-100"
                        />
                        <div>
                          <p className="font-semibold line-clamp-1">{p.product_name}</p>
                          <p className="text-xs text-brown-pc/50">{p.product_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold whitespace-nowrap">
                      {formatCLP(Number(p.price))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          isCritical
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {isCritical ? "⚠️ Crítico" : "OK"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-3">
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => openEdit(p)}
                            className="text-amber-800 hover:text-amber-600 font-semibold text-xs uppercase cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="text-red-500 hover:text-red-700 font-semibold text-xs uppercase cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </>
                      ) : (
                        <Link
                          to={`/product/${p.product_id}`}
                          className="text-amber-800 hover:text-amber-600 font-semibold text-xs uppercase"
                        >
                          Ver detalle
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isAdmin && (
        <ProductModal
          mode={mode}
          form={form}
          categories={categories}
          saving={saving}
          onChange={handleChange}
          onSave={handleSave}
        />
      )}
    </div>
  );
};