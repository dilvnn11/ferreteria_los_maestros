import placeholder from "../assets/img/placeholder.svg";

// Vite entrega la URL final de cada imagen guardada en assets/img/productos
const modulos = import.meta.glob<string>("../assets/img/productos/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const imagenes: Record<string, string> = {};
for (const [ruta, url] of Object.entries(modulos)) {
  const nombre = ruta.split("/").pop();
  if (nombre) imagenes[nombre] = url;
}

export const IMAGEN_PLACEHOLDER: string = placeholder;

/** Convierte el campo "imagen" de un producto (archivo o URL) en una URL utilizable. */
export function resolverImagen(imagen: string): string {
  if (/^(https?:|data:)/i.test(imagen)) return imagen;
  return imagenes[imagen] ?? IMAGEN_PLACEHOLDER;
}
