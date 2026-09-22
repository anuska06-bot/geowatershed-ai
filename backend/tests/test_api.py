import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_list_watersheds():
    res = client.get("/api/v1/watersheds")
    assert res.status_code == 200
    watersheds = res.json()
    assert len(watersheds) > 0
    assert watersheds[0]["code"] == "MH-WDC-042"

def test_get_watershed_detail():
    res = client.get("/api/v1/watersheds")
    ws_id = res.json()[0]["id"]
    
    res2 = client.get(f"/api/v1/watersheds/{ws_id}")
    assert res2.status_code == 200
    detail = res2.json()
    assert "boundary_geojson" in detail
    assert "drainage_geojson" in detail
    assert len(detail["interventions"]) > 0

def test_upload_and_review_workflow(sample_image_bytes):
    # Fetch first watershed and its first intervention
    ws_res = client.get("/api/v1/watersheds")
    ws_id = ws_res.json()[0]["id"]
    detail = client.get(f"/api/v1/watersheds/{ws_id}").json()
    interv_id = detail["interventions"][0]["id"]

    # Upload test image
    upload_res = client.post(
        "/api/v1/evidence/upload",
        data={
            "intervention_id": interv_id,
            "surveyor_name": "Er. Test Surveyor",
            "structure_condition": "Good",
            "water_storage_level": "Moderate",
            "notes": "Automated verification test."
        },
        files={"file": ("test_survey.jpg", sample_image_bytes, "image/jpeg")}
    )
    assert upload_res.status_code == 200
    card = upload_res.json()
    assert card["id"] is not None
    assert card["quality"]["is_blurry"] is False
    assert "consistency" in card

    # Submit Expert Human Review
    review_res = client.post(
        f"/api/v1/evidence/{card['id']}/review",
        json={
            "review_status": "Reviewed",
            "reviewer_name": "Er. Lead Hydrologist",
            "reviewer_notes": "Ground verification passed."
        }
    )
    assert review_res.status_code == 200
    updated_card = review_res.json()
    assert updated_card["review_status"] == "Reviewed"
    assert updated_card["reviewer_name"] == "Er. Lead Hydrologist"

def test_export_reports():
    ws_res = client.get("/api/v1/watersheds")
    ws_id = ws_res.json()[0]["id"]

    # Test Dossier JSON
    dossier_res = client.get(f"/api/v1/reports/dossier/{ws_id}")
    assert dossier_res.status_code == 200
    assert "hydrologic_consistency_rate_pct" in dossier_res.json()["telemetry"]

    # Test CSV Export
    csv_res = client.get(f"/api/v1/reports/evidence.csv?watershed_id={ws_id}")
    assert csv_res.status_code == 200
    assert "text/csv" in csv_res.headers["content-type"]
