from typing import Dict, Any, List
from app.services.gis_service import gis_service
from app.config import settings

class ConsistencyService:
    @staticmethod
    def evaluate_intervention_evidence(
        lat: float,
        lon: float,
        intervention_type: str,
        target_lat: float,
        target_lon: float,
        boundary_geojson: Dict[str, Any],
        drainage_geojson: Dict[str, Any],
        quality_assessment: Dict[str, Any],
        coordinate_source: str
    ) -> Dict[str, Any]:
        """
        Executes the Watershed Intervention Evidence and Outcome Framework (WIEOF)
        consistency pipeline across spatial, hydrologic, and visual dimensions.
        """
        reasons: List[str] = []
        is_consistent = True
        needs_verification = False

        # 1. Watershed Boundary Containment Check
        inside_watershed = gis_service.is_point_inside_polygon(lat, lon, boundary_geojson)
        if not inside_watershed:
            is_consistent = False
            reasons.append("Coordinates fall outside designated micro-watershed boundary.")
        else:
            reasons.append("Coordinates verified inside micro-watershed polygon boundary.")

        # 2. Drainage Network Stream Proximity Check
        stream_distance, stream_order = gis_service.calculate_distance_to_nearest_stream(
            lat, lon, drainage_geojson
        )

        drainage_dependent_types = {"Check Dam", "Gully Plug", "Percolation Tank", "Loose Boulder Structure"}
        
        if intervention_type in drainage_dependent_types:
            if stream_distance <= settings.STREAM_PROXIMITY_THRESHOLD_METERS:
                reasons.append(
                    f"Hydrologically consistent: Located {stream_distance}m from Stream Order {stream_order} channel (Threshold: {settings.STREAM_PROXIMITY_THRESHOLD_METERS}m)."
                )
            elif stream_distance <= settings.STREAM_PROXIMITY_THRESHOLD_METERS * 1.5:
                needs_verification = True
                reasons.append(
                    f"Borderline hydrologic alignment: Structure is {stream_distance}m from stream bed. May reflect bank approach or seasonal flood plain."
                )
            else:
                is_consistent = False
                reasons.append(
                    f"Hydrologic anomaly: Drainage structure '{intervention_type}' is {stream_distance}m away from the nearest mapped stream channel."
                )
        else:
            reasons.append(f"Slope/Territory intervention '{intervention_type}': Independent of primary stream bed.")

        # 3. Target vs Captured Coordinate Deviation
        from app.services.gis_service import GISService
        # rough distance in meters to target
        lat_diff = (lat - target_lat) * 111139.0
        lon_diff = (lon - target_lon) * 111139.0 * 0.95
        target_delta_m = round((lat_diff**2 + lon_diff**2)**0.5, 1)

        if target_delta_m > 150.0:
            needs_verification = True
            reasons.append(f"Field survey position deviates by {target_delta_m}m from planned DPR coordinate.")
        else:
            reasons.append(f"Field position conforms closely to planned project site ({target_delta_m}m delta).")

        # 4. Visual Evidence Quality Gate
        if quality_assessment.get("is_blurry"):
            needs_verification = True
            reasons.append("Image exhibits optical blur; fine structural fissures/spillway details require ground check.")

        # 5. Coordinate Source Credibility
        if coordinate_source != "EXIF_GPS":
            needs_verification = True
            reasons.append("Coordinates were entered via manual map pin (EXIF GPS unavailable). Supervisor audit advised.")
        else:
            reasons.append("Coordinates verified directly from hardware EXIF GPS telemetry.")

        # Final Status Synthesis
        if not is_consistent:
            status = "Potential Inconsistency"
        elif needs_verification:
            status = "Requires Field Verification"
        else:
            status = "Consistent"

        return {
            "is_inside_watershed": inside_watershed,
            "stream_distance_meters": stream_distance,
            "stream_order": stream_order,
            "target_delta_meters": target_delta_m,
            "status": status,
            "reasons": reasons
        }

consistency_service = ConsistencyService()
