import {
  GeoCodedImageRecord,
  StructuredInterventionItem,
  ChangeDetectionRecord,
  AIInterventionRecommendationItem,
  DataMethodologySource
} from '../types';

// =========================================================================
// 1. GEO-CODED FIELD IMAGERY REGISTRY (SIH PS 26015 Primary Asset)
// =========================================================================
export const SAMPLE_GEO_CODED_IMAGES: GeoCodedImageRecord[] = [
  {
    id: 'geo-img-001',
    filename: 'karjat_checkdam_cd01_premonsoon.jpg',
    image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    latitude: 18.9125,
    longitude: 73.3278,
    elevation_meters: 142.5,
    captured_at: '2026-06-18T10:45:00Z',
    uploaded_at: '2026-06-18T14:22:10Z',
    coordinate_source: 'EXIF_GPS',
    intervention_type: 'Check Dam',
    observed_conditions: 'Masonry weir sound; minor sediment accumulation at upstream apron (approx 12% bed height). Bedrock anchoring intact.',
    confidence_score: 91.4,
    is_demo_analysis: true,
    quality_score: 94.0,
    file_sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    surveyor_notes: 'Inspected under WDC-PMKSY 2.0 pre-monsoon protocol. Good percolation observed in downstream dugwells.'
  },
  {
    id: 'geo-img-002',
    filename: 'karjat_farmpond_fp02_waterlevel.jpg',
    image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    latitude: 18.9060,
    longitude: 73.3370,
    elevation_meters: 128.0,
    captured_at: '2026-07-22T08:15:30Z',
    uploaded_at: '2026-07-22T11:05:44Z',
    coordinate_source: 'EXIF_GPS',
    intervention_type: 'Farm Pond',
    observed_conditions: 'Earthen embankment stabilized with vetiver grass; inlet silt trap functional; standing water depth approx 2.6m.',
    confidence_score: 88.7,
    is_demo_analysis: true,
    quality_score: 91.5,
    file_sha256: '3a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789abcdef0123',
    surveyor_notes: 'Beneficiary farmers utilizing micro-irrigation for rabi vegetable cultivation.'
  },
  {
    id: 'geo-img-003',
    filename: 'karjat_contourbund_cb03_ridge.jpg',
    image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    latitude: 18.9240,
    longitude: 73.3180,
    elevation_meters: 195.0,
    captured_at: '2026-08-04T15:30:12Z',
    uploaded_at: '2026-08-04T18:12:00Z',
    coordinate_source: 'EXIF_GPS',
    intervention_type: 'Contour Bund',
    observed_conditions: 'Continuous ridge bunding intact; moisture retention verified by post-monsoon grass cover along berm.',
    confidence_score: 86.2,
    is_demo_analysis: true,
    quality_score: 89.0,
    file_sha256: '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
    surveyor_notes: 'Slope gradient approx 8%. Bunding has arrested sheet wash along the upper catchment.'
  },
  {
    id: 'geo-img-004',
    filename: 'karjat_gully_erosion_er01.jpg',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    latitude: 18.9285,
    longitude: 73.3250,
    elevation_meters: 178.0,
    captured_at: '2026-08-14T09:40:00Z',
    uploaded_at: '2026-08-14T12:30:22Z',
    coordinate_source: 'EXIF_GPS',
    intervention_type: 'Erosion',
    observed_conditions: 'Active headward gully incision observed along 2nd-order feeder stream. Loose boulders and exposed subsoil.',
    confidence_score: 93.0,
    is_demo_analysis: true,
    quality_score: 92.0,
    file_sha256: '556677889900aabbccddeeff11223344556677889900aabbccddeeff11223344',
    surveyor_notes: 'Recommended for loose boulder check dam or gabion structure to arrest headward progression.'
  },
  {
    id: 'geo-img-005',
    filename: 'karjat_diversion_drain_dd01.jpg',
    image_url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
    latitude: 18.9180,
    longitude: 73.3120,
    elevation_meters: 165.0,
    captured_at: '2026-08-25T14:10:00Z',
    uploaded_at: '2026-08-25T16:55:00Z',
    coordinate_source: 'EXIF_GPS',
    intervention_type: 'Diversion Drain',
    observed_conditions: 'Diversion channel safely routing peak runoff from settlement edge towards community farm pond.',
    confidence_score: 87.5,
    is_demo_analysis: true,
    quality_score: 90.0,
    file_sha256: 'aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899',
    surveyor_notes: 'Energy dissipation rip-rap stable. No waterlogging reported in village abadi area.'
  }
];

