# PricePulse

PricePulse es una plataforma de inteligencia competitiva para e-commerce que automatiza la recolección, limpieza, normalización y entrega de datos de mercado. Ayuda a empresas, marcas y distribuidores a monitorear precios, stock, promociones y cambios de catálogo de sus competidores en tiempo real, permitiendo una toma de decisiones más rápida y basada en datos.

## 🚀 Propuesta de Valor

PricePulse no solo extrae datos, sino que entrega un flujo completo de información estructurada y lista para usar.
- **Automatización**: Reduce horas de trabajo manual en monitoreo de competidores.
- **Calidad de datos**: Limpieza y normalización automática de datos inconsistentes.
- **Integración**: Entrega de datos a través de API REST o Webhooks.
- **Alertas**: Notificación inmediata ante cambios relevantes (precios, stock, promociones).

## 🛠️ Stack Tecnológico

### Backend
- **Lenguaje**: Python
- **API**: FastAPI
- **Tareas Asíncronas**: Celery
- **Base de Datos**: PostgreSQL
- **Colas y Caché**: Redis

### Frontend
- **Framework**: Next.js / React
- **Estilos**: Tailwind CSS

### Infraestructura
- **Contenedores**: Docker
- **CI/CD**: GitHub Actions

## 📦 Instalación y Configuración

Para ejecutar el proyecto localmente, asegúrate de tener instalado [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/).

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd PricePulse
   ```

2. Configura las variables de entorno:
   Copia el archivo `.env.example` (si existe) o crea un archivo `.env` con las variables necesarias para el backend y frontend.

3. Inicia los servicios con Docker:
   ```bash
   docker-compose up --build
   ```

## 📋 Funcionalidades Principales

- **Gestión de Fuentes**: Registro y configuración de URLs de competidores y productos.
- **Scraping Robusto**: Ejecución de jobs programados en Python para extraer información de manera confiable.
- **Pipeline de Datos**: Limpieza, estandarización y validación de los datos obtenidos.
- **Análisis**: Visualización de historial de precios, stock y tendencias.
- **API/Webhooks**: Integración sencilla con sistemas internos (CRM, ERP, Dashboards).
- **Dashboard**: Panel de control para monitorear el estado de los scrapers y alertas.

## 📈 Roadmap

- **Fase 1 (MVP)**: Funcionalidades básicas de scraping, limpieza, alertas y API.
- **Fase 2 (Beta)**: Multi-tenant, configuración avanzada y logs mejorados.
- **Fase 3 (Growth)**: Recomendaciones inteligentes, clasificación de productos equivalentes y reglas avanzadas.

---
*Desarrollado para la automatización de inteligencia competitiva en e-commerce.*
