import type { Genero, Rol, Usuario } from "../types/Usuario";

// Usuarios iniciales para poder probar los tres roles.
// Simulación académica: las contraseñas se guardan en LocalStorage sin cifrar.
export const usuariosIniciales: Usuario[] = [
  {
    id: "u-admin",
    nombre: "Camila",
    apellido: "Fuentes",
    fechaNacimiento: "1985-04-12",
    correo: "admin@duoc.cl",
    password: "Admin123",
    direccion: "Av. Francisco de Aguirre 100, La Serena",
    region: "Coquimbo",
    genero: "Femenino",
    rol: "administrador",
    fechaRegistro: "2026-01-10T12:00:00.000Z",
  },
  {
    id: "u-vendedor",
    nombre: "Marcelo",
    apellido: "Rojas",
    fechaNacimiento: "1992-09-03",
    correo: "vendedor@duoc.cl",
    password: "Vendedor123",
    direccion: "Los Carrera 450, La Serena",
    region: "Coquimbo",
    genero: "Masculino",
    rol: "vendedor",
    fechaRegistro: "2026-01-10T12:05:00.000Z",
  },
  {
    id: "u-cliente",
    nombre: "Pedro",
    apellido: "Soto",
    fechaNacimiento: "1998-02-21",
    correo: "cliente@duoc.cl",
    password: "Cliente123",
    direccion: "Calle Prat 321, Coquimbo",
    region: "Coquimbo",
    genero: "Masculino",
    rol: "cliente",
    fechaRegistro: "2026-01-11T09:30:00.000Z",
  },
];

export const generos: Genero[] = [
  "Masculino",
  "Femenino",
  "Otro",
  "Prefiero no decir",
];

export const roles: { valor: Rol; etiqueta: string }[] = [
  { valor: "administrador", etiqueta: "Administrador" },
  { valor: "vendedor", etiqueta: "Vendedor" },
  { valor: "cliente", etiqueta: "Cliente" },
];
