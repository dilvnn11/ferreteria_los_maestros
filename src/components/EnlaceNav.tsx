import type { ReactNode } from "react";

interface EnlaceNavProps {
  activo?: boolean;
  onClick: () => void;
  children: ReactNode;
}

/** Opción de menú: es un botón (no recarga la página) con estilo de enlace de Bootstrap. */
export const EnlaceNav = ({ activo = false, onClick, children }: EnlaceNavProps) => {
  return (
    <li className="nav-item">
      <button
        type="button"
        className={`nav-link ${activo ? "active" : ""}`}
        aria-current={activo ? "page" : undefined}
        onClick={onClick}
      >
        {children}
      </button>
    </li>
  );
};
