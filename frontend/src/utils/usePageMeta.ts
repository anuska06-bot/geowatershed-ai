import { useEffect } from 'react';
import { AppTab } from '../components/layout/Navbar';

export const TAB_META: Record<AppTab, { title: string; description: string }> = {
  dashboard: {
    title: 'Executive Dashboard & Watershed Vitals | GeoWatershed AI',
    description: 'National overview of monitored watershed catchments, active interventions, recent geo-coded field photography, and priority alerts.'
  },
  explorer: {
    title: 'Interactive GIS Workstation & Layers | GeoWatershed AI',
    description: 'Professional GIS interface with CartoDEM 30m, D8 flow routing, Strahler stream orders, and tamper-proof evidence markers.'
  },
  'image-intelligence': {
    title: 'Geo-Coded Image Intelligence & Interpretation | GeoWatershed AI',
    description: 'AI-assisted interpretation of geo-coded field photographs across 11 watershed intervention and erosion classes.'
  },
  analysis: {
    title: 'Watershed Terrain & Runoff Analysis | GeoWatershed AI',
    description: 'Transparent hydrological pipeline: CartoDEM elevation, slope gradients, D8 flow accumulation, and watershed priority scoring.'
  },
  'change-detection': {
    title: 'Multi-Spectral Change Detection & Temporal Audit | GeoWatershed AI',
    description: 'Sentinel-2 NDVI vegetation index and NDWI water persistence comparing pre-intervention baseline against operational status.'
  },
  interventions: {
    title: 'Structured Interventions & Works Registry | GeoWatershed AI',
    description: 'Comprehensive inventory of soil, water, and drainage conservation structures with geotagged inspection history and satellite audit.'
  },
  recommendations: {
    title: 'AI Recommendations, Siting & Cost Estimation | GeoWatershed AI',
    description: 'Algorithmic decision support for optimal siting of check dams, farm ponds, contour bunds, and diversion drains with bill of quantities.'
  },
  reports: {
    title: 'Automated 15-Point Watershed Outcome Dossier | GeoWatershed AI',
    description: 'Statutory outcome assessment report covering terrain, remote sensing, intervention inventory, and field validation protocols.'
  },
  methodology: {
    title: 'Data Lineage & Scientific Transparency | GeoWatershed AI',
    description: 'Explicit disclosure of all geospatial layers, satellite surface reflectance inputs, terrain models, and demonstration classifiers.'
  },
  survey: {
    title: 'Field Surveyor Mobile PWA & In-Situ Geotagging | GeoWatershed AI',
    description: 'Mobile progressive web app for field survey teams capturing EXIF-validated evidence with offline local storage.'
  },
  overview: {
    title: 'Platform Showcase & Science Story | GeoWatershed AI',
    description: 'National overview of micro-watershed catchments, Strahler stream order validation, and PMKSY project KPIs.'
  },
  minister: {
    title: 'Ministerial Command & Executive Intelligence | GeoWatershed AI',
    description: 'High-level executive dashboard for the Hon. Field Minister and Project Directors under WDC-PMKSY 2.0.'
  },
  'telemetry-ml': {
    title: 'ML Telemetry & Predictive Models | GeoWatershed AI',
    description: 'Real-time soil moisture sensors, Sentinel-2 NDVI vegetative indices, and groundwater recharge suitability modeling.'
  },
  'flood-bypass': {
    title: 'Flood Bypass & Dam Tracker | GeoWatershed AI',
    description: 'Terrain flood risk evaluation, dual-channel drainage routing, and cost-effective local material recommendations.'
  },
  projects: {
    title: 'Interventions & Fiscal Budget Ledger | GeoWatershed AI',
    description: 'Comprehensive breakdown of approved soil and water conservation structures, physical progress, and financial disbursements.'
  },
  economics: {
    title: 'Benefit-Cost Analysis & Economic Returns | GeoWatershed AI',
    description: 'Macro-economic benefit-cost modeling, NPV projections, and agricultural yield delta estimations for DPR audit.'
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
