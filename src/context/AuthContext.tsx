import { createContext, useContext, useMemo, type ReactNode } from "react";
import { usuariosIniciales } from "../data/usuarios";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Permisos } from "../types/Permisos";
import type { Resultado } from "../types/Resultado";
import type {
  CambiosPerfil,
  CambiosUsuario,
  DatosUsuario,
  Rol,
  Usuario,
  UsuarioPublico,
} from "../types/Usuario";
import { permisosDe } from "../utils/permisos";
import { exito, exitoVacio, fallo } from "../utils/resultado";

const MAX_INTENTOS = 3;

interface AuthContextType {
  usuarios: UsuarioPublico[];
  usuarioActual: UsuarioPublico | null;
  permisos: Permisos;
  iniciarSesion: (correo: string, password: string) => Resultado<UsuarioPublico>;
  cerrarSesion: () => void;
  registrar: (datos: DatosUsuario) => Resultado;
  crearUsuario: (datos: DatosUsuario, rol: Rol) => Resultado;
  actualizarUsuario: (id: string, cambios: CambiosUsuario) => Resultado;
  actualizarPerfil: (cambios: CambiosPerfil) => Resultado;
  eliminarUsuario: (id: string) => Resultado;
  estaBloqueado: (correo: string) => boolean;
  desbloquear: (correo: string) => Resultado;
}

const AuthContext = createContext<AuthContextType | null>(null);

// La contraseña nunca sale del contexto: los componentes reciben UsuarioPublico
const aPublico = (u: Usuario): UsuarioPublico => ({
  id: u.id,
  nombre: u.nombre,
  apellido: u.apellido,
  fechaNacimiento: u.fechaNacimiento,
  correo: u.correo,
  direccion: u.direccion,
  region: u.region,
  genero: u.genero,
  rol: u.rol,
  fechaRegistro: u.fechaRegistro,
});

