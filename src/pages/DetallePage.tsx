import { useState } from "react";
import { ImagenProducto } from "../components/ImagenProducto";
import { Panel } from "../components/Panel";
import { useCarrito } from "../context/CarritoContext";
import { useNavegacion } from "../context/NavegacionContext";
import { useNotificaciones } from "../context/NotificacionesContext";
import { useProductos } from "../context/ProductosContext";
import { formatoPrecio } from "../utils/formato";

interface DetallePageProps {
  productoId: string;
}

export const DetallePage = ({ productoId }: DetallePageProps) => {
  const { productos, nombreCategoria } = useProductos();
  const { agregar } = useCarrito();
  const { navegar } = useNavegacion();
  const { notificar } = useNotificaciones();
  const [cantidad, setCantidad] = useState("1");

  const producto = productos.find((p) => p.id === productoId);

  if (!producto) {
    return (
      <Panel titulo="Producto no encontrado">
        <p>El producto que estás buscando no existe.</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navegar({ nombre: "catalogo" })}
        >
          Volver al catálogo
        </button>
      </Panel>
    );
  }

  const sinStock = producto.stock <= 0;

  const agregarAlCarrito = () => {
    const resultado = agregar(producto.id, Number(cantidad));
    if (resultado.ok) {
      notificar("Producto agregado al carrito.");
    } else {
      notificar(resultado.error, "warning");
    }
  };

  return (
    <Panel>
      <button
        type="button"
        className="btn btn-link px-0 mb-3"
        onClick={() => navegar({ nombre: "catalogo" })}
      >
        ← Volver al catálogo
      </button>

      <article className="row g-4">
        <div className="col-12 col-md-5">
          <ImagenProducto
            imagen={producto.imagen}
            alt={producto.nombre}
            className="detalle__imagen"
          />
        </div>

        <div className="col-12 col-md-7">
          <h1 className="h3 text-primary">{producto.nombre}</h1>
          <p className="detalle__precio">{formatoPrecio(producto.precio)}</p>

          <dl className="row mb-3">
            <dt className="col-sm-4">Código</dt>
            <dd className="col-sm-8">{producto.id}</dd>
            <dt className="col-sm-4">Categoría</dt>
            <dd className="col-sm-8">{nombreCategoria(producto.categoriaId)}</dd>
            <dt className="col-sm-4">Subcategoría</dt>
            <dd className="col-sm-8">{producto.subcategoria}</dd>
            <dt className="col-sm-4">Marca</dt>
            <dd className="col-sm-8">{producto.marca}</dd>
            <dt className="col-sm-4">Unidad</dt>
            <dd className="col-sm-8">{producto.unidad}</dd>
            <dt className="col-sm-4">Stock</dt>
            <dd className="col-sm-8">
              {sinStock ? (
                <span className="text-danger fw-semibold">Sin stock</span>
              ) : (
                producto.stock
              )}
            </dd>
            <dt className="col-sm-4">Descripción</dt>
            <dd className="col-sm-8">{producto.descripcion}</dd>
          </dl>

          {sinStock ? (
            <div className="alert alert-warning mb-0" role="status">
              Producto agotado.
            </div>
          ) : (
            <div className="d-flex flex-wrap align-items-end gap-3">
              <div>
                <label htmlFor="cantidad" className="form-label fw-semibold">
                  Cantidad
                </label>
                <input
                  id="cantidad"
                  type="number"
                  min="1"
                  max={producto.stock}
                  className="form-control detalle__cantidad"
                  value={cantidad}
                  onChange={(event) => setCantidad(event.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={agregarAlCarrito}
              >
                Agregar al carrito
              </button>
            </div>
          )}
        </div>
      </article>
    </Panel>
  );
};
