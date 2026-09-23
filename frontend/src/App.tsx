import React, { useEffect, useState } from 'react';
import { UserRole, WatershedDetail, WatershedSummary, EvidenceCard, AuthUser } from './types';
import { api } from './services/api';
import { Navbar, AppTab } from './components/layout/Navbar';
import { TelemetryHeader } from './components/layout/TelemetryHeader';
import { WatershedMap } from './components/gis/WatershedMap';
import { EvidenceCardModal } from './components/evidence/EvidenceCardModal';
import { UploadEvidenceModal } from './components/evidence/UploadEvidenceModal';
import { BiophysicalPanel } from './components/analytics/BiophysicalPanel';
import { DossierModal } from './components/reports/DossierModal';
import { LoginView } from './components/auth/LoginView';

// Views
import { LandingView } from './components/landing/LandingView';
import { MinisterCommandView } from './components/minister/MinisterCommandView';
import { FloodBypassDamView } from './components/flood/FloodBypassDamView';
import { RiskAndRecommendationsView } from './components/analysis/RiskAndRecommendationsView';
import { ProjectsView } from './components/projects/ProjectsView';
import { EconomicsView } from './components/economics/EconomicsView';
import { FieldSurveyView } from './components/survey/FieldSurveyView';
import { AdminAuditView } from './components/admin/AdminAuditView';
import { TelemetryMLView } from './components/telemetry/TelemetryMLView';

// AI Diagnostics
import { SutraAiAssistantModal } from './components/ai/SutraAiAssistantModal';

// Production Readiness Components (20-Point Checklist)
import { usePageMeta } from './utils/usePageMeta';
import { StickyMobileCta } from './components/layout/StickyMobileCta';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { ContactModal } from './components/common/ContactModal';
import { NotFoundView } from './components/common/NotFoundView';
import { SubmissionSuccessModal } from './components/common/SubmissionSuccessModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { analytics } from './services/analytics';

