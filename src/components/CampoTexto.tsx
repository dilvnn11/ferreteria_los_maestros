interface CampoTextoProps {
  id: string;
  label: string;
  value: string;
  onChange: (valor: string) => void;
  type?: "text" | "email" | "password" | "date" | "number";
  placeholder?: string;
  error?: string;
  ayuda?: string;
  requerido?: boolean;
  deshabilitado?: boolean;
  min?: string;
  max?: string;
  autoComplete?: string;
}

/** Input controlado con etiqueta, ayuda y mensaje de error (Bootstrap). */
export const CampoTexto = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  ayuda,
  requerido = false,
  deshabilitado = false,
  min,
  max,
  autoComplete,
}: CampoTextoProps) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {label}
        {requerido && " *"}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={deshabilitado}
        min={min}
        max={max}
        autoComplete={autoComplete}
        className={`form-control ${error ? "is-invalid" : ""}`}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {ayuda && !error && <div className="form-text">{ayuda}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};
