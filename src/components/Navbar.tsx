import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { useNotificaciones } from "../context/NotificacionesContext";
import { RolBadge } from "./RolBadge";

export const Navbar = () => {
  const navigate = useNavigate();
  const { usuarioActual, permisos, cerrarSesion } = useAuth();
  const { cantidadTotal } = useCarrito();
  const { notificar } = useNotificaciones();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => setMenuAbierto(false);

  const salir = () => {
    cerrarSesion();
    cerrarMenu();
    navigate("/");
    notificar("Sesión cerrada correctamente.", "info");
  };

  const tieneGestion =
    permisos.verGestionProductos ||
    permisos.crearUsuarios ||
    permisos.gestionarCategorias;

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark app-navbar">
        <div className="container">
          <Link className="navbar-brand" to="/" onClick={cerrarMenu}>
            🔧 Ferretería Los Maestros
          </Link>

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
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={cerrarMenu}
                >
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/catalogo"
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={cerrarMenu}
                >
                  Catálogo
                </NavLink>
              </li>
            </ul>

            <ul className="navbar-nav align-items-lg-center">
              <li className="nav-item">
                <NavLink
                  to="/carrito"
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={cerrarMenu}
                >
                  🛒 Carrito{" "}
                  {cantidadTotal > 0 && (
                    <span className="badge rounded-pill text-bg-info">
                      {cantidadTotal}
                    </span>
                  )}
                </NavLink>
              </li>

              {usuarioActual ? (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/perfil"
                      className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                      onClick={cerrarMenu}
                    >
                      Mi perfil
                    </NavLink>
                  </li>
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
                  <li className="nav-item">
                    <NavLink
                      to="/registro"
                      className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                      onClick={cerrarMenu}
                    >
                      Registrarse
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/login"
                      className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                      onClick={cerrarMenu}
                    >
                      Iniciar sesión
                    </NavLink>
                  </li>
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
              <NavLink
                to="/admin/productos"
                className={({ isActive }) =>
                  `btn btn-sm ${isActive ? "btn-light" : "btn-outline-light"}`
                }
              >
                {permisos.crearProductos ? "Productos" : "Inventario y stock"}
              </NavLink>
            )}
            {permisos.crearUsuarios && (
              <NavLink
                to="/admin/usuarios"
                className={({ isActive }) =>
                  `btn btn-sm ${isActive ? "btn-light" : "btn-outline-light"}`
                }
              >
                {permisos.verGestionUsuarios ? "Usuarios" : "Crear cliente"}
              </NavLink>
            )}
            {permisos.gestionarCategorias && (
              <NavLink
                to="/admin/categorias"
                className={({ isActive }) =>
                  `btn btn-sm ${isActive ? "btn-light" : "btn-outline-light"}`
                }
              >
                Categorías
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};