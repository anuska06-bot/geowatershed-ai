from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text, ForeignKey
from app.database import Base

class TelemetryDynamicWorld(Base):
    __tablename__ = "telemetry_dynamic_world"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    pixel_id = Column(String(50), unique=True, index=True, nullable=False)
    watershed_id = Column(String(50), index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    acquisition_date = Column(Date, nullable=False)
    prob_water = Column(Float, default=0.0)
    prob_trees = Column(Float, default=0.0)
    prob_grass = Column(Float, default=0.0)
    prob_flooded_vegetation = Column(Float, default=0.0)
    prob_crops = Column(Float, default=0.0)
    prob_shrub_and_scrub = Column(Float, default=0.0)
    prob_built = Column(Float, default=0.0)
    prob_bare = Column(Float, default=0.0)
    dominant_label = Column(String(50), nullable=False)
    data_source = Column(String(100), default="Google Earth Engine Dynamic World")
    created_at = Column(DateTime, default=datetime.utcnow)

class TelemetryGroundwaterWell(Base):
    __tablename__ = "telemetry_groundwater_wells"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    well_id = Column(String(50), unique=True, index=True, nullable=False)
    watershed_id = Column(String(50), index=True, nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    well_type = Column(String(50), nullable=False)
    aquifer_type = Column(String(100), nullable=False)
    measurement_date = Column(Date, nullable=False)
    depth_to_water_mbgl = Column(Float, nullable=False)
    seasonal_fluctuation_m = Column(Float, nullable=False)
    recharge_zone_class = Column(String(100), nullable=False)
    data_source = Column(String(100), default="IN-GRES / CGWB Portal")
    created_at = Column(DateTime, default=datetime.utcnow)

class TelemetryWeatherStation(Base):
    __tablename__ = "telemetry_weather_stations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    station_id = Column(String(50), unique=True, index=True, nullable=False)
    station_name = Column(String(150), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_m = Column(Float, nullable=False)
    observation_date = Column(Date, nullable=False)
    daily_rainfall_mm = Column(Float, default=0.0)
    max_temp_c = Column(Float, nullable=False)
    min_temp_c = Column(Float, nullable=False)
    evapotranspiration_mm = Column(Float, nullable=False)
    data_source = Column(String(100), default="India-WRIS Telemetry")
    created_at = Column(DateTime, default=datetime.utcnow)

class TelemetryHydrologyBasin(Base):
    __tablename__ = "telemetry_hydrology_basins"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    hybas_id = Column(String(50), unique=True, index=True, nullable=False)
    watershed_id = Column(String(50), index=True, nullable=False)
    stream_order = Column(Integer, nullable=False)
    catchment_area_sqkm = Column(Float, nullable=False)
    dis_m3_pyr = Column(Float, nullable=False)
    run_mm_syr = Column(Float, nullable=False)
    ari_ix_sav = Column(Float, nullable=False)
    smp_nz_s01 = Column(Float, nullable=False)
    wet_pc_sg1 = Column(Float, nullable=False)
    data_source = Column(String(100), default="WWF HydroSHEDS / HydroATLAS v1.0")
    created_at = Column(DateTime, default=datetime.utcnow)

class TelemetryFieldIntervention(Base):
    __tablename__ = "telemetry_field_interventions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    intervention_id = Column(String(50), unique=True, index=True, nullable=False)
    project_id = Column(String(50), index=True, nullable=False)
    user_id = Column(String(50), index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    coord_source = Column(String(50), default="EXIF_GPS")
    timestamp_utc = Column(String(50), nullable=False)
    exif_camera_model = Column(String(100), nullable=True)
    category = Column(String(100), nullable=False)
    observation_note = Column(Text, nullable=True)
    validation_status = Column(String(50), default="Pending")
    image_storage_ref = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TelemetryFieldCVVerification(Base):
    __tablename__ = "telemetry_field_cv_verification"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sample_id = Column(String(50), unique=True, index=True, nullable=False)
    intervention_id = Column(String(50), index=True, nullable=False)
    img_detected_object = Column(String(100), nullable=False)
    model_confidence_score = Column(Float, nullable=False)
    erosion_risk_level = Column(String(50), nullable=False)
    recharge_suitability_score = Column(Float, nullable=False)
    recommended_intervention = Column(String(150), nullable=False)
    expert_review_status = Column(String(50), default="Reviewed")
    created_at = Column(DateTime, default=datetime.utcnow)

class TelemetrySatelliteObservation(Base):
    __tablename__ = "telemetry_satellite_observations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    observation_id = Column(String(50), unique=True, index=True, nullable=False)
    watershed_id = Column(String(50), index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    sensing_date = Column(Date, nullable=False)
    ndvi_value = Column(Float, nullable=False)
    ndwi_value = Column(Float, nullable=False)
    bsi_value = Column(Float, nullable=False)
    cloud_cover_percent = Column(Float, default=0.0)
    satellite_sensor = Column(String(100), default="Sentinel-2A")
    created_at = Column(DateTime, default=datetime.utcnow)

class TelemetrySoilPedology(Base):
    __tablename__ = "telemetry_soil_pedology"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    env_zone_id = Column(String(50), unique=True, index=True, nullable=False)
    watershed_id = Column(String(50), index=True, nullable=False)
    soil_type = Column(String(100), nullable=False)
    soil_texture = Column(String(100), nullable=False)
    depth_cm = Column(Float, nullable=False)
    permeability_mm_hr = Column(Float, nullable=False)
    annual_rainfall_mm = Column(Float, nullable=False)
    lulc_category = Column(String(100), nullable=False)
    lulc_code = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class TelemetryTopographyDEM(Base):
    __tablename__ = "telemetry_topography_dem"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    location_id = Column(String(50), unique=True, index=True, nullable=False)
    watershed_id = Column(String(50), index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_m = Column(Float, nullable=False)
    slope_percent = Column(Float, nullable=False)
    slope_class = Column(String(100), nullable=False)
    aspect_deg = Column(Float, nullable=False)
    topographic_wetness_index = Column(Float, nullable=False)
    dem_source = Column(String(100), default="CartoDEM_1ArcSec")
    created_at = Column(DateTime, default=datetime.utcnow)

class TelemetryLiveSensorFeed(Base):
    __tablename__ = "telemetry_live_sensor_feeds"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    watershed_code = Column(String(50), index=True, nullable=False)
    watershed_name = Column(String(150), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    temperature_c = Column(Float, nullable=False)
    humidity_percent = Column(Float, nullable=False)
    rain_mm = Column(Float, default=0.0)
    soil_moisture_0_1cm = Column(Float, nullable=False)
    soil_moisture_1_3cm = Column(Float, nullable=False)
    soil_moisture_3_9cm = Column(Float, nullable=False)
    evapotranspiration_mm = Column(Float, nullable=False)
    telemetry_source = Column(String(150), default="Open-Meteo Global Hydro-Met API")
    fetched_at = Column(DateTime, default=datetime.utcnow)