// =========================================================================
// 2. STRUCTURED INTERVENTIONS REGISTRY (WDC-PMKSY 2.0 Works Register)
// =========================================================================
export const STRUCTURED_INTERVENTIONS_CATALOG: StructuredInterventionItem[] = [
  {
    id: 'int-karjat-01',
    code: 'CD-MH-042-01',
    name: 'Main Stem Masonry Check Dam CD-01',
    type: 'Check Dam',
    watershed_code: 'MH-WDC-042',
    watershed_name: 'Karjat Micro-Watershed',
    district: 'Raigad',
    state: 'Maharashtra',
    latitude: 18.9125,
    longitude: 73.3278,
    stream_order: 3,
    status: 'Operational',
    inspection_date: '2026-08-12',
    observed_condition: 'Good; minor sedimentation (12%); structure sound and functional',
    field_images_count: 5,
    satellite_evidence_status: 'Verified',
    ndvi_change_observed: '+0.19 (Moderate Vegetation Increase)',
    water_change_observed: '+1.4 ha standing water spread',
    priority: 'HIGH',
    description: 'Constructed across 3rd-order stream bed to harvest monsoon runoff and augment groundwater recharge for 45 ha command area.'
  },
  {
    id: 'int-karjat-02',
    code: 'FP-MH-042-02',
    name: 'Community Percolation Farm Pond FP-02',
    type: 'Farm Pond',
    watershed_code: 'MH-WDC-042',
    watershed_name: 'Karjat Micro-Watershed',
    district: 'Raigad',
    state: 'Maharashtra',
    latitude: 18.9060,
    longitude: 73.3370,
    stream_order: 4,
    status: 'Operational',
    inspection_date: '2026-08-15',
    observed_condition: 'Optimal water storage; vegetative bund lining healthy',
    field_images_count: 4,
    satellite_evidence_status: 'Verified',
    ndvi_change_observed: '+0.24 (High Vegetation Increase)',
    water_change_observed: '+2.8 ha water spread',
    priority: 'HIGH',
    description: 'Harvests excess runoff from foot-slopes; provides supplementary protective irrigation for rabi pulses and oilseeds.'
  },
  {
    id: 'int-karjat-03',
    code: 'CB-MH-042-03',
    name: 'Ridge Contour Bunding CB-03',
    type: 'Contour Bund',
    watershed_code: 'MH-WDC-042',
    watershed_name: 'Karjat Micro-Watershed',
    district: 'Raigad',
    state: 'Maharashtra',
    latitude: 18.9240,
    longitude: 73.3180,
    stream_order: 1,
    status: 'Operational',
    inspection_date: '2026-07-28',
    observed_condition: 'Intact; arrested topsoil erosion along upper 8% slope',
    field_images_count: 3,
    satellite_evidence_status: 'Consistent',
    ndvi_change_observed: '+0.15 (Mild Greenness Improvement)',
    water_change_observed: 'Soil Moisture Augmentation (+18%)',
    priority: 'MODERATE',
    description: 'Part of Ridge-to-Valley treatment to reduce runoff velocity and promote in-situ soil moisture retention.'
  },
  {
    id: 'int-karjat-04',
    code: 'GB-MH-042-04',
    name: 'Tributary Gabion Silt Trap GB-04',
    type: 'Drainage Structure',
    watershed_code: 'MH-WDC-042',
    watershed_name: 'Karjat Micro-Watershed',
    district: 'Raigad',
    state: 'Maharashtra',
    latitude: 18.9182,
    longitude: 73.3222,
    stream_order: 2,
    status: 'Inspection Due',
    inspection_date: '2026-05-10',
    observed_condition: 'Wire mesh intact; requires post-monsoon desiltation check',
    field_images_count: 2,
    satellite_evidence_status: 'Under Review',
    ndvi_change_observed: '+0.11',
    water_change_observed: '+0.5 ha retention',
    priority: 'HIGH',
    description: 'Flexible wire crate structure packed with field boulders, positioned at stream confluence to capture silt before reaching main reservoir.'
  },
  {
    id: 'int-karjat-05',
    code: 'DD-MH-042-05',
    name: 'Village Bypass Diversion Drain DD-05',
    type: 'Diversion Drain',
    watershed_code: 'MH-WDC-042',
    watershed_name: 'Karjat Micro-Watershed',
    district: 'Raigad',
    state: 'Maharashtra',
    latitude: 18.9180,
    longitude: 73.3120,
    stream_order: 2,
    status: 'Operational',
    inspection_date: '2026-08-20',
    observed_condition: 'Free flow; no blockage or silt choke detected',
    field_images_count: 3,
    satellite_evidence_status: 'Consistent',
    ndvi_change_observed: '+0.08',
    water_change_observed: 'Runoff Safely Routed',
    priority: 'MODERATE',
    description: 'Masonry trapezoidal channel safely diverting storm runoff around habitation clusters towards agricultural recharge zones.'
  }
];

