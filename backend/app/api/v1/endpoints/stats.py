from typing import Any, List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func, and_
from app.api import deps
from app.models import ProductSnapshot, Alert, Source
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_user),
) -> Any:
    """
    Get consolidated statistics for the dashboard.
    """
    # 1. Price trend (Last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    # Query daily average prices
    trend_query = (
        select(
            func.date(ProductSnapshot.created_at).label("date"),
            func.avg(ProductSnapshot.price).label("avg_price")
        )
        .join(Source)
        .where(and_(
            Source.tenant_id == current_user.tenant_id,
            ProductSnapshot.created_at >= seven_days_ago
        ))
        .group_by(func.date(ProductSnapshot.created_at))
        .order_by("date")
    )
    trend_data = db.exec(trend_query).all()
    
    # 2. Alerts by category
    alerts_query = (
        select(
            Source.category,
            func.count(Alert.id).label("count")
        )
        .join(Alert, Alert.source_id == Source.id)
        .where(Source.tenant_id == current_user.tenant_id)
        .group_by(Source.category)
    )
    alerts_by_category = db.exec(alerts_query).all()

    # 3. Counters
    sources_count = db.exec(select(func.count(Source.id)).where(Source.tenant_id == current_user.tenant_id)).one()
    unread_alerts = db.exec(
        select(func.count(Alert.id))
        .join(Source)
        .where(and_(
            Source.tenant_id == current_user.tenant_id,
            Alert.is_read == False
        ))
    ).one()

    return {
        "price_trend": [{"name": str(d.date), "precio": round(d.avg_price, 2)} for d in trend_data],
        "alerts_by_category": [{"name": a.category or "General", "total": a.count} for a in alerts_by_category],
        "stats": {
            "sources": sources_count,
            "alerts": unread_alerts,
            "active_jobs": sources_count # Simplified for now
        }
    }
