import json
import logging
from datetime import datetime, date
from pathlib import Path
from sqlalchemy.orm import Session
from app.models import Watershed, Project, Intervention, FieldEvidence, BiophysicalIndicator, AuditLog

logger = logging.getLogger("geowatershed.seed")

def seed_pilot_data(db: Session):
    """
    Seeds comprehensive pan-India micro-watersheds (MH, KA, UK, JH, RJ, AS)
    and associated projects, interventions, and baseline evidence.
    """
    try:
        data_dir = Path(__file__).resolve().parent.parent / "data"
        pan_india_file = data_dir / "pan_india_watersheds.json"
        pilot_file = data_dir / "pilot_watershed.json"

        entries = []
        if pan_india_file.exists():
            with open(pan_india_file, "r", encoding="utf-8") as f:
                entries = json.load(f)
        elif pilot_file.exists():
            with open(pilot_file, "r", encoding="utf-8") as f:
                entries = [json.load(f)]
        else:
            return None

        seeded_watersheds = []

        for item in entries:
            ws_data = item.get("watershed", {})
            code = ws_data.get("code")
            if not code:
                continue

            existing = db.query(Watershed).filter_by(code=code).first()
            if existing:
                seeded_watersheds.append(existing)
                continue

            watershed = Watershed(
                code=ws_data["code"],
                name=ws_data["name"],
                state=ws_data["state"],
                district=ws_data["district"],
                block=ws_data["block"],
                basin=ws_data["basin"],
                area_hectares=ws_data["area_hectares"],
                centroid_lat=ws_data["centroid_lat"],
                centroid_lon=ws_data["centroid_lon"],
                boundary_geojson=ws_data["boundary_geojson"],
                drainage_geojson=ws_data["drainage_geojson"]
            )
            db.add(watershed)
            db.flush()

            # Add Projects
            project_map = {}
            for p in item.get("projects", []):
                proj = Project(
                    watershed_id=watershed.id,
                    name=p["name"],
                    scheme_name=p.get("scheme_name", "WDC-PMKSY 2.0"),
                    status=p.get("status", "In Progress"),
                    sanctioned_budget_inr=p.get("sanctioned_budget_inr", 10000000.0),
                    expenditure_inr=p.get("expenditure_inr", 7500000.0),
                    start_date=datetime.strptime(p.get("start_date", "2023-04-01"), "%Y-%m-%d").date(),
                    target_date=datetime.strptime(p.get("target_date", "2026-03-31"), "%Y-%m-%d").date(),
                    description=p.get("description", "Watershed development and stream treatment.")
                )
                db.add(proj)
                db.flush()
                project_map[p["name"]] = proj

            default_proj = list(project_map.values())[0] if project_map else None

            # Add Interventions
            interventions_created = []
            for it in item.get("interventions", []):
                interv = Intervention(
                    project_id=default_proj.id if default_proj else None,
                    watershed_id=watershed.id,
                    name=it["name"],
                    intervention_type=it["intervention_type"],
                    target_latitude=it["target_latitude"],
                    target_longitude=it["target_longitude"],
                    stream_order=it.get("stream_order", 3),
                    status=it.get("status", "Completed")
                )
                db.add(interv)
                db.flush()
                interventions_created.append(interv)

            # Seed sample field evidence for the first intervention
            if interventions_created:
                first_interv = interventions_created[0]
                evidence_seed = FieldEvidence(
                    intervention_id=first_interv.id,
                    filename=f"{code.lower()}_field_inspection.jpg",
                    file_path=f"sample_{code.lower()}.jpg",
                    thumbnail_path=f"sample_{code.lower()}.jpg",
                    file_sha256=f"sha_{code.lower()}_4d8b9e11f0a234c988b0124adff0901239845723b",
                    file_size_bytes=2850000.0,
                    captured_latitude=first_interv.target_latitude + 0.0003,
                    captured_longitude=first_interv.target_longitude + 0.0002,
                    altitude_meters=280.0,
                    camera_bearing_deg=120.0,
                    coordinate_source="EXIF_GPS",
                    captured_at=datetime(2025, 11, 20, 10, 15, 0),
                    uploaded_at=datetime(2025, 11, 21, 14, 30, 0),
                    blur_score=390.0,
                    is_blurry=False,
                    exposure_status="OPTIMAL",
                    quality_score=0.95,
                    is_inside_watershed=True,
                    stream_distance_meters=12.0,
                    elevation_delta_meters=0.8,
                    consistency_status="Consistent",
                    consistency_reasons=[
                        "Coordinates verified inside micro-watershed polygon boundary.",
                        f"Hydrologically consistent: Located within stream corridor buffer (Order {first_interv.stream_order}).",
                        "Field position conforms closely to planned project site (<15m delta).",
                        "Coordinates verified directly from hardware EXIF GPS telemetry."
                    ],
                    surveyor_name="Er. K. Shinde (WDT Engineer)",
                    structure_condition="Good",
                    water_storage_level="Moderate (25-75%)",
                    notes="Upstream sediment basin in operational state; flow regulation functioning.",
                    review_status="Reviewed",
                    reviewer_name="Dr. V. Patil (Joint Director, SLNA)",
                    reviewer_notes="Physical progress authenticated and verified against stream order.",
                    reviewed_at=datetime(2025, 11, 22, 16, 0, 0)
                )
                db.add(evidence_seed)

            seeded_watersheds.append(watershed)

        db.commit()
        logger.info(f"Successfully seeded {len(seeded_watersheds)} Pan-India watersheds.")
        return seeded_watersheds[0] if seeded_watersheds else None

    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding pan-India data: {e}")
        return None
