import { ContactoForm } from "../components/ContactoForm";
import { Hero } from "../components/Hero";
import { Panel } from "../components/Panel";
import { ProductosGrid } from "../components/ProductosGrid";
import { useNavegacion } from "../context/NavegacionContext";
import { useProductos } from "../context/ProductosContext";

export const InicioPage = () => {
  const { productos, nombreCategoria } = useProductos();
  const { navegar } = useNavegacion();
  const destacados = productos.slice(0, 3);

  return (
    <>
      <Hero
        titulo="Ferretería Los Maestros"
        texto="Todo lo que necesitas para tus proyectos de construcción, reparación y mantenimiento."
        textoBoton="Ver catálogo"
        onClick={() => navegar({ nombre: "catalogo" })}
      />

      <Panel titulo="Productos destacados">
        <ProductosGrid
          productos={destacados}
          nombreCategoria={nombreCategoria}
          onVerDetalle={(id) => navegar({ nombre: "detalle", id })}
          columnasXl={3}
        />
      </Panel>

      <Panel titulo="Quiénes somos">
        <p>
          Ferretería Los Maestros es un negocio familiar ubicado en La Serena,
          Región de Coquimbo, con más de 20 años de trayectoria.
        </p>
        <p>
          Nos especializamos en materiales de construcción, herramientas,
          gasfitería, electricidad y artículos de ferretería general. Atendemos
          tanto a particulares como a contratistas y maestros de obra.
        </p>
        <p className="mb-0">
          <strong>Equipo del proyecto:</strong> Deland Cabello y Josefa Sánchez.
          Este e-commerce se desarrolla como parte del curso DSY1104 – Desarrollo
          FullStack II.
        </p>
      </Panel>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <Panel titulo="Contáctanos" className="h-100">
            <ContactoForm />
          </Panel>
        </div>
        <div className="col-12 col-lg-6">
          <Panel titulo="Ubicación" className="h-100">
            <p>Visítanos en La Serena, Región de Coquimbo.</p>
            <div className="ratio ratio-4x3">
              <iframe
                src="https://www.google.com/maps?q=La%20Serena%2C%20Chile&output=embed"
                loading="lazy"
                title="Mapa Ferretería Los Maestros"
              />
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
};
