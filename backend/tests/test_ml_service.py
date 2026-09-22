import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_ml_model_info_endpoint():
    response = client.get("/api/v1/ml/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "model_comparison" in data
    assert "top_feature_importances" in data
    assert "classification" in data["model_comparison"]
    assert "RandomForest" in data["model_comparison"]["classification"]
    assert "sih_secondary_erosion_risk" in data["model_comparison"]
    assert "sih_ps15_maintenance_dispatch" in data["model_comparison"]

def test_ml_predict_recharge_endpoint():
    payload = {
        "latitude": 18.5204,
        "longitude": 73.8567,
        "prob_water": 0.05,
        "prob_trees": 0.18,
        "prob_grass": 0.12,
        "prob_crops": 0.58,
        "prob_bare": 0.01,
        "elevation_m": 562.0,
        "daily_rainfall_mm": 0.0,
        "max_temp_c": 32.5,
        "evapotranspiration_mm": 4.2,
        "stream_order": 3,
        "catchment_area_sqkm": 42.5,
        "dis_m3_pyr": 1.45,
        "run_mm_syr": 350.2,
        "ari_ix_sav": 62.0,
        "smp_nz_s01": 28.0,
        "wet_pc_sg1": 1.2,
        "depth_to_water_mbgl": 6.85,
        "seasonal_fluctuation_m": 2.4
    }
    response = client.post("/api/v1/ml/predict-recharge-zone", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["status"] == "SUCCESS"
    assert "prediction" in res
    pred = res["prediction"]
    assert "recharge_zone_class" in pred
    assert "suitability_score" in pred
    assert "recommended_intervention" in pred
    assert pred["suitability_score"] > 0

def test_ml_predict_erosion_and_maintenance():
    payload = {
        "slope_percent": 4.2,
        "topographic_wetness_index": 7.82,
        "elevation_m": 560.5,
        "ndvi_value": 0.68,
        "ndwi_value": 0.12,
        "bsi_value": -0.22,
        "permeability_mm_hr": 8.5,
        "annual_rainfall_mm": 1050.0,
        "model_confidence_score": 0.94,
        "recharge_suitability_score": 0.82
    }
    response = client.post("/api/v1/ml/predict-erosion-maintenance", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["status"] == "SUCCESS"
    pred = res["prediction"]
    assert pred["erosion_risk_level"] in ["Low", "Medium", "High"]
    assert len(pred["recommended_maintenance_action"]) > 0
    assert len(pred["sih_ps_applicability"]) == 2

def test_ml_live_telemetry_endpoint():
    response = client.get("/api/v1/ml/live-telemetry")
    assert response.status_code == 200
    res = response.json()
    assert res["status"] == "SUCCESS"
    assert res["active_nodes_monitored"] >= 4
    assert len(res["telemetry"]) >= 4
    first_node = res["telemetry"][0]
    assert "temperature_c" in first_node
    assert "soil_moisture_0_1cm_m3m3" in first_node

def test_ml_telemetry_summary():
    response = client.get("/api/v1/ml/telemetry-summary")
    assert response.status_code == 200
    data = response.json()
    assert "counts" in data
    counts = data["counts"]
    assert counts["dynamic_world_pixels"] >= 3
    assert counts["groundwater_wells"] >= 3
    assert counts["weather_stations"] >= 3
    assert counts["hydrology_basins"] >= 3
    assert counts["field_interventions"] >= 5
    assert counts["field_cv_verifications"] >= 5
    assert counts["satellite_observations"] >= 5
    assert counts["soil_pedology_zones"] >= 4
    assert counts["topography_dem_points"] >= 5
