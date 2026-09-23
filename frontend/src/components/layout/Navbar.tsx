import React, { useState, useEffect } from 'react';
import { UserRole, AuthUser, WatershedSummary } from '../../types';
import {
  Shield, Camera, FileText, Download, Layers,
  Map, Radar, Waves, AlertTriangle, Briefcase,
  Calculator, Smartphone, Home, LogOut, User,
  Building2, Bot, MapPin, ShieldCheck, Menu, X, ChevronDown, Compass
} from 'lucide-react';

export type AppTab =
  | 'overview'
  | 'minister'
  | 'explorer'
  | 'telemetry-ml'
  | 'flood-bypass'
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

export const WORKSTATION_TABS: { key: AppTab; label: string; icon: React.FC<any>; desc: string }[] = [
  { key: 'explorer', label: 'GIS Map & Streams', icon: Map, desc: 'D8 Drainage, Strahler Streams & Layers' },
  { key: 'minister', label: 'Ministerial Command', icon: Building2, desc: 'Cabinet Briefings & Pan-India Index' },
  { key: 'telemetry-ml', label: 'Watershed Telemetry', icon: Radar, desc: 'Live Open-Meteo & Soil ML Models' },
  { key: 'flood-bypass', label: 'Flood Bypass & Dam Tracker', icon: Waves, desc: 'Q50 Channels & Storage Siting' },
  { key: 'analysis', label: 'Flood Risk Alerts', icon: AlertTriangle, desc: 'Gully Erosion & SUTRA-AI Diagnostics' },
  { key: 'projects', label: 'Conservation Budget', icon: Briefcase, desc: 'Capital Outlay & Works Register' },
  { key: 'economics', label: 'Cost Analysis', icon: Calculator, desc: 'BCR Ratios & Economic Returns' },
  { key: 'survey', label: 'Field Surveyor Mobile', icon: Smartphone, desc: 'In-Situ Camera EXIF Verification' },
  { key: 'audit', label: 'Admin Portal & Reports', icon: ShieldCheck, desc: 'Cryptographic Ledger & Audit Logs' },
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
  onOpenLogin,
  onTabChange,
  onRoleChange,
  onOpenUpload,
  onOpenDossier,
  onDownloadCsv,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workstationMenuOpen, setWorkstationMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentTab !== 'overview') {
      onTabChange('overview');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0B1F1A]/95 backdrop-blur-md border-b border-[#7DD3A7]/20 shadow-lg shadow-black/30' 
          : 'bg-[#0B1F1A]/80 backdrop-blur-sm border-b border-[#7DD3A7]/10'
      } text-[#F4F7F5]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">

          {/* Left: Brand Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            onClick={() => {
              onTabChange('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#123C35] to-[#0B1F1A] border border-[#7DD3A7]/30 flex items-center justify-center shadow-md group-hover:border-[#7DD3A7]/60 transition-colors">
              <Layers className="w-5 h-5 text-[#7DD3A7]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white font-sans">
                  GeoWatershed <span className="text-[#7DD3A7]">AI</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1677FF]/15 text-[#38bdf8] border border-[#1677FF]/30 hidden md:inline-block uppercase tracking-wider">
                  WDC-PMKSY 2.0
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] hidden xl:block leading-none mt-0.5 font-sans">
                Intelligent Watershed Planning Platform
              </p>
            </div>
          </div>

          {/* Center: Story Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => scrollToSection('why-geowatershed')}
              className="hover:text-[#7DD3A7] transition-colors"
            >
              Why GeoWatershed
            </button>
            <button
              onClick={() => scrollToSection('interactive-map')}
              className="hover:text-[#7DD3A7] transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-[#1677FF]" />
              <span>Explore Map</span>
            </button>
            <button
              onClick={() => scrollToSection('ai-analysis')}
              className="hover:text-[#7DD3A7] transition-colors"
            >
              AI Analysis
            </button>
            <button
              onClick={() => scrollToSection('methodology')}
              className="hover:text-[#7DD3A7] transition-colors"
            >
              Methodology
            </button>
            <button
              onClick={() => scrollToSection('impact')}
              className="hover:text-[#7DD3A7] transition-colors"
            >
              Impact
            </button>
          </nav>

          {/* Right: Actions, Platform Workstation Selector & User */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

            {/* Pan-India Watershed Selector */}
            {watersheds.length > 0 && onSelectWatershed && (
              <div className="hidden sm:inline-flex items-center gap-1.5 h-9 bg-[#123C35]/60 hover:bg-[#123C35] border border-[#7DD3A7]/25 rounded-lg px-2.5 text-xs transition">
                <MapPin className="w-3.5 h-3.5 text-[#7DD3A7] flex-shrink-0" />
                <select
                  value={selectedWatershedId || ''}
                  onChange={(e) => onSelectWatershed(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-medium max-w-[140px] md:max-w-[180px] truncate"
                >
                  {watersheds.map((ws) => (
                    <option key={ws.id} value={ws.id} className="bg-[#0B1F1A] text-white">
                      {ws.state}: {ws.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Launch Platform / Workstation Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setWorkstationMenuOpen(!workstationMenuOpen)}
                className="h-9 px-3.5 rounded-lg bg-[#123C35] hover:bg-[#1b564c] border border-[#7DD3A7]/30 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition shadow-sm"
              >
                <Layers className="w-3.5 h-3.5 text-[#7DD3A7]" />
                <span className="hidden sm:inline">Platform Views</span>
                <span className="sm:hidden">Views</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform ${workstationMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Workstation Dropdown Modal */}
              {workstationMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0B1F1A] border border-[#7DD3A7]/25 rounded-xl shadow-2xl p-2 z-50 animate-fade-in"
                  onMouseLeave={() => setWorkstationMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Specialized Workstation Views
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1 space-y-0.5">
                    <button
                      onClick={() => {
                        onTabChange('overview');
                        setWorkstationMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-start gap-2.5 transition ${
                        currentTab === 'overview' ? 'bg-[#123C35] text-[#7DD3A7] font-semibold' : 'text-slate-300 hover:bg-[#123C35]/50'
                      }`}
                    >
                      <Home className="w-4 h-4 text-[#7DD3A7] mt-0.5 shrink-0" />
                      <div>
                        <div>Platform Overview &amp; Showcase</div>
                        <div className="text-[10px] text-slate-400">Cinematic story &amp; technical walkthrough</div>
                      </div>
                    </button>

                    {WORKSTATION_TABS.map(({ key, label, icon: Icon, desc }) => (
                      <button
                        key={key}
                        onClick={() => {
                          onTabChange(key);
                          setWorkstationMenuOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs flex items-start gap-2.5 transition ${
                          currentTab === key ? 'bg-[#123C35] text-[#7DD3A7] font-semibold' : 'text-slate-300 hover:bg-[#123C35]/50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${currentTab === key ? 'text-[#7DD3A7]' : 'text-[#1677FF]'}`} />
                        <div>
                          <div className="font-medium text-white">{label}</div>
                          <div className="text-[10px] text-slate-400">{desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SUTRA-AI Diagnostic Assistant Button */}
            {onOpenSutraAi && (
              <button
                type="button"
                onClick={onOpenSutraAi}
                className="h-9 px-3 rounded-lg bg-[#1677FF]/15 hover:bg-[#1677FF]/25 border border-[#1677FF]/40 text-[#38bdf8] text-xs font-semibold hidden md:inline-flex items-center gap-1.5 transition"
                title="Launch SUTRA-AI Video Diagnostics"
              >
                <Bot className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>SUTRA-AI</span>
              </button>
            )}

            {/* Dossier Briefing */}
            {onOpenDossier && (
              <button
                type="button"
                onClick={onOpenDossier}
                className="h-9 px-2.5 rounded-lg bg-[#123C35]/60 hover:bg-[#123C35] border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium hidden xl:inline-flex items-center gap-1.5 transition"
                title="Open Watershed Dossier (PDF Briefing)"
              >
                <FileText className="w-3.5 h-3.5 text-[#7DD3A7]" />
                <span>Dossier</span>
              </button>
            )}

            {/* Works Ledger CSV Export */}
            {onDownloadCsv && (
              <button
                type="button"
                onClick={onDownloadCsv}
                className="h-9 px-2.5 rounded-lg bg-[#123C35]/60 hover:bg-[#123C35] border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium hidden xl:inline-flex items-center gap-1.5 transition"
                title="Download Works Ledger CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Export</span>
              </button>
            )}

            {/* Primary Action / Launch CTA */}
            {currentTab === 'overview' ? (
              <button
                onClick={() => onTabChange('explorer')}
                className="h-9 px-4 rounded-lg bg-[#10b981] hover:bg-[#059669] text-[#0B1F1A] font-bold text-xs inline-flex items-center gap-1.5 transition shadow"
              >
                <span>Launch GIS</span>
              </button>
            ) : (
              <button
                onClick={() => onTabChange('overview')}
                className="h-9 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium inline-flex items-center gap-1.5 transition border border-slate-700"
              >
                <span>Showcase</span>
              </button>
            )}

            {/* User Profile or Sign In */}
            {user ? (
              <div className="hidden xl:flex items-center gap-2">
                <div className="h-9 px-2.5 rounded-lg bg-[#123C35]/40 border border-[#7DD3A7]/20 text-xs text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#7DD3A7]" />
                  <span className="font-semibold text-white max-w-[100px] truncate">{user.name || user.identifier}</span>
                </div>
                {onRoleChange && (
                  <div className="inline-flex items-center gap-1 h-9 bg-[#123C35]/40 border border-slate-700/50 rounded-lg px-2 text-xs">
                    <Shield className="w-3 h-3 text-[#7DD3A7]" />
                    <select
                      value={currentRole}
                      onChange={(e) => onRoleChange(e.target.value as UserRole)}
                      className="bg-transparent text-[11px] text-slate-300 focus:outline-none cursor-pointer"
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
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="h-9 w-9 rounded-lg bg-[#123C35]/40 hover:bg-rose-950/60 border border-slate-700/60 text-slate-400 hover:text-rose-400 inline-flex items-center justify-center transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : onOpenLogin ? (
              <button
                onClick={onOpenLogin}
                className="h-9 px-3 rounded-lg bg-[#123C35]/50 hover:bg-[#123C35] text-xs font-medium text-slate-200 border border-slate-700 transition"
              >
                Sign In
              </button>
            ) : null}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-9 w-9 rounded-lg bg-[#123C35] border border-[#7DD3A7]/30 text-white flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>
        </div>

        {/* Workstation Mode Subheader Bar (Visible when in a Workstation Tab) */}
        {currentTab !== 'overview' && (
          <nav className="flex items-center gap-1.5 overflow-x-auto py-2 text-xs font-medium scrollbar-none border-t border-slate-800/80">
            <button
              onClick={() => onTabChange('overview')}
              className="h-7 inline-flex items-center gap-1 px-2.5 rounded-md text-slate-400 hover:text-white transition whitespace-nowrap"
            >
              <Home className="w-3 h-3 text-[#7DD3A7]" />
              <span>Showcase</span>
            </button>
            {WORKSTATION_TABS.map(({ key, label, icon: Icon }) => {
              const active = currentTab === key;
              return (
                <button
                  key={key}
                  onClick={() => onTabChange(key)}
                  className={`h-7 inline-flex items-center gap-1.5 px-2.5 rounded-md whitespace-nowrap transition-colors flex-shrink-0 text-xs ${
                    active
                      ? 'bg-[#123C35] text-[#7DD3A7] border border-[#7DD3A7]/40 font-semibold'
                      : 'text-slate-400 border border-transparent hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#7DD3A7]' : 'text-slate-400'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#7DD3A7]/20 py-4 px-2 space-y-3 bg-[#0B1F1A] animate-fade-in">
            <div className="space-y-1 text-sm font-medium">
              <button
                onClick={() => scrollToSection('why-geowatershed')}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-[#123C35] transition"
              >
                Why GeoWatershed
              </button>
              <button
                onClick={() => scrollToSection('interactive-map')}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-[#123C35] transition flex items-center justify-between"
              >
                <span>Interactive Map</span>
                <span className="text-[10px] text-[#7DD3A7] bg-[#7DD3A7]/15 px-2 py-0.5 rounded">Live Leaflet</span>
              </button>
              <button
                onClick={() => scrollToSection('ai-analysis')}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-[#123C35] transition"
              >
                AI Analysis &amp; Siting
              </button>
              <button
                onClick={() => scrollToSection('methodology')}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-[#123C35] transition"
              >
                Methodology &amp; Standards
              </button>
              <button
                onClick={() => scrollToSection('impact')}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-[#123C35] transition"
              >
                Project Impact Metrics
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="text-[10px] font-mono uppercase text-slate-400 px-3 font-semibold">
                Direct Workstation Access
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    onTabChange('explorer');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-lg bg-[#123C35]/60 hover:bg-[#123C35] text-left text-xs font-medium text-white flex items-center gap-1.5 border border-slate-700/60"
                >
                  <Map className="w-3.5 h-3.5 text-[#7DD3A7]" />
                  <span>GIS Explorer</span>
                </button>
                <button
                  onClick={() => {
                    onTabChange('minister');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-lg bg-[#123C35]/60 hover:bg-[#123C35] text-left text-xs font-medium text-white flex items-center gap-1.5 border border-slate-700/60"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ministerial</span>
                </button>
                <button
                  onClick={() => {
                    onTabChange('telemetry-ml');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-lg bg-[#123C35]/60 hover:bg-[#123C35] text-left text-xs font-medium text-white flex items-center gap-1.5 border border-slate-700/60"
                >
                  <Radar className="w-3.5 h-3.5 text-sky-400" />
                  <span>Telemetry</span>
                </button>
                <button
                  onClick={() => {
                    onTabChange('flood-bypass');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-lg bg-[#123C35]/60 hover:bg-[#123C35] text-left text-xs font-medium text-white flex items-center gap-1.5 border border-slate-700/60"
                >
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Flood Bypass</span>
                </button>
              </div>
            </div>

            {onOpenUpload && (
              <button
                onClick={() => {
                  onOpenUpload();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-lg bg-[#10b981] text-[#0B1F1A] font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Field Evidence Photo</span>
              </button>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