const normalizarCorreo = (correo: string) => correo.trim().toLowerCase();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuarios, setUsuarios] = useLocalStorage<Usuario[]>(
    "ferreteria:usuarios",
    usuariosIniciales,
  );
  const [sesionId, setSesionId] = useLocalStorage<string | null>(
    "ferreteria:sesion",
    null,
  );
  const [intentos, setIntentos] = useLocalStorage<Record<string, number>>(
    "ferreteria:intentos",
    {},
  );

  const usuariosPublicos = useMemo(() => usuarios.map(aPublico), [usuarios]);
  // La sesión guarda solo el id: si el usuario cambia, la sesión refleja el cambio
  const usuarioActual =
    usuariosPublicos.find((u) => u.id === sesionId) ?? null;
  const rolActual = usuarioActual?.rol ?? null;
  const permisos = useMemo(() => permisosDe(rolActual), [rolActual]);

  const correoEnUso = (correo: string, idExcluido?: string) =>
    usuarios.some(
      (u) => u.correo === normalizarCorreo(correo) && u.id !== idExcluido,
    );

  const estaBloqueado = (correo: string) =>
    (intentos[normalizarCorreo(correo)] ?? 0) >= MAX_INTENTOS;

  const iniciarSesion = (correo: string, password: string) => {
    const clave = normalizarCorreo(correo);
    if (!clave || !password) {
      return fallo("Debes completar correo y contraseña.");
    }
    if (estaBloqueado(clave)) {
      return fallo(
        "Esta cuenta está bloqueada por demasiados intentos fallidos. Contacta al administrador.",
      );
    }

    const usuario = usuarios.find(
      (u) => u.correo === clave && u.password === password,
    );

    if (usuario) {
      const copia = { ...intentos };
      delete copia[clave];
      setIntentos(copia);
      setSesionId(usuario.id);
      return exito(aPublico(usuario));
    }

    const total = (intentos[clave] ?? 0) + 1;
    setIntentos({ ...intentos, [clave]: total });
    const restantes = MAX_INTENTOS - total;
    return fallo(
      restantes <= 0
        ? "Cuenta bloqueada por 3 intentos fallidos consecutivos."
        : `Credenciales incorrectas. Te quedan ${restantes} intento(s).`,
    );
  };

  const cerrarSesion = () => setSesionId(null);

  const construirUsuario = (datos: DatosUsuario, rol: Rol): Usuario => ({
    ...datos,
    nombre: datos.nombre.trim(),
    apellido: datos.apellido.trim(),
    correo: normalizarCorreo(datos.correo),
    direccion: datos.direccion.trim(),
    id: `u-${Date.now()}`,
    rol,
    fechaRegistro: new Date().toISOString(),
  });

  // Registro público: siempre crea una cuenta de cliente
  const registrar = (datos: DatosUsuario) => {
    if (correoEnUso(datos.correo)) {
      return fallo("Ya existe una cuenta con ese correo electrónico.");
    }
    setUsuarios([...usuarios, construirUsuario(datos, "cliente")]);
    return exitoVacio();
  };

  const crearUsuario = (datos: DatosUsuario, rol: Rol) => {
    if (!permisos.crearUsuarios || !permisos.rolesAsignables.includes(rol)) {
      return fallo("No tienes permisos para crear usuarios con ese rol.");
    }
    if (correoEnUso(datos.correo)) {
      return fallo("Ya existe una cuenta con ese correo electrónico.");
    }
    setUsuarios([...usuarios, construirUsuario(datos, rol)]);
    return exitoVacio();
  };

  const actualizarUsuario = (id: string, cambios: CambiosUsuario) => {
    if (!permisos.editarUsuarios) {
      return fallo("No tienes permisos para modificar usuarios.");
    }
    const existente = usuarios.find((u) => u.id === id);
    if (!existente) return fallo("El usuario ya no existe.");
    if (correoEnUso(cambios.correo, id)) {
      return fallo("Ya existe una cuenta con ese correo electrónico.");
    }
    if (id === usuarioActual?.id && cambios.rol !== existente.rol) {
      return fallo("No puedes cambiar tu propio rol.");
    }

    const { password, ...resto } = cambios;
    setUsuarios(
      usuarios.map((u) =>
        u.id === id
          ? {
              ...u,
              ...resto,
              nombre: resto.nombre.trim(),
              apellido: resto.apellido.trim(),
              correo: normalizarCorreo(resto.correo),
              direccion: resto.direccion.trim(),
              password: password ? password : u.password,
            }
          : u,
      ),
    );
    return exitoVacio();
  };

  // Edición del perfil propio: el rol y la contraseña no se tocan
  const actualizarPerfil = (cambios: CambiosPerfil) => {
    if (!usuarioActual) return fallo("Debes iniciar sesión.");
    if (correoEnUso(cambios.correo, usuarioActual.id)) {
      return fallo("Ya existe una cuenta con ese correo electrónico.");
    }
    setUsuarios(
      usuarios.map((u) =>
        u.id === usuarioActual.id
          ? {
              ...u,
              nombre: cambios.nombre.trim(),
              apellido: cambios.apellido.trim(),
              fechaNacimiento: cambios.fechaNacimiento,
              correo: normalizarCorreo(cambios.correo),
              direccion: cambios.direccion.trim(),
              region: cambios.region,
              genero: cambios.genero,
            }
          : u,
      ),
    );
    return exitoVacio();
  };

  const eliminarUsuario = (id: string) => {
    if (!permisos.eliminarUsuarios) {
      return fallo("No tienes permisos para eliminar usuarios.");
    }
    if (id === usuarioActual?.id) {
      return fallo("No puedes eliminar tu propia cuenta.");
    }
    const existente = usuarios.find((u) => u.id === id);
    if (!existente) return fallo("El usuario ya no existe.");

    setUsuarios(usuarios.filter((u) => u.id !== id));
    const copia = { ...intentos };
    delete copia[existente.correo];
    setIntentos(copia);
    return exitoVacio();
  };

  const desbloquear = (correo: string) => {
    if (!permisos.editarUsuarios) {
      return fallo("No tienes permisos para desbloquear cuentas.");
    }
    const copia = { ...intentos };
    delete copia[normalizarCorreo(correo)];
    setIntentos(copia);
    return exitoVacio();
  };

  return (
    <AuthContext
      value={{
        usuarios: usuariosPublicos,
        usuarioActual,
        permisos,
        iniciarSesion,
        cerrarSesion,
        registrar,
        crearUsuario,
        actualizarUsuario,
        actualizarPerfil,
        eliminarUsuario,
        estaBloqueado,
        desbloquear,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const contexto = useContext(AuthContext);
  if (contexto === null) {
    throw new Error("useAuth requiere AuthProvider");
  }
  return contexto;
};
