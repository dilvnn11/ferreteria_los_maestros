import avatarFemenino from "../assets/img/avatar_femenino.png";
import avatarMasculino from "../assets/img/avatar_masculino.png";
import type { Genero } from "../types/Usuario";

interface AvatarProps {
  genero: Genero | "";
  nombre: string;
  apellido: string;
  tamano?: "sm" | "lg";
}

/** Avatar genérico: imagen según género o iniciales cuando no hay imagen asociada. */
export const Avatar = ({
  genero,
  nombre,
  apellido,
  tamano = "sm",
}: AvatarProps) => {
  const imagen =
    genero === "Masculino"
      ? avatarMasculino
      : genero === "Femenino"
        ? avatarFemenino
        : null;
  const iniciales = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

  return imagen ? (
    <img src={imagen} alt="" className={`avatar avatar--${tamano}`} />
  ) : (
    <span className={`avatar avatar--${tamano} avatar--iniciales`} aria-hidden>
      {iniciales || "?"}
    </span>
  );
};
