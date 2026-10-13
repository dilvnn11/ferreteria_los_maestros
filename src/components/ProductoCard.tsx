import type { Producto } from "../types/Producto";
import { formatoPrecio } from "../utils/formato";
import { ImagenProducto } from "./ImagenProducto";

interface ProductoCardProps {
  producto: Producto;
  categoriaNombre: string;
  onVerDetalle: (id: string) => void;
  onAgregar?: (id: string) => void; // si no se entrega, no se muestra el botón
}

export const ProductoCard = ({
  producto,
  categoriaNombre,
  onVerDetalle,
  onAgregar,
}: ProductoCardProps) => {
  const sinStock = producto.stock <= 0;

  return (
    <article
      className={`card h-100 producto-card ${sinStock ? "producto-card--sin-stock" : ""}`}
    >
      <ImagenProducto
        imagen={producto.imagen}
        alt={producto.nombre}
        className="card-img-top producto-card__imagen"
      />
      <div className="card-body d-flex flex-column">
        <span className="producto-card__categoria">{categoriaNombre}</span>
        <h3 className="producto-card__nombre">{producto.nombre}</h3>
        <p className="small text-muted mb-1">Marca: {producto.marca}</p>
        <p className="producto-card__precio">{formatoPrecio(producto.precio)}</p>
        <p
          className={`small mb-3 ${sinStock ? "text-danger fw-semibold" : "text-success"}`}
        >
          {sinStock ? "Sin stock" : `Stock: ${producto.stock}`}
        </p>

        <div className="d-flex flex-wrap gap-2 mt-auto">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => onVerDetalle(producto.id)}
          >
            Ver detalle
          </button>
          {onAgregar && !sinStock && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onAgregar(producto.id)}
            >
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
