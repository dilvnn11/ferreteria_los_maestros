import { useState } from "react";
import { CarritoItem } from "../components/CarritoItem";
import { ConfirmModal } from "../components/ConfirmModal";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { ResumenCarrito } from "../components/ResumenCarrito";
import { useCarrito } from "../context/CarritoContext";
import { useNavegacion } from "../context/NavegacionContext";
import { useNotificaciones } from "../context/NotificacionesContext";

export const CarritoPage = () => {
  const {
    lineas,
    total,
    cantidadTotal,
    aumentar,
    disminuir,
    eliminar,
    vaciar,
    finalizarCompra,
  } = useCarrito();
  const { navegar } = useNavegacion();
  const { notificar } = useNotificaciones();
  const [confirmandoVaciar, setConfirmandoVaciar] = useState(false);

  const aumentarCantidad = (productoId: string) => {
    const resultado = aumentar(productoId);
    if (!resultado.ok) notificar(resultado.error, "warning");
  };

  const finalizar = () => {
    const resultado = finalizarCompra();
    if (resultado.ok) {
      notificar(
        "¡Compra realizada con éxito! Gracias por preferir Ferretería Los Maestros.",
      );
      navegar({ nombre: "inicio" });
    } else {
      notificar(resultado.error, "danger");
    }
  };

  return (
    <>
      <PageHeader titulo="Mi carrito" />

      {lineas.length === 0 ? (
        <Panel>
          <p className="mb-3">El carrito está vacío.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navegar({ nombre: "catalogo" })}
          >
            Ir al catálogo
          </button>
        </Panel>
      ) : (
        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-8">
            <Panel titulo="Productos">
              <div className="d-flex flex-column gap-3">
                {lineas.map((linea) => (
                  <CarritoItem
                    key={linea.producto.id}
                    linea={linea}
                    onAumentar={aumentarCantidad}
                    onDisminuir={disminuir}
                    onEliminar={eliminar}
                  />
                ))}
              </div>
            </Panel>
          </div>
          <div className="col-12 col-lg-4">
            <ResumenCarrito
              total={total}
              cantidadTotal={cantidadTotal}
              onVaciar={() => setConfirmandoVaciar(true)}
              onFinalizar={finalizar}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        abierto={confirmandoVaciar}
        titulo="Vaciar carrito"
        mensaje="¿Deseas vaciar todo el carrito?"
        textoConfirmar="Vaciar"
        onConfirmar={() => {
          vaciar();
          setConfirmandoVaciar(false);
        }}
        onCancelar={() => setConfirmandoVaciar(false)}
      />
    </>
  );
};
