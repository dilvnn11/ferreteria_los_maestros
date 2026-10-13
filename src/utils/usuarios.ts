import type {
  CambiosPerfil,
  CambiosUsuario,
  DatosUsuario,
  FormUsuarioValido,
} from "../types/Usuario";

/** Convierte los valores validados del formulario en los datos que recibe el contexto. */
export const aDatosUsuario = (v: FormUsuarioValido): DatosUsuario => ({
  nombre: v.nombre,
  apellido: v.apellido,
  fechaNacimiento: v.fechaNacimiento,
  correo: v.correo,
  password: v.password,
  direccion: v.direccion,
  region: v.region,
  genero: v.genero,
});

export const aCambiosUsuario = (v: FormUsuarioValido): CambiosUsuario => ({
  nombre: v.nombre,
  apellido: v.apellido,
  fechaNacimiento: v.fechaNacimiento,
  correo: v.correo,
  password: v.password,
  direccion: v.direccion,
  region: v.region,
  genero: v.genero,
  rol: v.rol,
});

export const aCambiosPerfil = (v: FormUsuarioValido): CambiosPerfil => ({
  nombre: v.nombre,
  apellido: v.apellido,
  fechaNacimiento: v.fechaNacimiento,
  correo: v.correo,
  direccion: v.direccion,
  region: v.region,
  genero: v.genero,
});
