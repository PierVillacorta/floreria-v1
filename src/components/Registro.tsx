import { useState } from "react";
import { Link } from "react-router-dom";
import "./registro.css";


interface Usuario {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
}

function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [mensaje, setMensaje] = useState("");

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};

   
    if (nombre.trim() === "") {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

    
    if (apellido.trim() === "") {
      nuevosErrores.apellido = "El apellido es obligatorio";
    }

   
    if (correo.trim() === "") {
      nuevosErrores.correo = "El correo es obligatorio";
    } else if (
      !correo.endsWith("@duoc.cl") &&
      !correo.endsWith("@profesor.duoc.cl") &&
      !correo.endsWith("@gmail.com")
    ) {
      nuevosErrores.correo =
        "El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com";
    }

    
    if (password.trim() === "") {
      nuevosErrores.password = "La contraseña es obligatoria";
    } else if (password.length < 4 || password.length > 10) {
      nuevosErrores.password =
        "La contraseña debe tener entre 4 y 10 caracteres";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const registrarUsuario = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMensaje("");

    if (!validarFormulario()) {
      return;
    }

    const nuevoUsuario: Usuario = {
      nombre,
      apellido,
      correo,
      password,
    };

    const usuariosGuardados: Usuario[] =
      JSON.parse(localStorage.getItem("usuarios") || "[]");

  
    const usuarioExiste = usuariosGuardados.some(
      (usuario) => usuario.correo === correo
    );

    if (usuarioExiste) {
      setErrores({
        correo: "Este correo ya está registrado",
      });
      return;
    }

    
    usuariosGuardados.push(nuevoUsuario);

    localStorage.setItem(
      "usuarios",
      JSON.stringify(usuariosGuardados)
    );

    setMensaje("Usuario registrado correctamente");

   
    setNombre("");
    setApellido("");
    setCorreo("");
    setPassword("");
    setErrores({});
  };

  return (
    <div 
    className="registro-container">
      <h1>Crear cuenta</h1>

      <form onSubmit={registrarUsuario}>

        {/* Nombre */}
        <div className="campo">
          <label htmlFor="nombre">Nombre</label>

          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa tu nombre"
          />

          {errores.nombre && (
            <p className="error">{errores.nombre}</p>
          )}
        </div>

        {/* Apellido */}
        <div className="campo">
          <label htmlFor="apellido">Apellido</label>

          <input
            id="apellido"
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            placeholder="Ingresa tu apellido"
          />

          {errores.apellido && (
            <p className="error">{errores.apellido}</p>
          )}
        </div>

        {/* Correo */}
        <div className="campo">
          <label htmlFor="correo">Correo electrónico</label>

          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="ejemplo@gmail.com"
            maxLength={100}
          />

          {errores.correo && (
            <p className="error">{errores.correo}</p>
          )}
        </div>

        {/* Contraseña */}
        <div className="campo">
          <label htmlFor="password">Contraseña</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entre 4 y 10 caracteres"
          />

          {errores.password && (
            <p className="error">{errores.password}</p>
          )}
        </div>

      <button type="submit">
        Registrarse
      </button>

      <div className="volver-home">
      <Link to="/">
        Volver al inicio
      </Link>
  </div>

  {mensaje && (
   <p className="exito">{mensaje}</p>
)}

      </form>
    </div>
  );
}

export default Registro;
