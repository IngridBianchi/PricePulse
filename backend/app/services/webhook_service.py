import hmac
import hashlib
import json
import logging
import httpx
from app.core.celery_app import celery_app
from app.models.alert import Alert
from app.models.webhook import WebhookEndpoint
from app.core.db import engine
from sqlmodel import Session, select

logger = logging.getLogger(__name__)

def sign_payload(payload: str, secret: str) -> str:
    return hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()

@celery_app.task(
    name="dispatch_webhook",
    autoretry_for=(httpx.HTTPError,),
    retry_kwargs={'max_retries': 5},
    retry_backoff=True
)
def dispatch_webhook(tenant_id: int, alert_id: int):
    """
    Sends an alert payload to all active webhooks for a tenant.
    """
    with Session(engine) as session:
        # Get alert details
        alert = session.get(Alert, alert_id)
        if not alert:
            return

        # Get active webhooks for tenant
        endpoints = session.exec(
            select(WebhookEndpoint)
            .where(WebhookEndpoint.tenant_id == tenant_id)
            .where(WebhookEndpoint.is_active == True)
        ).all()

        if not endpoints:
            return

        payload_data = {
            "event": alert.type,
            "id": alert.id,
            "message": alert.message,
            "source_id": alert.source_id,
            "old_value": alert.old_value,
            "new_value": alert.new_value,
            "detected_at": alert.created_at.isoformat(),
            "severity": alert.severity
        }
        
        payload_str = json.dumps(payload_data)

        for endpoint in endpoints:
            # Check if subscribed to this event
            if alert.type not in endpoint.events:
                continue

            signature = sign_payload(payload_str, endpoint.secret)
            
            headers = {
                "Content-Type": "application/json",
                "X-PricePulse-Signature": signature,
                "User-Agent": "PricePulse-Webhook/1.0"
            }

            try:
                response = httpx.post(
                    endpoint.url,
                    content=payload_str,
                    headers=headers,
                    timeout=10.0
                )
                response.raise_for_status()
                logger.info(f"Webhook sent successfully to {endpoint.url} for alert {alert.id}")
            except httpx.HTTPError as e:
                logger.error(f"Failed to send webhook to {endpoint.url}: {str(e)}")
                raise # Re-raise for Celery retry
