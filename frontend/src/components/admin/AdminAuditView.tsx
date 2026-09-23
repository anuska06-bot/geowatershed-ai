import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  Users, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  Search
} from 'lucide-react';
import { api } from '../../services/api';
import { FieldSurveySubmission } from '../../types';

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

export const AdminAuditView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'surveys' | 'access_logs'>('surveys');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [surveys, setSurveys] = useState<FieldSurveySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED_AUTHENTIC' | 'REJECTED_FAKE'>('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    // Fetch logs
    api.getAuditLogs()
      .then((data) => setLogs(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // Fetch field surveys
    const surveyList = api.getFieldSurveySubmissions();
    setSurveys(surveyList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSurveys = surveys.filter((s) => {
    const matchesSearch = 
      s.surveyor_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.intervention_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.watershed_name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.authenticity_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const verifiedCount = surveys.filter(s => s.authenticity_status === 'VERIFIED_AUTHENTIC').length;
  const rejectedCount = surveys.filter(s => s.authenticity_status === 'REJECTED_FAKE').length;

  return (
    <div className="space-y-6 py-2 font-sans">
      
      {/* Top Admin Executive Banner */}
      <div className="bg-[#181f23] border border-[#2c373d] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                  Central Oversight Authority
                </span>
                <span className="text-[11px] text-[#9ba3a7] font-mono">DoLR / WDC-PMKSY 2.0 Compliance</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#f1f0eb] tracking-tight mt-1">
                Admin Portal &amp; Field Surveyor Tracking Center
              </h2>
              <p className="text-xs text-[#9ba3a7] mt-1 max-w-2xl leading-relaxed">
                Track every user accessing the platform, monitor all field reports submitted by surveyors, verify genuine camera GPS geotags, and intercept unverified or fake photographs automatically.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-2 bg-[#121619] hover:bg-[#20292e] border border-[#2c373d] rounded-lg text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-mono"
              title="Refresh Registry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Records</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#242d32]">
          <div className="p-3 bg-[#121619] border border-[#242d32] rounded-lg">
            <span className="text-[10px] font-mono text-[#9ba3a7] uppercase block">Total System Logins</span>
            <span className="text-xl font-bold text-[#f1f0eb] font-mono mt-0.5 block">{logs.length}</span>
            <span className="text-[10px] text-emerald-400 font-mono">Live Activity Tracked</span>
          </div>

          <div className="p-3 bg-[#121619] border border-[#242d32] rounded-lg">
            <span className="text-[10px] font-mono text-[#9ba3a7] uppercase block">Field Survey Reports</span>
            <span className="text-xl font-bold text-[#f1f0eb] font-mono mt-0.5 block">{surveys.length}</span>
            <span className="text-[10px] text-[#9ba3a7] font-mono">In-Situ Submissions</span>
          </div>

          <div className="p-3 bg-[#121619] border border-[#242d32] rounded-lg">
            <span className="text-[10px] font-mono text-[#9ba3a7] uppercase block">Authentic Photos Verified</span>
            <span className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">{verifiedCount}</span>
            <span className="text-[10px] text-emerald-400 font-mono">GPS &amp; Satellite Matched</span>
          </div>

          <div className="p-3 bg-[#121619] border border-[#242d32] rounded-lg">
            <span className="text-[10px] font-mono text-[#9ba3a7] uppercase block">Fake / Untagged Caught</span>
            <span className="text-xl font-bold text-rose-400 font-mono mt-0.5 block">{rejectedCount}</span>
            <span className="text-[10px] text-rose-400 font-mono">Rejected Immediately</span>
          </div>
        </div>
      </div>

      {/* Section Switcher Tabs: Field Surveyor Reports vs User Access Logs */}
      <div className="flex bg-[#181f23] p-1 rounded-xl border border-[#2c373d] max-w-md">
        <button
          type="button"
          onClick={() => setActiveSection('surveys')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono font-semibold rounded-lg transition-all ${
            activeSection === 'surveys'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-[#9ba3a7] hover:text-[#f1f0eb]'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Field Surveyor Reports ({surveys.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('access_logs')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono font-semibold rounded-lg transition-all ${
            activeSection === 'access_logs'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-[#9ba3a7] hover:text-[#f1f0eb]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Access Audit ({logs.length})</span>
        </button>
      </div>

      {/* SECTION 1: FIELD SURVEYOR REPORTS & FAKE PHOTO VERIFICATION */}
      {activeSection === 'surveys' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-[#181f23] border border-[#2c373d] rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9ba3a7]" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search surveyor name or structure..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#121619] border border-[#2c373d] rounded-lg text-xs text-[#f1f0eb] placeholder-[#9ba3a7]/60 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[11px] text-[#9ba3a7] font-mono">Verification:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-[#121619] border border-[#2c373d] rounded-lg py-1.5 px-3 text-xs text-[#f1f0eb] focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="ALL">All Reports ({surveys.length})</option>
                <option value="VERIFIED_AUTHENTIC">Verified Authentic ({verifiedCount})</option>
                <option value="REJECTED_FAKE">Rejected / Fake ({rejectedCount})</option>
              </select>
            </div>
          </div>

          {/* Survey Submission Cards */}
          <div className="space-y-3">
            {filteredSurveys.map((survey) => {
              const isAuthentic = survey.authenticity_status === 'VERIFIED_AUTHENTIC';

              return (
                <div 
                  key={survey.id}
                  className={`bg-[#181f23] border rounded-xl p-4 transition-all ${
                    isAuthentic ? 'border-[#2c373d] hover:border-emerald-500/50' : 'border-rose-900/60 bg-rose-950/10'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    
                    {/* Photo Thumbnail */}
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
                        {isAuthentic ? 'GPS TAGGED' : 'NO GPS / FAKE'}
                      </span>
                    </div>

                    {/* Report Information */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#f1f0eb]">{survey.intervention_name}</h4>
                          <span className="text-[10px] text-[#9ba3a7] font-mono">({survey.watershed_code})</span>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isAuthentic 
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}>
                          {isAuthentic ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {isAuthentic ? 'AUTHENTIC FIELD PHOTO VERIFIED' : 'REJECTED: UNTAGGED / FAKE IMAGE'}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#9ba3a7] font-mono flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span>Surveyor: <b className="text-slate-200">{survey.surveyor_name}</b></span>
                        <span>Location: <b>{survey.latitude.toFixed(4)}°N, {survey.longitude.toFixed(4)}°E</b></span>
                        <span>Submitted: <b>{new Date(survey.submitted_at).toLocaleDateString()}</b></span>
                      </div>

                      {/* AI Authenticity Verification Findings */}
                      <div className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
                        isAuthentic 
                          ? 'bg-[#121619] border-[#242d32] text-[#d1d5db]' 
                          : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                      }`}>
                        <span className="font-bold block font-mono text-[10px] uppercase text-[#9ba3a7]">
                          AI Anti-Tamper &amp; Satellite Cross-Check:
                        </span>
                        {survey.authenticity_details}
                      </div>

                      {/* Field Notes & AI Recommendation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                        <div className="bg-[#121619] p-2 rounded border border-[#242d32]">
                          <span className="text-[9px] uppercase text-[#6f7980] block font-mono">Field Surveyor Remarks:</span>
                          <span className="text-[#f1f0eb]">{survey.notes}</span>
                        </div>

                        <div className="bg-[#121619] p-2 rounded border border-[#242d32]">
                          <span className="text-[9px] uppercase text-[#6f7980] block font-mono">Recommended Drainage Action &amp; Budget:</span>
                          <span className="text-emerald-400 font-semibold">{survey.drainage_action}</span>
                          {survey.estimated_cost_inr > 0 && (
                            <span className="text-[10px] text-[#9ba3a7] block font-mono mt-0.5">
                              Estimated Cost: ₹{survey.estimated_cost_inr.toLocaleString()}
                            </span>
                          )}
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

      {/* SECTION 2: LIVE USER ACCESS & LOGIN AUDIT TRAIL */}
      {activeSection === 'access_logs' && (
        <div className="bg-[#181f23] border border-[#2c373d] rounded-xl overflow-hidden shadow-sm font-mono text-xs">
          <div className="p-3 bg-[#121619] border-b border-[#2c373d] flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Platform Entry &amp; Activity Audit Register ({logs.length} events)
            </span>
            <span className="text-[10px] text-emerald-400">Chronological Stream</span>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#121619] border-b border-[#242d32] text-[10px] uppercase text-[#9ba3a7]">
                <th className="p-3">Timestamp</th>
                <th className="p-3">User &amp; Department</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Action Recorded</th>
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

      {/* Photo Zoom Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 cursor-pointer"
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
