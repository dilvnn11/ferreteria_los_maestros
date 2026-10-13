import { useState } from "react";

interface StockEditorProps {
  productoId: string;
  stock: number;
  onGuardar: (productoId: string, stock: number) => void;
}

/** Campo numérico + botón para ajustar el stock de un producto directamente en la tabla. */
export const StockEditor = ({ productoId, stock, onGuardar }: StockEditorProps) => {
  const [valor, setValor] = useState(String(stock));
  const numero = Number(valor);
  const valido = valor !== "" && Number.isInteger(numero) && numero >= 0;

  return (
    <div className="input-group input-group-sm stock-editor">
      <input
        type="number"
        min="0"
        aria-label={`Nuevo stock de ${productoId}`}
        className={`form-control ${valido ? "" : "is-invalid"}`}
        value={valor}
        onChange={(event) => setValor(event.target.value)}
      />
      <button
        type="button"
        className="btn btn-outline-primary"
        disabled={!valido || numero === stock}
        onClick={() => onGuardar(productoId, numero)}
      >
        Guardar
      </button>
    </div>
  );
};
