from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, Relationship
from .base import BaseIDModel

if TYPE_CHECKING:
    from .tenant import Tenant

class WebhookEndpoint(BaseIDModel, table=True):
    __tablename__ = "webhook_endpoints"

    tenant_id: int = Field(foreign_key="tenants.id")
    url: str
    description: Optional[str] = None
    secret: str = Field(description="Signing secret for webhook verification")
    is_active: bool = True
    
    # Event types to subscribe (comma separated or JSON)
    events: str = "price_change,stock_change" 

    tenant: "Tenant" = Relationship()
