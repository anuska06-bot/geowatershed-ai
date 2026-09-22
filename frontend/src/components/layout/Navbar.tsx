import React from 'react';
import { UserRole, AuthUser, WatershedSummary } from '../../types';
import {
  Shield, Camera, FileText, Download, Layers,
  Map, Radar, GitCompare, AlertTriangle, Briefcase,
  Calculator, Smartphone, Lock, Home, LogOut, User,
  Building2, Bot, MapPin
} from 'lucide-react';

export type AppTab =
  | 'overview'
  | 'minister'
  | 'explorer'
  | 'telemetry-ml'
  | 'before-after'
  | 'analysis'
  | 'projects'
  | 'economics'
  | 'survey'
  | 'audit';

interface NavbarProps {
  currentRole: UserRole;
  currentTab: AppTab;
  user?: AuthUser | null;
  watersheds?: WatershedSummary[];
  selectedWatershedId?: string;
  onSelectWatershed?: (id: string) => void;
  onOpenSutraAi?: () => void;
  onSignOut?: () => void;
  onTabChange: (tab: AppTab) => void;
  onRoleChange: (role: UserRole) => void;
  onOpenUpload: () => void;
  onOpenDossier: () => void;
  onDownloadCsv: () => void;
}

const ROLES: { key: UserRole; label: string; badge: string }[] = [
  { key: 'ROLE_CITIZEN', label: 'Citizen', badge: 'Public Access' },
  { key: 'ROLE_FIELD_OFFICER', label: 'Field Officer', badge: 'Surveyor Mode' },
  { key: 'ROLE_MANAGER', label: 'Project Manager', badge: 'Approval Authority' },
  { key: 'ROLE_ANALYST', label: 'GIS Analyst', badge: 'Technical Audit' },
];

