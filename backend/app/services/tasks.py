import logging
from app.core.celery_app import celery_app
from app.core.db import engine
from app.models.source import Source
from app.models.snapshot import ProductSnapshot
from sqlmodel import Session
from datetime import datetime

from app.services.change_detection import detect_and_create_alerts
import random

logger = logging.getLogger(__name__)

@celery_app.task(name="run_scraping_job")
def run_scraping_job(source_id: int):
    """
    Task to execute a scraping job for a specific source.
    """
    logger.info(f"Starting scraping job for source_id: {source_id}")
    
    with Session(engine) as session:
        source = session.get(Source, source_id)
        if not source:
            logger.error(f"Source {source_id} not found")
            return False

        try:
            # Update status to processing
            source.status = "processing"
            session.add(source)
            session.commit()

            # Mock realistic product names
            product_pool = [
                "iPhone 15 Pro Max", "Samsung Galaxy S24 Ultra", "PlayStation 5 Console",
                "MacBook Air M3", "Dell XPS 13", "Sony WH-1000XM5", "Nintendo Switch OLED",
                "Logitech G Pro X Superlight", "iPad Pro 12.9", "GeForce RTX 4080"
            ]
            
            # Use source name if set, otherwise pick from pool
            base_name = source.name or random.choice(product_pool)
            
            # Mock data with random price fluctuation for testing alerts
            mock_price = round(random.uniform(80.0, 120.0), 2)
            mock_data = {
                "title": f"{base_name} - {source.competitor_name} Edition",
                "price": mock_price,
                "currency": "USD",
                "stock_status": random.choice(["in_stock", "in_stock", "out_of_stock"]),
                "promotion": "10% OFF"
            }

            # Save Snapshot
            snapshot = ProductSnapshot(
                source_id=source.id,
                **mock_data
            )
            session.add(snapshot)
            session.commit() # Commit snapshot first to get an ID
            session.refresh(snapshot)

            # Detect changes and create alerts
            detect_and_create_alerts(session, snapshot)

            # Update Source metadata
            source.status = "active"
            source.last_run = datetime.now().isoformat()
            session.add(source)
            
            session.commit()
            logger.info(f"Successfully scraped and processed source_id: {source_id}")
            return True

        except Exception as e:
            logger.error(f"Error scraping source {source_id}: {str(e)}")
            source.status = "failed"
            session.add(source)
            session.commit()
            return False
