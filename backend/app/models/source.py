from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, Relationship
from .base import BaseIDModel

if TYPE_CHECKING:
    from .tenant import Tenant

class Source(BaseIDModel, table=True):
    __tablename__ = "sources"

    tenant_id: int = Field(foreign_key="tenants.id")
    name: Optional[str] = None  # User defined name for the product
    url: str
    competitor_name: str
    category: Optional[str] = None
    frequency: str = "daily"  # hourly, daily, weekly
    is_active: bool = True
    
    # Metadata for scraping
    last_run: Optional[str] = None
    status: str = "pending"  # pending, processing, active, failed

    tenant: "Tenant" = Relationship()
