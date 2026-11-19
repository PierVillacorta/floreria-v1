import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { formatCLP } from "../utils/format";
import type { Product } from "../types/types";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { cart, addProduct } = useCartStore();
  const [addedMsg, setAddedMsg] = useState<string | null>(null);

  const inCart = cart.find((item) => item.product_id === product.product_id)?.amount ?? 0;
  const stockDisponible = product.stock - inCart;

  const handleAdd = () => {
    const res = addProduct(product);
    setAddedMsg(res.message);
    setTimeout(() => setAddedMsg(null), 1500);
  };

  return (
    <div className="card w-96 shadow-sm text-white-semi">
      <figure>
        <img
          src={product.image_url}
          alt={product.product_name}
          className="h-96 w-full object-cover"
        />
      </figure>
      <div className="card-body bg-brown-pc rounded-b-[5px]">
        <h2 className="card-title font-bold text-2xl uppercase">
          {product.product_name}
        </h2>
        <p>{product.description}</p>
        <p className="font-semibold text-lg">{formatCLP(product.price)}</p>
        {addedMsg && <p className="text-xs text-amber-200 font-semibold">{addedMsg}</p>}
        <div className="card-actions justify-around">
          <Link
            className="btn bg-transparent border-none shadow-none text-white-semi"
            to={`/product/${product.product_id}`}
          >
            Ver producto
          </Link>
          <button
            onClick={handleAdd}
            disabled={stockDisponible <= 0}
            className="btn btn-neutral bg-amber-950 hover:bg-amber-950/60 transition-colors duration-300 border-none text-white-semi disabled:opacity-40"
          >
            {stockDisponible > 0 ? "Agregar al carro" : "Sin stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;