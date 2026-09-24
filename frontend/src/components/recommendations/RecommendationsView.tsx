import React, { useState } from 'react';
import { WatershedDetail, AIInterventionRecommendationItem } from '../../types';
import { AI_INTERVENTION_RECOMMENDATIONS } from '../../data/sihWatershedData';
import { 
  Sparkles, Droplets, Mountain, Calculator, MapPin
} from 'lucide-react';

interface RecommendationsViewProps {
  watershed: WatershedDetail;
  onViewOnMap?: (lat: number, lon: number) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  watershed,
  onViewOnMap
}) => {
  const [recommendations] = useState<AIInterventionRecommendationItem[]>(AI_INTERVENTION_RECOMMENDATIONS);
  const [selectedRec, setSelectedRec] = useState<AIInterventionRecommendationItem>(AI_INTERVENTION_RECOMMENDATIONS[0]);

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-100">

      {/* Header Banner */}
      <div className="bg-[#0B1F1A] border border-[#7DD3A7]/25 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#123C35] border border-[#7DD3A7]/30 text-[#7DD3A7] text-[11px] font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#7DD3A7]" />
              <span>SIH PS 26015 • AI-ASSISTED INTERVENTION SIZING &amp; SITING</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              AI-Assisted Watershed Recommendations &amp; Cost Estimation
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Algorithmic decision support for optimal siting of check dams, farm ponds, contour bunds, and diversion drains 
              derived from D8 drainage direction, slope gradient, and catchment runoff accumulation.
            </p>
          </div>

          <div className="p-3 bg-[#07130F] border border-slate-800 rounded-xl font-mono text-xs text-right">
            <span className="text-slate-400 block text-[10px]">CATCHMENT CANDIDATES</span>
            <span className="text-base font-bold text-[#7DD3A7]">{recommendations.length} Priority Sites</span>
            <span className="text-[10px] text-amber-400 block">Requires Field Survey</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Interface: Siting Candidate List + Detailed Hydrologic Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (5 Cols): Recommendation Candidates */}
        <div className="lg:col-span-5 bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
              1. Proposed Siting Candidates
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Basin: {watershed.name}
            </span>
          </div>

          {/* Siting Cards List */}
          <div className="space-y-3">
            {recommendations.map((rec) => {
              const isSelected = selectedRec.id === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRec(rec)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex flex-col gap-2.5 ${
                    isSelected 
                      ? 'bg-[#123C35] border-[#7DD3A7] shadow-md' 
                      : 'bg-[#07130F] border-slate-800 hover:border-slate-600 hover:bg-[#123C35]/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white font-mono">{rec.structure_type}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Strahler Stream Order {rec.stream_order}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      rec.priority === 'HIGH' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {rec.priority} PRIORITY
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2">
                    {rec.hydrological_reason}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono pt-1.5 border-t border-slate-800/80">
                    <span className="text-slate-400">
                      Lat {rec.target_lat.toFixed(4)}°, Lon {rec.target_lon.toFixed(4)}°
                    </span>
                    <span className="text-[#7DD3A7] font-bold">
                      ₹{(rec.preliminary_cost.preliminary_total_inr / 100000).toFixed(2)} Lakh
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 Cols): Comprehensive Engineering Sizing & Bill of Quantities */}
        <div className="lg:col-span-7 space-y-4">

          {/* Siting Blueprint Card */}
          <div className="bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4 text-[#7DD3A7]" />
                <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
                  2. Hydrological Justification &amp; Siting Criteria
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#07130F] text-amber-400 border border-amber-800/40">
                AI Confidence: {selectedRec.confidence_score}% (Simulated Demo)
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#07130F] border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                  Terrain &amp; Drainage Analysis:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {selectedRec.hydrological_reason}
                </p>
              </div>

              {/* Preliminary Drainage Route Proposal */}
              {selectedRec.drainage_corridor && (
                <div className="p-3.5 bg-[#07130F] border border-cyan-900/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      Preliminary Drainage Route Corridor
                    </span>
                    <span className="text-slate-400">Length: {selectedRec.drainage_corridor.estimated_length_meters}m</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    {selectedRec.drainage_corridor.reason}
                  </p>
                  <div className="p-2 bg-amber-950/30 border border-amber-800/40 rounded-lg text-[10px] text-amber-300 font-mono">
                    ⚠ {selectedRec.drainage_corridor.disclaimer}
                  </div>
                </div>
              )}

              {/* Material Recommendation Matrix */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                  Material Suitability &amp; Durability Options:
                </span>
                <div className="space-y-2">
                  {selectedRec.recommended_materials.map((mat, idx) => (
                    <div key={idx} className="p-3 bg-[#07130F] border border-slate-800 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-white">{mat.material}</span>
                        <span className="text-[#7DD3A7]">Durability: ~{mat.durability_years} Years</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                        {mat.suitability}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preliminary Cost Estimation (Bill of Quantities) */}
              <div className="p-4 bg-[#07130F] border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-[#7DD3A7]" />
                    Preliminary Cost Breakdown (Indicative SoR)
                  </span>
                  <span className="text-sm font-bold font-mono text-[#7DD3A7]">
                    Total: ₹{selectedRec.preliminary_cost.preliminary_total_inr.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-[#0B1F1A] rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">MATERIAL:</span>
                    <span className="text-white font-bold">₹{selectedRec.preliminary_cost.estimated_material_cost_inr.toLocaleString()}</span>
                  </div>
                  <div className="p-2 bg-[#0B1F1A] rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">LABOUR:</span>
                    <span className="text-white font-bold">₹{selectedRec.preliminary_cost.estimated_labour_cost_inr.toLocaleString()}</span>
                  </div>
                  <div className="p-2 bg-[#0B1F1A] rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">TRANSPORT:</span>
                    <span className="text-white font-bold">₹{selectedRec.preliminary_cost.estimated_transport_cost_inr.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 font-mono">
                  *{selectedRec.preliminary_cost.cost_disclaimer}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => onViewOnMap && onViewOnMap(selectedRec.target_lat, selectedRec.target_lon)}
                  className="flex-1 py-2.5 rounded-lg bg-[#123C35] hover:bg-[#123C35]/80 text-[#7DD3A7] border border-[#7DD3A7]/30 text-xs font-mono font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View Siting Location on GIS Map</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
