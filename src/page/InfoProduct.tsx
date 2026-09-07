import { Link, useParams } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { Products } from "../data/products";
import NotFoundPage from "./NotFoundPage";
import { useState } from "react";

const InfoProduct = () => {
  const { name } = useParams();
  const { state,dispatch } = useCart();
  const product = Products.find((product) => product.name === name);
  const [stock, setStock] = useState(product ? product.stock : 0);
  
  if (!product) {
    return (
      <section className="min-h-screen w-full bg-white-semi flex items-center justify-center px-6">
        <NotFoundPage />
      </section>
    );
  }
  const cartItem = state.cart.find(item => item.name === product?.name)
  const quantityCart =  cartItem ? cartItem.amount : 0
  const stockDisponible = product?.stock - quantityCart
  const handlePay = () => {
    if (stockDisponible > 0) {
      dispatch({
        type: "ADD-PRODUCT",
        payload: { product },
      });
      setStock(prevStock => prevStock - 1);
      return; 
    }
  };

  return (
    <section className="min-h-screen w-full bg-white-semi px-6 py-10 text-brown-pc">
      {/* Volver */}
      <div className="mx-auto mb-8 max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold
          uppercase tracking-wider text-brown-pc/60
          transition-colors duration-300 hover:text-amber-950"
        >
          ← Volver a la tienda
        </Link>
      </div>

      {/* Producto */}
      <div className="mx-auto max-w-6xl">
        <div
          className="grid overflow-hidden rounded-3xl
          bg-white shadow-sm
          md:grid-cols-2"
        >
          {/* Imagen */}
          <div className="flex min-h-[450px] items-center justify-center bg-brown-pc p-8">
            <div className="h-full w-full max-w-lg overflow-hidden rounded-2xl">
              <img
                src={product.img}
                alt={product.name}
                className="h-full w-full object-cover
                transition-transform duration-500
                hover:scale-105"
              />
            </div>
          </div>

          {/* Información */}
          <div className="flex flex-col justify-center p-8 md:p-12">
            {/* Categoría / etiqueta */}
            <p className="text-sm uppercase tracking-[0.3em] text-brown-pc/50">
              Nuestra colección
            </p>

            {/* Nombre */}
            <h1 className="mt-3 text-4xl font-bold uppercase leading-tight md:text-5xl">
              {product.name}
            </h1>

            {/* Separador */}
            <div className="mt-5 h-1 w-14 rounded-full bg-amber-950" />

            {/* Descripción */}
            <p className="mt-7 leading-relaxed text-brown-pc/70">
              {product.descripcion}
            </p>

            {/* Precio */}
            <div className="mt-8">
              <p className="text-sm uppercase tracking-wider text-brown-pc/50">
                Precio
              </p>

              <p className="mt-1 text-3xl font-bold">
                ${product.precio.toLocaleString("es-CL")}
              </p>
            </div>

            {/* Stock */}
            <div className="mt-5 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  stockDisponible > 0 ? "bg-green-600" : "bg-red-600"
                }`}
              />

              <p className="text-sm font-medium">
                {stockDisponible > 0
                  ? `${stockDisponible} disponibles`
                  : "Producto agotado"}
              </p>
            </div>

            {/* Botón */}
            <button
              onClick={handlePay}
              disabled={stockDisponible <= 0}
              className="mt-8 w-full rounded-xl bg-amber-950
              px-6 py-4 font-semibold tracking-wide text-white
              transition-all duration-300
              hover:bg-amber-900 hover:scale-[1.01]
              active:scale-95
              disabled:cursor-not-allowed
              disabled:bg-brown-pc/30"
            >
              {stock > 0 ? "AGREGAR AL CARRITO" : "AGOTADO"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoProduct;