const TABS: { key: AppTab; label: string; icon: React.FC<any> }[] = [
  { key: 'overview', label: 'Dossier Overview', icon: Home },
  { key: 'minister', label: 'Ministerial Command', icon: Building2 },
  { key: 'explorer', label: 'GIS Workstation & Evidence', icon: Map },
  { key: 'telemetry-ml', label: 'ML Telemetry & Models', icon: Radar },
  { key: 'before-after', label: 'Temporal Differential', icon: GitCompare },
  { key: 'analysis', label: 'Hydrologic Risk Alerts', icon: AlertTriangle },
  { key: 'projects', label: 'Interventions & Budget', icon: Briefcase },
  { key: 'economics', label: 'Benefit-Cost Analysis', icon: Calculator },
  { key: 'survey', label: 'Field Surveyor PWA', icon: Smartphone },
  { key: 'audit', label: 'Audit Trail & Compliance', icon: Lock },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentTab,
  user,
  watersheds = [],
  selectedWatershedId,
  onSelectWatershed,
  onOpenSutraAi,
  onSignOut,
  onTabChange,
  onRoleChange,
  onOpenUpload,
  onOpenDossier,
  onDownloadCsv,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#121619] border-b border-[#2c373d] text-[#f1f0eb]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Top Header Strip */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3 border-b border-[#1c2427]">

          {/* Institutional Crest & Brand Title */}
          <div className="flex items-center gap-2.5 cursor-pointer flex-shrink-0" onClick={() => onTabChange('overview')}>
            <div className="w-8 h-8 rounded-md bg-[#181f23] border border-[#10b981]/50 flex items-center justify-center flex-shrink-0">
              <Layers className="w-4 h-4 text-[#10b981]" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-[#f1f0eb] font-mono leading-tight whitespace-nowrap">
                  GeoWatershed<span className="text-[#10b981]"> AI</span>
                </span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 hidden md:inline-block leading-none whitespace-nowrap">
                  WDC-PMKSY 2.0
                </span>
              </div>
              <p className="text-[10px] text-[#9ba3a7] font-mono hidden xl:block leading-none mt-0.5 whitespace-nowrap">
                Smart Geospatial Intelligence
              </p>
            </div>
          </div>

          {/* Pan-India Watershed Selector (Dropdown) */}
          {watersheds.length > 0 && onSelectWatershed && (
            <div className="hidden md:inline-flex items-center gap-1.5 h-8 bg-[#181f23] border border-[#2c373d] rounded-md px-2 text-xs font-mono flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#10b981] flex-shrink-0" />
              <select
                value={selectedWatershedId || ''}
                onChange={(e) => onSelectWatershed(e.target.value)}
                className="bg-transparent text-xs text-[#f1f0eb] focus:outline-none cursor-pointer font-mono font-medium max-w-[160px] lg:max-w-[220px] truncate leading-none"
              >
                {watersheds.map((ws) => (
                  <option key={ws.id} value={ws.id} className="bg-[#181f23] text-[#f1f0eb]">
                    {ws.state}: {ws.name} ({ws.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Action Buttons & Role Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

            {/* SUTRA-AI Diagnostic Assistant Button */}
            {onOpenSutraAi && (
              <button
                type="button"
                onClick={onOpenSutraAi}
                className="h-8 px-2.5 rounded-md bg-[#181f23] hover:bg-[#222c32] border border-[#10b981]/60 text-[#10b981] text-xs font-mono font-medium inline-flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 transition-colors shadow-sm"
                title="Open SUTRA-AI Video & Field Diagnostics"
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">SUTRA-AI</span>
              </button>
            )}

            {/* Quick Upload Button */}
            {(currentRole === 'ROLE_FIELD_OFFICER' || currentRole === 'ROLE_ANALYST' || currentRole === 'ROLE_MANAGER') && (
              <button
                onClick={onOpenUpload}
                className="h-8 px-2.5 rounded-md bg-[#10b981] hover:bg-[#059669] text-[#121619] text-xs font-mono font-bold inline-flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 transition-colors"
                title="Upload In-Situ Photographic Evidence"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline whitespace-nowrap">Upload</span>
              </button>
            )}

            {/* Dossier Report */}
            <button
              onClick={onOpenDossier}
              className="h-8 px-2.5 rounded-md bg-[#181f23] hover:bg-[#222c32] border border-[#2c373d] text-[#c5c3b8] hover:text-[#f1f0eb] text-xs font-mono inline-flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 transition-colors"
              title="Open Official Evidence Dossier"
            >
              <FileText className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="hidden lg:inline whitespace-nowrap">Dossier</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={onDownloadCsv}
              className="h-8 w-8 rounded-md bg-[#181f23] hover:bg-[#222c32] border border-[#2c373d] text-[#9ba3a7] hover:text-[#f1f0eb] inline-flex items-center justify-center flex-shrink-0 transition-colors"
              title="Download Tabular CSV"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* User Profile Badge */}
            {user && (
              <div className="hidden xl:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md bg-[#181f23] border border-[#2c373d] text-xs font-mono text-[#c5c3b8] whitespace-nowrap flex-shrink-0">
                <User className="w-3.5 h-3.5 text-[#10b981]" />
                <span className="font-semibold text-[#f1f0eb]">{user.name || user.identifier}</span>
              </div>
            )}

            {/* Role Switcher */}
            <div className="inline-flex items-center gap-1.5 h-8 bg-[#181f23] border border-[#2c373d] rounded-md px-2 font-mono flex-shrink-0">
              <Shield className="w-3.5 h-3.5 text-[#9ba3a7]" />
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent text-xs text-[#f1f0eb] focus:outline-none cursor-pointer font-medium font-mono leading-none"
              >
                {ROLES.map((r) => (
                  <option key={r.key} value={r.key} className="bg-[#181f23] text-[#f1f0eb]">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sign Out Button */}
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="h-8 w-8 rounded-md bg-[#181f23] hover:bg-[#222c32] border border-[#2c373d] text-[#e11d48] inline-flex items-center justify-center flex-shrink-0 transition-colors"
                title="Sign Out of Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}

          </div>
        </div>

        {/* Primary Tab Navigation Subheader */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1.5 text-xs font-medium scrollbar-none font-mono">
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = currentTab === key;
            return (
              <button
                key={key}
                onClick={() => onTabChange(key)}
                className={`h-7.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md whitespace-nowrap transition-colors flex-shrink-0 ${
                  active
                    ? 'bg-[#181f23] text-[#10b981] border border-[#10b981]/50 font-semibold'
                    : 'text-[#9ba3a7] border border-transparent hover:text-[#f1f0eb] hover:bg-[#181f23]/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#10b981]' : 'text-[#9ba3a7]'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
