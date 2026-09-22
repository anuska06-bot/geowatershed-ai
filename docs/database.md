# GeoWatershed AI: Database Architecture & Schema Specification

```
+----------------------------------------------------------------------------------------------------+
|                                GEOWATERSHED AI DUAL-DATABASE ARCHITECTURE                          |
+----------------------------------------------------------------------------------------------------+
                                                  │
                 ┌────────────────────────────────┴────────────────────────────────┐
                 ▼                                                                 ▼
+-------------------------------------------------+             +------------------------------------+
|            MODE 1: LOCAL / SIH EVALUATION       |             |     MODE 2: PRODUCTION / ENTERPRISE|
|  - Engine: SQLite 3 + Shapely Spatial Library   |             |  - Engine: PostgreSQL 16 + PostGIS |
|  - Zero installation overhead (runs natively)   |             |  - Spatial Indexing: GiST / R-Tree |
|  - Full portability across Windows / Linux / Mac|             |  - Native PostGIS functions:       |
|  - Strict GeoJSON vector standards (EPSG:4326)  |             |    ST_DWithin, ST_Contains, ST_Dist|
+-------------------------------------------------+             +------------------------------------+
                 │                                                                 │
                 └────────────────────────────────┬────────────────────────────────┘
                                                  │
                                                  ▼
+----------------------------------------------------------------------------------------------------+
|                                    UNIFIED SQLALCHEMY 2.0 ORM LAYER                                |
|          Switch between modes seamlessly with one environment variable: `DATABASE_URL`             |
+----------------------------------------------------------------------------------------------------+
```

---

## 1. Executive Database Recommendation

For **GeoWatershed AI**, we adopt a **Dual-Mode Architectural Pattern**:

1. **Target Production Database**: **PostgreSQL 16 with the PostGIS 3.4 Spatial Extension**.
   - **Why?** PostGIS is the global and Indian national standard (used by ISRO Bhuvan, National Informatics Centre, and Survey of India) for geospatial enterprise workloads. It provides native spatial indexing (R-Tree GiST indexes), sub-meter spatial predicates (`ST_DWithin`, `ST_Intersects`, `ST_Distance`), and supports multi-gigabyte spatial polygon layers.
2. **Evaluation & Local Development Database**: **SQLite 3 paired with Python Shapely 2.0**.
   - **Why?** SIH evaluation panels and local testers often lack Docker or administrative rights to install PostgreSQL + PostGIS services on their test machines. By pairing SQLite with Shapely in Python, the system executes high-precision spatial math (point-in-polygon containment, stream distance perpendicular calculations) **with zero external setup, zero passwords, and zero connection failures**.
3. **Seamless Switching via SQLAlchemy 2.0**:
   - Both modes share the exact same SQLAlchemy models.
   - Set `DATABASE_URL=sqlite:///./geowatershed.db` for instant local/offline demo.
   - Set `DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/geowatershed` for enterprise production.

---

## 2. Evidence Storage Architecture (No Giant BLOBs in Tables)

**Critical Architectural Rule**: Geocoded field photographs and high-resolution raster files are **never** stored as raw binary blobs (`BYTEA` or `BLOB`) inside database rows. Doing so bloats database cache memory, slows down table scans, and complicates backups.

- **Image Binaries**: Stored in a content-addressed storage repository (`/data/uploads/evidence/{sha256_hash}.jpg`) or an S3/MinIO bucket.
- **Database Records**: Store structured metadata: SHA-256 checksum, relative file path, thumbnail path, EXIF parameters, GPS coordinates, timestamp, and review state.

---

## 3. Relational Schema & Entity Relationships

