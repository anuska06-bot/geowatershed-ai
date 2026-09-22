from app.services.consistency_service import consistency_service
from tests.test_gis_service import SAMPLE_BOUNDARY, SAMPLE_DRAINAGE

def test_consistency_on_stream_check_dam():
    # Check dam placed directly on stream (18.9180, 73.3220)
    result = consistency_service.evaluate_intervention_evidence(
        lat=18.9180,
        lon=73.3220,
        intervention_type="Check Dam",
        target_lat=18.9180,
        target_lon=73.3220,
        boundary_geojson=SAMPLE_BOUNDARY,
        drainage_geojson=SAMPLE_DRAINAGE,
        quality_assessment={"is_blurry": False, "exposure_status": "OPTIMAL"},
        coordinate_source="EXIF_GPS"
    )
    assert result["is_inside_watershed"] is True
    assert result["stream_distance_meters"] < 5.0
    assert result["status"] == "Consistent"

def test_consistency_off_stream_check_dam_anomaly():
    # Check dam claimed 200m away from the stream
    result = consistency_service.evaluate_intervention_evidence(
        lat=18.9300,
        lon=73.3400,
        intervention_type="Check Dam",
        target_lat=18.9180,
        target_lon=73.3220,
        boundary_geojson=SAMPLE_BOUNDARY,
        drainage_geojson=SAMPLE_DRAINAGE,
        quality_assessment={"is_blurry": False, "exposure_status": "OPTIMAL"},
        coordinate_source="EXIF_GPS"
    )
    assert result["stream_distance_meters"] > 50.0
    assert result["status"] == "Potential Inconsistency"
