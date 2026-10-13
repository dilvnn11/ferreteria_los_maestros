# Ferretería Los Maestros · Evaluación Parcial N.° 2 (DSY1104)

Migración de la tienda virtual (Evaluación 1: HTML + CSS + JS) a **React + TypeScript + Vite + Bootstrap 5**,
con administración de usuarios, productos y categorías, tres roles y perfil personal.
Equipo: Deland Cabello y Josefa Sánchez.

## Cómo ejecutarlo

```bash
npm install
npm run dev       # desarrollo
npm run build     # compila (tsc + vite)
npm run lint
```

## Cuentas de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@duoc.cl | Admin123 |
| Vendedor | vendedor@duoc.cl | Vendedor123 |
| Cliente | cliente@duoc.cl | Cliente123 |

> Simulación académica solo frontend: usuarios, contraseñas, carrito y productos viven en LocalStorage
> y **no** constituyen un sistema de seguridad real. Para reiniciar los datos: `localStorage.clear()` en la consola del navegador.

## Roles

| Operación | Administrador | Vendedor | Cliente / invitado |
|---|:-:|:-:|:-:|
| Navegar y comprar | ✔ | ✔ | ✔ |
| Editar su propio perfil (sin cambiar rol) | ✔ | ✔ | ✔ |
| Consultar productos (inventario) | ✔ | ✔ | — |
| Modificar stock | ✔ | ✔ | — |
| Crear / editar / eliminar productos | ✔ | — | — |
| Crear / editar / eliminar categorías | ✔ | — | — |
| Crear usuarios | cualquier rol | solo cliente | — |
| Consultar / editar / eliminar usuarios | ✔ | — | — |

El registro público siempre crea cuentas de **cliente**.

## Estructura (misma organización del proyecto `colaboradores`)

```
src/
├── assets/img/        avatares, placeholder y productos/
├── components/        componentes reutilizables (campos, tarjetas, tablas, formularios, navbar…)
├── context/           estado global: Auth, Productos, Carrito, Navegación, Notificaciones
├── data/              datos iniciales (productos, categorías, usuarios, regiones)
├── hooks/             useLocalStorage
├── pages/             una página por sección de la tienda / administración
├── styles/            styles.css (paleta + clases propias sobre Bootstrap)
├── types/             interfaces y tipos TypeScript
├── utils/             validaciones, permisos, filtros, formato, fechas
├── App.tsx
└── main.tsx
```

Ver `INFORME.md` para las decisiones de migración y la guía de la presentación.
