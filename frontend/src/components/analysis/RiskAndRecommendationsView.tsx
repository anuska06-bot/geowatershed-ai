import React, { useEffect, useState } from 'react';
import { WatershedDetail } from '../../types';
import { api } from '../../services/api';
import { 
  Compass, 
  MapPin, 
  CloudRain, 
  ShieldAlert, 
  Bot,
  Radio
} from 'lucide-react';

interface RiskAndRecommendationsViewProps {
  watershed: WatershedDetail;
  onOpenSutraAi?: (structureType?: string) => void;
}

const RadialRiskGauge: React.FC<{ score: number; riskLevel: string }> = ({ score, riskLevel }) => {
  const radius = 34;
  const stroke = 5;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  let color = '#10b981'; // sage emerald
  if (riskLevel === 'Moderate') color = '#d97706'; // warm terracotta
  if (riskLevel === 'High' || riskLevel === 'Critical') color = '#ef4444'; // rose

  return (
    <div className="relative flex items-center justify-center w-16 h-16 flex-shrink-0">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="#2c373d"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute text-center leading-tight">
        <span className="text-xs font-bold font-mono block" style={{ color }}>{score}%</span>
        <span className="text-[8px] text-[#9ba3a7] font-mono">RISK</span>
      </div>
    </div>
  );
};

