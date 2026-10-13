import { useState } from "react";
import { FiltrosProductos } from "../components/FiltrosProductos";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { ProductosGrid } from "../components/ProductosGrid";
import { useCarrito } from "../context/CarritoContext";
import { useNavegacion } from "../context/NavegacionContext";
import { useNotificaciones } from "../context/NotificacionesContext";
import { useProductos } from "../context/ProductosContext";
import type { FiltrosProductos as Filtros } from "../types/Producto";
import { FILTROS_INICIALES, filtrarProductos } from "../utils/filtros";

export const CatalogoPage = () => {
  const { productos, categorias, nombreCategoria } = useProductos();
  const { agregar } = useCarrito();
  const { navegar } = useNavegacion();
  const { notificar } = useNotificaciones();
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIALES);

  const visibles = filtrarProductos(productos, filtros);

  const agregarAlCarrito = (id: string) => {
    const resultado = agregar(id, 1);
    if (resultado.ok) {
      const nombre = productos.find((p) => p.id === id)?.nombre ?? "Producto";
      notificar(`"${nombre}" agregado al carrito.`);
    } else {
      notificar(resultado.error, "warning");
    }
  };

  return (
    <>
      <PageHeader
        titulo="Catálogo de productos"
        descripcion="Encuentra materiales y productos para tus proyectos."
      />

      <Panel>
        <FiltrosProductos
          filtros={filtros}
          categorias={categorias}
          onCambiar={setFiltros}
          onLimpiar={() => setFiltros(FILTROS_INICIALES)}
        />
      </Panel>

      <Panel titulo={`Productos (${visibles.length})`}>
        <ProductosGrid
          productos={visibles}
          nombreCategoria={nombreCategoria}
          onVerDetalle={(id) => navegar({ nombre: "detalle", id })}
          onAgregar={agregarAlCarrito}
          mensajeVacio="No se encontraron productos con esos filtros."
        />
      </Panel>
    </>
  );
};
