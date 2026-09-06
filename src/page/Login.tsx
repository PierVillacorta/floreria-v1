import { Link } from "react-router-dom";
const Login = () => {
  return (
    <section className="min-h-screen w-full bg-white-semi px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-brown-pc/60">
            Bienvenido
          </p>

          <h1 className="mt-2 text-4xl font-bold uppercase text-brown-pc">
            Iniciar sesión
          </h1>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-amber-950" />
        </div>

        {/* Formulario */}
        <form
          className="rounded-2xl border border-amber-900/10
                     bg-white p-8 shadow-sm"
        >
          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-brown-pc"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              className="w-full rounded-lg border border-brown-pc/20
                         bg-white-semi px-4 py-3
                         text-brown-pc
                         outline-none
                         focus:border-brown-pc/60
                         focus:ring-2 focus:ring-brown-pc/10
                         transition-all duration-300"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-brown-pc"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-brown-pc/20
                         bg-white-semi px-4 py-3
                         text-brown-pc
                         outline-none
                         focus:border-brown-pc/60
                         focus:ring-2 focus:ring-brown-pc/10
                         transition-all duration-300"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full rounded-lg
                       bg-amber-950 px-5 py-3
                       font-semibold text-white
                       hover:bg-amber-900
                       hover:scale-[1.01]
                       active:scale-95
                       transition-all duration-300"
          >
            INICIAR SESIÓN
          </button>

          {/* Registro */}
          <p className="mt-6 text-center text-sm text-brown-pc/60">
            ¿No tienes una cuenta?{" "}
            <Link
            to="/Registro"
            className="font-semibold text-brown-pc
             hover:text-amber-900
             transition-colors duration-300"
  >
   Regístrate
</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
