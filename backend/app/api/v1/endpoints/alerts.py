from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, desc

from app.api import deps
from app.models.user import User
from app.models.alert import Alert
from app.schemas.alert import AlertOut, AlertUpdate

router = APIRouter()

@router.get("/", response_model=List[AlertOut])
def read_alerts(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100,
    unread_only: bool = False
) -> Any:
    """
    Retrieve alerts for the current tenant.
    """
    query = select(Alert).where(Alert.tenant_id == current_user.tenant_id)
    if unread_only:
        query = query.where(Alert.is_read == False)
    
    alerts = db.exec(query.order_by(desc(Alert.created_at)).offset(skip).limit(limit)).all()
    return alerts

@router.patch("/{id}", response_model=AlertOut)
def update_alert(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    alert_in: AlertUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Mark an alert as read/unread.
    """
    alert = db.get(Alert, id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    if alert.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    alert.is_read = alert_in.is_read
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert
