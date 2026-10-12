import { create } from "zustand";
import type { CartProduct, Product } from "../types/types";
import { persist } from "zustand/middleware";
import type { AuhtResponse } from "./authStore";

type CartState = {
  cart: CartProduct[];
  addProduct: (product: Product) => AuhtResponse;
  deleteProduct: (id: Product["product_id"]) => void;
  increaseQuantity: (id: Product["product_id"]) => void;
  decreaseQuantity: (id: Product["product_id"]) => void;
  clearCart: () => AuhtResponse;
  getTotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addProduct: (product) =>{
      const productExist = get().cart.find(p => p.product_id === product.product_id)
      if(productExist){
        set((state) => ({
          cart:state.cart.map(p => p.product_id === product.product_id ? {...p,amount:p.amount + 1}: p)
        }))
        const responseAdd = {success:true,message:"Cantidad agregada al carrito"}
        alert(responseAdd.message)
        return responseAdd
      }
      set((state) => ({
        cart:[...state.cart,{...product,amount:1}]
      }))
      const responseAdd = {success:true,message:"Producto agregado al carrito"}
      alert(responseAdd.message)
      return responseAdd
      },
      deleteProduct: (id) =>{
        set((state) => ({
          cart:state.cart.filter(p => p.product_id !== id)
        }))
  
        return {success:true,message:"Producto eliminado correctamente"}
      },
      increaseQuantity: (id) => {
        set((state) => ({
          cart : state.cart.map( p => p.product_id === id ? {...p,amount:p.amount + 1} : p)
        }))
      },
      decreaseQuantity: (id) => {
        const producto = get().cart.find(p => p.product_id === id)
        if(producto && producto.amount > 1){
          set((state) => ({
          cart: state.cart.map(p => p.product_id === id && p.amount > 1 ? {...p,amount:p.amount - 1} : p)
          }))
        }
      },
      clearCart: () => {
        set({cart : []})
        const responseClear = {success:true,message:"Carrito vaciado"}
        alert(responseClear.message)
        return responseClear
      },
      getTotal: () => get().cart.reduce((acc,p) => acc + p.price * p.amount,0),
    }),

    { name: "floreria-cart" },
  ),
);
