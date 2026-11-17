// src/store/orderStore.ts
import { create } from "zustand";
import type { CreateOrderPayload, Order, OrderSummary } from "../types/types";
import { apiFetch, errorMessage } from "../utils/api";

export type Result<T> =
  | { success: true; data: T }
  | { success: false; message: string };

type OrderState = {
  orders: OrderSummary[];
  loading: boolean;
  error: string | null;
  createOrder: (payload: CreateOrderPayload) => Promise<Result<Order>>;
  fetchAllOrders: () => Promise<void>; 
  fetchMyOrders: () => Promise<void>; 
  fetchOrder: (id: number) => Promise<Result<Order>>;
};

export const useOrderStore = create<OrderState>()((set) => {
  const loadList = async (path: string) => {
    set({ loading: true, error: null });
    try {
      const orders = await apiFetch<OrderSummary[]>(path, { auth: true });
      set({ orders, loading: false });
    } catch (error) {
      set({ error: errorMessage(error), loading: false });
    }
  };

  return {
    orders: [],
    loading: false,
    error: null,

    createOrder: async (payload) => {
      try {
        const order = await apiFetch<Order>("/orders", {
          method: "POST",
          body: payload,
          auth: true,
        });
        return { success: true, data: order };
      } catch (error) {
        return { success: false, message: errorMessage(error) };
      }
    },
    
    fetchAllOrders: () => loadList("/orders"),
    fetchMyOrders: () => loadList("/orders/me"),
    fetchOrder: async (id) => {
      try {
        const order = await apiFetch<Order>(`/orders/${id}`, { auth: true });
        return { success: true, data: order };
      } catch (error) {
        return { success: false, message: errorMessage(error) };
      }
    },
  };
});
