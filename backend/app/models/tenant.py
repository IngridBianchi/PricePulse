from typing import List, Optional
from sqlmodel import Relationship
from .base import BaseIDModel

class Tenant(BaseIDModel, table=True):
    __tablename__ = "tenants"

    name: str
    plan: str = "free"  # free, pro, enterprise
    api_key: Optional[str] = None
    is_active: bool = True

    users: List["User"] = Relationship(back_populates="tenant")