```
+----------------+          +----------------+          +--------------------+
|   watersheds   | 1      * |    projects    | 1      * |   interventions    |
|----------------|----------|----------------|----------|--------------------|
| id (PK)        |          | id (PK)        |          | id (PK)            |
| code           |          | watershed_id   |          | project_id         |
| name           |          | name           |          | watershed_id       |
| state          |          | scheme_name    |          | intervention_type  |
| district       |          | budget         |          | target_latitude    |
| boundary_geom  |          | status         |          | target_longitude   |
| drainage_geom  |          +----------------+          | stream_order       |
+----------------+                                      | status             |
        │                                               +--------------------+
        │                                                         │
        │ 1                                                       │ 1
        │                                                         │
        ▼ *                                                       ▼ *
+--------------------+                                  +--------------------+
| biophysical_indices|                                  |   field_evidence   |
|--------------------|                                  |--------------------|
| id (PK)            |                                  | id (PK)            |
| watershed_id       |                                  | intervention_id    |
| indicator_name     |                                  | image_path         |
| period_start       |                                  | captured_lat/lon   |
| period_end         |                                  | coordinate_source  |
| value              |                                  | camera_bearing     |
| data_source        |                                  | stream_distance_m  |
| quality_status     |                                  | consistency_status |
+--------------------+                                  | review_status      |
                                                        +--------------------+
```

---

## 4. Table Definitions & Data Types

### 4.1 Table: `watersheds`
Stores administrative and hydrologic boundaries.
- `id` (VARCHAR(36), Primary Key): UUID.
- `code` (VARCHAR(50), Unique, Indexed): e.g., `MH-WDC-042`.
- `name` (VARCHAR(150)): e.g., `Karjat Micro-Watershed`.
- `state` (VARCHAR(100)): e.g., `Maharashtra`.
- `district` (VARCHAR(100)): e.g., `Ahmednagar`.
- `block` (VARCHAR(100)): e.g., `Karjat`.
- `basin` (VARCHAR(100)): e.g., `Godavari Basin / Bhima Sub-basin`.
- `area_hectares` (FLOAT): Total area.
- `boundary_geojson` (TEXT / JSONB): GeoJSON polygon representation.
- `drainage_geojson` (TEXT / JSONB): GeoJSON LineString collection of streams with Strahler orders.
- `created_at` (TIMESTAMP): UTC record timestamp.

### 4.2 Table: `projects`
Stores watershed development scheme projects (e.g. WDC-PMKSY 2.0).
- `id` (VARCHAR(36), Primary Key): UUID.
- `watershed_id` (VARCHAR(36), Foreign Key $\rightarrow$ `watersheds.id`).
- `name` (VARCHAR(200)): e.g., `PMKSY-WDC 2.0 Karjat Ridge-to-Valley Batch I`.
- `scheme_name` (VARCHAR(100)): e.g., `WDC-PMKSY 2.0`.
- `sanctioned_budget_inr` (FLOAT): Allocated funds.
- `expenditure_inr` (FLOAT): Logged expenditure.
- `start_date` (DATE): Sanction/commencement date.
- `target_date` (DATE): Planned completion date.
- `status` (VARCHAR(50)): `Proposed`, `Approved`, `In Progress`, `Under Review`, `Completed`, `On Hold`.

### 4.3 Table: `interventions`
Planned or sanctioned conservation structures.
- `id` (VARCHAR(36), Primary Key): UUID.
- `project_id` (VARCHAR(36), Foreign Key $\rightarrow$ `projects.id`).
- `watershed_id` (VARCHAR(36), Foreign Key $\rightarrow$ `watersheds.id`).
- `intervention_type` (VARCHAR(50)): `Check Dam`, `Farm Pond`, `Contour Trench`, `Percolation Tank`, `Gully Plug`, `Afforestation`.
- `target_latitude` (FLOAT): Planned coordinate.
- `target_longitude` (FLOAT): Planned coordinate.
- `stream_order` (INTEGER): Strahler stream order (1, 2, 3, or 4).
- `status` (VARCHAR(50)): `Sanctioned`, `Under Construction`, `Completed`, `Operational`.

