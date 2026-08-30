# BOOK(RM) — Frontend

Interfaz web de BOOK(RM) para la librería **El Maltés**. React 18 + Vite 5, con estilos inline y **versión responsive** (navegación inferior en mobile).

## Stack

- React 18 + Vite 5 (ES Modules)
- Sin router: navegación por pestañas (estado en `App.jsx`)
- Estilos inline + `src/styles/app.css` (ajustes globales y mobile)
- API client en `src/api/api.js` (JWT `Authorization: Bearer` + `X-API-Key`)

## Requisitos

- Node.js 18+
- Backend corriendo (default `http://localhost:3000`)
- Variables de entorno en `.env` (ver `.env.example`)

## Instalación y arranque

```bash
cd frontend
npm install
cp .env.example .env          # y completá los valores
npm run dev                   # vite → http://localhost:5173
```

Build de producción:

```bash
npm run build                 # genera dist/
```

## Variables de entorno (`.env`)

| Variable | Uso |
|----------|-----|
| `VITE_API_URL` | Base de la API (default `http://localhost:3000/api`) |
| `VITE_API_KEY` | API key compartida (mismo valor que `API_KEY` del backend) |

## Pantallas / pestañas

Todas tras el login (JWT). Roles `admin`/`vendedor`.

| Pestaña | Componente | Descripción |
|---------|------------|-------------|
| 🤖 Asistente | `AsistenteBlock` | Recomendaciones por contenido con stock legacy por local (01/02), precio y tapa; "A Pedir" solo si hay resultados. En modo contenido muestra el aviso "🔎 Búsqueda por contenido" y las cards ocultan los campos de venta vacíos |
| 📦 Pedidos | `PedidoBlock` | Alta rápida, cambio de estado, edición de EAN13 (Pendiente) |
| 👥 Clientes | `ClienteBlock` | CRUD, temáticas (SearchMultiSelect) e historial |
| 🏢 Proveedores | `ProveedoresBlock` | CRUD (id=1 protegido) |
| 📨 Radar | `RadarBlock` | Seguimiento por estado + export CSV |
| 📚 Propuestas | `PropuestasBlock` | Propuestas personalizadas (generar/previsualizar/enviar/export) |
| ⚙️ Config | `ConfigBlock` | Resumen + edición de empresa |
| 👤 Usuarios | `UsuariosBlock` | CRUD de usuarios (solo admin) |
| 📋 Logs | `LogsBlock` | Log de actividad (solo admin): ver y limpiar |

Todas las listas tienen **buscador + paginador**; los selects con muchas opciones tienen **búsqueda integrada**.

## Versión mobile

En pantallas ≤640px:

- **Navegación inferior fija**: Asistente · Pedidos · Clientes · Proveed. · **⋯ Más** (panel con Radar, Propuestas, Config, Usuarios).
- Las listas de **Clientes** y **Pedidos** se muestran como **tarjetas** (no tablas).
- El **Asistente** apila las dos columnas (En Stock / A Pedir) en una sola.
- Las tablas restantes tienen scroll horizontal.
- Detección de viewport con `useIsMobile` (`matchMedia`).

## Árbol de archivos

```
frontend/
├── .env                      # VITE_API_URL / VITE_API_KEY
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── src/
    ├── App.jsx               # Raíz: login + navegación (tabs desktop / bottom nav mobile)
    ├── main.jsx
    ├── constants.js          # ESTADOS_PEDIDO
    ├── api/
    │   └── api.js            # Wrapper fetch (JWT / X-API-Key) + getTapaUrl
    ├── components/
    │   ├── Login.jsx         # Pantalla de login
    │   ├── blocks/
    │   │   ├── AsistenteBlock.jsx
    │   │   ├── ClienteBlock.jsx
    │   │   ├── ConfigBlock.jsx
    │   │   ├── LogsBlock.jsx
    │   │   ├── PedidoBlock.jsx
    │   │   ├── PropuestasBlock.jsx
    │   │   ├── ProveedoresBlock.jsx
    │   │   ├── RadarBlock.jsx
    │   │   └── UsuariosBlock.jsx
    │   └── ui/
    │       ├── Pagination.jsx
    │       ├── RecomendacionCard.jsx
    │       ├── SearchMultiSelect.jsx
    │       └── SearchSelect.jsx
    ├── hooks/
    │   ├── useAsistente.js
    │   ├── useIsMobile.js
    │   └── usePagination.js
    ├── pages/                 # Vacío (reservado)
    ├── styles/
    │   └── app.css           # Estilos globales + ajustes mobile
    └── utils/                 # Vacío (reservado)
```

## Notas

- El frontend **no usa router**: la navegación es un estado de pestaña en `App.jsx`.
- La búsqueda del Asistente **no se pierde al cambiar de pestaña**: `AsistenteBlock` se mantiene montado (se oculta con `display:none`).
- El stock se muestra **diferenciado por local** (Local 01 / Local 02); el total solo suma los locales operativos.
- La tapa de cada libro se carga desde `GET /api/tapas/:ean13` (endpoint público del backend).
- El precio y la tapa de las fichas vienen del backend (enriquecidos con la base legacy).
