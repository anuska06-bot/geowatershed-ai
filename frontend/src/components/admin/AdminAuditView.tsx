import React, { useEffect, useState } from 'react';
import { Lock, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

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
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    api.getAuditLogs()
      .then((data) => setLogs(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-4 py-2">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Security Audit Trail & Regulatory Compliance Log
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable register of evidence captures, algorithmic checks, expert determinations, and access events.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-md text-slate-300 transition-colors"
          title="Refresh Log"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden text-xs font-mono">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase text-slate-400">
              <th className="p-3">Timestamp (UTC)</th>
              <th className="p-3">Actor & Role</th>
              <th className="p-3">Action</th>
              <th className="p-3">Resource Target</th>
              <th className="p-3">Audit Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-950/60">
                <td className="p-3 text-slate-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="p-3 font-sans text-slate-200">
                  <b>{log.user_name}</b>
                  <span className="text-[10px] text-forest-400 block font-mono">{log.role}</span>
                </td>
                <td className="p-3 font-bold text-slate-100">
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-forest-300">
                    {log.action}
                  </span>
                </td>
                <td className="p-3 text-slate-400">
                  {log.resource_type} ({log.resource_id.substring(0, 8)}...)
                </td>
                <td className="p-3 font-sans text-slate-300 max-w-xs truncate">
                  {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
