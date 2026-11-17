import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import type { UserRole } from "../../types/types";

type MenuItem = { to: string; label: string; icon: string; roles: UserRole[] };

// Cada opción declara qué roles la ven: el vendedor solo recibe Órdenes y Productos
const menu: MenuItem[] = [
  { to: "/admin", label: "Dashboard", icon: "📊", roles: ["ADMIN"] },
  { to: "/admin/orders", label: "Órdenes", icon: "🧾", roles: ["ADMIN", "SELLER"] },
  { to: "/admin/products", label: "Productos", icon: "🌷", roles: ["ADMIN", "SELLER"] },
  { to: "/admin/categories", label: "Categorías", icon: "🗂️", roles: ["ADMIN"] },
  { to: "/admin/users", label: "Usuarios", icon: "👥", roles: ["ADMIN"] },
];

export const AdminLayout = () => {
  const { user } = useAuthStore();

  // Solo personal de la tienda entra al panel; el cliente vuelve a la tienda
  if (!user || (user.role !== "ADMIN" && user.role !== "SELLER")) {
    return <Navigate to="/" replace />;
  }

  const items = menu.filter((item) => item.roles.includes(user.role));

  return (
    <div className="flex min-h-screen  text-brown-pc">
      {/* Sidebar */}
      <aside className="w-64 bg-brown-pc text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <p className="text-xs uppercase tracking-widest text-white/50 mb-1">
            Panel
          </p>
          <h1 className="text-xl font-bold uppercase">
            {user.role === "ADMIN" ? "Administrador" : "Vendedor"}
          </h1>
        </div>
        <nav className="flex p-4 flex-1 flex-col gap-1">
          {items.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? "bg-amber-950 text-white-semi"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 xl:flex-1 xl:items-center p-8 ">
        <Outlet />
      </main>
    </div>
  );
};
