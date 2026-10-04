import { Link } from "react-router-dom";
import logo from "../public/logo.jpeg";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="w-full bg-brown-pc shadow-md">
      {/* Contenedor principal: ancho completo con límite y centrado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4">
          
          {/* LOGO - A la izquierda con margen */}
          <div className="flex-shrink-0 mb-4 md:mb-0 ml-2 md:ml-6">
            <Link to={"/"}>
              <img
                src={logo}
                alt="logo_floreria"
                className="w-16 h-16 rounded-xl object-cover"
              />
            </Link>
          </div>

          {/* NAVEGACIÓN - Centrada o a la derecha */}
          <nav className="flex-1 flex flex-col md:flex-row items-center justify-end gap-6">
            <ul className="flex flex-wrap justify-center items-center gap-4 md:gap-8 font-bold uppercase text-sm md:text-base">
              {user ? (
                <>
                  <li className="text-lg font-semibold flex gap-2 items-center">
                    Hi <span className="font-extrabold">{user.full_name} !</span>
                  </li>

                  {user.role === "ADMIN" && (
                    <li className="border-b-4 border-transparent hover:border-white-semi duration-300 cursor-pointer">
                      <Link to={"/admin"}>Admin</Link>
                    </li>
                  )}
                  <li className="border-b-4 border-transparent hover:border-white-semi duration-300 cursor-pointer">
                    <Link to={"/cart"}>Carrito</Link>
                  </li>
                  <li className="border-b-4 border-transparent hover:border-white-semi duration-300 cursor-pointer">
                    <Link to={"/offers"}>Ofertas</Link>
                  </li>
                  <li className="border-b-4 border-transparent hover:border-white-semi duration-300 cursor-pointer">
                    <Link to={"/about"}>Sobre Nosotros</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="border-b-4 border-transparent hover:border-white-semi duration-300 cursor-pointer">
                    <Link to={"/categories"}>Categorías</Link>
                  </li>
                  <li className="border-b-4 border-transparent hover:border-white-semi duration-300 cursor-pointer">
                    <Link to={"/offers"}>Ofertas</Link>
                  </li>
                  <li className="border-b-4 border-transparent hover:border-white-semi duration-300 cursor-pointer">
                    <Link to={"/login"}>Login</Link>
                  </li>
                  <li className="border-b-4 border-transparent hover:border-white-semi duration-300 cursor-pointer">
                    <Link to={"/register"}>Registrarse</Link>
                  </li>
                  <li className="border-b-4 border-transparent hover:border-white-semi duration-300 cursor-pointer">
                    <Link to={"/cart"}>Carrito</Link>
                  </li>
                  <li className="border-b-4 border-transparent hover:border-white-semi duration-300 cursor-pointer">
                    <Link to={"/about"}>Sobre Nosotros</Link>
                  </li>
                </>
              )}
            </ul>

            {/* BOTÓN CERRAR SESIÓN - Ahora está en el flujo normal, no absolute */}
            {user && (
              <button
                className="btn btn-primary bg-brown-pc text-white-semi border-none text-sm md:text-lg px-4 py-2"
                onClick={logout}
              >
                Cerrar sesión
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;