export interface OpcionSelect {
  valor: string;
  etiqueta: string;
}

interface CampoSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (valor: string) => void;
  opciones: OpcionSelect[];
  placeholder?: string;
  error?: string;
  ayuda?: string;
  requerido?: boolean;
  deshabilitado?: boolean;
}

/** Select controlado con etiqueta y mensaje de error (Bootstrap). */
export const CampoSelect = ({
  id,
  label,
  value,
  onChange,
  opciones,
  placeholder,
  error,
  ayuda,
  requerido = false,
  deshabilitado = false,
}: CampoSelectProps) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {label}
        {requerido && " *"}
      </label>
      <select
        id={id}
        value={value}
        disabled={deshabilitado}
        className={`form-select ${error ? "is-invalid" : ""}`}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.etiqueta}
          </option>
        ))}
      </select>
      {ayuda && !error && <div className="form-text">{ayuda}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};
