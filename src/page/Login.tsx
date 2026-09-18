import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types/types";

const Login = () => {
  const { login } = useAuth();
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
  }>();
  const [email, setEmail] = useState<User["email"]>("");
  const [password, setPassword] = useState<User["password"]>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setFeedback({
        success: false,
        message: "Todos los campos son obligatorios",
      });
      return;
    }
    const response = login(email, password);
    setFeedback(response);

    if (response.success) {
      (setEmail(""), setPassword(""));
    }
  };
  useEffect(() => {
    if (!feedback) {
      return;
    }
    if (feedback.success) {
      alert(feedback?.message);
      navigate("/");
    } else {
      alert(feedback?.message);
      (setEmail(""), setPassword(""));
    }
  }, [feedback]);

  return (
    <section className="min-h-screen w-full bg-white-semi px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-brown-pc/60">
            Bienvenido
          </p>
          <h1 className="mt-2 text-4xl font-bold uppercase text-brown-pc">
            Iniciar sesión
          </h1>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-amber-950" />
        </div>

        <form
          onSubmit={handleSubmit}
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
              value={email}
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
              value={password}
              placeholder="••••••••"
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

          {/* Botón */}
          <button
            type="submit"
            className="w-full rounded-lg
                       bg-amber-950 px-5 py-3
                       font-semibold text-white
                       hover:bg-amber-900
                       hover:scale-[1.01]
                       active:scale-95
                       transition-all duration-300
                       cursor-pointer"
          >
            INICIAR SESIÓN
          </button>

          {/* Registro */}
          <p className="mt-6 text-center text-sm text-brown-pc/60">
            ¿No tienes una cuenta?
            <Link
              to={"/register"}
              className="font-semibold text-brown-pc
                         hover:text-amber-900
                         transition-colors duration-300"
            >
              Registrate
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

export default Login;
