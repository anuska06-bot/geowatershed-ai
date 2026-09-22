import React, { useEffect, useState } from 'react';
import { Briefcase, IndianRupee } from 'lucide-react';

interface ProjectItem {
  id: string;
  watershed_id: string;
  watershed_code: string;
  name: string;
  scheme_name: string;
  status: string;
  sanctioned_budget_inr: number;
  expenditure_inr: number;
  budget_utilization_pct: number;
  start_date: string;
  target_date: string | null;
  description: string | null;
  total_structures: number;
  completed_structures: number;
}

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4 py-2">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            Intervention Programmes & Scheme Governance
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Physical progress tracking and expenditure accountability under WDC-PMKSY 2.0 guidelines.
          </p>
        </div>

        <div className="text-xs px-3 py-1.5 rounded bg-slate-950 text-emerald-300 border border-emerald-600/50">
          Scheme: WDC-PMKSY 2.0 (DoLR)
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs font-mono">Loading projects register...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4 font-mono">
              
              {/* Project Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {proj.watershed_code}
                  </span>
                  <h3 className="font-bold text-slate-100 text-sm mt-1.5">{proj.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-sans">{proj.scheme_name}</p>
                </div>

                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-emerald-300 border border-emerald-600/50 flex-shrink-0">
                  {proj.status}
                </span>
              </div>

              {/* Description */}
              {proj.description && (
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-md border border-slate-800 font-sans">
                  {proj.description}
                </p>
              )}

              {/* Budget Progress Bar */}
              <div className="bg-slate-950 p-3 rounded-md border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                    Budget Utilization ({proj.budget_utilization_pct}%)
                  </span>
                  <span className="text-slate-200">
                    ₹{(proj.expenditure_inr / 100000).toFixed(1)}L / ₹{(proj.sanctioned_budget_inr / 100000).toFixed(1)}L
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, proj.budget_utilization_pct)}%` }}
                  ></div>
                </div>
              </div>

              {/* Structure Completion & Timeline */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-md border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 block">Physical Structures</span>
                  <p className="font-bold text-slate-100 text-sm mt-0.5">
                    {proj.completed_structures} / {proj.total_structures}
                  </p>
                  <span className="text-[10px] text-emerald-400">Verified On-Ground</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-md border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 block">Sanction Window</span>
                  <p className="font-bold text-slate-100 text-xs mt-0.5">
                    {proj.start_date} → {proj.target_date || '2027'}
                  </p>
                  <span className="text-[10px] text-slate-400">Phase I Implementation</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
