from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class WatershedSummary(BaseModel):
    id: str
    code: str
    name: str
    state: str
    district: str
    block: str
    basin: str
    area_hectares: float
    centroid_lat: float
    centroid_lon: float

    class Config:
        from_attributes = True

class InterventionMarker(BaseModel):
    id: str
    name: str
    intervention_type: str
    target_latitude: float
    target_longitude: float
    stream_order: int
    status: str
    evidence_count: int = 0
    latest_consistency_status: Optional[str] = None
    latest_review_status: Optional[str] = None

class WatershedDetail(WatershedSummary):
    boundary_geojson: Dict[str, Any]
    drainage_geojson: Dict[str, Any]
    interventions: List[InterventionMarker] = []
