# GeoWatershed AI

> **"Transforming Geospatial Data into Smarter Watershed Development."**  
> *Developed for Smart India Hackathon 2026 — Problem Statement PS 15*

---

## 🌍 Problem Context (SIH PS 15)
**"Application of Geospatial Techniques for Visualization and Analysis to Interpret Geo-Coded Images to Enhance Watershed Development Outcomes."**

GeoWatershed AI replaces passive photo repositories with **Intervention-to-Outcome Evidence Intelligence** via the **Watershed Intervention Evidence and Outcome Framework (WIEOF)**:
1. **EXIF GPS & Azimuth Extraction**: Real hardware telemetry extraction from field photographs.
2. **Laplacian Blur Variance ($\sigma^2$)**: Edge-frequency evaluation ensuring photographs are sharp enough to assess spillways, silt, and masonry structures.
3. **Hydrologic Stream Proximity Engine**: Computes exact perpendicular distance from field coordinates to the nearest stream channel vector using Shapely. If a check dam is $>50\text{m}$ from the stream channel, it flags a `Potential Inconsistency`.
4. **Intervention Evidence Card (IEC)**: An executive evidence dossier displaying photo telemetry, Laplacian blur score, stream proximity metric, reason trace, and human review status.
5. **Expert Review Audit Trail**: A four-state verification lifecycle (`Preliminary`, `Needs Verification`, `Reviewed`, `Rejected`).
6. **No-Fake-Causation Biophysical Panel**: Declares seasonal NDVI and NDWI water spread trends with explicit attribution disclaimers — never falsely claiming correlation as causation without control catchments.

---

## 🏛 Approved System Architecture
```
PostgreSQL 16 + PostGIS 3.4
        ↓
SQLAlchemy 2.0 + Alembic (GeoAlchemy2)
        ↓
FastAPI Application Gateway (Python 3.12)
        ↓
React 18/19 + Leaflet GIS Frontend (Tailwind CSS)
```

---

## 🚀 Quickstart Guide

### 1. Backend Setup & Automated Tests
The backend uses `uv` for fast, deterministic Python environment management.

```bash
cd backend

# Run the full automated test suite (14/14 tests)
uv run pytest tests/ -v

# Start the FastAPI development server
uv run uvicorn app.main:app --reload --port 8000
```
- Interactive API Documentation (Swagger): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health Check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

### 2. Frontend Setup
The frontend uses Vite, React, TypeScript, Leaflet, and Tailwind CSS.

```bash
cd frontend

# Run production build check
npm run build

# Start the frontend development server
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)

### 3. Optional PostgreSQL + PostGIS Docker Instance
```bash
docker compose up -d
```
When running, the application connects directly to PostgreSQL + PostGIS. If PostgreSQL is not active, it gracefully falls back to local SQLite so development and testing remain completely uninterrupted.

---

## 📁 Repository Structure
```
├── docs/                        # Complete Phase 0 documentation & specifications
│   ├── requirements.md          # Personas, functional & non-functional requirements
│   ├── architecture.md          # System architecture, data flow & modular design
│   ├── database.md              # Database schemas, PostGIS types & indexing
│   ├── innovation-analysis.md   # Benchmark vs Bhuvan-Srishti/Drishti & WIEOF novelty
│   ├── data-strategy.md         # Modes A, B, C & calibrated pilot watershed schemas
│   └── roadmap.md               # Phase roadmap & quality gates
├── backend/                     # FastAPI Backend (Python 3.12)
│   ├── app/
│   │   ├── api/                 # API route handlers (watersheds, evidence, reports)
│   │   ├── models/              # SQLAlchemy 2.0 ORM models
│   │   ├── schemas/             # Pydantic v2 schemas
│   │   ├── services/            # GIS, AI/CV, Consistency Engine, and Seed services
│   │   ├── data/                # Reference pilot watershed (MH-WDC-042 Karjat)
│   │   ├── database.py          # Dual-mode DB connection (Postgres+PostGIS / SQLite)
│   │   └── main.py              # Application entrypoint & static mounting
│   ├── tests/                   # 14 Pytest automated test suites
│   ├── alembic/                 # Database migrations with PostGIS support
│   └── pyproject.toml           # uv project configuration
├── frontend/                    # React + TypeScript + Leaflet SPA
│   ├── src/
│   │   ├── components/gis/      # Interactive Leaflet map with Strahler stream orders
│   │   ├── components/evidence/ # Intervention Evidence Card & Upload modals
│   │   ├── components/analytics/# Recharts seasonal vegetation & water dynamics
│   │   ├── components/reports/  # Official Evidence Dossier & print export
│   │   └── App.tsx              # Master dashboard shell
│   └── package.json
└── docker-compose.yml           # PostgreSQL 16 + PostGIS 3.4 container service
```
