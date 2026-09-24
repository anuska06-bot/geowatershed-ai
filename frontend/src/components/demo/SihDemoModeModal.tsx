import React, { useState } from 'react';
import { WatershedDetail } from '../../types';
import { Play, CheckCircle2, ChevronRight, ChevronLeft, X } from 'lucide-react';

interface SihDemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  watershed?: WatershedDetail | null;
  onNavigateTab: (tab: any) => void;
  onOpenReport?: () => void;
  currentTab?: string;
}

interface DemoStep {
  stepNumber: number;
  title: string;
  targetTab: string;
  description: string;
  keyHighlight: string;
  technicalMetric: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Select Micro-Watershed Pilot Catchment',
    targetTab: 'dashboard',
    description: 'Initializes the Karjat Micro-Watershed (MH-WDC-042) covering 2,450 hectares in the Ulhas Basin, Maharashtra.',
    keyHighlight: 'Ridge-to-valley catchment boundary enforced via WDC-PMKSY 2.0 GIS standards.',
    technicalMetric: 'Area: 2,450 ha • Centroid: 18.915°N, 73.328°E'
  },
  {
    stepNumber: 2,
    title: 'Load GIS Hydrological Layers',
    targetTab: 'explorer',
    description: 'Streams CartoDEM 30m terrain, ESRI World Imagery, and D8 flow direction vector layer groups.',
    keyHighlight: 'Automated D8 flow accumulation resolves Strahler stream orders (Orders 1 to 4).',
    technicalMetric: 'Drainage Density: 2.8 km/km² • Stream Orders: 1 - 4'
  },
  {
    stepNumber: 3,
    title: 'Inspect Terrain & Slope Gradients',
    targetTab: 'analysis',
    description: 'Calculates slope gradient matrices and Topographic Wetness Index (TWI) to map saturation-excess runoff corridors.',
    keyHighlight: 'Categorizes slopes into upper ridge conservation (15-28%) and valley floor storage (1-3%).',
    technicalMetric: 'Elevation Range: 98m to 340m (Drop: 242m)'
  },
  {
    stepNumber: 4,
    title: 'Ingest Geo-Coded Field Photography',
    targetTab: 'image-intelligence',
    description: 'Ingests field evidence captured by WDT surveyors with automatic EXIF GPS extraction and SHA-256 seal.',
    keyHighlight: 'Validates photo location against nearest stream bed using Haversine distance geofence.',
    technicalMetric: 'Integrity: SHA-256 Validated • Sensor: EXIF GPS'
  },
  {
    stepNumber: 5,
    title: 'AI-Assisted Intervention Identification',
    targetTab: 'image-intelligence',
    description: 'Demonstration computer-vision classifier classifies structure as Check Dam with sediment accumulation detection.',
    keyHighlight: 'Identifies weir condition and flags minor sediment depth (14%) at upstream apron.',
    technicalMetric: 'Classification: Check Dam • Conf: 91.5% (Demo)'
  },
  {
    stepNumber: 6,
    title: 'Map Interventions to Geographic Coordinates',
    targetTab: 'interventions',
    description: 'Displays all 14 soil & water conservation structures across the catchment with distinct visual symbology.',
    keyHighlight: 'Full inventory tracking construction status, inspection history, and downstream impact.',
    technicalMetric: 'Inventory: 14 Structures • Status: 100% Geo-Tagged'
  },
  {
    stepNumber: 7,
    title: 'Multi-Spectral Before vs After Comparison',
    targetTab: 'change-detection',
    description: 'Loads interactive slider comparing Sentinel-2 surface reflectance before (2024) and after (2026) treatment.',
    keyHighlight: 'Multi-band analysis evaluates vegetation vigor (NDVI) and surface water persistence (NDWI).',
    technicalMetric: 'NDVI Delta: +0.20 • Water Spread: +7.4 ha'
  },
  {
    stepNumber: 8,
    title: 'Quantify Soil Moisture & Greenness Gain',
    targetTab: 'change-detection',
    description: 'Extracts statistical histograms demonstrating bare soil reduction and extended rabi soil moisture persistence.',
    keyHighlight: 'Rigorous scientific wording: observed vegetation change (avoiding false single-cause claims).',
    technicalMetric: 'Bare Soil Reduction: -17.3% • Stat Sig: p < 0.01'
  },
  {
    stepNumber: 9,
    title: 'Prioritize High Erosion Catchment Zones',
    targetTab: 'recommendations',
    description: 'Delineates active headward gully erosion zones on the northern ridge requiring rapid physical intervention.',
    keyHighlight: 'Algorithmic multi-criteria evaluation combining slope, stream power index, and bare soil.',
    technicalMetric: 'Priority Level: HIGH • Hazard: Gully Incision'
  },
  {
    stepNumber: 10,
    title: 'AI-Assisted Siting & Preliminary Costing',
    targetTab: 'recommendations',
    description: 'Recommends gravity masonry check dam on 3rd-order stream with material specifications and bill of quantities.',
    keyHighlight: 'Includes preliminary cost breakdown (₹4.40 Lakh) and energy-dissipating drainage route.',
    technicalMetric: 'Recommended: Stone Masonry Check Dam (₹4.40 L)'
  },
  {
    stepNumber: 11,
    title: 'Generate Statutory Outcome Report',
    targetTab: 'reports',
    description: 'Compiles the full 15-section Watershed Assessment Report ready for DLC review and PDF export.',
    keyHighlight: 'Official government document format with statutory disclaimers and WDT sign-off blocks.',
    technicalMetric: 'Format: 15-Point WDC-PMKSY Audit Dossier'
  }
];

