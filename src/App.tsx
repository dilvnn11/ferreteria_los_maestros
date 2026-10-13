import { AccesoDenegado } from "./components/AccesoDenegado";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { Toasts } from "./components/Toasts";
import { VistaActual } from "./components/VistaActual";
import { useAuth } from "./context/AuthContext";
import { useNavegacion } from "./context/NavegacionContext";
import { vistaPermitida } from "./utils/permisos";

function App() {
  const { vista } = useNavegacion();
  const { permisos, usuarioActual } = useAuth();

  // Si la sesión o el rol cambian, una vista restringida deja de mostrarse
  const permitida = vistaPermitida(vista, permisos, usuarioActual !== null);

  return (
    <div className="app">
      <Navbar />
      <main className="container py-4 py-lg-5 app-main">
        {permitida ? <VistaActual vista={vista} /> : <AccesoDenegado />}
      </main>
      <Footer />
      <Toasts />
    </div>
  );
}

export default App;
