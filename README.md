# PricePulse

**Plataforma de inteligencia competitiva automatizada para e-commerce.**

PricePulse monitorea precios, stock y promociones de tus competidores en tiempo real. Registra las URLs de productos competidores y el sistema detecta automáticamente cambios, genera alertas detalladas y notifica vía API, webhooks o notificaciones push en el navegador.

---

## Características

- **Monitoreo Automatizado** — Scraping programado de URLs con frecuencia configurable (horaria, diaria, semanal).
- **Detección de Cambios** — Comparación instantánea entre snapshots para identificar variaciones de precio, stock y promociones.
- **Alertas Inteligentes** — Dashboard con filtrado, severidad, valores anterior/nuevo y marcado de lectura.
- **Notificaciones Push** — Browser Notification API para alertas en tiempo real sin recargar la página.
- **Webhooks** — Entrega automática de eventos con firma HMAC-SHA256 y reintento automático.
- **API REST** — Endpoints documentados para integración con sistemas externos.
- **Dashboard Analítico** — Gráficos de tendencias de precios y distribución de alertas.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Backend** | Python 3.11+, FastAPI, SQLModel |
| **Base de Datos** | PostgreSQL 16 |
| **Cola de Tareas** | Celery + Redis |
| **Scraping** | Playwright, BeautifulSoup4 |
| **Infraestructura** | Docker Compose (dev), Railway (producción) |

---

## Arquitectura

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   Frontend  │────▶│    API      │────▶│  PostgreSQL  │
│  (Next.js)  │     │  (FastAPI)  │     │              │
└─────────────┘     └──────┬──────┘     └──────────────┘
                           │
                           ▼
                    ┌─────────────┐     ┌──────────────┐
                    │   Celery    │────▶│    Redis     │
                    │   Worker    │     │   (Broker)   │
                    └─────────────┘     └──────────────┘
```

- **Frontend**: SPA con App Router, estado local vía hooks, polling cada 30s para alertas.
- **API**: Endpoints REST bajo `/api/v1`, autenticación JWT (OAuth2 password flow).
- **Worker**: Tareas asíncronas de scraping y entrega de webhooks.
- **Datos**: Modelo multi-tenant (Tenant → User → Source → ProductSnapshot + Alert).

---

## Requisitos Previos

- [Docker](https://www.docker.com/) ≥ 20.10
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2.0
- Git

---

## Instalación y Levantamiento

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd PricePulse
```

### 2. Crear archivo de variables de entorno

Crea un archivo `.env` en la raíz del proyecto

### 3. Levantar todos los servicios

```bash
docker compose up --build -d
```

Esto levantará 5 contenedores:

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `pricepulse-db` | `5433` | PostgreSQL 16 |
| `pricepulse-redis` | `6380` | Redis 7 |
| `pricepulse-api` | `8000` | FastAPI (API REST) |
| `pricepulse-worker` | — | Celery Worker |
| `pricepulse-frontend` | `3000` | Next.js (Frontend) |

### 4. Ejecutar migraciones de base de datos

Si es la primera vez que levantas el proyecto:

```bash
docker exec pricepulse-api python scripts/migrate_alerts.py
docker exec pricepulse-api python scripts/migrate_sources.py
```

### 5. Acceder a la aplicación

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Docs (ReDoc)**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Healthcheck**: [http://localhost:8000/health](http://localhost:8000/health)


---

## Estructura del Proyecto

```
PricePulse/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/   # Endpoints REST
│   │   ├── core/               # Config, DB, Security, Celery
│   │   ├── models/             # Modelos SQLModel
│   │   ├── schemas/            # Esquemas Pydantic
│   │   └── services/           # Lógica de negocio y tareas
│   ├── scripts/                # Migraciones manuales
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── login/              # Autenticación
│   │   ├── register/           # Registro de usuarios
│   │   └── dashboard/          # Panel principal
│   │       ├── alerts/         # Gestión de alertas
│   │       ├── sources/        # Gestión de fuentes
│   │       ├── webhooks/       # Gestión de webhooks
│   │       └── settings/       # Configuración
│   ├── lib/api.ts              # Cliente HTTP
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## API Endpoints

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/login/access-token` | Iniciar sesión (OAuth2) |
| `POST` | `/api/v1/users/register` | Registrar usuario |
| `GET` | `/api/v1/users/me` | Obtener perfil actual |

### Fuentes

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/sources/` | Listar fuentes |
| `POST` | `/api/v1/sources/` | Crear fuente |
| `GET` | `/api/v1/sources/{id}` | Obtener fuente |
| `PATCH` | `/api/v1/sources/{id}` | Actualizar fuente |
| `DELETE` | `/api/v1/sources/{id}` | Eliminar fuente |
| `POST` | `/api/v1/sources/{id}/trigger` | Ejecutar scraping manual |

### Alertas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/alerts` | Listar alertas |
| `PATCH` | `/api/v1/alerts/{id}` | Actualizar alerta |
| `PUT` | `/api/v1/alerts/{id}/read` | Marcar como leída |
| `DELETE` | `/api/v1/alerts/{id}` | Eliminar alerta |

### Webhooks

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/webhooks/` | Listar webhooks |
| `POST` | `/api/v1/webhooks/` | Crear webhook |
| `PATCH` | `/api/v1/webhooks/{id}` | Actualizar webhook |
| `DELETE` | `/api/v1/webhooks/{id}` | Eliminar webhook |

### Estadísticas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/stats/summary` | Resumen de tendencias y alertas |

---

## Comandos Útiles

```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f api
docker compose logs -f worker

# Detener todos los servicios
docker compose down

# Detener y eliminar volúmenes (reset completo)
docker compose down -v

# Reconstruir un servicio específico
docker compose up --build api

# Ejecutar comandos en el contenedor de la API
docker exec -it pricepulse-api bash

# Ejecutar migraciones
docker exec pricepulse-api python scripts/migrate_alerts.py
docker exec pricepulse-api python scripts/migrate_sources.py
```

---

## Roadmap

- **Fase 1 (MVP)** — Scraping mock, alertas básicas, API REST, dashboard.
- **Fase 2 (Beta)** — Scraping real con Playwright, multi-tenant completo, logs mejorados.
- **Fase 3 (Growth)** — Recomendaciones inteligentes, clasificación de productos equivalentes, planes de pago.

---

## Notas de Desarrollo

- **Scraping**: Actualmente usa datos mock. Playwright y BeautifulSoup4 están instalados pero pendientes de integrar.
- **Migraciones**: Se ejecutan manualmente vía scripts SQL. Alembic está instalado pero no configurado.
- **CORS**: Configurado con `allow_origins=["*"]` para desarrollo. Restringir en producción.
- **Producción**: Desplegado en Vercel (frontend) + Railway (backend). Ver `CASESTUDY.md` para detalles del caso de uso y decisiones de arquitectura.

---

*Desarrollado para la automatización de inteligencia competitiva en e-commerce.*
