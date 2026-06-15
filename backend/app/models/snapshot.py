from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, Relationship
from .base import BaseIDModel

if TYPE_CHECKING:
    from .source import Source

class ProductSnapshot(BaseIDModel, table=True):
    __tablename__ = "product_snapshots"

    source_id: int = Field(foreign_key="sources.id")
    
    title: str
    price: float
    currency: str = "USD"
    stock_status: str = "in_stock"  # in_stock, out_of_stock, unknown
    promotion: Optional[str] = None
    
    # Raw data and scoring
    raw_html_path: Optional[str] = None
    quality_score: float = 1.0
    
    source: "Source" = Relationship()
