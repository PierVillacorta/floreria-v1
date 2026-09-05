import type { Product } from "../types/types"
import type { CartAction } from "../reducers/cartReducer";

type ProductCardProps = {
  product : Product; 
  dispatch:React.Dispatch<CartAction>
}
const ProductCard = ({product,dispatch}:ProductCardProps) => {
 
  return (
    <div className="card bg-base-content w-96 shadow-sm ">
  <figure className=" content">
    <img
      src={product.img}
      alt="Shoes"
      className="h-96 w-full object-cover"/>
  </figure>
  <div className="card-body bg-brown-pc rounded-b-[5px]">
    <h2 className="card-title font-bold text-2xl uppercase">{product.name}</h2>
    <p>{product.descripcion}</p>
    <p>${product.precio.toLocaleString("es-CL")}</p>   
    <div className="card-actions justify-end">
      <button onClick={() => dispatch({type:"ADD-PRODUCT",payload:{product}})} className="btn bg-amber-950
      hover:bg-amber-950/60 duration-300 border-none">Agregar al carro</button>
    </div>
  </div>
</div>
  )
}

export default ProductCard