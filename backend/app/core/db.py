import time
import logging
from sqlmodel import create_engine, Session, SQLModel
from .config import settings

logger = logging.getLogger(__name__)

if not settings.DATABASE_URL:
    # Fallback for local development if not provided via env
    settings.DATABASE_URL = f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@db:5432/{settings.POSTGRES_DB}"

engine = create_engine(settings.DATABASE_URL)

def init_db():
    # Retry logic for DB connection to handle startup race conditions
    max_retries = 5
    retry_delay = 5
    
    for i in range(max_retries):
        try:
            logger.info(f"Attempting to initialize database (attempt {i+1}/{max_retries})...")
            SQLModel.metadata.create_all(engine)
            logger.info("Database initialized successfully.")
            break
        except Exception as e:
            if i < max_retries - 1:
                logger.warning(f"Database connection failed: {e}. Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                logger.error("Could not connect to the database after several attempts.")
                raise e

def get_session():
    with Session(engine) as session:
        yield session
