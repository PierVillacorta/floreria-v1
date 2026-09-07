import { Users } from "../data/users";
import type { User } from "../types/types";

export type AuthState = {
  user: User | null;
  users: User[];
};
export type AuthAction =
  | { type: "REGISTER"; payload: { user: User } }
  | { type: "LOGIN"; payload: { user: User } }
  | { type: "LOGOUT" };

export const initialStateAuth: AuthState = {
  user: null,
  users: Users,
};

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case "REGISTER": {
      const user = action.payload.user;
      const existReg = state.users.find((u) => u.email === user.email);
      if (existReg) {
        return state;
      }
      return {
        ...state,
        users: [...state.users, user],
      };
    }

    case "LOGIN":
      const user = action.payload.user;
      const existLogin = state.users.find((u) => u.email === user.email);
      if (!existLogin) {
        return state;
      }
      return {
        ...state,
        user: existLogin,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};
