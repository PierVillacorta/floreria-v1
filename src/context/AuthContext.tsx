import React, {
  createContext,
  useReducer,
  type PropsWithChildren,
} from "react";
import {
  type AuthAction,
  type AuthState,
  authReducer,
  initialStateAuth,
} from "../reducers/authReducer";
import type { User } from "../types/types";

export type AuthContextProps = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => {
    success: boolean;
    message: string;
  };
  login: (
    email: string,
    password: string,
  ) => {
    success: boolean;
    message: string;
  };
  logout: () => void;
};
export const AuthContext = createContext<AuthContextProps>(null!);
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(authReducer, initialStateAuth);
  const register = (name: string, email: string, password: string) => {
    const existUser = state.users.some((user) => user.email === email);
    if (existUser) {
      return { success: false, message: "Este usuario esta registrado" };
    }

    const newUser: User = {
      id: Date.now(),
      email,
      name,
      password,
      role: "user",
      status: "active",
    };

    dispatch({ type: "REGISTER", payload: { user: newUser } });
    return { success: true, message: "Registrado exitosamente" };
  };
  const login = (email: string, password: string) => {
    const user = state.users.find(
      (user) => user.email === email && user.password === password,
    );
    console.log(state.users)
    if (!user) {
      return { success: false, message: "Correo o Contraseña incorrecto" };
    }
    dispatch({ type: "LOGIN", payload: { user } });
    return {
      success: true,
      message: "Inicio de sesion correcto",
    };
  };
  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, register, login,logout }}>
      {children}
    </AuthContext.Provider>
  );
};
