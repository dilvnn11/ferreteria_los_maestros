/** Edad en años cumplidos a partir de una fecha AAAA-MM-DD. Devuelve NaN si la fecha no es válida. */
export function calcularEdad(fechaNacimiento: string, hoy: Date): number {
  const [anio, mes, dia] = fechaNacimiento.split("-").map(Number);
  if (!anio || !mes || !dia) return NaN;

  let edad = hoy.getFullYear() - anio;
  const diferenciaMes = hoy.getMonth() + 1 - mes;
  if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < dia)) {
    edad--;
  }
  return edad;
}

/** Fecha de hoy en formato AAAA-MM-DD (útil como atributo max de un input date). */
export function fechaHoyISO(hoy: Date): string {
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}
