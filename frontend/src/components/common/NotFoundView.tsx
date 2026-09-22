import React from 'react';
import { Compass, Home, MapPin, AlertTriangle } from 'lucide-react';
import { AppTab } from '../layout/Navbar';

interface NotFoundViewProps {
  invalidEntity?: string;
  onNavigateTab: (tab: AppTab) => void;
  onResetWatershed?: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  invalidEntity = 'Analytical View or Watershed Coordinate',
  onNavigateTab,
  onResetWatershed
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-[#f1f0eb]">
      <div className="max-w-lg w-full bg-[#181f23] border border-[#2c373d] rounded-xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Subtle contour SVG bg */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="50%" cy="50%" r="20%" fill="none" stroke="#10b981" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1e262a] border border-[#f59e0b]/40 flex items-center justify-center text-[#f59e0b] mb-4 shadow-inner">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 text-xs font-mono font-semibold mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>ERROR 404 • GEOSPATIAL VECTOR NOT FOUND</span>
          </div>

          <h2 className="text-2xl font-bold font-mono tracking-tight text-[#f1f0eb]">
            Catchment Out of Bounds
          </h2>

          <p className="text-xs text-[#9ba3a7] mt-2 leading-relaxed max-w-md">
            The geospatial resource <code className="text-[#10b981] bg-[#121619] px-1.5 py-0.5 rounded font-mono">{invalidEntity}</code> does not exist in the WDC-PMKSY national database or has been re-indexed.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => onNavigateTab('overview')}
              className="flex-1 py-2.5 px-4 bg-[#10b981] hover:bg-[#059669] text-[#121619] text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>Return to Dossier</span>
            </button>

            {onResetWatershed && (
              <button
                onClick={onResetWatershed}
                className="flex-1 py-2.5 px-4 bg-[#1e262a] hover:bg-[#253036] text-[#c5c3b8] hover:text-[#f1f0eb] text-xs font-mono font-semibold uppercase tracking-wider rounded-lg border border-[#2c373d] transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-[#10b981]" />
                <span>Default Watershed</span>
              </button>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#242d32] text-[11px] text-[#64748b] font-mono flex items-center justify-center gap-4">
            <button
              onClick={() => onNavigateTab('explorer')}
              className="hover:text-[#10b981] transition-colors"
            >
              GIS Workstation
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigateTab('analysis')}
              className="hover:text-[#10b981] transition-colors"
            >
              Risk Alerts
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigateTab('minister')}
              className="hover:text-[#10b981] transition-colors"
            >
              Ministerial Command
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
