import React, { useState, useRef, useEffect } from 'react';
import { WatershedDetail } from '../../types';
import { WATERSHED_CHANGE_DETECTION_RECORDS } from '../../data/sihWatershedData';
import { 
  TrendingUp, ArrowLeftRight, Play, Pause, Info
} from 'lucide-react';

interface ChangeDetectionViewProps {
  watershed: WatershedDetail;
}

type IndicatorBand = 'ndvi' | 'ndwi' | 'rgb' | 'bare_soil';

export const ChangeDetectionView: React.FC<ChangeDetectionViewProps> = ({ watershed }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>(watershed.code || 'MH-WDC-042');
  const [indicator, setIndicator] = useState<IndicatorBand>('ndvi');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const activeRecord = WATERSHED_CHANGE_DETECTION_RECORDS[selectedLocation] || WATERSHED_CHANGE_DETECTION_RECORDS['MH-WDC-042'];

  // Handle smooth drag on slider
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1 && e.type !== 'pointerdown') return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = Math.round((x / rect.width) * 100);
    setSliderPos(pct);
  };

  // Automated sweep animation
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
  }, [isPlaying, sliderPos]);

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-[#0B1F1A] border border-[#7DD3A7]/25 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#123C35] border border-[#7DD3A7]/30 text-[#7DD3A7] text-[11px] font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-[#1677FF]" />
              <span>MULTI-SPECTRAL CHANGE DETECTION</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Watershed Change Detection &amp; Temporal Outcome Audit
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Compare Sentinel-2 multispectral surface reflectance between pre-intervention baseline and post-treatment operations 
              across vegetation (NDVI), surface water (NDWI), and bare soil.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-2 rounded-lg bg-[#123C35] hover:bg-[#123C35]/80 text-[#7DD3A7] border border-[#7DD3A7]/30 text-xs font-mono font-semibold transition flex items-center gap-1.5"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Sweep' : 'Auto Sweep'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (8 Cols): Interactive Slider Workstation */}
        <div className="lg:col-span-8 bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-[#7DD3A7] uppercase tracking-wider block">
                Target Catchment Zone
              </span>
              <h3 className="font-bold text-sm text-white font-mono">
                {activeRecord.location_name}
              </h3>
            </div>

            {/* Band Selector */}
            <div className="flex items-center gap-1 bg-[#07130F] p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setIndicator('ndvi')}
                className={`px-2.5 py-1 rounded transition ${
                  indicator === 'ndvi' ? 'bg-[#10b981] text-[#0B1F1A] font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                NDVI (Vegetation)
              </button>
              <button
                onClick={() => setIndicator('ndwi')}
                className={`px-2.5 py-1 rounded transition ${
                  indicator === 'ndwi' ? 'bg-[#1677FF] text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                NDWI (Water)
              </button>
              <button
                onClick={() => setIndicator('bare_soil')}
                className={`px-2.5 py-1 rounded transition ${
                  indicator === 'bare_soil' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bare Soil (BSI)
              </button>
            </div>
          </div>

          {/* Dual Comparison Slider Container */}
          <div 
            ref={containerRef}
            onPointerDown={handlePointerMove}
            onPointerMove={handlePointerMove}
            className="relative w-full h-[380px] sm:h-[460px] rounded-xl overflow-hidden border border-slate-800 select-none cursor-ew-resize touch-none shadow-inner bg-[#07130F]"
          >
            {/* "AFTER" Image (Base layer) */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: indicator === 'ndvi' 
                  ? `linear-gradient(to bottom, rgba(16, 185, 129, 0.40), rgba(7, 19, 15, 0.75)), url('/watershed-hero-hd.jpg')`
                  : indicator === 'ndwi'
                  ? `linear-gradient(to bottom, rgba(22, 119, 255, 0.45), rgba(7, 19, 15, 0.75)), url('/watershed-hero-hd.jpg')`
                  : `linear-gradient(to bottom, rgba(217, 119, 6, 0.35), rgba(7, 19, 15, 0.75)), url('/watershed-hero-hd.jpg')`
              }}
            >
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-[#07130F]/90 backdrop-blur-md border border-[#7DD3A7]/40 text-[#7DD3A7] text-xs font-mono font-bold shadow-md">
                AFTER: {activeRecord.after_date.split(' ')[0]} (Operational)
              </div>
            </div>

            {/* "BEFORE" Image (Clipped layer) */}
            <div 
              className="absolute inset-0 bg-cover bg-center border-r-2 border-white shadow-2xl"
              style={{
                width: `${sliderPos}%`,
                backgroundImage: indicator === 'ndvi' 
                  ? `linear-gradient(to bottom, rgba(115, 115, 115, 0.55), rgba(7, 19, 15, 0.85)), url('/watershed-hero-hd.jpg')`
                  : indicator === 'ndwi'
                  ? `linear-gradient(to bottom, rgba(100, 116, 139, 0.55), rgba(7, 19, 15, 0.85)), url('/watershed-hero-hd.jpg')`
                  : `linear-gradient(to bottom, rgba(180, 83, 9, 0.55), rgba(7, 19, 15, 0.85)), url('/watershed-hero-hd.jpg')`
              }}
            >
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-[#07130F]/90 backdrop-blur-md border border-slate-700 text-slate-300 text-xs font-mono font-bold shadow-md">
                BEFORE: {activeRecord.before_date.split(' ')[0]} (Baseline)
              </div>
            </div>

            {/* Vertical Divider Line with Grab Handle */}
            <div 
              className="absolute top-0 bottom-0 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="relative -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#10b981] text-[#0B1F1A] border-2 border-white flex items-center justify-center shadow-xl">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
            </div>

            {/* Bottom helper label */}
            <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono text-slate-300 border border-slate-700">
                Drag slider horizontally to inspect temporal transition ({sliderPos}%)
              </span>
            </div>
          </div>

          {/* Scientific Attribution Disclaimer */}
          <div className="p-3 bg-[#07130F] border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-400 font-sans">
            <Info className="w-4 h-4 text-[#7DD3A7] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold text-white">Scientific Attribution Note:</span> {activeRecord.scientific_observation}
            </p>
          </div>
        </div>

        {/* Right Column (4 Cols): Quantified Statistics & Change Metrics */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Location Selector */}
          <div className="bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <label className="block text-[11px] font-mono text-slate-400">
              Select Watershed Pilot Catchment:
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-[#07130F] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#7DD3A7]"
            >
              <option value="MH-WDC-042">MH-WDC-042 (Karjat, Maharashtra)</option>
              <option value="RJ-WDC-108">RJ-WDC-108 (Alwar, Rajasthan)</option>
              <option value="MP-WDC-077">MP-WDC-077 (Jhabua, Madhya Pradesh)</option>
            </select>
          </div>

          {/* Quantified Change Matrix */}
          <div className="bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h4 className="font-bold text-xs text-white font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
              Multi-Spectral Change Delta
            </h4>

            {/* Metric 1: NDVI */}
            <div className="space-y-1.5 p-3 bg-[#07130F] border border-slate-800 rounded-xl">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Vegetation Index (NDVI)</span>
                <span className="text-[#7DD3A7] font-bold">+{activeRecord.ndvi_change_observed.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>Pre: {activeRecord.baseline_ndvi.toFixed(2)}</span>
                <span>Post: {activeRecord.operational_ndvi.toFixed(2)}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#10b981] rounded-full" 
                  style={{ width: `${activeRecord.operational_ndvi * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-sans block pt-0.5">
                Observed mean vegetation vigor improvement in treated command area.
              </span>
            </div>

            {/* Metric 2: Surface Water */}
            <div className="space-y-1.5 p-3 bg-[#07130F] border border-slate-800 rounded-xl">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Surface Water Spread</span>
                <span className="text-[#1677FF] font-bold">+{activeRecord.water_change_observed_ha.toFixed(1)} ha</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>Pre: {activeRecord.baseline_water_ha.toFixed(1)} ha</span>
                <span>Post: {activeRecord.operational_water_ha.toFixed(1)} ha</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1677FF] rounded-full" 
                  style={{ width: `${Math.min(100, (activeRecord.operational_water_ha / 25) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-sans block pt-0.5">
                Storage persistence augmented by check dams &amp; community ponds.
              </span>
            </div>

            {/* Metric 3: Bare Soil Exposure */}
            <div className="space-y-1.5 p-3 bg-[#07130F] border border-slate-800 rounded-xl">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Bare Soil Exposure (BSI)</span>
                <span className="text-amber-400 font-bold">-{(activeRecord.baseline_bare_soil_pct - activeRecord.operational_bare_soil_pct).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>Pre: {activeRecord.baseline_bare_soil_pct.toFixed(1)}%</span>
                <span>Post: {activeRecord.operational_bare_soil_pct.toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${activeRecord.operational_bare_soil_pct}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-sans block pt-0.5">
                Arrested sheet erosion &amp; improved green soil cover along contours.
              </span>
            </div>
          </div>

          {/* Sentinel-2 Calibration Details */}
          <div className="p-4 bg-[#07130F] border border-slate-800 rounded-2xl text-[11px] font-mono text-slate-400 space-y-1.5">
            <span className="font-bold text-slate-200 block uppercase">DATA SPECIFICATION</span>
            <div className="flex justify-between">
              <span>Platform:</span>
              <span className="text-white">Sentinel-2 L2A</span>
            </div>
            <div className="flex justify-between">
              <span>Spatial Resolution:</span>
              <span className="text-white">10 meters</span>
            </div>
            <div className="flex justify-between">
              <span>Revisit Period:</span>
              <span className="text-white">10 days</span>
            </div>
            <div className="flex justify-between">
              <span>Atmospheric Corr:</span>
              <span className="text-[#7DD3A7]">Sen2Cor (BOA)</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
