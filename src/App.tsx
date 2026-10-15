import { Routes, Route, Navigate } from "react-router-dom";
import { AccesoDenegado } from "./components/AccesoDenegado";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { Toasts } from "./components/Toasts";
import { VistaActual } from "./components/VistaActual";
import { useAuth } from "./context/AuthContext";
import { vistaPermitida } from "./utils/permisos";
import type { Vista } from "./types/Navegacion";

function ContenedorVista({ vista }: { vista: Vista }) {
  const { permisos, usuarioActual } = useAuth();
  const permitida = vistaPermitida(vista, permisos, usuarioActual !== null);

  if (!permitida) {
    return <AccesoDenegado />;
  }

  return <VistaActual vista={vista} />;
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container py-4 py-lg-5 app-main">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<ContenedorVista vista={{ nombre: "inicio" }} />} />
          <Route path="/catalogo" element={<ContenedorVista vista={{ nombre: "catalogo" }} />} />
          <Route path="/login" element={<ContenedorVista vista={{ nombre: "login" }} />} />
          <Route path="/registro" element={<ContenedorVista vista={{ nombre: "registro" }} />} />

          {/* Rutas con Control de Acceso */}
          <Route path="/carrito" element={<ContenedorVista vista={{ nombre: "carrito" }} />} />
          <Route path="/perfil" element={<ContenedorVista vista={{ nombre: "perfil" }} />} />

          {/* Rutas de Administración / Panel */}
          <Route path="/admin/productos" element={<ContenedorVista vista={{ nombre: "productos-admin" }} />} />
          <Route path="/admin/usuarios" element={<ContenedorVista vista={{ nombre: "usuarios" }} />} />
          <Route path="/admin/categorias" element={<ContenedorVista vista={{ nombre: "categorias" }} />} />

          {/* Redirección predeterminada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Toasts />
    </div>
  );
}

export default App;