import React, { useState, useRef } from 'react';
import { WatershedDetail, EvidenceCard } from '../../types';
import { api } from '../../services/api';
import EXIF from 'exif-js';
import { X, UploadCloud, Camera, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadEvidenceModalProps {
  watershed: WatershedDetail;
  onClose: () => void;
  onEvidenceUploaded: (newEvidence: EvidenceCard) => void;
}

export const UploadEvidenceModal: React.FC<UploadEvidenceModalProps> = ({
  watershed,
  onClose,
  onEvidenceUploaded,
}) => {
  const [selectedInterventionId, setSelectedInterventionId] = useState<string>(
    watershed.interventions[0]?.id || ''
  );
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // EXIF extraction state
  const [exifLat, setExifLat] = useState<number | null>(null);
  const [exifLon, setExifLon] = useState<number | null>(null);
  const [hasExif, setHasExif] = useState<boolean>(false);
  
  // Manual coordinate overrides
  const [manualLat, setManualLat] = useState<string>('');
  const [manualLon, setManualLon] = useState<string>('');
  
  // Field details
  const [surveyorName, setSurveyorName] = useState<string>('Er. K. Shinde (WDT)');
  const [structureCondition, setStructureCondition] = useState<string>('Good');
  const [waterStorageLevel, setWaterStorageLevel] = useState<string>('Moderate (25-75%)');
  const [notes, setNotes] = useState<string>('');

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setErrorMsg(null);

    // Client-side EXIF inspection using exif-js
    EXIF.getData(selectedFile as any, function (this: any) {
      const latData = EXIF.getTag(this, 'GPSLatitude');
      const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
      const lonData = EXIF.getTag(this, 'GPSLongitude');
      const lonRef = EXIF.getTag(this, 'GPSLongitudeRef');

      if (latData && lonData && latRef && lonRef) {
        const convertDMSToDD = (dms: number[], ref: string) => {
          let dd = dms[0] + dms[1] / 60 + dms[2] / 3600;
          if (ref === 'S' || ref === 'W') dd = -dd;
          return Number(dd.toFixed(6));
        };
        const lat = convertDMSToDD(latData, latRef);
        const lon = convertDMSToDD(lonData, lonRef);
        setExifLat(lat);
        setExifLon(lon);
        setHasExif(true);
      } else {
        setHasExif(false);
        setExifLat(null);
        setExifLon(null);
        // Pre-fill manual coordinates from selected intervention target
        const interv = watershed.interventions.find((i) => i.id === selectedInterventionId);
        if (interv) {
          setManualLat(interv.target_latitude.toString());
          setManualLon(interv.target_longitude.toString());
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a field photograph to upload.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('intervention_id', selectedInterventionId);
    formData.append('surveyor_name', surveyorName);
    formData.append('structure_condition', structureCondition);
    formData.append('water_storage_level', waterStorageLevel);
    if (notes) formData.append('notes', notes);

    if (!hasExif && manualLat && manualLon) {
      formData.append('manual_latitude', manualLat);
      formData.append('manual_longitude', manualLon);
    }

    try {
      const card = await api.uploadEvidence(formData);
      onEvidenceUploaded(card);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading evidence');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0c121e] border border-slate-700 rounded-lg shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090d14]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-slate-900 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm font-mono">Upload Geocoded Field Evidence</h3>
              <p className="text-[11px] text-slate-400 font-mono">{watershed.name} ({watershed.code})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Intervention Selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Select Target Intervention
            </label>
            <select
              value={selectedInterventionId}
              onChange={(e) => {
                setSelectedInterventionId(e.target.value);
                const interv = watershed.interventions.find((i) => i.id === e.target.value);
                if (interv && !hasExif) {
                  setManualLat(interv.target_latitude.toString());
                  setManualLon(interv.target_longitude.toString());
                }
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-forest-500"
            >
              {watershed.interventions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.intervention_type} • Stream Order {item.stream_order})
                </option>
              ))}
            </select>
          </div>

          {/* Photo Upload Zone */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Field Photograph (JPEG / PNG / WebP)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-forest-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition text-center"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="flex items-center gap-4 w-full">
                  <img 
                    src={previewUrl} 
                    alt={`Preview of in-situ photographic evidence file ${file?.name || 'capture'} for EXIF GPS extraction`} 
                    loading="lazy"
                    className="w-20 h-20 object-cover rounded-lg border border-slate-700" 
                  />
                  <div className="text-left flex-1 truncate">
                    <p className="font-semibold text-slate-200 truncate">{file?.name}</p>
                    <p className="text-[11px] text-slate-400">{((file?.size || 0) / 1024 / 1024).toFixed(2)} MB</p>
                    {hasExif ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium mt-1 font-mono">
                        <CheckCircle className="w-3.5 h-3.5" /> EXIF GPS Detected ({exifLat?.toFixed(4)}, {exifLon?.toFixed(4)})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium mt-1 font-mono">
                        <AlertCircle className="w-3.5 h-3.5" /> No EXIF GPS found: using manual placement
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-emerald-400 mb-2" />
                  <p className="text-slate-300 font-medium font-mono text-xs">Click or drag field image to upload</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">WGS84 GPS, orientation, and timestamp extracted automatically</p>
                </>
              )}
            </div>
          </div>

          {/* Coordinate Fallback if No EXIF */}
          {!hasExif && file && (
            <div className="bg-slate-950/80 border border-ochre-800/40 rounded-xl p-3 space-y-2">
              <div className="text-ochre-300 font-semibold text-[11px] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Manual Coordinate Assignment
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 text-[10px]">Latitude (°N)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[10px]">Longitude (°E)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={manualLon}
                    onChange={(e) => setManualLon(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Field Condition Parameters */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Physical Structural State</label>
              <select
                value={structureCondition}
                onChange={(e) => setStructureCondition(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
              >
                <option value="Good">Good / Operational</option>
                <option value="Moderate Siltation">Moderate Siltation (&lt;50%)</option>
                <option value="High Siltation">Severe Siltation (&gt;50%)</option>
                <option value="Damaged / Leaking">Damaged / Spillway Erosion</option>
                <option value="Dry">Dry / Non-functional</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Ponding / Storage Level</label>
              <select
                value={waterStorageLevel}
                onChange={(e) => setWaterStorageLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
              >
                <option value="Full (>75%)">Full (&gt;75% Capacity)</option>
                <option value="Moderate (25-75%)">Moderate (25-75% Capacity)</option>
                <option value="Low (<25%)">Low (&lt;25% Capacity)</option>
                <option value="Dry">Completely Dry</option>
              </select>
            </div>
          </div>

          {/* Surveyor & Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Field Surveyor Name</label>
              <input
                type="text"
                value={surveyorName}
                onChange={(e) => setSurveyorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Field Remarks / Observations</label>
              <input
                type="text"
                placeholder="e.g. Masonry wall intact, water level 1.4m"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading || !file}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold rounded-md text-xs font-mono tracking-wide transition-colors shadow-sm"
          >
            {isUploading ? 'EVALUATING HYDROLOGIC CONSISTENCY...' : 'SUBMIT & EXECUTE POSTGIS VALIDATION'}
          </button>

        </form>

      </div>
    </div>
  );
};
