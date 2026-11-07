// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PublicUser } from "../types/types";
import { apiFetch, errorMessage } from "../utils/api";

export type AuhtResponse = {
  success: boolean;
  message: string;
};

// Respuesta de POST /api/auth/login
type LoginResponse = {
  token: string;
  token_type: string;
  expires_in: number;
  user: PublicUser;
};

type AuthState = {
  user: PublicUser | null;
  token: string | null;
  loading: boolean;
  authError: string | null;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<AuhtResponse>;
  login: (email: string, password: string) => Promise<AuhtResponse>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      authError: null,

      register: async (full_name, email, password) => {
        set({ loading: true, authError: null });
        try {
          await apiFetch("/auth/register", {
            method: "POST",
            body: { full_name, email, password },
          });
          set({ loading: false });
          return { success: true, message: "Cuenta creada correctamente!!" };
        } catch (error) {
          const message = errorMessage(error);
          set({ loading: false, authError: message });
          return { success: false, message };
        }
      },

      login: async (email, password) => {
        set({ loading: true, authError: null });
        try {
          const data = await apiFetch<LoginResponse>("/auth/login", {
            method: "POST",
            body: { email, password },
          });
          // El backend ya devuelve el usuario completo: no hay que armarlo a mano
          set({ user: data.user, token: data.token, loading: false });
          return { success: true, message: "Bienvenido!" };
        } catch (error) {
          const message = errorMessage(error);
          set({ loading: false, authError: message });
          return { success: false, message };
        }
      },

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "floreria-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);