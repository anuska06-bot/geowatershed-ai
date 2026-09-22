import { WatershedSummary, WatershedDetail, EvidenceCard, DossierSummary } from '../types';

const API_BASE = (typeof window !== 'undefined' && (window as any).__API_BASE__)
  ? (window as any).__API_BASE__
  : ((import.meta as any).env?.VITE_API_URL
      ? `${(import.meta as any).env.VITE_API_URL.replace(/\/$/, '')}/api/v1`
      : '/api/v1');

export const api = {
  async listWatersheds(): Promise<WatershedSummary[]> {
    const res = await fetch(`${API_BASE}/watersheds`);
    if (!res.ok) throw new Error('Failed to fetch watersheds');
    return res.json();
  },

  async getWatershedDetail(id: string): Promise<WatershedDetail> {
    const res = await fetch(`${API_BASE}/watersheds/${id}`);
    if (!res.ok) throw new Error('Failed to fetch watershed details');
    return res.json();
  },

  async listEvidence(interventionId?: string): Promise<EvidenceCard[]> {
    const url = interventionId 
      ? `${API_BASE}/evidence?intervention_id=${interventionId}`
      : `${API_BASE}/evidence`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch evidence cards');
    return res.json();
  },

  async getEvidenceCard(id: string): Promise<EvidenceCard> {
    const res = await fetch(`${API_BASE}/evidence/${id}`);
    if (!res.ok) throw new Error('Failed to fetch evidence card');
    return res.json();
  },

  async uploadEvidence(formData: FormData): Promise<EvidenceCard> {
    const res = await fetch(`${API_BASE}/evidence/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Upload failed');
    }
    return res.json();
  },

  async submitReview(
    evidenceId: string,
    payload: { review_status: string; reviewer_name: string; reviewer_notes: string }
  ): Promise<EvidenceCard> {
    const res = await fetch(`${API_BASE}/evidence/${evidenceId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  async getDossier(watershedId: string): Promise<DossierSummary> {
    const res = await fetch(`${API_BASE}/reports/dossier/${watershedId}`);
    if (!res.ok) throw new Error('Failed to fetch dossier');
    return res.json();
  },

  getEvidenceCsvUrl(watershedId: string): string {
    return `${API_BASE}/reports/evidence.csv?watershed_id=${watershedId}`;
  },

  async register(payload: {
    name: string;
    identifier: string;
    password: string;
    role?: string;
    jurisdiction?: string;
    organization?: string;
  }): Promise<{ success: boolean; message: string; token: string; user: any }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  },

  async loginWithPassword(identifier: string, password: string): Promise<{ success: boolean; message: string; token: string; user: any }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  },

  async requestOtp(identifier: string, channel: 'email' | 'sms' = 'email'): Promise<{ success: boolean; message: string; identifier: string; channel: string; expires_in_seconds: number; debug_otp?: string }> {
    const res = await fetch(`${API_BASE}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, channel }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to request OTP' }));
      throw new Error(err.detail || 'Failed to request OTP');
    }
    return res.json();
  },

  async verifyOtp(identifier: string, otp: string): Promise<{ success: boolean; message: string; token: string; user: any }> {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, code: otp }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
      throw new Error(err.detail || 'Authentication failed');
    }
    return res.json();
  },

  async demoLogin(role: string = 'ROLE_FIELD_OFFICER'): Promise<{ success: boolean; message: string; token: string; user: any }> {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Demo login failed' }));
      throw new Error(err.detail || 'Demo login failed');
    }
    return res.json();
  },

  async getCurrentUser(token: string): Promise<{ success: boolean; user: any }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Invalid or expired session');
    return res.json();
  },

  async getNationalSummary(): Promise<any> {
    const res = await fetch(`${API_BASE}/watersheds/national-summary`);
    if (!res.ok) throw new Error('Failed to fetch national summary');
    return res.json();
  },

  async analyzeSutraMedia(formData: FormData): Promise<any> {
    const res = await fetch(`${API_BASE}/sutra-ai/analyze-media`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Media analysis failed' }));
      throw new Error(err.detail || 'Media analysis failed');
    }
    return res.json();
  },

  async askSutraAi(query: string, watershedId?: string, structureType?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/sutra-ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, watershed_id: watershedId, structure_type: structureType }),
    });
    if (!res.ok) throw new Error('SUTRA-AI query failed');
    return res.json();
  },

  async getHealthScore(watershedId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/analysis/health-score/${watershedId}`);
    if (!res.ok) throw new Error('Failed to fetch health score');
    return res.json();
  },

  async getRiskScreening(watershedId: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/analysis/risk-screening/${watershedId}`);
    if (!res.ok) throw new Error('Failed to fetch risk screening');
    return res.json();
  },

  async getRecommendations(watershedId: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/analysis/recommendations/${watershedId}`);
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  }
};


