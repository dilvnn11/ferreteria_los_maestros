import type { Producto } from "../types/Producto";
import { ProductoCard } from "./ProductoCard";

interface ProductosGridProps {
  productos: Producto[];
  nombreCategoria: (categoriaId: string) => string;
  onVerDetalle: (id: string) => void;
  onAgregar?: (id: string) => void;
  mensajeVacio?: string;
  columnasXl?: 3 | 4;
}

/** Lista de tarjetas de producto; se usa en el catálogo y en los destacados del inicio. */
export const ProductosGrid = ({
  productos,
  nombreCategoria,
  onVerDetalle,
  onAgregar,
  mensajeVacio = "No se encontraron productos.",
  columnasXl = 4,
}: ProductosGridProps) => {
  if (productos.length === 0) {
    return (
      <div className="alert alert-info mb-0" role="status">
        {mensajeVacio}
      </div>
    );
  }

  return (
    <div className={`row g-3 row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-${columnasXl}`}>
      {productos.map((producto) => (
        <div className="col" key={producto.id}>
          <ProductoCard
            producto={producto}
            categoriaNombre={nombreCategoria(producto.categoriaId)}
            onVerDetalle={onVerDetalle}
            onAgregar={onAgregar}
          />
        </div>
      ))}
    </div>
  );
};
