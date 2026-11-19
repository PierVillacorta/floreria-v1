import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartProduct, Product } from "../types/types";
import type { AuhtResponse } from "./authStore";

type CartState = {
  cart: CartProduct[];
  addProduct: (product: Product) => AuhtResponse;
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

      addProduct: (product) => {
        if (product.stock <= 0) {
          return { success: false, message: "Producto sin stock disponible" };
        }

        const productExist = get().cart.find((p) => p.product_id === product.product_id);
        if (productExist) {
          if (productExist.amount >= product.stock) {
            return { success: false, message: "Alcanzaste el stock máximo disponible" };
          }
          set((state) => ({
            cart: state.cart.map((p) =>
              p.product_id === product.product_id
                ? { ...p, stock: product.stock, amount: p.amount + 1 }
                : p,
            ),
          }));
          return { success: true, message: "Cantidad agregada al carrito" };
        }

        set((state) => ({
          cart: [...state.cart, { ...product, amount: 1 }],
        }));
        return { success: true, message: "Producto agregado al carrito" };
      },

      deleteProduct: (id) => {
        set((state) => ({
          cart: state.cart.filter((p) => p.product_id !== id),
        }));
      },

      increaseQuantity: (id) => {
        set((state) => ({
          cart: state.cart.map((p) =>
            p.product_id === id && p.amount < p.stock
              ? { ...p, amount: p.amount + 1 }
              : p,
          ),
        }));
      },

      decreaseQuantity: (id) => {
        const producto = get().cart.find((p) => p.product_id === id);
        if (producto && producto.amount > 1) {
          set((state) => ({
            cart: state.cart.map((p) =>
              p.product_id === id && p.amount > 1 ? { ...p, amount: p.amount - 1 } : p,
            ),
          }));
        }
      },
      clearCart: () => set({ cart: [] }),
      getTotal: () => get().cart.reduce((acc, p) => acc + p.price * p.amount, 0),
    }),
    { name: "floreria-cart" },
  ),
);