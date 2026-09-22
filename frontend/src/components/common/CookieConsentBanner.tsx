import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';
import { analytics } from '../../services/analytics';

interface CookieConsentBannerProps {
  onOpenPrivacyPolicy: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenPrivacyPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('geowatershed_cookie_consent');
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleAcceptAll = () => {
    analytics.setConsent(true);
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    analytics.setConsent(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-slideUp">
      <div className="bg-[#161c20] border border-[#2c373d] rounded-xl p-4 shadow-2xl backdrop-blur-md text-[#f1f0eb] font-sans text-xs">
        <div className="flex items-start justify-between gap-2.5 mb-2">
          <div className="flex items-center gap-2 text-[#10b981] font-mono font-bold text-xs">
            <Cookie className="w-4 h-4" />
            <span>DPDP Telemetry &amp; Cookie Consent</span>
          </div>
          <button
            onClick={handleEssentialOnly}
            className="text-[#9ba3a7] hover:text-[#f1f0eb] transition-colors"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[11px] text-[#9ba3a7] leading-relaxed mb-3 font-sans">
          GeoWatershed AI utilizes essential cookies for authentication sessions and anonymous telemetry to optimize GIS
          vector rendering under the <strong className="text-[#f1f0eb]">Digital Personal Data Protection (DPDP) Act 2023</strong>.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#242d32]">
          <button
            onClick={handleAcceptAll}
            className="px-3 py-1.5 bg-[#10b981] hover:bg-[#059669] text-[#121619] font-bold font-mono text-[11px] rounded-md transition-colors"
          >
            Accept All
          </button>
          <button
            onClick={handleEssentialOnly}
            className="px-3 py-1.5 bg-[#1e262a] hover:bg-[#283338] text-[#c5c3b8] font-mono text-[11px] rounded-md border border-[#2c373d] transition-colors"
          >
            Essential Only
          </button>
          <button
            onClick={onOpenPrivacyPolicy}
            className="text-[11px] font-mono text-[#10b981] hover:underline ml-auto flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Policy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
