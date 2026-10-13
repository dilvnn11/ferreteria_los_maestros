import type { FiltrosProductos, Producto } from "../types/Producto";

export const FILTROS_INICIALES: FiltrosProductos = {
  texto: "",
  categoriaId: "todas",
  precioMax: "",
};

/** Aplica texto (nombre, código o marca), categoría y precio máximo. */
export function filtrarProductos(
  productos: Producto[],
  filtros: FiltrosProductos,
): Producto[] {
  const texto = filtros.texto.trim().toLowerCase();
  const precioMax = filtros.precioMax !== "" ? Number(filtros.precioMax) : null;

  return productos.filter((p) => {
    const coincideTexto =
      texto === "" ||
      p.nombre.toLowerCase().includes(texto) ||
      p.id.toLowerCase().includes(texto) ||
      p.marca.toLowerCase().includes(texto);
    const coincideCategoria =
      filtros.categoriaId === "todas" || p.categoriaId === filtros.categoriaId;
    const coincidePrecio = precioMax === null || p.precio <= precioMax;
    return coincideTexto && coincideCategoria && coincidePrecio;
  });
}
