import { useLocation, Link, useNavigate } from "react-router-dom";
import type { Order } from "../../types/types";
import { formatCLP } from "../../utils/format";

export const PaymentError = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = (state as { order?: Order } | null)?.order;

  // Al reintentar devolvemos al checkout los datos que el cliente ya había escrito
  const retry = () => {
    navigate("/checkout", {
      state: order
        ? {
            form: {
              full_name: order.customer_name,
              email: order.customer_email,
              address: order.address,
              region: order.region,
              commune: order.commune,
              notes: order.notes ?? "",
            },
          }
        : undefined,
    });
  };

  return (
    <section className="min-h-screen w-full bg-white-semi text-brown-pc px-6 py-10">
      <div className="mx-auto max-w-2xl text-center">

        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold uppercase">
          No se pudo realizar el pago{order ? ` #${order.order_id}` : ""}
        </h1>
        <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-red-500" />
        <p className="mt-4 text-brown-pc/60">
          Hubo un problema al procesar tu pago. No se realizó ningún cobro y tu carrito sigue intacto.
        </p>
        {order && (
          <p className="mt-2 text-sm text-brown-pc/60">
            Monto del intento: <span className="font-semibold">{formatCLP(order.total)}</span>
          </p>
        )}

        <div className="mt-10 flex flex-col gap-4">
          <button
            onClick={retry}
            className="w-full rounded-xl bg-amber-950 px-6 py-4 font-semibold
              text-white transition-all duration-300
              hover:bg-amber-900 hover:scale-[1.01] active:scale-95 cursor-pointer"
          >
            VOLVER A INTENTAR
          </button>

          <Link
            to="/"
            className="w-full rounded-xl border border-brown-pc/20 px-6 py-4
              font-semibold text-brown-pc transition-all duration-300
              hover:bg-brown-pc/5 text-center"
          >
            VOLVER A LA TIENDA
          </Link>
        </div>
      </div>
    </section>
  );
};