export const SihDemoModeModal: React.FC<SihDemoModeModalProps> = ({
  isOpen,
  onClose,
  watershed,
  onNavigateTab,
  onOpenReport
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onNavigateTab(DEMO_STEPS[nextIdx].targetTab);
    } else {
      if (onOpenReport) onOpenReport();
      else onNavigateTab('reports');
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onNavigateTab(DEMO_STEPS[prevIdx].targetTab);
    }
  };

  const handleJumpToStep = (idx: number) => {
    setCurrentStepIndex(idx);
    onNavigateTab(DEMO_STEPS[idx].targetTab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0B1F1A] border border-[#7DD3A7]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#07130F]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#123C35] border border-[#7DD3A7]/40 flex items-center justify-center text-[#7DD3A7]">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-mono">SIH 2026 Demo Mode</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#123C35] text-[#7DD3A7] border border-[#7DD3A7]/30">
                  Problem Statement 26015
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                2-to-3 minute guided evaluation sequence for hackathon judges • {watershed?.name || 'WDC-PMKSY Catchment'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="px-6 py-3 bg-[#07130F]/60 border-b border-slate-800/80 flex items-center justify-between overflow-x-auto scrollbar-none gap-1">
          {DEMO_STEPS.map((s, idx) => (
            <button
              key={s.stepNumber}
              onClick={() => handleJumpToStep(idx)}
              className={`w-7 h-7 rounded-full text-xs font-mono font-bold shrink-0 transition flex items-center justify-center ${
                idx === currentStepIndex
                  ? 'bg-[#10b981] text-[#0B1F1A] shadow-md ring-2 ring-[#7DD3A7]/40'
                  : idx < currentStepIndex
                  ? 'bg-[#123C35] text-[#7DD3A7] border border-[#7DD3A7]/30'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {s.stepNumber}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-7 space-y-5 text-xs">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>STEP {currentStep.stepNumber} OF {DEMO_STEPS.length}</span>
              <span className="text-[#7DD3A7] bg-[#123C35] px-2 py-0.5 rounded border border-[#7DD3A7]/30">
                Active View: {currentStep.targetTab.toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white font-mono">
              {currentStep.title}
            </h3>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Technical Metric Box */}
          <div className="p-4 bg-[#07130F] border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="uppercase font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7DD3A7]" />
                Key Technical Validation:
              </span>
              <span className="text-[#7DD3A7] font-bold">{currentStep.technicalMetric}</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {currentStep.keyHighlight}
            </p>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#07130F] border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-3.5 py-2 rounded-lg bg-[#0B1F1A] border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-lg bg-[#10b981] hover:bg-[#10b981]/90 text-[#0B1F1A] font-bold text-xs font-mono transition flex items-center gap-1.5 shadow-md"
          >
            <span>{currentStepIndex === DEMO_STEPS.length - 1 ? 'Finish & Open Report' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
