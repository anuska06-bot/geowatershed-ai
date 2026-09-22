from datetime import datetime
import uuid
from sqlalchemy import Column, String, Float, Integer, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Watershed(Base):
    __tablename__ = "watersheds"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(50), unique=True, index=True, nullable=False)  # e.g., MH-WDC-042
    name = Column(String(150), nullable=False)                         # e.g., Karjat Micro-Watershed
    state = Column(String(100), nullable=False)                        # Maharashtra
    district = Column(String(100), nullable=False)                     # Ahmednagar
    block = Column(String(100), nullable=False)                        # Karjat
    basin = Column(String(100), nullable=False)                        # Godavari Basin / Bhima Sub-basin
    area_hectares = Column(Float, nullable=False)                      # 1420.0
    centroid_lat = Column(Float, nullable=False)                       # 18.9150
    centroid_lon = Column(Float, nullable=False)                       # 73.3280
    boundary_geojson = Column(JSON, nullable=False)                    # GeoJSON Polygon
    drainage_geojson = Column(JSON, nullable=False)                    # GeoJSON LineStrings with stream orders
    created_at = Column(DateTime, default=datetime.utcnow)

    projects = relationship("Project", back_populates="watershed", cascade="all, delete-orphan")
    interventions = relationship("Intervention", back_populates="watershed", cascade="all, delete-orphan")
    indicators = relationship("BiophysicalIndicator", back_populates="watershed", cascade="all, delete-orphan")
