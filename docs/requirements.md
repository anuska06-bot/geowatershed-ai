# GeoWatershed AI: Requirements & System Specification
**Product Name:** GeoWatershed AI  
**Tagline:** "Transforming Geospatial Data into Smarter Watershed Development"  
**Context:** SIH 2026 Problem Statement PS 15 — *Application of Geospatial Techniques for Visualization and Analysis to Interpret Geo-Coded Images to Enhance Watershed Development Outcomes.*  
**Standard & Governance:** Grounded in WDC-PMKSY 2.0 (Watershed Development Component of Pradhan Mantri Krishi Sinchayee Yojana), DoLR guidelines, and CWC micro-watershed delineation frameworks.

---

## 1. Problem Statement & Operational Context

Watershed development in India spans thousands of micro-watersheds under the Department of Land Resources (DoLR), State Level Nodal Agencies (SLNAs), and Watershed Cell cum Data Centres (WCDCs). While systems like ISRO's **Bhuvan-Drishti** (field photo collection) and **Bhuvan-Srishti** (web GIS monitoring) have established digital photo repositories for monitoring physical progress, a critical operational and scientific gap persists:

1. **Passive Observation vs. Active Evidence**: Geocoded images are currently pinned to maps as static records without verification of whether the image features match the reported coordinates, drainage lines, or project phase.
2. **Correlation vs. Causation Fallacy**: Common dashboard tools often mistakenly present generalized seasonal vegetation increases as proof of project success, ignoring rainfall anomalies, macro-climatic trends, and irrigation shifts.
3. **Disconnected Workflows**: Planners, field surveyors, technical analysts, and citizens work with fragmented data across field photos, survey forms, static GIS layers, and manual audit registers.
4. **Lack of Explainability & Uncertainty Awareness**: Outputs rarely declare data completeness, GPS dilution of precision, sensor resolution limits, or require formal human expert concurrence before publishing outcomes.

**GeoWatershed AI** solves these gaps through the **Watershed Intervention Evidence and Outcome Framework (WIEOF)** — moving from passive image visualization to **Intervention-to-Outcome Evidence Intelligence**.

---

## 2. Target User Personas & Permissions

| Role | Persona Identifier | Core Capabilities & Permissions | Security & Privacy Safeguards |
| :--- | :--- | :--- | :--- |
| **Citizen / Community** | `ROLE_CITIZEN` | Explore public verified watershed maps; view project cards; read plain-language indicators; submit crowdsourced public observations. | Sensitive exact infrastructure GPS coordinates can be generalized; personal surveyor info is never exposed. |
| **Field Officer / Surveyor** | `ROLE_FIELD_OFFICER` | Capture geocoded field surveys with EXIF GPS; upload photos; log structure type, siltation status, physical condition; submit drafts; sync offline observations. | Device GPS permission flow; tamper-resistant timestamping; audit trail of device ID and upload session. |
| **Project Manager / WCDC** | `ROLE_MANAGER` | Create projects; assign watershed boundaries; track milestone completion; review field evidence cards; evaluate budget vs. physical progress. | Departmental authorization; immutable review logs; access restricted to jurisdiction. |
| **Technical Analyst / GIS Specialist** | `ROLE_ANALYST` | Upload spatial layers (GeoJSON/Shapefile/DEM); review evidence consistency; trigger satellite indicator extraction; calibrate risk rules; override AI evaluations. | Full data lineage visibility; configuration audit logs; export access for raw datasets. |
| **System Administrator** | `ROLE_ADMIN` | User lifecycle; role assignments; system health monitoring; master data management (districts, micro-watersheds, intervention taxonomies). | Strict role-based access control (RBAC), API key management, audit trail inspection. |

---

## 3. Functional Requirements (FR)

### FR-01: Watershed Boundary & Drainage Explorer
- Interactive multi-layer map supporting micro-watershed boundaries, stream drainage networks (Strahler stream orders 1 to 4+), contour/slope overlays, and water body perimeters.
- Switchable basemaps: High-contrast topographic, satellite/aerial, and clean vector cartography.
- Clear distinction between verified administrative boundaries and demonstration/sample data.

### FR-02: Geocoded Field Evidence Ingestion & Validation
- Parse EXIF metadata from uploaded JPEG/PNG/WebP images: Latitude, Longitude, Altitude, Timestamp, Camera Bearing/Azimuth, Device model.
- Robust fallback for manual coordinate entry and interactive map-pinning with explicit labeling (`COORDINATE_SOURCE: EXIF` vs. `MANUAL_MAP_PIN`).
- File validation: MIME type verification, magic-byte inspection, max file size enforcement (15MB), sanitization of filenames.
- Coordinate range and polygon bounding check: Verify that coordinates fall inside the designated district/watershed boundary.

