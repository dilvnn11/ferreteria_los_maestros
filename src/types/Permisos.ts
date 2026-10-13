import type { Rol } from "./Usuario";

/** Qué puede hacer el usuario actual según su rol. */
export interface Permisos {
  verGestionUsuarios: boolean;
  crearUsuarios: boolean;
  editarUsuarios: boolean;
  eliminarUsuarios: boolean;
  rolesAsignables: Rol[];
  verGestionProductos: boolean;
  crearProductos: boolean;
  editarProductos: boolean;
  eliminarProductos: boolean;
  modificarStock: boolean;
  gestionarCategorias: boolean;
}
