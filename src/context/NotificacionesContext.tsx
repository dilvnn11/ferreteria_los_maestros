import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Notificacion, TipoNotificacion } from "../types/Notificacion";

interface NotificacionesContextType {
  notificaciones: Notificacion[];
  notificar: (mensaje: string, tipo?: TipoNotificacion) => void;
  cerrarNotificacion: (id: number) => void;
}

const NotificacionesContext = createContext<NotificacionesContextType | null>(
  null,
);

const DURACION_MS = 4500;

export const NotificacionesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const contador = useRef(0);

  const cerrarNotificacion = useCallback((id: number) => {
    setNotificaciones((actuales) => actuales.filter((n) => n.id !== id));
  }, []);

  const notificar = useCallback(
    (mensaje: string, tipo: TipoNotificacion = "success") => {
      contador.current += 1;
      const id = contador.current;
      setNotificaciones((actuales) => [...actuales, { id, mensaje, tipo }]);
      setTimeout(() => cerrarNotificacion(id), DURACION_MS);
    },
    [cerrarNotificacion],
  );

  return (
    <NotificacionesContext
      value={{ notificaciones, notificar, cerrarNotificacion }}
    >
      {children}
    </NotificacionesContext>
  );
};

export const useNotificaciones = () => {
  const contexto = useContext(NotificacionesContext);
  if (contexto === null) {
    throw new Error("useNotificaciones requiere NotificacionesProvider");
  }
  return contexto;
};
