from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from datetime import datetime
from app.models import Watershed, Intervention, FieldEvidence, Project
from app.schemas.watershed_schema import WatershedSummary, WatershedDetail, InterventionMarker

router = APIRouter(prefix="/watersheds", tags=["Watersheds"])

@router.get("", response_model=List[WatershedSummary])
def list_watersheds(db: Session = Depends(get_db)):
    """Returns all registered micro-watersheds with administrative summaries."""
    return db.query(Watershed).all()

@router.get("/national-summary")
def get_national_summary(db: Session = Depends(get_db)):
    """Returns aggregated pan-India metrics for the Union/State Field Minister."""
    watersheds = db.query(Watershed).all()
    projects = db.query(Project).all()
    interventions = db.query(Intervention).all()
    evidence_count = db.query(FieldEvidence).count()

    total_sanctioned = sum(p.sanctioned_budget_inr or 0.0 for p in projects)
    total_expenditure = sum(p.expenditure_inr or 0.0 for p in projects)
    total_area = sum(w.area_hectares or 0.0 for w in watersheds)

    states = sorted(list(set(w.state for w in watersheds)))

    completed_interventions = [i for i in interventions if i.status == "Completed"]
    water_storage_ml = len(completed_interventions) * 12.5
    soil_loss_tonnes = total_area * 0.45 * 18.0

    state_breakdown = {}
    for s in states:
        ws_in_state = [w for w in watersheds if w.state == s]
        ws_ids = [w.id for w in ws_in_state]
        proj_in_state = [p for p in projects if p.watershed_id in ws_ids]
        interv_in_state = [i for i in interventions if i.watershed_id in ws_ids]
        state_breakdown[s] = {
            "watershed_count": len(ws_in_state),
            "total_area_ha": sum(w.area_hectares for w in ws_in_state),
            "sanctioned_cr": round(sum(p.sanctioned_budget_inr or 0 for p in proj_in_state) / 1e7, 2),
            "expenditure_cr": round(sum(p.expenditure_inr or 0 for p in proj_in_state) / 1e7, 2),
            "interventions_count": len(interv_in_state)
        }

    return {
        "success": True,
        "total_watersheds_tracked": len(watersheds),
        "states_covered": states,
        "total_states_count": len(states),
        "total_area_hectares": total_area,
        "total_sanctioned_budget_cr": round(total_sanctioned / 1e7, 2),
        "total_expenditure_cr": round(total_expenditure / 1e7, 2),
        "expenditure_utilization_pct": round((total_expenditure / total_sanctioned * 100) if total_sanctioned else 0.0, 1),
        "total_interventions_count": len(interventions),
        "completed_interventions_count": len(completed_interventions),
        "total_evidence_photos_ingested": evidence_count,
        "total_water_storage_created_ml": round(water_storage_ml, 1),
        "total_soil_loss_averted_tonnes": round(soil_loss_tonnes, 1),
        "state_wise_breakdown": state_breakdown,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/{watershed_id}", response_model=WatershedDetail)
def get_watershed_detail(watershed_id: str, db: Session = Depends(get_db)):
    """Returns full GeoJSON boundaries, drainage networks, and intervention markers."""
    ws = db.query(Watershed).filter(Watershed.id == watershed_id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Watershed not found")

    interventions = db.query(Intervention).filter(Intervention.watershed_id == watershed_id).all()
    marker_list = []
    for item in interventions:
        ev_count = db.query(FieldEvidence).filter(FieldEvidence.intervention_id == item.id).count()
        latest_ev = db.query(FieldEvidence).filter(FieldEvidence.intervention_id == item.id).order_by(FieldEvidence.uploaded_at.desc()).first()
        
        marker_list.append(InterventionMarker(
            id=item.id,
            name=item.name,
            intervention_type=item.intervention_type,
            target_latitude=item.target_latitude,
            target_longitude=item.target_longitude,
            stream_order=item.stream_order,
            status=item.status,
            evidence_count=ev_count,
            latest_consistency_status=latest_ev.consistency_status if latest_ev else None,
            latest_review_status=latest_ev.review_status if latest_ev else None
        ))

    return WatershedDetail(
        id=ws.id,
        code=ws.code,
        name=ws.name,
        state=ws.state,
        district=ws.district,
        block=ws.block,
        basin=ws.basin,
        area_hectares=ws.area_hectares,
        centroid_lat=ws.centroid_lat,
        centroid_lon=ws.centroid_lon,
        boundary_geojson=ws.boundary_geojson,
        drainage_geojson=ws.drainage_geojson,
        interventions=marker_list
    )
