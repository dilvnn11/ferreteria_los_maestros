import { formatoPrecio } from "../utils/formato";
import { Panel } from "./Panel";

interface ResumenCarritoProps {
  total: number;
  cantidadTotal: number;
  onVaciar: () => void;
  onFinalizar: () => void;
}

export const ResumenCarrito = ({
  total,
  cantidadTotal,
  onVaciar,
  onFinalizar,
}: ResumenCarritoProps) => {
  return (
    <Panel titulo="Resumen" className="resumen-carrito">
      <p className="d-flex justify-content-between mb-1">
        <span>Unidades</span>
        <strong>{cantidadTotal}</strong>
      </p>
      <p className="d-flex justify-content-between align-items-center fs-4 mb-3">
        <span>Total</span>
        <strong className="text-primary">{formatoPrecio(total)}</strong>
      </p>
      <div className="d-grid gap-2">
        <button type="button" className="btn btn-primary" onClick={onFinalizar}>
          Finalizar compra
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onVaciar}
        >
          Vaciar carrito
        </button>
      </div>
    </Panel>
  );
};
