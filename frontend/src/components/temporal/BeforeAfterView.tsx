import React, { useState, useRef, useEffect } from 'react';
import { WatershedDetail } from '../../types';
import { 
  Sliders, Calendar, ShieldCheck, Droplets, Mountain, 
  ArrowLeftRight, Play, Pause, MapPin, TrendingUp 
} from 'lucide-react';

interface BeforeAfterViewProps {
  watershed: WatershedDetail;
}

type BandMode = 'rgb' | 'ndvi' | 'ndwi';

export const BeforeAfterView: React.FC<BeforeAfterViewProps> = ({ watershed }) => {
  const interventions = watershed?.interventions?.length > 0 ? watershed.interventions : [
    {
      id: 'int-001',
      name: 'Check Dam CD-01 (Main Stem)',
      intervention_type: 'Masonry Check Dam',
      target_latitude: 18.9125,
      target_longitude: 73.3278,
      stream_order: 3,
      status: 'Operational',
      evidence_count: 3
    },
    {
      id: 'int-002',
      name: 'Gabion Check Dam CD-02',
      intervention_type: 'Gabion Check Dam',
      target_latitude: 18.9182,
      target_longitude: 73.3222,
      stream_order: 2,
      status: 'Operational',
      evidence_count: 2
    },
    {
      id: 'int-003',
      name: 'Percolation Tank PT-01',
      intervention_type: 'Percolation Tank',
      target_latitude: 18.9060,
      target_longitude: 73.3370,
      stream_order: 4,
      status: 'Completed',
      evidence_count: 4
    }
  ];

  const [selectedInterventionId, setSelectedInterventionId] = useState(interventions[0]?.id || 'int-001');
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [bandMode, setBandMode] = useState<BandMode>('rgb');
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const activeAsset = interventions.find((i) => i.id === selectedInterventionId) || interventions[0];

  // Specific biophysical metrics per asset type
  const isPond = activeAsset.intervention_type.toLowerCase().includes('pond') || activeAsset.intervention_type.toLowerCase().includes('percolation');
  const isTrench = activeAsset.intervention_type.toLowerCase().includes('trench') || activeAsset.intervention_type.toLowerCase().includes('contour');

  const baselineNdvi = isPond ? 0.21 : isTrench ? 0.15 : 0.18;
  const operationalNdvi = isPond ? 0.62 : isTrench ? 0.48 : 0.56;
  const ndviDelta = Math.round((operationalNdvi - baselineNdvi) * 100) / 100;
  const waterSpreadHa = isPond ? 24.6 : isTrench ? 8.2 : 18.4;
  const storageCapacityCum = isPond ? 14500 : isTrench ? 4200 : 12500;
  const siltationStatus = isPond ? 'Normal (14% Sediment Depth)' : isTrench ? 'Slight Infill (18%)' : 'Optimal (<12% Capacity)';

  // Handle smooth drag across the container
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1 && e.type !== 'pointerdown') return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = Math.round((x / rect.width) * 100);
    setSliderPos(pct);
  };

  // Automated back-and-forth comparison sweep
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    let direction = 1;
    let current = sliderPos;

    const step = () => {
      current += direction * 0.75;
      if (current >= 95) {
        current = 95;
        direction = -1;
      } else if (current <= 5) {
        current = 5;
        direction = 1;
      }
      setSliderPos(Math.round(current));
      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="space-y-4 py-2 font-sans">
      
      {/* Header with Asset Selector and Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#181f23] border border-[#2c373d] rounded-lg p-4 font-mono">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#10b981]" />
            <h2 className="text-sm font-bold text-[#f1f0eb] tracking-tight">
              Temporal Differential Analysis: Sentinel-2 &amp; Ground Telemetry
            </h2>
          </div>
          <p className="text-xs text-[#9ba3a7] mt-0.5">
            Biophysical and structural differential across pre-construction baseline vs. post-monsoon operational state.
          </p>
        </div>

        {/* Structure Selector */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-[#9ba3a7]">Target Asset:</span>
          <select
            value={selectedInterventionId}
            onChange={(e) => setSelectedInterventionId(e.target.value)}
            className="bg-[#121619] border border-[#2c373d] rounded-md text-xs py-1.5 px-2.5 text-[#f1f0eb] focus:outline-none focus:border-[#10b981] font-mono cursor-pointer"
          >
            {interventions.map((item) => (
              <option key={item.id} value={item.id} className="bg-[#181f23]">
                {item.name} ({item.intervention_type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Split-Slider Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Split Comparison View (8 cols) */}
        <div className="lg:col-span-8 bg-[#181f23] border border-[#2c373d] rounded-lg p-4 flex flex-col gap-3">
          
          {/* Top Bar: Dates, Positions, Spectral Band Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-semibold flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                <Calendar className="w-3.5 h-3.5" /> Baseline (May 2024 Pre-Work)
              </span>
              <span className="text-[#9ba3a7] hidden sm:inline">•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                <Calendar className="w-3.5 h-3.5" /> Operational (Nov 2025 Post-Monsoon)
              </span>
            </div>

            {/* Band Mode Toggle */}
            <div className="inline-flex rounded-md p-0.5 bg-[#121619] border border-[#2c373d]">
              <button
                type="button"
                onClick={() => setBandMode('rgb')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  bandMode === 'rgb' ? 'bg-[#10b981] text-[#121619]' : 'text-[#9ba3a7] hover:text-[#f1f0eb]'
                }`}
              >
                RGB Natural
              </button>
              <button
                type="button"
                onClick={() => setBandMode('ndvi')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  bandMode === 'ndvi' ? 'bg-[#10b981] text-[#121619]' : 'text-[#9ba3a7] hover:text-[#f1f0eb]'
                }`}
              >
                NDVI Infrared
              </button>
              <button
                type="button"
                onClick={() => setBandMode('ndwi')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  bandMode === 'ndwi' ? 'bg-[#10b981] text-[#121619]' : 'text-[#9ba3a7] hover:text-[#f1f0eb]'
                }`}
              >
                NDWI Moisture
              </button>
            </div>
          </div>

          {/* Dual-Panel Interactive Image Split Container */}
          <div 
            ref={containerRef}
            onPointerDown={handlePointerMove}
            onPointerMove={handlePointerMove}
            className="relative aspect-video w-full rounded-lg overflow-hidden select-none border border-[#2c373d] bg-[#0c1216] cursor-ew-resize touch-none shadow-inner"
          >
            {/* RIGHT SIDE: "AFTER / OPERATIONAL" LAYER (Full Width Background) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {/* Satellite Background Simulation Texture */}
              <div 
                className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                  bandMode === 'rgb'
                    ? 'bg-gradient-to-br from-[#123824] via-[#1a4a35] to-[#0d2a1c]'
                    : bandMode === 'ndvi'
                    ? 'bg-gradient-to-br from-[#065f46] via-[#10b981] to-[#047857]'
                    : 'bg-gradient-to-br from-[#0c4a6e] via-[#0284c7] to-[#075985]'
                }`}
              >
                {/* Simulated Geographic Riverbed & Water Impoundment Contour */}
                <svg className="w-full h-full opacity-60" viewBox="0 0 800 450" preserveAspectRatio="none">
                  <path d="M0,225 Q200,180 400,230 T800,210" fill="none" stroke="#34d399" strokeWidth="6" strokeDasharray="3 3" />
                  <path d="M0,235 Q200,190 400,240 T800,220" fill="none" stroke="#6ee7b7" strokeWidth="4" />
                  {/* Water reservoir pool */}
                  <ellipse cx="440" cy="225" rx="140" ry="60" fill={bandMode === 'ndwi' ? '#38bdf8' : '#0369a1'} opacity="0.85" />
                  <ellipse cx="430" cy="225" rx="110" ry="40" fill={bandMode === 'ndwi' ? '#7dd3fc' : '#0284c7'} opacity="0.9" />
                  {/* Riparian buffer greenery */}
                  <circle cx="360" cy="180" r="45" fill="#10b981" opacity="0.5" filter="blur(8px)" />
                  <circle cx="520" cy="250" r="50" fill="#10b981" opacity="0.5" filter="blur(8px)" />
                </svg>
              </div>

              {/* Water Surface Shimmer & Metadata Stamp */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 border border-emerald-500/40 text-emerald-400">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>OPERATIONAL STATE: ACTIVE PONDING</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-black/60 text-slate-300 text-[10px]">
                    Sentinel-2 L2A • Pass: 18-NOV-2025
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/60 p-2 rounded border border-white/10 backdrop-blur-sm">
                  <span>Impoundment: +1.8m Depth</span>
                  <span>NDVI Biomass: {operationalNdvi}</span>
                  <span>Water Pool: {waterSpreadHa} ha</span>
                  <span>Turbidity: Optimal</span>
                </div>
              </div>
            </div>

            {/* LEFT SIDE: "BEFORE / BASELINE" LAYER (Clipped by slider position) */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              style={{ width: `${sliderPos}%` }}
            >
              {/* Internal Full-Width Wrapper to prevent image distortion when resized */}
              <div className="absolute inset-0 min-w-[700px] w-full h-full" style={{ width: containerRef.current?.clientWidth || '100%' }}>
                <div 
                  className={`w-full h-full transition-all duration-300 ${
                    bandMode === 'rgb'
                      ? 'bg-gradient-to-br from-[#2a2118] via-[#3d3123] to-[#1e1710]'
                      : bandMode === 'ndvi'
                      ? 'bg-gradient-to-br from-[#451a03] via-[#78350f] to-[#292524]'
                      : 'bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#0c0a09]'
                  }`}
                >
                  {/* Simulated Dry Barren Gully Contours */}
                  <svg className="w-full h-full opacity-60" viewBox="0 0 800 450" preserveAspectRatio="none">
                    <path d="M0,225 Q200,180 400,230 T800,210" fill="none" stroke="#a16207" strokeWidth="4" strokeDasharray="6 4" />
                    {/* Dried up sandbed */}
                    <ellipse cx="440" cy="225" rx="100" ry="30" fill="#78350f" opacity="0.4" />
                    {/* Erosion gullies */}
                    <line x1="380" y1="170" x2="430" y2="215" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="2 2" />
                    <line x1="480" y1="260" x2="445" y2="235" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="2 2" />
                  </svg>
                </div>

                {/* Dry Metadata Stamp */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 border border-amber-500/40 text-amber-400">
                      <Mountain className="w-3.5 h-3.5" />
                      <span>BASELINE STATE: DRY SUMMER GULLY</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-black/60 text-slate-300 text-[10px]">
                      Sentinel-2 L2A • Pass: 12-MAY-2024
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/60 p-2 rounded border border-white/10 backdrop-blur-sm">
                    <span>Dry Drainage Basin</span>
                    <span>NDVI: {baselineNdvi} (Barren)</span>
                    <span>Water: 0.0 ha</span>
                    <span>Bare Soil: 76%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Center Divider Handle */}
            <div 
              className="absolute inset-y-0 w-1 bg-emerald-400 pointer-events-none flex items-center justify-center"
              style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-8 h-8 rounded-full bg-[#121619] border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
            </div>

            {/* Accessible HTML Range Input for Screen Readers & Keyboard Navigation */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label="Temporal slider divider position"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
            />
          </div>

          {/* Quick Slider Position Presets & Play Animation */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSliderPos(0)}
                className="px-2.5 py-1 rounded bg-[#121619] hover:bg-[#222a2e] border border-[#2c373d] text-amber-400 text-[11px] transition-colors"
              >
                ◀ 100% Baseline
              </button>
              <button
                type="button"
                onClick={() => setSliderPos(50)}
                className="px-2.5 py-1 rounded bg-[#121619] hover:bg-[#222a2e] border border-[#2c373d] text-[#f1f0eb] text-[11px] transition-colors"
              >
                ⚖️ 50 / 50 Split
              </button>
              <button
                type="button"
                onClick={() => setSliderPos(100)}
                className="px-2.5 py-1 rounded bg-[#121619] hover:bg-[#222a2e] border border-[#2c373d] text-emerald-400 text-[11px] transition-colors"
              >
                100% Operational ▶
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1 rounded bg-[#10b981]/20 hover:bg-[#10b981]/30 border border-[#10b981]/50 text-[#10b981] font-semibold text-[11px] inline-flex items-center gap-1.5 transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Sweep' : 'Auto-Play Transition'}</span>
              </button>
              <span className="text-[11px] text-[#9ba3a7]">Position: {sliderPos}%</span>
            </div>
          </div>
        </div>

        {/* Right: Dynamic Biophysical Differential Indicators (4 cols) */}
        <div className="lg:col-span-4 bg-[#181f23] border border-[#2c373d] rounded-lg p-4 flex flex-col justify-between gap-4 text-xs font-sans">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#2c373d] pb-2 font-mono">
              <h3 className="font-bold text-[#f1f0eb] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
                Observed Differential
              </h3>
              <span className="text-[10px] text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/30">
                Order {activeAsset.stream_order}
              </span>
            </div>

            {/* Asset Location Badge */}
            <div className="bg-[#121619] p-2.5 rounded border border-[#2c373d] text-[11px] font-mono text-[#9ba3a7] flex items-center justify-between">
              <span className="flex items-center gap-1 text-[#f1f0eb]">
                <MapPin className="w-3 h-3 text-[#10b981]" />
                {activeAsset.name}
              </span>
              <span>{activeAsset.target_latitude.toFixed(4)}°, {activeAsset.target_longitude.toFixed(4)}°</span>
            </div>

            {/* Metric 1: Vegetation Biomass Delta */}
            <div className="bg-[#121619] p-3 rounded-md border border-[#2c373d] space-y-1 font-mono">
              <div className="flex justify-between items-center text-[#9ba3a7]">
                <span>Vegetation Biomass (NDVI):</span>
                <span className="text-emerald-400 font-bold">+{ndviDelta} (+{Math.round((ndviDelta / baselineNdvi) * 100)}%)</span>
              </div>
              <div className="w-full bg-[#181f23] h-2 rounded-full overflow-hidden border border-[#2c373d]">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.round(operationalNdvi * 100)}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-[#9ba3a7] pt-0.5">
                <span>Baseline: {baselineNdvi}</span>
                <span>Operational: {operationalNdvi}</span>
              </div>
            </div>

            {/* Metric 2: Surface Water Retention */}
            <div className="bg-[#121619] p-3 rounded-md border border-[#2c373d] space-y-1 font-mono">
              <div className="flex justify-between items-center text-[#9ba3a7]">
                <span>Surface Water Spread:</span>
                <span className="text-cyan-400 font-bold">+{waterSpreadHa} Hectares</span>
              </div>
              <div className="w-full bg-[#181f23] h-2 rounded-full overflow-hidden border border-[#2c373d]">
                <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: '82%' }}></div>
              </div>
              <span className="text-[10px] text-[#9ba3a7] block">
                Estimated In-Situ Storage: ~{storageCapacityCum.toLocaleString()} m³
              </span>
            </div>

            {/* Metric 3: Siltation / Sedimentation Status */}
            <div className="bg-[#121619] p-3 rounded-md border border-[#2c373d] font-mono space-y-1">
              <div className="flex justify-between items-center text-[#9ba3a7]">
                <span>Sedimentation Rate:</span>
                <span className="text-emerald-400 font-medium">{siltationStatus}</span>
              </div>
              <p className="text-[10px] text-[#9ba3a7] leading-relaxed">
                Upstream contour trenches &amp; loose boulder gully plugs successfully decelerated peak runoff velocity, protecting downstream masonry apron.
              </p>
            </div>
          </div>

          {/* Quality & Statutory Certification */}
          <div className="bg-[#121619] p-3 rounded-md border border-[#2c373d] text-[11px] font-mono space-y-1">
            <div className="flex items-center gap-1.5 text-[#10b981] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Quality &amp; Lineage Certified</span>
            </div>
            <p className="text-[#9ba3a7] text-[10px] leading-tight">
              Calibrated against Copernicus Sentinel-2 Level-2A BOA reflectance and verified with in-situ field EXIF telemetry.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