// =========================================================================
// 3. WATERSHED CHANGE DETECTION DATA (Before vs After Multi-Spectral Audit)
// =========================================================================
export const WATERSHED_CHANGE_DETECTION_RECORDS: Record<string, ChangeDetectionRecord> = {
  'MH-WDC-042': {
    location_name: 'Karjat Micro-Watershed (Catchment Ridge & Main Stem)',
    watershed_code: 'MH-WDC-042',
    before_date: '2024-03-15 (Pre-Intervention Baseline)',
    after_date: '2026-03-20 (Post-Intervention Operational)',
    baseline_ndvi: 0.38,
    operational_ndvi: 0.58,
    ndvi_change_observed: 0.20,
    baseline_water_ha: 12.4,
    operational_water_ha: 19.8,
    water_change_observed_ha: 7.4,
    baseline_bare_soil_pct: 38.5,
    operational_bare_soil_pct: 21.2,
    scientific_observation: 'Satellite multi-spectral analysis indicates an observed increase of +0.20 mean NDVI across the treated agricultural sub-catchment. Surface water persistence expanded by +7.4 ha following installation of 3 check dams and 2 community ponds. (Observed vegetation and water changes are correlated with rainfall and treatment works; not claiming sole causal attribution).'
  },
  'RJ-WDC-108': {
    location_name: 'Alwar Arid Micro-Watershed (Johad Recharge Zone)',
    watershed_code: 'RJ-WDC-108',
    before_date: '2024-04-10 (Pre-Intervention Baseline)',
    after_date: '2026-04-12 (Post-Intervention Operational)',
    baseline_ndvi: 0.22,
    operational_ndvi: 0.41,
    ndvi_change_observed: 0.19,
    baseline_water_ha: 4.2,
    operational_water_ha: 9.6,
    water_change_observed_ha: 5.4,
    baseline_bare_soil_pct: 54.0,
    operational_bare_soil_pct: 35.8,
    scientific_observation: 'Observed vegetation index improvement (+0.19 NDVI) aligned with community Johad storage expansion. Prolonged post-monsoon soil moisture retention observed in 62 ha downstream command area.'
  },
  'MP-WDC-077': {
    location_name: 'Jhabua Tribal Watershed (Continuous Contour Trenches)',
    watershed_code: 'MP-WDC-077',
    before_date: '2024-02-20 (Pre-Intervention Baseline)',
    after_date: '2026-02-25 (Post-Intervention Operational)',
    baseline_ndvi: 0.31,
    operational_ndvi: 0.51,
    ndvi_change_observed: 0.20,
    baseline_water_ha: 8.5,
    operational_water_ha: 14.2,
    water_change_observed_ha: 5.7,
    baseline_bare_soil_pct: 42.0,
    operational_bare_soil_pct: 24.5,
    scientific_observation: 'Slope stabilization using staggered contour trenches has reduced surface sediment wash. Observed NDVI improved by +0.20 in agro-forestry pilot blocks.'
  }
};

