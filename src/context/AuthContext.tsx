import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "../api/auth";
import * as usuariosApi from "../api/usuarios";
import { ApiException, setToken } from "../api/client";
import type { Permisos } from "../types/Permisos";
import type { Resultado } from "../types/Resultado";
import type {
  CambiosPerfil,
  CambiosUsuario,
  DatosUsuario,
  Rol,
  UsuarioPublico,
} from "../types/Usuario";
import { permisosDe } from "../utils/permisos";
import { exito, exitoVacio, fallo } from "../utils/resultado";

type UsuarioConBloqueo = UsuarioPublico & { bloqueado?: boolean };

interface AuthContextType {
  usuarios: UsuarioConBloqueo[];
  usuarioActual: UsuarioPublico | null;
  permisos: Permisos;
  cargando: boolean;
  iniciarSesion: (correo: string, password: string) => Promise<Resultado<UsuarioPublico>>;
  cerrarSesion: () => void;
  registrar: (datos: DatosUsuario) => Promise<Resultado>;
  crearUsuario: (datos: DatosUsuario, rol: Rol) => Promise<Resultado>;
  actualizarUsuario: (id: string, cambios: CambiosUsuario) => Promise<Resultado>;
  actualizarPerfil: (cambios: CambiosPerfil) => Promise<Resultado>;
  eliminarUsuario: (id: string) => Promise<Resultado>;
  estaBloqueado: (correo: string) => boolean;
  desbloquear: (idOCorreo: string) => Promise<Resultado>;
  refrescarUsuarios: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function errorAResultado(e: unknown): Resultado {
  if (e instanceof ApiException) {
    return fallo(e.message);
  }
  if (e instanceof Error) {
    return fallo(e.message);
  }
  return fallo("Error de comunicación con el servidor.");
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuarioActual, setUsuarioActual] = useState<UsuarioPublico | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioConBloqueo[]>([]);
  const [cargando, setCargando] = useState(true);

  const rolActual = usuarioActual?.rol ?? null;
  const permisos = useMemo(() => permisosDe(rolActual), [rolActual]);

  // Restaurar sesión desde token al montar
  useEffect(() => {
    let cancelado = false;
    (async () => {
      const token = localStorage.getItem("ferreteria:token");
      if (!token) {
        setCargando(false);
        return;
      }
      try {
        const u = await authApi.me();
        if (!cancelado) setUsuarioActual(u);
      } catch {
        setToken(null);
        if (!cancelado) setUsuarioActual(null);
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  // Cargar lista de usuarios cuando hay permisos de admin/vendedor
  const refrescarUsuarios = useCallback(async () => {
    if (!permisos.verGestionUsuarios && !permisos.crearUsuarios) {
      setUsuarios([]);
      return;
    }
    try {
      const lista = await usuariosApi.listarUsuarios();
      setUsuarios(lista);
    } catch {
      // silencioso: puede fallar si el token expiró
    }
  }, [permisos.verGestionUsuarios, permisos.crearUsuarios]);

  useEffect(() => {
    if (usuarioActual) {
      void refrescarUsuarios();
    } else {
      setUsuarios([]);
    }
  }, [usuarioActual, refrescarUsuarios]);

  const iniciarSesion = async (correo: string, password: string) => {
    if (!correo.trim() || !password) {
      return fallo("Debes completar correo y contraseña.");
    }
    try {
      const res = await authApi.login(correo.trim(), password);
      setUsuarioActual(res.usuario);
      return exito(res.usuario);
    } catch (e) {
      return errorAResultado(e);
    }
  };

  const cerrarSesion = () => {
    authApi.logout();
    setUsuarioActual(null);
    setUsuarios([]);
  };

  const registrar = async (datos: DatosUsuario) => {
    try {
      await authApi.registro(datos);
      return exitoVacio();
    } catch (e) {
      return errorAResultado(e);
    }
  };

  const crearUsuario = async (datos: DatosUsuario, rol: Rol) => {
    if (!permisos.crearUsuarios || !permisos.rolesAsignables.includes(rol)) {
      return fallo("No tienes permisos para crear usuarios con ese rol.");
    }
    try {
      await usuariosApi.crearUsuario(datos, rol);
      await refrescarUsuarios();
      return exitoVacio();
    } catch (e) {
      return errorAResultado(e);
    }
  };

  const actualizarUsuario = async (id: string, cambios: CambiosUsuario) => {
    if (!permisos.editarUsuarios) {
      return fallo("No tienes permisos para modificar usuarios.");
    }
    if (id === usuarioActual?.id && cambios.rol !== usuarioActual.rol) {
      return fallo("No puedes cambiar tu propio rol.");
    }
    try {
      const actualizado = await usuariosApi.actualizarUsuario(id, cambios);
      await refrescarUsuarios();
      if (id === usuarioActual?.id) {
        setUsuarioActual(actualizado);
      }
      return exitoVacio();
    } catch (e) {
      return errorAResultado(e);
    }
  };

  const actualizarPerfil = async (cambios: CambiosPerfil) => {
    if (!usuarioActual) return fallo("Debes iniciar sesión.");
    try {
      const actualizado = await authApi.actualizarPerfil(cambios);
      setUsuarioActual(actualizado);
      return exitoVacio();
    } catch (e) {
      return errorAResultado(e);
    }
  };

  const eliminarUsuario = async (id: string) => {
    if (!permisos.eliminarUsuarios) {
      return fallo("No tienes permisos para eliminar usuarios.");
    }
    if (id === usuarioActual?.id) {
      return fallo("No puedes eliminar tu propia cuenta.");
    }
    try {
      await usuariosApi.eliminarUsuario(id);
      await refrescarUsuarios();
      return exitoVacio();
    } catch (e) {
      return errorAResultado(e);
    }
  };

  /** Acepta id de usuario (preferido) o correo para compatibilidad con UI anterior. */
  const estaBloqueado = (correoOId: string) => {
    const u = usuarios.find(
      (x) => x.correo === correoOId.trim().toLowerCase() || x.id === correoOId,
    );
    return u?.bloqueado === true;
  };

  const desbloquear = async (idOCorreo: string) => {
    if (!permisos.editarUsuarios) {
      return fallo("No tienes permisos para desbloquear cuentas.");
    }
    const u = usuarios.find(
      (x) => x.id === idOCorreo || x.correo === idOCorreo.trim().toLowerCase(),
    );
    if (!u) return fallo("Usuario no encontrado.");
    try {
      await usuariosApi.desbloquearUsuario(u.id);
      await refrescarUsuarios();
      return exitoVacio();
    } catch (e) {
      return errorAResultado(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuarios,
        usuarioActual,
        permisos,
        cargando,
        iniciarSesion,
        cerrarSesion,
        registrar,
        crearUsuario,
        actualizarUsuario,
        actualizarPerfil,
        eliminarUsuario,
        estaBloqueado,
        desbloquear,
        refrescarUsuarios,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth requiere AuthProvider");
  }
  return ctx;
};
