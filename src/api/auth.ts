import { apiFetch, setToken } from "./client";
import type { UsuarioPublico, DatosUsuario, CambiosPerfil } from "../types/Usuario";

export interface AuthResponse {
  token: string;
  usuario: UsuarioPublico & { bloqueado?: boolean };
}

export interface LoginBody {
  correo: string;
  password: string;
}

/** Backend UsuarioDto uses Instant and boolean bloqueado; map to frontend shape. */
function mapUsuario(u: AuthResponse["usuario"] | (UsuarioPublico & { bloqueado?: boolean })): UsuarioPublico {
  return {
    id: u.id,
    nombre: u.nombre,
    apellido: u.apellido,
    fechaNacimiento: typeof u.fechaNacimiento === "string" ? u.fechaNacimiento : String(u.fechaNacimiento),
    correo: u.correo,
    direccion: u.direccion,
    region: u.region,
    genero: u.genero as UsuarioPublico["genero"],
    rol: (u.rol as string).toLowerCase() as UsuarioPublico["rol"],
    fechaRegistro: typeof u.fechaRegistro === "string" ? u.fechaRegistro : String(u.fechaRegistro),
  };
}

export async function login(correo: string, password: string): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo, password } satisfies LoginBody),
  });
  setToken(res.token);
  return { token: res.token, usuario: mapUsuario(res.usuario) };
}

export async function registro(datos: DatosUsuario): Promise<UsuarioPublico> {
  const res = await apiFetch<UsuarioPublico & { bloqueado?: boolean }>("/api/auth/registro", {
    method: "POST",
    body: JSON.stringify({
      nombre: datos.nombre,
      apellido: datos.apellido,
      fechaNacimiento: datos.fechaNacimiento,
      correo: datos.correo,
      password: datos.password,
      direccion: datos.direccion,
      region: datos.region,
      genero: datos.genero,
    }),
  });
  return mapUsuario(res);
}

export async function me(): Promise<UsuarioPublico> {
  const res = await apiFetch<UsuarioPublico & { bloqueado?: boolean }>("/api/auth/me");
  return mapUsuario(res);
}

export async function actualizarPerfil(cambios: CambiosPerfil): Promise<UsuarioPublico> {
  const res = await apiFetch<UsuarioPublico & { bloqueado?: boolean }>("/api/auth/perfil", {
    method: "PUT",
    body: JSON.stringify({
      nombre: cambios.nombre,
      apellido: cambios.apellido,
      fechaNacimiento: cambios.fechaNacimiento,
      correo: cambios.correo,
      direccion: cambios.direccion,
      region: cambios.region,
      genero: cambios.genero,
      // password optional / not sent for profile
    }),
  });
  return mapUsuario(res);
}

export function logout() {
  setToken(null);
}
