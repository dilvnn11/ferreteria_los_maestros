import { useState, type FormEvent } from "react";
import { useNotificaciones } from "../context/NotificacionesContext";
import { validarContacto, type ErroresContacto } from "../utils/validaciones";
import { CampoTexto } from "./CampoTexto";
import { CampoTextarea } from "./CampoTextarea";

export const ContactoForm = () => {
  const { notificar } = useNotificaciones();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState<ErroresContacto>({});

  const enviar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nuevos = validarContacto(nombre, correo, mensaje);
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    notificar("¡Gracias por tu consulta! Nos pondremos en contacto pronto.");
    setNombre("");
    setCorreo("");
    setMensaje("");
  };

  return (
    <form onSubmit={enviar} noValidate>
      <CampoTexto
        id="nombreContacto"
        label="Nombre"
        value={nombre}
        onChange={setNombre}
        error={errores.nombre}
        requerido
      />
      <CampoTexto
        id="correoContacto"
        label="Correo"
        type="email"
        value={correo}
        onChange={setCorreo}
        error={errores.correo}
        requerido
      />
      <CampoTextarea
        id="mensajeContacto"
        label="Mensaje"
        value={mensaje}
        onChange={setMensaje}
        error={errores.mensaje}
        requerido
      />
      <button type="submit" className="btn btn-primary">
        Enviar consulta
      </button>
    </form>
  );
};
