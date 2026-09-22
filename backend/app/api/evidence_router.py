import hashlib
import shutil
from datetime import datetime
from typing import List, Optional
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import settings, EVIDENCE_DIR
from app.models import Intervention, Watershed, FieldEvidence, AuditLog, Project
from app.schemas.evidence_schema import (
    EvidenceCardResponse,
    ImageQualityMetrics,
    ConsistencyEvaluation,
    ReviewSubmission
)
from app.services.ai_service import ai_service
from app.services.consistency_service import consistency_service

router = APIRouter(prefix="/evidence", tags=["Field Evidence"])

def _format_card_response(ev: FieldEvidence, db: Session) -> EvidenceCardResponse:
    interv = db.query(Intervention).filter(Intervention.id == ev.intervention_id).first()
    proj = db.query(Project).filter(Project.id == interv.project_id).first() if interv else None
    
    # Static image URL (served via static files endpoint)
    image_url = f"/uploads/evidence/{ev.filename}"

    return EvidenceCardResponse(
        id=ev.id,
        intervention_id=ev.intervention_id,
        intervention_name=interv.name if interv else "Unknown Intervention",
        intervention_type=interv.intervention_type if interv else "Unknown Type",
        project_name=proj.name if proj else "Watershed Project",
        filename=ev.filename,
        image_url=image_url,
        thumbnail_url=image_url,
        file_size_bytes=ev.file_size_bytes,
        file_sha256=ev.file_sha256,
        captured_latitude=ev.captured_latitude,
        captured_longitude=ev.captured_longitude,
        altitude_meters=ev.altitude_meters,
        camera_bearing_deg=ev.camera_bearing_deg,
        coordinate_source=ev.coordinate_source,
        captured_at=ev.captured_at,
        uploaded_at=ev.uploaded_at,
        quality=ImageQualityMetrics(
            blur_score=ev.blur_score,
            is_blurry=ev.is_blurry,
            exposure_status=ev.exposure_status,
            quality_score=ev.quality_score
        ),
        consistency=ConsistencyEvaluation(
            is_inside_watershed=ev.is_inside_watershed,
            stream_distance_meters=ev.stream_distance_meters,
            elevation_delta_meters=ev.elevation_delta_meters,
            status=ev.consistency_status,
            reasons=ev.consistency_reasons or []
        ),
        surveyor_name=ev.surveyor_name,
        structure_condition=ev.structure_condition,
        water_storage_level=ev.water_storage_level,
        notes=ev.notes,
        review_status=ev.review_status,
        reviewer_name=ev.reviewer_name,
        reviewer_notes=ev.reviewer_notes,
        reviewed_at=ev.reviewed_at
    )

@router.get("", response_model=List[EvidenceCardResponse])
def list_evidence(intervention_id: Optional[str] = None, db: Session = Depends(get_db)):
    """Returns all field evidence records with full WIEOF intelligence."""
    query = db.query(FieldEvidence)
    if intervention_id:
        query = query.filter(FieldEvidence.intervention_id == intervention_id)
    records = query.order_by(FieldEvidence.uploaded_at.desc()).all()
    return [_format_card_response(ev, db) for ev in records]

