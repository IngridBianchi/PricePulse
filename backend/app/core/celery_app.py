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
    worker_concurrency=settings.CELERY_WORKER_CONCURRENCY,
    worker_max_tasks_per_child=settings.CELERY_WORKER_MAX_TASKS_PER_CHILD,
)

celery_app.conf.task_routes = {
    "app.services.tasks.*": {"queue": "main-queue"},
}

celery_app.autodiscover_tasks(["app.services"])
