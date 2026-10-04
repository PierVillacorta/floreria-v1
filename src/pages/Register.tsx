import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../types/types";
import { useAuthStore, type AuhtResponse } from "../store/authStore";
import { isValidEmail, isValidPassword } from "../utils/Validators";

const Register = () => {
  const { register } = useAuthStore();
  const [feedback, setFeedback] = useState<AuhtResponse>();
  const [name, setName] = useState<User["full_name"]>("");
  const [email, setEmail] = useState<User["email"]>("");
  const [password, setPassword] = useState<User["password_hash"]>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setFeedback({
        success: false,
        message: "Todos los campos son obligatorios",
      });
      return;
    }
    if (!isValidEmail(email)) {
      setFeedback({
        success: false,
        message:
          "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com",
      });
      return;
    }
    if (!isValidPassword(password)) {
      setFeedback({
        success: false,
        message: "La contraseña debe tener entre 4 y 10 caracteres",
      });
      return;
    }
    const response = await register(name, email, password);
    setFeedback(response);

    if (!response.success) {
      (setName(""), setEmail(""), setPassword(""));
    }
  };
  useEffect(() => {
    if (!feedback) return;
    if (feedback.success) navigate("/login");
  }, [feedback]);

  return (
    <section className="min-h-screen w-full bg-white-semi px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-brown-pc/60">
            Bienvenido
          </p>
          <h1 className="mt-2 text-4xl font-bold uppercase text-brown-pc">
            REGISTRATE
          </h1>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-amber-950" />
        </div>

        <form
          className="rounded-2xl border border-amber-900/10 bg-white p-8 shadow-sm"
          onSubmit={handleSubmit}
        >
          {/* nombre del usuario */}
          <div className="mb-5">
            <label
              htmlFor="text"
              className="mb-2 block text-sm font-semibold text-brown-pc"
            >
              Nombre
            </label>

            <input
              id="text"
              type="text"
              value={name}
              placeholder="Ingresa tu nombre"
              className="w-full rounded-lg border border-brown-pc/20
                         bg-white-semi px-4 py-3
                         text-brown-pc
                         outline-none
                         focus:border-brown-pc/60
                         focus:ring-2 focus:ring-brown-pc/10
                         transition-all duration-300"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>

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
              value={email}
              placeholder="tu@email.com"
              className="w-full rounded-lg border border-brown-pc/20
                         bg-white-semi px-4 py-3
                         text-brown-pc
                         outline-none
                         focus:border-brown-pc/60
                         focus:ring-2 focus:ring-brown-pc/10
                         transition-all duration-300"
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              className="w-full rounded-lg border border-brown-pc/20
                         bg-white-semi px-4 py-3
                         text-brown-pc
                         outline-none
                         focus:border-brown-pc/60
                         focus:ring-2 focus:ring-brown-pc/10
                         transition-all duration-300"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {feedback && !feedback.success && (
            <p className="text-red-500 text-sm font-semibold text-center mb-2">
              {feedback.message}
            </p>
          )}
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
            REGISTRARSE
          </button>

          {/* Registro */}
          <p className="mt-6 text-center text-sm text-brown-pc/60">
            ¿tienes una cuenta?
            <Link
              to={"/login"}
              className="font-semibold text-brown-pc
                         hover:text-amber-900
                         transition-colors duration-300"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
      <Link
        to="/"
        className="absolute top-6 left-10 items-center gap-2 text-sm font-semibold
          uppercase tracking-wider text-brown-pc/60
          transition-colors duration-300 hover:text-amber-950"
      >
        ← Volver a la tienda
      </Link>
    </section>
  );
};

export default Register;
