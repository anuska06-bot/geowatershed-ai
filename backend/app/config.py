import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "data" / "uploads"
EVIDENCE_DIR = UPLOAD_DIR / "evidence"

# Ensure upload directory exists
EVIDENCE_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseModel):
    PROJECT_NAME: str = "GeoWatershed AI"
    API_V1_STR: str = "/api/v1"
    
    # Database URL: Primary is PostgreSQL with PostGIS via psycopg driver
    # Fallback to local SQLite if PostgreSQL is not active
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://postgres:postgrespassword@localhost:5432/geowatershed"
    )
    SQLITE_FALLBACK_URL: str = f"sqlite:///{BASE_DIR / 'geowatershed.db'}"
    
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Upload settings
    MAX_UPLOAD_SIZE_BYTES: int = 15 * 1024 * 1024  # 15MB
    ALLOWED_IMAGE_MIMES: set[str] = {"image/jpeg", "image/png", "image/webp"}
    
    # GIS & Quality Thresholds
    STREAM_PROXIMITY_THRESHOLD_METERS: float = 50.0  # Max distance to consider on-stream
    BLUR_VARIANCE_THRESHOLD: float = 100.0          # Below this is considered blurry

    # SMTP Email Gateway Settings
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "noreply@geowatershed.gov.in")
    SMTP_FROM_NAME: str = os.getenv("SMTP_FROM_NAME", "GeoWatershed AI — WDC-PMKSY 2.0")
    SMTP_USE_TLS: bool = os.getenv("SMTP_USE_TLS", "true").lower() in ("true", "1", "yes")

    # SMS Gateway Settings (NIC / CDAC Mobile Seva / Fast2SMS / Simulated)
    SMS_GATEWAY_PROVIDER: str = os.getenv("SMS_GATEWAY_PROVIDER", "simulated")
    SMS_API_KEY: str = os.getenv("SMS_API_KEY", "")
    SMS_SENDER_ID: str = os.getenv("SMS_SENDER_ID", "WDCGOI")
    SMS_ENDPOINT_URL: str = os.getenv("SMS_ENDPOINT_URL", "")

settings = Settings()
