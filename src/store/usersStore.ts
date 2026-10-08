import { create } from "zustand";
import type { AuhtResponse } from "./authStore";
import type { UserRow } from "../types/types";

type CreateUserType = {
  full_name: string;
  email: string;
  password: string;
  role: string;
};

type UserState = {
  users: UserRow[];
  loading: boolean;
  error: string | null;
  createUser: (data: CreateUserType) => Promise<AuhtResponse>;
  fetchUsers: () => Promise<void>;
  deleteUser: (id: number) => Promise<AuhtResponse>;
  updateUser: (
    id: number,
    data: Partial<Pick<UserRow, "full_name" | "role" | "account_status">>,
  ) => Promise<AuhtResponse>;
};

const API_URL = import.meta.env.VITE_API_URL ?? "";

export const useUserStore = create<UserState>()((set, get) => ({
  users: [],
  loading: false,
  error: null,

  createUser: async (data) => {
    try {
      const res = await fetch(`${API_URL}/auth/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.status === "EMAIL_EXISTS") {
        return { success: false, message: "El correo ya está registrado" };
      }
      if (result.status !== "OK") {
        return { success: false, message: "No se pudo crear el usuario" };
      }
      await get().fetchUsers();
      return { success: true, message: "Usuario creado correctamente" };
    } catch {
      return {success:false,message:"Error de conexion"}
    }
  },
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/auth/users`);
      const data = await res.json();
      set({ users: data.items, loading: false });
    } catch {
      set({ error: "No se pudieron cargar los usuarios", loading: false });
    }
  },

  deleteUser: async (id) => {
    try {
      const res = await fetch(`${API_URL}/auth/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.status === "OK") {
        set({ users: get().users.filter((u) => u.user_id !== id) });
        return { success: true, message: "Usuario eliminado" };
      }
      return { success: false, message: "No se pudo eliminar" };
    } catch {
      return { success: false, message: "Error de conexión" };
    }
  },

  updateUser: async (id, data) => {
    try {
      const res = await fetch(`${API_URL}/auth/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.status === "OK") {
        set({
          users: get().users.map((u) =>
            u.user_id === id ? { ...u, ...data } : u,
          ),
        });
        return { success: true, message: "Usuario actualizado" };
      }
      return { success: false, message: "No se pudo actualizar" };
    } catch {
      return { success: false, message: "Error de conexión" };
    }
  },
}));
