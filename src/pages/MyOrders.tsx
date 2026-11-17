import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useOrderStore } from "../store/orderStore";
import { Loading } from "../components/Loading";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { OrderDetailModal } from "../components/modals/OrderDetailModal";
import { formatCLP, formatDate } from "../utils/format";

export const MyOrders = () => {
  const { user } = useAuthStore();
  const { orders, loading, error, fetchMyOrders } = useOrderStore();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (user) fetchMyOrders();
  }, [user, fetchMyOrders]);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <Loading />;
  if (error) return <p className="mt-32 text-center text-red-500">{error}</p>;

  return (
    <section className="min-h-screen w-full bg-white-semi px-6 py-10 text-brown-pc">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-brown-pc/60">Historial</p>
          <h1 className="mt-2 text-4xl font-bold uppercase">Mis compras</h1>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-amber-950" />
        </header>

        {orders.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center">
            <p className="text-2xl font-semibold uppercase">Aún no tienes compras</p>
            <Link to="/" className="mt-6 font-semibold text-amber-950 hover:underline">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-amber-900/10 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-brown-pc text-xs uppercase tracking-wider text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Orden</th>
                  <th className="px-6 py-4 text-left">Fecha</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-left">Estado</th>
                  <th className="px-6 py-4 text-left">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/5">
                {orders.map((o) => (
                  <tr key={o.order_id} className="transition-colors hover:bg-amber-50/50">
                    <td className="px-6 py-4 font-semibold">#{o.order_id}</td>
                    <td className="px-6 py-4 text-brown-pc/70">{formatDate(o.created_at)}</td>
                    <td className="px-6 py-4 font-semibold">{formatCLP(o.total)}</td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedId(o.order_id)}
                        className="cursor-pointer text-xs font-semibold uppercase text-amber-800 hover:text-amber-600"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderDetailModal orderId={selectedId} onClose={() => setSelectedId(null)} />
    </section>
  );
};
