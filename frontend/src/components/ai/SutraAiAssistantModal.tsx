import React, { useState } from 'react';
import { 
  Bot, 
  Video, 
  Sparkles, 
  Send, 
  X, 
  Wrench, 
  Clock, 
  BookOpen
} from 'lucide-react';
import { api } from '../../services/api';

interface SutraAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  watershedId?: string;
  defaultStructure?: string;
}

export const SutraAiAssistantModal: React.FC<SutraAiAssistantModalProps> = ({
  isOpen,
  onClose,
  watershedId,
  defaultStructure = 'Check Dam'
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('check_dam');
  const [structureType, setStructureType] = useState<string>(defaultStructure);
  
  // Interactive Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; recs?: string[]; cites?: string[] }>>([
    {
      role: 'assistant',
      text: 'Greetings. I am SUTRA-AI, the National Hydrologic Diagnostic Assistant. Upload field video or photo evidence to diagnose siltation, seepage, and structural stability, or ask me any question regarding engineering standards, SoR costings, and WDC-PMKSY 2.0 norms.'
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  if (!isOpen) return null;

  const handleRunAnalysis = async (presetOverride?: string) => {
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('sample_preset', presetOverride || selectedPreset);
      formData.append('intervention_type', structureType);
      if (watershedId) formData.append('watershed_id', watershedId);

      const res = await api.analyzeSutraMedia(formData);
      setDiagnosticResult(res);

      // Add diagnostic summary into chat
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Diagnostic Completed for ${res.structure_detected}: ${res.diagnostics_summary}`,
          recs: res.remediation_steps.map((s: any) => `${s.phase} (${s.timeline}): ${s.title}`),
          cites: ["CPWD / CWC Engineering Maintenance Codes", "WDC-PMKSY 2.0 Operational Guidelines"]
        }
      ]);
    } catch (e: any) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userQuery = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userQuery }]);
    setChatLoading(true);

    try {
      const res = await api.askSutraAi(userQuery, watershedId, structureType);
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: res.response,
          recs: res.actionable_recommendations,
          cites: res.citations
        }
      ]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Apologies, unable to contact SUTRA-AI diagnostic engine. Please ensure backend is active.'
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-5 backdrop-blur-sm">
      <div className="bg-[#181f23] border border-[#2c373d] rounded-xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-[#f1f0eb] font-sans">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#2c373d] bg-[#121619] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#242e32] border border-[#10b981]/50 flex items-center justify-center text-[#10b981]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base font-mono tracking-tight text-[#f1f0eb]">
                  SUTRA-AI Video &amp; Field Diagnostic Assistant
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 uppercase">
                  WDC-PMKSY 2.0 Copilot
                </span>
              </div>
              <p className="text-xs text-[#9ba3a7] font-mono">
                Computer Vision Siltation Inundation • Structural Scour Evaluation • Actionable Remediation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#242e32] text-[#9ba3a7] hover:text-[#f1f0eb] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split 2-Column Workflow */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#2c373d]">
          
          {/* Left Column: Media Upload & Diagnostic Engine (6 cols) */}
          <div className="lg:col-span-6 p-5 space-y-5 overflow-y-auto">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#9ba3a7] font-semibold block mb-2">
                Select Field Inspection Media
              </label>

              {/* Sample Preset Selector */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => { setSelectedPreset('check_dam'); setStructureType('Check Dam'); }}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors font-mono ${
                    selectedPreset === 'check_dam'
                      ? 'bg-[#242e32] border-[#10b981] text-[#f1f0eb]'
                      : 'bg-[#121619] border-[#2c373d] text-[#9ba3a7] hover:border-[#3e4d54]'
                  }`}
                >
                  <div className="font-bold text-[11px] mb-0.5 text-[#10b981]">Masonry Dam</div>
                  <div className="text-[10px] text-[#9ba3a7]">Siltation &amp; Scour</div>
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedPreset('farm_pond'); setStructureType('Farm Pond'); }}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors font-mono ${
                    selectedPreset === 'farm_pond'
                      ? 'bg-[#242e32] border-[#0ea5e9] text-[#f1f0eb]'
                      : 'bg-[#121619] border-[#2c373d] text-[#9ba3a7] hover:border-[#3e4d54]'
                  }`}
                >
                  <div className="font-bold text-[11px] mb-0.5 text-[#0ea5e9]">Farm Pond</div>
                  <div className="text-[10px] text-[#9ba3a7]">Berm Seepage</div>
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedPreset('contour_trench'); setStructureType('Continuous Contour Trench'); }}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors font-mono ${
                    selectedPreset === 'contour_trench'
                      ? 'bg-[#242e32] border-[#d97706] text-[#f1f0eb]'
                      : 'bg-[#121619] border-[#2c373d] text-[#9ba3a7] hover:border-[#3e4d54]'
                  }`}
                >
                  <div className="font-bold text-[11px] mb-0.5 text-[#d97706]">Contour Trench</div>
                  <div className="text-[10px] text-[#9ba3a7]">Sediment Choke</div>
                </button>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-[#2c373d] hover:border-[#10b981] bg-[#121619] rounded-lg p-5 text-center cursor-pointer transition-colors">
                <Video className="w-8 h-8 text-[#10b981] mx-auto mb-2" />
                <div className="text-xs font-semibold text-[#f1f0eb]">
                  Drag and drop field video or photographic telemetry
                </div>
                <div className="text-[11px] text-[#9ba3a7] mt-1 font-mono">
                  Supported formats: MP4, MOV, WEBM, JPG (Max 15MB)
                </div>
                <button
                  type="button"
                  onClick={() => handleRunAnalysis()}
                  disabled={analyzing}
                  className="mt-3 px-4 py-2 rounded-md bg-[#10b981] hover:bg-[#059669] text-[#111618] font-bold text-xs font-mono tracking-wider transition-colors inline-flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{analyzing ? 'Processing Telemetry...' : 'Run SUTRA-AI Diagnostic'}</span>
                </button>
              </div>
            </div>

            {/* Diagnostic Scorecard (when available) */}
            {diagnosticResult && (
              <div className="bg-[#121619] border border-[#2c373d] rounded-lg p-4 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#2c373d] pb-2 font-mono">
                  <span className="text-xs font-bold text-[#10b981]">
                    DIAGNOSTIC ID: {diagnosticResult.analysis_id}
                  </span>
                  <span className="text-[10px] text-[#9ba3a7]">
                    Stream Order {diagnosticResult.stream_order_evaluated}
                  </span>
                </div>

                {/* Meter Gauges */}
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="bg-[#181f23] p-3 rounded border border-[#2c373d]">
                    <div className="text-[10px] text-[#9ba3a7] uppercase">Silt Accumulation</div>
                    <div className="text-xl font-bold text-[#d97706] mt-0.5">
                      {diagnosticResult.siltation_percentage}%
                    </div>
                    <div className="text-[10px] text-[#9ba3a7] mt-1">
                      {diagnosticResult.estimated_storage_recovery_cum} m³ Lost Storage
                    </div>
                  </div>

                  <div className="bg-[#181f23] p-3 rounded border border-[#2c373d]">
                    <div className="text-[10px] text-[#9ba3a7] uppercase">Structural Integrity</div>
                    <div className="text-xl font-bold text-[#10b981] mt-0.5">
                      {diagnosticResult.structural_integrity_score} / 100
                    </div>
                    <div className="text-[10px] text-[#9ba3a7] mt-1">
                      {diagnosticResult.seepage_risk_level}
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Remediation Action Plan */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#f1f0eb] uppercase">
                    <Wrench className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>Prescribed Engineering Action Plan</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {diagnosticResult.remediation_steps.map((step: any, idx: number) => (
                      <div key={idx} className="bg-[#181f23] border border-[#2c373d] rounded-lg p-3 space-y-1">
                        <div className="flex items-center justify-between font-mono">
                          <span className="text-[11px] font-bold text-[#10b981]">{step.phase}</span>
                          <span className="text-[10px] text-[#9ba3a7] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {step.timeline}
                          </span>
                        </div>
                        <div className="font-semibold text-sm text-[#f1f0eb]">{step.title}</div>
                        <div className="text-xs text-[#c5c3b8] leading-relaxed">{step.description}</div>
                        <div className="flex items-center justify-between text-[10px] font-mono border-t border-[#2c373d] pt-1 mt-1 text-[#9ba3a7]">
                          <span>Est: ₹{step.estimated_cost_inr.toLocaleString()}</span>
                          <span className="text-[#0ea5e9]">{step.funding_window}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interactive AI Copilot Query Console (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#121619] p-5">
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
              <div className="flex items-center justify-between border-b border-[#2c373d] pb-2 font-mono">
                <span className="text-xs font-bold text-[#f1f0eb] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
                  Interactive Engineering Copilot
                </span>
                <span className="text-[10px] text-[#9ba3a7]">Groundwater &amp; SoR Assistant</span>
              </div>

              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-lg text-xs font-mono leading-relaxed space-y-2 ${
                    msg.role === 'user'
                      ? 'bg-[#242e32] border border-[#3e4d54] text-[#f1f0eb] ml-6'
                      : 'bg-[#181f23] border border-[#2c373d] text-[#c5c3b8] mr-4'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[11px] text-[#9ba3a7]">
                    {msg.role === 'user' ? 'YOU (Field Officer / Minister)' : 'SUTRA-AI'}
                  </div>
                  <div className="whitespace-pre-line text-[#e2e0d8]">{msg.text}</div>

                  {msg.recs && msg.recs.length > 0 && (
                    <div className="border-t border-[#2c373d] pt-2 space-y-1">
                      <div className="text-[10px] font-bold text-[#10b981] uppercase">Action Protocol:</div>
                      {msg.recs.map((r, ri) => (
                        <div key={ri} className="flex items-start gap-1.5 text-[11px] text-[#c5c3b8]">
                          <span className="text-[#10b981] font-bold">•</span>
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.cites && msg.cites.length > 0 && (
                    <div className="border-t border-[#2c373d] pt-1 text-[10px] text-[#9ba3a7] flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#0ea5e9]" />
                      <span>{msg.cites.join(' • ')}</span>
                    </div>
                  )}
                </div>
              ))}

              {chatLoading && (
                <div className="p-3 bg-[#181f23] rounded-lg border border-[#2c373d] text-xs font-mono text-[#9ba3a7] animate-pulse">
                  SUTRA-AI is calculating watershed hydraulic formulas and SoR rates...
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="pt-3 border-t border-[#2c373d] space-y-2">
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setChatInput("What is the cost of desiltation per cubic metre?")}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-[#181f23] hover:bg-[#242e32] border border-[#2c373d] text-[#9ba3a7] hover:text-[#f1f0eb] transition-colors"
                >
                  Cost per m³?
                </button>
                <button
                  type="button"
                  onClick={() => setChatInput("How to arrest severe gully erosion in this catchment?")}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-[#181f23] hover:bg-[#242e32] border border-[#2c373d] text-[#9ba3a7] hover:text-[#f1f0eb] transition-colors"
                >
                  Gully Erosion Fix?
                </button>
                <button
                  type="button"
                  onClick={() => setChatInput("Prepare executive summary briefing for the Field Minister.")}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-[#181f23] hover:bg-[#242e32] border border-[#2c373d] text-[#9ba3a7] hover:text-[#f1f0eb] transition-colors"
                >
                  Minister Briefing?
                </button>
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask SUTRA-AI on engineering actions, costs, or hydrology..."
                  className="flex-1 bg-[#181f23] border border-[#2c373d] rounded-lg px-3 py-2 text-xs text-[#f1f0eb] placeholder-[#9ba3a7] focus:outline-none focus:border-[#10b981] font-mono"
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-3.5 py-2 rounded-lg bg-[#10b981] hover:bg-[#059669] disabled:opacity-40 text-[#111618] font-bold text-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
