import logging
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.config import settings

logger = logging.getLogger("geowatershed.database")
logging.basicConfig(level=logging.INFO)

Base = declarative_base()

def get_engine():
    """
    Attempts to initialize PostgreSQL + PostGIS engine.
    If PostgreSQL server is not currently reachable, gracefully falls back
    to SQLite so that testing and development remain completely uninterrupted.
    """
    db_url = settings.DATABASE_URL
    try:
        engine = create_engine(
            db_url,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 1}
        )
        # Test connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            logger.info("Successfully connected to primary PostgreSQL database.")
            # Verify PostGIS extension if available
            try:
                result = conn.execute(text("SELECT PostGIS_Version();")).scalar()
                logger.info(f"PostGIS detected and active: version {result}")
            except Exception:
                logger.info("PostgreSQL connected (PostGIS extension will be initialized by Alembic).")
        return engine, "postgresql"
    except Exception as e:
        logger.warning(
            f"PostgreSQL server not reachable at {db_url} ({e}). "
            f"Falling back to local SQLite engine: {settings.SQLITE_FALLBACK_URL}"
        )
        sqlite_engine = create_engine(
            settings.SQLITE_FALLBACK_URL,
            connect_args={"check_same_thread": False}
        )
        return sqlite_engine, "sqlite"

engine, DB_DIALECT = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
