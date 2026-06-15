import secrets
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.api import deps
from app.models.user import User
from app.models.webhook import WebhookEndpoint
from app.schemas.webhook import WebhookEndpointCreate, WebhookEndpointOut, WebhookEndpointUpdate

router = APIRouter()

@router.get("/", response_model=List[WebhookEndpointOut])
def read_webhooks(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve webhook endpoints for the current tenant.
    """
    webhooks = db.exec(
        select(WebhookEndpoint)
        .where(WebhookEndpoint.tenant_id == current_user.tenant_id)
        .offset(skip)
        .limit(limit)
    ).all()
    return webhooks

@router.post("/", response_model=WebhookEndpointOut)
def create_webhook(
    *,
    db: Session = Depends(deps.get_db),
    webhook_in: WebhookEndpointCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create a new webhook endpoint.
    """
    webhook = WebhookEndpoint(
        **webhook_in.model_dump(),
        tenant_id=current_user.tenant_id,
        secret=f"whsec_{secrets.token_urlsafe(24)}" # Secure random secret
    )
    db.add(webhook)
    db.commit()
    db.refresh(webhook)
    return webhook

@router.patch("/{id}", response_model=WebhookEndpointOut)
def update_webhook(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    webhook_in: WebhookEndpointUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update a webhook endpoint.
    """
    webhook = db.get(WebhookEndpoint, id)
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    if webhook.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = webhook_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(webhook, key, value)
    
    db.add(webhook)
    db.commit()
    db.refresh(webhook)
    return webhook

@router.delete("/{id}")
def delete_webhook(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a webhook endpoint.
    """
    webhook = db.get(WebhookEndpoint, id)
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    if webhook.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(webhook)
    db.commit()
    return {"status": "success"}
