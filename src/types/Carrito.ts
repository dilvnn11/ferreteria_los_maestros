import type { Producto } from "./Producto";

/** Lo único que se persiste del carrito: qué producto y cuántas unidades. */
export interface ItemCarrito {
  productoId: string;
  cantidad: number;
}

/** Línea del carrito ya combinada con los datos vigentes del producto. */
export interface LineaCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}
