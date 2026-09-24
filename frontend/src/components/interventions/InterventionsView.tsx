import React, { useState } from 'react';
import { WatershedDetail, StructuredInterventionItem } from '../../types';
import { STRUCTURED_INTERVENTIONS_CATALOG } from '../../data/sihWatershedData';
import { 
  Layers, MapPin, CheckCircle2, Search, FileText, Camera 
} from 'lucide-react';

interface InterventionsViewProps {
  watershed: WatershedDetail;
  onViewOnMap?: (lat: number, lon: number) => void;
  onOpenUpload?: () => void;
}

export const InterventionsView: React.FC<InterventionsViewProps> = ({
  watershed,
  onViewOnMap,
  onOpenUpload
}) => {
  const [interventions] = useState<StructuredInterventionItem[]>(STRUCTURED_INTERVENTIONS_CATALOG);
  const [selectedItem, setSelectedItem] = useState<StructuredInterventionItem>(STRUCTURED_INTERVENTIONS_CATALOG[0]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter logic
  const filtered = interventions.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-100">

      {/* Header Banner */}
      <div className="bg-[#0B1F1A] border border-[#7DD3A7]/25 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#123C35] border border-[#7DD3A7]/30 text-[#7DD3A7] text-[11px] font-mono">
              <Layers className="w-3.5 h-3.5 text-[#1677FF]" />
              <span>WDC-PMKSY 2.0 • INTERVENTION INVENTORY REGISTRY</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Watershed Interventions &amp; Works Database
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Catchment: {watershed.name} ({watershed.code}) • Comprehensive inventory of soil, water, and drainage conservation structures with geotagged inspection history, 
              stream bed order conformance, and satellite evidence audit.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="px-3.5 py-2 rounded-lg bg-[#10b981] hover:bg-[#10b981]/90 text-[#0B1F1A] font-bold text-xs font-mono transition flex items-center gap-1.5 shadow-md"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Record New Inspection</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Interface: Table Registry + Detailed Asset Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (7 Cols): Searchable Filterable Register */}
        <div className="lg:col-span-7 bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search intervention name or code..."
                className="w-full bg-[#07130F] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#7DD3A7]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-[#07130F] border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-[#7DD3A7]"
              >
                <option value="ALL">All Types</option>
                <option value="Check Dam">Check Dam</option>
                <option value="Farm Pond">Farm Pond</option>
                <option value="Contour Bund">Contour Bund</option>
                <option value="Drainage Structure">Drainage Structure</option>
                <option value="Diversion Drain">Diversion Drain</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#07130F] border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-[#7DD3A7]"
              >
                <option value="ALL">All Status</option>
                <option value="Operational">Operational</option>
                <option value="Inspection Due">Inspection Due</option>
                <option value="Maintenance Required">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Intervention List Cards */}
          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filtered.map((item) => {
              const isSelected = selectedItem.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col gap-2 ${
                    isSelected 
                      ? 'bg-[#123C35] border-[#7DD3A7] shadow-md' 
                      : 'bg-[#07130F] border-slate-800 hover:border-slate-600 hover:bg-[#123C35]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{item.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-400">
                          {item.code}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.type} • Strahler Stream Order {item.stream_order}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      item.priority === 'HIGH' ? 'bg-rose-950/80 text-rose-300 border border-rose-800' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-sans line-clamp-1">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/80">
                    <span>Lat {item.latitude.toFixed(4)}°, Lon {item.longitude.toFixed(4)}°</span>
                    <span className="text-[#7DD3A7] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#7DD3A7]" />
                      {item.satellite_evidence_status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 Cols): Selected Intervention Full Geospatial Dossier */}
        <div className="lg:col-span-5 bg-[#0B1F1A] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#7DD3A7]" />
              <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
                Intervention Audit Card
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">ID: {selectedItem.code}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Structure Name</span>
              <h4 className="text-sm font-bold text-white font-sans">{selectedItem.name}</h4>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">{selectedItem.description}</p>
            </div>

            {/* Matrix of Details */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-[#07130F] border border-slate-800 rounded-xl font-mono text-[11px]">
              <div>
                <span className="text-slate-500 text-[10px] block">TYPE</span>
                <span className="text-white font-bold">{selectedItem.type}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">STREAM ORDER</span>
                <span className="text-white font-bold">Order {selectedItem.stream_order}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">COORDINATES</span>
                <span className="text-[#7DD3A7]">{selectedItem.latitude.toFixed(4)}°, {selectedItem.longitude.toFixed(4)}°</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">LAST INSPECTED</span>
                <span className="text-slate-300">{selectedItem.inspection_date}</span>
              </div>
            </div>

            {/* Observed Condition */}
            <div className="p-3 bg-[#07130F] border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                Observed Physical Condition:
              </span>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                {selectedItem.observed_condition}
              </p>
            </div>

            {/* Satellite Evidence Deltas */}
            <div className="p-3 bg-[#07130F] border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-[#7DD3A7] uppercase font-bold block">
                Remote Sensing Evidence Linkage:
              </span>
              <div className="space-y-1 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Vegetation Delta:</span>
                  <span className="text-[#7DD3A7] font-semibold">{selectedItem.ndvi_change_observed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Water Spread Delta:</span>
                  <span className="text-[#1677FF] font-semibold">{selectedItem.water_change_observed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Audit Status:</span>
                  <span className="text-emerald-400 font-semibold">{selectedItem.satellite_evidence_status}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => onViewOnMap && onViewOnMap(selectedItem.latitude, selectedItem.longitude)}
                className="flex-1 py-2 rounded-lg bg-[#123C35] hover:bg-[#123C35]/80 text-[#7DD3A7] border border-[#7DD3A7]/30 text-xs font-mono font-semibold transition flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Locate on Map</span>
              </button>

              <button
                onClick={onOpenUpload}
                className="flex-1 py-2 rounded-lg bg-[#10b981] hover:bg-[#10b981]/90 text-[#0B1F1A] font-bold text-xs font-mono transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Field Photo</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
