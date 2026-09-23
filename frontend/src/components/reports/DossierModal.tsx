import React, { useEffect, useState } from 'react';
import { DossierSummary } from '../../types';
import { api } from '../../services/api';
import { X, Printer, FileText } from 'lucide-react';

interface DossierModalProps {
  watershedId: string;
  onClose: () => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({ watershedId, onClose }) => {
  const [dossier, setDossier] = useState<DossierSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDossier(watershedId)
      .then((data) => setDossier(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [watershedId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-[#0B1F1A] border border-[#7DD3A7]/25 rounded-2xl shadow-2xl overflow-hidden my-8 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#07130F] print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#7DD3A7]" />
            <h3 className="font-bold text-slate-100 text-sm font-mono">Official Watershed Evidence Dossier</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#10b981] hover:bg-[#10b981]/90 text-[#0B1F1A] transition-colors font-mono shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-[#123C35] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Content */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-300 print:text-black font-sans">
          
          {/* Front Part: Official Document Header Banner with High-Quality Watershed Image */}
          <div 
            className="relative w-full rounded-xl overflow-hidden border border-[#7DD3A7]/30 shadow-xl bg-cover bg-center text-center print:border-slate-300 print:bg-none"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(7, 19, 15, 0.25), rgba(7, 19, 15, 0.60)), url('/istockphoto-950777136-612x612.jpg')`
            }}
          >
            {/* Subtle contour SVG overlay for institutional authenticity */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="dossier-contour" width="180" height="180" patternUnits="userSpaceOnUse">
                    <path d="M0,45 Q45,15 90,55 T180,35" fill="none" stroke="#7DD3A7" strokeWidth="0.7" />
                    <path d="M0,90 Q55,115 110,75 T180,95" fill="none" stroke="#7DD3A7" strokeWidth="0.7" />
                    <path d="M0,135 Q35,100 90,145 T180,120" fill="none" stroke="#7DD3A7" strokeWidth="0.7" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dossier-contour)" />
              </svg>
            </div>

            <div className="relative z-10 px-6 py-8 sm:px-8 sm:py-10 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#07130F]/85 backdrop-blur-md border border-[#7DD3A7]/40 text-[#7DD3A7] text-[10px] font-mono tracking-widest uppercase font-bold mb-3 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                Government of India • Ministry of Rural Development • DoLR (WDC-PMKSY 2.0)
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-wide font-mono drop-shadow-md print:text-black">
                WATERSHED INTERVENTION EVIDENCE &amp; OUTCOME DOSSIER
              </h2>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-md bg-[#07130F]/85 backdrop-blur-md border border-slate-700/80 text-slate-200 shadow-sm print:bg-none print:text-slate-700 print:border-none">
                  Document Ref: GW-DOSSIER-{dossier?.watershed.code || 'MH-WDC-042'}-{new Date().getFullYear()}
                </span>
                {dossier && (
                  <span className="px-3 py-1 rounded-md bg-[#123C35]/90 backdrop-blur-md border border-[#7DD3A7]/50 text-[#7DD3A7] font-semibold shadow-sm print:bg-none print:text-emerald-800 print:border-none">
                    {dossier.watershed.name} Catchment • {dossier.watershed.state}
                  </span>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 font-mono">Loading audit dossier...</div>
          ) : dossier ? (
            <>
              {/* Watershed Identification */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-md border border-slate-800 print:bg-slate-100 print:border-slate-300 font-mono">
                <div>
                  <span className="text-[10px] uppercase text-slate-500">Watershed Name</span>
                  <p className="font-bold text-slate-100 print:text-black">{dossier.watershed.name}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500">Watershed Code</span>
                  <p className="font-bold text-slate-100 print:text-black font-mono">{dossier.watershed.code}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500">District / State</span>
                  <p className="font-bold text-slate-100 print:text-black">{dossier.watershed.district}, {dossier.watershed.state}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500">Catchment Area</span>
                  <p className="font-bold text-slate-100 print:text-black font-mono">{dossier.watershed.area_hectares} ha</p>
                </div>
              </div>

              {/* High-Level Evidence Telemetry */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="border border-slate-800 p-3 rounded-lg print:border-slate-300">
                  <span className="text-[10px] uppercase text-slate-400">Total Structures</span>
                  <p className="text-base font-bold font-mono text-slate-100 print:text-black">{dossier.telemetry.total_interventions}</p>
                </div>
                <div className="border border-slate-800 p-3 rounded-lg print:border-slate-300">
                  <span className="text-[10px] uppercase text-slate-400">Field Evidence Ingested</span>
                  <p className="text-base font-bold font-mono text-slate-100 print:text-black">{dossier.telemetry.total_field_photos_ingested}</p>
                </div>
                <div className="border border-slate-800 p-3 rounded-lg print:border-slate-300">
                  <span className="text-[10px] uppercase text-slate-400">Stream Proximity Consistency</span>
                  <p className="text-base font-bold font-mono text-forest-400 print:text-emerald-700">{dossier.telemetry.hydrologic_consistency_rate_pct}%</p>
                </div>
                <div className="border border-slate-800 p-3 rounded-lg print:border-slate-300">
                  <span className="text-[10px] uppercase text-slate-400">Human Expert Audited</span>
                  <p className="text-base font-bold font-mono text-cyan-400 print:text-blue-700">{dossier.telemetry.human_reviewed_count} records</p>
                </div>
              </div>

              {/* Interventions Audit Table */}
              <div>
                <h4 className="font-bold text-slate-200 print:text-black mb-2 uppercase text-[11px] tracking-wider">
                  Structure Ingestion & Compliance Register
                </h4>
                <div className="border border-slate-800 rounded-lg overflow-hidden print:border-slate-300">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 print:bg-slate-200 print:border-slate-400 text-[10px] text-slate-400 print:text-black uppercase">
                        <th className="p-2.5">Structure Name</th>
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5">Target Coordinate</th>
                        <th className="p-2.5">Evidence Photos</th>
                        <th className="p-2.5">Consistency</th>
                        <th className="p-2.5">Audit State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 print:divide-slate-300 font-mono text-[11px]">
                      {dossier.interventions.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-950/40">
                          <td className="p-2.5 font-sans font-medium text-slate-200 print:text-black">{item.name}</td>
                          <td className="p-2.5 font-sans text-slate-400 print:text-slate-700">{item.type}</td>
                          <td className="p-2.5 text-slate-400">
                            {item.target_coordinates[0].toFixed(4)}°, {item.target_coordinates[1].toFixed(4)}°
                          </td>
                          <td className="p-2.5 text-slate-300 print:text-black">{item.evidence_count}</td>
                          <td className="p-2.5 text-forest-400 print:text-emerald-700">
                            {item.consistent_count > 0 ? 'Verified Stream Bed' : 'Under Review'}
                          </td>
                          <td className="p-2.5 text-slate-300 print:text-black">
                            {item.reviewed_count > 0 ? 'Reviewed & Verified' : 'Preliminary'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Disclaimers & Methodology */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-1.5">
                <div className="font-semibold text-slate-300 print:text-black text-[10px] uppercase">
                  Statutory Disclaimers & Methodology Notes:
                </div>
                {dossier.disclaimers.map((d, i) => (
                  <p key={i} className="text-[10px] text-slate-400 print:text-slate-600 leading-relaxed">
                    [{i + 1}] {d}
                  </p>
                ))}
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 pt-8 text-center text-slate-400 print:text-black">
                <div>
                  <div className="h-10 border-b border-dashed border-slate-700 max-w-xs mx-auto mb-1"></div>
                  <p className="font-semibold text-slate-200 print:text-black">Field Watershed Team (WDT)</p>
                  <p className="text-[10px] text-slate-500">Surveyor & GPS Verification</p>
                </div>
                <div>
                  <div className="h-10 border-b border-dashed border-slate-700 max-w-xs mx-auto mb-1"></div>
                  <p className="font-semibold text-slate-200 print:text-black">SLNA / WCDC Nodal Officer</p>
                  <p className="text-[10px] text-slate-500">Hydrological Review & Approval</p>
                </div>
              </div>
            </>
          ) : null}

        </div>

      </div>
    </div>
  );
};
