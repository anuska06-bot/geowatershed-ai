import json
from pathlib import Path
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, ConfigDict
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.ml_service import (
    predict_recharge_potential, 
    predict_erosion_and_maintenance,
    train_and_evaluate_models, 
    MODELS_DIR
)
from app.services.telemetry_db_service import ingest_all_telemetry_csvs, save_live_telemetry_readings
from app.services.live_api_service import fetch_all_live_watershed_telemetry
from app.models.telemetry_models import (
    TelemetryDynamicWorld,
    TelemetryGroundwaterWell,
    TelemetryWeatherStation,
    TelemetryHydrologyBasin,
    TelemetryFieldIntervention,
    TelemetryFieldCVVerification,
    TelemetrySatelliteObservation,
    TelemetrySoilPedology,
    TelemetryTopographyDEM,
    TelemetryLiveSensorFeed,
)

router = APIRouter(prefix="/ml", tags=["Machine Learning & Real-Time Telemetry"])

class TelemetryPredictionRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    latitude: float = 18.5204
    longitude: float = 73.8567
    prob_water: float = 0.05
    prob_trees: float = 0.18
    prob_grass: float = 0.12
    prob_crops: float = 0.58
    prob_bare: float = 0.01
    elevation_m: float = 562.0
    daily_rainfall_mm: float = 0.0
    max_temp_c: float = 32.5
    evapotranspiration_mm: float = 4.2
    stream_order: int = 3
    catchment_area_sqkm: float = 42.5
    dis_m3_pyr: float = 1.45
    run_mm_syr: float = 350.2
    ari_ix_sav: float = 62.0
    smp_nz_s01: float = 28.0
    wet_pc_sg1: float = 1.2
    depth_to_water_mbgl: float = 6.85
    seasonal_fluctuation_m: float = 2.4

class ErosionAndMaintenanceRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    slope_percent: float = 4.2
    topographic_wetness_index: float = 7.82
    elevation_m: float = 560.5
    ndvi_value: float = 0.68
    ndwi_value: float = 0.12
    bsi_value: float = -0.22
    permeability_mm_hr: float = 8.5
    annual_rainfall_mm: float = 1050.0
    model_confidence_score: float = 0.94
    recharge_suitability_score: float = 0.82

@router.post("/predict-recharge-zone")
def predict_recharge(payload: TelemetryPredictionRequest):
    """
    Real-time AI prediction endpoint for recharge zone & structure siting.
    """
    try:
        features = payload.model_dump()
        result = predict_recharge_potential(features)
        return {
            "status": "SUCCESS",
            "prediction": result,
            "input_coordinates": {"lat": payload.latitude, "lon": payload.longitude}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Inference failed: {str(e)}")

@router.post("/predict-erosion-maintenance")
def predict_erosion_maintenance(payload: ErosionAndMaintenanceRequest):
    """
    Dual SIH Problem Statement Prediction:
    - SIH Secondary: Sentinel-2 Multi-Spectral + CartoDEM Topographic Erosion Risk (Low/Medium/High)
    - SIH PS 15: AI Structural Maintenance Dispatch (Desiltation, Bunding, Clearance)
    """
    try:
        features = payload.model_dump()
        result = predict_erosion_and_maintenance(features)
        return {
            "status": "SUCCESS",
            "prediction": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erosion/Maintenance inference failed: {str(e)}")

@router.get("/live-telemetry")
def get_live_api_telemetry(db: Session = Depends(get_db)):
    """
    Fetches LIVE real-time meteorological, precipitation, and volumetric soil moisture
    readings across all 5 monitored watershed nodes using Open-Meteo free API,
    and automatically logs the live feed into Docker PostgreSQL.
    """
    try:
        readings = fetch_all_live_watershed_telemetry()
        save_live_telemetry_readings(db, readings)
        return {
            "status": "SUCCESS",
            "provider": "Open-Meteo Global Hydro-Meteorology API",
            "active_nodes_monitored": len(readings),
            "telemetry": readings
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch live telemetry: {str(e)}")

@router.get("/model-info")
def get_model_info():
    """
    Returns model benchmark comparison, champion model architecture,
    feature importance hierarchy, and validation metrics for both SIH problem statements.
    """
    metrics_path = MODELS_DIR / "ml_metrics.json"
    if not metrics_path.exists():
        metrics = train_and_evaluate_models()
        return metrics
    with open(metrics_path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.post("/train-and-sync")
def train_and_sync_db(db: Session = Depends(get_db)):
    """
    Ingests all 9 real-time CSVs into Docker PostgreSQL and retrains all ML models.
    """
    try:
        db_results = ingest_all_telemetry_csvs(db)
        ml_results = train_and_evaluate_models()
        return {
            "status": "SUCCESS",
            "database_ingested": db_results,
            "ml_benchmark": ml_results["model_comparison"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync and Train failed: {str(e)}")

@router.get("/telemetry-summary")
def get_telemetry_summary(db: Session = Depends(get_db)):
    """
    Returns complete real-time telemetry inventory stored in Docker PostgreSQL / PostGIS.
    """
    dw_count = db.query(TelemetryDynamicWorld).count()
    gw_count = db.query(TelemetryGroundwaterWell).count()
    wx_count = db.query(TelemetryWeatherStation).count()
    hy_count = db.query(TelemetryHydrologyBasin).count()
    int_count = db.query(TelemetryFieldIntervention).count()
    cv_count = db.query(TelemetryFieldCVVerification).count()
    sat_count = db.query(TelemetrySatelliteObservation).count()
    soil_count = db.query(TelemetrySoilPedology).count()
    dem_count = db.query(TelemetryTopographyDEM).count()
    feed_count = db.query(TelemetryLiveSensorFeed).count()

    latest_wells = db.query(TelemetryGroundwaterWell).limit(5).all()
    latest_sat = db.query(TelemetrySatelliteObservation).limit(5).all()

    return {
        "counts": {
            "dynamic_world_pixels": dw_count,
            "groundwater_wells": gw_count,
            "weather_stations": wx_count,
            "hydrology_basins": hy_count,
            "field_interventions": int_count,
            "field_cv_verifications": cv_count,
            "satellite_observations": sat_count,
            "soil_pedology_zones": soil_count,
            "topography_dem_points": dem_count,
            "live_api_sensor_feeds": feed_count
        },
        "sample_wells": [
            {
                "well_id": w.well_id,
                "district": w.district,
                "state": w.state,
                "depth_mbgl": w.depth_to_water_mbgl,
                "recharge_class": w.recharge_zone_class
            }
            for w in latest_wells
        ],
        "sample_satellites": [
            {
                "id": s.observation_id,
                "sensor": s.satellite_sensor,
                "date": s.sensing_date.isoformat(),
                "ndvi": s.ndvi_value,
                "ndwi": s.ndwi_value,
                "bsi": s.bsi_value
            }
            for s in latest_sat
        ]
    }
