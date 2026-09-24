import React from 'react';
import { DATA_METHODOLOGY_SOURCES } from '../../data/sihWatershedData';
import { Database, Info, CheckCircle2, Layers, Cpu } from 'lucide-react';

export const DataMethodologyView: React.FC = () => {
  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-100">

      {/* Header Banner */}
      <div className="bg-[#0B1F1A] border border-[#7DD3A7]/25 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#123C35] border border-[#7DD3A7]/30 text-[#7DD3A7] text-[11px] font-mono">
              <Database className="w-3.5 h-3.5 text-[#1677FF]" />
              <span>SIH PS 26015 • DATA TRANSPARENCY &amp; METHODOLOGY MATRIX</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Data Lineage, Transparency &amp; Scientific Methodology
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Explicit categorization of all geospatial layers, satellite surface reflectance inputs, terrain models, 
              and AI demonstration classifiers.
            </p>
          </div>

          <div className="p-3 bg-[#07130F] border border-slate-800 rounded-xl font-mono text-xs text-right">
            <span className="text-slate-400 block text-[10px]">SCIENTIFIC INTEGRITY</span>
            <span className="text-base font-bold text-[#7DD3A7]">100% Disclosed</span>
            <span className="text-[10px] text-slate-500 block">Zero Fabricated Claims</span>
          </div>
        </div>
      </div>

      {/* Transparency Category Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#0B1F1A] border border-emerald-900/60 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
            <CheckCircle2 className="w-4 h-4" />
            <span>REAL GOVERNMENT DATA</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Directly ingested from official agencies (ISRO Bhuvan CartoDEM 30m, In-Situ Field Surveyor mobile EXIF photographs).
          </p>
        </div>

        <div className="p-4 bg-[#0B1F1A] border border-cyan-900/60 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
            <Layers className="w-4 h-4" />
            <span>LIVE API INTEGRATION</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Real-time automated pipelines (Open-Meteo precipitation models, Sentinel-2 Copernicus multi-spectral surface reflectance).
          </p>
        </div>

        <div className="p-4 bg-[#0B1F1A] border border-amber-900/60 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
            <Info className="w-4 h-4" />
            <span>DEMONSTRATION &amp; SYNTHETIC DATA</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Clearly labeled mockups and pilot algorithms (SUTRA-AI computer vision demonstration classifier, simulated stress tests).
          </p>
        </div>
      </div>

      {/* Complete Data Source Catalog Cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
          Geospatial Ingestion &amp; Processing Matrix
        </h3>

        <div className="space-y-3">
          {DATA_METHODOLOGY_SOURCES.map((src, idx) => (
            <div
              key={idx}
              className="bg-[#0B1F1A] border border-slate-800 rounded-xl p-5 space-y-3 shadow-md hover:border-[#7DD3A7]/40 transition"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-white font-mono">{src.dataset_name}</h4>
                  <span className="text-xs text-slate-400 font-sans">Provider: {src.source_agency}</span>
                </div>

                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold ${
                  src.category === 'REAL_DATA' 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : src.category === 'API_DATA'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {src.category === 'REAL_DATA' ? 'REAL GOVERNMENT DATA' : src.category === 'API_DATA' ? 'LIVE API DATA' : 'DEMO / SYNTHETIC DATA'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs bg-[#07130F] p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">SPATIAL RESOLUTION</span>
                  <span className="text-slate-200">{src.resolution}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">ACQUISITION / REVISIT</span>
                  <span className="text-slate-200">{src.acquisition_date}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">PROCESSING PIPELINE</span>
                  <span className="text-[#7DD3A7]">{src.category}</span>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Scientific Processing Method:</span>
                <p className="text-slate-300 font-sans leading-relaxed">
                  {src.processing_method}
                </p>
              </div>

              <div className="text-xs text-slate-400 font-sans pt-1 border-t border-slate-800/80">
                <span className="font-semibold text-slate-300">Operational Role: </span>
                {src.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Future-Ready Architecture Disclosures */}
      <div className="p-5 bg-[#0B1F1A] border border-slate-800 rounded-2xl space-y-3 shadow-lg">
        <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wide flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#7DD3A7]" />
          Future-Ready Extensible Architecture
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          The GeoWatershed AI platform is designed with decoupled abstract interfaces. When government department databases 
          (DoLR MIS, SLNA state portals) or production deep-learning segmentation models are deployed, they can be plugged 
          into the existing REST and GeoJSON endpoints with zero frontend redesign.
        </p>
      </div>

    </div>
  );
};
