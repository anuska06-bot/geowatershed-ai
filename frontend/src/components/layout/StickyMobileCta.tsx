import React from 'react';
import { Map, Bot, Smartphone, AlertTriangle, Home } from 'lucide-react';
import { AppTab } from './Navbar';

interface StickyMobileCtaProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onOpenSutraAi: () => void;
}

export const StickyMobileCta: React.FC<StickyMobileCtaProps> = ({
  currentTab,
  onTabChange,
  onOpenSutraAi,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121619]/95 backdrop-blur-md border-t border-[#242d32] px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {/* Dossier Overview */}
        <button
          onClick={() => onTabChange('overview')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors font-mono text-[10px] ${
            currentTab === 'overview' ? 'text-[#10b981] font-bold' : 'text-[#9ba3a7]'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>

        {/* GIS Workstation */}
        <button
          onClick={() => onTabChange('explorer')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors font-mono text-[10px] ${
            currentTab === 'explorer' ? 'text-[#10b981] font-bold' : 'text-[#9ba3a7]'
          }`}
        >
          <Map className="w-4 h-4 mb-0.5" />
          <span>GIS Map</span>
        </button>

        {/* SUTRA-AI Diagnostic Assistant (Center Highlighted Pill) */}
        <button
          onClick={onOpenSutraAi}
          className="flex flex-col items-center -mt-3.5 py-1 px-3 bg-[#181f23] border-2 border-[#10b981] text-[#10b981] rounded-xl shadow-lg transition-transform active:scale-95 font-mono text-[10px] font-bold"
        >
          <div className="w-6 h-6 rounded-full bg-[#10b981]/20 flex items-center justify-center mb-0.5">
            <Bot className="w-4 h-4 text-[#10b981]" />
          </div>
          <span>SUTRA-AI</span>
        </button>

        {/* Risk Alerts */}
        <button
          onClick={() => onTabChange('analysis')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors font-mono text-[10px] ${
            currentTab === 'analysis' ? 'text-[#f59e0b] font-bold' : 'text-[#9ba3a7]'
          }`}
        >
          <AlertTriangle className="w-4 h-4 mb-0.5" />
          <span>Risk</span>
        </button>

        {/* Field Survey PWA */}
        <button
          onClick={() => onTabChange('survey')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors font-mono text-[10px] ${
            currentTab === 'survey' ? 'text-[#10b981] font-bold' : 'text-[#9ba3a7]'
          }`}
        >
          <Smartphone className="w-4 h-4 mb-0.5" />
          <span>Survey</span>
        </button>
      </div>
    </div>
  );
};
