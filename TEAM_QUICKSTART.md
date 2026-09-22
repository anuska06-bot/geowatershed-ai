# GeoWatershed AI — Teammate Quickstart Guide
**Smart India Hackathon (SIH 2026) | Problem Statement PS 15**

Welcome to **GeoWatershed AI**! This package contains the full industrial-grade codebase, Docker PostgreSQL + PostGIS setup, real-time sensor/satellite telemetry datasets, and trained Machine Learning models.

---

## 🚀 Quick Setup (3 Simple Steps)

### Step 1: Start Docker Database (PostgreSQL 16 + PostGIS 3.4)
Make sure **Docker Desktop** is running, then in the project root folder run:
```bash
docker compose up -d
```
> **What this does:** Starts a container named `geowatershed_postgis` on port `5432` and automatically restores `database_dump.sql` containing all watershed geometries, interventions, and multi-source telemetry tables.

---

### Step 2: Start the Backend (FastAPI + AI Engine)
Open a terminal:
```bash
cd backend
# Using uv (fastest):
uv sync
uv run uvicorn app.main:app --reload --port 8000

# OR using standard pip:
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
* **Swagger Interactive Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **ML Real-Time Telemetry API:** [http://localhost:8000/api/v1/ml/model-info](http://localhost:8000/api/v1/ml/model-info)

---

### Step 3: Start the Frontend (React 19 + TypeScript + Leaflet)
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
* **Open the Web App in your browser:** [http://localhost:5173](http://localhost:5173)

---

## 🧠 Real-Time Telemetry & AI Retraining
To re-ingest CSV datasets and retrain the Machine Learning champion models at any time, run:
```bash
python train_and_attach.py
```
Or click the **"Sync Telemetry & Retrain"** button inside the **Telemetry & AI** tab of the web dashboard!

---

## 📂 Project Structure Overview
```text
├── backend/
│   ├── app/
│   │   ├── api/            # REST API endpoints (Watersheds, Evidence, ML, Reports, Economics)
│   │   ├── models/         # SQLAlchemy 2.0 ORM + PostGIS models
│   │   └── services/       # GIS Engine, AI Blur/EXIF, WIEOF Consistency, ML Training
│   ├── data/
│   │   ├── telemetry_csvs/ # Real-time CSVs (Dynamic World, CGWB Wells, IMD, HydroSHEDS)
│   │   └── models/         # Serialized ML pipelines (.joblib) & metrics
│   └── tests/              # 23 automated pytest test cases (100% passing)
├── frontend/
│   ├── src/
│   │   ├── components/     # Leaflet GIS, Before/After Slider, ML Simulator, PWA Survey
│   │   └── services/       # Typed Axios/Fetch API client
├── docs/                   # Full architectural designs & data strategies
├── docker-compose.yml      # PostGIS 3.4 container orchestrator
├── database_dump.sql       # Self-contained database export
└── train_and_attach.py     # Automated data ingestion & ML trainer
```
