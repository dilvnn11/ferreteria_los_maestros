import { apiFetch } from "./client";
import type { Producto } from "../types/Producto";
import type { Categoria } from "../types/Categoria";

export async function listarProductos(): Promise<Producto[]> {
  return apiFetch<Producto[]>("/api/productos");
}

export async function obtenerProducto(id: string): Promise<Producto> {
  return apiFetch<Producto>(`/api/productos/${id}`);
}

export async function crearProducto(producto: Omit<Producto, never>): Promise<Producto> {
  return apiFetch<Producto>("/api/productos", {
    method: "POST",
    body: JSON.stringify(producto),
  });
}

export async function actualizarProducto(id: string, cambios: Omit<Producto, "id">): Promise<Producto> {
  return apiFetch<Producto>(`/api/productos/${id}`, {
    method: "PUT",
    body: JSON.stringify(cambios),
  });
}

export async function actualizarStock(id: string, stock: number): Promise<Producto> {
  return apiFetch<Producto>(`/api/productos/${id}/stock`, {
    method: "PATCH",
    body: JSON.stringify({ stock }),
  });
}

export async function eliminarProducto(id: string): Promise<void> {
  await apiFetch<void>(`/api/productos/${id}`, { method: "DELETE" });
}

export async function listarCategorias(): Promise<Categoria[]> {
  return apiFetch<Categoria[]>("/api/categorias");
}

export async function crearCategoria(nombre: string): Promise<Categoria> {
  return apiFetch<Categoria>("/api/categorias", {
    method: "POST",
    body: JSON.stringify({ nombre }),
  });
}

export async function actualizarCategoria(id: string, nombre: string): Promise<Categoria> {
  return apiFetch<Categoria>(`/api/categorias/${id}`, {
    method: "PUT",
    body: JSON.stringify({ nombre }),
  });
}

export async function eliminarCategoria(id: string): Promise<void> {
  await apiFetch<void>(`/api/categorias/${id}`, { method: "DELETE" });
}
