import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { UsuarioForm } from "../components/UsuarioForm";
import { useAuth } from "../context/AuthContext";
import { useNavegacion } from "../context/NavegacionContext";
import { useNotificaciones } from "../context/NotificacionesContext";
import type { FormUsuarioValido } from "../types/Usuario";
import { aDatosUsuario } from "../utils/usuarios";

export const RegistroPage = () => {
  const { usuarioActual, registrar } = useAuth();
  const { navegar } = useNavegacion();
  const { notificar } = useNotificaciones();

  if (usuarioActual) {
    return (
      <Panel titulo="Ya tienes una sesión activa">
        <p>Cierra tu sesión actual si deseas registrar una cuenta nueva.</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navegar({ nombre: "inicio" })}
        >
          Ir al inicio
        </button>
      </Panel>
    );
  }

  // El registro público siempre crea una cuenta de cliente (lo garantiza el contexto)
  const registrarCliente = (valores: FormUsuarioValido) => {
    const resultado = registrar(aDatosUsuario(valores));
    if (resultado.ok) {
      notificar("¡Registro exitoso! Ya puedes iniciar sesión.");
      navegar({ nombre: "login" });
    }
    return resultado;
  };

  return (
    <>
      <PageHeader
        titulo="Registro de usuario"
        descripcion="Completa el formulario para crear tu cuenta de cliente. Solo correos @duoc.cl."
      />
      <div className="row justify-content-center">
        <div className="col-12 col-xl-9">
          <Panel>
            <UsuarioForm modo="registro" onSubmit={registrarCliente} />
            <p className="mt-3 mb-0">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                className="btn btn-link p-0 align-baseline"
                onClick={() => navegar({ nombre: "login" })}
              >
                Inicia sesión aquí
              </button>
            </p>
          </Panel>
        </div>
      </div>
    </>
  );
};
