from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.api import deps
from app.models.user import User
from app.models.source import Source
from app.schemas.source import SourceCreate, SourceOut, SourceUpdate
from app.services.tasks import run_scraping_job

router = APIRouter()

@router.get("/", response_model=List[SourceOut])
def read_sources(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve sources for the current tenant.
    """
    sources = db.exec(
        select(Source)
        .where(Source.tenant_id == current_user.tenant_id)
        .offset(skip)
        .limit(limit)
    ).all()
    return sources

@router.post("/", response_model=SourceOut)
def create_source(
    *,
    db: Session = Depends(deps.get_db),
    source_in: SourceCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create a new source for the current tenant and trigger initial scrape.
    """
    source = Source(
        **source_in.model_dump(),
        tenant_id=current_user.tenant_id
    )
    db.add(source)
    db.commit()
    db.refresh(source)
    
    # Trigger asynchronous scraping task
    run_scraping_job.delay(source.id)
    
    return source

@router.get("/{id}", response_model=SourceOut)
def read_source(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get a specific source by ID.
    """
    source = db.get(Source, id)
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    if source.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return source

@router.patch("/{id}", response_model=SourceOut)
def update_source(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    source_in: SourceUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update a source.
    """
    source = db.get(Source, id)
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    if source.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = source_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(source, key, value)
    
    db.add(source)
    db.commit()
    db.refresh(source)
    return source

@router.delete("/{id}")
def delete_source(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a source.
    """
    source = db.get(Source, id)
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    if source.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(source)
    db.commit()
    return {"status": "success"}

@router.post("/{id}/trigger")
def trigger_source_scrape(
    *,
    id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Manually trigger a scraping job for a source.
    """
    # We call it directly to see results immediately in this session
    success = run_scraping_job(id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to run scraping job")
    return {"status": "success", "message": "Scraping job executed successfully"}


