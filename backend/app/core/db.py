import time
import socket
import logging
from urllib.parse import urlparse, urlunparse
from sqlmodel import create_engine, Session, SQLModel
from .config import settings

logger = logging.getLogger(__name__)

if not settings.DATABASE_URL:
    # Fallback for local development if not provided via env
    settings.DATABASE_URL = f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@db:5432/{settings.POSTGRES_DB}"

def _resolve_ipv4(url: str) -> str:
    """Replace hostname with IPv4 address to avoid IPv6 routing issues (Railway)."""
    parsed = urlparse(url)
    hostname = parsed.hostname
    if hostname:
        try:
            ip = socket.getaddrinfo(hostname, None, socket.AF_INET)[0][4][0]
            if ip != hostname:
                logger.info("Resolved %s -> %s (IPv4)", hostname, ip)
                netloc = parsed.netloc.replace(hostname, ip, 1)
                parsed = parsed._replace(netloc=netloc)
                return urlunparse(parsed)
        except Exception as e:
            logger.warning("Failed to resolve %s to IPv4: %s", hostname, e)
    return url

engine = create_engine(_resolve_ipv4(settings.DATABASE_URL))

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
