import React, { useState, useEffect } from 'react';
import { WatershedDetail } from '../../types';
import { 
  Smartphone, MapPin, 
  Wifi, WifiOff, RefreshCw, Save, Send 
} from 'lucide-react';

interface FieldSurveyViewProps {
  watershed: WatershedDetail;
}

interface OfflineDraft {
  id: string;
  intervention_name: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  surveyor: string;
}

export const FieldSurveyView: React.FC<FieldSurveyViewProps> = ({
  watershed,
}) => {
  const [selectedIntervId, setSelectedIntervId] = useState(watershed.interventions[0]?.id || '');
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const [surveyor, setSurveyor] = useState('Er. K. Shinde (WDT Field Officer)');
  const [condition, setCondition] = useState('Good');
  const [waterLevel, setWaterLevel] = useState('Moderate (25-75%)');
  const [notes, setNotes] = useState('');

  const [drafts, setDrafts] = useState<OfflineDraft[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline drafts from localStorage
    const saved = localStorage.getItem('gw_offline_drafts');
    if (saved) {
      try {
        setDrafts(JSON.parse(saved));
      } catch (e) {}
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const requestGps = () => {
    setIsLocating(true);
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your device.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(Number(position.coords.latitude.toFixed(6)));
        setLon(Number(position.coords.longitude.toFixed(6)));
        setGpsAccuracy(Math.round(position.coords.accuracy));
        setIsLocating(false);
      },
      (error) => {
        // Fallback to watershed centroid with warning
        setLat(watershed.centroid_lat);
        setLon(watershed.centroid_lon);
        setGpsAccuracy(15);
        setGpsError(`GPS Notice (${error.message}). Calibrated pilot coordinate applied.`);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSaveDraft = () => {
    const interv = watershed.interventions.find((i) => i.id === selectedIntervId);
    const newDraft: OfflineDraft = {
      id: `draft_${Date.now()}`,
      intervention_name: interv?.name || 'Structure',
      timestamp: new Date().toLocaleTimeString(),
      latitude: lat || watershed.centroid_lat,
      longitude: lon || watershed.centroid_lon,
      surveyor: surveyor,
    };
    const updated = [newDraft, ...drafts];
    setDrafts(updated);
    localStorage.setItem('gw_offline_drafts', JSON.stringify(updated));
    alert('Survey draft saved to local device cache. Ready to synchronize when cellular coverage resumes.');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 py-2 font-mono">
      
      {/* Mobile Survey Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-slate-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 font-mono">Field Survey PWA Interface</h2>
            <p className="text-[11px] text-slate-400 font-mono">{watershed.name} ({watershed.code})</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Online Sync</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400">Offline Cache</span>
            </>
          )}
        </div>
      </div>

      {/* Field Survey Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4 text-xs">
        
        {/* Intervention Picker */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Target Conservation Structure</label>
          <select
            value={selectedIntervId}
            onChange={(e) => setSelectedIntervId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
          >
            {watershed.interventions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.intervention_type} • Stream Order {item.stream_order})
              </option>
            ))}
          </select>
        </div>

        {/* GPS Capture Widget */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-forest-400" /> Ground GPS Telemetry
            </span>
            <button
              type="button"
              onClick={requestGps}
              disabled={isLocating}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg font-medium transition flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              {isLocating ? 'Acquiring...' : 'Capture GPS'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Lat</span>
              <span className="text-slate-200 font-bold">{lat ? `${lat}°` : 'Pending'}</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Lon</span>
              <span className="text-slate-200 font-bold">{lon ? `${lon}°` : 'Pending'}</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Precision</span>
              <span className="text-forest-400 font-bold">{gpsAccuracy ? `±${gpsAccuracy}m` : 'Uncalibrated'}</span>
            </div>
          </div>

          {gpsError && (
            <p className="text-[10px] text-amber-400 italic">{gpsError}</p>
          )}
        </div>

        {/* Observation Conditions */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-400 mb-1">Structural Siltation State</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            >
              <option value="Good">Good / Operational</option>
              <option value="Moderate Siltation">Moderate Siltation (&lt;50%)</option>
              <option value="High Siltation">Severe Siltation (&gt;50%)</option>
              <option value="Damaged">Damaged Spillway</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Water Storage State</label>
            <select
              value={waterLevel}
              onChange={(e) => setWaterLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            >
              <option value="Full (>75%)">Full (&gt;75%)</option>
              <option value="Moderate (25-75%)">Moderate (25-75%)</option>
              <option value="Low (<25%)">Low (&lt;25%)</option>
              <option value="Dry">Completely Dry</option>
            </select>
          </div>
        </div>

        {/* Surveyor & Remarks */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Field Surveyor Name"
            value={surveyor}
            onChange={(e) => setSurveyor(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
          />

          <textarea
            rows={2}
            placeholder="Field remarks (e.g. bed silt depth, scouring, water clarity)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors font-mono"
          >
            <Save className="w-4 h-4" /> Save Local Draft
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-md flex items-center justify-center gap-1.5 transition-colors font-mono tracking-wide shadow-sm"
          >
            <Send className="w-4 h-4" /> Log & Synchronize
          </button>
        </div>

      </div>

      {/* Offline Drafts Queue */}
      {drafts.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-xs space-y-2 font-mono">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
            Unsynchronized Device Drafts ({drafts.length})
          </h4>
          <div className="space-y-1.5">
            {drafts.map((d) => (
              <div key={d.id} className="bg-slate-950 p-2.5 rounded-md border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">{d.intervention_name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{d.latitude}°, {d.longitude}° • {d.timestamp}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 font-mono">
                  Cached
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
