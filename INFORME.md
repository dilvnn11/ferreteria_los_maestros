# Informe breve · Migración de Ferretería Los Maestros a React

**Asignatura:** DSY1104 · Evaluación Parcial N.° 2 · **Equipo:** Deland Cabello y Josefa Sánchez

## 1. Migración

La tienda de la Evaluación 1 (6 páginas HTML y 8 archivos JS que manipulaban el DOM con `innerHTML`) se reconstruyó
con React + TypeScript + Vite y Bootstrap 5. Se conservaron todas las secciones y reglas de negocio:

| Evaluación 1 | Ahora |
|---|---|
| `index.html` (hero, destacados, quiénes somos, contacto, mapa) | `InicioPage` + `Hero`, `ProductosGrid`, `ContactoForm` |
| `catalogo.html` (filtro por categoría y precio máximo) | `CatalogoPage` + `FiltrosProductos` (se agregó búsqueda por texto) |
| `detalle.html` (validación de cantidad y stock) | `DetallePage` |
| `carrito.html` (+/−, eliminar, vaciar con confirmación, finalizar compra descuenta stock) | `CarritoPage` + `CarritoItem`, `ResumenCarrito` |
| `registro.html` (campos obligatorios, ≥14 años, @duoc.cl, contraseña 8+/mayúscula/número, correo único, términos) | `RegistroPage` + `UsuarioForm` |
| `login.html` (bloqueo tras 3 intentos fallidos) | `LoginPage` + `AuthContext` |
| `alert()` / `confirm()` | `Toasts` y `ConfirmModal` (React + Bootstrap) |

Cambios deliberados: la sesión guarda solo el id del usuario; el carrito guarda solo `{productoId, cantidad}` y toma
precio y nombre del producto vigente (así no queda desactualizado si el admin cambia un precio o elimina el producto);
los productos referencian su categoría por `categoriaId` (renombrar una categoría se refleja en todos los productos);
la edad se calcula sin el desfase de zona horaria que tenía la versión 1. Las imágenes `.jfif` (que son JPEG) se renombraron a `.jpg`.

## 2. Organización del proyecto

Misma estructura del proyecto base del curso (`components`, `context`, `data`, `types`, `styles`) más `pages`, `hooks` y `utils`.

- **pages/**: una por sección; orquestan contextos y componentes. Sin lógica visual repetida.
- **components/**: piezas con una responsabilidad (p. ej. `CampoTexto`, `ProductoCard`, `UsuariosTabla`). No se crearon componentes
  para cada botón; solo para lo que realmente se repite.
- **context/**: estado global y reglas de negocio. `AuthContext` (usuarios, sesión, permisos, intentos de login),
  `ProductosContext` (productos y categorías), `CarritoContext`, `NavegacionContext`, `NotificacionesContext`.
  Orden de anidación en `main.tsx`: Productos usa Auth (permisos) y Carrito usa Productos (stock).
- **Navegación sin librerías externas:** `NavegacionContext` guarda la vista actual (tipo unión `Vista`) y `VistaActual`
  la renderiza condicionalmente.

## 3. Decisiones principales

- **Roles y permisos:** una sola matriz en `utils/permisos.ts` (`permisosDe(rol)`). Se aplica en tres capas: la interfaz
  (opciones del menú y botones según rol), la vista (`vistaPermitida` + `AccesoDenegado`) y el contexto (cada operación
  vuelve a verificar el permiso y responde con un `Resultado`), de modo que la restricción no depende solo de ocultar botones.
- **Reglas de coherencia:** no se puede eliminar la propia cuenta ni cambiar el propio rol; no se elimina una categoría con productos;
  el administrador puede desbloquear cuentas bloqueadas; el código de producto es único y no editable.
- **Un solo formulario de usuario** (`UsuarioForm`) con cuatro modos (`registro`, `crear`, `editar`, `perfil`) para evitar
  duplicar campos y validaciones. `FiltrosProductos` también se reutiliza en catálogo y en gestión de productos.
- **Formularios controlados** con `useState`; validaciones puras en `utils/validaciones.ts` y mensajes junto a cada campo.
- **TypeScript estricto** (`"strict": true`), sin `any`. Tipos en `src/types`; las operaciones devuelven `Resultado<T>`.
- **Persistencia:** hook `useLocalStorage<T>` (claves con prefijo `ferreteria:`).
- **Bootstrap 5:** grilla (`row`/`col-*`), `navbar-expand-lg`, `table-responsive`, columnas ocultas por breakpoint
  (`d-none d-md-table-cell`), `card`, `modal`, `toast`. Verificado a 375, 768 y 1280 px sin desbordes horizontales.

## 4. Guía para la presentación individual (dónde está cada evidencia)

| Rúbrica | Archivos para mostrar |
|---|---|
| Estructura y organización | árbol `src/`, `main.tsx`, `App.tsx`, `VistaActual.tsx` |
| Componentes, reutilización y props | `UsuarioForm` (4 modos), `FiltrosProductos`, `ProductosGrid` → `ProductoCard`, `CampoTexto`, `Panel`; props: `ProductoCard`, `CarritoItem` |
| Estados, eventos y render dinámico | `useState` en `UsuarioForm`/`CatalogoPage`; `map` + `key` en `ProductosGrid`; `filter` en `utils/filtros.ts`; condicionales en `Navbar` y `ProductosTabla` |
| TypeScript | `types/*.ts`, genéricos en `actualizar<K extends keyof FormUsuario>` (`UsuarioForm`), `Vista` (unión discriminada), `Resultado<T>` |
| Funcionalidades y roles | `utils/permisos.ts`, `AuthContext`, `ProductosContext`, `UsuariosPage`, `ProductosAdminPage` |
| Navegación y Bootstrap | `Navbar.tsx` (menú colapsable por rol), `styles.css`, clases `col-*` y `d-none d-*` |

Flujo sugerido para demostrar: invitado compra → registro con errores → login cliente y edición de perfil →
vendedor modifica stock y crea cliente → administrador crea usuario/producto/categoría y prueba una restricción.
