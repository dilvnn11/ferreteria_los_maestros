import type { Rol } from "../types/Usuario";

// Cuentas de demostración que se muestran en la pantalla de inicio de sesión.
export const cuentasDemo: { rol: Rol; correo: string; password: string }[] = [
  { rol: "administrador", correo: "admin@duoc.cl", password: "Admin123" },
  { rol: "vendedor", correo: "vendedor@duoc.cl", password: "Vendedor123" },
  { rol: "cliente", correo: "cliente@duoc.cl", password: "Cliente123" },
];
