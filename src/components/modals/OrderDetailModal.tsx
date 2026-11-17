import { useEffect, useState } from "react";
import { useOrderStore } from "../../store/orderStore";
import { OrderStatusBadge } from "../OrderStatusBadge";
import { formatCLP, formatDate } from "../../utils/format";
import type { Order } from "../../types/types";

type OrderProps = {
  orderId: number | null; 
  onClose: () => void;
};

export const OrderDetailModal = ({ orderId, onClose }: OrderProps) => {
  const { fetchOrder } = useOrderStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId === null) return;

    // "cancelled" evita pintar una respuesta vieja si el usuario abre otra orden rápido
    let cancelled = false;
    setOrder(null);
    setError(null);

    fetchOrder(orderId).then((result) => {
      if (cancelled) return;
      if (result.success) setOrder(result.data);
      else setError(result.message);
    });

    return () => {
      cancelled = true;
    };
  }, [orderId, fetchOrder]);

  if (orderId === null) return null;

  return (
    <div className="modal modal-open" onClick={onClose}>
      <div
        className="modal-box bg-white text-brown-pc max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg uppercase">Orden #{orderId}</h3>
          {order && <OrderStatusBadge status={order.status} />}
        </div>

        {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
        {!order && !error && <p className="text-brown-pc/60 text-sm">Cargando...</p>}

        {order && (
          <>
            <p className="text-xs text-brown-pc/50 mb-5">{formatDate(order.created_at)}</p>

            <div className="grid grid-cols-2 gap-2 text-sm mb-6">
              <span className="text-brown-pc/60">Cliente</span>
              <span className="font-semibold">{order.customer_name}</span>
              <span className="text-brown-pc/60">Correo</span>
              <span className="font-semibold">{order.customer_email}</span>
              <span className="text-brown-pc/60">Dirección</span>
              <span className="font-semibold">{order.address}</span>
              <span className="text-brown-pc/60">Región</span>
              <span className="font-semibold">{order.region}</span>
              <span className="text-brown-pc/60">Comuna</span>
              <span className="font-semibold">{order.commune}</span>
              {order.notes && (
                <>
                  <span className="text-brown-pc/60">Indicaciones</span>
                  <span className="font-semibold">{order.notes}</span>
                </>
              )}
            </div>

            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-brown-pc/60">
                <tr>
                  <th className="py-2 text-left">Producto</th>
                  <th className="py-2 text-right">Cant.</th>
                  <th className="py-2 text-right">Precio</th>
                  <th className="py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/5">
                {order.items.map((item) => (
                  <tr key={item.product_id}>
                    <td className="py-2">{item.product_name}</td>
                    <td className="py-2 text-right">{item.quantity}</td>
                    <td className="py-2 text-right">{formatCLP(item.unit_price)}</td>
                    <td className="py-2 text-right font-semibold">{formatCLP(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-brown-pc/20">
                  <td colSpan={3} className="pt-3 text-right font-bold uppercase">Total</td>
                  <td className="pt-3 text-right text-lg font-bold">{formatCLP(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </>
        )}

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
