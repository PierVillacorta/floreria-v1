import type { OrderStatus } from "../types/types";

const styles: Record<OrderStatus, string> = {
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
};

const labels: Record<OrderStatus, string> = {
  PAID: "Pagada",
  FAILED: "Pago fallido",
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${styles[status]}`}>
    {labels[status]}
  </span>
);
