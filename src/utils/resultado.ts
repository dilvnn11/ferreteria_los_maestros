import type { Resultado } from "../types/Resultado";

export const exito = <T>(datos: T): Resultado<T> => ({ ok: true, datos });

export const exitoVacio = (): Resultado => ({ ok: true, datos: undefined });

export const fallo = (error: string): { ok: false; error: string } => ({
  ok: false,
  error,
});
