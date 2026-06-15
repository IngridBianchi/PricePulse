from sqlmodel import Session, select, desc
from app.models.snapshot import ProductSnapshot
from app.models.alert import Alert
from app.models.source import Source
from app.services.webhook_service import dispatch_webhook
from typing import Optional

def detect_and_create_alerts(session: Session, current_snapshot: ProductSnapshot):
    """
    Compares the current snapshot with the previous one for the same source
    to detect changes and generate alerts.
    """
    # Get the previous snapshot
    previous_snapshot = session.exec(
        select(ProductSnapshot)
        .where(ProductSnapshot.source_id == current_snapshot.source_id)
        .where(ProductSnapshot.id != current_snapshot.id)
        .order_by(desc(ProductSnapshot.created_at))
        .limit(1)
    ).first()

    if not previous_snapshot:
        return

    source = session.get(Source, current_snapshot.source_id)
    
    # 1. Detect Price Change
    if current_snapshot.price != previous_snapshot.price:
        alert = Alert(
            tenant_id=source.tenant_id,
            source_id=source.id,
            type="price_change",
            message=f"Price changed for {source.competitor_name} in {source.category or 'General'}",
            old_value=str(previous_snapshot.price),
            new_value=str(current_snapshot.price),
            severity="warning" if current_snapshot.price < previous_snapshot.price else "info"
        )
        session.add(alert)
        session.commit()
        session.refresh(alert)
        dispatch_webhook.delay(source.tenant_id, alert.id)

    # 2. Detect Stock Change
    if current_snapshot.stock_status != previous_snapshot.stock_status:
        alert = Alert(
            tenant_id=source.tenant_id,
            source_id=source.id,
            type="stock_change",
            message=f"Stock status changed to {current_snapshot.stock_status} for {source.competitor_name}",
            old_value=previous_snapshot.stock_status,
            new_value=current_snapshot.stock_status,
            severity="critical" if current_snapshot.stock_status == "out_of_stock" else "info"
        )
        session.add(alert)
        session.commit()
        session.refresh(alert)
        dispatch_webhook.delay(source.tenant_id, alert.id)
