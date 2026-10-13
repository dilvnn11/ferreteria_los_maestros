import type { Permisos } from "../types/Permisos";
import type { Rol } from "../types/Usuario";
import type { Vista } from "../types/Navegacion";

const SIN_PERMISOS: Permisos = {
  verGestionUsuarios: false,
  crearUsuarios: false,
  editarUsuarios: false,
  eliminarUsuarios: false,
  rolesAsignables: [],
  verGestionProductos: false,
  crearProductos: false,
  editarProductos: false,
  eliminarProductos: false,
  modificarStock: false,
  gestionarCategorias: false,
};

/**
 * Matriz de permisos por rol (única fuente de verdad).
 * - administrador: CRUD de usuarios, productos y categorías.
 * - vendedor: consulta productos, modifica stock y crea usuarios solo con rol cliente.
 * - cliente / invitado: solo funcionalidades comerciales (navegar y comprar).
 */
export function permisosDe(rol: Rol | null): Permisos {
  switch (rol) {
    case "administrador":
      return {
        verGestionUsuarios: true,
        crearUsuarios: true,
        editarUsuarios: true,
        eliminarUsuarios: true,
        rolesAsignables: ["administrador", "vendedor", "cliente"],
        verGestionProductos: true,
        crearProductos: true,
        editarProductos: true,
        eliminarProductos: true,
        modificarStock: true,
        gestionarCategorias: true,
      };
    case "vendedor":
      return {
        ...SIN_PERMISOS,
        crearUsuarios: true,
        rolesAsignables: ["cliente"],
        verGestionProductos: true,
        modificarStock: true,
      };
    default:
      return SIN_PERMISOS;
  }
}

/** Indica si una vista puede mostrarse con los permisos y la sesión actuales. */
export function vistaPermitida(
  vista: Vista,
  permisos: Permisos,
  haySesion: boolean,
): boolean {
  switch (vista.nombre) {
    case "perfil":
      return haySesion;
    case "usuarios":
      return permisos.crearUsuarios;
    case "productos-admin":
      return permisos.verGestionProductos;
    case "categorias":
      return permisos.gestionarCategorias;
    default:
      return true;
  }
}

export const etiquetaRol: Record<Rol, string> = {
  administrador: "Administrador",
  vendedor: "Vendedor",
  cliente: "Cliente",
};
