from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertBase(BaseModel):
    type: str
    message: str
    product_name: Optional[str] = None
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    is_read: bool = False
    severity: str = "info"

class AlertOut(AlertBase):
    id: int
    source_id: int
    tenant_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AlertUpdate(BaseModel):
    is_read: bool