### 4.4 Table: `field_evidence`
The core evidence record linked to geocoded photographs.
- `id` (VARCHAR(36), Primary Key): UUID.
- `intervention_id` (VARCHAR(36), Foreign Key $\rightarrow$ `interventions.id`).
- `user_id` (VARCHAR(36)): Surveyor / Field officer ID.
- `image_path` (VARCHAR(500)): Local file path or S3 key.
- `thumbnail_path` (VARCHAR(500)): Compressed preview path.
- `file_sha256` (VARCHAR(64), Indexed): Content hash for tamper detection.
- `captured_latitude` (FLOAT): Actual latitude extracted from EXIF or manual pin.
- `captured_longitude` (FLOAT): Actual longitude extracted from EXIF or manual pin.
- `altitude_meters` (FLOAT, Nullable): GPS altitude.
- `coordinate_source` (VARCHAR(50)): `EXIF_GPS` | `MANUAL_MAP_PIN`.
- `camera_bearing_deg` (FLOAT, Nullable): Compass heading from EXIF.
- `captured_at` (TIMESTAMP): Date/time photo was taken.
- `uploaded_at` (TIMESTAMP): Date/time uploaded to system.
- `blur_score` (FLOAT): Laplacian variance metric ($\ge 100 \implies \text{sharp}$).
- `exposure_status` (VARCHAR(30)): `Optimal`, `Under-exposed`, `Over-exposed`.
- `stream_distance_meters` (FLOAT): Computed perpendicular distance to nearest stream.
- `consistency_status` (VARCHAR(50)): `Consistent`, `Potential Inconsistency`, `Insufficient Information`, `Requires Field Verification`.
- `consistency_reasons` (TEXT / JSONB): Explainable rule breakdown array.
- `review_status` (VARCHAR(50)): `Preliminary`, `Needs Verification`, `Reviewed`, `Rejected`.
- `reviewer_id` (VARCHAR(36), Nullable): Officer who conducted human audit.
- `reviewer_notes` (TEXT, Nullable): Expert evaluation remarks.
- `reviewed_at` (TIMESTAMP, Nullable): Review timestamp.

### 4.5 Table: `biophysical_indicators`
Stores multi-temporal environmental observations with clear data sources.
- `id` (VARCHAR(36), Primary Key): UUID.
- `watershed_id` (VARCHAR(36), Foreign Key $\rightarrow$ `watersheds.id`).
- `indicator_type` (VARCHAR(50)): `NDVI_MEAN`, `WATER_SPREAD_HA`, `DRAINAGE_DENSITY_KM_PER_SQKM`, `EROSION_SUSCEPTIBILITY`.
- `period_start` (DATE).
- `period_end` (DATE).
- `value` (FLOAT).
- `unit` (VARCHAR(30)).
- `data_source` (VARCHAR(100)): e.g. `Sentinel-2 Level-2A (ESA)`, `SRTM 30m (NASA/USGS)`.
- `methodology` (VARCHAR(250)).
- `completeness_score` (FLOAT): $0.0 - 1.0$.
- `uncertainty_description` (TEXT).

### 4.6 Table: `audit_logs`
Immutable compliance log for human reviews and security actions.
- `id` (VARCHAR(36), Primary Key): UUID.
- `user_id` (VARCHAR(36)): Actor who performed the action.
- `action` (VARCHAR(100)): e.g., `EVIDENCE_UPLOAD`, `CONSISTENCY_EVALUATION`, `EXPERT_REVIEW_APPROVED`, `REPORT_EXPORTED`.
- `resource_type` (VARCHAR(50)): `field_evidence`, `project`, `watershed`.
- `resource_id` (VARCHAR(36)).
- `details_json` (TEXT / JSONB): Context parameters and previous/new state diff.
- `ip_address` (VARCHAR(45)).
- `timestamp` (TIMESTAMP): UTC timestamp.
