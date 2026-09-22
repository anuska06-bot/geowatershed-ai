import React, { useEffect, useRef, useState } from 'react';
import { WatershedDetail, EvidenceCard } from '../../types';
import { api } from '../../services/api';
import L from 'leaflet';
import { Layers, Eye, EyeOff, Camera, Maximize2, Droplets, Compass } from 'lucide-react';

interface WatershedMapProps {
  watershed: WatershedDetail;
  evidenceList?: EvidenceCard[];
  selectedInterventionId: string | null;
  onSelectIntervention: (id: string) => void;
  onSelectEvidence?: (card: EvidenceCard) => void;
  onOpenSutraAi?: (structureType?: string) => void;
}


interface BasemapOption {
  name: string;
  url: string;
  attribution: string;
  subdomains?: string;
  maxNativeZoom: number;
  maxZoom: number;
}

const BASEMAPS: Record<'satellite' | 'dark' | 'topo', BasemapOption> = {
  satellite: {
    name: 'Satellite Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics, USDA, USGS',
    maxNativeZoom: 18,
    maxZoom: 19,
  },
  dark: {
    name: 'Carto Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap',
    subdomains: 'abcd',
    maxNativeZoom: 19,
    maxZoom: 19,
  },
  topo: {
    name: 'Carto Positron',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap',
    subdomains: 'abcd',
    maxNativeZoom: 19,
    maxZoom: 19,
  }
};

