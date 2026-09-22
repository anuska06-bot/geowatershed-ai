import React from 'react';
import { CheckCircle2, ShieldCheck, Copy, Check, ArrowRight, X } from 'lucide-react';

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  txHash?: string;
  sha256?: string;
  details?: { label: string; value: string }[];
  onAction?: () => void;
  actionLabel?: string;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  isOpen,
  onClose,
  title = 'Field Evidence Successfully Recorded',
  subtitle = 'Cryptographic SHA-256 fingerprint verified against WDC-PMKSY 2.0 tamper-proof audit trail.',
  txHash = `WDC-TX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
  sha256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  details = [],
  onAction,
  actionLabel = 'Continue to Workstation'
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#181f23] border border-[#2c373d] rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9ba3a7] hover:text-[#f1f0eb] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#10b981]/15 border border-[#10b981]/40 flex items-center justify-center text-[#10b981] flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/30 uppercase font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>Audit Ledger Verified</span>
            </div>
            <h3 className="text-lg font-bold font-mono text-[#f1f0eb] mt-0.5">{title}</h3>
          </div>
        </div>

        <p className="text-xs text-[#9ba3a7] leading-relaxed font-sans">
          {subtitle}
        </p>

        {/* Transaction Telemetry Receipt Box */}
        <div className="bg-[#121619] border border-[#242d32] rounded-lg p-3.5 space-y-2.5 font-mono text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#1c2427]">
            <span className="text-[#9ba3a7] text-[11px]">Audit Reference No.</span>
            <span className="text-[#f1f0eb] font-bold">{txHash}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-[#1c2427]">
            <span className="text-[#9ba3a7] text-[11px]">Timestamp</span>
            <span className="text-[#c5c3b8] text-[11px]">{new Date().toLocaleString('en-IN')} IST</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[#9ba3a7] text-[11px]">SHA-256 Fingerprint</span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="inline-flex items-center gap-1 text-[10px] text-[#10b981] hover:underline"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-[#161c20] p-1.5 rounded border border-[#242d32] text-[10px] text-[#10b981] truncate">
              {sha256}
            </div>
          </div>

          {details.map((d, idx) => (
            <div key={idx} className="flex justify-between items-center pt-1 text-[11px]">
              <span className="text-[#9ba3a7]">{d.label}</span>
              <span className="text-[#f1f0eb] font-semibold">{d.value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => {
              if (onAction) onAction();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 bg-[#10b981] hover:bg-[#059669] text-[#121619] text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