// =========================================================================
// 4. AI-ASSISTED INTERVENTION RECOMMENDATIONS & SIZING
// =========================================================================
export const AI_INTERVENTION_RECOMMENDATIONS: AIInterventionRecommendationItem[] = [
  {
    id: 'rec-001',
    structure_type: 'Check Dam',
    target_lat: 18.9165,
    target_lon: 73.3245,
    stream_order: 3,
    priority: 'HIGH',
    confidence_score: 89.5,
    is_demo_confidence: true,
    hydrological_reason: 'High cumulative upstream drainage area (approx 420 ha) intersecting a 3rd-order stream bed with moderate bed slope (2.8%). Favorable bedrock footing detected for gravity check dam to retard runoff velocity and promote deep aquifer percolation.',
    recommended_materials: [
      {
        material: 'Random Rubble Stone Masonry with Cement Mortar 1:4',
        durability_years: 25,
        relative_cost: 'Moderate',
        suitability: 'Ideal for permanent structure on stable rock foundation; high hydraulic durability against monsoon peak discharge.'
      },
      {
        material: 'Wire Gabion with Local Boulder Packing',
        durability_years: 12,
        relative_cost: 'Low',
        suitability: 'Cost-effective alternative for upstream semi-consolidated beds; flexible to minor differential settlement.'
      }
    ],
    preliminary_cost: {
      quantity: 1,
      estimated_material_cost_inr: 285000,
      estimated_labour_cost_inr: 120000,
      estimated_transport_cost_inr: 35000,
      preliminary_total_inr: 440000,
      cost_disclaimer: 'Preliminary planning estimate derived from state schedule of rates (SoR). Subject to formal topographic total station survey and geotechnical cross-section verification.'
    },
    drainage_corridor: {
      start_point: [18.9180, 73.3230],
      end_point: [18.9150, 73.3260],
      estimated_length_meters: 420,
      flow_direction_deg: 135,
      reason: 'Natural D8 flow concentration path with steep valley sides requiring energy dissipation before confluence.',
      disclaimer: 'Preliminary planning recommendation — requires field survey and engineering validation.'
    }
  },
  {
    id: 'rec-002',
    structure_type: 'Farm Pond',
    target_lat: 18.9045,
    target_lon: 73.3340,
    stream_order: 2,
    priority: 'HIGH',
    confidence_score: 92.0,
    is_demo_confidence: true,
    hydrological_reason: 'Natural topographical depression receiving sheet runoff from 65 ha sub-basin. Clay-loam soil horizon provides favorable low-permeability sealing for prolonged surface water retention for protective irrigation.',
    recommended_materials: [
      {
        material: 'Compacted Earth Embankment with Vetiver Grass Turf Lining',
        durability_years: 15,
        relative_cost: 'Low',
        suitability: 'Utilizes local excavated clay soil; eco-friendly bio-engineering turfing prevents wave erosion.'
      },
      {
        material: '500-micron HDPE Geomembrane Lining (Optional if porous soil)',
        durability_years: 10,
        relative_cost: 'Moderate',
        suitability: 'Recommended only if test pits reveal sand or gravel lenses in the bed.'
      }
    ],
    preliminary_cost: {
      quantity: 1,
      estimated_material_cost_inr: 95000,
      estimated_labour_cost_inr: 75000,
      estimated_transport_cost_inr: 20000,
      preliminary_total_inr: 190000,
      cost_disclaimer: 'Preliminary estimates based on 30m x 30m x 3m standard WDC-PMKSY farm pond specifications.'
    }
  },
  {
    id: 'rec-003',
    structure_type: 'Contour Bund',
    target_lat: 18.9220,
    target_lon: 73.3150,
    stream_order: 1,
    priority: 'MODERATE',
    confidence_score: 87.0,
    is_demo_confidence: true,
    hydrological_reason: 'Upper catchment slope gradient between 5% and 8% prone to sheet erosion. Continuous contour bunding with waste weirs will intercept surface runoff, reduce rill formation, and conserve topsoil moisture.',
    recommended_materials: [
      {
        material: 'Earth Bund with Stone Pitching at Surplus Weirs',
        durability_years: 10,
        relative_cost: 'Low',
        suitability: 'High local community participation suitability; constructed using in-situ scraped soil.'
      }
    ],
    preliminary_cost: {
      quantity: 1200, // running meters
      estimated_material_cost_inr: 45000,
      estimated_labour_cost_inr: 95000,
      estimated_transport_cost_inr: 15000,
      preliminary_total_inr: 155000,
      cost_disclaimer: 'Calculated at standard rate of ₹129 per running meter of 0.5m² cross-section earthen bund.'
    }
  },
  {
    id: 'rec-004',
    structure_type: 'Diversion Drain',
    target_lat: 18.9195,
    target_lon: 73.3135,
    stream_order: 2,
    priority: 'MODERATE',
    confidence_score: 85.0,
    is_demo_confidence: true,
    hydrological_reason: 'Concentrated storm runoff from hill slopes currently enters village settlement. A trapezoidal diversion drain with mild bed slope (0.3%) will safely divert excess discharge away from buildings into farm ponds.',
    recommended_materials: [
      {
        material: 'Stone Pitching with Cement Grout Joints',
        durability_years: 20,
        relative_cost: 'Moderate',
        suitability: 'Protects against scouring at velocities between 1.5 - 2.5 m/s.'
      }
    ],
    preliminary_cost: {
      quantity: 350, // running meters
      estimated_material_cost_inr: 110000,
      estimated_labour_cost_inr: 65000,
      estimated_transport_cost_inr: 25000,
      preliminary_total_inr: 200000,
      cost_disclaimer: 'Preliminary planning recommendation — requires field survey and engineering validation.'
    }
  }
];

