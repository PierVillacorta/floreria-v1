import { create } from "zustand";
import { type Product, type Category, type NewProduct } from "../types/types";
import type { AuhtResponse } from "./authStore";

type ProductState = {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  createProduct: (data: NewProduct) => Promise<AuhtResponse>;
  updateProduct: (id: Number, data: Partial<Product>) => Promise<AuhtResponse>;
  deleteProduct: (id: number) => Promise<AuhtResponse>;
  fetchCategories: () => Promise<void>;
  updateCategory: (id: number, name: string) => Promise<AuhtResponse>;
  deleteCategory: (id: number) => Promise<AuhtResponse>;
};

const API_URL = import.meta.env.VITE_API_URL ?? "";

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/products/`);
      const data = await res.json();
      set({ products: data.items, loading: false });
    } catch {
      set({ error: "No se pudieron cargar los productos", loading: false });
    }
  },
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/categories/`);
      const data = await res.json();
      set({ categories: data.items, loading: false });
    } catch {
      set({ error: "No se pudieron cargar las categorias", loading: false });
    }
  },
  createProduct: async (data) => {
    try {
      const res = await fetch(`${API_URL}/auth/products`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.status === "OK") {
        await get().fetchProducts();
        return { success: true, message: "Producto Creado" };
      }
      return { success: false, message: "No se pudo crear" };
    } catch {
      return { success: false, message: "Error de conexion" };
    }
  },
  updateProduct: async (id, data) => {
    try {
      const res = await fetch(`${API_URL}/auth/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.status === "OK") {
        set({
          products: get().products.map((p) =>
            p.product_id === id ? { ...p, ...data } : p,
          ),
        });
        return { success: true, message: "Producto actualizado" };
      }
      return { success: false, message: "No se pudo actualizar" };
    } catch {
      return { success: false, message: "Error de conexión" };
    }
  },
  updateCategory: async (id, name) => {
    try {
      const res = await fetch(`${API_URL}/auth/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_name: name }),
      });
      const result = await res.json();

      if (result.status === "OK") {
        set({
          categories: get().categories.map((c) =>
            c.category_id === id ? { ...c, category_name: name } : c,
          ),
        });
        return { success: true, message: "Categoría actualizada" };
      }
      return { success: false, message: "No se pudo actualizar" };
    } catch {
      return { success: false, message: "Error de conexión" };
    }
  },
  deleteProduct: async (id) => {
    try {
      const res = await fetch(`${API_URL}/auth/products/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.status === "OK") {
        set({ products: get().products.filter((p) => p.product_id !== id) });
        return { success: true, message: "Producto eliminado" };
      }
      return { success: false, message: "No se pudo eliminar" };
    } catch {
      return { success: false, message: "Error de conexión" };
    }
  },
  deleteCategory: async (id) => {
  try {
    const res = await fetch(`${API_URL}/auth/categories/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();

    if (result.status === "HAS_PRODUCTS") {
      return {
        success: false,
        message: `No se puede eliminar: tiene ${result.count} producto(s) asociado(s)`,
      };
    }

    if (result.status === "OK") {
      set({
        categories: get().categories.filter((c) => c.category_id !== id),
      });
      return { success: true, message: "Categoría eliminada" };
    }

    return { success: false, message: "No se pudo eliminar" };
  } catch {
    return { success: false, message: "Error de conexión" };
  }
},
}));
