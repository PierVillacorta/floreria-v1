import { useCart } from "../hooks/useCart"

const Cart = () => {
  const {state} =   useCart()
  return (
    <div>{state.cart.map(p => (
        <h1 className="text-amber-50">{p.name}</h1>
    ))}</div>
  )
}

export default Cart