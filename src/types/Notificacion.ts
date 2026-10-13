export type TipoNotificacion = "success" | "danger" | "warning" | "info";

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: TipoNotificacion;
}
