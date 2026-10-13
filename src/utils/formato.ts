/** Formatea un valor como precio en pesos chilenos: 5990 -> "$5.990". */
export const formatoPrecio = (valor: number): string =>
  "$" + valor.toLocaleString("es-CL");

export const formatoFecha = (iso: string): string =>
  new Date(iso).toLocaleDateString("es-CL");
