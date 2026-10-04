import { create } from "zustand";
import type { CartProduct, Product } from "../types/types";
import { persist } from "zustand/middleware";

type CartState = {
  cart: CartProduct[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: Product["product_id"]) => void;
  increaseQuantity: (id: Product["product_id"]) => void;
  decreaseQuantity: (id: Product["product_id"]) => void;
  clearCart: () => void;
  getTotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addProduct: (product) =>
        set((state) => {
          const productExist = state.cart.find((p) => p.product_id == product.product_id);
          if (productExist) {
            return {
              cart: state.cart.map((p) =>
                p.product_id === product.product_id ? { ...p, amount: p.amount + 1 } : p,
              ),
            };
          }
          return {
            cart: [...state.cart, { ...product, amount: 1 }],
          };
        }),
      deleteProduct: (id) =>
        set((state) => ({
          cart: state.cart.filter((p) => p.product_id !== id),
        })),

      increaseQuantity: (id) => {
        set((state) => ({
          cart : state.cart.map( p => p.product_id === id ? {...p,amount:p.amount + 1} : p)
        }))
      },
      decreaseQuantity: (id) => {
        set((state) => ({
          cart: state.cart.map(p => p.product_id === id && p.amount > 1 ? {...p,amount:p.amount - 1} : p)
        }))
      },
      clearCart: () => set({cart : []}),
      getTotal: () => get().cart.reduce((acc,p) => acc + p.price * p.amount,0),
    }),

    { name: "floreria-cart" },
  ),
);
