from datetime import datetime, date
import uuid
from sqlalchemy import Column, String, Float, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    watershed_id = Column(String(36), ForeignKey("watersheds.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(200), nullable=False)
    scheme_name = Column(String(100), default="WDC-PMKSY 2.0")
    status = Column(String(50), default="In Progress") # Proposed, Approved, In Progress, Under Review, Completed
    sanctioned_budget_inr = Column(Float, default=0.0)
    expenditure_inr = Column(Float, default=0.0)
    start_date = Column(Date, default=date.today)
    target_date = Column(Date, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    watershed = relationship("Watershed", back_populates="projects")
    interventions = relationship("Intervention", back_populates="project", cascade="all, delete-orphan")
