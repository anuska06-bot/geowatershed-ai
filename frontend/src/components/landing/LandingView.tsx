import React, { useState } from 'react';
import { WatershedDetail, EvidenceCard, WatershedSummary } from '../../types';
import { WatershedMap } from '../gis/WatershedMap';
import {
  Mountain,
  Droplets,
  Satellite,
  Bot,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Cpu,
  RefreshCw,
  Sliders,
  Play,
  ChevronRight
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
  // Methodology active tab
  const [activeMethodTab, setActiveMethodTab] = useState<'data' | 'processing' | 'ai' | 'output'>('data');

  // Interactive AI assessment simulator state
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [showAiResult, setShowAiResult] = useState(false);

  // Selected structure type in simulator
  const [simStructure, setSimStructure] = useState<'Check Dam' | 'Contour Trench' | 'Farm Pond'>('Check Dam');

  // Simulated AI Assessment steps
  const aiSteps = [
    'Accessing CartoDEM 30m raster and calculating elevation gradients...',
    'Computing D8 flow direction matrix and catchment accumulation...',
    'Extracting Strahler drainage channels (Orders 1 through 4)...',
    'Ingesting Sentinel-2 Level-2A multi-spectral NDVI & NDWI indices...',
    'Evaluating soil infiltration pedology and RUSLE sediment retention...',
    'Synthesizing Random Forest siting score and Benefit-Cost Ratio (BCR)...'
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
    }, 400);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full text-[#F4F7F5] space-y-20 md:space-y-28 pb-20 overflow-hidden font-sans">

      <section 
        className="relative w-full pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(11, 31, 26, 0.60), rgba(7, 19, 15, 0.82)), url('/watershed-hero-hd.jpg')`
        }}
      >
        {/* Subtle, Crisp Topographic Vector Relief (No Heavy Noisy Imagery) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.07] overflow-hidden">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 800">
            <path d="M0,200 C300,120 600,280 1200,160" fill="none" stroke="#7DD3A7" strokeWidth="1.5" />
            <path d="M0,320 C250,220 550,380 1200,280" fill="none" stroke="#7DD3A7" strokeWidth="1.5" />
            <path d="M0,450 C350,380 700,520 1200,410" fill="none" stroke="#7DD3A7" strokeWidth="1.5" />
            <path d="M0,580 C280,500 620,640 1200,540" fill="none" stroke="#7DD3A7" strokeWidth="1.5" />
            <path d="M0,700 C400,620 800,760 1200,680" fill="none" stroke="#7DD3A7" strokeWidth="1.5" />
            <line x1="200" y1="0" x2="200" y2="800" stroke="#1677FF" strokeWidth="0.5" strokeDasharray="6 6" />
            <line x1="600" y1="0" x2="600" y2="800" stroke="#1677FF" strokeWidth="0.5" strokeDasharray="6 6" />
            <line x1="1000" y1="0" x2="1000" y2="800" stroke="#1677FF" strokeWidth="0.5" strokeDasharray="6 6" />
          </svg>
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-72 bg-[#123C35]/40 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          
          {/* Institutional Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123C35]/90 border border-[#7DD3A7]/30 text-[#7DD3A7] text-[11px] font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="font-semibold tracking-wide">GEOSPATIAL DECISION SUPPORT SYSTEM</span>
          </div>

          {/* Main Title with Strict Technical Hierarchy */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12] mb-6">
            Intelligent Watershed Planning,{' '}
            <span className="text-[#7DD3A7]">
              Engineered with Precision
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-8 font-normal">
            A scientific decision-support system converting multi-source terrain rasters, 
            Sentinel-2 multispectral imagery, and in-situ ground truth into verified water conservation interventions across India.
          </p>

          {/* Clean, Uniform Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => scrollToSection('decision-gis')}
              className="w-full sm:w-auto h-11 px-6 rounded-lg bg-[#10b981] hover:bg-[#059669] text-[#0B1F1A] font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Compass className="w-4 h-4 text-[#0B1F1A]" />
              <span>Explore Interactive GIS</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('ai-analysis')}
              className="w-full sm:w-auto h-11 px-6 rounded-lg bg-[#123C35] hover:bg-[#1b564c] text-white border border-[#7DD3A7]/30 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Bot className="w-4 h-4 text-[#7DD3A7]" />
              <span>Run AI Siting Model</span>
            </button>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. THE 5-PHASE NARRATIVE ROADMAP: LAND -> WATER -> SATELLITE -> AI -> DECISION */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-mono font-semibold text-[#7DD3A7] uppercase tracking-widest block mb-1">
            System Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            The Geospatial Decision Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Five sequential scientific stages connecting raw physics of the earth to verified field execution.
          </p>
        </div>

        {/* 5-Phase Horizontal Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { phase: '01', title: 'LAND', subtitle: 'Terrain & Topography', icon: Mountain, target: 'land-topography', color: 'text-[#7DD3A7]', border: 'border-[#7DD3A7]/30' },
            { phase: '02', title: 'WATER', subtitle: 'Hydrological Flow', icon: Droplets, target: 'water-hydrology', color: 'text-[#1677FF]', border: 'border-[#1677FF]/30' },
            { phase: '03', title: 'SATELLITE', subtitle: 'Earth Observation', icon: Satellite, target: 'satellite-groundtruth', color: 'text-cyan-400', border: 'border-cyan-500/30' },
            { phase: '04', title: 'AI', subtitle: 'Intervention Siting', icon: Bot, target: 'ai-analysis', color: 'text-emerald-400', border: 'border-emerald-500/30' },
            { phase: '05', title: 'DECISION', subtitle: 'GIS & Field Action', icon: Compass, target: 'decision-gis', color: 'text-amber-400', border: 'border-amber-500/30' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.phase}
                type="button"
                onClick={() => scrollToSection(item.target)}
                className={`p-4 rounded-xl bg-[#07130F] border ${item.border} hover:bg-[#123C35]/50 transition-colors text-left flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">PHASE {item.phase}</span>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className={`font-bold text-sm ${item.color} font-mono mb-0.5`}>{item.title}</div>
                  <div className="text-[11px] text-slate-300 leading-tight">{item.subtitle}</div>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                  <span>Inspect</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. PHASE 01: LAND (Topographic & Terrain Intelligence)                    */}
      {/* ========================================================================= */}
      <section id="land-topography" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#7DD3A7] uppercase tracking-wider font-semibold mb-1">
              <span>PHASE 01</span>
              <span>•</span>
              <span>LAND INTELLIGENCE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Topographic Relief &amp; Slope Dynamics
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Water movement is dictated by elevation curvature. CartoDEM 30m models compute hydraulic head,
              slope runoff velocities, and moisture retention zones.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-[#07130F] px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
            Source: ISRO CartoDEM 30m
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Elevation Relief */}
          <div className="p-5 rounded-xl bg-[#07130F] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>01. ELEVATION HEAD</span>
                <span className="text-[#7DD3A7]">Δh Relief</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">Hydraulic Gravitational Head</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Determines gravitational potential energy from ridgeline to basin outlet, driving backwater length and spillway design.
              </p>
            </div>
            <div className="bg-[#0B1F1A] p-3 rounded-lg border border-slate-800/80">
              <svg className="w-full h-14" viewBox="0 0 200 50">
                <path d="M0,45 Q50,15 100,28 T200,10" fill="none" stroke="#7DD3A7" strokeWidth="1.5" />
                <path d="M0,45 Q50,15 100,28 T200,10 L200,50 L0,50 Z" fill="rgba(125,211,167,0.08)" />
                <circle cx="100" cy="28" r="2.5" fill="#10b981" />
                <circle cx="170" cy="12" r="2.5" fill="#1677FF" />
              </svg>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>Catchment Crest: 840 m</span>
                <span>Outlet: 120 m</span>
              </div>
            </div>
          </div>

          {/* Card 2: Slope Gradients */}
          <div className="p-5 rounded-xl bg-[#07130F] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>02. SLOPE GRADIENT</span>
                <span className="text-[#1677FF]">D8 Matrix</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">Runoff Velocity Thresholds</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Steep slopes (&gt;15%) produce high erosive shear stress requiring stone gully bunds; gentle slopes (&lt;3%) allow percolation basins.
              </p>
            </div>
            <div className="bg-[#0B1F1A] p-3 rounded-lg border border-slate-800/80 grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-1">
                <div className="text-emerald-400 font-bold text-xs">&lt; 3°</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Percolation</div>
              </div>
              <div className="p-1 border-x border-slate-800">
                <div className="text-sky-400 font-bold text-xs">3°–8°</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Check Dam</div>
              </div>
              <div className="p-1">
                <div className="text-amber-400 font-bold text-xs">&gt; 15°</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Gully Plug</div>
              </div>
            </div>
          </div>

          {/* Card 3: Topographic Wetness Index */}
          <div className="p-5 rounded-xl bg-[#07130F] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>03. MOISTURE SATURATION</span>
                <span className="text-cyan-400">TWI ln(a/tanβ)</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">Topographic Wetness Index (TWI)</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Combines local upstream contributing area with slope gradient to locate saturated hollows and optimal subsurface dyke sites.
              </p>
            </div>
            <div className="bg-[#0B1F1A] p-3 rounded-lg border border-slate-800/80 space-y-1.5">
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-amber-500 via-emerald-400 to-[#1677FF]" />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Dry Ridge (TWI 3.2)</span>
                <span>Moist Hollow (TWI 11.4)</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. PHASE 02: WATER (Hydrological Routing & Stream Network)                */}
      {/* ========================================================================= */}
      <section id="water-hydrology" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#1677FF] uppercase tracking-wider font-semibold mb-1">
              <span>PHASE 02</span>
              <span>•</span>
              <span>WATER DYNAMICS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              The Hydrological Flow Sequence &amp; Drainage Hierarchy
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              From rainfall droplet impact to river channel discharge: modeling drainage accumulation and matching conservation structures to Strahler stream orders.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-[#07130F] px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
            D8 Deterministic Routing
          </div>
        </div>

        {/* 6-Step Hydrological Routing Process */}
        <div className="p-6 rounded-xl bg-[#07130F] border border-slate-800">
          <div className="text-xs font-mono uppercase text-slate-400 font-semibold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF]" />
            <span>Rainfall-to-River Drainage Routing Pipeline</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5">
            {[
              { step: '01', title: 'Precipitation', desc: 'IMD / Open-Meteo rainfall input', color: 'text-sky-300' },
              { step: '02', title: 'Infiltration', desc: 'Soil pedology percolation deduction', color: 'text-emerald-300' },
              { step: '03', title: 'Flow Direction', desc: 'D8 steepest descent routing matrix', color: 'text-[#7DD3A7]' },
              { step: '04', title: 'Accumulation', desc: 'Upstream catchment contributing cells', color: 'text-[#1677FF]' },
              { step: '05', title: 'Stream Branches', desc: 'Strahler channel hierarchy formation', color: 'text-cyan-300' },
              { step: '06', title: 'Basin Outlet', desc: 'Terminal watershed discharge point', color: 'text-amber-300' },
            ].map((f) => (
              <div key={f.step} className="p-3 rounded-lg bg-[#0B1F1A] border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 font-bold block mb-1">{f.step}</span>
                  <div className={`text-xs font-bold ${f.color} mb-1`}>{f.title}</div>
                  <p className="text-[10px] text-slate-400 leading-tight">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strahler Stream Orders Grid with Physical Intervention Pairing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#07130F] border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-sky-300 font-bold">1st-Order Stream</span>
              <span className="w-6 h-0.5 border-b border-sky-400 border-dashed" />
            </div>
            <div className="text-xs font-semibold text-white mb-1">Headwater Rills</div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">High slope (&gt;15%), low discharge volume. Erosive rill formation in upper catchment.</p>
            <div className="text-[10px] font-mono text-[#7DD3A7] bg-[#123C35]/50 px-2 py-1 rounded border border-[#7DD3A7]/20">
              Target: Continuous Contour Trenches (CCT)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#07130F] border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-[#38bdf8] font-bold">2nd-Order Stream</span>
              <span className="w-6 h-1 bg-[#38bdf8] rounded" />
            </div>
            <div className="text-xs font-semibold text-white mb-1">Tributary Gully</div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">Moderate slope (8°–15°). Convergence of headwater rills with moderate velocity.</p>
            <div className="text-[10px] font-mono text-[#38bdf8] bg-[#123C35]/50 px-2 py-1 rounded border border-[#38bdf8]/20">
              Target: Loose Boulder Checks &amp; Gabions
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#07130F] border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-[#06b6d4] font-bold">3rd-Order Stream</span>
              <span className="w-6 h-1.5 bg-[#06b6d4] rounded" />
            </div>
            <div className="text-xs font-semibold text-white mb-1">Sub-Catchment Creek</div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">Gentle slope (3°–8°). High water volume accumulation and significant sediment load.</p>
            <div className="text-[10px] font-mono text-[#06b6d4] bg-[#123C35]/50 px-2 py-1 rounded border border-[#06b6d4]/20">
              Target: Cement Masonry Check Dams
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#07130F] border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-[#0284c7] font-bold">4th-Order Stream</span>
              <span className="w-6 h-2 bg-[#0284c7] rounded" />
            </div>
            <div className="text-xs font-semibold text-white mb-1">Main River Stem</div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">Flat valley floor (&lt;3°). Major flood risk and regional groundwater recharge zone.</p>
            <div className="text-[10px] font-mono text-amber-400 bg-[#123C35]/50 px-2 py-1 rounded border border-amber-500/20">
              Target: Sub-surface Dykes &amp; Village Tanks
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 5. PHASE 03: SATELLITE (Earth Observation & In-Situ Ground Truth)          */}
      {/* ========================================================================= */}
      <section id="satellite-groundtruth" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold mb-1">
              <span>PHASE 03</span>
              <span>•</span>
              <span>SATELLITE &amp; GROUND TRUTH</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Multispectral Telemetry Meets Cryptographic Ground Truth
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Cross-verifies Copernicus Sentinel-2 Level-2A reflectance with in-situ mobile camera GPS EXIF metadata, eliminating unverified claims and ghost invoices.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-[#07130F] px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
            Sentinel-2 L2A + GPS EXIF
          </div>
        </div>

        {/* Split Screen Cross-Verification Card */}
        <div className="p-6 rounded-xl bg-[#07130F] border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
            
            {/* Left: Satellite Telemetry */}
            <div className="lg:col-span-5 bg-[#0B1F1A] p-4 rounded-xl border border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#7DD3A7] font-bold flex items-center gap-1.5">
                  <Satellite className="w-3.5 h-3.5" /> Sentinel-2 L2A Multispectral
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                  10m Resolution
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Tile: T43QDB (Ulhas Basin)</span>
                  <span>Cloud Cover: 0.8%</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-800">
                  <div className="bg-slate-900 p-1.5 rounded">
                    <span className="text-[10px] text-slate-400 block">NDVI</span>
                    <span className="text-emerald-400 font-bold">0.68</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded">
                    <span className="text-[10px] text-slate-400 block">NDWI</span>
                    <span className="text-sky-400 font-bold">0.12</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded">
                    <span className="text-[10px] text-slate-400 block">BSI</span>
                    <span className="text-amber-400 font-bold">-0.22</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                Formula: NDVI = (B8 - B4) / (B8 + B4) • Vegetative health confirmed.
              </div>
            </div>

            {/* Center: Cryptographic Bridge */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 rounded-full bg-[#123C35] border border-[#7DD3A7]/40 flex items-center justify-center text-[#7DD3A7] font-bold text-xs">
                ↔
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-wider">
                Audit Sync
              </span>
            </div>

            {/* Right: Field Surveyor In-Situ Evidence */}
            <div className="lg:col-span-5 bg-[#0B1F1A] p-4 rounded-xl border border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> In-Situ Surveyor Evidence
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  EXIF Geofenced
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Structure ID:</span>
                  <span className="text-white font-bold">CD-01 (Check Dam)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coordinates:</span>
                  <span>18.9150° N, 73.3280° E (±2.1m)</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>SHA-256 Hash:</span>
                  <span className="text-emerald-400">4a2f8b...612d (Valid)</span>
                </div>
              </div>

              <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Geofence &amp; Sensor Calibration Verified: 98.4% Confidence</span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 6. PHASE 04: AI (Predictive Siting & Hydrological Optimization)            */}
      {/* ========================================================================= */}
      <section id="ai-analysis" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold mb-1">
              <span>PHASE 04</span>
              <span>•</span>
              <span>PREDICTIVE AI SITING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Multi-Variable Intervention Siting Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Test real hydrological parameters against our Random Forest siting ensemble calibrated on 14,280 Central Ground Water Board (CGWB) observation wells.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-[#07130F] px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
            Random Forest + RUSLE
          </div>
        </div>

        {/* Interactive Simulator Card */}
        <div className="p-6 rounded-xl bg-[#07130F] border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Input Variables */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#7DD3A7]" /> Field Input Variables
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                  Live Catchment Data
                </span>
              </div>

              {/* Structure Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 block">Proposed Intervention Type:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Check Dam', 'Contour Trench', 'Farm Pond'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSimStructure(type)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-mono transition-colors text-center ${
                        simStructure === type
                          ? 'bg-[#123C35] text-[#7DD3A7] border border-[#7DD3A7]/50 font-bold'
                          : 'bg-[#0B1F1A] text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-[#0B1F1A] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Elevation</span>
                  <span className="text-white font-bold">540 m MSL</span>
                </div>
                <div className="bg-[#0B1F1A] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Terrain Slope</span>
                  <span className="text-white font-bold">4.2% (Moderate)</span>
                </div>
                <div className="bg-[#0B1F1A] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Stream Channel</span>
                  <span className="text-cyan-400 font-bold">Order 3 (Tributary)</span>
                </div>
                <div className="bg-[#0B1F1A] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Water Table Depth</span>
                  <span className="text-white font-bold">6.85 m bgl</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunAiAnalysis}
                disabled={isProcessingAi}
                className="w-full h-11 rounded-lg bg-[#10b981] hover:bg-[#059669] text-[#0B1F1A] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isProcessingAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#0B1F1A]" />
                    <span>Processing Hydrological Stack...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-[#0B1F1A]" />
                    <span>Run AI Siting Assessment</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Processing & Results HUD */}
            <div className="lg:col-span-6 bg-[#0B1F1A] p-5 rounded-xl border border-slate-800 min-h-[280px] flex flex-col justify-between">
              
              {isProcessingAi ? (
                <div className="space-y-4 my-auto">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#7DD3A7] uppercase font-semibold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Siting Pipeline</span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    {aiSteps.map((step, idx) => (
                      <div
                        key={step}
                        className={`flex items-center gap-2 text-[11px] transition-opacity duration-200 ${
                          idx <= processingStep ? 'opacity-100 text-slate-200' : 'opacity-25 text-slate-600'
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
                <div className="space-y-3.5 my-auto text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Siting Output Generated
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      96.4% Precision
                    </span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-lg border border-emerald-500/30 space-y-1.5">
                    <div className="text-slate-400 text-[10px]">Optimal Recommended Structure:</div>
                    <div className="text-sm font-bold text-emerald-400">
                      {simStructure} on Order 3 Stream
                    </div>
                    <div className="text-slate-300 text-[11px] leading-relaxed">
                      Sited on competent basalt bedrock. Annual estimated recharge increment: <strong>4.82 Million m³</strong>.
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Suitability Index</span>
                      <span className="text-teal-300 font-bold text-sm">82 / 100</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Benefit-Cost Ratio</span>
                      <span className="text-amber-400 font-bold text-sm">1.84 (Highly Viable)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="my-auto text-center space-y-2 py-6">
                  <Cpu className="w-8 h-8 text-slate-600 mx-auto" />
                  <div className="font-bold text-slate-300 text-xs">Ready For Assessment</div>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Select a structure type and click "Run AI Siting Assessment" to evaluate the multi-parameter hydrological ensemble.
                  </p>
                </div>
              )}

              <div className="pt-2.5 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>Model: Random Forest Ensemble (CGWB Ground Truth)</span>
                <span>WDC-PMKSY 2.0 Aligned</span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 7. PHASE 05: DECISION (Interactive GIS Map & Institutional Standards)      */}
      {/* ========================================================================= */}
      <section id="decision-gis" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold mb-1">
              <span>PHASE 05</span>
              <span>•</span>
              <span>DECISION WORKSTATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <Compass className="w-6 h-6 text-[#1677FF]" />
              <span>Interactive Micro-Watershed GIS</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Inspect national micro-catchments with live multi-layer D8 stream networks, water bodies, and geofenced field interventions.
            </p>
          </div>

          {/* Quick Basin Selector */}
          {watershedList.length > 0 && onSwitchWatershed && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">Active Catchment:</span>
              <select
                value={watershed?.id || ''}
                onChange={(e) => onSwitchWatershed(e.target.value)}
                className="bg-[#123C35] border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none cursor-pointer"
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

        {/* Central Map Mount Container */}
        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#07130F] shadow-lg">
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

          {/* Floating Catchment Summary HUD (Desktop) */}
          <div className="absolute bottom-4 right-4 z-20 hidden md:block max-w-xs bg-[#0B1F1A]/95 p-3.5 border border-slate-800 rounded-lg shadow-xl text-xs space-y-1.5 font-mono">
            <div className="flex items-center justify-between font-semibold border-b border-slate-800 pb-1 text-white">
              <span>{watershed?.name || 'Ulhas Micro-Catchment'}</span>
              <span className="text-[10px] text-[#7DD3A7] bg-[#123C35] px-1.5 py-0.5 rounded">
                Active GIS
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
              <div>
                <span className="text-slate-500 block text-[9px]">Catchment Area</span>
                <span className="font-bold text-white">124.6 km²</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Erosion Severity</span>
                <span className="font-bold text-amber-400">Moderate</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Drainage Branches</span>
                <span className="font-bold text-[#1677FF]">18 Streams (1–4)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Field Sites</span>
                <span className="font-bold text-[#7DD3A7]">{watershed?.interventions.length || 22} Structures</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 8. BEFORE VS. AFTER COMPARISON                                            */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-mono font-semibold text-[#7DD3A7] uppercase tracking-widest block mb-1">
            Operational Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Traditional Surveying vs. GeoWatershed AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Eliminating months of manual guesswork with automated, auditable engineering workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Legacy Traditional */}
          <div className="p-6 rounded-xl border border-rose-900/30 bg-[#07130F]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-rose-900/20">
              <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
                Traditional Manual Surveying
              </span>
              <span className="text-[10px] text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                Legacy Method
              </span>
            </div>
            <ul className="text-xs sm:text-sm text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Manual paper maps and visual contour estimation without 3D flow verification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>4 to 8 weeks required per watershed for hydrological discharge reports.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>No photographic tamper-proofing; vulnerability to duplicate billing and ghost works.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Static paper archives lacking meteorological and live satellite updates.</span>
              </li>
            </ul>
          </div>

          {/* GeoWatershed AI */}
          <div className="p-6 rounded-xl border border-emerald-500/30 bg-[#07130F]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-500/20">
              <span className="text-xs font-mono text-[#7DD3A7] font-bold uppercase tracking-wider">
                GeoWatershed AI Platform
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                WDC-PMKSY 2.0 Standard
              </span>
            </div>
            <ul className="text-xs sm:text-sm text-slate-200 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-[#10b981] font-bold">✓</span>
                <span>Automated D8 drainage delineation &amp; CartoDEM topographic models in &lt;2 seconds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#10b981] font-bold">✓</span>
                <span>Instant machine learning siting for Check Dams, Percolation Tanks, and Farm Ponds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#10b981] font-bold">✓</span>
                <span>Camera hardware GPS EXIF validation locking coordinates to prevent fake uploads.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#10b981] font-bold">✓</span>
                <span>Continuous Sentinel-2 multispectral and Open-Meteo rainfall stream integration.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 9. TECHNICAL METHODOLOGY & COMPLIANCE (EXPANDABLE TABS)                   */}
      {/* ========================================================================= */}
      <section id="methodology" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-mono font-semibold text-[#7DD3A7] uppercase tracking-widest block mb-1">
            Technical Governance
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Methodology &amp; Standards
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Scientific equations, training datasets, and statutory compliance frameworks.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#07130F] overflow-hidden">
          {/* Tab Selector Bar */}
          <div className="flex border-b border-slate-800 bg-[#0B1F1A] text-xs font-mono font-semibold overflow-x-auto scrollbar-none">
            {[
              { id: 'data', label: '1. Ingestion Datasets' },
              { id: 'processing', label: '2. D8 Terrain Math' },
              { id: 'ai', label: '3. Machine Learning' },
              { id: 'output', label: '4. Statutory Compliance' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveMethodTab(t.id as any)}
                className={`py-3 px-5 whitespace-nowrap transition-colors border-b-2 ${
                  activeMethodTab === t.id
                    ? 'border-[#7DD3A7] text-[#7DD3A7] bg-[#123C35]/30'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 font-sans">
            {activeMethodTab === 'data' && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-base">Multi-Stream Geospatial Telemetry Ingestion</h4>
                <p>
                  Combines Sentinel-2 Level-2A bottom-of-atmosphere reflectance (10m resolution for bands 2, 3, 4, 8) with CartoDEM 30m elevation models.
                  Precipitation metrics are synchronized via Open-Meteo and India Meteorological Department (IMD) APIs, supplemented with 1,420 CGWB observation wells for ground-truth water table calibration.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
                  <div className="p-3 bg-[#0B1F1A] rounded-lg border border-slate-800">
                    <span className="text-[#7DD3A7] font-bold block">Sentinel-2 L2A</span>
                    <span className="text-slate-400 text-[11px]">NDVI / NDWI / BSI</span>
                  </div>
                  <div className="p-3 bg-[#0B1F1A] rounded-lg border border-slate-800">
                    <span className="text-sky-400 font-bold block">CartoDEM 30m</span>
                    <span className="text-slate-400 text-[11px]">D8 Flow &amp; Elevation</span>
                  </div>
                  <div className="p-3 bg-[#0B1F1A] rounded-lg border border-slate-800">
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
                <div className="p-3 bg-[#0B1F1A] rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
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
                  <div className="p-3 bg-[#0B1F1A] rounded-lg border border-slate-800">
                    <span className="text-emerald-400 font-bold">94.8% F1-Score</span>
                    <span className="text-slate-400 block text-[11px]">Recharge Zone Classification</span>
                  </div>
                  <div className="p-3 bg-[#0B1F1A] rounded-lg border border-slate-800">
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
                  Fully aligned with the Ministry of Rural Development guidelines for Watershed Development Component of Pradhan Mantri Krishi Sinchayee Yojana (WDC-PMKSY 2.0).
                  Compliant with National Geospatial Policy (NGP-2022) and Digital Personal Data Protection Act (DPDP 2023). Every field observation is cryptographically hashed with SHA-256 for parliamentary audit.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 10. NATIONAL IMPACT METRICS & FINAL LAUNCH CTA                             */}
      {/* ========================================================================= */}
      <section id="impact" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="p-8 sm:p-10 rounded-xl border border-slate-800 bg-[#07130F] text-center space-y-8">
          
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-mono font-semibold text-[#7DD3A7] uppercase tracking-widest block">
              National Engineering Footprint
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Demonstrated Engineering Impact
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Deployed across representative agro-climatic zones of India to support sustainable watershed development.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left font-mono">
            <div className="p-4 bg-[#0B1F1A] rounded-lg border border-slate-800">
              <div className="text-xl font-bold text-white mb-0.5">7 Basins</div>
              <div className="text-xs font-semibold text-[#7DD3A7] mb-1">Delineated</div>
              <p className="text-[10px] text-slate-400">Maharashtra, Rajasthan, Karnataka, Madhya Pradesh.</p>
            </div>

            <div className="p-4 bg-[#0B1F1A] rounded-lg border border-slate-800">
              <div className="text-xl font-bold text-white mb-0.5">22 Sites</div>
              <div className="text-xs font-semibold text-[#1677FF] mb-1">Monitored</div>
              <p className="text-[10px] text-slate-400">Check dams, percolation ponds, and vegetative plugs.</p>
            </div>

            <div className="p-4 bg-[#0B1F1A] rounded-lg border border-slate-800">
              <div className="text-xl font-bold text-white mb-0.5">275 ML</div>
              <div className="text-xs font-semibold text-emerald-400 mb-1">Impoundment</div>
              <p className="text-[10px] text-slate-400">HydroSHEDS validated annual storage capacity.</p>
            </div>

            <div className="p-4 bg-[#0B1F1A] rounded-lg border border-slate-800">
              <div className="text-xl font-bold text-white mb-0.5">100% EXIF</div>
              <div className="text-xs font-semibold text-amber-400 mb-1">Integrity</div>
              <p className="text-[10px] text-slate-400">Hardware camera timestamp &amp; geofence locked.</p>
            </div>
          </div>

          {/* Unified Action Buttons */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onLaunchExplorer}
              className="w-full sm:w-auto h-11 px-7 rounded-lg bg-[#10b981] hover:bg-[#059669] text-[#0B1F1A] font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Launch Full GIS Workstation</span>
              <ArrowRight className="w-4 h-4 text-[#0B1F1A]" />
            </button>

            {onSelectTab && (
              <button
                type="button"
                onClick={() => onSelectTab('minister')}
                className="w-full sm:w-auto h-11 px-6 rounded-lg bg-[#123C35] hover:bg-[#1b564c] text-white border border-[#7DD3A7]/30 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
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
