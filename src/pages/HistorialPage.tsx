import { Fragment, useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { misCompras, type Compra } from "../api/compras";
import { ApiException } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useNavegacion } from "../context/NavegacionContext";
import { formatoFecha, formatoPrecio } from "../utils/formato";

export const HistorialPage = () => {
  const { usuarioActual } = useAuth();
  const { navegar } = useNavegacion();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [expandida, setExpandida] = useState<number | null>(null);

  useEffect(() => {
    if (!usuarioActual) return;
    let cancelado = false;
    (async () => {
      try {
        const data = await misCompras();
        if (!cancelado) setCompras(data);
      } catch (e) {
        if (!cancelado) {
          setError(
            e instanceof ApiException
              ? e.message
              : "No se pudo cargar el historial.",
          );
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [usuarioActual]);

  if (!usuarioActual) return null;

  return (
    <>
      <PageHeader
        titulo="Mi historial de compras"
        descripcion="Consultas tus pedidos registrados. La información proviene del servidor y permanece aunque cambies de dispositivo."
      />

      {cargando && (
        <Panel>
          <p className="mb-0 text-muted">Cargando historial…</p>
        </Panel>
      )}

      {!cargando && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && compras.length === 0 && (
        <Panel>
          <p className="mb-3">Aún no tienes compras registradas.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navegar({ nombre: "catalogo" })}
          >
            Ir al catálogo
          </button>
        </Panel>
      )}

      {!cargando && !error && compras.length > 0 && (
        <Panel titulo={`Compras (${compras.length})`}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Nº</th>
                  <th scope="col">Fecha</th>
                  <th scope="col" className="text-end">
                    Total
                  </th>
                  <th scope="col" className="text-end">
                    Detalle
                  </th>
                </tr>
              </thead>
              <tbody>
                {compras.map((c) => (
                  <Fragment key={c.id}>
                    <tr>
                      <td>#{c.id}</td>
                      <td>{formatoFecha(c.fecha)}</td>
                      <td className="text-end fw-semibold">
                        {formatoPrecio(c.total)}
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            setExpandida(expandida === c.id ? null : c.id)
                          }
                        >
                          {expandida === c.id ? "Ocultar" : "Ver"}
                        </button>
                      </td>
                    </tr>
                    {expandida === c.id && (
                      <tr>
                        <td colSpan={4} className="bg-light">
                          <ul className="list-unstyled mb-0 small">
                            {c.detalles.map((d, i) => (
                              <li key={`${d.productoId}-${i}`} className="mb-1">
                                <strong>{d.productoNombre}</strong> ({d.productoId})
                                {" · "}
                                {d.cantidad} × {formatoPrecio(d.precioUnitario)} ={" "}
                                {formatoPrecio(d.subtotal)}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </>
  );
};
