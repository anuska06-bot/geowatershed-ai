import React from 'react';
import {
  Map,
  Bot,
  AlertTriangle,
  FileText,
  ArrowRight,
  ShieldCheck,
  Layers,
  Building2,
  CheckCircle2
} from 'lucide-react';

interface LandingViewProps {
  onLaunchExplorer: () => void;
  onSelectTab?: (tab: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onLaunchExplorer, onSelectTab }) => {
  return (
    <div className="space-y-6 py-2 max-w-6xl mx-auto font-sans">

      {/* 1. Hero Welcome Card */}
      <div className="border border-[#2c373d] bg-[#181f23] rounded-lg p-6 sm:p-8 relative overflow-hidden shadow-sm">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
            WDC-PMKSY 2.0 • National Geospatial Intelligence Gateway
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f1f0eb] font-mono leading-snug">
              Smart Geospatial Intelligence for Watershed Development
            </h1>
            <p className="text-xs sm:text-sm text-[#c5c3b8] max-w-3xl leading-relaxed">
              AI-driven monitoring of water harvesting and soil conservation structures across India.
              Synchronizing in-situ camera evidence with Sentinel-2 multi-spectral satellite imagery and drainage networks.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={onLaunchExplorer}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-md bg-[#10b981] hover:bg-[#059669] text-[#121619] font-bold text-xs font-mono tracking-wide transition-colors shadow-sm"
            >
              <span>ENTER GIS WORKSTATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onSelectTab && (
              <>
                <button
                  onClick={() => onSelectTab('minister')}
                  className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-md bg-[#1e262a] hover:bg-[#253035] text-[#f1f0eb] border border-[#2c373d] font-semibold text-xs font-mono transition-colors"
                >
                  <Building2 className="w-4 h-4 text-[#10b981]" />
                  <span>MINISTERIAL COMMAND</span>
                </button>

                <button
                  onClick={() => onSelectTab('analysis')}
                  className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-md bg-[#1e262a] hover:bg-[#253035] text-[#f59e0b] border border-[#f59e0b]/30 font-semibold text-xs font-mono transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                  <span>RISK ALERTS &amp; SUTRA-AI</span>
                </button>
              </>
            )}
          </div>

          {/* 4 Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#2c373d]">
            <div className="bg-[#121619] p-3 rounded border border-[#2c373d]/70">
              <span className="text-[11px] text-[#9ba3a7] font-mono block">Pan-India Basins</span>
              <span className="text-lg font-bold font-mono text-[#f1f0eb]">7 Flagship</span>
            </div>
            <div className="bg-[#121619] p-3 rounded border border-[#2c373d]/70">
              <span className="text-[11px] text-[#9ba3a7] font-mono block">Active Structures</span>
              <span className="text-lg font-bold font-mono text-[#10b981]">22 Sites</span>
            </div>
            <div className="bg-[#121619] p-3 rounded border border-[#2c373d]/70">
              <span className="text-[11px] text-[#9ba3a7] font-mono block">Storage Capacity</span>
              <span className="text-lg font-bold font-mono text-[#0ea5e9]">275 ML</span>
            </div>
            <div className="bg-[#121619] p-3 rounded border border-[#2c373d]/70">
              <span className="text-[11px] text-[#9ba3a7] font-mono block">Fund Utilization</span>
              <span className="text-lg font-bold font-mono text-[#d97706]">78.0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Three Simple Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#181f23] border border-[#2c373d] rounded-lg p-4 space-y-2">
          <div className="w-8 h-8 rounded bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-[#f1f0eb] font-mono">1. In-Situ Evidence Verification</h3>
          <p className="text-xs text-[#c5c3b8] leading-relaxed">
            GPS geotagging with EXIF validation, camera telemetry extraction, and automated blur detection to guarantee authentic field captures.
          </p>
        </div>

        <div className="bg-[#181f23] border border-[#2c373d] rounded-lg p-4 space-y-2">
          <div className="w-8 h-8 rounded bg-[#0ea5e9]/15 border border-[#0ea5e9]/30 flex items-center justify-center text-[#0ea5e9]">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-[#f1f0eb] font-mono">2. Satellite &amp; Drainage AI</h3>
          <p className="text-xs text-[#c5c3b8] leading-relaxed">
            Automated stream order 1–4 proximity checks, Sentinel-2 NDVI vegetative vigor, and NDWI water impoundment tracking.
          </p>
        </div>

        <div className="bg-[#181f23] border border-[#2c373d] rounded-lg p-4 space-y-2">
          <div className="w-8 h-8 rounded bg-[#d97706]/15 border border-[#d97706]/30 flex items-center justify-center text-[#d97706]">
            <Building2 className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-[#f1f0eb] font-mono">3. Ministerial Command &amp; Audit</h3>
          <p className="text-xs text-[#c5c3b8] leading-relaxed">
            Transparent expenditure tracking, state-wise rankings, and 1-click generation of Parliamentary and Cabinet briefing dossiers.
          </p>
        </div>
      </div>

      {/* 3. Quick Feature Access Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-[#9ba3a7] font-semibold">
          Platform Capabilities &amp; Navigation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div 
            onClick={onLaunchExplorer}
            className="bg-[#181f23] hover:bg-[#1e262a] border border-[#2c373d] hover:border-[#10b981]/50 rounded-lg p-4 cursor-pointer transition-colors space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <Map className="w-5 h-5 text-[#10b981]" />
              <h3 className="text-xs font-bold text-[#f1f0eb] font-mono">GIS Map Workstation</h3>
              <p className="text-[11px] text-[#9ba3a7] leading-relaxed">
                Strahler stream network, LULC layers, and intervention registers across India.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#10b981] flex items-center gap-1 pt-2">
              Launch Map →
            </span>
          </div>

          <div 
            onClick={() => onSelectTab && onSelectTab('analysis')}
            className="bg-[#181f23] hover:bg-[#1e262a] border border-[#2c373d] hover:border-[#d97706]/50 rounded-lg p-4 cursor-pointer transition-colors space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <AlertTriangle className="w-5 h-5 text-[#d97706]" />
              <h3 className="text-xs font-bold text-[#f1f0eb] font-mono">Risk Alert Zones</h3>
              <p className="text-[11px] text-[#9ba3a7] leading-relaxed">
                Gully erosion screening, moisture stress alerts, and rainfall cloudburst simulation.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#d97706] flex items-center gap-1 pt-2">
              Inspect Risks →
            </span>
          </div>

          <div 
            onClick={() => onSelectTab && onSelectTab('telemetry-ml')}
            className="bg-[#181f23] hover:bg-[#1e262a] border border-[#2c373d] hover:border-[#0ea5e9]/50 rounded-lg p-4 cursor-pointer transition-colors space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <Bot className="w-5 h-5 text-[#0ea5e9]" />
              <h3 className="text-xs font-bold text-[#f1f0eb] font-mono">SUTRA-AI Diagnostics</h3>
              <p className="text-[11px] text-[#9ba3a7] leading-relaxed">
                Video/photo computer vision analysis for siltation %, structural wear, and SoR costing.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#0ea5e9] flex items-center gap-1 pt-2">
              Open SUTRA-AI →
            </span>
          </div>

          <div 
            onClick={() => onSelectTab && onSelectTab('projects')}
            className="bg-[#181f23] hover:bg-[#1e262a] border border-[#2c373d] hover:border-[#10b981]/50 rounded-lg p-4 cursor-pointer transition-colors space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <FileText className="w-5 h-5 text-[#10b981]" />
              <h3 className="text-xs font-bold text-[#f1f0eb] font-mono">Dossiers &amp; Budget</h3>
              <p className="text-[11px] text-[#9ba3a7] leading-relaxed">
                Intervention expenditure registers, economic feasibility, and audit certificates.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#10b981] flex items-center gap-1 pt-2">
              View Register →
            </span>
          </div>
        </div>
      </div>

      {/* 4. Statutory & Governance Compliance Badges */}
      <div className="border border-[#2c373d] bg-[#121619] rounded-lg p-3.5 text-xs font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[#9ba3a7] text-[11px]">
          <span className="flex items-center gap-1.5 text-[#f1f0eb]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
            WDC-PMKSY 2.0 Compliant
          </span>
          <span className="hidden sm:inline text-[#2c373d]">•</span>
          <span>National Geospatial Policy 2022</span>
          <span className="hidden sm:inline text-[#2c373d]">•</span>
          <span>DPDP Act 2023 Sovereign Data</span>
          <span className="hidden sm:inline text-[#2c373d]">•</span>
          <span>Copernicus Sentinel-2 &amp; CartoDEM</span>
        </div>
      </div>

    </div>
  );
};
