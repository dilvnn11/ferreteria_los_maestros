interface CampoTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (valor: string) => void;
  filas?: number;
  error?: string;
  requerido?: boolean;
}

export const CampoTextarea = ({
  id,
  label,
  value,
  onChange,
  filas = 3,
  error,
  requerido = false,
}: CampoTextareaProps) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {label}
        {requerido && " *"}
      </label>
      <textarea
        id={id}
        rows={filas}
        value={value}
        className={`form-control ${error ? "is-invalid" : ""}`}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};
