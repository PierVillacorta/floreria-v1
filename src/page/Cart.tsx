import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const Cart = () => {
  const { state, dispatch } = useCart();

  const isCartEmpty = state.cart.length === 0;

  const total = state.cart.reduce(
    (acc, product) => acc + product.precio * product.amount,
    0,
  );

  return (
    <section className="min-h-screen w-full bg-white-semi px-6 py-10 text-brown-pc">
      {/* Volver */}
      <Link
        to="/"
        className="absolute right-10 top-6 text-3xl font-bold hover:text-amber-900 transition-colors duration-300"
      >
        &lt;-
      </Link>

      <div className="mx-auto w-full max-w-4xl">
        {/* Título */}
        <header className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-brown-pc/60">
            Tu selección
          </p>

          <h1 className="mt-2 text-4xl font-bold uppercase">Carrito</h1>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-amber-950" />
        </header>

        {isCartEmpty ? (
          /* Carrito vacío */
          <div className="flex min-h-[50vh] flex-col items-center justify-center">
            <p className="text-2xl font-semibold uppercase">No hay productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_300px]">
            {/* Productos */}
            <div>
              <h2 className="mb-5 text-xl font-bold uppercase">
                Lista de tus productos
              </h2>

              <ul className="flex flex-col gap-4">
                {state.cart.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center gap-4 rounded-2xl
                               bg-brown-pc p-4 text-white
                               shadow-sm
                               hover:shadow-md
                               transition-shadow duration-300"
                  >
                    {/* Imagen */}
                    <img
                      className="h-20 w-20 rounded-xl object-cover"
                      alt={product.name}
                      src={product.img}
                    />

                    {/* Información */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-bold uppercase">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-sm text-white/70">
                        Precio: ${product.precio}
                      </p>

                      <p className="text-sm text-white/70">
                        Cantidad: {product.amount}
                      </p>

                      <p className="mt-1 font-semibold">
                        Total: ${product.precio * product.amount}
                      </p>
                    </div>

                    {/* Eliminar */}
                    <button
                      onClick={() =>
                        dispatch({
                          type: "DELETE-PRODUCT",
                          payload: { id: product.id },
                        })
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center
                                 rounded-full
                                 text-2xl text-white/70
                                 hover:bg-white/10
                                 hover:text-white
                                 transition-all duration-300"
                      aria-label={`Eliminar ${product.name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resumen */}
            <aside className="h-fit rounded-2xl bg-amber-50/70 border border-amber-900/10 p-6 shadow-sm mt-11">
              <h2 className="text-xl font-bold uppercase">Resumen</h2>

              <div className="my-5 h-px bg-brown-pc/10" />

              <div className="flex justify-between text-sm">
                <span>Productos</span>
                <span>{state.cart.length}</span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="font-semibold">Total</span>

                <span className="text-xl font-bold">${total}</span>
              </div>

              <button
                className="mt-6 w-full rounded-lg bg-amber-950 px-5 py-3 font-semibold text-white
              hover:bg-amber-900 hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                PAGAR
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
