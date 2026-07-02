from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "PricePulse"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "yoursecretkeyhere"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "pricepulse"
    DATABASE_URL: Optional[str] = None

    REDIS_URL: str = "redis://redis:6379/0"
    CELERY_WORKER_CONCURRENCY: int = 1
    CELERY_WORKER_MAX_TASKS_PER_CHILD: int = 10

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
