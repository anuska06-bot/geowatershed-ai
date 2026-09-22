import React from 'react';
import { WatershedDetail, EvidenceCard } from '../../types';
import { MapPin, CheckCircle, AlertTriangle, ShieldCheck, Droplet, Camera } from 'lucide-react';

interface TelemetryHeaderProps {
  watershed: WatershedDetail | null;
  evidenceList: EvidenceCard[];
}

const StatCard: React.FC<{
  label: string;
  value: React.ReactNode;
  suffix?: string;
  icon: React.ReactNode;
  footer: React.ReactNode;
  footerClass?: string;
  className?: string;
}> = ({ label, value, suffix, icon, footer, footerClass = 'text-slate-400', className = '' }) => (
  <div className={`panel p-3.5 hover:border-slate-700 transition-colors ${className}`}>
    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
      <span>{label}</span>
      <span>{icon}</span>
    </div>
    <div className="flex items-baseline gap-1.5">
      <span className="text-xl font-bold tracking-tight text-slate-50 font-mono">{value}</span>
      {suffix && <span className="text-xs text-slate-400">{suffix}</span>}
    </div>
    <p className={`text-[11px] mt-1 truncate ${footerClass}`}>{footer}</p>
  </div>
);

export const TelemetryHeader: React.FC<TelemetryHeaderProps> = ({ watershed, evidenceList }) => {
  if (!watershed) return null;

  const totalPhotos = evidenceList.length;
  const consistentCount = evidenceList.filter((e) => e.consistency.status === 'Consistent').length;
  const reviewedCount = evidenceList.filter((e) => e.review_status === 'Reviewed').length;
  const consistencyRate = totalPhotos > 0 ? Math.round((consistentCount / totalPhotos) * 100) : 100;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 animate-fade-up">

      <StatCard
        label="Catchment Area"
        value={watershed.area_hectares.toLocaleString()}
        suffix="ha"
        icon={<MapPin className="w-3.5 h-3.5 text-slate-400" />}
        footer={`${watershed.district}, ${watershed.state}`}
      />

      <StatCard
        label="Monitored Assets"
        value={watershed.interventions.length}
        suffix="sites"
        icon={<Droplet className="w-3.5 h-3.5 text-slate-400" />}
        footer="Check dams & recharge pits"
      />

      <StatCard
        label="Verified Surveys"
        value={totalPhotos}
        suffix="records"
        icon={<Camera className="w-3.5 h-3.5 text-slate-400" />}
        footer="EXIF GPS & stream validation"
      />

      <StatCard
        label="Stream Alignment"
        value={`${consistencyRate}%`}
        icon={
          consistencyRate >= 90 ? (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          )
        }
        footer="Within 50m stream buffer"
        footerClass={consistencyRate >= 90 ? 'text-emerald-400 font-mono' : 'text-amber-400 font-mono'}
      />

      <StatCard
        label="Analyst Review"
        value={reviewedCount}
        suffix={`/ ${totalPhotos}`}
        icon={<ShieldCheck className="w-3.5 h-3.5 text-slate-400" />}
        footer="Hydrological validation sign-off"
        className="col-span-2 md:col-span-1"
      />

    </div>
  );
};
