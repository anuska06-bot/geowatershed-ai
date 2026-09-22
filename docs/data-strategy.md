# GeoWatershed AI: Data Strategy & Dataset Specifications

```
+----------------------------------------------------------------------------------------------------+
|                                    GEOWATERSHED AI DATA STRATEGY                                   |
+----------------------------------------------------------------------------------------------------+
                                                  │
         ┌────────────────────────────────────────┼────────────────────────────────────────┐
         ▼                                        ▼                                        ▼
+---------------------------------+  +---------------------------------+  +---------------------------------+
|     MODE A: DEMONSTRATION       |  |      MODE B: USER-PROVIDED      |  |     MODE C: VERIFIED EXTERNAL   |
| - Standard benchmark watershed  |  | - Uploaded geocoded JPEG/PNG    |  | - OpenTopography / SRTM 30m DEM |
| - High-fidelity synthetic/real  |  | - EXIF GPS and manual fallback  |  | - Sentinel-2 NDVI baselines     |
|   pilot vector layers           |  | - CSV tabular survey records    |  | - IMD / CHIRPS gridded rain     |
| - Clearly watermarked & labeled |  | - User-supplied GeoJSON vectors |  | - Bhuvan WMS / OSM Vector tile  |
+---------------------------------+  +---------------------------------+  +---------------------------------+
```

---

## 1. Operating Data Modes

To prevent misleading claims and maintain scientific honesty, **GeoWatershed AI** operates under three strictly segregated data modes:

### Mode A: Demonstration / Benchmark Datasets
- **Labeling**: Every interface screen, card, and report powered by demonstration data carries an explicit indicator:  
  `[DEMO DATA - Calibrated Pilot Benchmark: Karjat Micro-Watershed (MH-WDC-042)]`.
- **Purpose**: Provides immediate, full-fidelity operational capability during evaluation, offline testing, and SIH demonstrations without network or credential dependencies.
- **Realism**: Geometrically and hydrologically valid coordinates, real elevation gradients, authentic drainage line hierarchies, and realistic field photos with authentic EXIF data.

### Mode B: User-Provided Datasets
- **Ingestion Channels**:
  1. Geocoded field survey images (EXIF extraction + manual map coordinate fallback).
  2. Tabular field survey data (CSV/Excel with Lat, Lon, Date, Type, Remarks).
  3. Custom spatial layers (GeoJSON format in EPSG:4326).
- **Validation Pipeline**:
  - File format validation (magic bytes, MIME type).
  - Geographic boundary containment validation.
  - Coordinate range sanity checks (Latitude $6.0^{\circ}\text{N} - 38.0^{\circ}\text{N}$, Longitude $68.0^{\circ}\text{E} - 98.0^{\circ}\text{E}$ for Indian subcontinent).

### Mode C: Verified External Datasets (Integration Blueprint)
- **Digital Elevation Models (DEM)**: SRTM 30m / CartoDEM 30m (for slope, elevation, drainage delineation).
- **Satellite Multi-Spectral Indices**: Sentinel-2 Level-2A (10m resolution, 5-day revisit) for seasonal NDVI and Normalized Difference Water Index (NDWI).
- **Precipitation**: IMD 0.25° gridded daily rainfall / CHIRPS 0.05° precipitation data.
- **Administrative & Cadastral Boundaries**: Survey of India / Bhuvan WMS services where public endpoints are accessible.

---

## 2. Benchmark Pilot Watershed: Karjat Micro-Watershed (Code: `MH-WDC-042`)

For the MVP implementation and evaluation, we establish a reference pilot dataset representing a semi-arid peninsular watershed in Maharashtra, modeled after typical WDC-PMKSY 2.0 intervention zones:

- **Location**: Karjat Block, Ahmednagar / Raigad transition zone, Western Maharashtra.
- **Coordinates**: Centroid at Lat $18.9150^{\circ}\text{N}$, Lon $73.3280^{\circ}\text{E}$.
- **Area**: 1,420 Hectares ($14.2\text{ km}^2$).
- **Topography**: Rugged upper ridges (slopes $>15\%$), undulating middle pediment ($5-15\%$), and alluvial valley floor ($<5\%$).
- **Drainage Network**: 4th-order ephemeral drainage basin with 32 digitized stream segments.
- **Intervention Portfolio**:
  - 8 Continuous Contour Trenches (CCT) on upper slopes.
  - 14 Gully Plugs / Loose Boulder Structures on 1st & 2nd order streams.
  - 6 Masonry / Gabion Check Dams on 3rd order streams.
  - 4 Farm Ponds / Percolation Tanks in downstream agricultural depressions.

---

## 3. Standard Field Evidence Schema (EXIF & Metadata)

When an image is ingested, the system extracts and stores the following standardized payload:

```json
{
  "evidence_id": "ev_2026_0919_001",
  "intervention_id": "int_cd_004",
  "project_id": "proj_pmksy_karjat_01",
  "file_metadata": {
    "filename": "field_checkdam_ch04_post_monsoon.jpg",
    "mime_type": "image/jpeg",
    "size_bytes": 3481920,
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "resolution": {"width": 4032, "height": 3024}
  },
  "spatial_metadata": {
    "latitude": 18.91842,
    "longitude": 73.33215,
    "altitude_meters": 312.4,
    "coordinate_source": "EXIF_GPS",
    "gps_accuracy_meters": 4.2,
    "camera_bearing_degrees": 142.0
  },
  "temporal_metadata": {
    "captured_at": "2026-08-24T10:15:32+05:30",
    "uploaded_at": "2026-09-19T14:20:00+05:30"
  },
  "quality_assessment": {
    "laplacian_blur_variance": 428.5,
    "is_blurry": false,
    "brightness_mean": 138.2,
    "exposure_status": "OPTIMAL",
    "quality_score": 0.94
  },
  "hydrologic_consistency": {
    "is_inside_watershed": true,
    "distance_to_stream_meters": 12.4,
    "stream_order": 3,
    "expected_elevation_meters": 310.0,
    "elevation_delta_meters": 2.4,
    "status": "Consistent"
  },
  "human_review": {
    "status": "Reviewed",
    "reviewer_name": "Er. R. Deshmukh (WDT Hydrologist)",
    "reviewer_comments": "Structure verified. Minor silt accumulation observed on upstream sill; within operational threshold.",
    "reviewed_at": "2026-09-19T15:00:00+05:30"
  }
}
```

---

## 4. Missing-Data & Fallback Handling

| Condition | System Response | UI Warning / Indicator |
| :--- | :--- | :--- |
| **Image has no EXIF GPS** | Allow manual location selection via map pin or manual coordinate entry. | Yellow badge: `Coordinate Source: Manual Map Pin (Unverified EXIF)`. Flagged for supervisor review. |
| **No DEM or Elevation data** | Skip elevation delta calculation; do not fabricate slope. | Display: `"Elevation cross-check unavailable: DEM layer not loaded"`. |
| **No Drainage layer** | Distance to stream check marked as `Insufficient Data`. | Status: `Consistency Check: Incomplete (Stream Network Missing)`. |
| **No Multi-Year Satellite Pass** | Disable trend line and causal comparison tabs. | Display: `"Insufficient multi-temporal imagery to evaluate vegetation response"`. |
