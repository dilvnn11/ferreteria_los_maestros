import { useState } from "react";
import { ConfirmModal } from "../components/ConfirmModal";
import { FiltrosProductos } from "../components/FiltrosProductos";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { ProductoForm } from "../components/ProductoForm";
import { ProductosTabla } from "../components/ProductosTabla";
import { useAuth } from "../context/AuthContext";
import { useNotificaciones } from "../context/NotificacionesContext";
import { useProductos } from "../context/ProductosContext";
import type { FiltrosProductos as Filtros, Producto } from "../types/Producto";
import { FILTROS_INICIALES, filtrarProductos } from "../utils/filtros";

/**
 * Administrador: CRUD completo de productos (y stock).
 * Vendedor: consulta el inventario y modifica el stock; no crea, edita ni elimina productos.
 */
export const ProductosAdminPage = () => {
  const { permisos } = useAuth();
  const {
    productos,
    categorias,
    nombreCategoria,
    agregarProducto,
    actualizarProducto,
    actualizarStock,
    eliminarProducto,
  } = useProductos();
  const { notificar } = useNotificaciones();

  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIALES);
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [porEliminar, setPorEliminar] = useState<Producto | null>(null);

  const visibles = filtrarProductos(productos, filtros);
  const mostrarFormulario = creando || editando !== null;

  const abrirCreacion = () => {
    setEditando(null);
    setCreando(true);
    window.scrollTo({ top: 0 });
  };

  const abrirEdicion = (producto: Producto) => {
    setCreando(false);
    setEditando(producto);
    window.scrollTo({ top: 0 });
  };

  const cerrarFormulario = () => {
    setCreando(false);
    setEditando(null);
  };

  const guardarNuevo = (producto: Producto) => {
    const resultado = agregarProducto(producto);
    if (resultado.ok) {
      notificar(`Producto "${producto.nombre}" creado correctamente.`);
      setCreando(false);
    }
    return resultado;
  };

  const guardarEdicion = (producto: Producto) => {
    const { id, ...cambios } = producto;
    const resultado = actualizarProducto(id, cambios);
    if (resultado.ok) {
      notificar(`Producto "${producto.nombre}" actualizado correctamente.`);
      setEditando(null);
    }
    return resultado;
  };

  const guardarStock = (productoId: string, stock: number) => {
    const resultado = actualizarStock(productoId, stock);
    if (resultado.ok) {
      notificar(`Stock de ${productoId} actualizado a ${stock}.`);
    } else {
      notificar(resultado.error, "danger");
    }
  };

  const confirmarEliminar = () => {
    if (!porEliminar) return;
    const resultado = eliminarProducto(porEliminar.id);
    if (resultado.ok) {
      notificar(`Producto "${porEliminar.nombre}" eliminado.`, "info");
      if (editando?.id === porEliminar.id) setEditando(null);
    } else {
      notificar(resultado.error, "danger");
    }
    setPorEliminar(null);
  };

  return (
    <>
      <PageHeader
        titulo={permisos.crearProductos ? "Gestión de productos" : "Inventario y stock"}
        descripcion={
          permisos.crearProductos
            ? "Crea, consulta, modifica y elimina productos."
            : "Consulta los productos y modifica su stock."
        }
      />

      {!permisos.crearProductos && (
        <div className="alert alert-info" role="status">
          Como vendedor puedes consultar productos y modificar su stock. La
          creación, edición y eliminación de productos es exclusiva del
          administrador.
        </div>
      )}

      <div className="row g-4 align-items-start">
        {mostrarFormulario && (
          <div className="col-12 col-xl-4">
            <Panel titulo={editando ? `Editar ${editando.id}` : "Nuevo producto"}>
              <ProductoForm
                key={editando?.id ?? "nuevo"}
                modo={editando ? "editar" : "crear"}
                productoInicial={editando ?? undefined}
                categorias={categorias}
                onSubmit={editando ? guardarEdicion : guardarNuevo}
                onCancelar={cerrarFormulario}
              />
            </Panel>
          </div>
        )}

        <div className={mostrarFormulario ? "col-12 col-xl-8" : "col-12"}>
          <Panel>
            <FiltrosProductos
              filtros={filtros}
              categorias={categorias}
              onCambiar={setFiltros}
              onLimpiar={() => setFiltros(FILTROS_INICIALES)}
            />
          </Panel>

          <Panel className="mt-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <h2 className="panel__titulo mb-0">
                Productos ({visibles.length} de {productos.length})
              </h2>
              {permisos.crearProductos && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={abrirCreacion}
                >
                  + Nuevo producto
                </button>
              )}
            </div>
            <ProductosTabla
              productos={visibles}
              nombreCategoria={nombreCategoria}
              puedeEditar={permisos.editarProductos}
              puedeEliminar={permisos.eliminarProductos}
              puedeModificarStock={permisos.modificarStock}
              onEditar={abrirEdicion}
              onEliminar={setPorEliminar}
              onGuardarStock={guardarStock}
            />
          </Panel>
        </div>
      </div>

      <ConfirmModal
        abierto={porEliminar !== null}
        titulo="Eliminar producto"
        mensaje={`¿Seguro que deseas eliminar "${porEliminar?.nombre ?? ""}"? Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
};
