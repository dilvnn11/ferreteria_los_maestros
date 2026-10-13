import type { LineaCarrito } from "../types/Carrito";
import { formatoPrecio } from "../utils/formato";
import { CantidadControl } from "./CantidadControl";
import { ImagenProducto } from "./ImagenProducto";

interface CarritoItemProps {
  linea: LineaCarrito;
  onAumentar: (productoId: string) => void;
  onDisminuir: (productoId: string) => void;
  onEliminar: (productoId: string) => void;
}

export const CarritoItem = ({
  linea,
  onAumentar,
  onDisminuir,
  onEliminar,
}: CarritoItemProps) => {
  const { producto, cantidad, subtotal } = linea;
  const excedeStock = cantidad > producto.stock;

  return (
    <article className="carrito-item">
      <ImagenProducto
        imagen={producto.imagen}
        alt={producto.nombre}
        className="carrito-item__imagen"
      />

      <div className="carrito-item__info">
        <h3 className="carrito-item__nombre">{producto.nombre}</h3>
        <p className="small text-muted mb-1">
          Precio unitario: {formatoPrecio(producto.precio)}
        </p>
        <p className="mb-0">
          Subtotal: <strong>{formatoPrecio(subtotal)}</strong>
        </p>
        {excedeStock && (
          <p className="small text-danger mb-0 mt-1">
            Stock disponible: {producto.stock}. Ajusta la cantidad para poder comprar.
          </p>
        )}
      </div>

      <div className="carrito-item__acciones">
        <CantidadControl
          cantidad={cantidad}
          disminuirDeshabilitado={cantidad <= 1}
          onAumentar={() => onAumentar(producto.id)}
          onDisminuir={() => onDisminuir(producto.id)}
        />
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => onEliminar(producto.id)}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
};
