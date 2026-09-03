import { useContext } from "react"
import { CartContext } from "../context/CartContext"

export const useCart = () => {
    const context = useContext(CartContext)

    if(!context){
        throw new Error(
            "useProduct debe utilizarse dentro del ProductProvider"
        )
    }
    return context
}