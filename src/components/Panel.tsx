import type { ReactNode } from "react";

interface PanelProps {
  titulo?: string;
  children: ReactNode;
  className?: string;
}

/** Contenedor blanco con borde redondeado que usan todas las secciones. */
export const Panel = ({ titulo, children, className = "" }: PanelProps) => {
  return (
    <section className={`panel ${className}`.trim()}>
      {titulo && <h2 className="panel__titulo">{titulo}</h2>}
      {children}
    </section>
  );
};