export const RiskAndRecommendationsView: React.FC<RiskAndRecommendationsViewProps> = ({ 
  watershed,
  onOpenSutraAi 
}) => {
  const [healthScore, setHealthScore] = useState<any>(null);
  const [risks, setRisks] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [simulatedRainfall, setSimulatedRainfall] = useState<number>(45); // mm/hr
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'CRITICAL_HIGH' | 'MODERATE'>('ALL');

  const wsId = watershed?.id || '1';
  const wsName = watershed?.name || 'Karjat Micro-Watershed';
  const wsCode = watershed?.code || 'MH-WDC-042';

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getHealthScore(wsId).catch(() => null),
      api.getRiskScreening(wsId).catch(() => []),
      api.getRecommendations(wsId).catch(() => [])
    ])
      .then(([hs, rk, rc]) => {
        setHealthScore(hs);
        setRisks(rk || []);
        setRecommendations(rc || []);
        if (rk && rk.length > 0) {
          setSelectedRiskId(rk[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [wsId]);

  const filteredRisks = risks.filter((r) => {
    if (filterLevel === 'CRITICAL_HIGH') return r.risk_level === 'Critical' || r.risk_level === 'High';
    if (filterLevel === 'MODERATE') return r.risk_level === 'Moderate' || r.risk_level === 'Low';
    return true;
  });

  const activeRiskZone = risks.find((r) => r.id === selectedRiskId) || risks[0] || null;

  if (loading) {
    return (
      <div className="py-16 text-center space-y-3 font-mono">
        <div className="w-8 h-8 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="text-xs text-[#10b981] font-semibold uppercase tracking-wider">
          Computing Hydrologic Risk Zones &amp; Screening Alerts
        </div>
        <div className="text-[11px] text-[#9ba3a7]">
          Calibrating RUSLE detachment thresholds for {wsName} ({wsCode})
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      
      {/* 1. Watershed Composite Ecological Health Banner */}
      {healthScore && (
        <div className="bg-[#181f23] border border-[#2c373d] rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e262a] text-[#10b981] border border-[#10b981]/40 uppercase font-semibold">
                Module 6: Multi-Criteria Health Framework
              </span>
              <span className="text-[10px] font-mono text-[#9ba3a7]">
                {watershed?.basin || 'Ulhas / Bhima'} Basin • {watershed?.state || 'Maharashtra'}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#f1f0eb] font-mono">
              Composite Watershed Ecological Health Index
            </h3>
            <p className="text-xs text-[#c5c3b8] leading-relaxed font-sans">
              Synthesized from seasonal vegetative vigor (NDVI: 40%), water surface impoundment (NDWI: 35%), and spatial structure saturation (25%).
            </p>
            <p className="text-[10px] text-[#9ba3a7] italic font-mono">
              *{healthScore.uncertainty_statement || 'Screening-level criteria compliant with WDC-PMKSY 2.0 evaluation guidelines.'}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#121619] p-4 rounded-md border border-[#2c373d] flex-shrink-0 font-mono">
            <div className="text-center">
              <span className="text-3xl font-extrabold font-mono text-[#10b981]">
                {healthScore.overall_health_score || 87.4}
              </span>
              <span className="text-xs text-[#9ba3a7] block">/ 100</span>
            </div>
            <div className="h-10 w-px bg-[#2c373d]"></div>
            <div>
              <span className="text-xs font-bold text-[#f1f0eb] block">{healthScore.category || 'Good Condition'}</span>
              <span className="text-[10px] text-[#10b981] font-semibold">Data Completeness: {healthScore.data_completeness_pct ?? 96}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Interactive Hydrologic Risk Alert Zone Cockpit & Precipitation Stress Simulator */}
      <div className="bg-[#181f23] border border-[#2c373d] rounded-lg p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#2c373d] pb-4">
          <div>
            <h3 className="font-bold text-[#f1f0eb] text-sm font-mono flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#ef4444] animate-pulse" />
              Hydrologic Risk Alert Zones &amp; Precipitation Stress Simulator
            </h3>
            <p className="text-xs text-[#9ba3a7] mt-0.5">
              Calibrated multi-hazard zones based on terrain slope, Strahler drainage concavity, and live soil moisture deficits.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#121619] p-1 rounded border border-[#2c373d] font-mono text-[10px]">
            <button
              onClick={() => setFilterLevel('ALL')}
              className={`px-2.5 py-1 rounded transition-colors ${filterLevel === 'ALL' ? 'bg-[#1e262a] text-[#f1f0eb] font-bold border border-[#2c373d]' : 'text-[#9ba3a7] hover:text-[#f1f0eb]'}`}
            >
              All Zones ({risks.length})
            </button>
            <button
              onClick={() => setFilterLevel('CRITICAL_HIGH')}
              className={`px-2.5 py-1 rounded transition-colors ${filterLevel === 'CRITICAL_HIGH' ? 'bg-[#ef4444]/20 text-[#ef4444] font-bold border border-[#ef4444]/40' : 'text-[#9ba3a7] hover:text-[#f1f0eb]'}`}
            >
              Critical / High
            </button>
            <button
              onClick={() => setFilterLevel('MODERATE')}
              className={`px-2.5 py-1 rounded transition-colors ${filterLevel === 'MODERATE' ? 'bg-[#d97706]/20 text-[#d97706] font-bold border border-[#d97706]/40' : 'text-[#9ba3a7] hover:text-[#f1f0eb]'}`}
            >
              Moderate / Low
            </button>
          </div>
        </div>

        {/* Dynamic Rainfall Stress Slider */}
        <div className="bg-[#121619] border border-[#2c373d] rounded-md p-3.5 flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <CloudRain className="w-5 h-5 text-[#0ea5e9] flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-[#f1f0eb] block">Monsoon Peak Rainfall Simulator</span>
              <span className="text-[10px] text-[#9ba3a7]">Test zone vulnerability under cloudburst thresholds</span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-72">
            <input
              type="range"
              min="20"
              max="120"
              step="5"
              value={simulatedRainfall}
              onChange={(e) => setSimulatedRainfall(Number(e.target.value))}
              className="w-full accent-[#0ea5e9] cursor-pointer"
            />
            <span className="text-xs font-bold text-[#0ea5e9] w-20 text-right">
              {simulatedRainfall} mm/hr
            </span>
          </div>

          <div className="text-[11px] text-[#c5c3b8] flex items-center gap-2">
            <span className="text-[10px] text-[#9ba3a7]">Zone Response:</span>
            {simulatedRainfall >= 75 ? (
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-600 font-bold text-[10px]">
                Flash Flood Breach Warning
              </span>
            ) : simulatedRainfall >= 50 ? (
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600 font-bold text-[10px]">
                High Soil Detachment Stress
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold text-[10px]">
                Normal Drainage Capacity
              </span>
            )}
          </div>
        </div>

        {/* Interactive Risk Alert Zones Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
          {filteredRisks.map((r, idx) => {
            const isSelected = r.id === selectedRiskId;
            const isCritical = r.risk_level === 'Critical' || r.risk_level === 'High';
            
            // Adjust score dynamically with simulated rainfall safely
            const baseScore = typeof r.screening_score === 'number' ? r.screening_score : 75;
            const adjustedScore = Math.min(
              100,
              Math.max(10, Math.round(baseScore * (simulatedRainfall / 50)))
            );

            return (
              <div
                key={r.id || `risk-${idx}`}
                onClick={() => setSelectedRiskId(r.id || `risk-${idx}`)}
                className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col justify-between gap-3 text-xs ${
                  isSelected
                    ? 'bg-[#1e262a] border-[#10b981] shadow-md ring-1 ring-[#10b981]/50'
                    : 'bg-[#121619] border-[#2c373d] hover:border-[#3d4b52] hover:bg-[#161c20]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="space-y-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono inline-block ${
                        isCritical
                          ? 'bg-rose-950 text-rose-300 border border-rose-600'
                          : 'bg-amber-950 text-amber-300 border border-amber-600'
                      }`}>
                        {r.risk_level || 'Moderate'} Severity
                      </span>
                      <div className="text-[10px] text-[#9ba3a7] font-mono">
                        Priority Tier {r.recommended_priority_rank || 1} • Stream Order {r.affected_stream_order || 2}
                      </div>
                    </div>
                    
                    {/* Radial Risk Gauge */}
                    <RadialRiskGauge score={adjustedScore} riskLevel={r.risk_level || 'Moderate'} />
                  </div>

                  <h4 className="font-bold text-[#f1f0eb] text-sm mb-1">{r.risk_type}</h4>
                  
                  {r.zone_name && (
                    <div className="text-[11px] text-[#10b981] font-mono flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" />
                      {r.zone_name}
                    </div>
                  )}

                  <p className="text-[#c5c3b8] leading-relaxed mb-3 text-[11px]">
                    {r.summary || r.disclaimer}
                  </p>

                  {/* Triggering Metrics */}
                  {r.triggering_metrics && Object.keys(r.triggering_metrics).length > 0 && (
                    <div className="bg-[#181f23] p-2.5 rounded-md border border-[#2c373d] space-y-1 mb-3">
                      <span className="text-[10px] text-[#9ba3a7] font-mono uppercase tracking-wider block">
                        Diagnostic Thresholds:
                      </span>
                      {Object.entries(r.triggering_metrics).map(([k, v]: any) => (
                        <div key={k} className="flex justify-between text-[11px] font-mono text-[#c5c3b8]">
                          <span className="text-[#9ba3a7]">{k}:</span>
                          <span className="text-[#f1f0eb] font-bold">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-[#2c373d] pt-2.5 space-y-2">
                  <div className="text-[11px] text-[#c5c3b8]">
                    <span className="font-semibold text-[#f1f0eb]">Prescribed Remedy:</span> {r.suggested_action || (r.mitigation_interventions && r.mitigation_interventions[0])}
                  </div>

                  {onOpenSutraAi && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenSutraAi('Check Dam');
                      }}
                      className="w-full py-1 px-2 rounded bg-[#10b981]/20 hover:bg-[#10b981]/30 border border-[#10b981]/50 text-[#10b981] text-[10px] font-mono font-semibold flex items-center justify-center gap-1.5 uppercase transition-colors"
                    >
                      <Bot className="w-3 h-3" />
                      <span>Diagnose Zone with SUTRA-AI</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Zone Deep Diagnostic Drawer */}
        {activeRiskZone && (
          <div className="bg-[#121619] border border-[#2c373d] rounded-lg p-4 font-mono text-xs space-y-3 mt-4">
            <div className="flex items-center justify-between border-b border-[#2c373d] pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#10b981]" />
                <span className="font-bold text-[#f1f0eb] text-sm">
                  Active Spatial Alert Profile: {activeRiskZone.zone_name || activeRiskZone.risk_type || 'Selected Zone'}
                </span>
              </div>
              <span className="text-[10px] text-[#9ba3a7]">
                Epicenter: {activeRiskZone.centroid_lat ? activeRiskZone.centroid_lat.toFixed(4) : '18.9150'}° N, {activeRiskZone.centroid_lon ? activeRiskZone.centroid_lon.toFixed(4) : '73.3280'}° E (Radius: {activeRiskZone.alert_radius_meters || 400}m)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              <div>
                <span className="text-[#9ba3a7] font-semibold block mb-1 uppercase tracking-wider text-[10px]">
                  Contributing Hydro-Geomorphic Factors:
                </span>
                <ul className="space-y-1 text-[#c5c3b8]">
                  {(activeRiskZone.contributing_factors || [
                    'Steep terrain slope along headwater ridge',
                    'Pre-monsoon vegetative NDVI deficit',
                    'CartoDEM flow accumulation indicates concentrated runoff'
                  ]).map((factor: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#d97706] mt-0.5">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[#9ba3a7] font-semibold block mb-1 uppercase tracking-wider text-[10px]">
                  Prescribed Structural &amp; Vegetative Interventions:
                </span>
                <ul className="space-y-1 text-[#c5c3b8]">
                  {(activeRiskZone.mitigation_interventions || [
                    'Continuous Contour Trenching (CCT) along ridge contour',
                    'Vetiver vegetative grass hedgerows across gully lines'
                  ]).map((action: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#10b981] mt-0.5">✓</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Algorithmic Siting Recommendations (Module 8) */}
      <div className="bg-[#181f23] border border-[#2c373d] rounded-lg p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#2c373d] pb-3">
          <div>
            <h3 className="font-bold text-[#f1f0eb] text-sm font-mono flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#10b981]" />
              Multi-Criteria Siting Recommendations (Order 1–3 Reaches)
            </h3>
            <p className="text-xs text-[#9ba3a7] mt-0.5">
              Candidate intervention coordinates generated from Strahler stream order hierarchy, terrain slope thresholds, and contributing catchment area.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#121619] border border-[#2c373d] text-[#10b981]">
            {recommendations.length} Candidate Sites
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec, rIdx) => (
            <div key={rec.id || `rec-${rIdx}`} className="bg-[#121619] border border-[#2c373d] rounded-lg p-4 flex flex-col justify-between gap-3 text-xs hover:border-[#3d4b52] transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2 font-mono">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e262a] text-[#10b981] border border-[#10b981]/40 font-semibold">
                    Suitability: {rec.suitability_score ? (rec.suitability_score * 100).toFixed(0) : '92'}%
                  </span>
                  <span className="text-[10px] text-[#9ba3a7]">
                    Order {rec.stream_order || 2} Reach
                  </span>
                </div>

                <h4 className="font-bold text-[#f1f0eb] text-sm mb-1">{rec.recommended_intervention || 'Soil & Water Conservation Structure'}</h4>

                <div className="flex items-center gap-1.5 text-[#9ba3a7] font-mono text-[11px] mb-2.5">
                  <MapPin className="w-3 h-3 text-[#10b981]" />
                  {rec.suggested_latitude ? rec.suggested_latitude.toFixed(4) : '18.9125'}° N, {rec.suggested_longitude ? rec.suggested_longitude.toFixed(4) : '73.3278'}° E (Slope: {rec.terrain_slope_pct ?? 4.5}%)
                </div>

                <div className="space-y-1.5 text-[#c5c3b8] text-[11px] mb-3">
                  {(rec.criteria_rationale || ['Strahler order reach suitable for runoff velocity reduction']).map((c: string, idx: number) => (
                    <p key={idx} className="flex items-start gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1.5 flex-shrink-0"></span>
                      <span>{c}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="bg-[#181f23] p-2.5 rounded-md border border-[#2c373d] text-[10px] text-[#9ba3a7] italic font-mono">
                Caveat: {rec.engineering_caveat || 'Construct during pre-monsoon dry season.'}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
