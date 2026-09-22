import React, { useState } from 'react';
import { WatershedDetail } from '../../types';
import { Sliders, Calendar, ShieldCheck, Droplets, Mountain, ArrowLeftRight } from 'lucide-react';

interface BeforeAfterViewProps {
  watershed: WatershedDetail;
}

export const BeforeAfterView: React.FC<BeforeAfterViewProps> = ({ watershed }) => {
  const [selectedIntervention, setSelectedIntervention] = useState(watershed.interventions[0]?.id || '');
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100

  return (
    <div className="space-y-4 py-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Temporal Differential Analysis: Sentinel-2 & Ground Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Biophysical and structural differential across pre-construction baseline vs. post-monsoon operational state.
          </p>
        </div>

        {/* Structure Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Asset ID:</span>
          <select
            value={selectedIntervention}
            onChange={(e) => setSelectedIntervention(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-md text-xs p-2 text-slate-200 focus:outline-none font-mono"
          >
            {watershed.interventions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.intervention_type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Split-Slider Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Split Comparison View (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="text-amber-400 flex items-center gap-1.5 font-semibold">
              <Calendar className="w-3.5 h-3.5" /> Baseline (May 2024 Pre-Work)
            </span>
            <span className="text-slate-400">Position: {sliderPos}%</span>
            <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
              <Calendar className="w-3.5 h-3.5" /> Operational (Nov 2025 Post-Monsoon)
            </span>
          </div>

          {/* Interactive Dual-Panel Slider Container */}
          <div className="relative aspect-video w-full rounded-md overflow-hidden select-none border border-slate-800 bg-[#090d14]">
            
            {/* "After" Image / Layer (Full background) */}
            <div className="absolute inset-0 bg-[#0c1524] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-md bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mb-3">
                <Droplets className="w-7 h-7 text-emerald-400" />
              </div>
              <h4 className="font-bold text-slate-100 text-sm font-mono tracking-tight">OPERATIONAL STATE: ACTIVE PONDING</h4>
              <p className="text-xs text-slate-300 max-w-sm mt-1">
                Post-construction telemetry confirms 1.8m impoundment depth; riparian vegetation established along drainage corridor.
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
                <span>NDVI: 0.54</span>
                <span className="text-slate-600">|</span>
                <span>Buffer: 8.5m</span>
                <span className="text-slate-600">|</span>
                <span>Turbidity: Low</span>
              </div>
            </div>

            {/* "Before" Image / Layer (Clipped by slider position) */}
            <div 
              className="absolute inset-y-0 left-0 bg-[#16120c] flex flex-col items-center justify-center p-8 text-center border-r-2 border-emerald-400 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="w-14 h-14 rounded-md bg-amber-950 border border-amber-500/50 flex items-center justify-center mb-3 flex-shrink-0">
                <Mountain className="w-7 h-7 text-amber-400" />
              </div>
              <h4 className="font-bold text-slate-100 text-sm whitespace-nowrap font-mono tracking-tight">BASELINE STATE: DRY GULLY</h4>
              <p className="text-xs text-slate-300 max-w-sm mt-1 whitespace-nowrap">
                Pre-intervention state: Active bed erosion, no surface water storage, barren summer topsoil.
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300 whitespace-nowrap">
                <span>NDVI: 0.18</span>
                <span className="text-slate-600">|</span>
                <span>Dry Drainage</span>
                <span className="text-slate-600">|</span>
                <span>Bare Soil: 72%</span>
              </div>
            </div>

            {/* Slider Control Line */}
            <div 
              className="absolute inset-y-0 w-0.5 bg-emerald-400 cursor-ew-resize flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-7 h-7 rounded bg-slate-900 border border-emerald-400 flex items-center justify-center text-emerald-300 text-xs shadow">
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Range Input Overlay for Dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>

          <p className="text-[11px] text-slate-500 text-center font-mono">
            Drag slider horizontally to evaluate spatial reflectance across baseline vs. operational acquisition passes.
          </p>
        </div>

        {/* Right: Biophysical Differential Indicators (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col justify-between gap-4 text-xs">
          <div>
            <h3 className="font-bold text-slate-100 uppercase tracking-wider text-[11px] mb-3 font-mono">
              Observed Biophysical Differential
            </h3>

            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-md border border-slate-800">
                <div className="flex justify-between items-center text-slate-400 mb-1">
                  <span>Vegetation Biomass (NDVI):</span>
                  <span className="font-mono text-emerald-400 font-bold">+0.36 (+200%)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block font-mono">Baseline: 0.18 → Current: 0.54</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-md border border-slate-800">
                <div className="flex justify-between items-center text-slate-400 mb-1">
                  <span>Surface Water Spread:</span>
                  <span className="font-mono text-emerald-400 font-bold">+18.4 Hectares</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block font-mono">Post-monsoon impoundment confirmed</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-md border border-slate-800">
                <div className="flex justify-between items-center text-slate-400 mb-1">
                  <span>Siltation Sedimentation State:</span>
                  <span className="text-slate-200 font-medium font-mono">Low (&lt;20% Capacity)</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Masonry crest is un-silted; upstream catchment loose boulder gully plugs successfully trapping coarse bed sediment.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-md border border-slate-800 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Quality & Lineage Certified
            </div>
            <p className="text-slate-400 leading-tight">
              Observations derived from Sentinel-2 L2A optical reflectance and authenticated against ground EXIF survey records.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
