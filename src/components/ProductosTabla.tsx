import type { Producto } from "../types/Producto";
import { formatoPrecio } from "../utils/formato";
import { ImagenProducto } from "./ImagenProducto";
import { StockEditor } from "./StockEditor";

interface ProductosTablaProps {
  productos: Producto[];
  nombreCategoria: (categoriaId: string) => string;
  puedeEditar: boolean;
  puedeEliminar: boolean;
  puedeModificarStock: boolean;
  onEditar: (producto: Producto) => void;
  onEliminar: (producto: Producto) => void;
  onGuardarStock: (productoId: string, stock: number) => void;
}

export const ProductosTabla = ({
  productos,
  nombreCategoria,
  puedeEditar,
  puedeEliminar,
  puedeModificarStock,
  onEditar,
  onEliminar,
  onGuardarStock,
}: ProductosTablaProps) => {
  if (productos.length === 0) {
    return (
      <div className="alert alert-info mb-0" role="status">
        No se encontraron productos con esos filtros.
      </div>
    );
  }

  const hayAcciones = puedeEditar || puedeEliminar;

  const botonesAccion = (producto: Producto) => (
    <div className="d-flex flex-wrap gap-1">
      {puedeEditar && (
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => onEditar(producto)}
        >
          Editar
        </button>
      )}
      {puedeEliminar && (
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => onEliminar(producto)}
        >
          Eliminar
        </button>
      )}
    </div>
  );

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle tabla-gestion">
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col" className="d-none d-md-table-cell">Categoría</th>
            <th scope="col" className="d-none d-sm-table-cell">Precio</th>
            <th scope="col">Stock</th>
            {hayAcciones && (
              <th scope="col" className="d-none d-sm-table-cell">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => {
            const agotado = producto.stock <= 0;
            const bajo = !agotado && producto.stock <= producto.stockMinimo;
            return (
              <tr key={producto.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <ImagenProducto
                      imagen={producto.imagen}
                      alt=""
                      className="tabla-gestion__miniatura d-none d-sm-block"
                    />
                    <div>
                      <div className="fw-semibold">{producto.nombre}</div>
                      <small className="text-muted">{producto.id}</small>
                      {hayAcciones && (
                        <div className="d-sm-none mt-2">
                          {botonesAccion(producto)}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="d-none d-md-table-cell">
                  {nombreCategoria(producto.categoriaId)}
                </td>
                <td className="d-none d-sm-table-cell">
                  {formatoPrecio(producto.precio)}
                </td>
                <td>
                  {puedeModificarStock ? (
                    <StockEditor
                      key={`${producto.id}-${producto.stock}`}
                      productoId={producto.id}
                      stock={producto.stock}
                      onGuardar={onGuardarStock}
                    />
                  ) : (
                    <span>{producto.stock}</span>
                  )}
                  {agotado && (
                    <span className="badge text-bg-danger ms-1">Agotado</span>
                  )}
                  {bajo && (
                    <span className="badge text-bg-warning ms-1">Stock bajo</span>
                  )}
                </td>
                {hayAcciones && (
                  <td className="d-none d-sm-table-cell">
                    {botonesAccion(producto)}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
