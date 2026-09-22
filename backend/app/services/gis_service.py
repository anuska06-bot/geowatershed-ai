import math
from typing import Dict, Any, Tuple, Optional
from shapely.geometry import shape, Point, LineString, MultiLineString

class GISService:
    @staticmethod
    def is_point_inside_polygon(lat: float, lon: float, boundary_geojson: Dict[str, Any]) -> bool:
        """
        Validates whether a given (lat, lon) coordinate falls strictly
        within the micro-watershed boundary polygon.
        """
        try:
            pt = Point(lon, lat)  # GeoJSON is [lon, lat]
            poly = shape(boundary_geojson)
            return bool(poly.contains(pt))
        except Exception as e:
            return False

    @staticmethod
    def calculate_distance_to_nearest_stream(
        lat: float, lon: float, drainage_geojson: Dict[str, Any]
    ) -> Tuple[float, Optional[int]]:
        """
        Calculates the perpendicular distance in meters from a given coordinate
        to the nearest mapped stream channel in the drainage network.
        Returns (distance_meters, stream_order).
        """
        try:
            pt = Point(lon, lat)
            min_dist_deg = float("inf")
            best_stream_order = None

            features = drainage_geojson.get("features", [])
            for feat in features:
                geom = shape(feat.get("geometry", {}))
                dist = pt.distance(geom)
                if dist < min_dist_deg:
                    min_dist_deg = dist
                    best_stream_order = feat.get("properties", {}).get("stream_order", 1)

            # Metric conversion at current latitude
            # 1 degree lat ~= 111,139 meters
            # 1 degree lon ~= 111,139 * cos(lat in rad) meters
            rad = math.radians(lat)
            meters_per_deg_lat = 111139.0
            meters_per_deg_lon = 111139.0 * math.cos(rad)
            avg_meters_per_deg = (meters_per_deg_lat + meters_per_deg_lon) / 2.0

            distance_meters = round(min_dist_deg * avg_meters_per_deg, 1)
            return distance_meters, best_stream_order
        except Exception as e:
            return 9999.0, None

gis_service = GISService()
