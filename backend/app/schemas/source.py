from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime

class SourceBase(BaseModel):
    url: str
    competitor_name: str
    category: Optional[str] = None
    frequency: Optional[str] = "daily"
    is_active: Optional[bool] = True

class SourceCreate(SourceBase):
    pass

class SourceUpdate(BaseModel):
    url: Optional[str] = None
    competitor_name: Optional[str] = None
    category: Optional[str] = None
    frequency: Optional[str] = None
    is_active: Optional[bool] = None

class SourceOut(SourceBase):
    id: int
    tenant_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