@router.get("/{evidence_id}", response_model=EvidenceCardResponse)
def get_evidence_card(evidence_id: str, db: Session = Depends(get_db)):
    """Retrieves a single Intervention Evidence Card by ID."""
    ev = db.query(FieldEvidence).filter(FieldEvidence.id == evidence_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence record not found")
    return _format_card_response(ev, db)

@router.post("/upload", response_model=EvidenceCardResponse)
async def upload_field_evidence(
    intervention_id: str = Form(...),
    file: UploadFile = File(...),
    manual_latitude: Optional[float] = Form(None),
    manual_longitude: Optional[float] = Form(None),
    surveyor_name: str = Form("Field Surveyor"),
    structure_condition: str = Form("Good"),
    water_storage_level: str = Form("Moderate"),
    notes: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Ingests a geocoded field photograph, performs EXIF GPS extraction with
    manual pin fallback, runs OpenCV blur/exposure assessment, and calculates
    hydrologic consistency against the micro-watershed stream network.
    """
    interv = db.query(Intervention).filter(Intervention.id == intervention_id).first()
    if not interv:
        raise HTTPException(status_code=404, detail="Selected intervention does not exist.")

    watershed = db.query(Watershed).filter(Watershed.id == interv.watershed_id).first()
    if not watershed:
        raise HTTPException(status_code=404, detail="Associated watershed not found.")

    # Read binary bytes
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds maximum size of 15MB.")

    # Calculate SHA-256
    file_sha256 = hashlib.sha256(contents).hexdigest()

    # Step 1: EXIF Telemetry Extraction
    exif_telemetry = ai_service.extract_exif_telemetry(contents)
    
    lat = exif_telemetry.get("latitude")
    lon = exif_telemetry.get("longitude")
    alt = exif_telemetry.get("altitude")
    bearing = exif_telemetry.get("camera_bearing")
    captured_at = exif_telemetry.get("timestamp") or datetime.utcnow()
    coord_source = "EXIF_GPS"

    # Fallback to manual coordinates if EXIF GPS is missing
    if lat is None or lon is None:
        if manual_latitude is not None and manual_longitude is not None:
            lat = manual_latitude
            lon = manual_longitude
            coord_source = "MANUAL_MAP_PIN"
        else:
            # Fall back to intervention target location if neither is supplied
            lat = interv.target_latitude
            lon = interv.target_longitude
            coord_source = "PROJECT_TARGET_FALLBACK"

    # Step 2: Image Quality Analysis (Blur & Exposure)
    quality = ai_service.assess_image_quality(contents)

    # Step 3: Evidence Consistency Engine (WIEOF)
    consistency = consistency_service.evaluate_intervention_evidence(
        lat=lat,
        lon=lon,
        intervention_type=interv.intervention_type,
        target_lat=interv.target_latitude,
        target_lon=interv.target_longitude,
        boundary_geojson=watershed.boundary_geojson,
        drainage_geojson=watershed.drainage_geojson,
        quality_assessment=quality,
        coordinate_source=coord_source
    )

    # Step 4: Save binary file to disk
    ext = Path(file.filename or "evidence.jpg").suffix or ".jpg"
    dest_filename = f"{file_sha256[:16]}_{int(datetime.utcnow().timestamp())}{ext}"
    dest_path = EVIDENCE_DIR / dest_filename
    with open(dest_path, "wb") as f:
        f.write(contents)

    # Step 5: Save DB Record
    evidence_record = FieldEvidence(
        intervention_id=interv.id,
        filename=dest_filename,
        file_path=str(dest_path),
        thumbnail_path=str(dest_path),
        file_sha256=file_sha256,
        file_size_bytes=float(len(contents)),
        captured_latitude=lat,
        captured_longitude=lon,
        altitude_meters=alt,
        camera_bearing_deg=bearing,
        coordinate_source=coord_source,
        captured_at=captured_at,
        uploaded_at=datetime.utcnow(),
        blur_score=quality["blur_score"],
        is_blurry=quality["is_blurry"],
        exposure_status=quality["exposure_status"],
        quality_score=quality["quality_score"],
        is_inside_watershed=consistency["is_inside_watershed"],
        stream_distance_meters=consistency["stream_distance_meters"],
        consistency_status=consistency["status"],
        consistency_reasons=consistency["reasons"],
        surveyor_name=surveyor_name,
        structure_condition=structure_condition,
        water_storage_level=water_storage_level,
        notes=notes,
        review_status="Needs Verification" if consistency["status"] != "Consistent" else "Preliminary"
    )
    db.add(evidence_record)
    db.flush()
    
    # Audit Log
    audit = AuditLog(
        user_name=surveyor_name,
        role="FIELD_OFFICER",
        action="EVIDENCE_UPLOAD",
        resource_type="field_evidence",
        resource_id=evidence_record.id,
        details={
            "intervention": interv.name,
            "consistency_status": consistency["status"],
            "coordinate_source": coord_source
        }
    )
    db.add(audit)
    db.commit()
    db.refresh(evidence_record)

    return _format_card_response(evidence_record, db)

@router.post("/{evidence_id}/review", response_model=EvidenceCardResponse)
def review_field_evidence(
    evidence_id: str,
    payload: ReviewSubmission,
    db: Session = Depends(get_db)
):
    """
    Submits a formal human-in-the-loop expert audit decision
    ('Reviewed', 'Needs Verification', or 'Rejected').
    """
    ev = db.query(FieldEvidence).filter(FieldEvidence.id == evidence_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence record not found")

    ev.review_status = payload.review_status
    ev.reviewer_name = payload.reviewer_name
    ev.reviewer_notes = payload.reviewer_notes
    ev.reviewed_at = datetime.utcnow()

    audit = AuditLog(
        user_name=payload.reviewer_name,
        role="GIS_ANALYST",
        action=f"REVIEW_{payload.review_status.upper()}",
        resource_type="field_evidence",
        resource_id=ev.id,
        details={"notes": payload.reviewer_notes}
    )
    db.add(audit)
    db.commit()
    db.refresh(ev)

    return _format_card_response(ev, db)
