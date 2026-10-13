import { useAuth } from "../context/AuthContext";
import { useNavegacion } from "../context/NavegacionContext";
import { Panel } from "./Panel";

/** Se muestra cuando se intenta entrar a una sección que el rol actual no puede usar. */
export const AccesoDenegado = () => {
  const { usuarioActual } = useAuth();
  const { navegar } = useNavegacion();

  return (
    <Panel titulo="Acceso restringido">
      {usuarioActual ? (
        <p>Tu rol no tiene permisos para ver esta sección.</p>
      ) : (
        <p>Debes iniciar sesión para ver esta sección.</p>
      )}
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navegar({ nombre: "inicio" })}
        >
          Ir al inicio
        </button>
        {!usuarioActual && (
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => navegar({ nombre: "login" })}
          >
            Iniciar sesión
          </button>
        )}
      </div>
    </Panel>
  );
};
