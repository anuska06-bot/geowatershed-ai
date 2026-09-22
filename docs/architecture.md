# GeoWatershed AI: Architecture & System Design

```
+----------------------------------------------------------------------------------------------------+
|                                    GEOWATERSHED AI PLATFORM                                        |
|                          "Transforming Geospatial Data into Smarter Watershed Development"          |
+----------------------------------------------------------------------------------------------------+
                                                  │
                  ┌───────────────────────────────┴───────────────────────────────┐
                  ▼                                                               ▼
+-----------------------------------+                           +-----------------------------------+
|      FRONTEND CLIENT (SPA / PWA)  |                           |     FIELD MOBILE CLIENT (PWA)     |
|  - React 19 + TypeScript + Vite   |                           |  - Offline-first cache & sync     |
|  - Tailwind CSS + Lucide Icons    |                           |  - Native Geolocation & Camera    |
|  - Leaflet / React-Leaflet GIS    |                           |  - EXIF Client validation         |
|  - Recharts biophysical trends    |                           |  - Structured field survey forms  |
+-----------------------------------+                           +-----------------------------------+
                  │                                                               │
                  └───────────────────────────────┬───────────────────────────────┘
                                                  │ REST API / GeoJSON / Multipart
                                                  ▼
+----------------------------------------------------------------------------------------------------+
|                                BACKEND APPLICATION GATEWAY (FastAPI)                               |
|  - Route Handlers (Auth, Watersheds, Interventions, Field Evidence, Projects, Reports, Economics)  |
|  - Role-Based Access Control (RBAC): Citizen, Field Officer, Project Manager, GIS Analyst, Admin   |
|  - Request Validation & Schema Serialization (Pydantic v2)                                         |
|  - Audit Log Interceptor & Security Headers (CORS, Rate Limiting, File Sanitization)              |
+----------------------------------------------------------------------------------------------------+
                  │                                │                                │
                  ▼                                ▼                                ▼
+----------------------------------+ +---------------------------+ +--------------------------------+
|           GIS ENGINE             | |     AI & CV ENGINE        | |   EVIDENCE CONSISTENCY ENGINE  |
|  - Shapely / GeoPandas topology  | |  - EXIF GPS/Azimuth parser| |  - Spatial boundary containment|
|  - GeoJSON FeatureCollection srv | |  - Image Quality & Blur   | |  - Stream proximity distance   |
|  - Stream order & buffer calc    | |  - Object/Structure detect| |  - Topographic elevation match |
|  - Slope & terrain classification| |  - Verification pipeline  | |  - Multi-temporal coherence    |
+----------------------------------+ +---------------------------+ +--------------------------------+
                  │                                │                                │
                  └────────────────────────────────┼────────────────────────────────┘
                                                   │
                                                   ▼
+----------------------------------------------------------------------------------------------------+
|                                    PERSISTENCE & STORAGE LAYER                                     |
|  - Relational & Geospatial Store: SQLite (with SpatiaLite / GeoJSON models) -> PostgreSQL + PostGIS|
|  - Object Evidence Storage: Local file storage (`/data/uploads/evidence`) -> S3/MinIO bucket      |
|  - Master Datasets: Micro-watershed boundaries, drainage networks, land-use baselines              |
+----------------------------------------------------------------------------------------------------+
```

---

## 1. Architectural Philosophy: Modular Monolith

To guarantee fast local execution, zero cloud cost barriers for hackathon evaluation, and clear paths to enterprise scaling, **GeoWatershed AI** is designed as a **Modular Monolith**:

1. **Decoupled Service Modules**: The GIS processing (`gis_service`), Computer Vision inference (`ai_service`), Evidence Consistency evaluation (`consistency_service`), and Reporting pipelines (`reporting_service`) are strictly organized as standalone Python packages with clear interface contracts.
2. **Unified Transport Layer**: FastAPI exposes clean, documented REST endpoints (`/api/v1/...`) with OpenAPI 3.1 specifications and automatic type validation.
3. **Pluggable Database Adapter**:
   - **Local MVP / SIH Mode**: Uses SQLite with GeoJSON spatial serialization and Shapely geometric operations. Zero external database installation hurdles while maintaining rigorous spatial operations.
   - **Production Mode**: Swappable to PostgreSQL 16 + PostGIS with zero changes to service logic via SQLAlchemy 2.0 ORM.
4. **Local Artifact & Image Storage**: Direct hash-addressed local filesystem storage with clean URI abstraction, easily replaced by AWS S3 or MinIO.

---

## 2. Component Breakdown

### 2.1 Frontend Client (`/frontend`)
- **Framework**: React 19 + TypeScript 5.8 + Vite.
- **Styling**: Tailwind CSS v3.4 with an executive-grade nature-grounded palette (Deep Forest `#0f291e`, Emerald `#10b981`, Slate `#1e293b`, Ochre `#d97706`).
- **Mapping & GIS**: Leaflet 1.9 + React-Leaflet with custom GeoJSON vector layers, custom SVG icons for check dams, farm ponds, percolation tanks, and interactive polygon selection.
- **Analytics & Charts**: Recharts for seasonal vegetation curves, water spread areas, and budget-vs-progress tracking.
- **State Management**: Lightweight Zustand stores for active watershed, selected intervention, layer toggles, and offline queue.

### 2.2 Backend Gateway (`/backend`)
- **Framework**: Python 3.12 + FastAPI.
- **Validation**: Pydantic v2 schemas for all payloads and responses.
- **Database ORM**: SQLAlchemy 2.0 async/sync support with alembic migrations.
- **Security**: OAuth2 with JWT tokens, Argon2 password hashing, role decorators (`@require_roles`).

