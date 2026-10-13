import type { Categoria } from "../types/Categoria";
import type { FormProducto, Producto } from "../types/Producto";
import type {
  FormUsuario,
  ModoUsuarioForm,
  UsuarioPublico,
} from "../types/Usuario";
import { calcularEdad } from "./fechas";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const DOMINIO_PERMITIDO = "@duoc.cl";
export const EDAD_MINIMA = 14;

export type ErroresUsuario = Partial<Record<keyof FormUsuario, string>>;
export type ErroresProducto = Partial<Record<keyof FormProducto, string>>;

/** Mínimo 8 caracteres, 1 mayúscula y 1 número. Devuelve el mensaje de error o null. */
export function validarPassword(pass: string): string | null {
  if (pass.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (!/[A-Z]/.test(pass))
    return "La contraseña debe contener al menos una mayúscula.";
  if (!/[0-9]/.test(pass))
    return "La contraseña debe contener al menos un número.";
  return null;
}

export function validarCorreo(correo: string): string | null {
  const limpio = correo.trim().toLowerCase();
  if (!limpio) return "El correo electrónico es obligatorio.";
  if (!EMAIL_REGEX.test(limpio)) return "El formato del correo no es válido.";
  if (!limpio.endsWith(DOMINIO_PERMITIDO))
    return `Solo se permiten correos del dominio ${DOMINIO_PERMITIDO}.`;
  return null;
}

/**
 * Valida el formulario de usuario según el modo de uso.
 * `idActual` es el usuario que se está editando (para no marcar su propio correo como duplicado).
 */
export function validarFormUsuario(
  v: FormUsuario,
  modo: ModoUsuarioForm,
  usuarios: UsuarioPublico[],
  hoy: Date,
  idActual?: string,
): ErroresUsuario {
  const errores: ErroresUsuario = {};

  if (!v.nombre.trim()) errores.nombre = "El nombre es obligatorio.";
  if (!v.apellido.trim()) errores.apellido = "El apellido es obligatorio.";

  if (!v.fechaNacimiento) {
    errores.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
  } else {
    const edad = calcularEdad(v.fechaNacimiento, hoy);
    if (Number.isNaN(edad) || edad < 0) {
      errores.fechaNacimiento = "Ingresa una fecha de nacimiento válida.";
    } else if (edad < EDAD_MINIMA) {
      errores.fechaNacimiento = `Debes tener al menos ${EDAD_MINIMA} años.`;
    }
  }

  const errorCorreo = validarCorreo(v.correo);
  if (errorCorreo) {
    errores.correo = errorCorreo;
  } else if (
    usuarios.some(
      (u) => u.correo === v.correo.trim().toLowerCase() && u.id !== idActual,
    )
  ) {
    errores.correo = "Ya existe una cuenta con ese correo electrónico.";
  }

  // Contraseña: obligatoria al crear; opcional al editar; no aplica en el perfil
  if (modo === "registro" || modo === "crear" || modo === "editar") {
    const obligatoria = modo !== "editar";
    if (!v.password) {
      if (obligatoria) errores.password = "La contraseña es obligatoria.";
    } else {
      const errorPass = validarPassword(v.password);
      if (errorPass) errores.password = errorPass;
    }
    if (v.password || obligatoria) {
      if (!v.confirmPassword) {
        errores.confirmPassword = "Debes confirmar la contraseña.";
      } else if (v.password !== v.confirmPassword) {
        errores.confirmPassword = "Las contraseñas no coinciden.";
      }
    }
  }

  if (!v.direccion.trim()) errores.direccion = "La dirección es obligatoria.";
  if (!v.region) errores.region = "Debes seleccionar una región.";
  if (!v.genero) errores.genero = "Debes seleccionar un género.";
  if (modo === "registro" && !v.terminos)
    errores.terminos = "Debes aceptar los términos y condiciones.";

  return errores;
}

/** Valida el formulario de producto (los números llegan como texto). */
export function validarFormProducto(
  v: FormProducto,
  modo: "crear" | "editar",
  productos: Producto[],
  categorias: Categoria[],
): ErroresProducto {
  const errores: ErroresProducto = {};

  if (modo === "crear") {
    const codigo = v.id.trim();
    if (!codigo) {
      errores.id = "El código es obligatorio.";
    } else if (!/^[A-Za-z0-9-]{3,12}$/.test(codigo)) {
      errores.id = "Usa de 3 a 12 letras, números o guiones (sin espacios).";
    } else if (
      productos.some((p) => p.id.toLowerCase() === codigo.toLowerCase())
    ) {
      errores.id = "Ya existe un producto con ese código.";
    }
  }

  if (v.nombre.trim().length < 3)
    errores.nombre = "El nombre debe tener al menos 3 caracteres.";
  if (!categorias.some((c) => c.id === v.categoriaId))
    errores.categoriaId = "Debes seleccionar una categoría.";
  if (!v.subcategoria.trim())
    errores.subcategoria = "La subcategoría es obligatoria.";
  if (!v.marca.trim()) errores.marca = "La marca es obligatoria.";
  if (!v.unidad.trim()) errores.unidad = "La unidad es obligatoria.";

  const precio = Number(v.precio);
  if (v.precio === "" || !Number.isInteger(precio) || precio <= 0)
    errores.precio = "El precio debe ser un entero mayor a 0.";

  const stock = Number(v.stock);
  if (v.stock === "" || !Number.isInteger(stock) || stock < 0)
    errores.stock = "El stock debe ser un entero igual o mayor a 0.";

  const minimo = Number(v.stockMinimo);
  if (v.stockMinimo === "" || !Number.isInteger(minimo) || minimo < 0)
    errores.stockMinimo = "El stock mínimo debe ser un entero igual o mayor a 0.";

  if (v.descripcion.trim().length < 10)
    errores.descripcion = "La descripción debe tener al menos 10 caracteres.";

  return errores;
}

export function validarNombreCategoria(
  nombre: string,
  categorias: Categoria[],
  idActual?: string,
): string | null {
  const limpio = nombre.trim();
  if (limpio.length < 3) return "El nombre debe tener al menos 3 caracteres.";
  if (limpio.length > 40) return "El nombre no puede superar los 40 caracteres.";
  const repetida = categorias.some(
    (c) => c.id !== idActual && c.nombre.toLowerCase() === limpio.toLowerCase(),
  );
  if (repetida) return "Ya existe una categoría con ese nombre.";
  return null;
}

export type ErroresContacto = Partial<
  Record<"nombre" | "correo" | "mensaje", string>
>;

export function validarContacto(
  nombre: string,
  correo: string,
  mensaje: string,
): ErroresContacto {
  const errores: ErroresContacto = {};
  if (!nombre.trim()) errores.nombre = "El nombre es obligatorio.";
  if (!correo.trim()) errores.correo = "El correo es obligatorio.";
  else if (!EMAIL_REGEX.test(correo.trim()))
    errores.correo = "Ingresa un correo electrónico válido.";
  if (!mensaje.trim()) errores.mensaje = "El mensaje es obligatorio.";
  return errores;
}
