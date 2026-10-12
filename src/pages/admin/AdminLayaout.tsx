import { useState } from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const AdminLayout = () => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  // Por si el usuario no es admin
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: "📊" },
    { to: "/admin/users", label: "Usuarios", icon: "👥" },
    { to: "/admin/products", label: "Productos", icon: "🌷" },
    { to: "/admin/categories", label: "Categorías", icon: "🗂️" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen text-brown-pc relative">
      {/* Navbar Superior Mobile */}
      <header className="md:hidden flex items-center justify-between bg-brown-pc text-white p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-sm">Admin Panel</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* Overlay oscuro para cerrar el menú en móviles al hacer clic afuera */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-brown-pc text-white flex flex-col shrink-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
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
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              onClick={() => setIsOpen(false)}
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
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm
              font-semibold text-white/70 hover:bg-white/10 hover:text-white
              transition-all duration-200"
          >
            🛍️ Ver tienda
          </NavLink>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
};