export const WatershedMap: React.FC<WatershedMapProps> = ({
  watershed,
  evidenceList = [],
  selectedInterventionId,
  onSelectIntervention,
  onSelectEvidence,
  onOpenSutraAi,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  
  // Layer References
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const boundaryLayerRef = useRef<L.GeoJSON | null>(null);
  const drainageLayerRef = useRef<L.GeoJSON | null>(null);
  const lulcLayerRef = useRef<L.LayerGroup | null>(null);
  const erosionHazardLayerRef = useRef<L.LayerGroup | null>(null);
  const photosLayerRef = useRef<L.LayerGroup | null>(null);
  const interventionsLayerRef = useRef<L.LayerGroup | null>(null);
  const lakesLayerRef = useRef<L.LayerGroup | null>(null);

  // Thematic Layer Switches
  const [activeBasemap, setActiveBasemap] = useState<'satellite' | 'dark' | 'topo'>('satellite');
  const [showBoundary, setShowBoundary] = useState(true);
  const [showDrainage, setShowDrainage] = useState(true);
  const [showLakes, setShowLakes] = useState(true);
  const [showLulc, setShowLulc] = useState(false);
  const [showErosionHazard, setShowErosionHazard] = useState(false);
  const [showSurveyPhotos, setShowSurveyPhotos] = useState(true);
  const [showInterventions, setShowInterventions] = useState(true);
  const [riskAlertZones, setRiskAlertZones] = useState<any[]>([]);

  useEffect(() => {
    if (watershed?.id) {
      api.getRiskScreening(watershed.id)
        .then((data) => setRiskAlertZones(data || []))
        .catch((err) => console.error("Failed to load risk screening zones:", err));
    }
  }, [watershed?.id]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [watershed.centroid_lat, watershed.centroid_lon],
      zoom: 14,
      minZoom: 4,
      maxZoom: 19,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer with maxNativeZoom to eliminate "Metadata not available" tiles
    const cfg = BASEMAPS[activeBasemap];
    const tileLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      subdomains: cfg.subdomains || 'abc',
      maxNativeZoom: cfg.maxNativeZoom,
      maxZoom: cfg.maxZoom,
    }).addTo(map);
    baseTileLayerRef.current = tileLayer;

    // Initialize layer groups
    lulcLayerRef.current = L.layerGroup().addTo(map);
    erosionHazardLayerRef.current = L.layerGroup().addTo(map);
    photosLayerRef.current = L.layerGroup().addTo(map);
    interventionsLayerRef.current = L.layerGroup().addTo(map);
    lakesLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap & Handle Upscaling (never show "Metadata not available")
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    const cfg = BASEMAPS[activeBasemap];
    const newLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      subdomains: cfg.subdomains || 'abc',
      maxNativeZoom: cfg.maxNativeZoom,
      maxZoom: cfg.maxZoom,
    }).addTo(map);
    baseTileLayerRef.current = newLayer;
  }, [activeBasemap]);

  // Smooth Camera Fly-To when switching to another Watershed across India
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([watershed.centroid_lat, watershed.centroid_lon], 14, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }, [watershed.id, watershed.centroid_lat, watershed.centroid_lon]);


  // Fit to Watershed Boundary Bounds Clamping
  const handleFitBounds = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (boundaryLayerRef.current) {
      map.fitBounds(boundaryLayerRef.current.getBounds(), { padding: [35, 35], maxZoom: 16 });
    } else {
      map.setView([watershed.centroid_lat, watershed.centroid_lon], 14);
    }
  };

  // Render Boundary & Drainage Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Watershed Catchment Boundary
    if (boundaryLayerRef.current) {
      map.removeLayer(boundaryLayerRef.current);
      boundaryLayerRef.current = null;
    }
    if (showBoundary && watershed.boundary_geojson) {
      const boundaryLayer = L.geoJSON(watershed.boundary_geojson, {
        style: {
          color: '#38bdf8',
          weight: 2.5,
          opacity: 0.95,
          fillColor: '#0369a1',
          fillOpacity: 0.12,
          dashArray: '5, 5',
        }
      }).addTo(map);
      boundaryLayerRef.current = boundaryLayer;
    }

    // 2. Strahler Stream Drainage Hierarchy
    if (drainageLayerRef.current) {
      map.removeLayer(drainageLayerRef.current);
      drainageLayerRef.current = null;
    }
    if (showDrainage && watershed.drainage_geojson) {
      const drainageLayer = L.geoJSON(watershed.drainage_geojson, {
        style: (feature) => {
          const order = feature?.properties?.stream_order || 1;
          switch (order) {
            case 4:
              return { color: '#0284c7', weight: 5.0, opacity: 0.95 }; // Main Nala
            case 3:
              return { color: '#06b6d4', weight: 3.5, opacity: 0.90 }; // Secondary tributary
            case 2:
              return { color: '#38bdf8', weight: 2.2, opacity: 0.85 }; // Ridge contour
            default:
              return { color: '#7dd3fc', weight: 1.5, opacity: 0.80, dashArray: '3, 4' }; // Feeder gully
          }
        },
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(
            `<div class="font-mono text-xs">
              <span class="font-bold text-cyan-400">${feature.properties?.name || 'Drainage Channel'}</span><br/>
              <span class="text-slate-300">Strahler Order: ${feature.properties?.stream_order || 1}</span>
            </div>`,
            { className: 'leaflet-dark-tooltip', sticky: true }
          );
        }
      }).addTo(map);
      drainageLayerRef.current = drainageLayer;
    }
  }, [watershed, showBoundary, showDrainage]);

  // Render Thematic Layer: LULC (Land Use / Land Cover)
  useEffect(() => {
    const group = lulcLayerRef.current;
    if (!group) return;
    group.clearLayers();

    if (showLulc && watershed.centroid_lat && watershed.centroid_lon) {
      const lat = watershed.centroid_lat;
      const lon = watershed.centroid_lon;

      // Thematic LULC classification polygons around watershed
      const lulcZones = [
        {
          name: 'Intensive Double Crop Agriculture',
          color: '#10b981',
          opacity: 0.35,
          coords: [
            [lat - 0.008, lon - 0.008],
            [lat - 0.008, lon + 0.005],
            [lat + 0.002, lon + 0.007],
            [lat + 0.001, lon - 0.006],
          ]
        },
        {
          name: 'Degraded Ridge Scrub & Barren Soil',
          color: '#f59e0b',
          opacity: 0.30,
          coords: [
            [lat + 0.003, lon - 0.012],
            [lat + 0.012, lon - 0.005],
            [lat + 0.014, lon + 0.004],
            [lat + 0.006, lon + 0.002],
          ]
        },
        {
          name: 'Riparian Buffer & Farm Pond Reservoir',
          color: '#0284c7',
          opacity: 0.45,
          coords: [
            [lat - 0.003, lon - 0.002],
            [lat - 0.001, lon + 0.003],
            [lat - 0.005, lon + 0.004],
            [lat - 0.006, lon - 0.001],
          ]
        }
      ];

      lulcZones.forEach((zone) => {
        const poly = L.polygon(zone.coords as [number, number][], {
          color: zone.color,
          weight: 1.5,
          fillColor: zone.color,
          fillOpacity: zone.opacity,
          dashArray: '3, 3'
        });
        poly.bindTooltip(
          `<div class="font-mono text-xs">
            <span class="font-bold" style="color: ${zone.color}">LULC: ${zone.name}</span>
          </div>`,
          { className: 'leaflet-dark-tooltip' }
        );
        group.addLayer(poly);
      });
    }
  }, [showLulc, watershed]);

  // Render Thematic Layer: Hydrologic Risk Alert Zones (RUSLE Soil Loss & Moisture Stress)
  useEffect(() => {
    const group = erosionHazardLayerRef.current;
    if (!group) return;
    group.clearLayers();

    if (showErosionHazard && watershed.centroid_lat && watershed.centroid_lon) {
      const lat = watershed.centroid_lat;
      const lon = watershed.centroid_lon;

      const zonesToRender = (riskAlertZones && riskAlertZones.length > 0)
        ? riskAlertZones
        : [
            {
              id: 'ZONE_01',
              zone_name: 'Zone Alpha: Upper Ridge Erosion Corridor',
              risk_type: 'Sheet & Rill Erosion Susceptibility',
              risk_level: 'High',
              centroid_lat: lat + 0.006,
              centroid_lon: lon - 0.004,
              alert_radius_meters: 420,
              summary: 'Upper ridge slopes exceed 15% gradient with sparse scrub cover.',
              suggested_action: 'Continuous Contour Trenches (CCT) on upper ridges.'
            },
            {
              id: 'ZONE_02',
              zone_name: 'Zone Beta: Central Moisture Stress Depression',
              risk_type: 'Post-Monsoon Moisture Stress',
              risk_level: 'Moderate',
              centroid_lat: lat - 0.004,
              centroid_lon: lon + 0.006,
              alert_radius_meters: 350,
              summary: 'Rapid groundwater decline post-monsoon in fractured aquifer.',
              suggested_action: 'De-silting percolation tanks to revive aquifer recharge.'
            },
            {
              id: 'ZONE_03',
              zone_name: 'Zone Gamma: Confluence Velocity Surge Reach',
              risk_type: 'Flash Runoff Drainage Velocity',
              risk_level: 'Low',
              centroid_lat: lat - 0.002,
              centroid_lon: lon - 0.005,
              alert_radius_meters: 480,
              summary: 'Confluence reach buffering peak discharge during storm events.',
              suggested_action: 'Gabion check weir at stream order 3 junction.'
            }
          ];

      zonesToRender.forEach((zone: any) => {
        const centerLat = zone.centroid_lat || lat;
        const centerLon = zone.centroid_lon || lon;
        const radius = zone.alert_radius_meters || 400;
        const isCritical = zone.risk_level === 'Critical' || zone.risk_level === 'High';
        const isModerate = zone.risk_level === 'Moderate';
        const color = isCritical ? '#ef4444' : isModerate ? '#d97706' : '#10b981';

        // Outer dashed perimeter
        const outerRing = L.circle([centerLat, centerLon], {
          radius: radius,
          color: color,
          weight: 1.5,
          dashArray: '5, 6',
          fillColor: color,
          fillOpacity: isCritical ? 0.22 : 0.15,
        });

        // Pulsing center beacon icon
        const beaconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer">
            <span class="absolute inline-flex h-7 w-7 rounded-full opacity-70 animate-ping" style="background-color: ${color}"></span>
            <span class="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-[#121619] shadow-md" style="background-color: ${color}"></span>
          </div>
        `;
        const beaconIcon = L.divIcon({
          className: 'risk-beacon',
          html: beaconHtml,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        });

        const beaconMarker = L.marker([centerLat, centerLon], { icon: beaconIcon });

        // Interactive rich popup
        const popupContent = document.createElement('div');
        popupContent.className = 'font-sans text-[#f1f0eb] p-2 text-xs max-w-[260px] space-y-2';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between border-b border-[#2c373d] pb-1.5">
            <span class="font-bold text-[10px] font-mono uppercase px-1.5 py-0.5 rounded" style="background-color: ${color}22; color: ${color}; border: 1px solid ${color}66">
              ${zone.risk_level} Severity
            </span>
            <span class="font-mono text-[10px] text-[#9ba3a7]">${radius}m Alert Radius</span>
          </div>
          <div>
            <h4 class="font-bold text-xs text-[#f1f0eb]">${zone.zone_name || zone.risk_type}</h4>
            <p class="text-[11px] text-[#c5c3b8] mt-1 leading-relaxed">${zone.summary || 'Monitored hydrologic hazard buffer zone.'}</p>
          </div>
          <div class="border-t border-[#2c373d] pt-1.5 text-[10px] font-mono text-[#9ba3a7]">
            <span class="text-[#f1f0eb] font-semibold">Remedy:</span> ${zone.suggested_action || 'Contour treatment and check dam stabilization'}
          </div>
        `;

        if (onOpenSutraAi) {
          const sutraBtn = document.createElement('button');
          sutraBtn.className = 'w-full py-1 px-2 rounded bg-[#10b981]/20 hover:bg-[#10b981]/30 border border-[#10b981]/50 text-[#10b981] text-[10px] font-mono font-semibold flex items-center justify-center gap-1 uppercase transition-colors';
          sutraBtn.innerText = 'Launch SUTRA-AI Diagnostic';
          sutraBtn.onclick = () => {
            onOpenSutraAi('Check Dam');
          };
          popupContent.appendChild(sutraBtn);
        }

        beaconMarker.bindPopup(popupContent, { className: 'leaflet-dark-popup' });
        outerRing.bindPopup(popupContent, { className: 'leaflet-dark-popup' });

        group.addLayer(outerRing);
        group.addLayer(beaconMarker);
      });
    }
  }, [showErosionHazard, watershed, riskAlertZones]);

  // Render Field Geo-Tagged Survey Photos Layer (Camera Pin Markers with Thumbnail Popups)
  useEffect(() => {
    const group = photosLayerRef.current;
    if (!group) return;
    group.clearLayers();

    if (showSurveyPhotos && evidenceList.length > 0) {
      evidenceList.forEach((ev) => {
        if (!ev.captured_latitude || !ev.captured_longitude) return;

        const isConsistent = ev.consistency?.status === 'Consistent';
        const markerColor = isConsistent ? '#10b981' : '#f59e0b';

        const cameraIconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="w-8 h-8 rounded-full bg-slate-950 border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125" style="border-color: ${markerColor}">
              <svg class="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
            </div>
            <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-slate-950" style="background-color: ${markerColor}"></span>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-photo-pin',
          html: cameraIconHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16]
        });

        const marker = L.marker([ev.captured_latitude, ev.captured_longitude], { icon: customIcon });

        // Rich Thumbnail Popup
        const popupContent = document.createElement('div');
        popupContent.className = 'font-sans text-slate-100 p-2 text-xs max-w-[220px]';
        popupContent.innerHTML = `
          <div class="rounded overflow-hidden border border-slate-700 bg-slate-900 mb-2">
            <img src="${ev.image_url}" alt="${ev.intervention_name}" class="w-full h-24 object-cover" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'100\\'><rect width=\\'200\\' height=\\'100\\' fill=\\'%231e293b\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%2394a3b8\\' text-anchor=\\'middle\\'>Photo Evidence</text></svg>'" />
          </div>
          <div class="font-bold text-cyan-400 leading-snug">${ev.intervention_name}</div>
          <div class="text-[11px] text-slate-400 mt-0.5">${ev.intervention_type}</div>
          <div class="mt-1.5 flex items-center justify-between text-[10px] font-mono border-t border-slate-800 pt-1 text-slate-400">
            <span>By: ${ev.surveyor_name || 'Field Surveyor'}</span>
            <span class="${isConsistent ? 'text-emerald-400' : 'text-amber-400'} font-semibold">${ev.consistency?.status || 'Pending'}</span>
          </div>
        `;

        const inspectBtn = document.createElement('button');
        inspectBtn.className = 'w-full mt-2 py-1 px-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors';
        inspectBtn.innerText = 'Inspect Forensics';
        inspectBtn.onclick = () => {
          if (onSelectEvidence) onSelectEvidence(ev);
        };
        popupContent.appendChild(inspectBtn);

        marker.bindPopup(popupContent, { className: 'leaflet-dark-popup' });
        group.addLayer(marker);
      });
    }
  }, [showSurveyPhotos, evidenceList]);

  // Render Interventions Markers
  useEffect(() => {
    const group = interventionsLayerRef.current;
    if (!group) return;
    group.clearLayers();

    if (showInterventions) {
      watershed.interventions.forEach((item) => {
        const isSelected = item.id === selectedInterventionId;
        
        let statusColor = '#10b981'; // green
        if (item.latest_consistency_status === 'Potential Inconsistency') statusColor = '#ef4444';
        if (item.latest_consistency_status === 'Requires Field Verification') statusColor = '#f59e0b';

        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125 ${isSelected ? 'scale-125' : ''}">
            <div class="w-8 h-8 rounded-full bg-slate-950 border-2 flex items-center justify-center shadow-lg" style="border-color: ${isSelected ? '#38bdf8' : statusColor}">
              <div class="w-3 h-3 rounded-full" style="background-color: ${statusColor}"></div>
            </div>
            ${isSelected ? '<span class="absolute -top-1 -right-1 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span></span>' : ''}
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-pin',
          html: iconHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([item.target_latitude, item.target_longitude], { icon: customIcon });

        marker.on('click', () => {
          onSelectIntervention(item.id);
        });

        marker.bindTooltip(`
          <div class="text-xs p-1 font-mono">
            <p class="font-bold text-white">${item.name}</p>
            <p class="text-slate-400">${item.intervention_type} (Order ${item.stream_order})</p>
            <p class="text-[10px] mt-1 text-cyan-400 font-semibold">Click to open Evidence Card</p>
          </div>
        `, { className: 'leaflet-dark-tooltip' });

        group.addLayer(marker);
      });
    }
  }, [watershed, showInterventions, selectedInterventionId]);

  // 8. Render Lakes, Reservoirs & Water Inlets Network
  useEffect(() => {
    const group = lakesLayerRef.current;
    if (!group) return;
    group.clearLayers();

    if (showLakes && watershed) {
      const cLat = watershed.centroid_lat || 18.9150;
      const cLon = watershed.centroid_lon || 73.3280;

      // Hydrographic waterbodies mapped across the catchment
      const waterbodies = [
        {
          id: 'lake-01',
          name: `${watershed.name || 'Catchment'} Main Reservoir & Talav`,
          type: 'Primary Storage Reservoir & Feeder Lake',
          inflow_mps: 2.8,
          capacity_cum: 185000,
          current_level_pct: 86,
          turbidity: 'Optimal (Secchi 1.8m)',
          fed_by: 'Strahler Stream Order 3 & 4 Main Channel',
          coords: [
            [cLat + 0.003, cLon - 0.006],
            [cLat + 0.007, cLon - 0.002],
            [cLat + 0.004, cLon + 0.005],
            [cLat - 0.003, cLon + 0.004],
            [cLat - 0.005, cLon - 0.003]
          ],
          inletCoords: [cLat + 0.007, cLon - 0.002] as [number, number]
        },
        {
          id: 'lake-02',
          name: 'North Confluence Impoundment Lake',
          type: 'Secondary Silt Detention Lake',
          inflow_mps: 1.4,
          capacity_cum: 74000,
          current_level_pct: 78,
          turbidity: 'Moderate (Silt Trap Active)',
          fed_by: 'Strahler Stream Order 2 Tributary Gully',
          coords: [
            [cLat + 0.010, cLon - 0.009],
            [cLat + 0.014, cLon - 0.006],
            [cLat + 0.011, cLon - 0.002],
            [cLat + 0.008, cLon - 0.005]
          ],
          inletCoords: [cLat + 0.014, cLon - 0.006] as [number, number]
        },
        {
          id: 'lake-03',
          name: 'Valley Percolation Tank Impoundment',
          type: 'Deep Aquifer Recharge Lake',
          inflow_mps: 1.1,
          capacity_cum: 58000,
          current_level_pct: 91,
          turbidity: 'Clean (Groundwater Infiltration Basin)',
          fed_by: 'Strahler Stream Order 4 Downstream Channel',
          coords: [
            [cLat - 0.007, cLon + 0.008],
            [cLat - 0.004, cLon + 0.012],
            [cLat - 0.008, cLon + 0.015],
            [cLat - 0.011, cLon + 0.010]
          ],
          inletCoords: [cLat - 0.004, cLon + 0.012] as [number, number]
        }
      ];

      waterbodies.forEach((wb) => {
        // Draw the lake polygon with rich cyan/blue water styling
        const poly = L.polygon(wb.coords as [number, number][], {
          color: '#0ea5e9',
          weight: 2.5,
          opacity: 0.95,
          fillColor: '#0284c7',
          fillOpacity: 0.65,
        });

        poly.bindTooltip(`
          <div class="font-mono text-xs p-1">
            <span class="font-bold text-sky-400">💧 ${wb.name}</span><br/>
            <span class="text-slate-300">Level: ${wb.current_level_pct}% Filled (${(wb.capacity_cum / 1000).toFixed(0)}k m³)</span><br/>
            <span class="text-emerald-400">Inflow: ${wb.inflow_mps} m³/s</span>
          </div>
        `, { className: 'leaflet-dark-tooltip', sticky: true });

        poly.bindPopup(`
          <div class="font-sans text-slate-100 p-2 text-xs space-y-2 max-w-[240px]">
            <div class="flex items-center gap-1.5 font-bold text-sky-400 font-mono text-sm border-b border-slate-700 pb-1">
              <span>💧</span>
              <span>${wb.name}</span>
            </div>
            <div class="text-[11px] text-slate-300 font-mono">${wb.type}</div>
            <div class="space-y-1 font-mono text-[10px] bg-slate-900 p-2 rounded border border-slate-800">
              <div class="flex justify-between">
                <span class="text-slate-400">Live Inflow Rate:</span>
                <span class="text-cyan-400 font-bold">${wb.inflow_mps} m³/sec</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Storage Volume:</span>
                <span class="text-emerald-400 font-bold">${wb.capacity_cum.toLocaleString()} m³</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Capacity Filled:</span>
                <span class="text-amber-400 font-bold">${wb.current_level_pct}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Water Clarity:</span>
                <span class="text-slate-200">${wb.turbidity}</span>
              </div>
            </div>
            <div class="text-[10px] text-slate-400 italic">
              Feeder Source: ${wb.fed_by}
            </div>
          </div>
        `, { className: 'leaflet-dark-popup' });

        group.addLayer(poly);

        // Add animated inlet flow pin at lake entry point
        const inletIcon = L.divIcon({
          className: 'inlet-pin',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer">
              <span class="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-cyan-400 opacity-75"></span>
              <div class="w-5 h-5 rounded-full bg-sky-950 border border-sky-400 flex items-center justify-center text-[10px] text-sky-300 shadow">
                🌊
              </div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const inletMarker = L.marker(wb.inletCoords, { icon: inletIcon });
        inletMarker.bindTooltip(`
          <div class="font-mono text-[10px]">
            <span class="text-cyan-300 font-bold">🌊 Stream Water Inlet</span><br/>
            <span>Active flow channel feeding into ${wb.name}</span>
          </div>
        `, { className: 'leaflet-dark-tooltip' });

        group.addLayer(inletMarker);
      });
    }
  }, [watershed, showLakes]);

  return (
    <div className="relative w-full h-[540px] rounded-lg overflow-hidden border border-slate-800 bg-[#090d14] shadow-lg">
      
      {/* Leaflet Mount Node */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Control HUD Overlay (Top-Left) */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 font-mono">
        
        {/* Layer Visibility Toggles (5 Thematic Layers) */}
        <div className="bg-[#0b0f17]/95 border border-slate-800 rounded-md p-2.5 flex flex-col gap-1.5 text-xs shadow-md backdrop-blur-sm min-w-[210px]">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 border-b border-slate-800/80 pb-1">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Thematic Layers</span>
            </div>
            <button 
              onClick={handleFitBounds}
              title="Fit to Watershed Extent"
              className="text-slate-400 hover:text-cyan-300 p-0.5"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          {/* 1. Catchment Boundary */}
          <button
            type="button"
            onClick={() => setShowBoundary(!showBoundary)}
            className={`flex items-center justify-between gap-3 px-2 py-1 rounded text-[11px] transition-colors ${showBoundary ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'}`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm border border-cyan-400 bg-cyan-950/50"></span>
              Catchment Boundary
            </span>
            {showBoundary ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
          </button>

          {/* 2. Drainage Network (Strahler 1-4) */}
          <button
            type="button"
            onClick={() => setShowDrainage(!showDrainage)}
            className={`flex items-center justify-between gap-3 px-2 py-1 rounded text-[11px] transition-colors ${showDrainage ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'}`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-cyan-400 rounded-sm"></span>
              Drainage Hierarchy (1-4)
            </span>
            {showDrainage ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
          </button>

          {/* 2.5 Lakes & Water Inflow Channels */}
          <button
            type="button"
            onClick={() => setShowLakes(!showLakes)}
            className={`flex items-center justify-between gap-3 px-2 py-1 rounded text-[11px] transition-colors ${showLakes ? 'bg-slate-800 text-sky-300 border border-sky-500/40 font-semibold' : 'text-slate-400 hover:bg-slate-900'}`}
          >
            <span className="flex items-center gap-1.5 font-mono">
              <Droplets className="w-3 h-3 text-sky-400" />
              Lakes &amp; Inflow Network (3)
            </span>
            {showLakes ? <Eye className="w-3 h-3 text-sky-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
          </button>

          {/* 3. LULC Classification */}
          <button
            type="button"
            onClick={() => setShowLulc(!showLulc)}
            className={`flex items-center justify-between gap-3 px-2 py-1 rounded text-[11px] transition-colors ${showLulc ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-900'}`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/60 border border-emerald-400"></span>
              LULC Classification
            </span>
            {showLulc ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
          </button>

          {/* 4. Hydrologic Risk Alert Zones (RUSLE) */}
          <button
            type="button"
            onClick={() => setShowErosionHazard(!showErosionHazard)}
            className={`flex items-center justify-between gap-3 px-2 py-1 rounded text-[11px] transition-colors ${showErosionHazard ? 'bg-[#181f23] text-[#d97706] border border-[#d97706]/40 font-semibold' : 'text-[#9ba3a7] hover:bg-[#181f23]/60'}`}
          >
            <span className="flex items-center gap-1.5 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]/60 border border-[#d97706]"></span>
              Hydrologic Risk Alert Zones ({riskAlertZones.length || 3})
            </span>
            {showErosionHazard ? <Eye className="w-3 h-3 text-[#d97706]" /> : <EyeOff className="w-3 h-3 text-[#9ba3a7]" />}
          </button>

          {/* 5. Field Geo-tagged Photos */}
          <button
            type="button"
            onClick={() => setShowSurveyPhotos(!showSurveyPhotos)}
            className={`flex items-center justify-between gap-3 px-2 py-1 rounded text-[11px] transition-colors ${showSurveyPhotos ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'}`}
          >
            <span className="flex items-center gap-1.5">
              <Camera className="w-3 h-3 text-cyan-400" />
              Field Photo Pins ({evidenceList.length})
            </span>
            {showSurveyPhotos ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
          </button>

          {/* 6. Intervention Structures */}
          <button
            type="button"
            onClick={() => setShowInterventions(!showInterventions)}
            className={`flex items-center justify-between gap-3 px-2 py-1 rounded text-[11px] transition-colors ${showInterventions ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'text-slate-400 hover:bg-slate-900'}`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Intervention Sites ({watershed.interventions.length})
            </span>
            {showInterventions ? <Eye className="w-3 h-3 text-slate-200" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
          </button>

          {/* 7. Quick SUTRA-AI Evaluator Action */}
          {onOpenSutraAi && (
            <button
              type="button"
              onClick={() => onOpenSutraAi('Check Dam')}
              className="w-full mt-1 flex items-center justify-center gap-1.5 px-2 py-1 rounded bg-[#10b981]/20 border border-[#10b981]/60 text-[#10b981] hover:bg-[#10b981]/30 text-[10px] font-mono font-semibold transition-colors uppercase tracking-wider"
            >
              Launch SUTRA-AI Video Analysis
            </button>
          )}
        </div>

        {/* Basemap Switcher (High Res, Clamped) */}
        <div className="bg-[#0b0f17]/95 border border-slate-800 rounded-md p-1 flex items-center gap-1 shadow-md backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setActiveBasemap('satellite')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${activeBasemap === 'satellite' ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => setActiveBasemap('dark')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${activeBasemap === 'dark' ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Dark Carto
          </button>
          <button
            type="button"
            onClick={() => setActiveBasemap('topo')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${activeBasemap === 'topo' ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Positron
          </button>
        </div>

      </div>

      {/* Map Legend (Bottom-Left) */}
      <div className="absolute bottom-3 left-3 z-20 bg-[#0b0f17]/95 border border-slate-800 rounded-md px-3 py-2 text-[11px] text-slate-300 hidden md:block font-mono shadow-md backdrop-blur-sm">
        <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
          Hydrologic Strahler Hierarchy
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="w-4 h-1.5 bg-[#0284c7] rounded"></span>
            <span>Order 4 (Main Stem)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-[#06b6d4] rounded"></span>
            <span>Order 3 (Tributary)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-[#38bdf8] rounded"></span>
            <span>Order 2 (Ridge Branch)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-b border-[#7dd3fc] border-dashed"></span>
            <span>Order 1 (Feeder)</span>
          </div>
        </div>
      </div>

      {/* Pan-India Basin Hydro Radar Bar (Top-Right) */}
      <div className="absolute top-3 right-3 z-20 bg-[#0b0f17]/95 border border-slate-800 rounded-md p-1.5 flex items-center gap-1.5 text-xs font-mono shadow-md backdrop-blur-sm">
        <div className="flex items-center gap-1 text-[10px] uppercase text-[#10b981] font-bold px-1.5 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/30 whitespace-nowrap">
          <Compass className="w-3 h-3 text-[#10b981]" />
          <span>Pan-India Radar</span>
        </div>
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (!val || !mapInstanceRef.current) return;
            const [lat, lon, zoom] = val.split(',').map(Number);
            mapInstanceRef.current.flyTo([lat, lon], zoom || 14, { duration: 1.8 });
          }}
          className="bg-[#121619] border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none cursor-pointer max-w-[200px] truncate"
        >
          <option value="18.9150,73.3280,14">📍 Maharashtra (Ulhas Catchment)</option>
          <option value="27.5530,76.6346,14">📍 Rajasthan (Alwar Arid Basin)</option>
          <option value="11.9680,76.4950,14">📍 Karnataka (Cauvery Reach)</option>
          <option value="22.7196,75.8577,14">📍 Madhya Pradesh (Narmada Valley)</option>
          <option value="30.3165,78.0322,14">📍 Uttarakhand (Garhwal Ridge)</option>
        </select>
      </div>

    </div>
  );
};
