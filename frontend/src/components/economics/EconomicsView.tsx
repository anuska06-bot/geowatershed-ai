import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { api } from '../../services/api';

export const EconomicsView: React.FC = () => {
  const [numInterventions, setNumInterventions] = useState(25);
  const [visitsPerYear, setVisitsPerYear] = useState(6);
  const [costPerVisit, setCostPerVisit] = useState(3500);
  const [timeSavingsPct, setTimeSavingsPct] = useState(65);
  const [platformCost, setPlatformCost] = useState(75000);

  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    api.calculateEconomics({
      number_of_interventions: numInterventions,
      field_visits_per_year: visitsPerYear,
      cost_per_manual_visit_inr: costPerVisit,
      digital_review_time_savings_pct: timeSavingsPct,
      platform_annual_cost_inr: platformCost,
    })
      .then((data) => setResult(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    calculate();
  }, [numInterventions, visitsPerYear, costPerVisit, timeSavingsPct, platformCost]);

  return (
    <div className="space-y-6 py-2">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
            <Calculator className="w-4 h-4 text-emerald-400" />
            Benefit-Cost Optimization & Operational Feasibility
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational efficiency gains from replacing blind ground surveys with targeted spatial verification workflows.
          </p>
        </div>

        <div className="text-[10px] text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 font-mono">
          Model: WDC-PMKSY Monitoring Optimization
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Interactive Input Parameter Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4 text-xs font-mono">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-800">
            Operational Cost Assumptions
          </h3>

          {/* Slider 1: Number of Interventions */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Monitored Structures:</span>
              <span className="font-mono font-bold text-forest-400">{numInterventions} sites</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={numInterventions}
              onChange={(e) => setNumInterventions(Number(e.target.value))}
              className="w-full accent-forest-500 cursor-pointer"
            />
          </div>

          {/* Slider 2: Annual Field Visits */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Manual Visits / Year per Structure:</span>
              <span className="font-mono font-bold text-forest-400">{visitsPerYear} visits</span>
            </div>
            <input
              type="range"
              min="2"
              max="12"
              value={visitsPerYear}
              onChange={(e) => setVisitsPerYear(Number(e.target.value))}
              className="w-full accent-forest-500 cursor-pointer"
            />
          </div>

          {/* Slider 3: Cost per Visit */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Avg. Field Visit Cost (Travel + DA):</span>
              <span className="font-mono font-bold text-forest-400">₹{costPerVisit.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="8000"
              step="250"
              value={costPerVisit}
              onChange={(e) => setCostPerVisit(Number(e.target.value))}
              className="w-full accent-forest-500 cursor-pointer"
            />
          </div>

          {/* Slider 4: Time Savings */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Digital Screening Efficiency:</span>
              <span className="font-mono font-bold text-forest-400">{timeSavingsPct}% reduction</span>
            </div>
            <input
              type="range"
              min="30"
              max="90"
              value={timeSavingsPct}
              onChange={(e) => setTimeSavingsPct(Number(e.target.value))}
              className="w-full accent-forest-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 italic">Percentage of routine visits replaced by geotagged evidence screening.</p>
          </div>

          {/* Slider 5: Platform Annual Cost */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>GeoWatershed Annual Platform Cost:</span>
              <span className="font-mono font-bold text-forest-400">₹{platformCost.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="30000"
              max="150000"
              step="5000"
              value={platformCost}
              onChange={(e) => setPlatformCost(Number(e.target.value))}
              className="w-full accent-forest-500 cursor-pointer"
            />
          </div>

        </div>

        {/* Right: Calculated Outputs & Sensitivity Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Output Cards Grid */}
          {result && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
                <span className="text-[10px] uppercase text-slate-400 block mb-1">Conventional Cost</span>
                <span className="text-base font-bold text-slate-200">
                  ₹{(result.conventional_annual_monitoring_cost_inr / 100000).toFixed(2)}L
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Manual Inspections</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
                <span className="text-[10px] uppercase text-slate-400 block mb-1">Hybrid Cost</span>
                <span className="text-base font-bold text-slate-200">
                  ₹{(result.geowatershed_hybrid_cost_inr / 100000).toFixed(2)}L
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Targeted + Cloud</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
                <span className="text-[10px] uppercase text-emerald-400 block mb-1">Annual Savings</span>
                <span className="text-base font-bold text-emerald-400">
                  ₹{(result.estimated_annual_cost_difference_inr / 100000).toFixed(2)}L
                </span>
                <span className="text-[10px] text-emerald-500/80 block mt-1">Budget Optimized</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
                <span className="text-[10px] uppercase text-emerald-400 block mb-1">Est. Payback</span>
                <span className="text-base font-bold text-emerald-400">
                  {result.payback_period_months} mo
                </span>
                <span className="text-[10px] text-emerald-500/80 block mt-1">ROI: {result.estimated_roi_pct}%</span>
              </div>

            </div>
          )}

          {/* Sensitivity Analysis Table */}
          {result && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-xs space-y-3 font-mono">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Multi-Scenario Sensitivity Matrix
              </h4>

              <div className="border border-slate-800 rounded-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                      <th className="p-2.5">Scenario</th>
                      <th className="p-2.5">Manual Cost</th>
                      <th className="p-2.5">Hybrid Cost</th>
                      <th className="p-2.5">Net Savings</th>
                      <th className="p-2.5">ROI %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                    {result.sensitivity_analysis.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-950/50">
                        <td className="p-2.5 font-sans font-medium text-slate-300">{row.scenario}</td>
                        <td className="p-2.5 text-slate-400">₹{row.manual_cost_inr.toLocaleString()}</td>
                        <td className="p-2.5 text-slate-400">₹{row.hybrid_cost_inr.toLocaleString()}</td>
                        <td className="p-2.5 font-bold text-forest-400">₹{row.net_savings_inr.toLocaleString()}</td>
                        <td className="p-2.5 text-cyan-400">{row.roi_pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
                <strong>Attribution Disclaimer: </strong>
                {result.disclaimer}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
