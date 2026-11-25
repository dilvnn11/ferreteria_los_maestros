import { apiFetch } from "./client";

export type PeriodoReporte = "semana" | "mes" | "anio";

export interface ProductoTop {
  productoId: string;
  productoNombre: string;
  cantidadVendida: number;
  monto: number;
}

export interface PeriodoItem {
  etiqueta: string;
  operaciones: number;
  monto: number;
}

export interface ReporteResumen {
  totalOperaciones: number;
  montoTotalVendido: number;
  unidadesVendidas: number;
  productosMasSolicitados: ProductoTop[];
  porPeriodo: PeriodoItem[];
}

export async function obtenerResumen(
  periodo: PeriodoReporte = "mes",
): Promise<ReporteResumen> {
  return apiFetch<ReporteResumen>(
    `/api/reportes/resumen?periodo=${encodeURIComponent(periodo)}`,
  );
}