### 2.3 GIS & Spatial Service (`/backend/services/gis_service.py`)
- **Core Libraries**: `shapely` for vector geometry (Point-in-polygon containment, buffers, Euclidean distance calculations), `pyproj` for coordinate transformations.
- **Functions**:
  - Delineate micro-watershed boundaries and compute bounding boxes.
  - Calculate distance from an intervention GPS coordinate to the nearest mapped drainage channel.
  - Overlay intervention points onto slope and elevation classes.

### 2.4 AI & Computer Vision Service (`/backend/services/ai_service.py`)
- **Core Libraries**: `Pillow` (PIL) for EXIF GPS extraction and image dimension validation, `opencv-python` / `numpy` for image quality inspection (Laplacian variance for blur detection, brightness/contrast histograms).
- **Intervention Classifier Interface**: Modular, pluggable classification contract. For MVP, includes a verified rule-based quality assessment and a baseline feature extractor with clear confidence boundaries and human-review flags.
- **No Hallucinated Predictions**: When automated confidence falls below the acceptance threshold ($< 0.85$), the status is explicitly set to `Needs Verification` for expert human review.

### 2.5 Evidence Consistency Engine (`/backend/services/consistency_service.py`)
- Executes the core innovation of the **Watershed Intervention Evidence and Outcome Framework (WIEOF)**:
  1. **Spatial Plausibility**: Is the coordinate within the claimed micro-watershed boundary? (Tolerance: Strict polygon containment).
  2. **Hydrologic Plausibility**: For drainage-line structures (check dam, gully plug, nala bund), is the distance to stream $\le 50\text{ m}$?
  3. **Temporal Plausibility**: Does the image timestamp match the project construction or monitoring window?
  4. **Quality Plausibility**: Does the image meet resolution and clarity standards?
- Produces a deterministic, explainable `ConsistencyScore` with explicit rule breakdowns:
  - `Consistent`
  - `Potential Inconsistency`
  - `Insufficient Information`
  - `Requires Field Verification`

---

## 3. Data Flow Diagrams

### Data Flow A: Field Photo Ingestion & Evidence Generation
```
Field Officer (Mobile / Web)
     │
     │ 1. Uploads JPG/PNG image + Optional survey notes
     ▼
FastAPI Gateway (`POST /api/v1/interventions/evidence`)
     │
     │ 2. Binary validation (MIME, Magic Bytes, File size)
     ▼
AI & CV Service
     │
     ├─► Extracts EXIF: Lat, Lon, Alt, Timestamp, Camera Azimuth
     ├─► Runs Blur & Exposure Check (Laplacian Variance)
     └─► Computes perceptual hash & quality score
     ▼
Evidence Consistency Engine
     │
     ├─► Queries GIS Service: Point-in-watershed containment
     ├─► Queries GIS Service: Distance to nearest stream channel
     └─► Evaluates timestamp vs project timeline
     ▼
Persistence Layer
     │
     ├─► Writes image file to `/data/uploads/evidence/{hash}.jpg`
     ├─► Creates `InterventionEvidence` record with status `Preliminary` or `Consistent`
     └─► Updates `Intervention` entity state
     ▼
Response to Client (JSON with Evidence Card, Map Pin, and Consistency Flags)
```

### Data Flow B: Human Review & Outcome Synthesis
```
Project Manager / Technical Analyst
     │
     │ 1. Opens Intervention Evidence Card in Web UI
     │ 2. Inspects Geocoded Photo, Stream Distance, and Consistency Flags
     │ 3. Submits Review Decision: `Reviewed & Verified` or `Rejected` with comments
     ▼
FastAPI Gateway (`POST /api/v1/interventions/{id}/review`)
     │
     ▼
Database Layer
     │
     ├─► Updates Review Status, Reviewer ID, and Review Timestamp
     ├─► Appends immutable entry to `EvidenceAuditTrail`
     └─► Triggers Outcome Dossier generation
     ▼
Reporting Engine
     │
     └─► Generates audit-compliant PDF/CSV with full lineage and disclaimers
```

---

## 4. Entity-Relationship Model (Core Schemas)

1. **User**: `id`, `email`, `hashed_password`, `full_name`, `role`, `organization`, `is_active`, `created_at`.
2. **Watershed**: `id`, `code`, `name`, `state`, `district`, `block`, `basin`, `area_hectares`, `boundary_geojson`, `drainage_geojson`, `created_at`.
3. **Project**: `id`, `watershed_id`, `project_name`, `scheme_name` (e.g. WDC-PMKSY 2.0), `status`, `sanctioned_budget`, `expenditure`, `start_date`, `target_date`, `created_at`.
4. **Intervention**: `id`, `project_id`, `watershed_id`, `intervention_type` (Check Dam, Farm Pond, Contour Trench, Percolation Tank, Afforestation), `target_latitude`, `target_longitude`, `stream_order`, `status`, `created_at`.
5. **FieldEvidence**: `id`, `intervention_id`, `user_id`, `image_path`, `thumbnail_path`, `captured_latitude`, `captured_longitude`, `coordinate_source` (`EXIF_GPS` | `MANUAL_MAP_PIN`), `captured_at`, `camera_bearing`, `image_quality_score`, `blur_metric`, `stream_distance_meters`, `consistency_status`, `consistency_reasons_json`, `review_status`, `reviewer_id`, `reviewer_notes`, `reviewed_at`, `created_at`.
6. **BiophysicalIndicator**: `id`, `watershed_id`, `indicator_type` (NDVI, Surface Water Spread, Drainage Density), `period_start`, `period_end`, `value`, `unit`, `data_source`, `methodology`, `confidence_level`, `completeness_score`.
7. **AuditLog**: `id`, `user_id`, `action`, `resource_type`, `resource_id`, `details_json`, `timestamp`.
