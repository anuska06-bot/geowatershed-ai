from datetime import datetime
import uuid
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    watershed_id = Column(String(36), ForeignKey("watersheds.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)  # e.g., "Masonry Check Dam CD-04"
    intervention_type = Column(String(50), nullable=False)  # Check Dam, Farm Pond, Continuous Contour Trench, Percolation Tank, Gully Plug, Afforestation
    target_latitude = Column(Float, nullable=False)
    target_longitude = Column(Float, nullable=False)
    target_elevation_m = Column(Float, nullable=True)
    stream_order = Column(Integer, default=1)
    status = Column(String(50), default="Sanctioned")  # Sanctioned, Under Construction, Completed, Operational
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="interventions")
    watershed = relationship("Watershed", back_populates="interventions")
    evidence_records = relationship("FieldEvidence", back_populates="intervention", cascade="all, delete-orphan")
