import type { UsuarioPublico } from "../types/Usuario";
import { Avatar } from "./Avatar";
import { RolBadge } from "./RolBadge";

interface UsuariosTablaProps {
  usuarios: UsuarioPublico[];
  usuarioActualId: string | undefined;
  estaBloqueado: (correo: string) => boolean;
  onEditar: (usuario: UsuarioPublico) => void;
  onEliminar: (usuario: UsuarioPublico) => void;
  onDesbloquear: (usuario: UsuarioPublico) => void;
}

export const UsuariosTabla = ({
  usuarios,
  usuarioActualId,
  estaBloqueado,
  onEditar,
  onEliminar,
  onDesbloquear,
}: UsuariosTablaProps) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle tabla-gestion">
        <thead>
          <tr>
            <th scope="col">Usuario</th>
            <th scope="col">Rol</th>
            <th scope="col" className="d-none d-md-table-cell">Región</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => {
            const esUnoMismo = usuario.id === usuarioActualId;
            const bloqueado = estaBloqueado(usuario.correo);
            return (
              <tr key={usuario.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <Avatar
                      genero={usuario.genero}
                      nombre={usuario.nombre}
                      apellido={usuario.apellido}
                    />
                    <div>
                      <div className="fw-semibold">
                        {usuario.nombre} {usuario.apellido}
                        {esUnoMismo && (
                          <span className="badge text-bg-secondary ms-2">Tú</span>
                        )}
                        {bloqueado && (
                          <span className="badge text-bg-danger ms-2">Bloqueado</span>
                        )}
                      </div>
                      <small className="text-muted">{usuario.correo}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <RolBadge rol={usuario.rol} />
                </td>
                <td className="d-none d-md-table-cell">{usuario.region}</td>
                <td>
                  <div className="d-flex flex-wrap gap-1">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => onEditar(usuario)}
                    >
                      Editar
                    </button>
                    {bloqueado && (
                      <button
                        type="button"
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => onDesbloquear(usuario)}
                      >
                        Desbloquear
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      disabled={esUnoMismo}
                      title={
                        esUnoMismo ? "No puedes eliminar tu propia cuenta" : undefined
                      }
                      onClick={() => onEliminar(usuario)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
