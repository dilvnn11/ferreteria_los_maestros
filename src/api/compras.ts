import { apiFetch } from "./client";

export interface DetalleCompra {
  productoId: string;
  productoNombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface Compra {
  id: number;
  fecha: string;
  total: number;
  usuarioId: string | null;
  detalles: DetalleCompra[];
}

export interface ItemCompraRequest {
  productoId: string;
  cantidad: number;
}

export async function crearCompra(items: ItemCompraRequest[]): Promise<Compra> {
  return apiFetch<Compra>("/api/compras", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

export async function misCompras(): Promise<Compra[]> {
  return apiFetch<Compra[]>("/api/compras/mias");
}

export async function todasLasCompras(): Promise<Compra[]> {
  return apiFetch<Compra[]>("/api/compras");
}
