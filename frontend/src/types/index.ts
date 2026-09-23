export type UserRole = 'ROLE_CITIZEN' | 'ROLE_FIELD_OFFICER' | 'ROLE_MANAGER' | 'ROLE_ANALYST' | 'ROLE_ADMIN';

export interface AuthUser {
  identifier: string;
  name: string;
  role: UserRole;
  designation: string;
  department: string;
  jurisdiction: string;
  session_token: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: AuthUser;
}

export interface OtpRequestResponse {
  success: boolean;
  message: string;
  identifier: string;
  channel: 'email' | 'sms';
  expires_in_seconds: number;
  debug_otp?: string;
}

export interface WatershedSummary {
  id: string;
  code: string;
  name: string;
  state: string;
  district: string;
  block: string;
  basin: string;
  area_hectares: number;
  centroid_lat: number;
  centroid_lon: number;
}

export interface InterventionMarker {
  id: string;
  name: string;
  intervention_type: string;
  target_latitude: number;
  target_longitude: number;
  stream_order: number;
  status: string;
  evidence_count: number;
  latest_consistency_status?: 'Consistent' | 'Potential Inconsistency' | 'Requires Field Verification' | null;
  latest_review_status?: 'Preliminary' | 'Needs Verification' | 'Reviewed' | 'Rejected' | null;
}

export interface WatershedDetail extends WatershedSummary {
  boundary_geojson: any;
  drainage_geojson: any;
  interventions: InterventionMarker[];
}

export interface ImageQualityMetrics {
  blur_score: number;
  is_blurry: boolean;
  exposure_status: string;
  quality_score: number;
}

export interface ConsistencyEvaluation {
  is_inside_watershed: boolean;
  stream_distance_meters: number;
  elevation_delta_meters?: number | null;
  status: 'Consistent' | 'Potential Inconsistency' | 'Requires Field Verification' | 'Insufficient Information';
  reasons: string[];
}

export interface EvidenceCard {
  id: string;
  intervention_id: string;
  intervention_name: string;
  intervention_type: string;
  project_name: string;
  filename: string;
  image_url: string;
  thumbnail_url?: string;
  file_size_bytes: number;
  file_sha256: string;
  captured_latitude: number;
  captured_longitude: number;
  altitude_meters?: number | null;
  camera_bearing_deg?: number | null;
  coordinate_source: string;
  captured_at?: string;
  uploaded_at: string;
  quality: ImageQualityMetrics;
  consistency: ConsistencyEvaluation;
  surveyor_name: string;
  structure_condition: string;
  water_storage_level: string;
  notes?: string;
  review_status: 'Preliminary' | 'Needs Verification' | 'Reviewed' | 'Rejected';
  reviewer_name?: string;
  reviewer_notes?: string;
  reviewed_at?: string;
}

export interface DossierSummary {
  report_type: string;
  generated_at: string;
  watershed: {
    code: string;
    name: string;
    district: string;
    state: string;
    area_hectares: number;
  };
  telemetry: {
    total_interventions: number;
    total_field_photos_ingested: number;
    hydrologic_consistency_rate_pct: number;
    human_reviewed_count: number;
  };
  interventions: Array<{
    id: string;
    name: string;
    type: string;
    target_coordinates: [number, number];
    evidence_count: number;
    consistent_count: number;
    reviewed_count: number;
    status: string;
  }>;
  disclaimers: string[];
}

export interface DamRecord {
  id: string;
  name: string;
  basin: string;
  river: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  dam_type: string;
  capacity_mcm: number;
  current_water_level_pct: number;
  spillway_type: string;
  siltation_level_pct: number;
  flood_risk_score: number;
  nearest_bypass_corridor: string;
}

export interface CostEffectiveMaterial {
  material_name: string;
  cost_savings_vs_rcc: string;
  durability_years: number;
  application: string;
}

export interface FloodBypassPlan {
  watershed_code: string;
  data_status: 'REAL_SATELLITE_API' | 'CALIBRATED_SYNTHETIC_MODEL';
  flood_risk_level: 'HIGH' | 'MODERATE' | 'LOW';
  flood_risk_score: number;
  recommended_structure_type: string;
  drainage_bypass_design: {
    main_channel_capacity_m3s: number;
    bypass_channel_type: string;
    energy_dissipation_apron_length_m: number;
    side_wall_freeboard_m: number;
    shortest_bypass_route_km: number;
    alternate_safe_route_description: string;
  };
  cost_effective_materials: CostEffectiveMaterial[];
  engineering_execution_summary: string;
  estimated_cost_inr: number;
}

export interface FieldSurveySubmission {
  id: string;
  surveyor_name: string;
  surveyor_email: string;
  intervention_id: string;
  intervention_name: string;
  watershed_code: string;
  watershed_name: string;
  latitude: number;
  longitude: number;
  has_exif_gps: boolean;
  image_url: string;
  authenticity_status: 'VERIFIED_AUTHENTIC' | 'REJECTED_FAKE' | 'FLAGGED_UNVERIFIED';
  authenticity_details: string;
  structural_condition: string;
  water_storage_level: string;
  notes: string;
  drainage_action: string;
  estimated_cost_inr: number;
  submitted_at: string;
}
