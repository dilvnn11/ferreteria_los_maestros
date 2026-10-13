import type { Rol } from "../types/Usuario";
import { etiquetaRol } from "../utils/permisos";

const estilos: Record<Rol, string> = {
  administrador: "text-bg-danger",
  vendedor: "text-bg-warning",
  cliente: "text-bg-success",
};

export const RolBadge = ({ rol }: { rol: Rol }) => {
  return <span className={`badge ${estilos[rol]}`}>{etiquetaRol[rol]}</span>;
};
