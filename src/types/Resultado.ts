/** Resultado de una operación: éxito con datos o fallo con un mensaje para el usuario. */
export type Resultado<T = undefined> =
  | { ok: true; datos: T }
  | { ok: false; error: string };
