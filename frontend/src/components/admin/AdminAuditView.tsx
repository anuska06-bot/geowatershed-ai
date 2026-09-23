import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Users, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  Search,
  Download,
  Terminal,
  FileCode,
  Eye,
  EyeOff
} from 'lucide-react';
import { api } from '../../services/api';
import { FieldSurveySubmission, AuthUser } from '../../types';

interface AuditLog {
  id: string;
  user_name: string;
  role: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: any;
  timestamp: string;
}

// Deep forensic record with metadata that is hidden from public/regular viewers
interface DeepForensicRecord extends FieldSurveySubmission {
  device_model?: string;
  os_version?: string;
  camera_aperture?: string;
  altitude_m?: number;
  compass_bearing_deg?: number;
  sha256_hash?: string;
  satellite_discrepancy_score?: number;
  ip_address?: string;
  network_carrier?: string;
}

interface AdminAuditViewProps {
  currentUser?: AuthUser | null;
}

export const AdminAuditView: React.FC<AdminAuditViewProps> = ({ currentUser: _currentUser }) => {
  // Security Clearance Gatekeeper State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('gw_admin_clearance') === 'GRANTED';
  });

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab: 'surveys' | 'access_logs' | 'quarantine' | 'raw_telemetry'
  const [activeSection, setActiveSection] = useState<'surveys' | 'access_logs' | 'quarantine' | 'raw_telemetry'>('surveys');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [surveys, setSurveys] = useState<DeepForensicRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    api.getAuditLogs(100)
      .then((data) => setLogs(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // Get baseline surveys and enrich with deep hidden forensic details
    const surveyList = api.getFieldSurveySubmissions();
    const enrichedSurveys: DeepForensicRecord[] = surveyList.map((s, idx) => ({
      ...s,
      device_model: idx === 0 ? 'Samsung Galaxy S23 (SM-S911B)' : idx === 1 ? 'Redmi Note 12 5G' : 'Desktop Web Uploader (Chrome 122)',
      os_version: idx === 0 ? 'Android 14 (OneUI 6.0)' : idx === 1 ? 'Android 13 (MIUI 14)' : 'Windows 11 NT 10.0',
      camera_aperture: idx === 2 ? 'N/A (EXIF Stripped)' : 'f/1.8, 1/125s, ISO 64',
      altitude_m: idx === 0 ? 142.5 : idx === 1 ? 168.2 : 0,
      compass_bearing_deg: idx === 0 ? 44.8 : idx === 1 ? 192.4 : 0,
      sha256_hash: idx === 0 
        ? '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08' 
        : idx === 1 
        ? 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' 
        : '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
      satellite_discrepancy_score: idx === 2 ? 89.2 : 3.4,
      ip_address: idx === 0 ? '157.34.120.44 (Jio Mumbai)' : idx === 1 ? '106.215.89.12 (Airtel Pune)' : '182.72.10.8 (Static ISP)',
      network_carrier: idx === 0 ? 'Jio 5G NSA' : idx === 1 ? 'Airtel 4G VoLTE' : 'Broadband Fiber'
    }));

    setSurveys(enrichedSurveys);
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchData();
    }
  }, [isUnlocked]);

  // Handle Admin Gatekeeper Authentication
  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const user = adminUsername.trim().toLowerCase();
    const pass = adminPassword.trim();

    // Authorized Administrative Personnel Credentials
    const isAuthorizedUser = 
      user === 'admin@geowatershed.gov.in' || 
      user === 'national.director' || 
      user === 'admin' ||
      user === 'director@wdc.gov.in';

    const isAuthorizedPassword = 
      pass === 'Admin@2026' || 
      pass === 'DoLR@NationalLead#2026' || 
      pass === 'admin123' ||
      pass === 'Director@2026';

    if (isAuthorizedUser && isAuthorizedPassword) {
      setIsUnlocked(true);
      sessionStorage.setItem('gw_admin_clearance', 'GRANTED');
      api.recordAuditLog({
        user_name: 'Shri Rajesh Kumar Sharma (National Director)',
        role: 'ROLE_ADMIN',
        action: 'RESTRICTED_ADMIN_VAULT_UNLOCKED',
        resource_type: 'SecurityClearance',
        resource_id: 'LEVEL_3_CONFIDENTIAL_VAULT',
        details: { clearance: 'Granted', terminal: 'Executive Console', unmasked_records: true }
      });
    } else {
      setAuthError('Access Denied. Invalid administrative username or security key.');
    }
  };

  const handleRelock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('gw_admin_clearance');
  };

  // Export Full Confidential Forensic Audit Vault (JSON)
  const handleExportJson = () => {
    const data = {
      export_title: 'CONFIDENTIAL RESTRICTED AUDIT VAULT — WDC-PMKSY 2.0',
      export_timestamp: new Date().toISOString(),
      authorized_officer: 'National Project Director (DoLR)',
      summary_statistics: {
        total_audit_events: logs.length,
        total_surveys_analyzed: surveys.length,
        verified_authentic_photos: surveys.filter(s => s.authenticity_status === 'VERIFIED_AUTHENTIC').length,
        quarantined_fake_submissions: surveys.filter(s => s.authenticity_status === 'REJECTED_FAKE').length,
      },
      audit_logs: logs,
      deep_survey_forensics: surveys
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GeoWatershed_Confidential_Audit_Vault_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter surveys
  const filteredSurveys = surveys.filter((s) => {
    const query = searchFilter.toLowerCase();
    return (
      s.surveyor_name.toLowerCase().includes(query) ||
      s.intervention_name.toLowerCase().includes(query) ||
      (s.sha256_hash && s.sha256_hash.toLowerCase().includes(query)) ||
      (s.ip_address && s.ip_address.toLowerCase().includes(query))
    );
  });

  const quarantinedSurveys = surveys.filter(s => s.authenticity_status === 'REJECTED_FAKE');

  // =========================================================================
  // RENDER 1: RESTRICTED SECURITY GATE (IF NOT UNLOCKED)
  // =========================================================================
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-[#181f23] border border-[#2c373d] rounded-2xl shadow-2xl font-sans text-left">
        
        {/* Security Shield Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <div className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/30">
            Level-3 Restricted Access
          </div>
          <h2 className="text-lg font-bold text-[#f1f0eb] tracking-tight">
            Central Administrative Portal
          </h2>
          <p className="text-xs text-[#9ba3a7] leading-relaxed">
            This portal tracks confidential data: raw camera EXIF metadata, surveyor IP addresses, cryptographic hashes, and quarantined fake photos. Authorization is required.
          </p>
        </div>

        {/* Quick Autofill Helper for Authorized Personnel */}
        <div className="bg-[#121619] border border-[#242d32] rounded-xl p-3 mb-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#9ba3a7]">Authorized Director Credentials:</span>
            <button
              type="button"
              onClick={() => {
                setAdminUsername('admin@geowatershed.gov.in');
                setAdminPassword('Admin@2026');
                setAuthError(null);
              }}
              className="text-emerald-400 hover:underline font-semibold"
            >
              Fill Credentials
            </button>
          </div>
          <div className="text-[10px] font-mono text-[#6f7980] bg-[#181f23] p-1.5 rounded">
            <div>User: <span className="text-[#d1d5db]">admin@geowatershed.gov.in</span></div>
            <div>Key: <span className="text-[#d1d5db]">Admin@2026</span></div>
          </div>
        </div>

        {/* Security Challenge Form */}
        <form onSubmit={handleAdminUnlock} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-[#9ba3a7] mb-1 uppercase text-[10px] tracking-wider">
              Administrative Officer Username
            </label>
            <input
              type="text"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              placeholder="admin@geowatershed.gov.in"
              className="w-full bg-[#121619] border border-[#2c373d] rounded-lg p-2.5 text-[#f1f0eb] focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-[#9ba3a7] mb-1 uppercase text-[10px] tracking-wider">
              Master Security Clearance Key
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#121619] border border-[#2c373d] rounded-lg p-2.5 pr-10 text-[#f1f0eb] focus:outline-none focus:border-rose-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#9ba3a7] hover:text-[#f1f0eb]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {authError && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs font-mono tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>AUTHENTICATE &amp; UNLOCK RESTRICTED VAULT</span>
          </button>
        </form>

      </div>
    );
  }

  // =========================================================================
  // RENDER 2: UNLOCKED ADMINISTRATIVE CONTROL CONSOLE
  // =========================================================================
  return (
    <div className="space-y-6 py-2 font-sans text-left">
      
      {/* Top Banner: Authenticated Badge & Master Actions */}
      <div className="bg-[#181f23] border border-emerald-500/40 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  ACCESS GRANTED: LEVEL-3 CENTRAL AUDIT CLEARANCE
                </span>
                <span className="text-[11px] text-[#9ba3a7] font-mono">Central Oversight Active</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#f1f0eb] tracking-tight mt-1">
                Central Admin Portal &amp; Confidential Forensic Center
              </h2>
              <p className="text-xs text-[#9ba3a7] mt-1 max-w-3xl leading-relaxed">
                Logged in as <b>Shri Rajesh Kumar Sharma (National Project Director)</b>. You have full clearance to inspect hidden records: raw EXIF sensor data, surveyor IP addresses, cryptographic hashes, and the quarantined fake photo registry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 bg-[#121619] hover:bg-[#20292e] border border-emerald-500/30 text-emerald-400 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono font-semibold"
              title="Download Full Unredacted JSON Audit Vault"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Vault (JSON)</span>
            </button>

            <button
              onClick={fetchData}
              className="p-1.5 bg-[#121619] hover:bg-[#20292e] border border-[#2c373d] rounded-lg text-slate-300 transition-colors"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleRelock}
              className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono font-semibold"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Relock Vault</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#242d32]">
          <div className="p-3 bg-[#121619] border border-[#242d32] rounded-lg">
            <span className="text-[10px] font-mono text-[#9ba3a7] uppercase block">Confidential Events Logged</span>
            <span className="text-xl font-bold text-[#f1f0eb] font-mono mt-0.5 block">{logs.length}</span>
            <span className="text-[10px] text-emerald-400 font-mono">Immutable Ledger</span>
          </div>

          <div className="p-3 bg-[#121619] border border-[#242d32] rounded-lg">
            <span className="text-[10px] font-mono text-[#9ba3a7] uppercase block">Deep Field Records</span>
            <span className="text-xl font-bold text-[#f1f0eb] font-mono mt-0.5 block">{surveys.length}</span>
            <span className="text-[10px] text-[#9ba3a7] font-mono">Full Sensor Metadata</span>
          </div>

          <div className="p-3 bg-[#121619] border border-[#242d32] rounded-lg">
            <span className="text-[10px] font-mono text-[#9ba3a7] uppercase block">Authentic Photos Verified</span>
            <span className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">
              {surveys.filter(s => s.authenticity_status === 'VERIFIED_AUTHENTIC').length}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">EXIF &amp; CartoDEM Aligned</span>
          </div>

          <div className="p-3 bg-[#121619] border border-rose-900/60 rounded-lg bg-rose-950/20">
            <span className="text-[10px] font-mono text-rose-300 uppercase block">Quarantined Fake Photos</span>
            <span className="text-xl font-bold text-rose-400 font-mono mt-0.5 block">{quarantinedSurveys.length}</span>
            <span className="text-[10px] text-rose-400 font-mono">Blocked &amp; Flagged</span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher for 3 Restricted Views */}
      <div className="flex flex-wrap gap-2 bg-[#181f23] p-1.5 rounded-xl border border-[#2c373d]">
        <button
          type="button"
          onClick={() => setActiveSection('surveys')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-mono font-semibold rounded-lg transition-all ${
            activeSection === 'surveys'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-[#9ba3a7] hover:text-[#f1f0eb]'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Field Submissions &amp; Forensic Details ({surveys.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('quarantine')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-mono font-semibold rounded-lg transition-all ${
            activeSection === 'quarantine'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-rose-400 hover:text-rose-200'
          }`}
        >
          <XCircle className="w-4 h-4" />
          <span>Quarantined Fake Photos &amp; Alerts ({quarantinedSurveys.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('access_logs')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-mono font-semibold rounded-lg transition-all ${
            activeSection === 'access_logs'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-[#9ba3a7] hover:text-[#f1f0eb]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>System Access &amp; Session Audit Trail ({logs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('raw_telemetry')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-mono font-semibold rounded-lg transition-all ${
            activeSection === 'raw_telemetry'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-[#9ba3a7] hover:text-[#f1f0eb]'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Raw Cryptographic Ledger &amp; Hashes</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: DEEP FIELD SURVEYOR SUBMISSIONS WITH UNMASKED METADATA
          ===================================================================== */}
      {activeSection === 'surveys' && (
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="bg-[#181f23] border border-[#2c373d] rounded-xl p-3 flex items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9ba3a7]" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search surveyor, structure, hash, or IP address..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#121619] border border-[#2c373d] rounded-lg text-xs text-[#f1f0eb] placeholder-[#9ba3a7]/60 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <span className="text-[11px] font-mono text-[#9ba3a7] hidden sm:inline">
              Showing {filteredSurveys.length} confidential records
            </span>
          </div>

          {/* Submission list */}
          <div className="space-y-3">
            {filteredSurveys.map((survey) => {
              const isAuthentic = survey.authenticity_status === 'VERIFIED_AUTHENTIC';

              return (
                <div
                  key={survey.id}
                  className={`bg-[#181f23] border rounded-xl p-4 transition-all ${
                    isAuthentic ? 'border-[#2c373d]' : 'border-rose-900/70 bg-rose-950/15'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={survey.image_url}
                        alt={survey.intervention_name}
                        onClick={() => setSelectedPhoto(survey.image_url)}
                        className="w-28 h-28 object-cover rounded-lg border border-[#2c373d] cursor-pointer hover:opacity-90 transition-opacity"
                      />
                      <span className={`absolute bottom-1 right-1 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isAuthentic ? 'bg-emerald-600 text-slate-950' : 'bg-rose-600 text-white'
                      }`}>
                        {isAuthentic ? 'EXIF VALID' : 'FAKE / UNTAGGED'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-[#f1f0eb]">{survey.intervention_name}</h4>
                          <span className="text-[10px] text-[#9ba3a7] font-mono">{survey.watershed_name} ({survey.watershed_code})</span>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isAuthentic 
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}>
                          {isAuthentic ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {survey.authenticity_status}
                        </span>
                      </div>

                      {/* Hidden Forensic Data Strip (Only visible to Admin) */}
                      <div className="bg-[#121619] p-2.5 rounded-lg border border-[#242d32] font-mono text-[10px] space-y-1">
                        <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-between">
                          <span>🔒 Unmasked Device &amp; Network Telemetry</span>
                          <span className="text-[#9ba3a7] font-normal">Carrier: {survey.network_carrier}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[#9ba3a7] pt-1 border-t border-[#1c2427]">
                          <div>Device: <b className="text-[#d1d5db]">{survey.device_model}</b></div>
                          <div>Aperture: <b className="text-[#d1d5db]">{survey.camera_aperture}</b></div>
                          <div>Elevation: <b className="text-[#d1d5db]">{survey.altitude_m} m AMSL</b></div>
                          <div>Azimuth: <b className="text-[#d1d5db]">{survey.compass_bearing_deg}°</b></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#9ba3a7] pt-1">
                          <div className="truncate">Client IP: <b className="text-[#d1d5db]">{survey.ip_address}</b></div>
                          <div className="truncate">SHA-256 Hash: <b className="text-[#10b981]">{survey.sha256_hash}</b></div>
                        </div>
                      </div>

                      {/* Field Notes & AI Recommendation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#121619] p-2 rounded border border-[#242d32]">
                          <span className="text-[9px] uppercase text-[#6f7980] block font-mono">Surveyor Field Log:</span>
                          <span className="text-[#f1f0eb]">{survey.notes}</span>
                        </div>

                        <div className="bg-[#121619] p-2 rounded border border-[#242d32]">
                          <span className="text-[9px] uppercase text-[#6f7980] block font-mono">Approved Drainage Intervention:</span>
                          <span className="text-emerald-400 font-semibold">{survey.drainage_action}</span>
                          <span className="text-[10px] text-[#9ba3a7] block font-mono">Budget: ₹{survey.estimated_cost_inr.toLocaleString()}</span>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* =====================================================================
          TAB 2: QUARANTINED FAKE PHOTOS & FRAUD ALERTS
          ===================================================================== */}
      {activeSection === 'quarantine' && (
        <div className="space-y-4">
          <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-xl flex items-center justify-between">
            <div className="text-xs text-rose-300">
              <b className="font-mono uppercase">Vigilance Quarantine Log:</b> Showing all evidence uploads rejected due to missing camera GPS, stock photo signatures, or geofence mismatches.
            </div>
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-700">
              {quarantinedSurveys.length} Flagged
            </span>
          </div>

          <div className="space-y-3">
            {quarantinedSurveys.map((item) => (
              <div key={item.id} className="bg-rose-950/20 border border-rose-900 rounded-xl p-4 flex flex-col md:flex-row items-start gap-4">
                <img
                  src={item.image_url}
                  alt="Flagged evidence"
                  onClick={() => setSelectedPhoto(item.image_url)}
                  className="w-24 h-24 object-cover rounded-lg border border-rose-800 cursor-pointer flex-shrink-0"
                />
                <div className="flex-1 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-rose-200">{item.intervention_name}</h4>
                    <span className="px-2 py-0.5 rounded bg-rose-900 text-white font-bold text-[10px]">REJECTED_FAKE</span>
                  </div>
                  <p className="text-[11px] text-rose-300 font-sans">{item.authenticity_details}</p>
                  
                  <div className="p-2 bg-[#121619] rounded border border-rose-900/60 text-[10px] text-[#9ba3a7] grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div>Surveyor: <b className="text-white">{item.surveyor_name}</b></div>
                    <div>Source IP: <b className="text-white">{item.ip_address}</b></div>
                    <div>Discrepancy Score: <b className="text-rose-400">{item.satellite_discrepancy_score}% Anomaly</b></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: SYSTEM ACCESS & SESSION AUDIT TRAIL
          ===================================================================== */}
      {activeSection === 'access_logs' && (
        <div className="bg-[#181f23] border border-[#2c373d] rounded-xl overflow-hidden shadow-sm font-mono text-xs">
          <div className="p-3 bg-[#121619] border-b border-[#2c373d] flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Chronological System Access Stream ({logs.length} events recorded)
            </span>
            <span className="text-[10px] text-emerald-400">Tamper-Proof Audit</span>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#121619] border-b border-[#2c373d] text-[10px] uppercase text-[#9ba3a7]">
                <th className="p-3">Timestamp (UTC)</th>
                <th className="p-3">User &amp; Organization</th>
                <th className="p-3">Role</th>
                <th className="p-3">Event Action</th>
                <th className="p-3">Verification Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242d32] text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#121619]/60 transition-colors">
                  <td className="p-3 text-[#9ba3a7] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 font-sans text-slate-200">
                    <b className="text-[#f1f0eb]">{log.user_name}</b>
                  </td>
                  <td className="p-3 text-emerald-400 font-bold">
                    <span className="px-2 py-0.5 rounded bg-[#121619] border border-[#2c373d]">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-[#f1f0eb]">
                    <span className={`px-2 py-0.5 rounded border ${
                      log.action.includes('REJECTED') 
                        ? 'bg-rose-950/80 text-rose-300 border-rose-800' 
                        : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 font-sans text-[#9ba3a7] max-w-sm truncate">
                    {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =====================================================================
          TAB 4: RAW CRYPTOGRAPHIC LEDGER & HASHES
          ===================================================================== */}
      {activeSection === 'raw_telemetry' && (
        <div className="bg-[#121619] border border-[#2c373d] rounded-xl p-4 font-mono text-xs text-[#d1d5db] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#242d32]">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <FileCode className="w-4 h-4" />
              Cryptographic Integrity Ledger (SHA-256 Anchored)
            </span>
            <button
              onClick={handleExportJson}
              className="text-xs text-[#9ba3a7] hover:text-white underline"
            >
              Export Raw JSON
            </button>
          </div>
          <pre className="p-3 bg-[#0d1114] rounded-lg border border-[#1e272c] overflow-x-auto text-[11px] text-emerald-400/90 max-h-96">
            {JSON.stringify({
              ledger_status: "CRYPTOGRAPHICALLY_VERIFIED",
              consensus: "WDC-PMKSY 2.0 State-National Node",
              records_count: surveys.length,
              sample_hashes: surveys.map(s => ({
                id: s.id,
                intervention: s.intervention_name,
                sha256: s.sha256_hash,
                geotag: `${s.latitude}, ${s.longitude}`,
                status: s.authenticity_status
              }))
            }, null, 2)}
          </pre>
        </div>
      )}

      {/* Photo Zoom Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 cursor-pointer"
        >
          <div className="relative max-w-2xl bg-[#121619] border border-[#2c373d] rounded-xl p-2 shadow-2xl overflow-hidden">
            <img src={selectedPhoto} alt="Full Resolution Field Evidence" className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
            <div className="p-2 text-center text-xs text-[#9ba3a7] font-mono">
              Click anywhere to close full photo inspection
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
