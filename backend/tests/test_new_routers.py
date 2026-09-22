from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_projects_router():
    res = client.get("/api/v1/projects")
    assert res.status_code == 200
    projects = res.json()
    assert len(projects) > 0
    p = projects[0]
    assert "sanctioned_budget_inr" in p
    assert "budget_utilization_pct" in p

def test_analysis_health_score():
    ws_res = client.get("/api/v1/watersheds")
    ws_id = ws_res.json()[0]["id"]
    
    res = client.get(f"/api/v1/analysis/health-score/{ws_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["overall_health_score"] > 0
    assert "vegetation_vigor_subscore" in data["components"]

def test_risk_screening():
    ws_res = client.get("/api/v1/watersheds")
    ws_id = ws_res.json()[0]["id"]

    res = client.get(f"/api/v1/analysis/risk-screening/{ws_id}")
    assert res.status_code == 200
    risks = res.json()
    assert len(risks) >= 3
    assert risks[0]["risk_level"] in ("Low", "Moderate", "High", "Critical")

def test_recommendations():
    ws_res = client.get("/api/v1/watersheds")
    ws_id = ws_res.json()[0]["id"]

    res = client.get(f"/api/v1/analysis/recommendations/{ws_id}")
    assert res.status_code == 200
    recs = res.json()
    assert len(recs) >= 3
    assert recs[0]["suitability_score"] > 0.8

def test_economics_calculator():
    payload = {
        "number_of_interventions": 25,
        "field_visits_per_year": 6,
        "cost_per_manual_visit_inr": 3500.0,
        "digital_review_time_savings_pct": 65.0,
        "platform_annual_cost_inr": 75000.0
    }
    res = client.post("/api/v1/economics/calculate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["conventional_annual_monitoring_cost_inr"] == 525000.0
    assert data["estimated_annual_cost_difference_inr"] > 0
    assert len(data["sensitivity_analysis"]) == 3

def test_audit_logs():
    res = client.get("/api/v1/audit-logs")
    assert res.status_code == 200
    logs = res.json()
    assert isinstance(logs, list)
