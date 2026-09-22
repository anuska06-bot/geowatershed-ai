from app.services.gis_service import gis_service

SAMPLE_BOUNDARY = {
    "type": "Polygon",
    "coordinates": [
        [
            [73.3080, 18.9050],
            [73.3150, 18.9280],
            [73.3320, 18.9350],
            [73.3480, 18.9250],
            [73.3450, 18.9020],
            [73.3280, 18.8950],
            [73.3080, 18.9050]
        ]
    ]
}

SAMPLE_DRAINAGE = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {"stream_order": 4},
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [73.3150, 18.9250],
                    [73.3220, 18.9180],
                    [73.3280, 18.9120]
                ]
            }
        }
    ]
}

def test_point_inside_watershed():
    # Centroid coordinate inside Karjat polygon
    inside = gis_service.is_point_inside_polygon(18.9150, 73.3280, SAMPLE_BOUNDARY)
    assert inside is True

def test_point_outside_watershed():
    # Coordinates in Mumbai / Arabian Sea, far outside
    outside = gis_service.is_point_inside_polygon(19.0760, 72.8777, SAMPLE_BOUNDARY)
    assert outside is False

def test_stream_distance_on_stream():
    # Exactly on the line (73.3220, 18.9180)
    dist, order = gis_service.calculate_distance_to_nearest_stream(18.9180, 73.3220, SAMPLE_DRAINAGE)
    assert dist < 1.0  # < 1 meter
    assert order == 4

def test_stream_distance_off_stream():
    # Point located away from the line
    dist, order = gis_service.calculate_distance_to_nearest_stream(18.9300, 73.3400, SAMPLE_DRAINAGE)
    assert dist > 100.0  # Over 100 meters away
