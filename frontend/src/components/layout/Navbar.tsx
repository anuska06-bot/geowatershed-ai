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
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
            onClick={() => {
              onTabChange('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#123C35] to-[#0B1F1A] border border-[#7DD3A7]/30 flex items-center justify-center shadow-md group-hover:border-[#7DD3A7]/60 transition-colors">
              <Layers className="w-5 h-5 text-[#7DD3A7]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white font-sans whitespace-nowrap">
                GeoWatershed <span className="text-[#7DD3A7]">AI</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1677FF]/15 text-[#38bdf8] border border-[#1677FF]/30 hidden sm:inline-block uppercase tracking-wider whitespace-nowrap">
                WDC-PMKSY 2.0
              </span>
            </div>
          </div>

          {/* Center: Story Navigation Links (Desktop Widescreen) */}
          <nav className="hidden xl:flex items-center gap-6 text-xs font-mono uppercase tracking-wider font-semibold text-slate-300 whitespace-nowrap">
            <button
              onClick={() => scrollToSection('land-topography')}
              className="hover:text-[#7DD3A7] transition-colors"
            >
              Terrain
            </button>
            <button
              onClick={() => scrollToSection('water-hydrology')}
              className="hover:text-[#1677FF] transition-colors"
            >
              Hydrology
            </button>
            <button
              onClick={() => scrollToSection('satellite-groundtruth')}
              className="hover:text-cyan-400 transition-colors"
            >
              Satellite Truth
            </button>
            <button
              onClick={() => scrollToSection('ai-analysis')}
              className="hover:text-emerald-400 transition-colors"
            >
              AI Siting
            </button>
            <button
              onClick={() => scrollToSection('decision-gis')}
              className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Interactive GIS</span>
            </button>
            <button
              onClick={() => scrollToSection('methodology')}
              className="hover:text-slate-100 transition-colors text-slate-400"
            >
              Standards
            </button>
          </nav>

          {/* Right: Actions, Platform Workstation Selector & User */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">

            {/* Pan-India Watershed Selector */}
            {watersheds.length > 0 && onSelectWatershed && (
              <div className="hidden md:inline-flex items-center gap-1.5 h-9 bg-[#123C35]/60 hover:bg-[#123C35] border border-[#7DD3A7]/25 rounded-lg px-2.5 text-xs transition">
                <MapPin className="w-3.5 h-3.5 text-[#7DD3A7] flex-shrink-0" />
                <select
                  value={selectedWatershedId || ''}
                  onChange={(e) => onSelectWatershed(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-medium max-w-[130px] lg:max-w-[170px] truncate"
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
                className="h-9 px-3 rounded-lg bg-[#123C35] hover:bg-[#1b564c] border border-[#7DD3A7]/30 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition shadow-sm whitespace-nowrap"
              >
                <Layers className="w-3.5 h-3.5 text-[#7DD3A7]" />
                <span>Platform Views</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform ${workstationMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Workstation Dropdown Modal */}
              {workstationMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0B1F1A] border border-[#7DD3A7]/25 rounded-xl shadow-2xl p-2 z-50 animate-fade-in"
                  onMouseLeave={() => setWorkstationMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
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

                    {/* Integrated Tools & Reports */}
                    <div className="px-3 pt-2.5 pb-1 border-t border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Integrated Tools &amp; Reports
                    </div>
                    {onOpenSutraAi && (
                      <button
                        onClick={() => {
                          onOpenSutraAi();
                          setWorkstationMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg text-xs flex items-center gap-2.5 text-slate-300 hover:bg-[#123C35]/60 hover:text-white transition"
                      >
                        <Bot className="w-4 h-4 text-[#38bdf8] shrink-0" />
                        <div>
                          <div className="font-medium text-white">SUTRA-AI Diagnostics</div>
                          <div className="text-[10px] text-slate-400">Computer vision erosion &amp; check dam analysis</div>
                        </div>
                      </button>
                    )}
                    {onOpenDossier && (
                      <button
                        onClick={() => {
                          onOpenDossier();
                          setWorkstationMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg text-xs flex items-center gap-2.5 text-slate-300 hover:bg-[#123C35]/60 hover:text-white transition"
                      >
                        <FileText className="w-4 h-4 text-[#7DD3A7] shrink-0" />
                        <div>
                          <div className="font-medium text-white">Watershed Dossier</div>
                          <div className="text-[10px] text-slate-400">Automated DPR briefing dossier (PDF)</div>
                        </div>
                      </button>
                    )}
                    {onDownloadCsv && (
                      <button
                        onClick={() => {
                          onDownloadCsv();
                          setWorkstationMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg text-xs flex items-center gap-2.5 text-slate-300 hover:bg-[#123C35]/60 hover:text-white transition"
                      >
                        <Download className="w-4 h-4 text-[#38bdf8] shrink-0" />
                        <div>
                          <div className="font-medium text-white">Works Ledger (CSV)</div>
                          <div className="text-[10px] text-slate-400">Download complete telemetry &amp; evidence data</div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action / Launch CTA */}
            {currentTab === 'overview' ? (
              <button
                onClick={() => onTabChange('explorer')}
                className="h-9 px-3.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-[#0B1F1A] font-bold text-xs inline-flex items-center gap-1.5 transition shadow whitespace-nowrap"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Launch GIS</span>
              </button>
            ) : (
              <button
                onClick={() => onTabChange('overview')}
                className="h-9 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium inline-flex items-center gap-1.5 transition border border-slate-700 whitespace-nowrap"
              >
                <span>Showcase</span>
              </button>
            )}

            {/* User Profile or Sign In */}
            {user ? (
              <div className="hidden lg:flex items-center gap-2">
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
                className="h-9 px-3 rounded-lg bg-[#123C35]/50 hover:bg-[#123C35] text-xs font-medium text-slate-200 border border-slate-700 transition whitespace-nowrap"
              >
                Sign In
              </button>
            ) : null}

            {/* Mobile / Tablet Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden h-9 w-9 rounded-lg bg-[#123C35] border border-[#7DD3A7]/30 text-white flex items-center justify-center shrink-0"
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

        {/* Mobile / Tablet Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[#7DD3A7]/20 py-4 px-2 space-y-3 bg-[#0B1F1A] animate-fade-in">
            <div className="space-y-1 text-sm font-medium font-mono">
              <button
                onClick={() => {
                  scrollToSection('land-topography');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-[#123C35] transition flex items-center justify-between"
              >
                <span>Terrain &amp; Topography (DEM)</span>
                <span className="text-[10px] text-[#7DD3A7]">Phase 01</span>
              </button>
              <button
                onClick={() => {
                  scrollToSection('water-hydrology');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-[#123C35] transition flex items-center justify-between"
              >
                <span>Hydrological Flow &amp; D8 Streams</span>
                <span className="text-[10px] text-[#1677FF]">Phase 02</span>
              </button>
              <button
                onClick={() => {
                  scrollToSection('satellite-groundtruth');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-[#123C35] transition flex items-center justify-between"
              >
                <span>Earth Observation &amp; Ground Truth</span>
                <span className="text-[10px] text-cyan-400">Phase 03</span>
              </button>
              <button
                onClick={() => {
                  scrollToSection('ai-analysis');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-[#123C35] transition flex items-center justify-between"
              >
                <span>AI Intervention Siting Model</span>
                <span className="text-[10px] text-emerald-400">Phase 04</span>
              </button>
              <button
                onClick={() => {
                  scrollToSection('decision-gis');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-[#123C35] transition flex items-center justify-between"
              >
                <span>Interactive Catchment GIS Map</span>
                <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded font-mono">Live Map</span>
              </button>
              <button
                onClick={() => {
                  scrollToSection('methodology');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-400 hover:text-white hover:bg-[#123C35] transition"
              >
                <span>Standards &amp; Scientific Methodology</span>
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
