import { useState } from "react";
import { ConfirmModal } from "../components/ConfirmModal";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { UsuarioForm } from "../components/UsuarioForm";
import { UsuariosTabla } from "../components/UsuariosTabla";
import { useAuth } from "../context/AuthContext";
import { useNotificaciones } from "../context/NotificacionesContext";
import type { FormUsuarioValido, UsuarioPublico } from "../types/Usuario";
import { etiquetaRol } from "../utils/permisos";
import { aCambiosUsuario, aDatosUsuario } from "../utils/usuarios";

/**
 * Administrador: crea, consulta, modifica y elimina usuarios (todos los roles).
 * Vendedor: solo ve el formulario y únicamente puede crear clientes.
 */
export const UsuariosPage = () => {
  const {
    usuarios,
    usuarioActual,
    permisos,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    estaBloqueado,
    desbloquear,
  } = useAuth();
  const { notificar } = useNotificaciones();
  const [editando, setEditando] = useState<UsuarioPublico | null>(null);
  const [porEliminar, setPorEliminar] = useState<UsuarioPublico | null>(null);

  const guardar = (valores: FormUsuarioValido) => {
    if (editando) {
      const resultado = actualizarUsuario(editando.id, aCambiosUsuario(valores));
      if (resultado.ok) {
        notificar(`Usuario ${valores.nombre} actualizado correctamente.`);
        setEditando(null);
      }
      return resultado;
    }
    const resultado = crearUsuario(aDatosUsuario(valores), valores.rol);
    if (resultado.ok) {
      notificar(
        `Usuario ${valores.nombre} creado con rol ${etiquetaRol[valores.rol]}.`,
      );
    }
    return resultado;
  };

  const confirmarEliminar = () => {
    if (!porEliminar) return;
    const resultado = eliminarUsuario(porEliminar.id);
    if (resultado.ok) {
      notificar(`Usuario ${porEliminar.nombre} eliminado.`, "info");
      if (editando?.id === porEliminar.id) setEditando(null);
    } else {
      notificar(resultado.error, "danger");
    }
    setPorEliminar(null);
  };

  const quitarBloqueo = (usuario: UsuarioPublico) => {
    const resultado = desbloquear(usuario.correo);
    if (resultado.ok) {
      notificar(`Cuenta de ${usuario.nombre} desbloqueada.`);
    } else {
      notificar(resultado.error, "danger");
    }
  };

  const puedeVerListado = permisos.verGestionUsuarios;

  const formulario = (
    <Panel titulo={editando ? "Editar usuario" : "Crear usuario"}>
      {!puedeVerListado && (
        <div className="alert alert-info" role="status">
          Como vendedor puedes crear únicamente cuentas con rol cliente.
        </div>
      )}
      <UsuarioForm
        key={editando?.id ?? "nuevo"}
        modo={editando ? "editar" : "crear"}
        usuarioInicial={editando ?? undefined}
        rolesDisponibles={permisos.rolesAsignables}
        rolFijo={editando?.id === usuarioActual?.id}
        compacto={puedeVerListado}
        onSubmit={guardar}
        onCancelar={editando ? () => setEditando(null) : undefined}
      />
    </Panel>
  );

  return (
    <>
      <PageHeader
        titulo={puedeVerListado ? "Gestión de usuarios" : "Crear cliente"}
        descripcion={
          puedeVerListado
            ? "Crea, consulta, modifica y elimina usuarios, y asigna sus roles."
            : "Registra nuevas cuentas de cliente."
        }
      />

      {puedeVerListado ? (
        <div className="row g-4 align-items-start">
          <div className="col-12 col-xl-5">{formulario}</div>
          <div className="col-12 col-xl-7">
            <Panel titulo={`Usuarios (${usuarios.length})`}>
              <UsuariosTabla
                usuarios={usuarios}
                usuarioActualId={usuarioActual?.id}
                estaBloqueado={estaBloqueado}
                onEditar={(usuario) => {
                  setEditando(usuario);
                  window.scrollTo({ top: 0 });
                }}
                onEliminar={setPorEliminar}
                onDesbloquear={quitarBloqueo}
              />
            </Panel>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12 col-xl-9">{formulario}</div>
        </div>
      )}

      <ConfirmModal
        abierto={porEliminar !== null}
        titulo="Eliminar usuario"
        mensaje={`¿Seguro que deseas eliminar a ${porEliminar?.nombre ?? ""} ${porEliminar?.apellido ?? ""}? Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
};
