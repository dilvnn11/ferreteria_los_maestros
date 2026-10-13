export type Rol = "administrador" | "vendedor" | "cliente";

export type Genero = "Masculino" | "Femenino" | "Otro" | "Prefiero no decir";

/** Datos personales y de acceso de un usuario (lo que se ingresa en los formularios). */
export interface DatosUsuario {
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // formato AAAA-MM-DD
  correo: string;
  password: string;
  direccion: string;
  region: string;
  genero: Genero;
}

/** Usuario tal como se guarda en LocalStorage. */
export interface Usuario extends DatosUsuario {
  id: string;
  rol: Rol;
  fechaRegistro: string; // ISO
}

/** Usuario sin la contraseña: es lo que se expone a los componentes. */
export type UsuarioPublico = Omit<Usuario, "password">;

/** Cambios permitidos al editar un usuario desde la administración. */
export interface CambiosUsuario extends Omit<DatosUsuario, "password"> {
  password?: string; // vacío = conservar la contraseña actual
  rol: Rol;
}

/** Cambios permitidos al editar el perfil propio (no incluye rol ni contraseña). */
export type CambiosPerfil = Omit<DatosUsuario, "password">;

/** Valores (todos controlados) del formulario de usuario. El género parte vacío (obligatorio). */
export interface FormUsuario extends Omit<DatosUsuario, "genero"> {
  genero: Genero | "";
  confirmPassword: string;
  terminos: boolean;
  rol: Rol;
}

/** Valores del formulario una vez validados (el género ya fue elegido). */
export type FormUsuarioValido = Omit<FormUsuario, "genero"> & { genero: Genero };

/** Variantes del formulario de usuario. */
export type ModoUsuarioForm = "registro" | "crear" | "editar" | "perfil";
