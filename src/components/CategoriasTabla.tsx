import type { Categoria } from "../types/Categoria";

interface CategoriasTablaProps {
  categorias: Categoria[];
  cantidadProductos: (categoriaId: string) => number;
  onEditar: (categoria: Categoria) => void;
  onEliminar: (categoria: Categoria) => void;
}

export const CategoriasTabla = ({
  categorias,
  cantidadProductos,
  onEditar,
  onEliminar,
}: CategoriasTablaProps) => {
  if (categorias.length === 0) {
    return (
      <div className="alert alert-info mb-0" role="status">
        Aún no hay categorías. Crea la primera con el formulario.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle tabla-gestion">
        <thead>
          <tr>
            <th scope="col">Categoría</th>
            <th scope="col">Productos</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td className="fw-semibold">{categoria.nombre}</td>
              <td>
                <span className="badge text-bg-secondary">
                  {cantidadProductos(categoria.id)}
                </span>
              </td>
              <td>
                <div className="d-flex flex-wrap gap-1">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => onEditar(categoria)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => onEliminar(categoria)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
