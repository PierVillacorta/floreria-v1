import { useLocation, Link } from "react-router-dom";
import type { CartProduct } from "../../types/types";

type LocationState = {
  form: { full_name: string; email: string; address: string; region: string; commune: string; notes: string };
  total: number;
  cart: CartProduct[];
};

export const PaymentSuccess = () => {
  const { state } = useLocation();
  const { form, total, cart } = (state as LocationState) ?? {};

  // generar un numero aleatorio
  const orderNumber = Math.floor(Math.random() * 90000) + 10000;

  if (!form) {
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
            ¡Compra realizada! #{orderNumber}
          </h1>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-amber-950" />
          <p className="mt-4 text-brown-pc/60">
            Te enviaremos la confirmación a {form.email}
          </p>
        </div>

        {/* Datos del cliente */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm mb-6">
          <h2 className="font-bold uppercase mb-4">Datos de entrega</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-brown-pc/60">Nombre</span>
            <span className="font-semibold">{form.full_name}</span>
            <span className="text-brown-pc/60">Correo</span>
            <span className="font-semibold">{form.email}</span>
            <span className="text-brown-pc/60">Dirección</span>
            <span className="font-semibold">{form.address}</span>
            <span className="text-brown-pc/60">Región</span>
            <span className="font-semibold">{form.region}</span>
            <span className="text-brown-pc/60">Comuna</span>
            <span className="font-semibold">{form.commune}</span>
            {form.notes && (
              <>
                <span className="text-brown-pc/60">Indicaciones</span>
                <span className="font-semibold">{form.notes}</span>
              </>
            )}
          </div>
        </div>

        {/* Productos */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm mb-6">
          <h2 className="font-bold uppercase mb-4">Productos comprados</h2>
          <ul className="flex flex-col gap-2">
            {cart.map((p) => (
              <li key={p.product_id} className="flex justify-between text-sm">
                <span>{p.product_name} × {p.amount}</span>
                <span className="font-semibold">
                  ${(p.price * p.amount).toLocaleString("es-CL")}
                </span>
              </li>
            ))}
          </ul>
          <div className="h-px bg-brown-pc/10 my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total pagado</span>
            <span>${total.toLocaleString("es-CL")}</span>
          </div>
        </div>

        <Link
          to="/"
          className="block w-full text-center rounded-xl bg-amber-950 px-6 py-4
            font-semibold text-white transition-all duration-300
            hover:bg-amber-900 hover:scale-[1.01] active:scale-95"
        >
          VOLVER A LA TIENDA
        </Link>
      </div>
    </section>
  );
};

