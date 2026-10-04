import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { useCartStore } from "../store/cartStore";
import { Loading } from "../components/ui/Loading";

// Umbral de precio para considerar un producto en oferta
const OFFER_PRICE = 25000;

const Offers = () => {
  const { products, loading, error, fetchProducts } = useProductStore();
  const { addProduct } = useCartStore();

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-500 mt-32">{error}</p>;

  const offers = products.filter((p) => p.price <= OFFER_PRICE);

  return (
    <section className="min-h-screen w-full bg-white-semi text-brown-pc px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Título */}
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-brown-pc/60">
            Precios especiales
          </p>
          <h1 className="mt-2 text-4xl font-bold uppercase">🏷️ Ofertas</h1>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-amber-950" />
          <p className="mt-4 text-brown-pc/60">
            Productos seleccionados hasta ${OFFER_PRICE.toLocaleString("es-CL")}
          </p>
        </div>

        {offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <p className="text-2xl font-semibold uppercase">
              No hay ofertas disponibles
            </p>
            <Link
              to="/"
              className="mt-6 text-amber-950 font-semibold hover:underline"
            >
              Ver todos los productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((product) => (
              <div
                key={product.product_id}
                className="card shadow-sm text-white-semi relative"
              >
                {/* Badge de oferta */}
                <div className="absolute top-3 left-3 z-10 bg-red-500 text-white
                  text-xs font-bold uppercase px-2 py-1 rounded-full">
                  Oferta
                </div>

                <figure>
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="h-64 w-full object-cover"
                  />
                </figure>

                <div className="card-body bg-brown-pc rounded-b-[5px]">
                  <h3 className="card-title font-bold text-xl uppercase">
                    {product.product_name}
                  </h3>
                  <p className="text-white-semi/70 text-sm line-clamp-2">
                    {product.description}
                  </p>
                  <p className="font-bold text-lg text-amber-300">
                    ${product.price.toLocaleString("es-CL")}
                  </p>

                  <div className="card-actions justify-around mt-2">
                    <Link
                      to={`/product/${product.product_id}`}
                      className="btn bg-transparent border-none shadow-none text-white-semi"
                    >
                      Ver más
                    </Link>
                    <button
                      onClick={() => addProduct(product)}
                      className="btn btn-neutral bg-amber-950 hover:bg-amber-950/60
                        transition-colors duration-300 border-none text-white-semi"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Offers;