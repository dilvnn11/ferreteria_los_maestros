export interface Producto {
  id: string; // código del producto, p. ej. "MC001"
  nombre: string;
  categoriaId: string;
  subcategoria: string;
  marca: string;
  unidad: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  descripcion: string;
  imagen: string; // nombre de archivo en assets/img/productos o URL
}

/** Valores (todos como texto) del formulario de producto. */
export interface FormProducto {
  id: string;
  nombre: string;
  categoriaId: string;
  subcategoria: string;
  marca: string;
  unidad: string;
  precio: string;
  stock: string;
  stockMinimo: string;
  descripcion: string;
  imagen: string;
}

export interface FiltrosProductos {
  texto: string;
  categoriaId: string; // "todas" o el id de una categoría
  precioMax: string; // vacío = sin límite
}
