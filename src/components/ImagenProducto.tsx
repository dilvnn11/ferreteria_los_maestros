import { useState } from "react";
import { IMAGEN_PLACEHOLDER, resolverImagen } from "../utils/imagenes";

interface ImagenProductoProps {
  imagen: string;
  alt: string;
  className?: string;
}

/** Muestra la imagen del producto y, si no carga, una imagen de reemplazo. */
export const ImagenProducto = ({
  imagen,
  alt,
  className = "",
}: ImagenProductoProps) => {
  const src = resolverImagen(imagen);
  const [srcFallida, setSrcFallida] = useState<string | null>(null);

  return (
    <img
      src={srcFallida === src ? IMAGEN_PLACEHOLDER : src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setSrcFallida(src)}
    />
  );
};
