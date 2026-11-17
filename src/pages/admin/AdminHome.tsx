import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Dashboard } from "../../components/Dashboard";

// /admin: el admin ve el dashboard; el vendedor no tiene dashboard y va a las órdenes
export const AdminHome = () => {
  const { user } = useAuthStore();
  return user?.role === "ADMIN" ? <Dashboard /> : <Navigate to="/admin/orders" replace />;
};