// =========================================================================
// 5. DATA & METHODOLOGY TRANSPARENCY CATALOG
// =========================================================================
export const DATA_METHODOLOGY_SOURCES: DataMethodologySource[] = [
  {
    dataset_name: 'CartoDEM 30m / Copernicus DEM',
    source_agency: 'ISRO Bhuvan & ESA Copernicus Open Access Hub',
    resolution: '30 meters spatial grid (sub-pixel hydro-enforced)',
    acquisition_date: 'Continuous multi-year archive (2020 - 2024)',
    processing_method: 'Sink filling via Wang & Liu algorithm; D8 single-flow direction matrix; Flow accumulation thresholding for Strahler stream orders (Orders 1 to 4).',
    category: 'REAL_DATA',
    description: 'Provides digital elevation, slope percent, aspect, and Topographic Wetness Index (TWI) foundational rasters.'
  },
  {
    dataset_name: 'Sentinel-2 L2A Multi-Spectral Surface Reflectance',
    source_agency: 'European Space Agency (ESA) Copernicus Program',
    resolution: '10m (Bands 2, 3, 4, 8) and 20m (Bands 11, 12)',
    acquisition_date: '10-day orbital revisit (Dry season & Post-monsoon windows)',
    processing_method: 'Atmospherically corrected bottom-of-atmosphere (BOA) reflectance; NDVI computed as (B8 - B4)/(B8 + B4); NDWI computed as (B3 - B8)/(B3 + B8).',
    category: 'API_DATA',
    description: 'Calibrated remote-sensing vegetation vigor and open water spread indicators for temporal before-and-after monitoring.'
  },
  {
    dataset_name: 'Open-Meteo High-Resolution Precipitation Telemetry',
    source_agency: 'ECMWF IFS / DWD ICON Ensemble via Open-Meteo API',
    resolution: '0.1° (~11 km spatial resolution), Hourly time-step',
    acquisition_date: 'Live API stream with 72-hour forecast projection',
    processing_method: 'Numerical weather prediction model assimilation; 24h rolling cumulative rainfall calculation; Cloudburst stress testing (20 - 120 mm/hr threshold).',
    category: 'API_DATA',
    description: 'Supplies real-time rainfall triggers and hydrologic runoff potential index across monitored basins.'
  },
  {
    dataset_name: 'In-Situ Field Survey Photography & GPS EXIF Telemetry',
    source_agency: 'WDC-PMKSY Watershed Development Team (WDT) & SLNA Field Surveyors',
    resolution: 'Sub-meter mobile camera sensor resolution with GPS metadata',
    acquisition_date: 'Real-time on-ground field inspections (2026)',
    processing_method: 'Automated EXIF extraction; Haversine distance geofence validation against stream orders; SHA-256 cryptographic hash seal for tamper-proofing.',
    category: 'REAL_DATA',
    description: 'Ground-truth evidence cards linked to specific intervention IDs for audit verification and outcome assessment.'
  },
  {
    dataset_name: 'SUTRA-AI Structure & Condition Classification Engine',
    source_agency: 'GeoWatershed AI Research & Demonstration Lab',
    resolution: 'Image feature classification across 11 watershed intervention & erosion classes',
    acquisition_date: 'Demonstration & Validation Prototype (SIH PS 26015)',
    processing_method: 'Computer-vision demonstration classifier matching texture, silt levels, and embankment profiles against training library.',
    category: 'DEMO_SYNTHETIC',
    description: 'AI-assisted demonstration analysis designed for preliminary field officer screening. Not a final civil engineering certification.'
  }
];
