import { apiFetch } from "./client";
import type { UsuarioPublico, DatosUsuario, CambiosUsuario, Rol } from "../types/Usuario";

function mapUsuario(u: UsuarioPublico & { bloqueado?: boolean; rol: string }): UsuarioPublico & { bloqueado?: boolean } {
  return {
    id: u.id,
    nombre: u.nombre,
    apellido: u.apellido,
    fechaNacimiento: String(u.fechaNacimiento),
    correo: u.correo,
    direccion: u.direccion,
    region: u.region,
    genero: u.genero as UsuarioPublico["genero"],
    rol: (u.rol as string).toLowerCase() as Rol,
    fechaRegistro: String(u.fechaRegistro),
    ...(u.bloqueado !== undefined ? { bloqueado: u.bloqueado } : {}),
  };
}

export async function listarUsuarios(): Promise<(UsuarioPublico & { bloqueado?: boolean })[]> {
  const list = await apiFetch<(UsuarioPublico & { bloqueado?: boolean; rol: string })[]>("/api/usuarios");
  return list.map(mapUsuario);
}

export async function crearUsuario(datos: DatosUsuario, rol: Rol): Promise<UsuarioPublico> {
  const res = await apiFetch<UsuarioPublico & { bloqueado?: boolean; rol: string }>("/api/usuarios", {
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
      rol: rol.toUpperCase(),
    }),
  });
  return mapUsuario(res);
}

export async function actualizarUsuario(id: string, cambios: CambiosUsuario): Promise<UsuarioPublico> {
  const body: Record<string, unknown> = {
    nombre: cambios.nombre,
    apellido: cambios.apellido,
    fechaNacimiento: cambios.fechaNacimiento,
    correo: cambios.correo,
    direccion: cambios.direccion,
    region: cambios.region,
    genero: cambios.genero,
    rol: cambios.rol.toUpperCase(),
  };
  if (cambios.password) {
    body.password = cambios.password;
  }
  const res = await apiFetch<UsuarioPublico & { bloqueado?: boolean; rol: string }>(`/api/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return mapUsuario(res);
}

export async function eliminarUsuario(id: string): Promise<void> {
  await apiFetch<void>(`/api/usuarios/${id}`, { method: "DELETE" });
}

export async function desbloquearUsuario(id: string): Promise<UsuarioPublico> {
  const res = await apiFetch<UsuarioPublico & { bloqueado?: boolean; rol: string }>(
    `/api/usuarios/${id}/desbloquear`,
    { method: "POST" },
  );
  return mapUsuario(res);
}
