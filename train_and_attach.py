"""
GeoWatershed AI - Real-time Telemetry Ingestion & ML Model Trainer
------------------------------------------------------------------
1. Ingests all 9 real-time telemetry CSVs directly into Docker PostgreSQL / PostGIS.
2. Calls Open-Meteo Live API for real-time live sensor feeds across watersheds.
3. Trains, compares, and evaluates ML models for:
   - Primary SIH PS 15: Structural evidence verification & maintenance dispatch.
   - Secondary SIH Problem Statement: Multi-Spectral & CartoDEM AI Land Degradation / Erosion Risk.
4. Serializes trained model pipelines for real-time inference.
"""

import sys
import os
from pathlib import Path

backend_dir = Path(__file__).resolve().parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.database import engine, DB_DIALECT, Base, SessionLocal
from app.services.telemetry_db_service import ingest_all_telemetry_csvs, save_live_telemetry_readings
from app.services.live_api_service import fetch_all_live_watershed_telemetry
from app.services.ml_service import (
    train_and_evaluate_models, 
    predict_recharge_potential,
    predict_erosion_and_maintenance
)

def main():
    print("==================================================================")
    print("  GeoWatershed AI: Dual-Statement Ingestion & ML Pipeline")
    print("==================================================================")
    print(f"[*] Active Database Dialect: {DB_DIALECT.upper()}")
    print("[*] Ensuring database tables exist...")
    Base.metadata.create_all(bind=engine)

    print("\n--- STEP 1: Ingesting Real-Time Telemetry CSVs into Database ---")
    db = SessionLocal()
    try:
        db_results = ingest_all_telemetry_csvs(db)
        for key, count in db_results.items():
            print(f"  -> Ingested {count} records into '{key}'")
    finally:
        db.close()

    print("\n--- STEP 2: Fetching LIVE Public Open-Meteo API Telemetry ---")
    db = SessionLocal()
    try:
        live_data = fetch_all_live_watershed_telemetry()
        save_live_telemetry_readings(db, live_data)
        print(f"  -> Successfully queried and logged {len(live_data)} LIVE watershed weather & soil feeds:")
        for node in live_data[:3]:
            print(f"     * [{node['code']}] {node['name']}: Temp={node['temperature_c']}C, Soil Moisture(0-1cm)={node['soil_moisture_0_1cm_m3m3']} m3/m3, Source={node['source']}")
    finally:
        db.close()

    print("\n--- STEP 3: Training & Evaluating ML Models ---")
    metrics = train_and_evaluate_models()
    comp = metrics["model_comparison"]
    print("\n[+] Model Benchmark (Classification - Recharge Zone):")
    for name, score in comp["classification"].items():
        if name != "champion":
            print(f"    - {name}: Accuracy={score['accuracy']*100:.2f}%")
    print(f"    >>> Selected Champion: {comp['classification']['champion']}")

    print("\n[+] Model Benchmark (Regression - Live Suitability Index):")
    for name, score in comp["regression"].items():
        if name != "champion":
            print(f"    - {name}: R2-Score={score['r2_score']:.4f}")
    print(f"    >>> Selected Champion: {comp['regression']['champion']}")

    print("\n[+] SIH Problem Statement Dual-Qualifications:")
    print(f"    1. [SIH PS 15] Maintenance Action Dispatch: Accuracy={comp['sih_ps15_maintenance_dispatch']['accuracy']*100:.2f}%")
    print(f"    2. [SIH Secondary] Multi-Spectral & DEM Erosion Risk: Accuracy={comp['sih_secondary_erosion_risk']['accuracy']*100:.2f}%")

    print("\n[+] Top Hydrological Feature Importances:")
    for feat, imp in metrics["top_feature_importances"].items():
        print(f"    * {feat:25s}: {imp * 100:.2f}%")

    print("\n--- STEP 4: Verifying Dual-Statement Real-Time AI Inference ---")
    # Test 1: Siting and Recharge
    sample_test = {
        "latitude": 18.5204, "longitude": 73.8567,
        "prob_water": 0.05, "prob_trees": 0.18, "prob_grass": 0.12, "prob_crops": 0.58, "prob_bare": 0.01,
        "elevation_m": 562.0, "daily_rainfall_mm": 0.0, "max_temp_c": 32.5, "evapotranspiration_mm": 4.2,
        "stream_order": 3, "catchment_area_sqkm": 42.5, "dis_m3_pyr": 1.45, "run_mm_syr": 350.2,
        "ari_ix_sav": 62.0, "smp_nz_s01": 28.0, "wet_pc_sg1": 1.2,
        "depth_to_water_mbgl": 6.85, "seasonal_fluctuation_m": 2.4
    }
    pred1 = predict_recharge_potential(sample_test)
    print("  [AI Output 1: Recharge & Siting]")
    print(f"  - Predicted Zone:          {pred1['recharge_zone_class']}")
    print(f"  - Suitability Score:       {pred1['suitability_score']}/100")
    print(f"  - Recommended Structure:   {pred1['recommended_intervention']}")

    # Test 2: Multi-Spectral Erosion Risk & Maintenance
    sample_ero = {
        "slope_percent": 4.2, "topographic_wetness_index": 7.82, "elevation_m": 560.5,
        "ndvi_value": 0.68, "ndwi_value": 0.12, "bsi_value": -0.22,
        "permeability_mm_hr": 8.5, "annual_rainfall_mm": 1050.0,
        "model_confidence_score": 0.94, "recharge_suitability_score": 0.82
    }
    pred2 = predict_erosion_and_maintenance(sample_ero)
    print("\n  [AI Output 2: Erosion Risk & Maintenance Action]")
    print(f"  - Multi-Spectral Erosion Risk: {pred2['erosion_risk_level']}")
    print(f"  - Maintenance Action Dispatch: {pred2['recommended_maintenance_action']}")

    print("\n==================================================================")
    print("  All Telemetry Attached to Docker & Models Fully SIH-Ready!")
    print("==================================================================")

if __name__ == "__main__":
    main()
