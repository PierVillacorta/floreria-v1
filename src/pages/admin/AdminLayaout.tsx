import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const AdminLayout = () => {
  const { user } = useAuthStore();

  // Por si el usuario no es admin
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen  text-brown-pc">
      {/* Sidebar */}
      <aside className="w-64 bg-brown-pc text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <p className="text-xs uppercase tracking-widest text-white/50 mb-1">
            Panel
          </p>
          <h1 className="text-xl font-bold uppercase">Administrador</h1>
          <p className="text-sm text-white/60 mt-1 truncate">
            {user.full_name}
          </p>
        </div>

        <nav className="flex p-4 flex-1 flex-col gap-1">
          {[
            { to: "/admin", label: "Dashboard", icon: "📊" },
            { to: "/admin/users", label: "Usuarios", icon: "👥" },
            { to: "/admin/products", label: "Productos", icon: "🌷" },
            { to: "/admin/categories", label: "Categorías", icon: "🗂️" }
          ].map(({ to, label, icon }) => (
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

        <div className="p-4 border-t border-white/10">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm
              font-semibold text-white/70 hover:bg-white/10 hover:text-white
              transition-all duration-200"
          >
            🛍️ Ver tienda
          </NavLink>
        </div>
        
      </aside>

      <main className="flex-1 xl:flex-1 xl:items-center p-8 ">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
