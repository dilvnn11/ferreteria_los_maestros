import { CarritoPage } from "../pages/CarritoPage";
import { CatalogoPage } from "../pages/CatalogoPage";
import { CategoriasPage } from "../pages/CategoriasPage";
import { DetallePage } from "../pages/DetallePage";
import { InicioPage } from "../pages/InicioPage";
import { LoginPage } from "../pages/LoginPage";
import { PerfilPage } from "../pages/PerfilPage";
import { ProductosAdminPage } from "../pages/ProductosAdminPage";
import { RegistroPage } from "../pages/RegistroPage";
import { UsuariosPage } from "../pages/UsuariosPage";
import type { Vista } from "../types/Navegacion";

/** Renderizado condicional: elige qué página mostrar según la vista actual. */
export const VistaActual = ({ vista }: { vista: Vista }) => {
  switch (vista.nombre) {
    case "inicio":
      return <InicioPage />;
    case "catalogo":
      return <CatalogoPage />;
    case "detalle":
      return <DetallePage productoId={vista.id} />;
    case "carrito":
      return <CarritoPage />;
    case "login":
      return <LoginPage />;
    case "registro":
      return <RegistroPage />;
    case "perfil":
      return <PerfilPage />;
    case "usuarios":
      return <UsuariosPage />;
    case "productos-admin":
      return <ProductosAdminPage />;
    case "categorias":
      return <CategoriasPage />;
  }
};
