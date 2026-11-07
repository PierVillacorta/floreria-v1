import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { useCartStore } from "../store/cartStore";
import { Loading } from "../components/Loading";
import type { Category } from "../types/types";

export const Categories = () => {
  const { products, categories, loading, fetchProducts, fetchCategories } =
    useProductStore();
  const { addProduct } = useCartStore();
  const [selected, setSelected] = useState<Category | null>(null);

  useEffect(() => {
    if (products.length === 0) fetchProducts();
    if (categories.length === 0) fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !selected) {
      setSelected(categories[0]);
    }
  }, [categories]);

  if (loading) return <Loading />;


  const filtered = selected
    ? products.filter((p) => p.category_id == selected.category_id)
    : products;

  return (
    <section className="min-h-screen w-full bg-white-semi text-brown-pc px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Título */}
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-brown-pc/60">
            Explora nuestra colección
          </p>
          <h1 className="mt-2 text-4xl font-bold uppercase">Categorías</h1>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-amber-950" />
        </div>

        {/* Tabs de categorías */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setSelected(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold uppercase
                transition-all duration-300 cursor-pointer
                ${
                  selected?.category_id === cat.category_id
                    ? "bg-amber-950 text-white"
                    : "bg-amber-50 text-brown-pc hover:bg-amber-100"
                }`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        {/* Nombre de la categoría activa */}
        {selected && (
          <h2 className="text-2xl font-bold uppercase mb-6">
            {selected.category_name}
            <span className="ml-3 text-sm font-normal text-brown-pc/50">
              ({filtered.length} productos)
            </span>
          </h2>
        )}

        {/* Grid de productos */}
        {filtered.length === 0 ? (
          <p className="text-center text-brown-pc/60 mt-20">
            No hay productos en esta categoría.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <div
                key={product.product_id}
                className="card shadow-sm text-white-semi"
              >
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
                  <p className="text-white-semi/70 text-sm">{product.description}</p>
                  <p className="font-semibold">
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

      <Link
        to="/"
        className="fixed bottom-6 left-6 text-sm font-semibold uppercase
          tracking-wider text-brown-pc/60 transition-colors duration-300
          hover:text-amber-950"
      >
        ← Volver
      </Link>
    </section>
  );
};
