from datetime import datetime
import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class FieldEvidence(Base):
    __tablename__ = "field_evidence"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    intervention_id = Column(String(36), ForeignKey("interventions.id", ondelete="CASCADE"), nullable=False)
    
    # File storage
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    thumbnail_path = Column(String(500), nullable=True)
    file_sha256 = Column(String(64), index=True, nullable=False)
    file_size_bytes = Column(Float, default=0.0)

    # Spatial telemetry
    captured_latitude = Column(Float, nullable=False)
    captured_longitude = Column(Float, nullable=False)
    altitude_meters = Column(Float, nullable=True)
    camera_bearing_deg = Column(Float, nullable=True)
    coordinate_source = Column(String(50), default="EXIF_GPS")  # EXIF_GPS, MANUAL_MAP_PIN, FIELD_DEVICE
    
    # Temporal telemetry
    captured_at = Column(DateTime, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # Image quality assessment (OpenCV / Pillow)
    blur_score = Column(Float, default=0.0)  # Laplacian variance
    is_blurry = Column(Boolean, default=False)
    exposure_status = Column(String(30), default="OPTIMAL")  # OPTIMAL, UNDER_EXPOSED, OVER_EXPOSED
    quality_score = Column(Float, default=1.0)  # 0.0 - 1.0

    # Hydrologic & Topological consistency (WIEOF)
    is_inside_watershed = Column(Boolean, default=True)
    stream_distance_meters = Column(Float, default=0.0)
    elevation_delta_meters = Column(Float, nullable=True)
    consistency_status = Column(String(50), default="Consistent")  # Consistent, Potential Inconsistency, Insufficient Information, Requires Field Verification
    consistency_reasons = Column(JSON, default=list)

    # Field observation details
    surveyor_name = Column(String(100), default="Field Officer")
    structure_condition = Column(String(50), default="Good")  # Good, Moderate Siltation, High Siltation, Damaged, Dry
    water_storage_level = Column(String(50), default="Moderate") # Dry, Low (<25%), Moderate (25-75%), Full (>75%)
    notes = Column(Text, nullable=True)

    # Human-in-the-Loop Review
    review_status = Column(String(50), default="Preliminary")  # Preliminary, Needs Verification, Reviewed, Rejected
    reviewer_name = Column(String(100), nullable=True)
    reviewer_notes = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    intervention = relationship("Intervention", back_populates="evidence_records")
