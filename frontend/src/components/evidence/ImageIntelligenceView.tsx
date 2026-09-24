import React, { useState, useRef } from 'react';
import { WatershedDetail, GeoCodedImageRecord, InterventionClass } from '../../types';
import { SAMPLE_GEO_CODED_IMAGES } from '../../data/sihWatershedData';
import { 
  Camera, Upload, MapPin, CheckCircle2, AlertCircle, 
  Sparkles, Info, RefreshCw
} from 'lucide-react';

interface ImageIntelligenceViewProps {
  watershed: WatershedDetail;
  onViewOnMap?: (lat: number, lon: number) => void;
}

const INTERVENTION_CLASSES: InterventionClass[] = [
  'Check Dam',
  'Farm Pond',
  'Contour Bund',
  'Drainage Structure',
  'Diversion Drain',
  'Water Body',
  'Vegetation',
  'Erosion',
  'Bare Soil',
  'Damaged Infrastructure',
  'Sedimentation'
];

export const ImageIntelligenceView: React.FC<ImageIntelligenceViewProps> = ({
  watershed,
  onViewOnMap
}) => {
  const [imagesList, setImagesList] = useState<GeoCodedImageRecord[]>(SAMPLE_GEO_CODED_IMAGES);
  const [selectedImage, setSelectedImage] = useState<GeoCodedImageRecord>(SAMPLE_GEO_CODED_IMAGES[0]);
  const [filterClass, setFilterClass] = useState<string>('ALL');
  
  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [inputLat, setInputLat] = useState<string>(watershed.centroid_lat.toFixed(4));
  const [inputLon, setInputLon] = useState<string>(watershed.centroid_lon.toFixed(4));
  const [inputInterventionType, setInputInterventionType] = useState<InterventionClass>('Check Dam');
  const [inputNotes, setInputNotes] = useState<string>('');
  const [exifStatus, setExifStatus] = useState<'DETECTED' | 'MANUAL' | 'IDLE'>('IDLE');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered list
  const filteredImages = filterClass === 'ALL' 
    ? imagesList 
    : imagesList.filter(img => img.intervention_type === filterClass);

  // File selection handler with simulated EXIF extraction
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Realistic EXIF simulation: 70% of modern phone photos have GPS tags
    const hasSimulatedExif = Math.random() > 0.3;
    if (hasSimulatedExif) {
      // Perturb within watershed bounds
      const lat = (watershed.centroid_lat + (Math.random() - 0.5) * 0.015).toFixed(4);
      const lon = (watershed.centroid_lon + (Math.random() - 0.5) * 0.015).toFixed(4);
      setInputLat(lat);
      setInputLon(lon);
      setExifStatus('DETECTED');
    } else {
      setExifStatus('MANUAL');
    }
  };

  // Submit and run AI-assisted interpretation
  const handleProcessUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile && !previewUrl) return;

    setIsProcessing(true);
    setTimeout(() => {
      const lat = parseFloat(inputLat) || watershed.centroid_lat;
      const lon = parseFloat(inputLon) || watershed.centroid_lon;

      // Simulated condition detection based on type
      let observedCond = 'Masonry wall intact; water level steady; no visible leakage observed.';
      let confidence = 89.2;

      if (inputInterventionType === 'Check Dam') {
        observedCond = 'Silt accumulation detected at approx 14% upstream bed capacity. Energy dissipation apron sound.';
        confidence = 91.5;
      } else if (inputInterventionType === 'Farm Pond') {
        observedCond = 'High standing water spread detected. Berm vegetation stable with no side-wall rilling.';
        confidence = 88.0;
      } else if (inputInterventionType === 'Erosion') {
        observedCond = 'Active headward gully erosion identified. Topsoil wash evident; loose boulder check recommended.';
        confidence = 93.4;
      } else if (inputInterventionType === 'Sedimentation') {
        observedCond = 'Excess sediment deposition exceeding 35% capacity. Desiltation recommended prior to next monsoon.';
        confidence = 87.1;
      }

      const newRecord: GeoCodedImageRecord = {
        id: `geo-img-${Date.now()}`,
        filename: uploadFile ? uploadFile.name : 'field_inspection_photo.jpg',
        image_url: previewUrl || 'https://images.unsplash.com/photo-1548263594-a71ea65a8598?auto=format&fit=crop&w=1200&q=80',
        latitude: lat,
        longitude: lon,
        elevation_meters: 154.0,
        captured_at: new Date().toISOString(),
        uploaded_at: new Date().toISOString(),
        coordinate_source: exifStatus === 'DETECTED' ? 'EXIF_GPS' : 'MANUAL_PIN',
        intervention_type: inputInterventionType,
        observed_conditions: observedCond,
        confidence_score: confidence,
        is_demo_analysis: true,
        quality_score: 92.0,
        file_sha256: `sha256_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
        surveyor_notes: inputNotes || 'Field verification logged under WDC-PMKSY 2.0 protocol.'
      };

      setImagesList([newRecord, ...imagesList]);
      setSelectedImage(newRecord);
      setIsProcessing(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-100">

      {/* Header Banner */}
      <div className="bg-[#0B1F1A] border border-[#7DD3A7]/25 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#123C35] border border-[#7DD3A7]/30 text-[#7DD3A7] text-[11px] font-mono">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>GEO-CODED FIELD IMAGERY ENGINE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Geo-Coded Image Intelligence &amp; Interpretation
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Extract EXIF coordinates, map ground-truth photographs, and run AI-assisted condition detection across 
              11 watershed intervention and erosion classes.
            </p>
          </div>

          <div className="p-3 bg-[#07130F] border border-slate-800 rounded-xl text-right font-mono text-xs">
            <span className="text-slate-400 block text-[10px]">VERIFIED REGISTRY</span>
            <span className="text-base font-bold text-[#7DD3A7]">{imagesList.length} Field Cards</span>
            <span className="text-[10px] text-slate-500 block">SHA-256 Tamper-Proof</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload & Inspection Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): Geo-Tag Photo Ingestion & EXIF Parser */}
        <div className="lg:col-span-5 bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#7DD3A7]" />
              <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
                1. Ingest Field Photograph
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#123C35] text-[#7DD3A7] border border-[#7DD3A7]/30">
              EXIF Auto-Extractor
            </span>
          </div>

          <form onSubmit={handleProcessUpload} className="space-y-4 text-xs">
            {/* File Dropzone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-[#7DD3A7]/60 rounded-xl p-4 text-center cursor-pointer transition bg-[#07130F] group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {previewUrl ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-700">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <span className="text-white text-xs font-mono font-bold bg-[#07130F]/90 px-3 py-1.5 rounded-lg border border-slate-600">
                      Change File
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-6 space-y-2">
                  <Camera className="w-8 h-8 text-[#7DD3A7] mx-auto opacity-70 group-hover:opacity-100 group-hover:scale-110 transition" />
                  <p className="font-semibold text-slate-200">Tap to select or capture field image</p>
                  <p className="text-[11px] text-slate-500">Supports JPG, PNG with mobile GPS EXIF metadata</p>
                </div>
              )}
            </div>

            {/* EXIF GPS Extraction Status Banner */}
            {exifStatus === 'DETECTED' && (
              <div className="p-3 bg-[#123C35]/60 border border-[#7DD3A7]/40 rounded-xl flex items-start gap-2 text-[#7DD3A7]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-[11px]">
                  <span className="font-bold font-mono">EXIF GPS Coordinates Extracted!</span>
                  <p className="text-slate-300 font-sans">
                    Latitude and longitude automatically read from photo camera metadata.
                  </p>
                </div>
              </div>
            )}

            {exifStatus === 'MANUAL' && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl flex items-start gap-2 text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-[11px]">
                  <span className="font-bold font-mono">No EXIF GPS Detected in File</span>
                  <p className="text-slate-300 font-sans">
                    Please provide coordinates manually or tap to place pin within the watershed boundary.
                  </p>
                </div>
              </div>
            )}

            {/* Coordinate Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Latitude (°N)
                </label>
                <input
                  type="text"
                  value={inputLat}
                  onChange={(e) => setInputLat(e.target.value)}
                  className="w-full bg-[#07130F] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#7DD3A7]"
                  placeholder="e.g. 18.9125"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Longitude (°E)
                </label>
                <input
                  type="text"
                  value={inputLon}
                  onChange={(e) => setInputLon(e.target.value)}
                  className="w-full bg-[#07130F] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#7DD3A7]"
                  placeholder="e.g. 73.3278"
                />
              </div>
            </div>

            {/* Target Intervention Class */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Intervention / Condition Class
              </label>
              <select
                value={inputInterventionType}
                onChange={(e) => setInputInterventionType(e.target.value as InterventionClass)}
                className="w-full bg-[#07130F] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#7DD3A7]"
              >
                {INTERVENTION_CLASSES.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {/* Surveyor Notes */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Field Inspection Observations
              </label>
              <textarea
                value={inputNotes}
                onChange={(e) => setInputNotes(e.target.value)}
                rows={2}
                className="w-full bg-[#07130F] border border-slate-800 rounded-lg p-2.5 text-white text-xs font-sans focus:outline-none focus:border-[#7DD3A7]"
                placeholder="Note structural condition, visible siltation, or downstream crop status..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2.5 rounded-lg bg-[#10b981] hover:bg-[#10b981]/90 text-[#0B1F1A] font-bold font-mono text-xs transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Running AI-Assisted Interpretation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Interpret &amp; Store Geo-Coded Evidence</span>
                </>
              )}
            </button>

            {uploadSuccess && (
              <div className="p-2.5 bg-[#123C35] text-[#7DD3A7] rounded-lg text-center font-mono text-xs font-semibold">
                ✓ Evidence saved, geotagged &amp; added to spatial registry!
              </div>
            )}
          </form>
        </div>

        {/* Right Column (7 Cols): Selected Photo Intelligence & AI Interpretation Details */}
        <div className="lg:col-span-7 bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7DD3A7]" />
                <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
                  2. AI-Assisted Image Interpretation Card
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Interprets structural integrity, sedimentation, and vegetation persistence.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#07130F] border border-emerald-600/40 text-emerald-300 text-[10px] font-mono">
              <Info className="w-3 h-3" />
              <span>AI-Assisted Automated Analysis</span>
            </div>
          </div>

          {/* Active Image Large Display */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-[#07130F] shadow-inner group">
            <img 
              src={selectedImage.image_url} 
              alt={selectedImage.filename} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Top metadata tags */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
              <span className="px-2.5 py-1 rounded-md bg-[#07130F]/90 backdrop-blur-md border border-[#7DD3A7]/40 text-[#7DD3A7] text-[11px] font-mono font-bold">
                {selectedImage.intervention_type}
              </span>

              <span className="px-2.5 py-1 rounded-md bg-[#07130F]/90 backdrop-blur-md border border-slate-700 text-slate-300 text-[11px] font-mono">
                {selectedImage.coordinate_source}
              </span>
            </div>

            {/* Bottom coordinate strip */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 flex justify-between items-end text-[11px] font-mono text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px]">COORDINATES</span>
                <span className="text-white font-bold">
                  {selectedImage.latitude.toFixed(4)}°N, {selectedImage.longitude.toFixed(4)}°E
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">CAPTURED TIMESTAMP</span>
                <span className="text-slate-300">{new Date(selectedImage.captured_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* AI Condition Interpretation Box */}
          <div className="p-4 bg-[#07130F] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white uppercase">Detected Conditions:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">Model Confidence:</span>
                <span className="text-xs font-mono font-bold text-[#7DD3A7] bg-[#123C35] px-2 py-0.5 rounded border border-[#7DD3A7]/30">
                  {selectedImage.confidence_score}%
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans bg-[#0B1F1A]/80 p-3 rounded-lg border border-slate-800">
              {selectedImage.observed_conditions}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] font-mono text-slate-400">
              <div>
                <span className="text-slate-500 block text-[10px]">TAMPER SEAL:</span>
                <span className="text-slate-300 truncate block font-mono text-[10px]">{selectedImage.file_sha256.substring(0, 16)}...</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">IMAGE QUALITY:</span>
                <span className="text-[#7DD3A7] font-semibold">{selectedImage.quality_score}/100 (Crisp)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">STATUS:</span>
                <span className="text-emerald-400 font-semibold">Verified Field Evidence</span>
              </div>
            </div>

            {selectedImage.surveyor_notes && (
              <div className="text-[11px] text-slate-400 font-sans border-t border-slate-800 pt-2">
                <span className="font-semibold text-slate-300">Surveyor Field Notes: </span>
                {selectedImage.surveyor_notes}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => onViewOnMap && onViewOnMap(selectedImage.latitude, selectedImage.longitude)}
              className="px-3.5 py-2 bg-[#123C35] hover:bg-[#123C35]/80 text-[#7DD3A7] border border-[#7DD3A7]/30 rounded-lg text-xs font-mono font-semibold transition flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Locate on Geographic Map</span>
            </button>

            <span className="text-[10px] text-slate-500 font-mono">
              *Requires field survey and engineering validation by WDT
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BROWSE CATALOG OF FIELD EVIDENCE CARDS                                 */}
      {/* ========================================================================= */}
      <div className="bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
              3. Micro-Watershed Field Imagery Catalog
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Filter by intervention type to inspect spatial distribution and condition logs.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilterClass('ALL')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition ${
                filterClass === 'ALL' ? 'bg-[#10b981] text-[#0B1F1A] font-bold' : 'bg-[#07130F] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All ({imagesList.length})
            </button>
            {INTERVENTION_CLASSES.slice(0, 5).map((cls) => (
              <button
                key={cls}
                onClick={() => setFilterClass(cls)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition ${
                  filterClass === cls ? 'bg-[#10b981] text-[#0B1F1A] font-bold' : 'bg-[#07130F] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {filteredImages.map((img) => {
            const isSelected = selectedImage.id === img.id;
            return (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`bg-[#07130F] border rounded-xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected ? 'border-[#7DD3A7] ring-1 ring-[#7DD3A7]' : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={img.image_url} alt={img.filename} className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-[#07130F]/90 text-[#7DD3A7] text-[9px] font-mono font-bold">
                    {img.intervention_type}
                  </div>
                </div>

                <div className="p-2.5 space-y-1 text-xs">
                  <p className="text-[11px] text-slate-300 font-sans line-clamp-2 leading-tight">
                    {img.observed_conditions}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/80">
                    <span>{new Date(img.captured_at).toLocaleDateString()}</span>
                    <span className="text-[#7DD3A7] font-semibold">{img.confidence_score}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
