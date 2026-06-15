from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.api import deps
from app.core import security
from app.models.user import User
from app.models.tenant import Tenant
from app.schemas.user import UserCreate, UserOut

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Register a new user and create a new tenant.
    """
    user = db.exec(select(User).where(User.email == user_in.email)).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    # Create Tenant
    new_tenant = Tenant(name=user_in.tenant_name)
    db.add(new_tenant)
    db.commit()
    db.refresh(new_tenant)

    # Create User
    new_user = User(
        email=user_in.email,
        name=user_in.name,
        hashed_password=security.get_password_hash(user_in.password),
        tenant_id=new_tenant.id,
        role="admin",  # First user is admin
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/me", response_model=UserOut)
def read_user_me(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
