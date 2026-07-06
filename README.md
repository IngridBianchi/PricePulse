# PricePulse

PricePulse es una plataforma de inteligencia competitiva para e-commerce que automatiza la recolección, limpieza, normalización y entrega de datos de mercado. Ayuda a empresas, marcas y distribuidores a monitorear precios, stock, promociones y cambios de catálogo de sus competidores en tiempo real, permitiendo una toma de decisiones más rápida y basada en datos.

## Propuesta de Valor

PricePulse no solo extrae datos, sino que entrega un flujo completo de información estructurada y lista para usar.
- **Automatización**: Reduce horas de trabajo manual en monitoreo de competidores.
- **Calidad de datos**: Limpieza y normalización automática de datos inconsistentes.
- **Integración**: Entrega de datos a través de API REST o Webhooks.
- **Alertas Inteligentes**: Notificación inmediata ante cambios de precios y stock con detalles específicos del producto.
- **Notificaciones Push**: Sistema de notificaciones nativas en el navegador para monitoreo en tiempo real.

## 🛠️ Stack Tecnológico

### Backend
- **Lenguaje**: Python
- **API**: FastAPI (con soporte CORS configurado para desarrollo)
- **Base de Datos**: PostgreSQL + SQLModel

### Frontend
- **Framework**: Next.js / React
- **Estado**: React Hooks (Polling automático de alertas)
- **Notificaciones**: Browser Notification API

## 📦 Instalación y Configuración

Para ejecutar el proyecto localmente, asegúrate de tener instalado [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/).

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd PricePulse
   ```

2. Inicia los servicios con Docker:
   ```bash
   docker compose up --build -d
   ```

3. **Migración de Base de Datos**:
   Si es la primera vez o has actualizado, ejecuta las migraciones para asegurar que la estructura de tablas sea correcta:
   ```bash
   docker exec pricepulse-api python scripts/migrate_alerts.py
   docker exec pricepulse-api python scripts/migrate_sources.py
   ```

## 📋 Funcionalidades Principales

- **Gestión de Fuentes**: Registro de URLs con nombres personalizados para un mejor seguimiento de productos.
- **Detalle de Variaciones**: Historial comparativo entre el valor anterior y el nuevo (precio/stock).
- **Dashboard de Alertas**: Panel con filtrado, marcado de lectura y borrado de notificaciones.
- **Notificaciones en Tiempo Real**: Polling cada 30 segundos y notificaciones de escritorio para no perder cambios críticos.


## 📈 Roadmap

- **Fase 1 (MVP)**: Funcionalidades básicas de scraping, limpieza, alertas y API.
- **Fase 2 (Beta)**: Multi-tenant, configuración avanzada y logs mejorados.
- **Fase 3 (Growth)**: Recomendaciones inteligentes, clasificación de productos equivalentes y reglas avanzadas.

---
*Desarrollado para la automatización de inteligencia competitiva en e-commerce.*
