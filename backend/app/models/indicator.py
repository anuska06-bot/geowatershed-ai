from datetime import datetime, date
import uuid
from sqlalchemy import Column, String, Float, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class BiophysicalIndicator(Base):
    __tablename__ = "biophysical_indicators"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    watershed_id = Column(String(36), ForeignKey("watersheds.id", ondelete="CASCADE"), nullable=False)
    indicator_type = Column(String(50), nullable=False)  # NDVI_MEAN, WATER_SPREAD_HA, DRAINAGE_DENSITY, RUNOFF_INDEX
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    value = Column(Float, nullable=False)
    unit = Column(String(30), nullable=False)
    data_source = Column(String(100), nullable=False)  # Sentinel-2 L2A, CartoDEM 30m, IMD Gridded
    methodology = Column(String(255), nullable=False)
    data_quality_status = Column(String(50), default="Verified External Baseline")
    completeness_score = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    watershed = relationship("Watershed", back_populates="indicators")
