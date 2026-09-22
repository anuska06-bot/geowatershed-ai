/**
 * GeoWatershed AI - Client Telemetry & Analytics Service
 * Compliant with Digital Personal Data Protection (DPDP) Act 2023.
 * No external trackers; logs privacy-safe operational telemetry for portal reliability and auditing.
 */

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: string;
}

class AnalyticsService {
  private enabled: boolean = true;
  private log: AnalyticsEvent[] = [];

  constructor() {
    this.checkConsent();
  }

  public checkConsent() {
    try {
      const consent = localStorage.getItem('geowatershed_cookie_consent');
      if (consent) {
        const parsed = JSON.parse(consent);
        this.enabled = parsed.analytics !== false;
      }
    } catch {
      this.enabled = true;
    }
  }

  public setConsent(analyticsAllowed: boolean) {
    this.enabled = analyticsAllowed;
    try {
      localStorage.setItem('geowatershed_cookie_consent', JSON.stringify({
        essential: true,
        analytics: analyticsAllowed,
        timestamp: new Date().toISOString()
      }));
    } catch {
      // Ignore local storage error
    }
  }

  public trackPageView(pageName: string, meta?: Record<string, any>) {
    if (!this.enabled) return;
    const event: AnalyticsEvent = {
      category: 'Navigation',
      action: 'view_page',
      label: pageName,
      timestamp: new Date().toISOString()
    };
    this.logEvent(event);
    if (typeof window !== 'undefined' && (window as any).__GEO_DEBUG__) {
      console.debug('[Analytics Telemetry] Page View:', pageName, meta);
    }
  }

  public trackEvent(category: string, action: string, label?: string, value?: number) {
    if (!this.enabled) return;
    const event: AnalyticsEvent = {
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString()
    };
    this.logEvent(event);
    if (typeof window !== 'undefined' && (window as any).__GEO_DEBUG__) {
      console.debug('[Analytics Telemetry] Event:', event);
    }
  }

  public trackWatershedSwitch(watershedId: string, name: string) {
    this.trackEvent('GIS_Workstation', 'switch_watershed', `${name} (${watershedId})`);
  }

  public trackSutraAiQuery(structureType: string, queryLength: number) {
    this.trackEvent('SUTRA_AI', 'diagnostic_query', structureType, queryLength);
  }

  public trackEvidenceUpload(structureType: string, fileSizeKb: number) {
    this.trackEvent('Field_Survey', 'evidence_upload', structureType, fileSizeKb);
  }

  public trackReviewSubmission(evidenceId: string, status: string) {
    this.trackEvent('Audit_Review', 'submit_review', `${evidenceId}:${status}`);
  }

  private logEvent(event: AnalyticsEvent) {
    this.log.push(event);
    if (this.log.length > 100) {
      this.log.shift(); // Keep recent 100 events in circular memory
    }
  }

  public getEventHistory(): AnalyticsEvent[] {
    return [...this.log];
  }
}

export const analytics = new AnalyticsService();
