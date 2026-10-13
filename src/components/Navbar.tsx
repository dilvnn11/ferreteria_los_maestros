import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { useNavegacion } from "../context/NavegacionContext";
import { useNotificaciones } from "../context/NotificacionesContext";
import type { Vista } from "../types/Navegacion";
import { EnlaceNav } from "./EnlaceNav";
import { RolBadge } from "./RolBadge";

export const Navbar = () => {
  const { vista, navegar } = useNavegacion();
  const { usuarioActual, permisos, cerrarSesion } = useAuth();
  const { cantidadTotal } = useCarrito();
  const { notificar } = useNotificaciones();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const ir = (destino: Vista) => {
    navegar(destino);
    setMenuAbierto(false);
  };

  const salir = () => {
    cerrarSesion();
    ir({ nombre: "inicio" });
    notificar("Sesión cerrada correctamente.", "info");
  };

  const esActiva = (nombre: Vista["nombre"]) => vista.nombre === nombre;
  const tieneGestion =
    permisos.verGestionProductos ||
    permisos.crearUsuarios ||
    permisos.gestionarCategorias;

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark app-navbar">
        <div className="container">
          <button
            type="button"
            className="navbar-brand"
            onClick={() => ir({ nombre: "inicio" })}
          >
            🔧 Ferretería Los Maestros
          </button>

          <button
            type="button"
            className="navbar-toggler"
            aria-controls="menuPrincipal"
            aria-expanded={menuAbierto}
            aria-label="Mostrar u ocultar el menú"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            id="menuPrincipal"
            className={`collapse navbar-collapse ${menuAbierto ? "show" : ""}`}
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <EnlaceNav
                activo={esActiva("inicio")}
                onClick={() => ir({ nombre: "inicio" })}
              >
                Inicio
              </EnlaceNav>
              <EnlaceNav
                activo={esActiva("catalogo") || esActiva("detalle")}
                onClick={() => ir({ nombre: "catalogo" })}
              >
                Catálogo
              </EnlaceNav>
            </ul>

            <ul className="navbar-nav align-items-lg-center">
              <EnlaceNav
                activo={esActiva("carrito")}
                onClick={() => ir({ nombre: "carrito" })}
              >
                🛒 Carrito{" "}
                {cantidadTotal > 0 && (
                  <span className="badge rounded-pill text-bg-info">
                    {cantidadTotal}
                  </span>
                )}
              </EnlaceNav>

              {usuarioActual ? (
                <>
                  <EnlaceNav
                    activo={esActiva("perfil")}
                    onClick={() => ir({ nombre: "perfil" })}
                  >
                    Mi perfil
                  </EnlaceNav>
                  <li className="nav-item d-flex align-items-center gap-2 px-lg-2 py-2 py-lg-0 text-white-50">
                    <span>Hola, {usuarioActual.nombre}</span>
                    <RolBadge rol={usuarioActual.rol} />
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className="btn btn-outline-light btn-sm ms-lg-2"
                      onClick={salir}
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <EnlaceNav
                    activo={esActiva("registro")}
                    onClick={() => ir({ nombre: "registro" })}
                  >
                    Registrarse
                  </EnlaceNav>
                  <EnlaceNav
                    activo={esActiva("login")}
                    onClick={() => ir({ nombre: "login" })}
                  >
                    Iniciar sesión
                  </EnlaceNav>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {usuarioActual && tieneGestion && (
        <div className="gestion-bar">
          <div className="container d-flex flex-wrap align-items-center gap-2">
            <span className="gestion-bar__titulo">
              Panel {usuarioActual.rol === "administrador" ? "de administración" : "de ventas"}
            </span>
            {permisos.verGestionProductos && (
              <button
                type="button"
                className={`btn btn-sm ${esActiva("productos-admin") ? "btn-light" : "btn-outline-light"}`}
                onClick={() => ir({ nombre: "productos-admin" })}
              >
                {permisos.crearProductos ? "Productos" : "Inventario y stock"}
              </button>
            )}
            {permisos.crearUsuarios && (
              <button
                type="button"
                className={`btn btn-sm ${esActiva("usuarios") ? "btn-light" : "btn-outline-light"}`}
                onClick={() => ir({ nombre: "usuarios" })}
              >
                {permisos.verGestionUsuarios ? "Usuarios" : "Crear cliente"}
              </button>
            )}
            {permisos.gestionarCategorias && (
              <button
                type="button"
                className={`btn btn-sm ${esActiva("categorias") ? "btn-light" : "btn-outline-light"}`}
                onClick={() => ir({ nombre: "categorias" })}
              >
                Categorías
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
