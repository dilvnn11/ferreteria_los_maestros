import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CarritoProvider } from "./context/CarritoContext.tsx";
import { NavegacionProvider } from "./context/NavegacionContext.tsx";
import { NotificacionesProvider } from "./context/NotificacionesContext.tsx";
import { ProductosProvider } from "./context/ProductosContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <NotificacionesProvider>
        <NavegacionProvider>
          <AuthProvider>
            <ProductosProvider>
              <CarritoProvider>
                <App />
              </CarritoProvider>
            </ProductosProvider>
          </AuthProvider>
        </NavegacionProvider>
      </NotificacionesProvider>
    </BrowserRouter>
  </StrictMode>
);