/** Vistas (secciones) de la aplicación. "detalle" necesita el id del producto. */
export type Vista =
  | { nombre: "inicio" }
  | { nombre: "catalogo" }
  | { nombre: "detalle"; id: string }
  | { nombre: "carrito" }
  | { nombre: "login" }
  | { nombre: "registro" }
  | { nombre: "perfil" }
  | { nombre: "usuarios" }
  | { nombre: "productos-admin" }
  | { nombre: "categorias" };
