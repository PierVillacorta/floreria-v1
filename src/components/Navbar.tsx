import { Link } from "react-router-dom";
import logo from "../public/logo.jpeg";
import { useAuth } from "../hooks/useAuth";
const Navbar = () => {
  const { state, logout } = useAuth();
  return (
    <header className="h-25 bg-brown-pc flex  items-center">
      <div className="w-7/8 m-auto flex justify-between">
        <div>
          <Link to={"/"}>
            <img
              src={logo}
              alt="logo_floreria"
              className="w-16 h-16 rounded-xl"
            />
          </Link>
        </div>
        <nav className="-200 m-auto gap font-bold uppercase ">
          <ul className="flex gap-52">
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
