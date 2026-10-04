import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PublicUser, UserRole } from "../types/types";

export type AuhtResponse = {
  success: boolean;
  message: string;
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
  deleteUser: (id:number) => Promise<AuhtResponse>;
};

const API_URL = import.meta.env.VITE_API_URL ?? ""

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      authError: null,

      register: async (full_name, email, password) => {
        set({ loading: true, authError: null });
        try {
          const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ full_name, email, password }),
          });
          const data = await res.json();

          if(data.status !== "OK"){
            const message = data.status === "EMAIL_EXISTS" ? "El correo ya esta registrado" : "No se pudo crear la cuenta"
            set({loading:false,authError:message})
            return {success:false,message}
          }

          set({ loading: false });
          return { success: true, message: "Cuenta creada correctamente!!" };
        } catch {
          const message = "Error de conexion con el servidor";
          set({ loading: false, authError: message });
          return { success: false, message };
        }
      },
      login: async (email, password) => {
        set({ loading: true, authError: null });
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (data.status !== "OK") {
            const message = "Datos incorrectos";
            set({ loading: false, authError: message });
            return { success: false, message };
          }
          const user :PublicUser = {
            id:data.user_id,
            full_name : data.full_name,
            email,
            role:data.type as UserRole,
            account_status : "ACTIVE"
          }


          set({ user: user, token: data.token, loading: false });
          return { success: true, message: "Bienvenido!" };
        } catch {
          const message = "Error de conexion con el servidor";
          set({ loading: false, authError: message });
          return { success: false, message };
        }
      },
      deleteUser:async (id) => {
        set({ loading: true, authError:null });
        const token = get().token;
        try {
          const res = await fetch(`${API_URL}/users/${id}`,{
            method:"DELETE",
            headers:{"Content-type": "application/json",
              ...(token && {"Authorization" :`Bearer ${token}` })
            }
          })
          
          const data = await res.json()

          if(!res.ok){
            const message = data.message ?? "No se pudo elimanar el usuario"
            set({loading:false,authError:message})
            return {success:true , message}
          }
          set({loading:false})
          return {success:true,message:"Usuario eliminado correctamente"}
        } catch {
          const message = "Error de conexion con el servidor"
          set({loading:false , authError:message})
          return {success:false,message}
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
