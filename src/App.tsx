import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { AccesoDenegado } from "./components/AccesoDenegado";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { Toasts } from "./components/Toasts";
import { VistaActual } from "./components/VistaActual";
import { useAuth } from "./context/AuthContext";
import { vistaPermitida } from "./utils/permisos";
import type { Vista } from "./types/Navegacion";

const crearVista = (nombre: string, extra = {}): Vista => {
  return { nombre, ...extra } as unknown as Vista;
};

function ContenedorVista({ vista }: { vista: Vista }) {
  const { permisos, usuarioActual } = useAuth();
  const permitida = vistaPermitida(vista, permisos, usuarioActual !== null);

  if (!permitida) {
    return <AccesoDenegado />;
  }

  return <VistaActual vista={vista} />;
}

function ContenedorVistaDetalle() {
  const { id } = useParams<{ id: string }>();

  // Mantenemos 'id' como string tal como viene en la URL (ej: "MC002")
  const vistaDetalle = crearVista("detalle", { id: id || "" });

  return <ContenedorVista vista={vistaDetalle} />;
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container py-4 py-lg-5 app-main">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<ContenedorVista vista={crearVista("inicio")} />} />
          <Route path="/catalogo" element={<ContenedorVista vista={crearVista("catalogo")} />} />
          <Route path="/login" element={<ContenedorVista vista={crearVista("login")} />} />
          <Route path="/registro" element={<ContenedorVista vista={crearVista("registro")} />} />

          {/* Ruta Dinámica para Detalle */}
          <Route path="/producto/:id" element={<ContenedorVistaDetalle />} />

          {/* Rutas Protegidas */}
          <Route path="/carrito" element={<ContenedorVista vista={crearVista("carrito")} />} />
          <Route path="/perfil" element={<ContenedorVista vista={crearVista("perfil")} />} />

          {/* Rutas de Administración */}
          <Route path="/admin/productos" element={<ContenedorVista vista={crearVista("productos-admin")} />} />
          <Route path="/admin/usuarios" element={<ContenedorVista vista={crearVista("usuarios")} />} />
          <Route path="/admin/categorias" element={<ContenedorVista vista={crearVista("categorias")} />} />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Toasts />
    </div>
  );
}

export default App;