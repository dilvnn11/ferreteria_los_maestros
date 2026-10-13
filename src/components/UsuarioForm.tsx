import { useState, type FormEvent } from "react";
import { generos, roles } from "../data/usuarios";
import { regiones } from "../data/regiones";
import { useAuth } from "../context/AuthContext";
import type { Resultado } from "../types/Resultado";
import type {
  FormUsuario,
  FormUsuarioValido,
  ModoUsuarioForm,
  Rol,
  UsuarioPublico,
} from "../types/Usuario";
import { calcularEdad, fechaHoyISO } from "../utils/fechas";
import { validarFormUsuario, type ErroresUsuario } from "../utils/validaciones";
import { CampoSelect } from "./CampoSelect";
import { CampoTexto } from "./CampoTexto";
import { RolBadge } from "./RolBadge";

interface UsuarioFormProps {
  /** registro (público) | crear (administración) | editar (administración) | perfil (propio) */
  modo: ModoUsuarioForm;
  usuarioInicial?: UsuarioPublico;
  /** Roles que el usuario actual puede asignar (modos crear y editar). */
  rolesDisponibles?: Rol[];
  /** Impide cambiar el rol (por ejemplo, al editarse a sí mismo). */
  rolFijo?: boolean;
  /** Una sola columna de campos (cuando el formulario va en un panel angosto). */
  compacto?: boolean;
  onSubmit: (valores: FormUsuarioValido) => Resultado;
  onCancelar?: () => void;
}

const textoBoton: Record<ModoUsuarioForm, string> = {
  registro: "Registrarse",
  crear: "Crear usuario",
  editar: "Guardar cambios",
  perfil: "Guardar perfil",
};

const valoresIniciales = (usuario?: UsuarioPublico): FormUsuario => ({
  nombre: usuario?.nombre ?? "",
  apellido: usuario?.apellido ?? "",
  fechaNacimiento: usuario?.fechaNacimiento ?? "",
  correo: usuario?.correo ?? "",
  password: "",
  confirmPassword: "",
  direccion: usuario?.direccion ?? "",
  region: usuario?.region ?? "",
  genero: usuario?.genero ?? "",
  terminos: false,
  rol: usuario?.rol ?? "cliente",
});

/**
 * Formulario único para registrar, crear, editar y editar el perfil de un usuario.
 * Todos los campos son controlados y las validaciones se muestran junto a cada campo.
 */
