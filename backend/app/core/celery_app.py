import ssl
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "pricepulse_tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    broker_connection_retry=True,
    broker_connection_retry_on_startup=True,
    broker_use_ssl={
        "ssl_cert_reqs": ssl.CERT_NONE,
    },
    redis_backend_use_ssl={
        "ssl_cert_reqs": ssl.CERT_NONE,
    },
)

celery_app.conf.task_routes = {
    "app.services.tasks.*": {"queue": "main-queue"},
}

celery_app.autodiscover_tasks(["app.services"])
