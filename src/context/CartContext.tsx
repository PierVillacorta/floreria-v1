import {type PropsWithChildren, createContext ,useReducer} from 'react'
import {type CartAction,cartReducer,initialState} from '../reducers/cartReducer'

type CartContextProps ={
    state: typeof initialState,
    dispatch : React.Dispatch<CartAction>
}


export const CartContext = createContext<CartContextProps>(null!)

export const CartProvider = ({children} : PropsWithChildren) => {
    const [state,dispatch] = useReducer(cartReducer,initialState)

    return(
        <CartContext.Provider value={{state,dispatch}}>
        {children}
        </CartContext.Provider>
    )

}
