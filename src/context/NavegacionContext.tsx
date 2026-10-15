import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Vista } from "../types/Navegacion";

interface NavegacionContextType {
  vista: Vista;
  navegar: (nuevaVista: Vista) => void;
}

const NavegacionContext = createContext<NavegacionContextType | undefined>(undefined);

const MAPA_RUTAS: Record<string, string> = {
  inicio: "/",
  catalogo: "/catalogo",
  carrito: "/carrito",
  login: "/login",
  registro: "/registro",
  perfil: "/perfil",
  "productos-admin": "/admin/productos",
  usuarios: "/admin/usuarios",
  categorias: "/admin/categorias",
};

export const NavegacionProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const obtenerVistaDesdeURL = (): Vista => {
    const path = location.pathname;

    // Detectar si la URL es un detalle de producto (ej: /producto/123)
    if (path.startsWith("/producto/")) {
      const idStr = path.split("/")[2];
      const productoId = Number(idStr);
      return { nombre: "detalle", productoId } as unknown as Vista;
    }

    const entrada = Object.entries(MAPA_RUTAS).find(([_, url]) => url === path);
    const nombreVista = entrada ? entrada[0] : "inicio";

    return { nombre: nombreVista } as unknown as Vista;
  };

  const [vista, setVista] = useState<Vista>(obtenerVistaDesdeURL);

  useEffect(() => {
    setVista(obtenerVistaDesdeURL());
  }, [location.pathname]);

  const navegar = (nuevaVista: Vista) => {
    setVista(nuevaVista);

    // Si la vista es "detalle", construimos la URL dinámica
    if (nuevaVista.nombre === "detalle") {
      // Soporta si tu tipo Vista pasa 'productoId' o el objeto 'producto'
      const id = "productoId" in nuevaVista 
        ? nuevaVista.productoId 
        : "producto" in nuevaVista 
        ? (nuevaVista as any).producto?.id 
        : null;

      if (id) {
        navigate(`/producto/${id}`);
        return;
      }
    }

    const rutaDestino = MAPA_RUTAS[nuevaVista.nombre] || "/";
    navigate(rutaDestino);
  };

  return (
    <NavegacionContext.Provider value={{ vista, navegar }}>
      {children}
    </NavegacionContext.Provider>
  );
};

export const useNavegacion = () => {
  const context = useContext(NavegacionContext);
  if (!context) {
    throw new Error("useNavegacion debe usarse dentro de NavegacionProvider");
  }
  return context;
};