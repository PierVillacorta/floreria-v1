// src/store/productStore.ts
import { create } from "zustand";
import type { Product, Category, NewProduct } from "../types/types";
import type { AuhtResponse } from "./authStore";
import { apiFetch, errorMessage } from "../utils/api";

// La API devuelve null en image_url y description cuando se dejan vacíos.
// Convertimos en el borde para que el resto de la app siempre trabaje con string.
type ApiProduct = Omit<Product, "image_url" | "description"> & {
  image_url: string | null;
  description: string | null;
};

const toProduct = (p: ApiProduct): Product => ({
  ...p,
  image_url: p.image_url ?? "",
  description: p.description ?? "",
});

type ProductState = {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  createProduct: (data: NewProduct) => Promise<AuhtResponse>;
  updateProduct: (id: number, data: NewProduct) => Promise<AuhtResponse>;
  deleteProduct: (id: number) => Promise<AuhtResponse>;
  fetchCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<AuhtResponse>;
  updateCategory: (id: number, name: string) => Promise<AuhtResponse>;
  deleteCategory: (id: number) => Promise<AuhtResponse>;
};

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,

  // ---------- Productos ----------
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      // Sin "/" al final: Spring 6 ya no hace match con "/products/"
      const products = await apiFetch<ApiProduct[]>("/products");
      set({ products: products.map(toProduct), loading: false });
    } catch (error) {
      set({ error: errorMessage(error), loading: false });
    }
  },

  createProduct: async (data) => {
    try {
      const created = await apiFetch<ApiProduct>("/products", {
        method: "POST",
        body: data,
        auth: true,
      });
      // Usamos lo que devuelve el servidor (ya normalizado, con su id real)
      set({ products: [...get().products, toProduct(created)] });
      return { success: true, message: "Producto creado" };
    } catch (error) {
      return { success: false, message: errorMessage(error) };
    }
  },

  updateProduct: async (id, data) => {
    try {
      const updated = await apiFetch<ApiProduct>(`/products/${id}`, {
        method: "PUT",
        body: data,
        auth: true,
      });
      set({
        products: get().products.map((p) =>
          p.product_id === id ? toProduct(updated) : p,
        ),
      });
      return { success: true, message: "Producto actualizado" };
    } catch (error) {
      return { success: false, message: errorMessage(error) };
    }
  },

  deleteProduct: async (id) => {
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE", auth: true });
      set({ products: get().products.filter((p) => p.product_id !== id) });
      return { success: true, message: "Producto eliminado" };
    } catch (error) {
      return { success: false, message: errorMessage(error) };
    }
  },

  // ---------- Categorías ----------
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await apiFetch<Category[]>("/categories");
      set({ categories, loading: false });
    } catch (error) {
      set({ error: errorMessage(error), loading: false });
    }
  },

  createCategory: async (name) => {
    try {
      const created = await apiFetch<Category>("/categories", {
        method: "POST",
        body: { category_name: name },
        auth: true,
      });
      set({ categories: [...get().categories, created] });
      return { success: true, message: "Categoría creada" };
    } catch (error) {
      return { success: false, message: errorMessage(error) };
    }
  },

  updateCategory: async (id, name) => {
    try {
      const updated = await apiFetch<Category>(`/categories/${id}`, {
        method: "PUT",
        body: { category_name: name },
        auth: true,
      });
      set({
        categories: get().categories.map((c) =>
          c.category_id === id ? updated : c,
        ),
      });
      return { success: true, message: "Categoría actualizada" };
    } catch (error) {
      return { success: false, message: errorMessage(error) };
    }
  },

  deleteCategory: async (id) => {
    try {
      // Si tiene productos, el backend responde 409 con el mensaje listo para mostrar
      await apiFetch(`/categories/${id}`, { method: "DELETE", auth: true });
      set({ categories: get().categories.filter((c) => c.category_id !== id) });
      return { success: true, message: "Categoría eliminada" };
    } catch (error) {
      return { success: false, message: errorMessage(error) };
    }
  },
}));