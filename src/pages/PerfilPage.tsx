import { useState } from "react";
import { Avatar } from "../components/Avatar";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { RolBadge } from "../components/RolBadge";
import { UsuarioForm } from "../components/UsuarioForm";
import { useAuth } from "../context/AuthContext";
import { useNotificaciones } from "../context/NotificacionesContext";
import type { FormUsuarioValido } from "../types/Usuario";
import { calcularEdad } from "../utils/fechas";
import { formatoFecha } from "../utils/formato";
import { aCambiosPerfil } from "../utils/usuarios";

export const PerfilPage = () => {
  const { usuarioActual, actualizarPerfil } = useAuth();
  const { notificar } = useNotificaciones();
  const [hoy] = useState(() => new Date());

  if (!usuarioActual) return null;

  const guardar = (valores: FormUsuarioValido) => {
    const resultado = actualizarPerfil(aCambiosPerfil(valores));
    if (resultado.ok) notificar("Perfil actualizado correctamente.");
    return resultado;
  };

  return (
    <>
      <PageHeader
        titulo="Mi perfil"
        descripcion="Consulta y edita tus datos personales."
      />

      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-4">
          <Panel className="text-center">
            <Avatar
              genero={usuarioActual.genero}
              nombre={usuarioActual.nombre}
              apellido={usuarioActual.apellido}
              tamano="lg"
            />
            <h2 className="h4 mt-3 mb-1">
              {usuarioActual.nombre} {usuarioActual.apellido}
            </h2>
            <div className="mb-3">
              <RolBadge rol={usuarioActual.rol} />
            </div>
            <ul className="list-unstyled text-start small mb-0">
              <li className="mb-1">
                <strong>Correo:</strong> {usuarioActual.correo}
              </li>
              <li className="mb-1">
                <strong>Edad:</strong>{" "}
                {calcularEdad(usuarioActual.fechaNacimiento, hoy)} años
              </li>
              <li className="mb-1">
                <strong>Región:</strong> {usuarioActual.region}
              </li>
              <li className="mb-1">
                <strong>Dirección:</strong> {usuarioActual.direccion}
              </li>
              <li>
                <strong>Miembro desde:</strong>{" "}
                {formatoFecha(usuarioActual.fechaRegistro)}
              </li>
            </ul>
          </Panel>
        </div>

        <div className="col-12 col-lg-8">
          <Panel titulo="Editar perfil">
            <UsuarioForm
              key={usuarioActual.id}
              modo="perfil"
              usuarioInicial={usuarioActual}
              onSubmit={guardar}
            />
          </Panel>
        </div>
      </div>
    </>
  );
};
