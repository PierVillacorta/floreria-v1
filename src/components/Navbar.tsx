import { Link } from "react-router-dom";
import logo from "../public/logo.jpeg";
const Navbar = () => {
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
        <nav className="-200 m-auto gap  font-bold uppercase ">
          <ul className="flex gap-52">
            <Link to={"/Login"}>
              Login
            </Link>
             <li className="hover:border-b-4">
              <Link to={"/register"}>
                Registrarse
              </Link>
            </li>
            <li className="hover:border-b-4">
              <Link to={"/cart"}>Carrito</Link>
            </li>
            <li className="hover:border-b-4">
             <Link to={"/about"}>Sobre Nosotros</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
