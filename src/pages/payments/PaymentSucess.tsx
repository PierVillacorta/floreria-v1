import { useLocation, Link } from "react-router-dom";
import type { Order } from "../../types/types";
import { formatCLP } from "../../utils/format";

export const PaymentSuccess = () => {
  const { state } = useLocation();
  // La orden llega desde el checkout: es la respuesta real del servidor
  const order = (state as { order?: Order } | null)?.order;

  if (!order) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-white-semi text-brown-pc">
        <p className="text-xl font-bold">No hay información de la orden.</p>
        <Link to="/" className="mt-4 text-amber-950 font-semibold hover:underline">
          Volver a la tienda
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full bg-white-semi text-brown-pc px-6 py-10">
      <div className="mx-auto max-w-2xl">

        {/* Cabecera */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold uppercase">
            ¡Compra realizada! #{order.order_id}
          </h1>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-amber-950" />
          <p className="mt-4 text-brown-pc/60">
            Te enviaremos la confirmación a {order.customer_email}
          </p>
        </div>

        {/* Datos de entrega */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm mb-6">
          <h2 className="font-bold uppercase mb-4">Datos de entrega</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-brown-pc/60">Nombre</span>
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
        </div>

        {/* Productos */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm mb-6">
          <h2 className="font-bold uppercase mb-4">Productos comprados</h2>
          <ul className="flex flex-col gap-2">
            {order.items.map((item) => (
              <li key={item.product_id} className="flex justify-between text-sm">
                <span>{item.product_name} × {item.quantity}</span>
                <span className="font-semibold">{formatCLP(item.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="h-px bg-brown-pc/10 my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total pagado</span>
            <span>{formatCLP(order.total)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            to="/my-orders"
            className="block w-full text-center rounded-xl border border-brown-pc/20 px-6 py-4
              font-semibold text-brown-pc transition-all duration-300 hover:bg-brown-pc/5"
          >
            VER MIS COMPRAS
          </Link>
          <Link
            to="/"
            className="block w-full text-center rounded-xl bg-amber-950 px-6 py-4
              font-semibold text-white transition-all duration-300
              hover:bg-amber-900 hover:scale-[1.01] active:scale-95"
          >
            VOLVER A LA TIENDA
          </Link>
        </div>
      </div>
    </section>
  );
};
