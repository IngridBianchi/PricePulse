from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, Relationship
from .base import BaseIDModel

if TYPE_CHECKING:
    from .tenant import Tenant
    from .source import Source

class Alert(BaseIDModel, table=True):
    __tablename__ = "alerts"

    tenant_id: int = Field(foreign_key="tenants.id")
    source_id: int = Field(foreign_key="sources.id")
    
    type: str  # price_change, stock_change, promotion_change
    message: str
    
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    
    is_read: bool = Field(default=False)
    severity: str = "info"  # info, warning, critical

    tenant: "Tenant" = Relationship()
    source: "Source" = Relationship()
