import { useEffect, useMemo, useState } from "react";
import { useOrderStore } from "../../store/orderStore";
import { Loading } from "../../components/Loading";
import { OrderStatusBadge } from "../../components/OrderStatusBadge";
import { OrderDetailModal } from "../../components/modals/OrderDetailModal";
import { formatCLP, formatDate } from "../../utils/format";
import type { OrderStatus } from "../../types/types";

export const AdminOrders = () => {
  const { orders, loading, error, fetchAllOrders } = useOrderStore();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [status, setStatus] = useState<"ALL" | OrderStatus>("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (status === "ALL" || o.status === status) &&
        (term === "" ||
          String(o.order_id).includes(term) ||
          o.customer_name.toLowerCase().includes(term) ||
          o.customer_email.toLowerCase().includes(term)),
    );
  }, [orders, status, search]);

  // Solo las ordenes pagadas cuentan como venta
  const sold = filtered
    .filter((o) => o.status === "PAID")
    .reduce((acc, o) => acc + o.total, 0);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold uppercase">Órdenes</h1>
      <p className="mb-8 text-brown-pc/60">Boletas de compra de la tienda</p>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por n° de orden, cliente o correo"
          className="w-full rounded-lg border border-brown-pc/20 bg-white px-4 py-2 text-brown-pc outline-none transition-all focus:border-brown-pc/60 md:w-96"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "ALL" | OrderStatus)}
          className="rounded-lg border border-brown-pc/20 bg-white px-4 py-2 text-brown-pc outline-none"
        >
          <option value="ALL">Todos los estados</option>
          <option value="PAID">Pagadas</option>
          <option value="FAILED">Pago fallido</option>
        </select>
        <p className="ml-auto text-sm text-brown-pc/70">
          {filtered.length} orden(es) · Vendido: <span className="font-bold">{formatCLP(sold)}</span>
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-amber-900/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-brown-pc text-xs uppercase tracking-wider text-white">
            <tr>
              <th className="px-6 py-4 text-left">Orden</th>
              <th className="px-6 py-4 text-left">Fecha</th>
              <th className="px-6 py-4 text-left">Cliente</th>
              <th className="px-6 py-4 text-left">Total</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-left">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-900/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-brown-pc/60">
                  No hay órdenes que coincidan
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.order_id} className="transition-colors hover:bg-amber-50/50">
                  <td className="px-6 py-4 font-semibold">#{o.order_id}</td>
                  <td className="px-6 py-4 text-brown-pc/70">{formatDate(o.created_at)}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold">{o.customer_name}</p>
                    <p className="text-xs text-brown-pc/60">{o.customer_email}</p>
                  </td>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      <OrderDetailModal orderId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
};
