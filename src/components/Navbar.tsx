import { Link } from "react-router-dom";
import logo from "../public/logo.jpeg";
import { useAuth } from "../hooks/useAuth";
const Navbar = () => {
  const { state, logout } = useAuth();
  return (
    <header className="w-full bg-brown-pc ">
      <div className="flex flex-col items-center max-w-7/9 md:flex-row md:items-center mx-auto md:justify-between px-4 py-4">
        <div>
          <Link to={"/"}>
            <img
              src={logo}
              alt="logo_floreria"
              className="w-16 h-16 rounded-xl mb-10 md:mb-0"
            />
          </Link>
        </div>
        <nav className=" m-auto gap font-bold uppercase ">
          <ul className="flex flex-wrap justify-center items-center md:gap-52 gap-3">
            {state.user ? (
              <>
                <li className="text-xl font-semibold gap-2 flex">
                  Hi <p className="font-extrabold">{state.user.name} !</p>
                </li>
                
                  <button
                    className="btn btn-neutral border-none absolute top-7 right-10 bg-amber-950 "
                    onClick={logout}>
                  
                    Cerrar sesión
                  </button>
                
                <li className="border-b-4 border-transparent hover:border-white-semi duration-300 cursor-pointer">
                  <Link to={"/cart"}>Carrito</Link>
                </li>
                <li className="border-b-4 border-transparent hover:border-white-semi duration-300 cursor-pointer">
                  <Link to={"/about"}>Sobre Nosotros</Link>
                </li>
              </>
            ) : (
              <>
                <li className="border-b-4 border-transparent hover:border-white-semi duration-300 cursor-pointer">
                  <Link to={"/Login"}>Login</Link>
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
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
