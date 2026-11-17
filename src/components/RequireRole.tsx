import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { UserRole } from "../types/types";

type Props = {
  roles: UserRole[];
  redirectTo?: string;
};
export const RequireRole = ({ roles, redirectTo = "/" }: Props) => {
  const { user } = useAuthStore();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
};
