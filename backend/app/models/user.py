from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, Relationship
from .base import BaseIDModel

if TYPE_CHECKING:
    from .tenant import Tenant

class User(BaseIDModel, table=True):
    __tablename__ = "users"

    tenant_id: int = Field(foreign_key="tenants.id")
    name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str
    role: str = "viewer"  # admin, analyst, viewer
    is_active: bool = True

    tenant: "Tenant" = Relationship(back_populates="users")
