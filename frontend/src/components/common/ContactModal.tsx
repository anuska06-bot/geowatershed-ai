import React from 'react';
import { Building2, Phone, Mail, MapPin, ShieldCheck, X } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#181f23] border border-[#2c373d] rounded-xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9ba3a7] hover:text-[#f1f0eb] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-[#10b981]/15 border border-[#10b981]/40 flex items-center justify-center text-[#10b981] flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/30 uppercase font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>National Nodal Directory</span>
            </div>
            <h3 className="text-base font-bold font-mono text-[#f1f0eb] mt-0.5">
              Institutional Contact &amp; Helpdesk
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#9ba3a7] leading-relaxed font-sans">
          For technical anomalies in stream topology, field telemetry verification disputes, or WDC-PMKSY 2.0 DPR sanction queries, reach out to the designated authorities below.
        </p>

        <div className="space-y-3 font-mono text-xs">
          {/* Headquarters */}
          <div className="p-3 bg-[#121619] border border-[#242d32] rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-[#10b981] font-bold text-[11px] uppercase">
              <MapPin className="w-3.5 h-3.5" />
              <span>Headquarters (DoLR)</span>
            </div>
            <p className="text-[#f1f0eb] font-sans text-xs">Department of Land Resources, Ministry of Rural Development</p>
            <p className="text-[#9ba3a7] font-sans text-[11px]">NBO Building, Nirman Bhawan, Maulana Azad Road, New Delhi - 110011</p>
          </div>

          {/* Technical Center */}
          <div className="p-3 bg-[#121619] border border-[#242d32] rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-[#10b981] font-bold text-[11px] uppercase">
              <Building2 className="w-3.5 h-3.5" />
              <span>Geospatial Technical Division (NIC)</span>
            </div>
            <p className="text-[#f1f0eb] font-sans text-xs">National Informatics Centre (NIC) Spatial Services Cell</p>
            <p className="text-[#9ba3a7] font-sans text-[11px]">A-Block, CGO Complex, Lodhi Road, New Delhi - 110003</p>
          </div>

          {/* Helplines & Support */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-[#121619] border border-[#242d32] rounded-lg">
              <div className="flex items-center gap-1.5 text-[#10b981] text-[11px] font-semibold mb-1">
                <Phone className="w-3.5 h-3.5" />
                <span>Toll-Free Helpline</span>
              </div>
              <p className="text-[#f1f0eb] font-bold text-xs">1800-11-5555</p>
              <p className="text-[#9ba3a7] text-[10px] mt-0.5 font-sans">09:30 - 18:00 IST (Mon-Sat)</p>
            </div>

            <div className="p-3 bg-[#121619] border border-[#242d32] rounded-lg">
              <div className="flex items-center gap-1.5 text-[#10b981] text-[11px] font-semibold mb-1">
                <Mail className="w-3.5 h-3.5" />
                <span>Officer Support Desk</span>
              </div>
              <p className="text-[#f1f0eb] font-bold text-[11px] truncate">support-wdc@nic.in</p>
              <p className="text-[#9ba3a7] text-[10px] mt-0.5 font-sans">Grievance &amp; Bug Escalations</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-[#242d32] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-[#121619] font-bold text-xs rounded font-mono transition-colors"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
