# Ferretería Los Maestros — Frontend

React 19 + TypeScript + Vite + Bootstrap 5.

## Requisitos

- Node.js 20+
- Backend Spring Boot en ejecución (`http://localhost:8080`) con MariaDB/XAMPP

## Configuración

```bash
cp .env.example .env
# VITE_API_URL=http://localhost:8080
npm install
npm run dev
```

La aplicación se abre en `http://localhost:5173`.

## Cuentas demo (seed del backend)

| Rol            | Correo             | Contraseña   |
|----------------|--------------------|--------------|
| Administrador  | admin@duoc.cl      | Admin123     |
| Vendedor       | vendedor@duoc.cl   | Vendedor123  |
| Cliente        | cliente@duoc.cl    | Cliente123   |

## Integración con el backend

- Autenticación JWT (`Authorization: Bearer …`) almacenada en `localStorage` (`ferreteria:token`).
- Catálogo, categorías, usuarios y compras se obtienen y modifican vía API REST.
- El carrito permanece en el navegador; al finalizar se envía a `POST /api/compras`.
- Historial del cliente: `GET /api/compras/mias` (vista `/historial`).
- Sesión restaurada al recargar con `GET /api/auth/me`.

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — producción
- `npm run preview` — previsualizar build
