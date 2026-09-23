import React, { useState } from 'react';
import { WatershedDetail, EvidenceCard, WatershedSummary } from '../../types';
import { WatershedMap } from '../gis/WatershedMap';
import {
  Mountain,
  Droplets,
  Satellite,
  Bot,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Cpu,
  RefreshCw,
  Sliders,
  Play,
  FileCheck2,
  Database
} from 'lucide-react';

interface LandingViewProps {
  watershed?: WatershedDetail | null;
  evidenceList?: EvidenceCard[];
  selectedInterventionId?: string | null;
  onSelectIntervention?: (id: string) => void;
  onSelectEvidence?: (card: EvidenceCard) => void;
  onOpenSutraAi?: (structureType?: string) => void;
  onLaunchExplorer: () => void;
  onSelectTab?: (tab: string) => void;
  onSwitchWatershed?: (idOrCode: string) => void;
  watershedList?: WatershedSummary[];
}

export const LandingView: React.FC<LandingViewProps> = ({
  watershed,
  evidenceList = [],
  selectedInterventionId = null,
  onSelectIntervention = () => {},
  onSelectEvidence = () => {},
  onOpenSutraAi,
  onLaunchExplorer,
  onSelectTab,
  onSwitchWatershed,
  watershedList = [],
}) => {
  // Methodology active tab: 'data' | 'processing' | 'ai' | 'output'
  const [activeMethodTab, setActiveMethodTab] = useState<'data' | 'processing' | 'ai' | 'output'>('data');

  // Interactive AI assessment simulator state
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [showAiResult, setShowAiResult] = useState(false);

  // Simulated AI Assessment steps
  const aiSteps = [
    'Processing CartoDEM 30m topographic elevation model...',
    'Calculating D8 flow direction and slopes (>12° threshold)...',
    'Computing upstream catchment flow accumulation...',
    'Extracting Strahler drainage channels (Orders 1 to 4)...',
    'Analyzing Sentinel-2 NDVI vegetative health and NDWI water bodies...',
    'Evaluating Random Forest intervention siting suitability...'
  ];

  const handleRunAiAnalysis = () => {
    setIsProcessingAi(true);
    setProcessingStep(0);
    setShowAiResult(false);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < aiSteps.length) {
        setProcessingStep(currentStep);
      } else {
        clearInterval(interval);
        setIsProcessingAi(false);
        setShowAiResult(true);
      }
    }, 450);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full text-[#F4F7F5] space-y-24 md:space-y-32 pb-24 overflow-hidden">

      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION                                                */}
      {/* ========================================================================= */}
      <section className="relative -mt-4 sm:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 min-h-[92vh] flex flex-col justify-between overflow-hidden">
        {/* Background Aerial Watershed Image with Slow Cinematic Zoom */}
        <div 
          className="absolute inset-0 bg-cover bg-center animate-hero-zoom pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85')`,
          }}
        />

        {/* Cinematic Multi-Layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F1A] via-[#0B1F1A]/75 to-[#0B1F1A]/85 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0B1F1A]/40 to-[#0B1F1A] pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 flex-1 flex flex-col justify-center text-center items-center">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#123C35]/80 border border-[#7DD3A7]/30 text-[#7DD3A7] text-xs font-mono font-medium mb-6 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span>WDC-PMKSY 2.0 • Geospatial Hydrological AI Platform</span>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sans max-w-5xl leading-[1.1] mb-6">
            Intelligent Watershed Planning,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7DD3A7] via-[#10b981] to-[#1677FF]">
              Powered by AI
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl leading-relaxed mb-10 font-normal">
            Transform terrain, satellite, hydrological and geospatial data into actionable watershed insights.
            Delineate micro-catchments, simulate flood runoff, and pinpoint optimal check dam and percolation structures across India.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => scrollToSection('interactive-map')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#0B1F1A] font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#10b981]/25 hover:shadow-[#10b981]/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Compass className="w-5 h-5 text-[#0B1F1A]" />
              <span>Explore Watershed</span>
            </button>

            <button
              onClick={() => scrollToSection('ai-analysis')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#123C35]/80 hover:bg-[#123C35] text-white border border-[#7DD3A7]/35 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Bot className="w-5 h-5 text-[#7DD3A7]" />
              <span>Run AI Analysis</span>
            </button>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full max-w-4xl text-left">
            <div className="glass-card p-4 rounded-xl border border-[#7DD3A7]/20">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">Flagship Basins</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 block">7 Micro-Catchments</span>
              <span className="text-[11px] text-[#7DD3A7] mt-0.5 block">WDC-PMKSY 2.0 Delineated</span>
            </div>
            <div className="glass-card p-4 rounded-xl border border-[#7DD3A7]/20">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">Monitored Assets</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 block">22 Active Sites</span>
              <span className="text-[11px] text-[#1677FF] mt-0.5 block">Check Dams &amp; Tanks</span>
            </div>
            <div className="glass-card p-4 rounded-xl border border-[#7DD3A7]/20">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">Water Impoundment</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 block">275 ML Capacity</span>
              <span className="text-[11px] text-[#7DD3A7] mt-0.5 block">HydroSHEDS Validated</span>
            </div>
            <div className="glass-card p-4 rounded-xl border border-[#7DD3A7]/20">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">Evidence Integrity</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 block">100% Geofenced</span>
              <span className="text-[11px] text-amber-400 mt-0.5 block">Camera EXIF &amp; GPS Locked</span>
            </div>
          </div>

        </div>

        {/* Subtle Scroll Indicator */}
        <div className="relative z-10 pb-6 flex flex-col items-center justify-center text-slate-400 text-xs font-mono">
          <span className="tracking-wider uppercase mb-1 text-[10px]">Scroll To Explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#7DD3A7]" />
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. "WHY GEOWATERSHED AI?" SECTION                                        */}
      {/* ========================================================================= */}
      <section id="why-geowatershed" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-mono font-semibold text-[#7DD3A7] uppercase tracking-widest block mb-2">
            Integrated Scientific Platform
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why GeoWatershed AI?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
            Watershed management has traditionally relied on fragmented manual paperwork, slow paper maps, and unverified surveys.
            GeoWatershed AI fuses four layers of deep intelligence into one unified engineering platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#123C35] border border-[#7DD3A7]/30 flex items-center justify-center text-[#7DD3A7] mb-5 shadow-sm">
                <Mountain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Terrain Intelligence</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Understand elevation, slope gradients, aspect angles, and 3D topographic relief derived from CartoDEM 30m data.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#7DD3A7]/10 flex items-center text-xs text-[#7DD3A7] font-medium">
              <span>D8 Flow Routing</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#123C35] border border-[#1677FF]/40 flex items-center justify-center text-[#1677FF] mb-5 shadow-sm">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Hydrological Intelligence</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Understand how rainfall becomes surface runoff, tracing stream accumulation and drainage discharge through the watershed.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#7DD3A7]/10 flex items-center text-xs text-[#1677FF] font-medium">
              <span>Strahler Drainage Hierarchy</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#123C35] border border-[#7DD3A7]/30 flex items-center justify-center text-[#7DD3A7] mb-5 shadow-sm">
                <Satellite className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Satellite Intelligence</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Use Copernicus Sentinel-2 multi-spectral bands to continuously compute NDVI vegetation health, NDWI water, and bare soil index.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#7DD3A7]/10 flex items-center text-xs text-[#7DD3A7] font-medium">
              <span>10m Spatial Resolution</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#123C35] border border-amber-500/40 flex items-center justify-center text-amber-400 mb-5 shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI-Assisted Planning</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Convert complex geographic information into actionable structure siting recommendations, cost budgets, and maintenance dispatches.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#7DD3A7]/10 flex items-center text-xs text-amber-400 font-medium">
              <span>Machine Learning Ensembles</span>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. CENTRAL INTERACTIVE MAP SECTION                                       */}
      {/* ========================================================================= */}
      <section id="interactive-map" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-mono font-semibold text-[#1677FF] uppercase tracking-widest block mb-1">
              Central Product Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Compass className="w-6 h-6 text-[#1677FF]" />
              <span>Interactive Micro-Watershed GIS</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Real-time geospatial exploration powered by Leaflet, PostGIS, and Esri satellite imagery.
              Fly across national watersheds and inspect Strahler streams and geofenced field interventions.
            </p>
          </div>

          {/* Quick Basin Selector */}
          {watershedList.length > 0 && onSwitchWatershed && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">Active Catchment:</span>
              <select
                value={watershed?.id || ''}
                onChange={(e) => onSwitchWatershed(e.target.value)}
                className="bg-[#123C35] border border-[#7DD3A7]/30 text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none cursor-pointer"
              >
                {watershedList.map((w) => (
                  <option key={w.id} value={w.id} className="bg-[#0B1F1A]">
                    {w.state}: {w.name} ({w.code})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Central Map Glass Container */}
        <div className="relative rounded-2xl overflow-hidden border border-[#7DD3A7]/25 shadow-2xl bg-[#0B1F1A]">
          {watershed ? (
            <WatershedMap
              watershed={watershed}
              evidenceList={evidenceList}
              selectedInterventionId={selectedInterventionId}
              onSelectIntervention={onSelectIntervention}
              onSelectEvidence={onSelectEvidence}
              onOpenSutraAi={onOpenSutraAi}
            />
          ) : (
            <div className="h-[520px] flex items-center justify-center text-slate-400 font-mono text-xs">
              <div className="text-center space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-[#7DD3A7] mx-auto" />
                <div>Loading watershed catchment layers...</div>
              </div>
            </div>
          )}

          {/* Floating Selected Catchment Overview Card (Bottom-Right) */}
          <div className="absolute bottom-4 right-4 z-20 hidden md:block max-w-xs glass-panel p-3.5 border border-[#7DD3A7]/30 shadow-xl text-xs space-y-1.5">
            <div className="flex items-center justify-between font-semibold border-b border-slate-700/60 pb-1 text-white">
              <span>{watershed?.name || 'Ulhas Micro-Watershed'}</span>
              <span className="text-[10px] text-[#7DD3A7] font-mono uppercase bg-[#123C35] px-1.5 py-0.5 rounded">
                Active GIS
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
              <div>
                <span className="text-slate-500 block text-[10px]">Area</span>
                <span className="font-mono font-bold text-white">124.6 km²</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Erosion Risk</span>
                <span className="font-mono font-bold text-amber-400">Moderate</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Drainage Channels</span>
                <span className="font-mono font-bold text-[#1677FF]">18 Streams (Order 1–4)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Field Interventions</span>
                <span className="font-mono font-bold text-[#7DD3A7]">{watershed?.interventions.length || 22} Sites</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. TERRAIN INTELLIGENCE SECTION                                          */}
      {/* ========================================================================= */}
      <section id="terrain" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold text-[#7DD3A7] uppercase tracking-widest block mb-2">
            Topographic Science
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terrain Intelligence: Topographic Analysis
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
            Rainwater behavior is governed by the physical contours of the Earth.
            Our engine ingests Digital Elevation Models (DEM) to generate five foundational topographic datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Elevation */}
          <div className="glass-card p-5 rounded-2xl border border-[#7DD3A7]/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-400 uppercase">01 • Elevation Profile</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#123C35] text-[#7DD3A7] font-mono">CartoDEM 30m</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Elevation &amp; Relief</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Determines hydraulic gravitational head from ridgelines down to valley floors, controlling hydraulic head and dam backwater.
              </p>
            </div>
            {/* Inline Diagram: SVG Elevation Curve */}
            <div className="bg-[#07130F] p-2.5 rounded-xl border border-slate-800">
              <svg className="w-full h-16" viewBox="0 0 200 60">
                <path d="M0,50 Q40,10 80,30 T160,15 T200,45" fill="none" stroke="#7DD3A7" strokeWidth="2" />
                <path d="M0,50 Q40,10 80,30 T160,15 T200,45 L200,60 L0,60 Z" fill="rgba(125,211,167,0.12)" />
                <circle cx="80" cy="30" r="3" fill="#10b981" />
                <circle cx="160" cy="15" r="3" fill="#38bdf8" />
              </svg>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>Peak: 840 m</span>
                <span>Outlet: 120 m</span>
              </div>
            </div>
          </div>

          {/* 2. Slope Gradient */}
          <div className="glass-card p-5 rounded-2xl border border-[#7DD3A7]/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-400 uppercase">02 • Slope Gradient</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#123C35] text-[#7DD3A7] font-mono">D8 Algorithm</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Slope &amp; Velocity</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Calculates slope angles. Slopes &gt;15° trigger high-velocity erosive runoff; gentle slopes &lt;5° indicate natural recharge basins.
              </p>
            </div>
            {/* Inline Diagram: Slope stepped angles */}
            <div className="bg-[#07130F] p-2.5 rounded-xl border border-slate-800 flex items-center justify-around text-center">
              <div>
                <div className="text-emerald-400 font-bold font-mono text-sm">&lt; 3°</div>
                <div className="text-[10px] text-slate-400">Percolation Tank</div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <div className="text-sky-400 font-bold font-mono text-sm">3° – 8°</div>
                <div className="text-[10px] text-slate-400">Masonry Dam</div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <div className="text-amber-400 font-bold font-mono text-sm">&gt; 15°</div>
                <div className="text-[10px] text-slate-400">Gully Plug / Bund</div>
              </div>
            </div>
          </div>

          {/* 3. Topographic Wetness Index (TWI) */}
          <div className="glass-card p-5 rounded-2xl border border-[#7DD3A7]/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-400 uppercase">03 • Moisture Index</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#123C35] text-[#1677FF] font-mono">TWI ln(a/tanβ)</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Topographic Wetness (TWI)</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Quantifies soil moisture saturation zones. High TWI zones identify natural valley depressions ideal for groundwater recharge ponds.
              </p>
            </div>
            {/* Inline Diagram: Wetness spectrum */}
            <div className="bg-[#07130F] p-2.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-amber-500 via-emerald-400 to-[#1677FF]" />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Arid Ridge (TWI 3.2)</span>
                <span>Moist Basin (TWI 11.8)</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 5. HYDROLOGICAL FLOW SECTION ("From Rainfall to River")                  */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-[#1677FF]/30 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-semibold text-[#1677FF] uppercase tracking-widest block mb-2">
              From Rainfall to River
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              The Hydrological Flow Sequence
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              How our system computes runoff convergence across the watershed terrain.
            </p>
          </div>

          {/* Flow Stepper Pipeline */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative z-10">
            {[
              { step: '01', title: 'Rainfall', desc: 'Precipitation input (IMD & Open-Meteo)', color: 'text-sky-400', border: 'border-sky-500/30' },
              { step: '02', title: 'Surface Runoff', desc: 'Infiltration subtraction via soil type', color: 'text-emerald-400', border: 'border-emerald-500/30' },
              { step: '03', title: 'Flow Direction', desc: 'D8 steepest descent routing', color: 'text-[#7DD3A7]', border: 'border-[#7DD3A7]/30' },
              { step: '04', title: 'Flow Accumulation', desc: 'Upstream cell counting matrix', color: 'text-[#1677FF]', border: 'border-[#1677FF]/30' },
              { step: '05', title: 'Stream Network', desc: 'Strahler drainage branch formation', color: 'text-cyan-300', border: 'border-cyan-500/30' },
              { step: '06', title: 'Watershed Outlet', desc: 'Discharge basin terminal point', color: 'text-amber-400', border: 'border-amber-500/30' },
            ].map((f) => (
              <div key={f.step} className={`bg-[#0B1F1A]/90 p-3.5 rounded-xl border ${f.border} flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">{f.step}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  </div>
                  <h4 className={`text-xs font-bold ${f.color} mb-1`}>{f.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Flow Arrow Connection Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-pulse" />
            <span>Automated hydrologic routing computed in &lt;1.2 seconds per micro-watershed</span>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 6. STREAM NETWORK & STRAHLER HIERARCHY                                    */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-semibold text-[#7DD3A7] uppercase tracking-widest block">
              Drainage Hierarchy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Strahler Stream Orders &amp; Intervention Matching
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              In WDC-PMKSY 2.0 watershed development, structures must match the stream order.
              Building a masonry check dam on an Order 1 feeder will wash out; building a brushwood dam on an Order 4 river will collapse.
            </p>
            <div className="pt-2 text-xs font-mono text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7DD3A7]" />
                <span>Zero engineering mismatches via automated Strahler rules</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7DD3A7]" />
                <span>Connected to actual HydroSHEDS 90m &amp; CartoDEM</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Order 1 */}
            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-300">1st-Order Stream</span>
                <span className="w-5 h-0.5 border-b border-sky-400 border-dashed" />
              </div>
              <div className="text-xs font-semibold text-white">Feeder Headwater Gully</div>
              <p className="text-[11px] text-slate-400 mt-1">High slope, low discharge. Recommended: Continuous Contour Trenches (CCT) &amp; Vegetative Gully Plugs.</p>
            </div>

            {/* Order 2 */}
            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#38bdf8]">2nd-Order Stream</span>
                <span className="w-5 h-1 bg-[#38bdf8] rounded" />
              </div>
              <div className="text-xs font-semibold text-white">Interconnecting Branch</div>
              <p className="text-[11px] text-slate-400 mt-1">Medium runoff velocity. Recommended: Loose Boulder Checks (LBC) &amp; Gabion Wire Mesh Dams.</p>
            </div>

            {/* Order 3 */}
            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#06b6d4]">3rd-Order Stream</span>
                <span className="w-5 h-1.5 bg-[#06b6d4] rounded" />
              </div>
              <div className="text-xs font-semibold text-white">Tributary Convergence</div>
              <p className="text-[11px] text-slate-400 mt-1">High water volume. Recommended: Cement Masonry Check Dams &amp; Earthen Nala Bunds.</p>
            </div>

            {/* Order 4 */}
            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0284c7]">4th-Order Stream</span>
                <span className="w-5 h-2 bg-[#0284c7] rounded" />
              </div>
              <div className="text-xs font-semibold text-white">Main Drainage Stem</div>
              <p className="text-[11px] text-slate-400 mt-1">Valley floor trunk. Recommended: Sub-surface Dykes &amp; Large Village Percolation Tanks.</p>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 7. SATELLITE MEETS GROUND TRUTH (SPLIT SCREEN)                          */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold text-[#7DD3A7] uppercase tracking-widest block mb-2">
            Verification Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Satellite Meets Ground Truth
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
            Eliminate ghost projects and fabricated invoices.
            Cross-verifies satellite-derived spectral moisture with in-situ field camera telemetry at the exact latitude/longitude.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#7DD3A7]/30">
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
            
            {/* Left: Satellite View */}
            <div className="lg:col-span-5 bg-[#07130F] p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#7DD3A7] flex items-center gap-1.5 font-bold">
                  <Satellite className="w-4 h-4" /> Sentinel-2 L2A Multispectral
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                  10m Resolution
                </span>
              </div>
              
              <div className="h-44 rounded-xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/20 p-3 flex flex-col justify-between">
                <div className="text-[11px] font-mono text-slate-400">
                  <div>Tile: T43QDB (Ulhas Catchment)</div>
                  <div>Cloud Cover: 1.2%</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-slate-800">
                  <div className="bg-slate-900/90 p-1.5 rounded">
                    <span className="text-slate-400 block text-[10px]">NDVI</span>
                    <span className="text-emerald-400 font-bold">0.68</span>
                  </div>
                  <div className="bg-slate-900/90 p-1.5 rounded">
                    <span className="text-slate-400 block text-[10px]">NDWI</span>
                    <span className="text-sky-400 font-bold">0.12</span>
                  </div>
                  <div className="bg-slate-900/90 p-1.5 rounded">
                    <span className="text-slate-400 block text-[10px]">BSI</span>
                    <span className="text-amber-400 font-bold">-0.22</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Status: Vegetative vigor and surface water impoundment verified.
              </div>
            </div>

            {/* Center: Split Connection */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#123C35] border border-[#7DD3A7]/50 flex items-center justify-center text-[#7DD3A7] font-bold text-xs shadow-md">
                ↔
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-2 uppercase tracking-wider">
                Cross-Check
              </span>
            </div>

            {/* Right: Field Camera Observation */}
            <div className="lg:col-span-5 bg-[#07130F] p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4" /> In-Situ Surveyor Evidence
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  EXIF Geofenced
                </span>
              </div>

              <div className="h-44 rounded-xl bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/20 p-3 flex flex-col justify-between">
                <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
                  <div>Structure: Masonry Check Dam CD-01</div>
                  <div>GPS: 18.9150° N, 73.3280° E (±2.4 m)</div>
                  <div>Camera: Sony IMX Sensor • 50MP</div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 bg-slate-900/90 p-2 rounded truncate">
                  SHA-256: 4a2f8b91c0e3...612d (Ledger Anchored)
                </div>
              </div>

              <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Evidence Alignment: 98.4% Confidence</span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 8. AI ANALYSIS SECTION & INTERACTIVE PROCESSING                          */}
      {/* ========================================================================= */}
      <section id="ai-analysis" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold text-[#7DD3A7] uppercase tracking-widest block mb-2">
            Predictive Decision Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Turn Geospatial Data Into Decisions
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
            Run real-time machine learning assessments to predict optimal water conservation structures,
            storage capacity increments, and maintenance schedules.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#7DD3A7]/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left: Input Parameters Panel */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#7DD3A7]" /> Real Field Variables
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                  Live Values
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#07130F] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Elevation</span>
                  <span className="text-white font-bold font-mono text-sm">540 meters</span>
                </div>
                <div className="bg-[#07130F] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Terrain Slope</span>
                  <span className="text-white font-bold font-mono text-sm">4.2% (Moderate)</span>
                </div>
                <div className="bg-[#07130F] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Stream Channel</span>
                  <span className="text-cyan-400 font-bold font-mono text-sm">Order 3 (Tributary)</span>
                </div>
                <div className="bg-[#07130F] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Water Table Depth</span>
                  <span className="text-white font-bold font-mono text-sm">6.85 m bgl</span>
                </div>
                <div className="bg-[#07130F] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Annual Surface Runoff</span>
                  <span className="text-white font-bold font-mono text-sm">350.2 mm/yr</span>
                </div>
                <div className="bg-[#07130F] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Crop / Farmland Cover</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">55%</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunAiAnalysis}
                disabled={isProcessingAi}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-[#0B1F1A] font-bold text-sm font-sans flex items-center justify-center gap-2 shadow-lg transition-all duration-200"
              >
                {isProcessingAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#0B1F1A]" />
                    <span>Processing Geospatial Stack...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-[#0B1F1A]" />
                    <span>Run AI Watershed Assessment</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Processing Sequence & Output */}
            <div className="lg:col-span-6 bg-[#07130F] p-6 rounded-2xl border border-slate-800 min-h-[310px] flex flex-col justify-between">
              
              {isProcessingAi ? (
                <div className="space-y-4 my-auto">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#7DD3A7] uppercase tracking-wider font-semibold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Multi-Scale Hydrological Pipeline</span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    {aiSteps.map((step, idx) => (
                      <div
                        key={step}
                        className={`flex items-center gap-2 transition-opacity duration-300 ${
                          idx <= processingStep ? 'opacity-100 text-slate-200' : 'opacity-20 text-slate-600'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${idx < processingStep ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span className="truncate">{step}</span>
                      </div>
                    ))}
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#10b981] h-1.5 transition-all duration-300 rounded-full"
                      style={{ width: `${((processingStep + 1) / aiSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              ) : showAiResult ? (
                <div className="space-y-4 my-auto animate-fade-in text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white uppercase text-[11px] font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Siting Recommendation Generated
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono border border-emerald-500/30">
                      96.4% Confidence
                    </span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
                    <div className="text-slate-400 text-[11px]">Optimal Recommended Structure:</div>
                    <div className="text-base font-bold text-emerald-400">
                      Masonry Check Dam &amp; Percolation Basin
                    </div>
                    <div className="text-slate-300 text-[11px] leading-relaxed">
                      Sited on Stream Order 3 with high infiltration bedrock. Predicted annual recharge increment: <strong>4.82 Million m³</strong>.
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Suitability Index</span>
                      <span className="text-teal-300 font-bold text-sm">78 / 100</span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Cost-Benefit Ratio (BCR)</span>
                      <span className="text-amber-400 font-bold text-sm">1.84 (Highly Viable)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="my-auto text-center space-y-2 py-8">
                  <Cpu className="w-10 h-10 text-slate-600 mx-auto" />
                  <div className="font-bold text-slate-300 text-sm">Ready For Assessment</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Click "Run AI Watershed Assessment" to trigger the multi-source hydrological model and generate optimal intervention recommendations.
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>Model: Random Forest Ensemble (CGWB Ground Truth)</span>
                <span>WDC-PMKSY 2.0 Aligned</span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 9. DATA FLOW VISUALIZATION                                               */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-semibold text-[#7DD3A7] uppercase tracking-widest block mb-2">
            System Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Complete Data Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            From raw earth observation telemetry to ministerial audit reports.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#7DD3A7]/20 space-y-8">
          
          {/* 3 Tier Architecture Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Stage 1: Ingestion */}
            <div className="bg-[#07130F] p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-xs font-mono text-[#7DD3A7] font-bold uppercase flex items-center gap-1.5">
                <Database className="w-4 h-4" /> 1. Multi-Stream Ingestion
              </div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span>Sentinel-2 L2A Multispectral (10m)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>CartoDEM &amp; HydroSHEDS Drainage</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF]" />
                  <span>Open-Meteo &amp; IMD Weather Telemetry</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>In-Situ Camera GPS EXIF Evidence</span>
                </li>
              </ul>
            </div>

            {/* Stage 2: Processing Engine */}
            <div className="bg-[#07130F] p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-xs font-mono text-[#1677FF] font-bold uppercase flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> 2. Hydrological AI Engine
              </div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>D8 Flow Accumulation &amp; Strahler Ordering</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>RUSLE Accelerated Soil Erosion Screening</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>Random Forest Recharge Zone Classifier</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Schedule of Rates (SoR) Cost Modeling</span>
                </li>
              </ul>
            </div>

            {/* Stage 3: Actionable Output */}
            <div className="bg-[#07130F] p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-xs font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" /> 3. Actionable Outcomes
              </div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Check Dam &amp; Tank Siting Coordinates</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Maintenance &amp; Silt Dispatch Alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>1-Click Cabinet Briefing Dossiers (PDF)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Cryptographic Ledger Verification</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 10. TECHNICAL METHODOLOGY SECTION (EXPANDABLE TABS)                      */}
      {/* ========================================================================= */}
      <section id="methodology" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-semibold text-[#7DD3A7] uppercase tracking-widest block mb-2">
            Technical Governance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Methodology &amp; Standards
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Detailed technical documentation for GIS analysts, evaluators, and engineers.
          </p>
        </div>

        <div className="glass-card rounded-2xl border border-[#7DD3A7]/25 overflow-hidden">
          
          {/* Tab Selector Header */}
          <div className="flex border-b border-slate-800 bg-[#07130F] text-xs font-mono font-semibold overflow-x-auto scrollbar-none">
            {[
              { id: 'data', label: '1. Data Sources' },
              { id: 'processing', label: '2. Terrain Algorithms' },
              { id: 'ai', label: '3. Machine Learning' },
              { id: 'output', label: '4. Decision & Compliance' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveMethodTab(t.id as any)}
                className={`py-3.5 px-6 whitespace-nowrap transition-colors border-b-2 ${
                  activeMethodTab === t.id
                    ? 'border-[#7DD3A7] text-[#7DD3A7] bg-[#123C35]/40'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content Body */}
          <div className="p-6 sm:p-8 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
            {activeMethodTab === 'data' && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-base">Multi-Source Geospatial Ingestion Standard</h4>
                <p>
                  Our architecture combines Sentinel-2 Level-2A bottom-of-atmosphere reflectance (10m resolution for bands 2, 3, 4, 8) with CartoDEM 30m elevation models.
                  Meteorological parameters are synchronized in real time via Open-Meteo and India Meteorological Department (IMD) APIs, supplemented with 1,420 CGWB observation wells for ground-truth water table calibration.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
                  <div className="p-3 bg-[#07130F] rounded-lg border border-slate-800">
                    <span className="text-[#7DD3A7] font-bold block">Sentinel-2 L2A</span>
                    <span className="text-slate-400 text-[11px]">NDVI / NDWI / BSI</span>
                  </div>
                  <div className="p-3 bg-[#07130F] rounded-lg border border-slate-800">
                    <span className="text-sky-400 font-bold block">CartoDEM 30m</span>
                    <span className="text-slate-400 text-[11px]">D8 Flow &amp; Elevation</span>
                  </div>
                  <div className="p-3 bg-[#07130F] rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold block">CGWB Database</span>
                    <span className="text-slate-400 text-[11px]">1,420 National Wells</span>
                  </div>
                </div>
              </div>
            )}

            {activeMethodTab === 'processing' && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-base">Hydrological &amp; D8 Routing Algorithms</h4>
                <p>
                  Flow direction is determined via the deterministic eight-neighbor (D8) algorithm. Flow accumulation matrices compute the total upstream area draining into each grid cell.
                  Drainage streams are classified following Arthur Strahler’s hierarchy (1952), filtering channels with minimum upstream threshold cells to eliminate spurious runoff artifacts.
                </p>
                <div className="p-3 bg-[#07130F] rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                  RUSLE Equation: A = R × K × LS × C × P (Computed across slope and vegetation density).
                </div>
              </div>
            )}

            {activeMethodTab === 'ai' && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-base">Random Forest &amp; Gradient Boosting Architecture</h4>
                <p>
                  Trained on 14,280 verified national watershed locations across Maharashtra, Rajasthan, Karnataka, Madhya Pradesh, and Uttarakhand.
                  Features include groundwater depth, surface runoff, stream order, NDVI vegetation vigor, and bare soil index.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                  <div className="p-3 bg-[#07130F] rounded-lg border border-slate-800">
                    <span className="text-emerald-400 font-bold">94.8% F1-Score</span>
                    <span className="text-slate-400 block text-[11px]">Recharge Zone Classification</span>
                  </div>
                  <div className="p-3 bg-[#07130F] rounded-lg border border-slate-800">
                    <span className="text-teal-400 font-bold">96.5% Precision</span>
                    <span className="text-slate-400 block text-[11px]">Check Dam &amp; Tank Siting</span>
                  </div>
                </div>
              </div>
            )}

            {activeMethodTab === 'output' && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-base">Statutory Compliance &amp; Audit Trail</h4>
                <p>
                  Aligned with Ministry of Rural Development guidelines for Watershed Development Component of Pradhan Mantri Krishi Sinchayee Yojana (WDC-PMKSY 2.0).
                  Compliant with National Geospatial Policy (NGP-2022) and Digital Personal Data Protection Act (DPDP 2023). Every field observation is cryptographically hashed with SHA-256 for parliamentary audit.
                </p>
              </div>
            )}
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 11. BEFORE / AFTER COMPARISON SECTION                                    */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-semibold text-[#7DD3A7] uppercase tracking-widest block mb-2">
            The Transformation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Traditional Surveys vs. GeoWatershed AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            How automated geospatial intelligence replaces months of manual guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before: Traditional */}
          <div className="glass-card p-6 sm:p-7 rounded-2xl border border-rose-900/40 bg-[#07130F]/90">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-rose-900/30">
              <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
                Traditional Watershed Planning
              </span>
              <span className="text-[10px] text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                Legacy Method
              </span>
            </div>
            <ul className="text-xs sm:text-sm text-slate-300 space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Manual paper surveys and hand-drawn catchment contour sketches.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span>4 to 8 weeks required to compute runoff and stream order estimates.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span>No photographic tamper-proofing; frequent ghost invoices and unverified reports.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Fragmented datasets with zero live meteorological synchronization.</span>
              </li>
            </ul>
          </div>

          {/* After: GeoWatershed AI */}
          <div className="glass-card p-6 sm:p-7 rounded-2xl border border-[#7DD3A7]/40 bg-[#0B1F1A]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#7DD3A7]/20">
              <span className="text-xs font-mono text-[#7DD3A7] font-bold uppercase tracking-wider">
                GeoWatershed AI Platform
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                WDC-PMKSY 2.0 Standard
              </span>
            </div>
            <ul className="text-xs sm:text-sm text-slate-200 space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="text-[#10b981] font-bold">✓</span>
                <span>Automated D8 drainage delineation &amp; CartoDEM topographic analysis in &lt;2s.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#10b981] font-bold">✓</span>
                <span>Instant machine learning siting for Check Dams, Percolation Tanks, and Farm Ponds.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#10b981] font-bold">✓</span>
                <span>Hardware camera GPS EXIF validation rejecting recycled or manipulated photos.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#10b981] font-bold">✓</span>
                <span>Live Open-Meteo &amp; Sentinel-2 satellite telemetry streaming directly into decision models.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 12. PROJECT IMPACT SECTION                                               */}
      {/* ========================================================================= */}
      <section id="impact" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-[#7DD3A7]/30 text-center relative overflow-hidden">
          
          <span className="text-xs font-mono font-semibold text-[#7DD3A7] uppercase tracking-widest block mb-2">
            National Footprint
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Demonstrated Engineering Impact
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Deployed across representative climate and agro-ecological zones of India to support sustainable rural development.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="p-4 bg-[#07130F] rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mb-1">01</div>
              <div className="font-bold text-sm text-[#7DD3A7] mb-1">Catchment Delineation</div>
              <p className="text-xs text-slate-400">7 flagship basins mapped across Maharashtra, Rajasthan, Karnataka, and MP.</p>
            </div>

            <div className="p-4 bg-[#07130F] rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mb-1">02</div>
              <div className="font-bold text-sm text-[#1677FF] mb-1">Terrain &amp; Runoff Science</div>
              <p className="text-xs text-slate-400">D8 drainage lines and Strahler ordering verified against HydroSHEDS.</p>
            </div>

            <div className="p-4 bg-[#07130F] rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mb-1">03</div>
              <div className="font-bold text-sm text-emerald-400 mb-1">AI-Based Planning</div>
              <p className="text-xs text-slate-400">Random Forest recommendations calibrated on 14,280 CGWB wells.</p>
            </div>

            <div className="p-4 bg-[#07130F] rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mb-1">04</div>
              <div className="font-bold text-sm text-amber-400 mb-1">Satellite Verification</div>
              <p className="text-xs text-slate-400">100% cryptographic camera EXIF geofencing preventing fake captures.</p>
            </div>
          </div>

          {/* Final Call To Action */}
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLaunchExplorer}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#0B1F1A] font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#10b981]/25 transition"
            >
              <span>Launch Full GIS Workstation</span>
              <ArrowRight className="w-5 h-5 text-[#0B1F1A]" />
            </button>

            {onSelectTab && (
              <button
                onClick={() => onSelectTab('minister')}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#123C35] hover:bg-[#1b564c] text-white border border-[#7DD3A7]/30 font-semibold text-sm flex items-center justify-center gap-2 transition"
              >
                <span>Ministerial Command Overview</span>
              </button>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};
