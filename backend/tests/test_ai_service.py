import io
import numpy as np
import cv2
from PIL import Image
from app.services.ai_service import ai_service

def test_image_quality_assessment_sharp():
    # Create an image with high frequency edges (checkerboard pattern)
    arr = np.zeros((100, 100, 3), dtype=np.uint8)
    arr[::10, :] = 255
    arr[:, ::10] = 255
    _, buffer = cv2.imencode(".jpg", arr)
    
    result = ai_service.assess_image_quality(buffer.tobytes())
    assert result["is_blurry"] is False
    assert result["blur_score"] > 100.0
    assert result["exposure_status"] == "OPTIMAL"

def test_image_quality_assessment_blurry():
    # Completely flat image has zero Laplacian variance
    arr = np.ones((100, 100, 3), dtype=np.uint8) * 128
    _, buffer = cv2.imencode(".jpg", arr)
    
    result = ai_service.assess_image_quality(buffer.tobytes())
    assert result["is_blurry"] is True
    assert result["blur_score"] < 100.0

def test_exif_extraction(sample_image_bytes):
    telemetry = ai_service.extract_exif_telemetry(sample_image_bytes)
    assert telemetry["has_exif"] is True
    assert telemetry["latitude"] is not None
    assert round(telemetry["latitude"], 2) == 18.91
    assert telemetry["longitude"] is not None
    assert round(telemetry["longitude"], 2) == 73.33
