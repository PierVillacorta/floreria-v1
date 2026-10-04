import { useCartStore } from "../store/cartStore";
import type { Product } from "../types/types";
import { Link } from "react-router-dom";

type ProductCardProps = {
  product: Product;
};
const ProductCard = ({ product }: ProductCardProps) => {
  const { addProduct } = useCartStore();
  return (
    <div className="card w-96 shadow-sm text-white-semi">
      <figure className=" content">
        <img
          src={product.image_url}
          alt="Shoes"
          className="h-96 w-full object-cover"
        />
      </figure>
      <div className="card-body bg-brown-pc rounded-b-[5px]">
        <h2 className="card-title font-bold text-2xl uppercase">
          {product.product_name}
        </h2>
        <p>{product.description}</p>
        <p>${product.price}</p>
        <div className="card-actions justify-around">
          <Link
            className="btn bg-transparent border-none shadow-none text-white-semi"
            to={`/product/${product.product_id}`}
          >
            Ver producto
          </Link>
          <button
            onClick={() => addProduct(product)}
            className="btn btn-neutral bg-amber-950
      hover:bg-amber-950/60 transition-colors duration-300 border-none text-white-semi"
          >
            Agregar al carro
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
