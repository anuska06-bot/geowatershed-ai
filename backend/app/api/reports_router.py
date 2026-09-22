import csv
import io
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Watershed, Intervention, FieldEvidence, Project

router = APIRouter(prefix="/reports", tags=["Reports & Exports"])

@router.get("/evidence.csv")
def export_evidence_csv(watershed_id: str, db: Session = Depends(get_db)):
    """Exports structured field evidence records to CSV format for audit compliance."""
    ws = db.query(Watershed).filter(Watershed.id == watershed_id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Watershed not found")

    output = io.StringIO()
    writer = csv.writer(output)
    
    # Headers
    writer.writerow([
        "Evidence ID", "Watershed Code", "Intervention Name", "Type",
        "Latitude", "Longitude", "Coord Source", "Distance to Stream (m)",
        "Consistency Status", "Blur Score", "Quality Score",
        "Captured At", "Surveyor", "Review Status", "Reviewer Notes"
    ])

    interventions = db.query(Intervention).filter(Intervention.watershed_id == watershed_id).all()
    for interv in interventions:
        records = db.query(FieldEvidence).filter(FieldEvidence.intervention_id == interv.id).all()
        for r in records:
            writer.writerow([
                r.id, ws.code, interv.name, interv.intervention_type,
                r.captured_latitude, r.captured_longitude, r.coordinate_source,
                r.stream_distance_meters, r.consistency_status, r.blur_score,
                r.quality_score, r.captured_at, r.surveyor_name,
                r.review_status, r.reviewer_notes or ""
            ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=evidence_audit_{ws.code}_{datetime.utcnow().strftime('%Y%m%d')}.csv"}
    )

@router.get("/dossier/{watershed_id}")
def generate_watershed_dossier(watershed_id: str, db: Session = Depends(get_db)):
    """
    Generates a structured, audit-ready Evidence Dossier summary
    complying with WDC-PMKSY 2.0 evaluation guidelines.
    """
    ws = db.query(Watershed).filter(Watershed.id == watershed_id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Watershed not found")

    projects = db.query(Project).filter(Project.watershed_id == watershed_id).all()
    interventions = db.query(Intervention).filter(Intervention.watershed_id == watershed_id).all()

    total_interventions = len(interventions)
    total_evidence = 0
    consistent_count = 0
    reviewed_count = 0

    intervention_summaries = []
    for interv in interventions:
        records = db.query(FieldEvidence).filter(FieldEvidence.intervention_id == interv.id).all()
        total_evidence += len(records)
        c_count = sum(1 for r in records if r.consistency_status == "Consistent")
        consistent_count += c_count
        r_count = sum(1 for r in records if r.review_status == "Reviewed")
        reviewed_count += r_count

        intervention_summaries.append({
            "id": interv.id,
            "name": interv.name,
            "type": interv.intervention_type,
            "target_coordinates": [interv.target_latitude, interv.target_longitude],
            "evidence_count": len(records),
            "consistent_count": c_count,
            "reviewed_count": r_count,
            "status": interv.status
        })

    consistency_rate = round((consistent_count / total_evidence * 100), 1) if total_evidence > 0 else 100.0

    return {
        "report_type": "WATERSHED INTERVENTION EVIDENCE DOSSIER",
        "generated_at": datetime.utcnow().isoformat(),
        "watershed": {
            "code": ws.code,
            "name": ws.name,
            "district": ws.district,
            "state": ws.state,
            "area_hectares": ws.area_hectares
        },
        "telemetry": {
            "total_interventions": total_interventions,
            "total_field_photos_ingested": total_evidence,
            "hydrologic_consistency_rate_pct": consistency_rate,
            "human_reviewed_count": reviewed_count
        },
        "interventions": intervention_summaries,
        "disclaimers": [
            "Screening-level verification based on vector stream networks and EXIF GPS telemetry.",
            "Vegetation trends derived from Sentinel-2 Level-2A surface reflectance.",
            "Does not replace statutory geotechnical soil core drills or structural safety audits."
        ]
    }
