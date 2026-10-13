interface CantidadControlProps {
  cantidad: number;
  onAumentar: () => void;
  onDisminuir: () => void;
  disminuirDeshabilitado?: boolean;
}

export const CantidadControl = ({
  cantidad,
  onAumentar,
  onDisminuir,
  disminuirDeshabilitado = false,
}: CantidadControlProps) => {
  return (
    <div className="btn-group" role="group" aria-label="Cambiar cantidad">
      <button
        type="button"
        className="btn btn-outline-secondary"
        aria-label="Disminuir cantidad"
        disabled={disminuirDeshabilitado}
        onClick={onDisminuir}
      >
        −
      </button>
      <span className="btn btn-light disabled opacity-100 px-3" aria-live="polite">
        {cantidad}
      </span>
      <button
        type="button"
        className="btn btn-outline-secondary"
        aria-label="Aumentar cantidad"
        onClick={onAumentar}
      >
        +
      </button>
    </div>
  );
};
