import type { Product } from "../types/types"

type ProductCardProps = {
  product : Product
}
const ProductCard = ({product}:ProductCardProps) => {
  return (
    <div className="card bg-base-content w-96 shadow-sm ">
  <figure className="h-96 w-full">
    <img
      src={product.img}
      alt="Shoes"/>
  </figure>
  <div className="card-body bg-brown-pc rounded-b-[5px]">
    <h2 className="card-title font-bold text-2xl uppercase">{product.name}</h2>
    <p>{product.descripcion}</p>
    <p>{product.precio}</p>
    <div className="card-actions justify-end">
      <button className="btn bg-amber-950 border-none">Comprar</button>
    </div>
  </div>
</div>
  )
}

export default ProductCard