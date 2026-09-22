import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, CartesianGrid 
} from 'recharts';
import { Leaf, Droplets, ShieldAlert } from 'lucide-react';

const NDVI_DATA = [
  { month: 'Jun 24', ndvi: 0.18, baseline: 0.17 },
  { month: 'Jul 24', ndvi: 0.32, baseline: 0.30 },
  { month: 'Aug 24', ndvi: 0.48, baseline: 0.45 },
  { month: 'Sep 24', ndvi: 0.54, baseline: 0.49 },
  { month: 'Oct 24', ndvi: 0.51, baseline: 0.44 },
  { month: 'Nov 24', ndvi: 0.42, baseline: 0.35 },
  { month: 'Dec 24', ndvi: 0.35, baseline: 0.28 },
  { month: 'Jan 25', ndvi: 0.30, baseline: 0.24 },
  { month: 'Feb 25', ndvi: 0.26, baseline: 0.21 },
  { month: 'Mar 25', ndvi: 0.23, baseline: 0.19 },
  { month: 'Apr 25', ndvi: 0.21, baseline: 0.18 },
  { month: 'May 25', ndvi: 0.19, baseline: 0.17 },
];

const WATER_SPREAD_DATA = [
  { period: 'Pre-Monsoon 24', area_ha: 4.2 },
  { period: 'Post-Monsoon 24', area_ha: 18.4 },
  { period: 'Pre-Monsoon 25', area_ha: 6.8 },
  { period: 'Post-Monsoon 25', area_ha: 22.1 },
];

export const BiophysicalPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
      
      {/* Chart 1: Seasonal NDVI Canopy Dynamics */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide font-mono">
                Seasonal Vegetation Index (NDVI)
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">Sentinel-2 L2A (10m) • Ahmednagar Pilot Catchment</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono">
            Observed Change
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={NDVI_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} domain={[0, 0.7]} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '4px', fontSize: '11px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="ndvi" name="Intervention Catchment NDVI" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#ndviGrad)" />
              <Area type="monotone" dataKey="baseline" name="Regional Control Baseline" stroke="#64748b" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={1} fill="url(#baseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2 font-mono">
          <span>Peak Biomass: 0.54 (Oct Post-Monsoon)</span>
          <span>Dry Season Floor: 0.19 (May)</span>
        </div>
      </div>

      {/* Chart 2: Surface Water Spread Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide font-mono">
                Surface Water Occurrence (NDWI)
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">Storage Reservoirs, Percolation Tanks & Check Dams</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono">
            Estimated Extent
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WATER_SPREAD_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="period" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} domain={[0, 25]} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '4px', fontSize: '11px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="area_ha" name="Water Spread (Hectares)" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2 font-mono">
          <span>Dry Season Persistence: +2.6 ha (+62%)</span>
          <span>Max Post-Monsoon Extent: 22.1 ha</span>
        </div>
      </div>

      {/* Scientific Attribution Disclaimer & Evidence Notice */}
      <div className="lg:col-span-2 bg-[#090d14] border border-slate-800 rounded-md p-3.5 flex items-start gap-3 text-xs text-slate-300 font-mono">
        <ShieldAlert className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <h5 className="font-semibold text-slate-200 mb-0.5">
            Scientific Attribution Protocol (Intervention-to-Outcome Discipline)
          </h5>
          <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
            Observed increases in post-monsoon greenness reflect a combination of monsoon precipitation, agricultural practice, and soil moisture retention. 
            <strong> GeoWatershed AI strictly does not claim sole causality </strong> for vegetative growth without controlling for regional precipitation anomalies (IMD Gridded) and ground tube-well extraction. 
            All analytical outputs are categorized as <em>Observed Change</em> and require local WDT hydrologist review before formal project impact certification.
          </p>
        </div>
      </div>

    </div>
  );
};
