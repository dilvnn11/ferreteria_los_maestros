import { createContext, useContext, useState, type ReactNode } from "react";
import type { Vista } from "../types/Navegacion";

interface NavegacionContextType {
  vista: Vista;
  navegar: (nuevaVista: Vista) => void;
}

const NavegacionContext = createContext<NavegacionContextType | null>(null);

export const NavegacionProvider = ({ children }: { children: ReactNode }) => {
  const [vista, setVista] = useState<Vista>({ nombre: "inicio" });

  const navegar = (nuevaVista: Vista) => {
    setVista(nuevaVista);
    window.scrollTo({ top: 0 });
  };

  return (
    <NavegacionContext value={{ vista, navegar }}>{children}</NavegacionContext>
  );
};

export const useNavegacion = () => {
  const contexto = useContext(NavegacionContext);
  if (contexto === null) {
    throw new Error("useNavegacion requiere NavegacionProvider");
  }
  return contexto;
};
