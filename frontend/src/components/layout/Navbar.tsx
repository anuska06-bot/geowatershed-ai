import React, { useState, useEffect } from 'react';
import { UserRole, AuthUser, WatershedSummary } from '../../types';
import {
  Shield, Camera, FileText, Download, Layers,
  Map, Smartphone, Home, LogOut, User,
  Bot, MapPin, Menu, X, Sparkles, Mountain, TrendingUp
} from 'lucide-react';

export type AppTab =
  | 'dashboard'
  | 'explorer'
  | 'image-intelligence'
  | 'analysis'
  | 'change-detection'
  | 'interventions'
  | 'recommendations'
  | 'reports'
  | 'survey'
  | 'overview'
  | 'minister'
  | 'telemetry-ml'
  | 'flood-bypass'
  | 'projects'
  | 'economics'
  | 'audit';

interface NavbarProps {
  currentRole: UserRole;
  currentTab: AppTab;
  user?: AuthUser | null;
  watersheds?: WatershedSummary[];
  selectedWatershedId?: string;
  onSelectWatershed?: (id: string) => void;
  onOpenSutraAi?: () => void;
  onOpenAskAi?: () => void;
  onSignOut?: () => void;
  onOpenLogin?: () => void;
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
  { key: 'ROLE_ADMIN', label: 'Administrator', badge: 'Admin Portal' },
];

