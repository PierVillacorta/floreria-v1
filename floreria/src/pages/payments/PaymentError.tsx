import { useLocation, Link, useNavigate } from "react-router-dom";

export const PaymentError = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderNumber = Math.floor(Math.random() * 90000) + 10000;

  return (
    <section className="min-h-screen w-full bg-white-semi text-brown-pc px-6 py-10">
      <div className="mx-auto max-w-2xl text-center">

        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold uppercase">
          No se pudo realizar el pago #{orderNumber}
        </h1>
        <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-red-500" />
        <p className="mt-4 text-brown-pc/60">
          Hubo un problema al procesar tu pago. No se realizó ningún cobro.
        </p>

        <div className="mt-10 flex flex-col gap-4">
          <button
            onClick={() => navigate("/checkout", { state })}
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
