from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "pricepulse_tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.task_routes = {
    "app.services.scraper_tasks.*": "main-queue",
}

celery_app.autodiscover_tasks(["app.services"])