export const UsuarioForm = ({
  modo,
  usuarioInicial,
  rolesDisponibles = [],
  rolFijo = false,
  compacto = false,
  onSubmit,
  onCancelar,
}: UsuarioFormProps) => {
  const { usuarios } = useAuth();
  const [valores, setValores] = useState<FormUsuario>(() =>
    valoresIniciales(usuarioInicial),
  );
  const [errores, setErrores] = useState<ErroresUsuario>({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [hoy] = useState(() => new Date());

  const actualizar = <K extends keyof FormUsuario>(
    campo: K,
    valor: FormUsuario[K],
  ) => {
    setValores((actuales) => ({ ...actuales, [campo]: valor }));
    setErrores((actuales) => ({ ...actuales, [campo]: undefined }));
    setErrorGeneral("");
  };

  const manejarEnvio = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nuevos = validarFormUsuario(
      valores,
      modo,
      usuarios,
      new Date(),
      usuarioInicial?.id,
    );
    setErrores(nuevos);
    if (Object.values(nuevos).some(Boolean) || valores.genero === "") {
      setErrorGeneral("Revisa los campos marcados en rojo.");
      return;
    }

    const resultado = onSubmit({ ...valores, genero: valores.genero });
    if (!resultado.ok) {
      setErrorGeneral(resultado.error);
      return;
    }
    if (modo === "registro" || modo === "crear") {
      setValores(valoresIniciales());
    }
  };

  const edad = calcularEdad(valores.fechaNacimiento, hoy);
  const edadValida = valores.fechaNacimiento !== "" && edad >= 0;
  const claseColumna = compacto ? "col-12" : "col-12 col-md-6";
  const pideClave = modo === "registro" || modo === "crear" || modo === "editar";
  const editandoClave = modo === "editar";
  const opcionesRol = roles.filter((r) => rolesDisponibles.includes(r.valor));

  return (
    <form onSubmit={manejarEnvio} noValidate>
      {errorGeneral && (
        <div className="alert alert-danger" role="alert">
          {errorGeneral}
        </div>
      )}

      <div className="row">
        <div className={claseColumna}>
          <CampoTexto
            id={`${modo}-nombre`}
            label="Nombre"
            value={valores.nombre}
            onChange={(v) => actualizar("nombre", v)}
            error={errores.nombre}
            requerido
          />
        </div>
        <div className={claseColumna}>
          <CampoTexto
            id={`${modo}-apellido`}
            label="Apellido"
            value={valores.apellido}
            onChange={(v) => actualizar("apellido", v)}
            error={errores.apellido}
            requerido
          />
        </div>
        <div className={claseColumna}>
          <CampoTexto
            id={`${modo}-fecha`}
            label="Fecha de nacimiento"
            type="date"
            value={valores.fechaNacimiento}
            max={fechaHoyISO(hoy)}
            onChange={(v) => actualizar("fechaNacimiento", v)}
            error={errores.fechaNacimiento}
            ayuda={edadValida ? `Edad: ${edad} años` : undefined}
            requerido
          />
        </div>
        <div className={claseColumna}>
          <CampoTexto
            id={`${modo}-correo`}
            label="Correo electrónico (@duoc.cl)"
            type="email"
            value={valores.correo}
            placeholder="ejemplo@duoc.cl"
            onChange={(v) => actualizar("correo", v)}
            error={errores.correo}
            autoComplete="email"
            requerido
          />
        </div>

        {pideClave && (
          <>
            <div className={claseColumna}>
              <CampoTexto
                id={`${modo}-password`}
                label={editandoClave ? "Nueva contraseña" : "Contraseña"}
                type="password"
                value={valores.password}
                onChange={(v) => actualizar("password", v)}
                error={errores.password}
                ayuda={
                  editandoClave
                    ? "Déjala en blanco para conservar la actual."
                    : "Mínimo 8 caracteres, 1 mayúscula y 1 número"
                }
                autoComplete="new-password"
                requerido={!editandoClave}
              />
            </div>
            <div className={claseColumna}>
              <CampoTexto
                id={`${modo}-confirmar`}
                label="Confirmar contraseña"
                type="password"
                value={valores.confirmPassword}
                onChange={(v) => actualizar("confirmPassword", v)}
                error={errores.confirmPassword}
                autoComplete="new-password"
                requerido={!editandoClave}
              />
            </div>
          </>
        )}

        <div className={compacto ? "col-12" : "col-12 col-md-8"}>
          <CampoTexto
            id={`${modo}-direccion`}
            label="Dirección"
            value={valores.direccion}
            onChange={(v) => actualizar("direccion", v)}
            error={errores.direccion}
            autoComplete="street-address"
            requerido
          />
        </div>
        <div className={compacto ? "col-12" : "col-12 col-md-4"}>
          <CampoSelect
            id={`${modo}-region`}
            label="Región"
            value={valores.region}
            placeholder="Seleccione una región"
            opciones={regiones.map((r) => ({ valor: r, etiqueta: r }))}
            onChange={(v) => actualizar("region", v)}
            error={errores.region}
            requerido
          />
        </div>
      </div>

      <fieldset className="mb-3">
        <legend className="form-label fw-semibold fs-6">Género *</legend>
        {generos.map((genero) => (
          <div className="form-check form-check-inline" key={genero}>
            <input
              id={`${modo}-genero-${genero}`}
              className={`form-check-input ${errores.genero ? "is-invalid" : ""}`}
              type="radio"
              name={`${modo}-genero`}
              value={genero}
              checked={valores.genero === genero}
              onChange={() => actualizar("genero", genero)}
            />
            <label
              className="form-check-label"
              htmlFor={`${modo}-genero-${genero}`}
            >
              {genero}
            </label>
          </div>
        ))}
        {errores.genero && (
          <div className="text-danger small mt-1">{errores.genero}</div>
        )}
      </fieldset>

      {(modo === "crear" || modo === "editar") && (
        <CampoSelect
          id={`${modo}-rol`}
          label="Rol"
          value={valores.rol}
          opciones={opcionesRol.map((r) => ({
            valor: r.valor,
            etiqueta: r.etiqueta,
          }))}
          onChange={(v) => actualizar("rol", v as Rol)}
          deshabilitado={rolFijo || opcionesRol.length <= 1}
          ayuda={
            rolFijo
              ? "No puedes cambiar tu propio rol."
              : opcionesRol.length <= 1
                ? "Con tu rol solo puedes crear cuentas de cliente."
                : undefined
          }
          requerido
        />
      )}

      {modo === "perfil" && usuarioInicial && (
        <div className="mb-3">
          <span className="form-label fw-semibold d-block">Rol</span>
          <RolBadge rol={usuarioInicial.rol} />
          <div className="form-text">
            El rol no se puede modificar desde el perfil.
          </div>
        </div>
      )}

      {modo === "registro" && (
        <div className="form-check mb-3">
          <input
            id="registro-terminos"
            type="checkbox"
            className={`form-check-input ${errores.terminos ? "is-invalid" : ""}`}
            checked={valores.terminos}
            onChange={(event) => actualizar("terminos", event.target.checked)}
          />
          <label className="form-check-label" htmlFor="registro-terminos">
            Acepto los términos y condiciones del registro *
          </label>
          {errores.terminos && (
            <div className="invalid-feedback">{errores.terminos}</div>
          )}
        </div>
      )}

      <div className="d-flex flex-wrap gap-2">
        <button type="submit" className="btn btn-primary">
          {textoBoton[modo]}
        </button>
        {onCancelar && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancelar}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
