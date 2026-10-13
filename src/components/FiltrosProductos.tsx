import type { Categoria } from "../types/Categoria";
import type { FiltrosProductos as Filtros } from "../types/Producto";

interface FiltrosProductosProps {
  filtros: Filtros;
  categorias: Categoria[];
  onCambiar: (filtros: Filtros) => void;
  onLimpiar: () => void;
}

/** Filtros por texto, categoría y precio máximo. Se reutiliza en el catálogo y en la gestión de productos. */
export const FiltrosProductos = ({
  filtros,
  categorias,
  onCambiar,
  onLimpiar,
}: FiltrosProductosProps) => {
  return (
    <section className="filtros" aria-label="Filtrar productos">
      <h2 className="panel__titulo">Filtrar productos</h2>

      <div className="row g-3 align-items-end">
        <div className="col-12 col-md-4">
          <label htmlFor="filtroTexto" className="form-label">
            Buscar
          </label>
          <input
            id="filtroTexto"
            type="search"
            className="form-control"
            placeholder="Nombre, código o marca..."
            value={filtros.texto}
            onChange={(event) =>
              onCambiar({ ...filtros, texto: event.target.value })
            }
          />
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <label htmlFor="filtroCategoria" className="form-label">
            Categoría
          </label>
          <select
            id="filtroCategoria"
            className="form-select"
            value={filtros.categoriaId}
            onChange={(event) =>
              onCambiar({ ...filtros, categoriaId: event.target.value })
            }
          >
            <option value="todas">Todas</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <label htmlFor="filtroPrecio" className="form-label">
            Precio máximo (CLP)
          </label>
          <input
            id="filtroPrecio"
            type="number"
            min="0"
            className="form-control"
            placeholder="Ej: 10000"
            value={filtros.precioMax}
            onChange={(event) =>
              onCambiar({ ...filtros, precioMax: event.target.value })
            }
          />
        </div>

        <div className="col-12 col-md-2">
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={onLimpiar}
          >
            Limpiar
          </button>
        </div>
      </div>
    </section>
  );
};
