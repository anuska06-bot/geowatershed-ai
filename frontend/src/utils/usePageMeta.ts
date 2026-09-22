import { useEffect } from 'react';
import { AppTab } from '../components/layout/Navbar';

export const TAB_META: Record<AppTab, { title: string; description: string }> = {
  overview: {
    title: 'Dossier Overview & Catchment Vitals | GeoWatershed AI',
    description: 'National overview of micro-watershed catchments, Strahler stream order validation, and PMKSY project KPIs.'
  },
  minister: {
    title: 'Ministerial Command & Executive Intelligence | GeoWatershed AI',
    description: 'High-level executive dashboard for the Hon. Field Minister and Project Directors under WDC-PMKSY 2.0.'
  },
  explorer: {
    title: 'GIS Workstation & Spatial Evidence | GeoWatershed AI',
    description: 'Interactive GIS mapping workspace with topographic contours, hydrological drainage networks, and tamper-proof evidence markers.'
  },
  'telemetry-ml': {
    title: 'ML Telemetry & Predictive Models | GeoWatershed AI',
    description: 'Real-time soil moisture sensors, Sentinel-2 NDVI vegetative indices, and groundwater recharge suitability modeling.'
  },
  'before-after': {
    title: 'Temporal Differential & Impact Forensics | GeoWatershed AI',
    description: 'Pre and post-monsoon comparative satellite imagery verifying physical recharge structure interventions.'
  },
  analysis: {
    title: 'Hydrologic Risk Alerts & Rainfall Stress | GeoWatershed AI',
    description: 'Dynamic cloudburst stress simulator (20-120 mm/hr), flash flood hazard screening, and remedial engineering recommendations.'
  },
  projects: {
    title: 'Interventions & Fiscal Budget Ledger | GeoWatershed AI',
    description: 'Comprehensive breakdown of approved soil and water conservation structures, physical progress, and financial disbursements.'
  },
  economics: {
    title: 'Benefit-Cost Analysis & Economic Returns | GeoWatershed AI',
    description: 'Macro-economic benefit-cost modeling, NPV projections, and agricultural yield delta estimations for DPR audit.'
  },
  survey: {
    title: 'Field Surveyor PWA & In-Situ Geotagging | GeoWatershed AI',
    description: 'Offline-first handheld mobile progressive web app for field survey teams capturing EXIF-validated evidence.'
  },
  audit: {
    title: 'Audit Trail & Statutory Compliance | GeoWatershed AI',
    description: 'Immutable cryptographic verification logs, SHA-256 integrity ledger, and supervisor approval trails.'
  }
};

export const usePageMeta = (tab: AppTab) => {
  useEffect(() => {
    const meta = TAB_META[tab] || {
      title: 'GeoWatershed AI — Smart Geospatial Intelligence for Watershed Development',
      description: 'Smart Geospatial Intelligence for Watershed Development under WDC-PMKSY 2.0.'
    };

    // Update document title
    document.title = `${meta.title}`;

    // Update or create meta description tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', meta.description);

    // Update Open Graph tags dynamically
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

  }, [tab]);
};
