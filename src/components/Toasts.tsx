import { useNotificaciones } from "../context/NotificacionesContext";

/** Muestra los mensajes de la aplicación (reemplaza a los alert() de la versión 1). */
export const Toasts = () => {
  const { notificaciones, cerrarNotificacion } = useNotificaciones();

  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      aria-live="polite"
    >
      {notificaciones.map((notificacion) => (
        <div
          key={notificacion.id}
          className={`toast show align-items-center border-0 text-bg-${notificacion.tipo}`}
          role="status"
        >
          <div className="d-flex">
            <div className="toast-body">{notificacion.mensaje}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              aria-label="Cerrar mensaje"
              onClick={() => cerrarNotificacion(notificacion.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
