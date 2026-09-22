import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_list_watersheds_pan_india():
    response = client.get("/api/v1/watersheds")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 7
    states = set(w["state"] for w in data)
    assert "Maharashtra" in states
    assert "Karnataka" in states
    assert "Uttarakhand" in states
    assert "Jharkhand" in states
    assert "Rajasthan" in states
    assert "Assam" in states

def test_national_summary_metrics():
    response = client.get("/api/v1/watersheds/national-summary")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["total_watersheds_tracked"] >= 7
    assert data["total_states_count"] >= 6
    assert data["total_sanctioned_budget_cr"] > 0
    assert data["total_expenditure_cr"] > 0
    assert data["total_water_storage_created_ml"] > 0
    assert "state_wise_breakdown" in data

def test_each_watershed_detail_and_geojson():
    response = client.get("/api/v1/watersheds")
    data = response.json()
    for ws in data:
        detail_res = client.get(f"/api/v1/watersheds/{ws['id']}")
        assert detail_res.status_code == 200
        detail = detail_res.json()
        assert detail["boundary_geojson"] is not None
        assert detail["drainage_geojson"] is not None
        assert len(detail["interventions"]) > 0
