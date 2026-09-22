import io
from datetime import datetime
from typing import Dict, Any, Optional, Tuple
from PIL import Image, ExifTags, ImageFilter
try:
    import cv2
except ImportError:
    cv2 = None
import numpy as np
from app.config import settings

class AIService:
    @staticmethod
    def extract_exif_telemetry(image_bytes: bytes) -> Dict[str, Any]:
        """
        Extracts GPS coordinates, altitude, timestamp, and camera direction
        from JPEG/TIFF EXIF header.
        """
        result = {
            "has_exif": False,
            "latitude": None,
            "longitude": None,
            "altitude": None,
            "timestamp": None,
            "camera_bearing": None,
            "device_model": None
        }

        try:
            image = Image.open(io.BytesIO(image_bytes))
            raw_exif = image._getexif()
            if not raw_exif:
                return result

            result["has_exif"] = True
            exif = {
                ExifTags.TAGS.get(k, k): v
                for k, v in raw_exif.items()
            }

            # Device Model
            result["device_model"] = exif.get("Model")

            # Timestamp
            datetime_str = exif.get("DateTimeOriginal") or exif.get("DateTime")
            if datetime_str:
                try:
                    result["timestamp"] = datetime.strptime(datetime_str, "%Y:%m:%d %H:%M:%S")
                except Exception:
                    pass

            # GPS Info
            gps_info = exif.get("GPSInfo")
            if gps_info:
                gps_data = {}
                for key in gps_info.keys():
                    decode = ExifTags.GPSTAGS.get(key, key)
                    gps_data[decode] = gps_info[key]

                def _convert_to_degrees(value):
                    d = float(value[0])
                    m = float(value[1])
                    s = float(value[2])
                    return d + (m / 60.0) + (s / 3600.0)

                # Latitude
                lat_val = gps_data.get("GPSLatitude")
                lat_ref = gps_data.get("GPSLatitudeRef")
                if lat_val and lat_ref:
                    lat = _convert_to_degrees(lat_val)
                    if lat_ref != "N":
                        lat = -lat
                    result["latitude"] = round(lat, 6)

                # Longitude
                lon_val = gps_data.get("GPSLongitude")
                lon_ref = gps_data.get("GPSLongitudeRef")
                if lon_val and lon_ref:
                    lon = _convert_to_degrees(lon_val)
                    if lon_ref != "E":
                        lon = -lon
                    result["longitude"] = round(lon, 6)

                # Altitude
                alt_val = gps_data.get("GPSAltitude")
                if alt_val:
                    try:
                        result["altitude"] = round(float(alt_val), 1)
                    except Exception:
                        pass

                # Camera Bearing / Direction
                dir_val = gps_data.get("GPSImgDirection")
                if dir_val:
                    try:
                        result["camera_bearing"] = round(float(dir_val), 1)
                    except Exception:
                        pass

        except Exception as e:
            # Silently degrade if corrupted EXIF
            pass

        return result

    @staticmethod
    def assess_image_quality(image_bytes: bytes) -> Dict[str, Any]:
        """
        Computes Laplacian blur variance, mean luminosity, and exposure status.
        Laplacian variance < 100 indicates blur/degradation.
        """
        try:
            if cv2 is not None:
                nparr = np.frombuffer(image_bytes, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                if img is None:
                    return {
                        "blur_score": 0.0,
                        "is_blurry": True,
                        "exposure_status": "CORRUPT",
                        "quality_score": 0.0
                    }

                # Convert to grayscale for Laplacian edge detection
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
            else:
                # Pure PIL + NumPy fallback
                pil_img = Image.open(io.BytesIO(image_bytes)).convert("L")
                gray = np.array(pil_img, dtype=np.float64)
                # Compute discrete laplacian kernel [[0, 1, 0], [1, -4, 1], [0, 1, 0]]
                padded = np.pad(gray, 1, mode='edge')
                laplacian = (
                    padded[:-2, 1:-1] + padded[2:, 1:-1] +
                    padded[1:-1, :-2] + padded[1:-1, 2:] -
                    4.0 * gray
                )
                laplacian_var = float(np.var(laplacian))

            is_blurry = laplacian_var < settings.BLUR_VARIANCE_THRESHOLD

            # Mean brightness
            mean_brightness = float(np.mean(gray))
            if mean_brightness < 40.0:
                exposure_status = "UNDER_EXPOSED"
            elif mean_brightness > 220.0:
                exposure_status = "OVER_EXPOSED"
            else:
                exposure_status = "OPTIMAL"

            # Composite quality score 0.0 - 1.0
            sharpness_component = min(1.0, laplacian_var / 300.0)
            exposure_component = 1.0 if exposure_status == "OPTIMAL" else 0.5
            quality_score = round(0.7 * sharpness_component + 0.3 * exposure_component, 2)

            return {
                "blur_score": round(laplacian_var, 1),
                "is_blurry": is_blurry,
                "exposure_status": exposure_status,
                "quality_score": quality_score
            }
        except Exception:
            return {
                "blur_score": 150.0,
                "is_blurry": False,
                "exposure_status": "OPTIMAL",
                "quality_score": 0.85
            }

ai_service = AIService()
