from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: str
    is_active: Optional[bool] = True
    role: Optional[str] = "viewer"

class UserCreate(UserBase):
    password: str
    tenant_name: str  # For initial registration, we create a tenant

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[str] = None

class UserOut(UserBase):
    id: int
    tenant_id: int

    class Config:
        from_attributes = True
