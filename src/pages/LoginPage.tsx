import { useState, type FormEvent } from "react";
import { CampoTexto } from "../components/CampoTexto";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { RolBadge } from "../components/RolBadge";
import { useAuth } from "../context/AuthContext";
import { useNavegacion } from "../context/NavegacionContext";
import { useNotificaciones } from "../context/NotificacionesContext";
import { cuentasDemo } from "../data/cuentasDemo";

export const LoginPage = () => {
  const { usuarioActual, iniciarSesion } = useAuth();
  const { navegar } = useNavegacion();
  const { notificar } = useNotificaciones();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (usuarioActual) {
    return (
      <Panel titulo="Ya iniciaste sesión">
        <p>
          Estás conectado como{" "}
          <strong>
            {usuarioActual.nombre} {usuarioActual.apellido}
          </strong>
          .
        </p>
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

  const manejarEnvio = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const resultado = iniciarSesion(correo, password);
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    notificar(`¡Bienvenido/a, ${resultado.datos.nombre}!`);
    navegar({ nombre: "inicio" });
  };

  return (
    <>
      <PageHeader
        titulo="Iniciar sesión"
        descripcion="Ingresa con tu correo @duoc.cl y contraseña."
      />

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <Panel>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={manejarEnvio} noValidate>
              <CampoTexto
                id="login-correo"
                label="Correo electrónico"
                type="email"
                value={correo}
                placeholder="ejemplo@duoc.cl"
                autoComplete="email"
                onChange={(valor) => {
                  setCorreo(valor);
                  setError("");
                }}
                requerido
              />
              <CampoTexto
                id="login-password"
                label="Contraseña"
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(valor) => {
                  setPassword(valor);
                  setError("");
                }}
                requerido
              />
              <button type="submit" className="btn btn-primary">
                Ingresar
              </button>
            </form>
            <p className="mt-3 mb-0">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                className="btn btn-link p-0 align-baseline"
                onClick={() => navegar({ nombre: "registro" })}
              >
                Regístrate aquí
              </button>
            </p>
          </Panel>
        </div>

        <div className="col-12 col-lg-6">
          <Panel titulo="Cuentas de demostración">
            <p className="small text-muted">
              Simulación académica: las credenciales se guardan en LocalStorage
              y no constituyen un sistema de seguridad real.
            </p>
            <ul className="list-group">
              {cuentasDemo.map((cuenta) => (
                <li
                  key={cuenta.correo}
                  className="list-group-item d-flex flex-wrap justify-content-between align-items-center gap-2"
                >
                  <div>
                    <RolBadge rol={cuenta.rol} />
                    <div className="small mt-1">{cuenta.correo}</div>
                    <div className="small text-muted">{cuenta.password}</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      setCorreo(cuenta.correo);
                      setPassword(cuenta.password);
                      setError("");
                    }}
                  >
                    Usar
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
};
