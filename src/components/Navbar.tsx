import { Link } from "react-router-dom";
import logo from "../public/logo.jpeg";
import { useAuthStore } from "../store/authStore";

const linkClass = "border-b-4 border-transparent hover:border-white-semi duration-300 cursor-pointer font-bold uppercase text-sm md:text-base";

export const Navbar = () => {
  const { user, logout } = useAuthStore();

  const links = [
    { to: "/categories", label: "Categorías" },
    { to: "/offers", label: "Ofertas" },
    { to: "/cart", label: "Carrito" },
    { to: "/about", label: "Sobre Nosotros" },
    { to: "/blogs", label: "Blog" },
    ...(user?.role === "ADMIN" ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="w-full bg-brown-pc shadow-md">
      <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between py-4 gap-4 md:gap-0">
        
        <Link to="/" className="md:ml-6">
          <img src={logo} alt="logo_floreria" className="w-16 h-16 rounded-xl object-cover" />
        </Link>

        <nav className="flex-1 flex justify-center">
          <ul className="flex flex-wrap justify-center items-center gap-4 md:gap-8 font-bold uppercase text-sm md:text-base">
            {user && (
              <li className="text-lg font-semibold flex gap-2 items-center text-orange-200">
                Hi <span className="font-extrabold">{user.full_name} !</span>
              </li>
            )}
            {links.map(({ to, label }) => (
              <li key={to} className={linkClass}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 flex items-center gap-4 mr-2 md:mr-6">
          {user ? (
            <button className="btn btn-neutral border-none bg-brown-pc text-white-semi text-sm md:text-lg" onClick={logout}>
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link to="/login" className={linkClass}>Login</Link>
              <Link to="/register" className={linkClass}>Registrarse</Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
};