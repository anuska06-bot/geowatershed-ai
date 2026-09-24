import React, { useState } from 'react';
import { WatershedDetail, EvidenceCard } from '../../types';
import { 
  SAMPLE_GEO_CODED_IMAGES, 
  STRUCTURED_INTERVENTIONS_CATALOG, 
  WATERSHED_CHANGE_DETECTION_RECORDS,
  AI_INTERVENTION_RECOMMENDATIONS 
} from '../../data/sihWatershedData';
import { 
  Layers, MapPin, Camera, ArrowRight, 
  CheckCircle2, TrendingUp, Mountain, ShieldAlert,
  Compass, FileText, ChevronRight, Sparkles, Sliders
} from 'lucide-react';

interface DashboardViewProps {
  watershed: WatershedDetail;
  evidenceList: EvidenceCard[];
  onNavigateTab: (tab: any) => void;
  onSelectIntervention: (id: string) => void;
  onOpenUpload: () => void;
  onOpenReport: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  watershed,
  evidenceList,
  onNavigateTab,
  onSelectIntervention,
  onOpenUpload,
  onOpenReport
}) => {
  const [selectedImage, setSelectedImage] = useState(SAMPLE_GEO_CODED_IMAGES[0]);

  // Aggregate stats
  const totalMonitoredArea = 2450.0; // hectares (Karjat micro-watershed)
  const totalInterventions = watershed.interventions?.length || STRUCTURED_INTERVENTIONS_CATALOG.length;
  const highPriorityCount = 3;
  const verifiedPhotosCount = SAMPLE_GEO_CODED_IMAGES.length + evidenceList.length;

  const changeRecord = WATERSHED_CHANGE_DETECTION_RECORDS[watershed.code] || WATERSHED_CHANGE_DETECTION_RECORDS['MH-WDC-042'];

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-100">
      
      {/* ========================================================================= */}
      {/* 1. TOP OPERATIONAL HERO & SITE SUMMARY BANNER                             */}
      {/* ========================================================================= */}
      <div className="bg-[#0B1F1A] border border-[#7DD3A7]/25 rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        {/* Subtle contour SVG */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dash-contour" width="200" height="200" patternUnits="userSpaceOnUse">
                <path d="M0,50 Q50,20 100,60 T200,40" fill="none" stroke="#7DD3A7" strokeWidth="0.8" />
                <path d="M0,100 Q60,130 120,90 T200,110" fill="none" stroke="#7DD3A7" strokeWidth="0.8" />
                <path d="M0,150 Q40,110 100,160 T200,140" fill="none" stroke="#7DD3A7" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dash-contour)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123C35] border border-[#7DD3A7]/30 text-[#7DD3A7] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span>GEOSPATIAL DECISION SUPPORT PLATFORM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              Watershed Development, Monitoring &amp; Outcome Assessment
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Interpreting geo-coded field photography, Sentinel-2 remote-sensing reflectance, and CartoDEM terrain models 
              to assess hydrological interventions under WDC-PMKSY 2.0.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('explorer')}
              className="px-4 py-2.5 rounded-lg bg-[#10b981] hover:bg-[#10b981]/90 text-[#0B1F1A] font-bold text-xs font-mono transition-all shadow-md flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore GIS Map</span>
            </button>

            <button
              onClick={onOpenReport}
              className="px-4 py-2.5 rounded-lg bg-[#123C35] hover:bg-[#123C35]/80 text-[#7DD3A7] border border-[#7DD3A7]/30 font-semibold text-xs font-mono transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Assessment Report</span>
            </button>
          </div>
        </div>

        {/* 4 Core Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-[#07130F] border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
              <span>MONITORED CATCHMENT</span>
              <Mountain className="w-3.5 h-3.5 text-[#7DD3A7]" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-white">
              {totalMonitoredArea.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ha</span>
            </div>
            <p className="text-[10px] text-slate-500 font-sans mt-0.5">{watershed.name} ({watershed.code})</p>
          </div>

          <div className="bg-[#07130F] border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
              <span>ACTIVE INTERVENTIONS</span>
              <Layers className="w-3.5 h-3.5 text-[#1677FF]" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-white">
              {totalInterventions} <span className="text-xs text-slate-400 font-normal">structures</span>
            </div>
            <p className="text-[10px] text-[#7DD3A7] font-sans mt-0.5">Check dams, ponds, bunds, drains</p>
          </div>

          <div className="bg-[#07130F] border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
              <span>GEO-CODED FIELD PHOTOS</span>
              <Camera className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-white">
              {verifiedPhotosCount} <span className="text-xs text-slate-400 font-normal">verified</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">EXIF GPS tagged &amp; SHA-256 sealed</p>
          </div>

          <div className="bg-[#07130F] border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
              <span>PRIORITY ATTENTION ZONES</span>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-rose-400">
              {highPriorityCount} <span className="text-xs text-slate-400 font-normal">sites</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">High erosion &amp; desiltation required</p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN SECTION: SITE SUMMARY + GIS MAP PREVIEW                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): Site Summary & Recent Field Images */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          {/* Site Summary Card */}
          <div className="bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#7DD3A7]" />
                <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
                  Site Summary &amp; Basin Vitals
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#123C35] text-[#7DD3A7] border border-[#7DD3A7]/30">
                WDC-PMKSY 2.0
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Watershed Name / Code:</span>
                <span className="font-semibold text-white font-mono">{watershed.name} ({watershed.code})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">District &amp; State:</span>
                <span className="font-semibold text-white">{watershed.district}, {watershed.state}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">River Basin:</span>
                <span className="font-semibold text-white">{watershed.basin}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Drainage Network:</span>
                <span className="font-semibold text-[#7DD3A7] font-mono">D8 Flow • Strahler Orders 1 to 4</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Soil &amp; Geology:</span>
                <span className="font-semibold text-slate-200">Basaltic Deccan Trap / Clay Loam</span>
              </div>
            </div>

            <div className="p-3 bg-[#07130F] border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Overall Watershed Health Score:</span>
                <span className="font-bold text-[#7DD3A7]">78.4 / 100 (Optimal)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#1677FF] to-[#10b981] rounded-full" style={{ width: '78.4%' }} />
              </div>
              <p className="text-[10px] text-slate-500 font-sans">
                Computed from stream bed stability, post-monsoon vegetation vigor (NDVI), and storage persistence.
              </p>
            </div>
          </div>

          {/* Recent Field Images Feed */}
          <div className="bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
                  Recent Geo-Coded Evidence
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('image-intelligence')}
                className="text-[11px] text-[#7DD3A7] hover:underline font-mono flex items-center gap-1"
              >
                <span>All Images</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_GEO_CODED_IMAGES.slice(0, 3).map((img) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer border transition-all aspect-video ${
                    selectedImage.id === img.id ? 'border-[#7DD3A7] ring-2 ring-[#7DD3A7]/30' : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <img src={img.image_url} alt={img.filename} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[9px] font-mono text-white truncate font-semibold">
                      {img.intervention_type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Image Detail Preview */}
            <div className="p-3 bg-[#07130F] border border-slate-800 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-white">{selectedImage.intervention_type}</span>
                <span className="text-amber-400">AI Conf: {selectedImage.confidence_score}%</span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-sans">
                {selectedImage.observed_conditions}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/80">
                <span>Lat {selectedImage.latitude.toFixed(4)}°, Lon {selectedImage.longitude.toFixed(4)}°</span>
                <span className="text-[#7DD3A7] font-semibold">EXIF Verified</span>
              </div>
            </div>

            <button
              onClick={onOpenUpload}
              className="w-full py-2 bg-[#123C35] hover:bg-[#123C35]/80 text-[#7DD3A7] border border-[#7DD3A7]/30 rounded-lg text-xs font-mono font-semibold transition flex items-center justify-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Upload New Field Evidence</span>
            </button>
          </div>
        </div>

        {/* Right Column (7 Cols): Interactive GIS Map Workstation Preview */}
        <div className="lg:col-span-7 bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
                  GIS Catchment &amp; Stream Network
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                CartoDEM 30m Digital Elevation Model with Strahler Stream Orders &amp; Field Intervention Siting
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('explorer')}
              className="px-3 py-1.5 rounded-lg bg-[#10b981] hover:bg-[#10b981]/90 text-[#0B1F1A] text-xs font-mono font-bold transition flex items-center gap-1 shrink-0"
            >
              <span>Full GIS Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Map Preview Container */}
          <div 
            onClick={() => onNavigateTab('explorer')}
            className="relative w-full h-[360px] sm:h-[420px] rounded-xl overflow-hidden border border-slate-800 cursor-pointer group shadow-inner bg-[#07130F]"
          >
            {/* Satellite Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(7, 19, 15, 0.35), rgba(7, 19, 15, 0.70)), url('/watershed-hero-hd.jpg')`
              }}
            />

            {/* Simulated Vector Stream Overlay */}
            <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="px-2.5 py-1 rounded bg-[#07130F]/90 backdrop-blur-md border border-[#7DD3A7]/40 text-[#7DD3A7] text-[10px] font-mono">
                  Active Basin: {watershed.name}
                </div>
                <div className="px-2.5 py-1 rounded bg-[#07130F]/90 backdrop-blur-md border border-slate-700 text-slate-300 text-[10px] font-mono">
                  14 Intervention Sites
                </div>
              </div>

              {/* Pin markers preview */}
              <div className="space-y-2 max-w-xs bg-[#07130F]/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] font-mono font-bold text-[#7DD3A7] uppercase tracking-wider block">
                  Click to open Interactive GIS
                </span>
                <p className="text-[11px] text-slate-300 leading-snug font-sans">
                  Toggle D8 stream orders, watershed boundaries, elevation contours, and geo-coded camera markers with full layer controls.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Layer Status Toggles preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#7DD3A7]" />
              <span>Boundary (2,450 ha)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1677FF]" />
              <span>D8 Drainage Network</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Field Photo Geotags</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sentinel-2 NDVI Layer</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. AI-ASSISTED WATERSHED RECOMMENDATIONS PREVIEW                          */}
      {/* ========================================================================= */}
      <div className="bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7DD3A7]" />
              <h3 className="font-bold text-base text-white font-mono uppercase tracking-wide">
                AI-Assisted Watershed Recommendations
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Preliminary multi-criteria siting recommendations based on D8 flow accumulation, slope percent, and soil permeability.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('recommendations')}
            className="px-3.5 py-1.5 rounded-lg bg-[#123C35] hover:bg-[#123C35]/80 text-[#7DD3A7] border border-[#7DD3A7]/30 text-xs font-mono font-semibold transition flex items-center gap-1.5 shrink-0"
          >
            <span>View Siting &amp; Cost Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AI_INTERVENTION_RECOMMENDATIONS.slice(0, 3).map((rec) => (
            <div
              key={rec.id}
              className="bg-[#07130F] border border-slate-800/80 rounded-xl p-4 space-y-3 flex flex-col justify-between hover:border-[#7DD3A7]/40 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white font-mono">{rec.structure_type}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    rec.priority === 'HIGH' ? 'bg-rose-950/80 text-rose-300 border border-rose-800' : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                  }`}>
                    {rec.priority} PRIORITY
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                  {rec.hydrological_reason}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Stream Order:</span>
                  <span className="text-white font-semibold">{rec.stream_order}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Preliminary Cost:</span>
                  <span className="text-[#7DD3A7] font-bold">₹{(rec.preliminary_cost.preliminary_total_inr / 100000).toFixed(2)} Lakh</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CHANGE DETECTION PREVIEW (Before -> After)                             */}
      {/* ========================================================================= */}
      <div className="bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#1677FF]" />
              <h3 className="font-bold text-base text-white font-mono uppercase tracking-wide">
                Watershed Change Detection (Multi-Spectral Audit)
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Sentinel-2 NDVI vegetation index &amp; NDWI water persistence comparing pre-intervention baseline against current operational status.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('change-detection')}
            className="px-3.5 py-1.5 rounded-lg bg-[#123C35] hover:bg-[#123C35]/80 text-[#7DD3A7] border border-[#7DD3A7]/30 text-xs font-mono font-semibold transition flex items-center gap-1.5 shrink-0"
          >
            <span>Interactive Comparison Slider</span>
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Metric 1: Vegetation Health (NDVI) */}
          <div className="bg-[#07130F] border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>VEGETATION VIGOR (NDVI)</span>
              <span className="text-[#7DD3A7] font-bold">+{changeRecord.ndvi_change_observed.toFixed(2)}</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">BEFORE (2024)</span>
                <span className="text-base font-bold font-mono text-slate-300">{changeRecord.baseline_ndvi.toFixed(2)}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#7DD3A7]" />
              <div className="text-right">
                <span className="text-[10px] text-[#7DD3A7] font-mono block">AFTER (2026)</span>
                <span className="text-base font-bold font-mono text-white">{changeRecord.operational_ndvi.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-sans leading-relaxed pt-1">
              Observed increase in green canopy coverage across the treated command area.
            </p>
          </div>

          {/* Metric 2: Surface Water Area */}
          <div className="bg-[#07130F] border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>WATER BODY AREA (NDWI)</span>
              <span className="text-[#1677FF] font-bold">+{changeRecord.water_change_observed_ha.toFixed(1)} ha</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">BEFORE (2024)</span>
                <span className="text-base font-bold font-mono text-slate-300">{changeRecord.baseline_water_ha.toFixed(1)} ha</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#1677FF]" />
              <div className="text-right">
                <span className="text-[10px] text-[#1677FF] font-mono block">AFTER (2026)</span>
                <span className="text-base font-bold font-mono text-white">{changeRecord.operational_water_ha.toFixed(1)} ha</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-sans leading-relaxed pt-1">
              Surface water persistence expanded following installation of check dams and farm ponds.
            </p>
          </div>

          {/* Metric 3: Bare Soil Reduction */}
          <div className="bg-[#07130F] border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>BARE SOIL REDUCTION</span>
              <span className="text-amber-400 font-bold">-{(changeRecord.baseline_bare_soil_pct - changeRecord.operational_bare_soil_pct).toFixed(1)}%</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">BEFORE (2024)</span>
                <span className="text-base font-bold font-mono text-slate-300">{changeRecord.baseline_bare_soil_pct.toFixed(1)}%</span>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <div className="text-right">
                <span className="text-[10px] text-amber-300 font-mono block">AFTER (2026)</span>
                <span className="text-base font-bold font-mono text-white">{changeRecord.operational_bare_soil_pct.toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-sans leading-relaxed pt-1">
              Reduction in uncultivated/exposed subsoil indicating successful contour bunding &amp; vegetative stabilization.
            </p>
          </div>
        </div>

        <div className="p-3 bg-[#07130F] border border-slate-800 rounded-xl text-[11px] text-slate-400 font-sans leading-relaxed">
          <span className="font-semibold text-white">Scientific Attribution Note:</span> {changeRecord.scientific_observation}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. INTERVENTION STATUS SUMMARY TABLE                                      */}
      {/* ========================================================================= */}
      <div className="bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#7DD3A7]" />
            <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
              Intervention Status &amp; Compliance Register
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('interventions')}
            className="text-xs text-[#7DD3A7] hover:underline font-mono flex items-center gap-1"
          >
            <span>Full Works Inventory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#07130F] border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                <th className="py-2.5 px-3">Structure Name &amp; Code</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Stream Order</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Last Inspected</th>
                <th className="py-2.5 px-3">Satellite Evidence</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans text-xs">
              {STRUCTURED_INTERVENTIONS_CATALOG.map((item) => (
                <tr key={item.id} className="hover:bg-[#123C35]/20 transition">
                  <td className="py-3 px-3">
                    <span className="font-bold text-white block">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{item.code}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{item.type}</td>
                  <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">Order {item.stream_order}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      item.status === 'Operational' ? 'bg-[#123C35] text-[#7DD3A7] border border-[#7DD3A7]/30' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{item.inspection_date}</td>
                  <td className="py-3 px-3">
                    <span className="text-[#7DD3A7] font-mono text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#7DD3A7]" />
                      {item.satellite_evidence_status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        onSelectIntervention(item.id);
                        onNavigateTab('interventions');
                      }}
                      className="px-2.5 py-1 rounded bg-[#123C35] hover:bg-[#123C35]/80 text-[#7DD3A7] text-[11px] font-mono transition"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
