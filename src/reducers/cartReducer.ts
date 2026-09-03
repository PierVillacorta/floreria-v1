import type { CartProduct, Product } from "../types/types";

export type CartAction =
  | { type: "ADD-PRODUCT"; payload: { product: Product } }
  | { type: "DELETE-PRODUCT"; payload: { id: Product["id"] } }
  | { type: "INCREASE-QUATITY"; payload: { id: Product["id"] } }
  | { type: "DECREASE-QUATITY"; payload: { id: Product["id"] } }
  | { type: "CLEAR-PRODUCT" };

export type CartState = {
  cart: CartProduct[];
};

export const initialState: CartState = {
  cart: [],
};

export const cartReducer = (
  state: CartState,
  action: CartAction,
): CartState => {
  switch (action.type) {
    case "ADD-PRODUCT": {
      const product = action.payload.product;
      const productExist = state.cart.find(
        (product) => product.id == action.payload.product.id,
      );
      if (productExist) {
        return {
          ...state,
          cart: state.cart.map((product) =>
            product.id === action.payload.product.id
              ? { ...product, amount: product.amount + 1 }
              : product,
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...product, amount: 1 }],
      };
    }
    case "DELETE-PRODUCT":
      return {
        ...state,
        cart: state.cart.filter((product) => product.id !== action.payload.id),
      };
    case "INCREASE-QUATITY":
      return {
        ...state,
        cart: state.cart.map((product) =>
          product.id === action.payload.id
            ? { ...product, amount: product.amount + 1 }
            : product,
        ),
      };
    case "DECREASE-QUATITY":
      return {
        ...state,
        cart: state.cart
          .map((product) =>
            product.id === action.payload.id
              ? { ...product, amount: product.amount - 1 }
              : product,
          )
          .filter((p) => p.amount > 0),
      };
    case "CLEAR-PRODUCT":
      return {
        ...state,
        cart: [],
      };
    default:
      return state;
  }
};
