from celery import Celery
from app.core.config import settings

broker_url = settings.REDIS_URL
backend_url = settings.REDIS_URL

if broker_url.startswith("rediss://"):
    broker_url = "redis://" + broker_url[len("rediss://"):]
    backend_url = "redis://" + backend_url[len("rediss://"):]

celery_app = Celery(
    "pricepulse_tasks",
    broker=broker_url,
    backend=backend_url
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
