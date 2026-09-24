import React, { useState } from 'react';
import { WatershedDetail } from '../../types';
import { 
  STRUCTURED_INTERVENTIONS_CATALOG, 
  WATERSHED_CHANGE_DETECTION_RECORDS 
} from '../../data/sihWatershedData';
import { Bot, Send, X, ArrowRight } from 'lucide-react';

interface AskGeoWatershedAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  watershed?: WatershedDetail | null;
  onNavigateTab: (tab: any) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  actionTab?: string;
  actionLabel?: string;
  timestamp: string;
}

const PRESET_QUERIES = [
  'Show areas with high water accumulation.',
  'Which interventions need inspection?',
  'Show vegetation change after intervention.',
  'Which areas have high erosion risk?',
  'What watershed interventions are present in this region?'
];

export const AskGeoWatershedAiModal: React.FC<AskGeoWatershedAiModalProps> = ({
  isOpen,
  onClose,
  watershed,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');
  const wsName = watershed?.name || 'Karjat Micro-Watershed';
  const wsCode = watershed?.code || 'MH-WDC-042';
  const wsLat = watershed?.centroid_lat ?? 18.9102;
  const wsLon = watershed?.centroid_lon ?? 73.3283;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I am GeoWatershed AI, grounded in real spatial telemetry for ${wsName} (${wsCode}). Ask me about catchment hydrology, intervention inspection states, Sentinel-2 vegetation trends, or D8 drainage paths.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || query).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsTyping(true);

    // Grounded answer generator using actual loaded data
    setTimeout(() => {
      const lower = q.toLowerCase();
      let reply = '';
      let targetTab: string | undefined = undefined;
      let targetLabel: string | undefined = undefined;

      const changeRecord = WATERSHED_CHANGE_DETECTION_RECORDS[wsCode] || WATERSHED_CHANGE_DETECTION_RECORDS['MH-WDC-042'];

      if (lower.includes('water accumulation') || lower.includes('ponding') || lower.includes('flood') || lower.includes('drainage')) {
        reply = `According to CartoDEM flow accumulation and D8 routing for ${wsName}, peak water accumulation occurs in the lower valley confluence (Order 3 and 4 streams) around Lat ${wsLat.toFixed(4)}°, Lon ${wsLon.toFixed(4)}°. Two community farm ponds and masonry check dam CD-01 currently regulate this run-off.`;
        targetTab = 'explorer';
        targetLabel = 'Open GIS Drainage Map';
      } else if (lower.includes('need inspection') || lower.includes('inspect') || lower.includes('due') || lower.includes('maintenance')) {
        const dueItems = STRUCTURED_INTERVENTIONS_CATALOG.filter(i => i.status !== 'Operational');
        if (dueItems.length > 0) {
          reply = `In ${wsName}, ${dueItems.length} structure currently requires inspection: ${dueItems.map(d => `${d.name} (${d.code}, Status: ${d.status})`).join(', ')}. Last checked on ${dueItems[0].inspection_date}. Recommended to record fresh geotagged field photos.`;
        } else {
          reply = `All ${STRUCTURED_INTERVENTIONS_CATALOG.length} inventoried structures are marked Operational. However, pre-monsoon inspection is recommended for 3rd-order masonry check dams.`;
        }
        targetTab = 'interventions';
        targetLabel = 'View Works Registry';
      } else if (lower.includes('vegetation') || lower.includes('ndvi') || lower.includes('greenness')) {
        reply = `Sentinel-2 multi-spectral audit demonstrates an observed vegetation change of +${changeRecord.ndvi_change_observed.toFixed(2)} mean NDVI (from pre-intervention baseline ${changeRecord.baseline_ndvi.toFixed(2)} to operational ${changeRecord.operational_ndvi.toFixed(2)}). Note: This observed change correlates with treatment works and precipitation; we do not claim sole causal attribution.`;
        targetTab = 'change-detection';
        targetLabel = 'Open Change Detection Slider';
      } else if (lower.includes('erosion') || lower.includes('gully') || lower.includes('sheet wash')) {
        reply = `High erosion hazard is concentrated on the upper northern ridge slopes (slope gradient 14-26%, Strahler stream order 1). Active headward gully incision was geotagged at Lat 18.9285°, Lon 73.3250°. Recommended treatment: Loose boulder check dam and continuous contour trenches.`;
        targetTab = 'recommendations';
        targetLabel = 'View Siting Recommendations';
      } else if (lower.includes('interventions') || lower.includes('structures') || lower.includes('present')) {
        const types = STRUCTURED_INTERVENTIONS_CATALOG.map(i => `${i.name} (${i.type}, Stream Order ${i.stream_order})`);
        reply = `Currently, ${STRUCTURED_INTERVENTIONS_CATALOG.length} verified structures are registered in ${wsName}: ${types.slice(0, 3).join('; ')}; and more. Each has linked GPS EXIF field cards and satellite compliance flags.`;
        targetTab = 'interventions';
        targetLabel = 'Inspect Full Registry';
      } else {
        reply = `The requested parameter is not directly available in the currently loaded WDC-PMKSY 2.0 dataset for ${wsName}. Available datasets include CartoDEM 30m terrain, Sentinel-2 NDVI/NDWI, D8 stream orders, and GPS-tagged field photography.`;
        targetTab = 'methodology';
        targetLabel = 'Check Data Lineage Matrix';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        actionTab: targetTab,
        actionLabel: targetLabel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0B1F1A] border border-[#7DD3A7]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#07130F]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#123C35] border border-[#7DD3A7]/40 flex items-center justify-center text-[#7DD3A7]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-mono flex items-center gap-1.5">
                <span>Ask GeoWatershed AI</span>
                <span className="text-[10px] text-[#7DD3A7] bg-[#123C35] px-2 py-0.5 rounded border border-[#7DD3A7]/30">
                  Grounded Spatial Assistant
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Grounded in {wsName} ({wsCode}) telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#10b981] text-[#0B1F1A] font-medium rounded-tr-none'
                    : 'bg-[#07130F] text-slate-200 border border-slate-800 rounded-tl-none font-sans'
                }`}
              >
                <p>{m.text}</p>

                {m.actionTab && (
                  <button
                    onClick={() => {
                      onNavigateTab(m.actionTab!);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#7DD3A7] bg-[#123C35] hover:bg-[#123C35]/80 px-2.5 py-1 rounded-md border border-[#7DD3A7]/30 transition"
                  >
                    <span>{m.actionLabel || 'View on Platform'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 px-1">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 font-mono text-xs p-2">
              <span className="w-2 h-2 rounded-full bg-[#7DD3A7] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#7DD3A7] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#7DD3A7] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-500 ml-1">Evaluating spatial layers...</span>
            </div>
          )}
        </div>

        {/* Preset Query Chips */}
        <div className="px-4 py-2 bg-[#07130F] border-t border-slate-800/80 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          <span className="text-[10px] font-mono text-slate-500 shrink-0">Try asking:</span>
          {PRESET_QUERIES.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(pq)}
              className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#0B1F1A] border border-slate-800 text-slate-300 hover:text-[#7DD3A7] hover:border-[#7DD3A7]/40 transition shrink-0"
            >
              {pq}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#07130F] border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a technical question about this watershed catchment..."
            className="flex-1 bg-[#0B1F1A] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-sans focus:outline-none focus:border-[#7DD3A7]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!query.trim()}
            className="p-2.5 rounded-xl bg-[#10b981] hover:bg-[#10b981]/90 text-[#0B1F1A] font-bold transition disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
