# GeoWatershed AI: Implementation Roadmap & Quality Gates

```
+----------------------------------------------------------------------------------------------------+
|                                    GEOWATERSHED AI RELEASE ROADMAP                                 |
+----------------------------------------------------------------------------------------------------+
  PHASE 0: Requirements, Architecture & Research Benchmark (COMPLETED)
     │
  PHASE 1: High-Class UI Foundation & Application Shell (TARGET: Immediate)
     │       └── Quality Gate: Zero build warnings, responsive layout, dark/light theme, accessible shell
     ▼
  PHASE 2: Core GIS Engine & Geocoded Evidence Ingestion (INITIAL VERTICAL SLICE)
     │       └── Quality Gate: Real EXIF GPS extraction, Leaflet GeoJSON layers, Point-in-polygon tests
     ▼
  PHASE 3: Mobile Field Survey & Verification Workflow
     │       └── Quality Gate: GPS permission, offline draft persistence, manual coordinate fallback
     ▼
  PHASE 4: Computer Vision & Evidence Quality Engine
     │       └── Quality Gate: Laplacian blur detection, exposure metric, explainable review flags
     ▼
  PHASE 5: Evidence Consistency Engine (WIEOF Core) & Biophysical Analytics
     │       └── Quality Gate: Hydrologic stream proximity, Intervention Evidence Cards, no fake causation
     ▼
  PHASE 6: Project Management, Economic Calculator & Export Dossier
     │       └── Quality Gate: PDF/CSV report generation, interactive cost-benefit calculator, audit logs
     ▼
  PHASE 7: Hardening, Automated Test Suite & SIH Demonstration Package
             └── Quality Gate: 100% test pass rate, live 3-minute pitch scenario, zero security vulnerabilities
```

---

## 1. Phase-by-Phase Breakdown & Deliverables

### Phase 0: Requirements, Architecture & Planning (Current)
- [x] Environment inspection: Node v24, Python 3.12/3.14, uv available, Git available.
- [x] Create comprehensive specification docs:
  - `docs/requirements.md`
  - `docs/architecture.md`
  - `docs/innovation-analysis.md`
  - `docs/data-strategy.md`
  - `docs/roadmap.md`
- [x] Define Initial Vertical Slice and test strategy.

### Phase 1: UI Foundation & Executive Design System
- Deliverables:
  - React 19 + TypeScript + Vite frontend scaffolding.
  - Tailored Executive Palette: Deep forest slate (`#0b1e16`), emerald accents (`#10b981`), crisp borders (`#2d3748`), high readability sans-serif typography.
  - Core Navigation: Header, sidebar navigation, role switcher (Citizen, Field Officer, Project Manager, GIS Analyst).
  - Main Dashboard Shell with dynamic telemetry cards (Watershed Area, Verified Structures, Pending Reviews, Hydrologic Consistency Rate).
  - Responsive layout ensuring 100% fidelity on mobile devices.
- **Quality Gate**: Clean build (`npm run build`), no console errors, fully responsive design.

### Phase 2: Core GIS & Geocoded Data (Initial Vertical Slice Core)
- Deliverables:
  - Leaflet Map Explorer with custom vector styling.
  - Real Karjat Micro-Watershed GeoJSON datasets: Boundary polygon, 4th-order drainage network, water bodies, and intervention inventory.
  - Client & Backend image upload endpoint with genuine EXIF GPS extraction.
  - Manual map pin fallback with unambiguous `Coordinate Source` attribution.
  - Interactive marker clustering and layer toggle controls.
- **Quality Gate**: Upload sample geocoded image $\rightarrow$ EXIF coordinates parsed $\rightarrow$ Point mapped to exact coordinate $\rightarrow$ Boundary check passed.

### Phase 3: Field Survey & Mobile PWA Experience
- Deliverables:
  - Responsive Mobile Field Survey view with camera capture and photo upload.
  - Geolocation API integration with permission prompt and accuracy meter.
  - Intervention classification dropdown (Check Dam, Farm Pond, Contour Trench, Percolation Tank, Afforestation).
  - Physical condition logging (Siltation level, water level, structural condition).
  - LocalStorage draft queue with offline indicators and retry submission.
- **Quality Gate**: Field survey submission persists successfully and integrates into the main map explorer.

### Phase 4: Computer Vision & Evidence Quality Module
- Deliverables:
  - Backend image processing pipeline using OpenCV / Pillow.
  - Blur detection via Laplacian operator variance ($\sigma^2 < 100 \implies \text{Blurry}$).
  - Exposure evaluation (histogram under/over-exposure detection).
  - Modular image classifier contract with baseline feature extraction.
  - Four-state human review lifecycle: `Preliminary`, `Needs Verification`, `Reviewed`, `Rejected`.
- **Quality Gate**: Automated unit tests for blur detection and exposure analysis on clear vs. degraded images.

### Phase 5: Evidence Consistency Engine (WIEOF) & Biophysical Analytics
- Deliverables:
  - Hydrologic proximity algorithm: Compute perpendicular distance to nearest stream vector using Shapely.
  - Elevation plausibility check against expected topography.
  - **Intervention Evidence Card (IEC)** UI component showing before/after photos, stream distance, spatial coordinates, quality scores, and review logs.
  - Biophysical indicators panel (Seasonal vegetation vigor, surface water persistence) with strict missing-data warnings.
- **Quality Gate**: Correct classification of in-stream structures as `Consistent` vs off-stream structures ($>50\text{m}$) as `Potential Inconsistency / Requires Verification`.

### Phase 6: Projects, Economic Feasibility & Report Generation
- Deliverables:
  - Project management module with budget tracking, progress bars, and document repository.
  - Configurable Economic Feasibility Calculator: Models field survey costs, inspection travel savings, and monitoring payback with full sensitivity analysis.
  - Multi-format report export: Formatted HTML/PDF Dossier and CSV tabular data with tamper-resistant audit metadata.
- **Quality Gate**: Report renders all data sources, limitations, and verification disclaimers without omissions.

### Phase 7: System Hardening, Testing & SIH Presentation Preparation
- Deliverables:
  - End-to-end integration test suite (Vitest + Pytest).
  - Security review (CORS, file type validation, SQL injection prevention, rate limiting).
  - Comprehensive documentation files (`README.md`, `docs/installation.md`, `docs/api.md`, `docs/user-guide.md`).
  - SIH 2026 Presentation Kit: 3-minute pitch deck structure, judge Q&A script, and live demonstration checklist.
- **Quality Gate**: 100% automated test pass rate and clean deployment run.
