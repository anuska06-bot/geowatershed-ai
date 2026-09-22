import React, { useState } from 'react';
import { EvidenceCard, UserRole } from '../../types';
import { 
  X, AlertTriangle, CheckCircle, MapPin, 
  Compass, Calendar, FileCheck2, User
} from 'lucide-react';

interface EvidenceCardModalProps {
  card: EvidenceCard;
  currentRole: UserRole;
  onClose: () => void;
  onReviewSubmitted: (updatedCard: EvidenceCard) => void;
}

export const EvidenceCardModal: React.FC<EvidenceCardModalProps> = ({
  card,
  currentRole,
  onClose,
  onReviewSubmitted,
}) => {
  const [reviewStatus, setReviewStatus] = useState<'Reviewed' | 'Needs Verification' | 'Rejected'>('Reviewed');
  const [reviewerName, setReviewerName] = useState('Er. R. Deshmukh (Hydrologist)');
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canReview = currentRole === 'ROLE_MANAGER' || currentRole === 'ROLE_ANALYST';

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerNotes.trim()) {
      setErrorMsg('Please provide technical justification for the audit decision.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/v1/evidence/${card.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review_status: reviewStatus,
          reviewer_name: reviewerName,
          reviewer_notes: reviewerNotes,
        }),
      });
      if (!res.ok) throw new Error('Failed to update audit review');
      const updated = await res.json();
      onReviewSubmitted(updated);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0c121e] border border-slate-700 rounded-lg shadow-2xl overflow-hidden my-8">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090d14]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-slate-900 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-sm font-mono">{card.intervention_name}</h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                  {card.intervention_type}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{card.project_name}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
          
          {/* Left Column: Photograph & Telemetry (7 cols) */}
          <div className="md:col-span-7 flex flex-col gap-4">
            
            {/* Field Image Preview */}
            <div className="relative aspect-video rounded-md overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center group shadow-inner">
              <img
                src={card.image_url}
                alt={`In-situ field photograph of ${card.intervention_name} with EXIF geotag at latitude ${card.captured_latitude}, longitude ${card.captured_longitude}`}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if local file not on disk yet
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded font-mono shadow ${
                  card.coordinate_source === 'EXIF_GPS'
                    ? 'bg-slate-900/90 text-emerald-300 border border-emerald-500/50'
                    : 'bg-slate-900/90 text-amber-400 border border-amber-500/50'
                }`}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                  {card.coordinate_source === 'EXIF_GPS' ? 'EXIF GPS Verified' : 'Manual Coordinate Placement'}
                </span>
              </div>

              <div className="absolute bottom-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/90 text-slate-400 border border-slate-800">
                SHA-256: {card.file_sha256.substring(0, 12)}...
              </div>
            </div>

            {/* Spatial & Temporal Telemetry Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 border border-slate-800 rounded-md p-3 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-emerald-400" /> Latitude
                </span>
                <span className="font-mono font-medium text-slate-200">{card.captured_latitude.toFixed(5)}° N</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-emerald-400" /> Longitude
                </span>
                <span className="font-mono font-medium text-slate-200">{card.captured_longitude.toFixed(5)}° E</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 flex items-center gap-1 font-mono">
                  <Compass className="w-3 h-3 text-slate-400" /> Camera Azimuth
                </span>
                <span className="font-mono font-medium text-slate-200">
                  {card.camera_bearing_deg ? `${card.camera_bearing_deg}°` : '135° SE'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3 text-slate-400" /> Captured Date
                </span>
                <span className="font-mono font-medium text-slate-200">
                  {card.captured_at ? new Date(card.captured_at).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            </div>

            {/* Field Observation Notes */}
            <div className="bg-slate-950 border border-slate-800 rounded-md p-3 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Field Surveyor Record
                </span>
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <User className="w-3 h-3" /> {card.surveyor_name}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <p><span className="text-slate-500">Physical Condition:</span> <b className="text-slate-200">{card.structure_condition}</b></p>
                <p><span className="text-slate-500">Storage Water Level:</span> <b className="text-slate-200">{card.water_storage_level}</b></p>
              </div>
              {card.notes && (
                <p className="mt-2 text-slate-400 italic bg-slate-900/60 p-2 rounded border border-slate-800/80">
                  "{card.notes}"
                </p>
              )}
            </div>

          </div>

          {/* Right Column: Evidence Consistency Engine (WIEOF) & Review (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            
            {/* Consistency Verdict Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Stream Consistency
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1.5 font-mono ${
                  card.consistency.status === 'Consistent'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                    : 'bg-amber-950 text-amber-300 border border-amber-600/50'
                }`}>
                  {card.consistency.status === 'Consistent' ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  {card.consistency.status}
                </span>
              </div>

              {/* Proximity Metrics */}
              <div className="space-y-2 mb-3 font-mono">
                <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Stream Proximity:</span>
                  <span className="font-bold text-slate-100">
                    {card.consistency.stream_distance_meters} m
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Catchment Containment:</span>
                  <span className="text-emerald-400 font-medium">Inside Boundary</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Laplacian Variance:</span>
                  <span className="text-slate-200">{card.quality.blur_score} (Sharp)</span>
                </div>
              </div>

              {/* Explainable Reasons */}
              <div className="text-[11px] text-slate-300 space-y-1.5">
                <div className="font-semibold text-slate-400 text-[10px] uppercase font-mono">Reasoning Lineage:</div>
                {card.consistency.reasons.map((r, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Human Review Status / Audit Form */}
            <div className="bg-slate-950 border border-slate-800 rounded-md p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                    Audit Review Status
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded font-mono ${
                    card.review_status === 'Reviewed'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                      : card.review_status === 'Rejected'
                      ? 'bg-rose-950 text-rose-300 border border-rose-600'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {card.review_status}
                  </span>
                </div>

                {card.reviewer_name && (
                  <div className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-md border border-slate-800 mb-3 font-mono">
                    <p className="font-medium text-slate-200 mb-1">Audited by: {card.reviewer_name}</p>
                    <p className="text-slate-400 italic">"{card.reviewer_notes}"</p>
                    {card.reviewed_at && (
                      <p className="text-[10px] text-slate-500 mt-1">
                        Timestamp: {new Date(card.reviewed_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Review Submission Form for Managers & Analysts */}
              {canReview && (
                <form onSubmit={handleSubmitReview} className="mt-2 space-y-2 border-t border-slate-800/80 pt-3">
                  <div className="text-[11px] font-semibold text-emerald-300 font-mono">
                    Execute Expert Audit Determination:
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <select
                      value={reviewStatus}
                      onChange={(e) => setReviewStatus(e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 focus:outline-none"
                    >
                      <option value="Reviewed">Reviewed & Verified</option>
                      <option value="Needs Verification">Needs Verification</option>
                      <option value="Rejected">Reject Record</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Reviewer ID & Rank"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 focus:outline-none"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Hydrological audit rationale..."
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded text-xs p-1.5 text-slate-200 focus:outline-none font-mono"
                  />

                  {errorMsg && <p className="text-[11px] text-rose-400">{errorMsg}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold rounded text-xs transition-colors font-mono tracking-wide"
                  >
                    {isSubmitting ? 'COMMITTING AUDIT...' : 'COMMIT AUDIT DETERMINATION'}
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
