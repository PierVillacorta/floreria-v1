import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../../store/productStore";
import { Loading } from "../../components/ui/Loading";

const AdminProducts = () => {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase mb-2">Productos</h1>
          <p className="text-brown-pc/60">Gestión del inventario</p>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-900/10 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brown-pc text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Producto</th>
              <th className="px-6 py-4 text-left">Precio</th>
              <th className="px-6 py-4 text-left">Stock</th>
              <th className="px-6 py-4 text-left">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-900/5">
            {products.map((p) => {
              const isCritical =
                p.critical_stock !== undefined && p.stock <= p.critical_stock;
              return (
                <tr
                  key={p.product_id}
                  className="hover:bg-amber-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image_url}
                        alt={p.product_name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold">{p.product_name}</p>
                        <Link
                          to={`/product/${p.product_id}`}
                          className="text-xs text-amber-800 hover:underline"
                        >
                          Ver en tienda
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ${p.price.toLocaleString("es-CL")}
                  </td>
                  <td className="px-6 py-4">{p.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                        ${isCritical
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                        }`}
                    >
                      {isCritical ? "⚠️ Crítico" : "OK"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;