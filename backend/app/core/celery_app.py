import ssl
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "pricepulse_tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

ssl_config = {}
if settings.REDIS_URL.startswith("rediss://"):
    ssl_config = {
        "ssl_cert_reqs": ssl.CERT_NONE,
    }

celery_app.conf.update(
    broker_connection_retry=True,
    broker_connection_retry_on_startup=True,
    worker_concurrency=settings.CELERY_WORKER_CONCURRENCY,
    worker_max_tasks_per_child=settings.CELERY_WORKER_MAX_TASKS_PER_CHILD,
    broker_use_ssl=dict(ssl_config),
    redis_backend_use_ssl=dict(ssl_config),
)

celery_app.conf.task_routes = {
    "app.services.tasks.*": {"queue": "main-queue"},
}

celery_app.autodiscover_tasks(["app.services"])
