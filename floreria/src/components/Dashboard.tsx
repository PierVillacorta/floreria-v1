import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/productStore";

export const Dashboard = () => {
  const { products, categories, fetchProducts, fetchCategories } = useProductStore();

  useEffect(() => {
    if (products.length === 0) fetchProducts();
    if (categories.length === 0) fetchCategories();
  }, []);

  const lowStock = products.filter(
    (p) => p.critical_stock !== undefined && p.stock <= p.critical_stock
  );

  const stats = [
    { label: "Productos",   value: products.length,   icon: "🌷", to: "/admin/products" },
    { label: "Categorías",  value: categories.length, icon: "🗂️", to: "/admin/products" },
    { label: "Stock crítico", value: lowStock.length,  icon: "⚠️", to: "/admin/products" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold uppercase mb-2">Dashboard</h1>
      <p className="text-brown-pc/60 mb-8">Resumen general de la tienda</p>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map(({ label, value, icon, to }) => (
          <Link
            key={label}
            to={to}
            className="rounded-2xl border border-amber-900/10 bg-white p-6
              shadow-sm hover:shadow-md hover:-translate-y-1
              transition-all duration-300"
          >
            <div className="text-4xl mb-3">{icon}</div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm text-brown-pc/60 uppercase tracking-wider mt-1">
              {label}
            </p>
          </Link>
        ))}
      </div>

      {/* Productos con stock crítico */}
      {lowStock.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-bold uppercase text-red-700 mb-4">
            ⚠️ Productos con stock crítico
          </h2>
          <ul className="flex flex-col gap-2">
            {lowStock.map((p) => (
              <li
                key={p.product_id}
                className="flex justify-between text-sm text-red-700"
              >
                <span>{p.product_name}</span>
                <span className="font-bold">
                  Stock: {p.stock} (mínimo: {p.critical_stock})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
