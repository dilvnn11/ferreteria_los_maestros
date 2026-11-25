import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import {
  obtenerResumen,
  type PeriodoReporte,
  type ReporteResumen,
} from "../api/reportes";
import { ApiException } from "../api/client";
import { formatoPrecio } from "../utils/formato";

const PERIODOS: { valor: PeriodoReporte; etiqueta: string }[] = [
  { valor: "semana", etiqueta: "Por semana" },
  { valor: "mes", etiqueta: "Por mes" },
  { valor: "anio", etiqueta: "Por año" },
];

export const ReportesPage = () => {
  const [periodo, setPeriodo] = useState<PeriodoReporte>("mes");
  const [data, setData] = useState<ReporteResumen | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async (p: PeriodoReporte) => {
    setCargando(true);
    setError("");
    try {
      const resumen = await obtenerResumen(p);
      setData(resumen);
    } catch (e) {
      setData(null);
      setError(
        e instanceof ApiException
          ? e.message
          : "No se pudieron cargar los reportes.",
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar(periodo);
  }, [periodo, cargar]);

  const maxMontoPeriodo = data
    ? Math.max(1, ...data.porPeriodo.map((x) => x.monto))
    : 1;

  return (
    <>
      <PageHeader
        titulo="Reportes y dashboard"
        descripcion="Indicadores reales calculados desde la base de datos de compras."
      />

      <div className="d-flex flex-wrap gap-2 mb-4">
        {PERIODOS.map((op) => (
          <button
            key={op.valor}
            type="button"
            className={`btn btn-sm ${
              periodo === op.valor ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setPeriodo(op.valor)}
            disabled={cargando}
          >
            {op.etiqueta}
          </button>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary ms-auto"
          onClick={() => void cargar(periodo)}
          disabled={cargando}
        >
          Actualizar
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {cargando && !data && (
        <div className="alert alert-info" role="status">
          Cargando indicadores…
        </div>
      )}

      {data && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-muted small">Operaciones</div>
                  <div className="display-6 fw-semibold">
                    {data.totalOperaciones}
                  </div>
                  <div className="small text-muted">Compras registradas</div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-muted small">Monto total vendido</div>
                  <div className="display-6 fw-semibold">
                    {formatoPrecio(data.montoTotalVendido)}
                  </div>
                  <div className="small text-muted">
                    Suma de todas las compras
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-muted small">Unidades vendidas</div>
                  <div className="display-6 fw-semibold">
                    {data.unidadesVendidas}
                  </div>
                  <div className="small text-muted">Productos despachados</div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <Panel titulo="Productos más solicitados">
                {data.productosMasSolicitados.length === 0 ? (
                  <p className="mb-0 text-muted">
                    Aún no hay ventas registradas.
                  </p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th className="text-end">Cant.</th>
                          <th className="text-end">Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.productosMasSolicitados.map((p) => (
                          <tr key={p.productoId}>
                            <td>
                              <div className="fw-semibold">
                                {p.productoNombre}
                              </div>
                              <div className="small text-muted">
                                {p.productoId}
                              </div>
                            </td>
                            <td className="text-end">{p.cantidadVendida}</td>
                            <td className="text-end">
                              {formatoPrecio(p.monto)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Panel>
            </div>

            <div className="col-12 col-lg-6">
              <Panel
                titulo={`Ventas ${
                  periodo === "semana"
                    ? "semanales"
                    : periodo === "anio"
                      ? "anuales"
                      : "mensuales"
                }`}
              >
                {data.porPeriodo.length === 0 ? (
                  <p className="mb-0 text-muted">Sin datos en el período.</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {data.porPeriodo.map((item) => {
                      const pct = Math.round(
                        (item.monto / maxMontoPeriodo) * 100,
                      );
                      return (
                        <div key={item.etiqueta}>
                          <div className="d-flex justify-content-between small mb-1">
                            <span className="fw-semibold text-capitalize">
                              {item.etiqueta}
                            </span>
                            <span className="text-muted">
                              {item.operaciones} op. ·{" "}
                              {formatoPrecio(item.monto)}
                            </span>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-valuenow={pct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            style={{ height: "0.6rem" }}
                          >
                            <div
                              className="progress-bar bg-primary"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Panel>
            </div>
          </div>
        </>
      )}
    </>
  );
};