### FR-03: Evidence Consistency Engine (ECE)
- Automated comparison of:
  - Image GPS vs. Project boundary envelope.
  - Image elevation (GPS/DEM) vs. expected topographic position of the intervention (e.g. check dams in drainage depressions vs. contour bunds on slopes).
  - Stream distance check: Distance of drainage-line interventions (gully plugs, check dams, nala bunds) to the nearest stream channel vector.
  - Timestamp plausibility: Survey date vs. project sanction and completion dates.
- Neutral classification outputs:
  - `Consistent`
  - `Potential Inconsistency`
  - `Insufficient Information`
  - `Requires Field Verification`
  - `Manually Reviewed & Accepted`

### FR-04: Intervention Evidence Card (IEC)
- Unit of truth for every recorded intervention containing:
  - Unique Intervention ID & Project Association.
  - Intervention classification (Water harvesting, Soil conservation, Vegetative measure).
  - Geocoded photograph(s) with viewing angles and timestamps.
  - Spatial context: Stream order, catchment area, slope gradient.
  - Multi-temporal comparison (Pre-construction vs. Post-construction / Current state).
  - Evidence Quality Index (completeness, spatial precision, temporal recency).
  - Peer/Expert review status and formal reviewer comments.

### FR-05: Watershed Biophysical Indicators
- Modular indicators computed with transparent methodologies:
  - **Vegetation Condition**: Normalized Difference Vegetation Index (NDVI) seasonal min/max/mean.
  - **Surface Water Occurrence**: Water body area, dry-season persistence.
  - **Drainage Density & Bifurcation Ratio**: Structural hydrology parameters.
  - **Erosion Susceptibility**: Simplified terrain slope + vegetation protective factor screening.
- Strict data completeness rule: Display `"Insufficient data for this analysis"` with specific missing inputs whenever baseline raster or temporal intervals are absent.

### FR-06: Screening-Level Risk & Intervention Engine
- Rule-based screening for site suitability (Check dam suitability, Percolation tank suitability, Farm pond locations, Contour trenching).
- Explicit disclaimers on all outputs: *"Screening-level analysis based on regional terrain rules. Does not replace detailed geotechnical, structural, or land-tenure engineering surveys."*

### FR-07: Human-in-the-Loop Audit & Review Workflow
- Four-state verification life-cycle for every analytical inference:
  - `Preliminary` (Unverified automated ingestion)
  - `Needs Verification` (Flagged inconsistency or high-priority intervention)
  - `Reviewed` (Validated by field officer or GIS specialist)
  - `Rejected` (Invalid location, corrupted data, or falsified record)
- Immutable audit log with reviewer ID, timestamp, and justification.

### FR-08: Transparent Reporting & Export
- Dynamic synthesis reports: Micro-Watershed Summary, Project Monitoring Card, Evidence Audit Dossier.
- Formats: Print-optimized PDF/HTML, CSV tabular data, GeoJSON vector layers.
- Mandatory report sections: Data sources, methodology, limitations, timestamp, and verification signatures.

---

## 4. Non-Functional Requirements (NFR)

1. **Scientific Transparency & Credibility**:
   - Zero fabrication of satellite passes, spectral indices, or causal attributions.
   - Every analytical metric must document input datasets, resolution, date of acquisition, and methodology.
2. **Performance & Responsiveness**:
   - GIS map initial render under 1.5 seconds on broadband connections.
   - Vector GeoJSON tiling and cluster rendering capable of smoothly displaying 1,000+ intervention markers.
   - Image metadata parsing under 300ms per image.
3. **Security & Data Integrity**:
   - Password hashing with Argon2id / BCrypt.
   - JWT-based authentication with role claims.
   - SQL injection prevention via ORM parameterized queries.
   - Secure CORS, Content Security Policy (CSP), and input sanitization against XSS.
4. **Usability & Aesthetic Standard**:
   - Refined, modern, executive-grade UI (forest emerald, deep slate, clean card architecture, high-density telemetry, clear typographic hierarchy).
   - High accessibility: WCAG 2.1 AA compliant color contrasts, responsive design from 360px mobile viewports to 4K displays.
5. **Portability & Maintainability**:
   - 100% runnable without requiring external cloud accounts or paid proprietary GIS licenses.
   - Standards-compliant open formats: GeoJSON, EPSG:4326 (WGS84), standard EXIF metadata.
