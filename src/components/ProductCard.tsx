import type { Product } from "../types/types";
import type { CartAction } from "../reducers/cartReducer";
import { Link } from "react-router-dom";

type ProductCardProps = {
  product: Product;
  dispatch: React.Dispatch<CartAction>;
};
const ProductCard = ({ product, dispatch }: ProductCardProps) => {
  return (
    <div className="card  w-96 shadow-sm text-white-semi">
      <figure className=" content">
        <img
          src={product.img}
          alt="Shoes"
          className="h-96 w-full object-cover"
        />
      </figure>
      <div className="card-body bg-brown-pc rounded-b-[5px]">
        <h2 className="card-title font-bold text-2xl uppercase">
          {product.name}
        </h2>
        <p>{product.descripcion}</p>
        <p>${product.precio.toLocaleString("es-CL")}</p>
        <div className="card-actions justify-around">
          <Link className="btn bg-transparent border-none shadow-none" to={`/product/${product.name}`}>
            Ver producto
          </Link>
          <button
            onClick={() =>
              dispatch({ type: "ADD-PRODUCT", payload: { product } })
            }
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
