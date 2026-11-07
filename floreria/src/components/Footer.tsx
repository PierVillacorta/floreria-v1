import { Link } from "react-router-dom";

export const Footer = () => {
  const styleLink = "link link-hover hover:text-amber-200 transition-colors"
  return (
    <footer className="footer sm:footer-horizontal bg-brown-pc text-white-semi p-10">
      <aside className="space-y-2">
        <h2 className="text-2xl font-bold uppercase tracking-wider text-amber-200">
          🌸 Florería
        </h2>
        <p className="text-sm opacity-80 max-w-xs leading-relaxed">
          Arreglos florales frescos y detalles pensados para cada momento especial.
        </p>
      </aside>


      <nav className="flex flex-col space-y-1">
        <h6 className="footer-title text-amber-200 uppercase text-xs font-bold tracking-widest opacity-100 mb-2">
          Secciones
        </h6>
        <Link to="/" className={styleLink}>
          Inicio
        </Link>
        <Link to="/categories" className={styleLink}>
          Categorías
        </Link>
        <Link to="/offers" className={styleLink}>
          Ofertas
        </Link>
        <Link to="/blogs" className={styleLink}>
          Blog
        </Link>
      </nav>

      {/* Conocenos */}
      <nav className="flex flex-col space-y-1">
        <h6 className="footer-title text-amber-200 uppercase text-xs font-bold tracking-widest opacity-100 mb-2">
          Nosotros
        </h6>
        <Link to="/about" className={styleLink}>
          Quiénes somos
        </Link>
        <Link to="/login" className={styleLink}>
          Iniciar sesión
        </Link>
        <Link to="/register" className={styleLink}>
          Registrarse
        </Link>
      </nav>

      {/* Contáctanos */}
      <nav className="flex flex-col space-y-2">
        <h6 className="footer-title text-amber-200 uppercase text-xs font-bold  opacity-100 ">
          Contáctanos
        </h6>
        <a 
          href="tel:+56912345678" 
          className="link link-hover hover:text-amber-200 transition-colors flex items-center gap-2"
        >
          <span>📞</span> +56 9 1234 5678
        </a>
        <a 
          href="https://wa.me/56912345678" 
          target="_blank" 
          rel="noopener noreferrer"
          className="link link-hover hover:text-amber-200 transition-colors flex items-center gap-2"
        >
          <span>💬</span> WhatsApp Directo
        </a>
        <a 
          href="mailto:contacto@floreria.com" 
          className="link link-hover hover:text-amber-200 transition-colors flex items-center gap-2"
        >
          <span>✉️</span> contacto@floreria.com
        </a>
      </nav>
    </footer>
  );
};
