from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ConsistencyEvaluation(BaseModel):
    is_inside_watershed: bool
    stream_distance_meters: float
    elevation_delta_meters: Optional[float] = None
    status: str  # Consistent, Potential Inconsistency, Insufficient Information, Requires Field Verification
    reasons: List[str] = Field(default_factory=list)

class ImageQualityMetrics(BaseModel):
    blur_score: float
    is_blurry: bool
    exposure_status: str
    quality_score: float

class EvidenceCardResponse(BaseModel):
    id: str
    intervention_id: str
    intervention_name: str
    intervention_type: str
    project_name: str
    filename: str
    image_url: str
    thumbnail_url: Optional[str] = None
    file_size_bytes: float
    file_sha256: str
    
    # Spatial
    captured_latitude: float
    captured_longitude: float
    altitude_meters: Optional[float] = None
    camera_bearing_deg: Optional[float] = None
    coordinate_source: str
    
    # Temporal
    captured_at: Optional[datetime] = None
    uploaded_at: datetime
    
    # Quality & Consistency
    quality: ImageQualityMetrics
    consistency: ConsistencyEvaluation
    
    # Field notes
    surveyor_name: str
    structure_condition: str
    water_storage_level: str
    notes: Optional[str] = None
    
    # Review
    review_status: str
    reviewer_name: Optional[str] = None
    reviewer_notes: Optional[str] = None
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ReviewSubmission(BaseModel):
    review_status: str = Field(..., description="Reviewed or Rejected or Needs Verification")
    reviewer_name: str = Field(..., min_length=2)
    reviewer_notes: str = Field(..., min_length=3)

class ManualEvidenceSubmission(BaseModel):
    intervention_id: str
    latitude: float
    longitude: float
    surveyor_name: str
    structure_condition: str
    water_storage_level: str
    notes: Optional[str] = None
