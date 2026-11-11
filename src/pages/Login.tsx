import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

import type { User } from "../types/types";
import { useAuthStore, type AuhtResponse } from "../store/authStore";
import { isValidEmail, isValidPassword } from "../utils/Validators";

export const Login = () => {
  const { login,loginWithGoogle } = useAuthStore();
  
  const [feedback, setFeedback] = useState<AuhtResponse>();
  const [email, setEmail] = useState<User["email"]>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
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
    const response = await login(email, password);
    setFeedback(response);

    if (!response.success) {
      (setEmail(""), setPassword(""));
    }
  };
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
  if (!credentialResponse.credential) {
    setFeedback({ success: false, message: "Google no entregó credenciales" });
    return;
  }
  const response = await loginWithGoogle(credentialResponse.credential);
  setFeedback(response);
};
  useEffect(() => {
    if (!feedback) {
      return;
    }
    if (feedback.success) {
      alert(feedback?.message);
      navigate("/");
    } else {
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
                       transition-all duration-300
                       cursor-pointer"
          >
            INICIAR SESIÓN
          </button>

          {/* Registro */}
          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-brown-pc/40">
              <span className="h-px flex-1 bg-brown-pc/10" />
              o
              <span className="h-px flex-1 bg-brown-pc/10" />
          </div>

          <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  setFeedback({ success: false, message: "No se pudo iniciar sesión con Google" })
                }
                text="continue_with"
              />
          </div>
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

    </section>
  );
};
