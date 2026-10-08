import { Link, Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import { useCartStore } from "../store/cartStore";
import { useProductStore } from "../store/productStore";
import { Loading } from "../components/Loading";

export const InfoProduct = () => {
  const { product_id } = useParams();
  const { cart, addProduct } = useCartStore();
  const { products, loading, fetchProducts } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, []);

  if (loading) return <Loading />;

  const prdId = Number(product_id);
  const product = products.find((p) => p.product_id === prdId);

  if (!loading && products.length > 0 && !product) {
    return <Navigate to="/not-found" replace />;
  }

  if(!product) return <Loading/>

  const cartItem = cart.find((item) => item.product_id === product.product_id);
  const quantityCart = cartItem ? cartItem.amount : 0;
  const stockDisponible = product.stock - quantityCart;

  const handlePay = () => {
    if (stockDisponible > 0) {
      addProduct(product);
    }
  };

  return (
    <section className="min-h-screen w-full bg-white-semi px-6 py-10 text-brown-pc">
      {/* Producto */}
      <div className="mx-auto max-w-6xl">
        <div className="grid overflow-hidden rounded-3xl bg-white shadow-sm md:grid-cols-2">
          {/* Imagen */}
          <div className="flex min-h-112.5 items-center justify-center bg-brown-pc p-8">
            <div className="h-full w-full max-w-lg overflow-hidden rounded-2xl">
              <img
                src={product.image_url}
                alt={product.product_name}
                className="h-full w-full object-cover
                  transition-transform duration-500
                  hover:scale-105"
              />
            </div>
          </div>

          {/* Información */}
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="text-sm uppercase tracking-[0.3em] text-brown-pc/50">
              Nuestra colección
            </p>

            <h1 className="mt-3 text-4xl font-bold uppercase leading-tight md:text-5xl">
              {product.product_name}
            </h1>

            <div className="mt-5 h-1 w-14 rounded-full bg-amber-950" />

            <p className="mt-7 leading-relaxed text-brown-pc/70">
              {product.description}
            </p>

            <div className="mt-8">
              <p className="text-sm uppercase tracking-wider text-brown-pc/50">
                Precio
              </p>
              <p className="mt-1 text-3xl font-bold">
                ${product.price.toLocaleString("es-CL")}
              </p>
            </div>

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

            <button
              onClick={handlePay}
              disabled={stockDisponible <= 0}
              className="mt-8 w-full rounded-xl bg-amber-950 px-6 py-4
                font-semibold tracking-wide text-white
                transition-all duration-300
                hover:bg-amber-900 hover:scale-[1.01]
                active:scale-95
                disabled:cursor-not-allowed
                disabled:bg-brown-pc/30"
            >
              {stockDisponible > 0 ? "AGREGAR AL CARRITO" : "AGOTADO"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};