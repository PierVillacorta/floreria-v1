// src/store/usersStore.ts
import { create } from "zustand";
import type { AuhtResponse } from "./authStore";
import type { UserRow } from "../types/types";
import { apiFetch, errorMessage } from "../utils/api";

type CreateUserType = {
  full_name: string;
  email: string;
  password: string;
  role: string;
};

// El backend exige los tres campos en el PUT (ya no es una actualización parcial)
type UpdateUserType = Pick<UserRow, "full_name" | "role" | "account_status">;

type UserState = {
  users: UserRow[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (data: CreateUserType) => Promise<AuhtResponse>;
  updateUser: (id: number, data: UpdateUserType) => Promise<AuhtResponse>;
  deleteUser: (id: number) => Promise<AuhtResponse>;
};

export const useUserStore = create<UserState>()((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await apiFetch<UserRow[]>("/users", { auth: true });
      set({ users, loading: false });
    } catch (error) {
      set({ error: errorMessage(error), loading: false });
    }
  },

  createUser: async (data) => {
    try {
      const created = await apiFetch<UserRow>("/users", {
        method: "POST",
        body: data,
        auth: true,
      });
      set({ users: [...get().users, created] });
      return { success: true, message: "Usuario creado correctamente" };
    } catch (error) {
      return { success: false, message: errorMessage(error) };
    }
  },

  updateUser: async (id, data) => {
    try {
      const updated = await apiFetch<UserRow>(`/users/${id}`, {
        method: "PUT",
        body: data,
        auth: true,
      });
      set({
        users: get().users.map((u) => (u.user_id === id ? updated : u)),
      });
      return { success: true, message: "Usuario actualizado" };
    } catch (error) {
      return { success: false, message: errorMessage(error) };
    }
  },

  deleteUser: async (id) => {
    try {
      await apiFetch(`/users/${id}`, { method: "DELETE", auth: true });
      set({ users: get().users.filter((u) => u.user_id !== id) });
      return { success: true, message: "Usuario eliminado" };
    } catch (error) {
      return { success: false, message: errorMessage(error) };
    }
  },
}));