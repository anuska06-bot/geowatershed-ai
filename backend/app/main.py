import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings, EVIDENCE_DIR
from app.database import engine, Base, SessionLocal
from app.services.seed_service import seed_pilot_data
from app.services.telemetry_db_service import ingest_all_telemetry_csvs
from app.api.watersheds_router import router as watersheds_router
from app.api.evidence_router import router as evidence_router
from app.api.reports_router import router as reports_router
from app.api.projects_router import router as projects_router
from app.api.analysis_router import router as analysis_router
from app.api.economics_router import router as economics_router
from app.api.audit_router import router as audit_router
from app.api.ml_router import router as ml_router
from app.api.auth_router import router as auth_router
from app.api.sutra_ai_router import router as sutra_ai_router


logger = logging.getLogger("geowatershed.main")
logging.basicConfig(level=logging.INFO)

def init_db():
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_pilot_data(db)
        ingest_all_telemetry_csvs(db)
    finally:
        db.close()

# Initialize immediately on import
init_db()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield
    logger.info("Shutting down GeoWatershed AI Gateway...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Application of Geospatial Techniques for Visualization and Analysis to Interpret Geo-Coded Images to Enhance Watershed Development Outcomes (SIH 2026 PS 15)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded evidence files
app.mount("/uploads/evidence", StaticFiles(directory=EVIDENCE_DIR), name="evidence")

# Include API Routers
app.include_router(watersheds_router, prefix=settings.API_V1_STR)
app.include_router(evidence_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(projects_router, prefix=settings.API_V1_STR)
app.include_router(analysis_router, prefix=settings.API_V1_STR)
app.include_router(economics_router, prefix=settings.API_V1_STR)
app.include_router(audit_router, prefix=settings.API_V1_STR)
app.include_router(ml_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(sutra_ai_router, prefix=settings.API_V1_STR)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "pilot_watershed": "MH-WDC-042 (Karjat)"
    }
