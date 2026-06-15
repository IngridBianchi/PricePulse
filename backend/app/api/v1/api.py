from fastapi import APIRouter
from app.api.v1.endpoints import login, users, sources, alerts, webhooks, stats

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(sources.router, prefix="/sources", tags=["sources"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