export const ALL_SUBPARTS_TABS: { key: AppTab; label: string; icon: React.FC<any>; desc: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, desc: 'Operational Overview & Catchment KPIs' },
  { key: 'explorer', label: 'Explore Map', icon: Map, desc: 'GIS Workstation, D8 Drainage & Layers' },
  { key: 'image-intelligence', label: 'Image Intelligence', icon: Camera, desc: 'Geo-Coded EXIF Photos & Classification' },
  { key: 'analysis', label: 'Watershed Analysis', icon: Mountain, desc: 'Terrain, Elevation & Runoff Potential' },
  { key: 'change-detection', label: 'Change Detection', icon: TrendingUp, desc: 'Before vs After Multi-Spectral Audit' },
  { key: 'interventions', label: 'Interventions', icon: Layers, desc: 'Structured Works & Field Inspection Registry' },
  { key: 'recommendations', label: 'AI Recommendations', icon: Sparkles, desc: 'Siting, Drainage & Cost Estimation' },
  { key: 'reports', label: 'Reports', icon: FileText, desc: 'Automated 15-Point Outcome Dossier' },
  { key: 'survey', label: 'Field Mobile PWA', icon: Smartphone, desc: 'Handheld GPS Evidence Collector' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentTab,
  user,
  watersheds = [],
  selectedWatershedId,
  onSelectWatershed,
  onOpenSutraAi,
  onOpenAskAi,
  onSignOut,
  onOpenLogin,
  onTabChange,
  onRoleChange,
  onOpenUpload,
  onOpenDossier,
  onDownloadCsv,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0B1F1A]/95 backdrop-blur-md border-b border-[#7DD3A7]/20 shadow-lg shadow-black/30' 
          : 'bg-[#0B1F1A]/90 backdrop-blur-sm border-b border-slate-800'
      } text-[#F4F7F5]`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Navbar Top Row */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 border-b border-slate-800/80">

          {/* Left: Brand Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            onClick={() => {
              onTabChange('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#123C35] to-[#0B1F1A] border border-[#7DD3A7]/40 flex items-center justify-center shadow-md group-hover:border-[#7DD3A7] transition-colors shrink-0">
              <Layers className="w-5 h-5 text-[#7DD3A7]" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-lg tracking-tight text-white font-sans whitespace-nowrap leading-tight">
                GeoWatershed <span className="text-[#7DD3A7]">AI</span>
              </span>
              <span className="text-xs text-slate-300 font-sans tracking-tight whitespace-nowrap leading-tight mt-0.5">
                Geospatial Decision Support System
              </span>
            </div>
          </div>

          {/* Center-Left: Pan-India Watershed Selector */}
          {watersheds.length > 0 && onSelectWatershed && (
            <div className="hidden md:inline-flex items-center gap-1.5 h-9 bg-[#123C35]/60 hover:bg-[#123C35] border border-[#7DD3A7]/25 rounded-lg px-2.5 text-xs transition flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#7DD3A7] flex-shrink-0" />
              <select
                value={selectedWatershedId || ''}
                onChange={(e) => onSelectWatershed(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-medium max-w-[130px] lg:max-w-[210px] truncate"
                title="Select Active Micro-Watershed"
              >
                {watersheds.map((ws) => (
                  <option key={ws.id} value={ws.id} className="bg-[#0B1F1A] text-white">
                    {ws.state}: {ws.name} ({ws.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Right: Quick Action Buttons & User Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

            {/* Ask GeoWatershed AI Assistant */}
            {onOpenAskAi && (
              <button
                type="button"
                onClick={onOpenAskAi}
                className="h-8.5 px-2.5 rounded-lg bg-[#123C35] hover:bg-[#1b564c] border border-[#7DD3A7]/40 text-[#7DD3A7] text-xs font-mono font-semibold inline-flex items-center gap-1.5 transition shadow-sm whitespace-nowrap"
                title="Ask Technical Questions Grounded in Catchment Data"
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            )}

            {/* SUTRA-AI Diagnostic Tool */}
            {onOpenSutraAi && (
              <button
                type="button"
                onClick={onOpenSutraAi}
                className="h-8.5 px-2.5 rounded-lg bg-[#07130F] hover:bg-[#123C35] border border-slate-700/80 text-slate-300 hover:text-white text-xs font-mono font-semibold inline-flex items-center gap-1.5 transition shadow-sm whitespace-nowrap"
                title="Open SUTRA-AI Diagnostic Assistant"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#7DD3A7]" />
                <span className="hidden sm:inline">SUTRA-AI</span>
              </button>
            )}

            {/* In-Situ Photographic Upload Button */}
            {(currentRole === 'ROLE_FIELD_OFFICER' || currentRole === 'ROLE_ANALYST' || currentRole === 'ROLE_MANAGER' || currentRole === 'ROLE_ADMIN') && (
              <button
                onClick={onOpenUpload}
                className="h-8.5 px-2.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-[#0B1F1A] text-xs font-mono font-bold inline-flex items-center gap-1.5 transition whitespace-nowrap shadow-sm"
                title="Upload In-Situ Photographic Evidence"
              >
                <Camera className="w-3.5 h-3.5 text-[#0B1F1A]" />
                <span className="hidden md:inline">Upload</span>
              </button>
            )}

            {/* Dossier Report */}
            {onOpenDossier && (
              <button
                onClick={onOpenDossier}
                className="h-8.5 px-2.5 rounded-lg bg-[#07130F] hover:bg-[#123C35] border border-slate-700/80 text-slate-300 hover:text-white text-xs font-mono inline-flex items-center gap-1.5 transition whitespace-nowrap"
                title="Official Watershed Dossier Briefing"
              >
                <FileText className="w-3.5 h-3.5 text-[#7DD3A7]" />
                <span className="hidden lg:inline">Dossier</span>
              </button>
            )}

            {/* Export CSV */}
            {onDownloadCsv && (
              <button
                onClick={onDownloadCsv}
                className="h-8.5 w-8.5 rounded-lg bg-[#07130F] hover:bg-[#123C35] border border-slate-700/80 text-slate-300 hover:text-white inline-flex items-center justify-center transition"
                title="Export Tabular Works Ledger (CSV)"
              >
                <Download className="w-3.5 h-3.5 text-[#38bdf8]" />
              </button>
            )}

            {/* User Profile Chip */}
            {user ? (
              <div className="hidden lg:flex items-center gap-1.5">
                <div className="h-8.5 px-2.5 rounded-lg bg-[#07130F] border border-slate-700/80 text-xs text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#7DD3A7]" />
                  <span className="font-semibold text-white max-w-[110px] truncate">
                    {user.name || user.identifier}
                  </span>
                </div>

                {/* Role Switcher Dropdown */}
                {onRoleChange && (
                  <div className="inline-flex items-center gap-1 h-8.5 bg-[#07130F] border border-slate-700/80 rounded-lg px-2 text-xs">
                    <Shield className="w-3 h-3 text-[#7DD3A7]" />
                    <select
                      value={currentRole}
                      onChange={(e) => onRoleChange(e.target.value as UserRole)}
                      className="bg-transparent text-[11px] text-slate-200 focus:outline-none cursor-pointer font-mono"
                      title="Switch Access Role"
                    >
                      {ROLES.map((r) => (
                        <option key={r.key} value={r.key} className="bg-[#0B1F1A] text-white">
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sign Out Button */}
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="h-8.5 w-8.5 rounded-lg bg-[#07130F] hover:bg-rose-950/80 border border-slate-700/80 text-slate-400 hover:text-rose-400 inline-flex items-center justify-center transition"
                    title="Sign Out of Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : onOpenLogin ? (
              <button
                onClick={onOpenLogin}
                className="h-8.5 px-3 rounded-lg bg-[#123C35] hover:bg-[#1b564c] text-xs font-semibold text-white border border-[#7DD3A7]/40 transition whitespace-nowrap"
              >
                Sign In
              </button>
            ) : null}

            {/* Mobile / Tablet Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-8.5 w-8.5 rounded-lg bg-[#123C35] border border-[#7DD3A7]/30 text-white flex items-center justify-center shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>
        </div>

        {/* Permanent Sub-Parts Navigation Bar (Visible across all features & views) */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-2 text-xs font-medium scrollbar-none">
          {ALL_SUBPARTS_TABS.map(({ key, label, icon: Icon }) => {
            const active = currentTab === key;
            return (
              <button
                key={key}
                onClick={() => onTabChange(key)}
                className={`h-8 inline-flex items-center gap-1.5 px-3 rounded-lg whitespace-nowrap transition-all flex-shrink-0 text-xs font-medium ${
                  active
                    ? 'bg-[#123C35] text-[#7DD3A7] border border-[#7DD3A7]/40 font-semibold shadow-sm'
                    : 'text-slate-400 border border-transparent hover:text-white hover:bg-slate-800/60'
                }`}
                title={label}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#7DD3A7]' : 'text-slate-400'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile / Tablet Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#7DD3A7]/20 py-4 px-2 space-y-3 bg-[#0B1F1A] animate-fade-in">
            <div className="text-[11px] font-mono uppercase text-slate-400 px-3 font-semibold">
              Platform Features &amp; Modules
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {ALL_SUBPARTS_TABS.map(({ key, label, icon: Icon }) => {
                const active = currentTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      onTabChange(key);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center gap-2.5 transition ${
                      active
                        ? 'bg-[#123C35] text-[#7DD3A7] font-semibold border border-[#7DD3A7]/40'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#7DD3A7]' : 'text-slate-400'}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Actions Strip */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              {/* Watershed selector for mobile */}
              {watersheds.length > 0 && onSelectWatershed && (
                <div className="flex items-center gap-2 p-2 bg-[#07130F] rounded-lg border border-slate-800 text-xs">
                  <MapPin className="w-4 h-4 text-[#7DD3A7] shrink-0" />
                  <select
                    value={selectedWatershedId || ''}
                    onChange={(e) => {
                      onSelectWatershed(e.target.value);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {watersheds.map((ws) => (
                      <option key={ws.id} value={ws.id} className="bg-[#0B1F1A] text-white">
                        {ws.state}: {ws.name} ({ws.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Mobile Role Switcher */}
              {user && onRoleChange && (
                <div className="flex items-center justify-between p-2 bg-[#07130F] rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Shield className="w-4 h-4 text-[#7DD3A7]" />
                    <span>Role:</span>
                  </div>
                  <select
                    value={currentRole}
                    onChange={(e) => {
                      onRoleChange(e.target.value as UserRole);
                      setMobileMenuOpen(false);
                    }}
                    className="bg-[#0B1F1A] text-xs text-[#7DD3A7] font-mono px-2 py-1 rounded border border-slate-700 focus:outline-none"
                  >
                    {ROLES.map((r) => (
                      <option key={r.key} value={r.key}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Mobile Sign Out */}
              {user && onSignOut && (
                <button
                  onClick={() => {
                    onSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-900/80 text-rose-300 font-mono text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Session</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