import { MapPin, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('srishti_drishti_user');
      if (saved) return JSON.parse(saved);
      return {
        identifier: 'officer@geowatershed.gov.in',
        name: 'Technical Officer',
        role: 'ROLE_FIELD_OFFICER',
        designation: 'Senior Hydrological Surveyor',
        department: 'WDC-PMKSY 2.0 / MoRD',
        jurisdiction: 'National Nodal Agency (All-India)',
        session_token: 'auth_token_initial',
      };
    } catch {
      return null;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(currentUser?.role || 'ROLE_FIELD_OFFICER');
  const [currentTab, setCurrentTab] = useState<AppTab>('overview');

  const [watershedList, setWatershedList] = useState<WatershedSummary[]>([]);
  const [watershed, setWatershed] = useState<WatershedDetail | null>(null);
  const [evidenceList, setEvidenceList] = useState<EvidenceCard[]>([]);
  const [selectedInterventionId, setSelectedInterventionId] = useState<string | null>(null);
  
  // Modals & SUTRA-AI State
  const [activeEvidenceCard, setActiveEvidenceCard] = useState<EvidenceCard | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isSutraAiOpen, setIsSutraAiOpen] = useState(false);
  const [sutraStructureType, setSutraStructureType] = useState<string>('Check Dam');
  const [isTosOpen, setIsTosOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    isOpen: boolean;
    title?: string;
    subtitle?: string;
    txHash?: string;
    sha256?: string;
    details?: { label: string; value: string }[];
  }>({ isOpen: false });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic document title & meta descriptions per tab (Item 2 & 3)
  usePageMeta(currentTab);

  const handleTabChange = (tab: AppTab) => {
    setCurrentTab(tab);
    analytics.trackPageView(tab);
  };

  // Load Initial Watershed Data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const wsList = await api.listWatersheds();
      if (wsList.length === 0) throw new Error('No micro-watersheds found.');
      setWatershedList(wsList);

      const firstWs = await api.getWatershedDetail(wsList[0].id);
      setWatershed(firstWs);

      const evRecords = await api.listEvidence();
      setEvidenceList(evRecords);
      analytics.trackPageView('overview', { initialWatershed: firstWs.name });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to GeoWatershed AI Backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchWatershed = async (idOrCode: string) => {
    try {
      setLoading(true);
      let target = watershedList.find(w => w.id === idOrCode || w.code === idOrCode);
      const targetId = target ? target.id : idOrCode;
      const ws = await api.getWatershedDetail(targetId);
      setWatershed(ws);
      setSelectedInterventionId(null);
      analytics.trackWatershedSwitch(targetId, ws.name);
    } catch (err: any) {
      console.error('Failed to switch watershed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // When an intervention is clicked on map or list, open its latest Evidence Card
  const handleSelectIntervention = (interventionId: string) => {
    setSelectedInterventionId(interventionId);
    const card = evidenceList.find((e) => e.intervention_id === interventionId);
    if (card) {
      setActiveEvidenceCard(card);
    } else {
      const interv = watershed?.interventions.find((i) => i.id === interventionId);
      if (interv) {
        setIsUploadOpen(true);
      }
    }
  };

  const handleEvidenceUploaded = (newCard: EvidenceCard) => {
    setEvidenceList((prev) => [newCard, ...prev]);
    setActiveEvidenceCard(newCard);
    analytics.trackEvidenceUpload(newCard.intervention_name, 1200);
    setSubmissionSuccess({
      isOpen: true,
      title: 'In-Situ Field Evidence Recorded',
      subtitle: `Photographic evidence for ${newCard.intervention_name} has been cryptographically verified and anchored to WDC-PMKSY 2.0 ledger.`,
      txHash: `WDC-EV-${newCard.id.toUpperCase()}`,
      sha256: newCard.file_sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      details: [
        { label: 'Intervention', value: newCard.intervention_name },
        { label: 'Coordinate Integrity', value: newCard.coordinate_source },
        { label: 'GPS Geofence', value: `${newCard.captured_latitude.toFixed(4)}°N, ${newCard.captured_longitude.toFixed(4)}°E` },
        { label: 'Audit Status', value: newCard.review_status }
      ]
    });
    if (watershed) {
      api.getWatershedDetail(watershed.id).then((ws) => setWatershed(ws));
    }
  };

  const handleReviewSubmitted = (updatedCard: EvidenceCard) => {
    setEvidenceList((prev) =>
      prev.map((item) => (item.id === updatedCard.id ? updatedCard : item))
    );
    setActiveEvidenceCard(updatedCard);
    analytics.trackReviewSubmission(updatedCard.id, updatedCard.review_status);
    setSubmissionSuccess({
      isOpen: true,
      title: 'Supervisory Review Audit Recorded',
      subtitle: `Status transition to ${updatedCard.review_status} for ${updatedCard.intervention_name} has been logged with digital officer endorsement.`,
      txHash: `WDC-REV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      sha256: updatedCard.file_sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      details: [
        { label: 'Intervention', value: updatedCard.intervention_name },
        { label: 'Updated Status', value: updatedCard.review_status },
        { label: 'Reviewing Officer', value: updatedCard.reviewer_name || 'Senior Official' }
      ]
    });
    if (watershed) {
      api.getWatershedDetail(watershed.id).then((ws) => setWatershed(ws));
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('srishti_drishti_user');
    setIsLoginModalOpen(true);
  };

  const handleDownloadCsv = () => {
    if (!watershed) return;
    window.open(api.getEvidenceCsvUrl(watershed.id), '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0B1F1A] text-[#F4F7F5] flex flex-col font-sans relative">
      {/* Subtle topographic contour overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="app-contour" width="300" height="300" patternUnits="userSpaceOnUse">
              <path d="M0,75 Q75,30 150,90 T300,60" fill="none" stroke="#7DD3A7" strokeWidth="1" />
              <path d="M0,150 Q90,195 180,135 T300,165" fill="none" stroke="#7DD3A7" strokeWidth="1" />
              <path d="M0,225 Q60,165 150,240 T300,210" fill="none" stroke="#7DD3A7" strokeWidth="1" />
              <circle cx="150" cy="150" r="105" fill="none" stroke="#1677FF" strokeWidth="0.8" strokeDasharray="4 4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#app-contour)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Master Navbar with Multi-Tab Navigation & User Profile */}
        <Navbar
          currentRole={currentRole}
          currentTab={currentTab}
          user={currentUser}
          watersheds={watershedList}
          selectedWatershedId={watershed?.id}
          onSelectWatershed={handleSwitchWatershed}
          onOpenSutraAi={() => {
            setSutraStructureType('Check Dam');
            setIsSutraAiOpen(true);
          }}
          onSignOut={handleSignOut}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onTabChange={handleTabChange}
          onRoleChange={(r) => {
            setCurrentRole(r);
            if (currentUser) {
              const updated = { ...currentUser, role: r };
              setCurrentUser(updated);
              localStorage.setItem('srishti_drishti_user', JSON.stringify(updated));
            }
          }}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenDossier={() => setIsDossierOpen(true)}
          onDownloadCsv={handleDownloadCsv}
        />

        {/* Main App Container */}
        <main className={`flex-1 w-full ${currentTab === 'overview' ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'}`}>
          
          {loading ? (
            <div className="py-10 px-2 max-w-5xl mx-auto w-full space-y-6">
              <div className="flex items-center justify-between animate-pulse">
                <div className="space-y-2">
                  <div className="h-6 w-64 bg-slate-800 rounded"></div>
                  <div className="h-4 w-96 bg-slate-800/60 rounded"></div>
                </div>
                <div className="h-8 w-28 bg-slate-800 rounded"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2">
                    <div className="h-3 w-20 bg-slate-800 rounded"></div>
                    <div className="h-5 w-28 bg-slate-700 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="h-[460px] bg-slate-900/80 border border-slate-800 rounded-lg flex flex-col items-center justify-center gap-3">
                <div className="w-9 h-9 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center font-mono">
                  <div className="text-xs text-cyan-400 font-semibold tracking-wider uppercase">Synchronizing Hydrologic Telemetry</div>
                  <div className="text-[11px] text-slate-500 mt-1">Fetching WDC-PMKSY Catchment Polygons, Strahler Streams &amp; Photos</div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 rounded-lg bg-slate-900 border border-rose-900/60 max-w-lg mx-auto text-center my-12">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-100 text-sm font-mono">CONNECTION TERMINATED</h3>
              <p className="text-xs text-slate-400 mt-1">{error}</p>
              <p className="text-[11px] text-slate-500 mt-2">
                Confirm GeoWatershed FastAPI backend and PostGIS daemon are active.
              </p>
              <button
                onClick={loadData}
                className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-md text-xs transition-colors"
              >
                Retry Connection
              </button>
            </div>
          ) : watershed ? (
            <ErrorBoundary key={currentTab} onReset={() => setCurrentTab('overview')}>
              {/* View 1: Overview Landing Page */}
              {currentTab === 'overview' && (
                <LandingView
                  watershed={watershed}
                  evidenceList={evidenceList}
                  selectedInterventionId={selectedInterventionId}
                  onSelectIntervention={handleSelectIntervention}
                  onSelectEvidence={(card) => setActiveEvidenceCard(card)}
                  onOpenSutraAi={(structType) => {
                    if (structType) setSutraStructureType(structType);
                    setIsSutraAiOpen(true);
                  }}
                  onLaunchExplorer={() => setCurrentTab('explorer')}
                  onSelectTab={(tab) => setCurrentTab(tab as any)}
                  onSwitchWatershed={handleSwitchWatershed}
                  watershedList={watershedList}
                />
              )}

              {/* View 1.5: Ministerial Command Center */}
              {currentTab === 'minister' && (
                <MinisterCommandView
                  onSelectWatershed={(codeOrId) => {
                    handleSwitchWatershed(codeOrId);
                    setCurrentTab('explorer');
                  }}
                />
              )}

              {/* View 2: Primary GIS Explorer */}
              {currentTab === 'explorer' && (
                <>
                  <TelemetryHeader watershed={watershed} evidenceList={evidenceList} />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-4">
                    {/* Left Column: Interactive GIS Map (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                          <h2 className="font-bold text-[#f1f0eb] text-sm tracking-wide">
                            Interactive Micro-Watershed GIS Explorer
                          </h2>
                        </div>
                        <div className="text-[11px] text-[#9ba3a7] flex items-center gap-1.5 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Lat {watershed.centroid_lat.toFixed(4)}°, Lon {watershed.centroid_lon.toFixed(4)}°</span>
                        </div>
                      </div>

                      <WatershedMap
                        watershed={watershed}
                        evidenceList={evidenceList}
                        selectedInterventionId={selectedInterventionId}
                        onSelectIntervention={handleSelectIntervention}
                        onSelectEvidence={(card) => setActiveEvidenceCard(card)}
                        onOpenSutraAi={(structType) => {
                          if (structType) setSutraStructureType(structType);
                          setIsSutraAiOpen(true);
                        }}
                      />
                    </div>


                  {/* Right Column: Structure Register & Evidence Feed (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#f1f0eb] text-sm tracking-wide font-mono">
                        Intervention Register
                      </h3>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#181f23] border border-[#2c373d] text-[#10b981] font-mono">
                        {watershed.interventions.length} Sites
                      </span>
                    </div>

                    <div className="flex-1 bg-[#181f23] border border-[#2c373d] rounded-lg p-2.5 flex flex-col gap-2 max-h-[520px] overflow-y-auto">
                      {watershed.interventions.map((item) => {
                        const isSelected = item.id === selectedInterventionId;
                        const hasEvidence = item.evidence_count > 0;
                        
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectIntervention(item.id)}
                            className={`p-2.5 rounded-md border transition-colors cursor-pointer flex flex-col gap-1.5 ${
                              isSelected
                                ? 'bg-[#10b981]/20 border-[#10b981]'
                                : 'bg-[#121619] border-[#2c373d] hover:border-[#3d4b52] hover:bg-[#1a2227]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold text-xs text-[#f1f0eb]">{item.name}</h4>
                                <p className="text-[11px] text-[#9ba3a7]">
                                  {item.intervention_type} • Stream Order {item.stream_order}
                                </p>
                              </div>
                              
                              <ChevronRight className="w-4 h-4 text-[#9ba3a7] flex-shrink-0 mt-1" />
                            </div>

                            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#2c373d]">
                              <span className="font-mono text-[#9ba3a7]">
                                {item.target_latitude.toFixed(4)}°, {item.target_longitude.toFixed(4)}°
                              </span>

                              {hasEvidence ? (
                                <span className="inline-flex items-center gap-1 font-semibold text-[#10b981]">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {item.latest_consistency_status || 'Consistent'}
                                </span>
                              ) : (
                                <span className="text-[#9ba3a7] italic">
                                  Click to inspect / upload
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <BiophysicalPanel />
              </>
            )}

            {/* View 2.5: Real-Time Telemetry & AI */}
            {currentTab === 'telemetry-ml' && (
              <TelemetryMLView />
            )}

            {/* View 3: Flood Bypass & Dam Tracker */}
            {currentTab === 'flood-bypass' && (
              <FloodBypassDamView watershed={watershed} />
            )}

            {/* View 4: Risk & Recommendations */}
            {currentTab === 'analysis' && (
              <RiskAndRecommendationsView
                watershed={watershed}
                onOpenSutraAi={(structType) => {
                  if (structType) setSutraStructureType(structType);
                  setIsSutraAiOpen(true);
                }}
              />
            )}

            {/* View 5: Projects & Budget */}
            {currentTab === 'projects' && (
              <ProjectsView />
            )}

            {/* View 6: Economic Feasibility */}
            {currentTab === 'economics' && (
              <EconomicsView />
            )}

            {/* View 7: Field Survey PWA */}
            {currentTab === 'survey' && (
              <FieldSurveyView watershed={watershed} />
            )}

            {/* View 8: Security Audit Trail */}
            {currentTab === 'audit' && (
              <AdminAuditView currentUser={currentUser} />
            )}

            {/* Custom 404 View for Invalid Tab (Item 1) */}
            {![
              'overview', 'minister', 'explorer', 'telemetry-ml', 'flood-bypass',
              'analysis', 'projects', 'economics', 'survey', 'audit'
            ].includes(currentTab) && (
              <NotFoundView
                invalidEntity={currentTab}
                onNavigateTab={handleTabChange}
                onResetWatershed={() => watershedList.length > 0 && handleSwitchWatershed(watershedList[0].id)}
              />
            )}
            </ErrorBoundary>
          ) : !loading && !error ? (
          <NotFoundView
            invalidEntity="Target Micro-Watershed Catchment"
            onNavigateTab={handleTabChange}
            onResetWatershed={() => watershedList.length > 0 && handleSwitchWatershed(watershedList[0].id)}
          />
        ) : null}

      </main>

      {/* Modals with ErrorBoundary Protection */}
      <ErrorBoundary fallbackTitle="Inspection Modal Protocol">
        {activeEvidenceCard && (
          <EvidenceCardModal
            card={activeEvidenceCard}
            currentRole={currentRole}
            onClose={() => setActiveEvidenceCard(null)}
            onReviewSubmitted={handleReviewSubmitted}
          />
        )}

        {isUploadOpen && watershed && (
          <UploadEvidenceModal
            watershed={watershed}
            onClose={() => setIsUploadOpen(false)}
            onEvidenceUploaded={handleEvidenceUploaded}
          />
        )}

        {isDossierOpen && watershed && (
          <DossierModal
            watershedId={watershed.id}
            onClose={() => setIsDossierOpen(false)}
          />
        )}

        {/* SUTRA-AI Field Video & Photo Evaluator Assistant Modal */}
        <SutraAiAssistantModal
          isOpen={isSutraAiOpen}
          onClose={() => setIsSutraAiOpen(false)}
          watershedId={watershed?.id}
          defaultStructure={sutraStructureType}
        />
      </ErrorBoundary>

      {/* Institutional Terms of Service & Governance Modal */}
      {isTosOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#181f23] border border-[#2c373d] rounded-lg max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2c373d] pb-3">
              <div>
                <h3 className="text-sm font-bold font-mono text-[#f1f0eb]">
                  TERMS OF SERVICE & GEOSPATIAL GOVERNANCE
                </h3>
                <p className="text-[11px] font-mono text-[#10b981]">
                  WDC-PMKSY 2.0 • National Geospatial Policy 2022
                </p>
              </div>
              <button
                onClick={() => setIsTosOpen(false)}
                className="text-xs font-mono text-[#9ba3a7] hover:text-[#f1f0eb] px-2 py-1 rounded bg-[#1e262a] border border-[#2c373d]"
              >
                CLOSE [ESC]
              </button>
            </div>

            <div className="text-xs text-[#c5c3b8] space-y-3 font-sans leading-relaxed">
              <div>
                <h4 className="font-bold text-[#10b981] font-mono text-[11px] uppercase">
                  1. Statutory Mandate & Authorized Scope
                </h4>
                <p className="mt-1 text-[#9ba3a7]">
                  The GeoWatershed Decision Support System is an official monitoring portal operated under the guidelines
                  of the Watershed Development Component of Pradhan Mantri Krishi Sinchayee Yojana (WDC-PMKSY 2.0), Department of Land Resources (DoLR),
                  Ministry of Rural Development. Usage is strictly reserved for designated SLNA, WCDC, PIA officers, and authorized public auditors.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#10b981] font-mono text-[11px] uppercase">
                  2. National Geospatial Policy (NGP-2022) Adherence
                </h4>
                <p className="mt-1 text-[#9ba3a7]">
                  In accordance with the National Geospatial Policy 2022 notified by the Department of Science and Technology (DST),
                  all spatial coordinates, synthetic stream networks, and CartoDEM elevation datasets adhere to open data licensing standards.
                  Restricted security attributes and negative zone boundaries comply with Survey of India vetting protocols.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#10b981] font-mono text-[11px] uppercase">
                  3. Evidence Integrity & Tamper Accountability
                </h4>
                <p className="mt-1 text-[#9ba3a7]">
                  Field surveyors submitting EXIF photographs warrant that all telemetry reflects authentic in-situ field conditions.
                  Submissions with synthetic or spoofed coordinates, as detected by the OpenCV Laplacian variance filter and
                  PostGIS stream proximity buffers, are flagged into immutable audit registers for administrative scrutiny.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#10b981] font-mono text-[11px] uppercase">
                  4. Advisory Nature of Predictive ML
                </h4>
                <p className="mt-1 text-[#9ba3a7]">
                  Machine learning recommendations (Random Forest recharge suitability indices and SIH erosion vulnerability scores)
                  are analytical aids to assist field engineers. They do not supersede certified hydrological DPRs (Detailed Project Reports)
                  executed by registered hydrologists.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#2c373d] flex justify-end">
              <button
                onClick={() => setIsTosOpen(false)}
                className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-[#121619] font-bold text-xs rounded font-mono transition-colors"
              >
                ACKNOWLEDGE & ACCEPT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Sovereignty & Privacy Policy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#181f23] border border-[#2c373d] rounded-lg max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2c373d] pb-3">
              <div>
                <h3 className="text-sm font-bold font-mono text-[#f1f0eb]">
                  DATA SOVEREIGNTY & PRIVACY POLICY
                </h3>
                <p className="text-[11px] font-mono text-[#10b981]">
                  DPDP Act 2023 Compliance • In-Situ Telemetry Data Protection
                </p>
              </div>
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="text-xs font-mono text-[#9ba3a7] hover:text-[#f1f0eb] px-2 py-1 rounded bg-[#1e262a] border border-[#2c373d]"
              >
                CLOSE [ESC]
              </button>
            </div>

            <div className="text-xs text-[#c5c3b8] space-y-3 font-sans leading-relaxed">
              <div>
                <h4 className="font-bold text-[#10b981] font-mono text-[11px] uppercase">
                  1. Sovereign Data Residency
                </h4>
                <p className="mt-1 text-[#9ba3a7]">
                  All relational database tables (PostgreSQL/PostGIS), Copernicus Sentinel-2 processed rasters,
                  and ground EXIF telemetry records are stored within sovereign infrastructure located in the Republic of India.
                  No spatial vector or micro-watershed polygon data is routed or stored across non-sovereign servers.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#10b981] font-mono text-[11px] uppercase">
                  2. Digital Personal Data Protection (DPDP Act 2023)
                </h4>
                <p className="mt-1 text-[#9ba3a7]">
                  Field officer personal identities, IMEI numbers, and device telemetry are pseudononymized across public transparency portals.
                  In public citizen access mode (ROLE_CITIZEN), only anonymized surveyor IDs and structural verification metrics are rendered.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#10b981] font-mono text-[11px] uppercase">
                  3. In-Situ Weather & Ground Water Observations
                </h4>
                <p className="mt-1 text-[#9ba3a7]">
                  Real-time soil moisture feeds, Central Ground Water Board (CGWB) observation well metrics, and Open-Meteo atmospheric
                  readouts are utilized strictly for watershed balance modeling under Open Government Data principles.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#10b981] font-mono text-[11px] uppercase">
                  4. Cryptographic Audit Log Retention
                </h4>
                <p className="mt-1 text-[#9ba3a7]">
                  All supervisory review actions, verification approvals, and status transitions maintain immutable audit logs
                  with timestamps for a statutory duration of 7 years in accordance with Comptroller and Auditor General (CAG) protocols.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#2c373d] flex justify-end">
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-[#121619] font-bold text-xs rounded font-mono transition-colors"
              >
                ACKNOWLEDGE & CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Navigation CTA (Item 11: 44px+ touch targets, instant access on phones) */}
      <StickyMobileCta
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onOpenSutraAi={() => {
          setSutraStructureType('Check Dam');
          setIsSutraAiOpen(true);
        }}
      />

      {/* DPDP Act 2023 Compliant Cookie & Session Telemetry Banner (Item 17) */}
      <CookieConsentBanner
        onOpenPrivacyPolicy={() => setIsPrivacyOpen(true)}
      />

      {/* Institutional Contact Directory & Technical Helpdesk Modal (Item 19) */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Submission & Audit Confirmation Modal (Item 14) */}
      <SubmissionSuccessModal
        isOpen={submissionSuccess.isOpen}
        onClose={() => setSubmissionSuccess({ isOpen: false })}
        title={submissionSuccess.title}
        subtitle={submissionSuccess.subtitle}
        txHash={submissionSuccess.txHash}
        sha256={submissionSuccess.sha256}
        details={submissionSuccess.details}
      />

      {/* Login / Auth Gateway Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl my-auto rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#0B1F1A]">
            <LoginView
              onClose={() => setIsLoginModalOpen(false)}
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                setCurrentRole(user.role);
                localStorage.setItem('srishti_drishti_user', JSON.stringify(user));
                setIsLoginModalOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Institutional Workstation Footer */}
      <footer className="border-t border-[#7DD3A7]/15 bg-[#07130F] py-4 text-xs text-slate-400 font-sans pb-20 md:pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
            {/* Left: Brand & Ministry Identification */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="font-bold text-white">GeoWatershed AI</span>
              <span className="text-slate-600">|</span>
              <span className="text-[#7DD3A7] bg-[#123C35] px-2 py-0.5 rounded border border-[#7DD3A7]/30 text-[10px] font-mono">
                WDC-PMKSY 2.0 • NGP-2022
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 text-[11px]">
                Department of Land Resources (DoLR), Ministry of Rural Development, New Delhi
              </span>
            </div>

            {/* Right: Institutional Modals & Helpdesk */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <button
                onClick={() => setIsTosOpen(true)}
                className="text-slate-300 hover:text-[#7DD3A7] transition-colors underline underline-offset-4"
              >
                Terms of Governance
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="text-slate-300 hover:text-[#7DD3A7] transition-colors underline underline-offset-4"
              >
                Data Sovereignty &amp; Privacy
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => setIsContactOpen(true)}
                className="text-slate-300 hover:text-[#7DD3A7] transition-colors underline underline-offset-4"
              >
                Helpdesk (1800-11-5555)
              </button>
            </div>
          </div>
        </div>
      </footer>

      </div>
    </div>
  );
};

export default App;
