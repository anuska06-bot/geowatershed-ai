import csv
import logging
from datetime import datetime
from pathlib import Path
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal, DB_DIALECT
from app.models.telemetry_models import (
    TelemetryDynamicWorld,
    TelemetryGroundwaterWell,
    TelemetryWeatherStation,
    TelemetryHydrologyBasin,
    TelemetryFieldIntervention,
    TelemetryFieldCVVerification,
    TelemetrySatelliteObservation,
    TelemetrySoilPedology,
    TelemetryTopographyDEM,
    TelemetryLiveSensorFeed,
)

logger = logging.getLogger("geowatershed.telemetry_db")
logging.basicConfig(level=logging.INFO)

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "telemetry_csvs"

def ingest_all_telemetry_csvs(db: Session = None):
    """
    Ingests all 5 real-time telemetry CSVs into Docker PostgreSQL (or fallback database).
    Idempotent: updates or skips existing records based on unique business keys.
    """
    should_close = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        should_close = True

    results = {}
    try:
        # 1. Dynamic World Land Cover
        dw_path = DATA_DIR / "dynamic_world_landcover.csv"
        if dw_path.exists():
            count = 0
            with open(dw_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    existing = db.query(TelemetryDynamicWorld).filter_by(pixel_id=row["pixel_id"]).first()
                    if not existing:
                        record = TelemetryDynamicWorld(
                            pixel_id=row["pixel_id"],
                            watershed_id=row["watershed_id"],
                            latitude=float(row["latitude"]),
                            longitude=float(row["longitude"]),
                            acquisition_date=datetime.strptime(row["acquisition_date"], "%Y-%m-%d").date(),
                            prob_water=float(row.get("prob_water", 0.0)),
                            prob_trees=float(row.get("prob_trees", 0.0)),
                            prob_grass=float(row.get("prob_grass", 0.0)),
                            prob_flooded_vegetation=float(row.get("prob_flooded_vegetation", 0.0)),
                            prob_crops=float(row.get("prob_crops", 0.0)),
                            prob_shrub_and_scrub=float(row.get("prob_shrub_and_scrub", 0.0)),
                            prob_built=float(row.get("prob_built", 0.0)),
                            prob_bare=float(row.get("prob_bare", 0.0)),
                            dominant_label=row["dominant_label"],
                            data_source=row.get("data_source", "Google Earth Engine Dynamic World")
                        )
                        db.add(record)
                        count += 1
            db.commit()
            results["dynamic_world"] = count
            logger.info(f"Ingested {count} new Dynamic World records into {DB_DIALECT}.")

        # 2. CGWB Groundwater Wells
        gw_path = DATA_DIR / "cgwb_groundwater_wells.csv"
        if gw_path.exists():
            count = 0
            with open(gw_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    existing = db.query(TelemetryGroundwaterWell).filter_by(well_id=row["well_id"]).first()
                    if not existing:
                        record = TelemetryGroundwaterWell(
                            well_id=row["well_id"],
                            watershed_id=row["watershed_id"],
                            district=row["district"],
                            state=row["state"],
                            latitude=float(row["latitude"]),
                            longitude=float(row["longitude"]),
                            well_type=row["well_type"],
                            aquifer_type=row["aquifer_type"],
                            measurement_date=datetime.strptime(row["measurement_date"], "%Y-%m-%d").date(),
                            depth_to_water_mbgl=float(row["depth_to_water_mbgl"]),
                            seasonal_fluctuation_m=float(row["seasonal_fluctuation_m"]),
                            recharge_zone_class=row["recharge_zone_class"],
                            data_source=row.get("data_source", "IN-GRES / CGWB Portal")
                        )
                        db.add(record)
                        count += 1
            db.commit()
            results["groundwater_wells"] = count
            logger.info(f"Ingested {count} new Groundwater records into {DB_DIALECT}.")

        # 3. IMD Weather Telemetry
        wx_path = DATA_DIR / "imd_weather_telemetry.csv"
        if wx_path.exists():
            count = 0
            with open(wx_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    existing = db.query(TelemetryWeatherStation).filter_by(station_id=row["station_id"]).first()
                    if not existing:
                        record = TelemetryWeatherStation(
                            station_id=row["station_id"],
                            station_name=row["station_name"],
                            district=row["district"],
                            state=row["state"],
                            latitude=float(row["latitude"]),
                            longitude=float(row["longitude"]),
                            elevation_m=float(row["elevation_m"]),
                            observation_date=datetime.strptime(row["observation_date"], "%Y-%m-%d").date(),
                            daily_rainfall_mm=float(row.get("daily_rainfall_mm", 0.0)),
                            max_temp_c=float(row["max_temp_c"]),
                            min_temp_c=float(row["min_temp_c"]),
                            evapotranspiration_mm=float(row["evapotranspiration_mm"]),
                            data_source=row.get("data_source", "India-WRIS Telemetry")
                        )
                        db.add(record)
                        count += 1
            db.commit()
            results["weather_stations"] = count
            logger.info(f"Ingested {count} new Weather Station records into {DB_DIALECT}.")

        # 4. HydroSHEDS Basins
        hy_path = DATA_DIR / "hydrosheds_basins.csv"
        if hy_path.exists():
            count = 0
            with open(hy_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    existing = db.query(TelemetryHydrologyBasin).filter_by(hybas_id=row["hybas_id"]).first()
                    if not existing:
                        record = TelemetryHydrologyBasin(
                            hybas_id=row["hybas_id"],
                            watershed_id=row["watershed_id"],
                            stream_order=int(row["stream_order"]),
                            catchment_area_sqkm=float(row["catchment_area_sqkm"]),
                            dis_m3_pyr=float(row["dis_m3_pyr"]),
                            run_mm_syr=float(row["run_mm_syr"]),
                            ari_ix_sav=float(row["ari_ix_sav"]),
                            smp_nz_s01=float(row["smp_nz_s01"]),
                            wet_pc_sg1=float(row["wet_pc_sg1"]),
                            data_source=row.get("data_source", "WWF HydroSHEDS / HydroATLAS v1.0")
                        )
                        db.add(record)
                        count += 1
            db.commit()
            results["hydrology_basins"] = count
            logger.info(f"Ingested {count} new Hydrology Basin records into {DB_DIALECT}.")

        # 5. Field Interventions Telemetry
        int_path = DATA_DIR / "field_interventions.csv"
        if int_path.exists():
            count = 0
            with open(int_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    existing = db.query(TelemetryFieldIntervention).filter_by(intervention_id=row["intervention_id"]).first()
                    if not existing:
                        record = TelemetryFieldIntervention(
                            intervention_id=row["intervention_id"],
                            project_id=row["project_id"],
                            user_id=row["user_id"],
                            latitude=float(row["latitude"]),
                            longitude=float(row["longitude"]),
                            coord_source=row.get("coord_source", "EXIF_GPS"),
                            timestamp_utc=row["timestamp_utc"],
                            exif_camera_model=row.get("exif_camera_model", "Unknown"),
                            category=row["category"],
                            observation_note=row.get("observation_note", ""),
                            validation_status=row.get("validation_status", "Pending"),
                            image_storage_ref=row.get("image_storage_ref", "")
                        )
                        db.add(record)
                        count += 1
            db.commit()
            results["field_interventions"] = count
            logger.info(f"Ingested {count} new Field Intervention records into {DB_DIALECT}.")

        # 6. Field CV Verification & Maintenance Dispatch
        cv_path = DATA_DIR / "field_cv_verification.csv"
        if cv_path.exists():
            count = 0
            with open(cv_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    existing = db.query(TelemetryFieldCVVerification).filter_by(sample_id=row["sample_id"]).first()
                    if not existing:
                        record = TelemetryFieldCVVerification(
                            sample_id=row["sample_id"],
                            intervention_id=row["intervention_id"],
                            img_detected_object=row["img_detected_object"],
                            model_confidence_score=float(row["model_confidence_score"]),
                            erosion_risk_level=row["erosion_risk_level"],
                            recharge_suitability_score=float(row["recharge_suitability_score"]),
                            recommended_intervention=row["recommended_intervention"],
                            expert_review_status=row.get("expert_review_status", "Reviewed")
                        )
                        db.add(record)
                        count += 1
            db.commit()
            results["field_cv_verification"] = count
            logger.info(f"Ingested {count} new Field CV records into {DB_DIALECT}.")

        # 7. Satellite Earth Observation (Sentinel-2 / Resourcesat-2)
        sat_path = DATA_DIR / "satellite_earth_observation.csv"
        if sat_path.exists():
            count = 0
            with open(sat_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    existing = db.query(TelemetrySatelliteObservation).filter_by(observation_id=row["observation_id"]).first()
                    if not existing:
                        record = TelemetrySatelliteObservation(
                            observation_id=row["observation_id"],
                            watershed_id=row["watershed_id"],
                            latitude=float(row["latitude"]),
                            longitude=float(row["longitude"]),
                            sensing_date=datetime.strptime(row["sensing_date"], "%Y-%m-%d").date(),
                            ndvi_value=float(row["ndvi_value"]),
                            ndwi_value=float(row["ndwi_value"]),
                            bsi_value=float(row["bsi_value"]),
                            cloud_cover_percent=float(row.get("cloud_cover_percent", 0.0)),
                            satellite_sensor=row.get("satellite_sensor", "Sentinel-2A")
                        )
                        db.add(record)
                        count += 1
            db.commit()
            results["satellite_observations"] = count
            logger.info(f"Ingested {count} new Satellite Observation records into {DB_DIALECT}.")

        # 8. Soil & Pedology (ICAR-NBSS&LUP)
        soil_path = DATA_DIR / "soil_pedology.csv"
        if soil_path.exists():
            count = 0
            with open(soil_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    existing = db.query(TelemetrySoilPedology).filter_by(env_zone_id=row["env_zone_id"]).first()
                    if not existing:
                        record = TelemetrySoilPedology(
                            env_zone_id=row["env_zone_id"],
                            watershed_id=row["watershed_id"],
                            soil_type=row["soil_type"],
                            soil_texture=row["soil_texture"],
                            depth_cm=float(row["depth_cm"]),
                            permeability_mm_hr=float(row["permeability_mm_hr"]),
                            annual_rainfall_mm=float(row["annual_rainfall_mm"]),
                            lulc_category=row["lulc_category"],
                            lulc_code=int(row["lulc_code"])
                        )
                        db.add(record)
                        count += 1
            db.commit()
            results["soil_pedology"] = count
            logger.info(f"Ingested {count} new Soil Pedology records into {DB_DIALECT}.")

        # 9. Topography & DEM (CartoDEM / SRTM)
        dem_path = DATA_DIR / "topography_dem.csv"
        if dem_path.exists():
            count = 0
            with open(dem_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    existing = db.query(TelemetryTopographyDEM).filter_by(location_id=row["location_id"]).first()
                    if not existing:
                        record = TelemetryTopographyDEM(
                            location_id=row["location_id"],
                            watershed_id=row["watershed_id"],
                            latitude=float(row["latitude"]),
                            longitude=float(row["longitude"]),
                            elevation_m=float(row["elevation_m"]),
                            slope_percent=float(row["slope_percent"]),
                            slope_class=row["slope_class"],
                            aspect_deg=float(row["aspect_deg"]),
                            topographic_wetness_index=float(row["topographic_wetness_index"]),
                            dem_source=row.get("dem_source", "CartoDEM_1ArcSec")
                        )
                        db.add(record)
                        count += 1
            db.commit()
            results["topography_dem"] = count
            logger.info(f"Ingested {count} new Topography DEM records into {DB_DIALECT}.")

        return results
    finally:
        if should_close:
            db.close()

def save_live_telemetry_readings(db: Session, readings: list[dict]):
    """
    Saves live real-time API telemetry feeds from Open-Meteo into Docker database.
    """
    for r in readings:
        feed = TelemetryLiveSensorFeed(
            watershed_code=r.get("code", "UNKNOWN"),
            watershed_name=r.get("name", "Unknown"),
            latitude=float(r.get("lat", 0.0)),
            longitude=float(r.get("lon", 0.0)),
            temperature_c=float(r.get("temperature_c", 25.0)),
            humidity_percent=float(r.get("humidity_percent", 50.0)),
            rain_mm=float(r.get("current_rain_mm", 0.0)),
            soil_moisture_0_1cm=float(r.get("soil_moisture_0_1cm_m3m3", 0.25)),
            soil_moisture_1_3cm=float(r.get("soil_moisture_1_3cm_m3m3", 0.27)),
            soil_moisture_3_9cm=float(r.get("soil_moisture_3_9cm_m3m3", 0.30)),
            evapotranspiration_mm=float(r.get("evapotranspiration_mm", 4.0)),
            telemetry_source=r.get("source", "Open-Meteo Global Hydro-Met API"),
            fetched_at=datetime.utcnow()
        )
        db.add(feed)
    db.commit()

if __name__ == "__main__":
    res = ingest_all_telemetry_csvs()
    print("Ingestion complete:", res)
