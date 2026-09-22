import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analyze_media_check_dam():
    response = client.post(
        "/api/v1/sutra-ai/analyze-media",
        data={"intervention_type": "Check Dam", "sample_preset": "check_dam_inspection"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "SUTRA-" in data["analysis_id"]
    assert data["siltation_percentage"] > 0
    assert data["structural_integrity_score"] > 0
    assert len(data["remediation_steps"]) == 3
    assert data["remediation_steps"][0]["phase"] == "Immediate Actions"
    assert data["estimated_storage_recovery_cum"] > 0

def test_analyze_media_farm_pond():
    response = client.post(
        "/api/v1/sutra-ai/analyze-media",
        data={"intervention_type": "Farm Pond", "sample_preset": "farm_pond_inspection"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "Farm Pond" in data["structure_detected"]
    assert len(data["remediation_steps"]) == 3
    assert any("Geomembrane" in step["title"] or "Desiltation" in step["title"] for step in data["remediation_steps"])

def test_sutra_ai_chat_costing():
    response = client.post(
        "/api/v1/sutra-ai/chat",
        json={"query": "What is the estimated cost of desiltation and check dam repair?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "₹" in data["response"] or "Cost" in data["response"]
    assert len(data["actionable_recommendations"]) > 0
    assert len(data["citations"]) > 0

def test_sutra_ai_chat_minister_briefing():
    response = client.post(
        "/api/v1/sutra-ai/chat",
        json={"query": "Prepare executive summary briefing for the Field Minister and Parliament"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "Ministerial" in data["response"] or "Briefing" in data["response"]
    assert len(data["actionable_recommendations"]) > 0

def test_sutra_ai_chat_erosion():
    response = client.post(
        "/api/v1/sutra-ai/chat",
        json={"query": "How to arrest severe gully erosion in this catchment?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "Vetiver" in data["response"] or "trench" in data["response"]
    assert len(data["actionable_recommendations"]) > 0
