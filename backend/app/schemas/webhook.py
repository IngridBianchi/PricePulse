from pydantic import BaseModel, HttpUrl
from typing import Optional, List

class WebhookEndpointBase(BaseModel):
    url: str
    description: Optional[str] = None
    events: Optional[str] = "price_change,stock_change"
    is_active: Optional[bool] = True

class WebhookEndpointCreate(WebhookEndpointBase):
    pass

class WebhookEndpointUpdate(BaseModel):
    url: Optional[str] = None
    description: Optional[str] = None
    events: Optional[str] = None
    is_active: Optional[bool] = None

class WebhookEndpointOut(WebhookEndpointBase):
    id: int
    tenant_id: int
    secret: str

    class Config:
        from_attributes = True
