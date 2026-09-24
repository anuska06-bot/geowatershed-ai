import React, { useRef } from 'react';
import { WatershedDetail } from '../../types';
import { 
  SAMPLE_GEO_CODED_IMAGES, 
  STRUCTURED_INTERVENTIONS_CATALOG, 
  WATERSHED_CHANGE_DETECTION_RECORDS,
  AI_INTERVENTION_RECOMMENDATIONS
} from '../../data/sihWatershedData';
import { Printer, FileText } from 'lucide-react';

interface ReportsViewProps {
  watershed: WatershedDetail;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ watershed }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const changeRecord = WATERSHED_CHANGE_DETECTION_RECORDS[watershed.code] || WATERSHED_CHANGE_DETECTION_RECORDS['MH-WDC-042'];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-100">

      {/* Top Action Bar (hidden in print) */}
      <div className="bg-[#0B1F1A] border border-[#7DD3A7]/25 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#123C35] text-[#7DD3A7] text-[11px] font-mono border border-[#7DD3A7]/30">
            <FileText className="w-3.5 h-3.5" />
            <span>WDC-PMKSY 2.0 • STATUTORY OUTCOME DOSSIER GENERATOR</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Automated Watershed Assessment &amp; Outcome Report
          </h1>
          <p className="text-xs text-slate-300">
            Comprehensive 15-point technical synthesis for District Level Committee (DLC) and State Nodal Agency (SLNA) audit.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-lg bg-[#10b981] hover:bg-[#10b981]/90 text-[#0B1F1A] font-bold text-xs font-mono transition flex items-center gap-2 shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document (Clean styling on white in print mode) */}
      <div 
        ref={printRef}
        className="bg-[#0B1F1A] border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none print:p-0"
      >
        
        {/* Cover Header Banner */}
        <div 
          className="relative rounded-xl overflow-hidden border border-[#7DD3A7]/30 p-6 sm:p-8 text-center bg-cover bg-center shadow-md print:bg-none print:border-slate-400"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(7, 19, 15, 0.40), rgba(7, 19, 15, 0.75)), url('/watershed-hero-hd.jpg')`
          }}
        >
          <div className="relative z-10 space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-[#07130F]/90 backdrop-blur-md text-[#7DD3A7] text-[10px] font-mono uppercase font-bold border border-[#7DD3A7]/40 shadow-sm print:bg-none print:text-slate-800 print:border-slate-400">
              Government of India • Ministry of Rural Development • Department of Land Resources (DoLR)
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white font-mono tracking-tight print:text-black">
              WATERSHED DEVELOPMENT OUTCOME &amp; AUDIT REPORT
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono pt-1">
              <span className="px-3 py-1 rounded bg-[#07130F]/90 backdrop-blur-md text-slate-200 border border-slate-700 print:text-slate-800 print:bg-none print:border-none">
                Ref: GW-SIH-26015-{watershed.code}-{new Date().getFullYear()}
              </span>
              <span className="px-3 py-1 rounded bg-[#123C35]/90 backdrop-blur-md text-[#7DD3A7] border border-[#7DD3A7]/40 font-semibold print:text-emerald-800 print:bg-none print:border-none">
                {watershed.name} Catchment ({watershed.area_hectares} ha)
              </span>
            </div>
          </div>
        </div>

        {/* Section 1 & 2: Location & Administrative Details */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-[#7DD3A7] uppercase tracking-wider border-b border-slate-800 print:border-slate-300 pb-1.5 print:text-emerald-800">
            1 &amp; 2. Location &amp; Watershed Baseline Hierarchy
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#07130F] p-4 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-300 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Watershed Code</span>
              <span className="font-bold text-white print:text-black">{watershed.code}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">District &amp; State</span>
              <span className="font-bold text-white print:text-black">{watershed.district}, {watershed.state}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Drainage Basin</span>
              <span className="font-bold text-white print:text-black">{watershed.basin}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Centroid Coordinates</span>
              <span className="font-bold text-[#7DD3A7] print:text-emerald-800">{watershed.centroid_lat.toFixed(4)}°N, {watershed.centroid_lon.toFixed(4)}°E</span>
            </div>
          </div>
        </div>

        {/* Section 3: Geo-Coded Field Evidence Ingestion */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-[#7DD3A7] uppercase tracking-wider border-b border-slate-800 print:border-slate-300 pb-1.5 print:text-emerald-800">
            3. Geo-Coded Field Photography &amp; In-Situ Evidence Register
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#07130F] border-b border-slate-800 print:bg-slate-200 text-[10px] text-slate-400 print:text-black uppercase">
                  <th className="p-2.5">Evidence ID</th>
                  <th className="p-2.5">Structure Type</th>
                  <th className="p-2.5">Coordinates (EXIF)</th>
                  <th className="p-2.5">Captured Date</th>
                  <th className="p-2.5">Observed Physical Condition</th>
                  <th className="p-2.5">SHA-256 Seal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300 text-[11px]">
                {SAMPLE_GEO_CODED_IMAGES.map((img) => (
                  <tr key={img.id}>
                    <td className="p-2.5 font-bold text-white print:text-black">{img.id}</td>
                    <td className="p-2.5 text-slate-300 print:text-slate-800">{img.intervention_type}</td>
                    <td className="p-2.5 text-[#7DD3A7] print:text-emerald-800">{img.latitude.toFixed(4)}°, {img.longitude.toFixed(4)}°</td>
                    <td className="p-2.5 text-slate-400 print:text-slate-600">{new Date(img.captured_at).toLocaleDateString()}</td>
                    <td className="p-2.5 font-sans text-slate-300 print:text-black line-clamp-1">{img.observed_conditions}</td>
                    <td className="p-2.5 text-slate-500 text-[9px]">{img.file_sha256.substring(0, 12)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4 & 5: Terrain & Runoff Analysis */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-[#7DD3A7] uppercase tracking-wider border-b border-slate-800 print:border-slate-300 pb-1.5 print:text-emerald-800">
            4 &amp; 5. Terrain, Digital Elevation (DEM) &amp; Hydrological Flow Routing
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#07130F] border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Elevation Profile</span>
              <p className="font-sans text-slate-300 print:text-black">
                Min: 98m, Max: 340m above MSL. Ridge-to-valley elevation drop of 242m across a 4.2 km main channel stem.
              </p>
            </div>
            <div className="p-3 bg-[#07130F] border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Slope Gradient</span>
              <p className="font-sans text-slate-300 print:text-black">
                Upper Ridge: 15-28% (steep runoff); Mid-flanks: 5-12% (contour bunding zone); Valley floor: 1-3% (water harvesting).
              </p>
            </div>
            <div className="p-3 bg-[#07130F] border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Hydrologic Network</span>
              <p className="font-sans text-slate-300 print:text-black">
                D8 flow routing resolves 4 stream orders. Drainage density is 2.8 km/km², indicating moderate-to-high natural drainage efficiency.
              </p>
            </div>
          </div>
        </div>

        {/* Section 6 & 7: Vegetation & Water-Body Condition */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-[#7DD3A7] uppercase tracking-wider border-b border-slate-800 print:border-slate-300 pb-1.5 print:text-emerald-800">
            6 &amp; 7. Multi-Spectral Remote Sensing (NDVI &amp; NDWI Condition)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#07130F] p-4 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-300 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Baseline Mean NDVI</span>
              <span className="font-bold text-white print:text-black">{changeRecord.baseline_ndvi.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Operational Mean NDVI</span>
              <span className="font-bold text-[#7DD3A7] print:text-emerald-800">{changeRecord.operational_ndvi.toFixed(2)} (+{changeRecord.ndvi_change_observed.toFixed(2)})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Baseline Water Spread</span>
              <span className="font-bold text-white print:text-black">{changeRecord.baseline_water_ha.toFixed(1)} ha</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Operational Water Spread</span>
              <span className="font-bold text-[#1677FF] print:text-blue-800">{changeRecord.operational_water_ha.toFixed(1)} ha (+{changeRecord.water_change_observed_ha.toFixed(1)} ha)</span>
            </div>
          </div>
        </div>

        {/* Section 8 & 9: Intervention Inventory & Before/After Observations */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-[#7DD3A7] uppercase tracking-wider border-b border-slate-800 print:border-slate-300 pb-1.5 print:text-emerald-800">
            8 &amp; 9. Intervention Inventory &amp; Observed Change Analysis
          </h3>
          <div className="p-3 bg-[#07130F] border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300 space-y-2 text-xs font-sans leading-relaxed">
            <p className="text-slate-300 print:text-black">
              Total of {STRUCTURED_INTERVENTIONS_CATALOG.length} water harvesting and soil conservation structures are inventoried across the catchment. 
              Sentinel-2 surface reflectance indicates positive canopy expansion and extended open water spread following structure completion.
            </p>
            <p className="text-slate-400 print:text-slate-600 text-[11px] italic">
              Scientific Honesty Note: {changeRecord.scientific_observation}
            </p>
          </div>
        </div>

        {/* Section 10, 11 & 12: Priority Areas, AI Recommendations & Cost Estimate */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-[#7DD3A7] uppercase tracking-wider border-b border-slate-800 print:border-slate-300 pb-1.5 print:text-emerald-800">
            10, 11 &amp; 12. Siting Recommendations, Material Specifications &amp; Preliminary Cost
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#07130F] border-b border-slate-800 print:bg-slate-200 text-[10px] text-slate-400 print:text-black uppercase">
                  <th className="p-2.5">Structure Type</th>
                  <th className="p-2.5">Priority</th>
                  <th className="p-2.5">Stream Order</th>
                  <th className="p-2.5">Recommended Materials</th>
                  <th className="p-2.5">Preliminary Cost (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300 text-[11px]">
                {AI_INTERVENTION_RECOMMENDATIONS.map((rec) => (
                  <tr key={rec.id}>
                    <td className="p-2.5 font-bold text-white print:text-black">{rec.structure_type}</td>
                    <td className="p-2.5 text-rose-400 print:text-rose-700 font-bold">{rec.priority}</td>
                    <td className="p-2.5 text-slate-300 print:text-slate-800">Order {rec.stream_order}</td>
                    <td className="p-2.5 font-sans text-slate-300 print:text-black">{rec.recommended_materials[0].material}</td>
                    <td className="p-2.5 font-bold text-[#7DD3A7] print:text-emerald-800">₹{rec.preliminary_cost.preliminary_total_inr.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            *Preliminary estimates derived from standard state schedule of rates (SoR). Subject to total station survey and detailed project report (DPR) sanction.
          </p>
        </div>

        {/* Section 13, 14 & 15: Data Sources, Limitations & Field Validation */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-[#7DD3A7] uppercase tracking-wider border-b border-slate-800 print:border-slate-300 pb-1.5 print:text-emerald-800">
            13, 14 &amp; 15. Data Transparency, Remote Sensing Limitations &amp; Field Validation Protocol
          </h3>
          <div className="p-4 bg-[#07130F] border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300 space-y-2 text-xs font-sans leading-relaxed">
            <p className="text-slate-300 print:text-black">
              <span className="font-semibold text-white print:text-black">13. Data Sources:</span> Elevation (CartoDEM 30m / ISRO Bhuvan); Multispectral Reflectance (ESA Sentinel-2 L2A 10m); Ground-Truth Photographs (WDC-PMKSY Mobile Surveyor GPS EXIF).
            </p>
            <p className="text-slate-300 print:text-black">
              <span className="font-semibold text-white print:text-black">14. Limitations:</span> Satellite multi-spectral observations are subject to cloud occlusion during heavy monsoon months and do not replace physical soil texture or groundwater depth testing.
            </p>
            <p className="text-slate-300 print:text-black">
              <span className="font-semibold text-white print:text-black">15. Field Validation:</span> All proposed structures require on-ground engineering validation, bedrock depth bore-drilling, and Gram Panchayat social audit approval before tendering.
            </p>
          </div>
        </div>

        {/* Statutory Approval Sign-Off Block */}
        <div className="grid grid-cols-2 pt-8 text-center text-slate-400 print:text-black border-t border-slate-800 print:border-slate-300">
          <div>
            <div className="h-12 border-b border-dashed border-slate-700 max-w-xs mx-auto mb-1"></div>
            <p className="font-bold text-xs text-slate-200 print:text-black font-sans">Watershed Development Team (WDT)</p>
            <p className="text-[10px] text-slate-500 font-mono">Surveyor &amp; GPS EXIF Ingestion Officer</p>
          </div>
          <div>
            <div className="h-12 border-b border-dashed border-slate-700 max-w-xs mx-auto mb-1"></div>
            <p className="font-bold text-xs text-slate-200 print:text-black font-sans">Project Director (SLNA / DoLR)</p>
            <p className="text-[10px] text-slate-500 font-mono">Statutory Hydrological Approval Authority</p>
          </div>
        </div>

      </div>

    </div>
  );
};
