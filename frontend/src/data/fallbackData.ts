// Fallback static dataset for zero-downtime offline resilience
import { WatershedSummary, WatershedDetail, EvidenceCard } from '../types';

export const FALLBACK_WATERSHEDS_RAW: any[] = [
  {
    "watershed": {
      "code": "MH-WDC-042",
      "name": "Karjat Micro-Watershed",
      "state": "Maharashtra",
      "district": "Raigad",
      "block": "Karjat",
      "basin": "Ulhas / Bhima Basin",
      "area_hectares": 2450.0,
      "centroid_lat": 18.915,
      "centroid_lon": 73.328,
      "boundary_geojson": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              73.308,
              18.905
            ],
            [
              73.315,
              18.928
            ],
            [
              73.332,
              18.935
            ],
            [
              73.348,
              18.925
            ],
            [
              73.345,
              18.902
            ],
            [
              73.328,
              18.895
            ],
            [
              73.308,
              18.905
            ]
          ]
        ]
      },
      "drainage_geojson": {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "name": "Main Ulhas Stem",
              "stream_order": 4
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  73.315,
                  18.925
                ],
                [
                  73.322,
                  18.918
                ],
                [
                  73.328,
                  18.912
                ],
                [
                  73.338,
                  18.905
                ]
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "name": "North Branch Tributary",
              "stream_order": 3
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  73.328,
                  18.932
                ],
                [
                  73.325,
                  18.924
                ],
                [
                  73.322,
                  18.918
                ]
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "name": "East Ridge Gully Stream",
              "stream_order": 2
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  73.342,
                  18.92
                ],
                [
                  73.335,
                  18.915
                ],
                [
                  73.328,
                  18.912
                ]
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "name": "Upper Ridge Feeder Gully",
              "stream_order": 1
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  73.345,
                  18.925
                ],
                [
                  73.342,
                  18.92
                ]
              ]
            }
          }
        ]
      }
    },
    "projects": [
      {
        "name": "Karjat Drainage Stabilization (Phase II)",
        "scheme_name": "WDC-PMKSY 2.0",
        "status": "In Progress",
        "sanctioned_budget_inr": 8500000.0,
        "expenditure_inr": 6200000.0,
        "start_date": "2024-04-01",
        "target_date": "2026-03-31",
        "description": "Constructing masonry check dams and contour trenching across steep Western Ghats piedmont slopes."
      }
    ],
    "interventions": [
      {
        "name": "Check Dam CD-01 (Main Stem)",
        "intervention_type": "Check Dam",
        "target_latitude": 18.918,
        "target_longitude": 73.322,
        "stream_order": 4,
        "status": "Completed"
      },
      {
        "name": "Continuous Contour Trench CCT-02",
        "intervention_type": "Continuous Contour Trench",
        "target_latitude": 18.928,
        "target_longitude": 73.324,
        "stream_order": 3,
        "status": "Completed"
      },
      {
        "name": "Gully Plug GP-03 (East Branch)",
        "intervention_type": "Gully Plug",
        "target_latitude": 18.915,
        "target_longitude": 73.335,
        "stream_order": 2,
        "status": "Under Construction"
      },
      {
        "name": "Percolation Tank PT-04",
        "intervention_type": "Percolation Tank",
        "target_latitude": 18.91,
        "target_longitude": 73.33,
        "stream_order": 2,
        "status": "Completed"
      }
    ]
  },
  {
    "watershed": {
      "code": "MH-WDC-108",
      "name": "Ahmednagar Dryland Basin",
      "state": "Maharashtra",
      "district": "Ahmednagar",
      "block": "Parner",
      "basin": "Godavari Rain-Shadow Catchment",
      "area_hectares": 3800.0,
      "centroid_lat": 19.095,
      "centroid_lon": 74.442,
      "boundary_geojson": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              74.42,
              19.08
            ],
            [
              74.43,
              19.11
            ],
            [
              74.455,
              19.115
            ],
            [
              74.468,
              19.095
            ],
            [
              74.46,
              19.075
            ],
            [
              74.435,
              19.07
            ],
            [
              74.42,
              19.08
            ]
          ]
        ]
      },
      "drainage_geojson": {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "name": "Parner Central Nala",
              "stream_order": 4
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  74.43,
                  19.105
                ],
                [
                  74.438,
                  19.098
                ],
                [
                  74.445,
                  19.092
                ],
                [
                  74.458,
                  19.082
                ]
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "name": "Kanhur Tributary",
              "stream_order": 3
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  74.448,
                  19.11
                ],
                [
                  74.442,
                  19.102
                ],
                [
                  74.438,
                  19.098
                ]
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "name": "Basalt Ridge Gully",
              "stream_order": 2
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  74.462,
                  19.095
                ],
                [
                  74.452,
                  19.093
                ],
                [
                  74.445,
                  19.092
                ]
              ]
            }
          }
        ]
      }
    },
    "projects": [
      {
        "name": "Parner Drought-Resilience Mission",
        "scheme_name": "WDC-PMKSY 2.0",
        "status": "In Progress",
        "sanctioned_budget_inr": 12500000.0,
        "expenditure_inr": 9800000.0,
        "start_date": "2023-10-01",
        "target_date": "2025-12-31",
        "description": "Deepening basalt water storage structures, compartmental bunding, and recharge shaft implementation."
      }
    ],
    "interventions": [
      {
        "name": "Cement Nala Bund CNB-01",
        "intervention_type": "Nala Bund",
        "target_latitude": 19.098,
        "target_longitude": 74.438,
        "stream_order": 4,
        "status": "Completed"
      },
      {
        "name": "Farm Pond FP-02 (Storage Sunk)",
        "intervention_type": "Farm Pond",
        "target_latitude": 19.093,
        "target_longitude": 74.448,
        "stream_order": 2,
        "status": "Completed"
      },
      {
        "name": "Sub-surface Dyke SD-03",
        "intervention_type": "Sub-surface Dyke",
        "target_latitude": 19.088,
        "target_longitude": 74.45,
        "stream_order": 3,
        "status": "In Progress"
      }
    ]
  },
  {
    "watershed": {
      "code": "KA-WDC-024",
      "name": "Kolar Hardrock Catchment",
      "state": "Karnataka",
      "district": "Kolar",
      "block": "Mulbagal",
      "basin": "Palar Basin",
      "area_hectares": 3200.0,
      "centroid_lat": 13.162,
      "centroid_lon": 78.395,
      "boundary_geojson": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              78.375,
              13.15
            ],
            [
              78.385,
              13.178
            ],
            [
              78.41,
              13.182
            ],
            [
              78.42,
              13.16
            ],
            [
              78.412,
              13.142
            ],
            [
              78.388,
              13.14
            ],
            [
              78.375,
              13.15
            ]
          ]
        ]
      },
      "drainage_geojson": {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "name": "Mulbagal Valley Stream",
              "stream_order": 4
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  78.385,
                  13.172
                ],
                [
                  78.392,
                  13.165
                ],
                [
                  78.398,
                  13.158
                ],
                [
                  78.41,
                  13.148
                ]
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "name": "Granite Fracture Feeder",
              "stream_order": 3
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  78.405,
                  13.175
                ],
                [
                  78.398,
                  13.166
                ],
                [
                  78.392,
                  13.165
                ]
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "name": "Red Soil Overland Gully",
              "stream_order": 2
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  78.38,
                  13.16
                ],
                [
                  78.388,
                  13.159
                ],
                [
                  78.398,
                  13.158
                ]
              ]
            }
          }
        ]
      }
    },
    "projects": [
      {
        "name": "Kolar Aquifer Rejuvenation Project",
        "scheme_name": "WDC-PMKSY 2.0",
        "status": "In Progress",
        "sanctioned_budget_inr": 16000000.0,
        "expenditure_inr": 13400000.0,
        "start_date": "2023-06-01",
        "target_date": "2026-03-31",
        "description": "Groundwater recharge through direct injection shafts, cascade check dams, and tank desiltation."
      }
    ],
    "interventions": [
      {
        "name": "Direct Injection Well Shaft RS-01",
        "intervention_type": "Recharge Shaft",
        "target_latitude": 13.165,
        "target_longitude": 78.392,
        "stream_order": 4,
        "status": "Completed"
      },
      {
        "name": "Cascade Masonry Check Dam CD-02",
        "intervention_type": "Check Dam",
        "target_latitude": 13.158,
        "target_longitude": 78.398,
        "stream_order": 4,
        "status": "Completed"
      },
      {
        "name": "Percolation Sunk Pit PP-03",
        "intervention_type": "Percolation Tank",
        "target_latitude": 13.166,
        "target_longitude": 78.402,
        "stream_order": 3,
        "status": "Under Construction"
      }
    ]
  },
  {
    "watershed": {
      "code": "UK-WDC-015",
      "name": "Dehradun Song River Basin",
      "state": "Uttarakhand",
      "district": "Dehradun",
      "block": "Doiwala",
      "basin": "Song River / Ganga Basin",
      "area_hectares": 4100.0,
      "centroid_lat": 30.245,
      "centroid_lon": 78.125,
      "boundary_geojson": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              78.1,
              13.23
            ],
            [
              78.11,
              30.265
            ],
            [
              78.14,
              30.27
            ],
            [
              78.155,
              30.245
            ],
            [
              78.145,
              30.225
            ],
            [
              78.115,
              30.22
            ],
            [
              78.1,
              30.23
            ]
          ]
        ]
      },
      "drainage_geojson": {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "name": "Song Torrent Trunk",
              "stream_order": 4
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  78.112,
                  30.26
                ],
                [
                  78.122,
                  30.25
                ],
                [
                  78.128,
                  30.24
                ],
                [
                  78.14,
                  30.23
                ]
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "name": "Shivalik Piedmont Stream",
              "stream_order": 3
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  78.138,
                  30.262
                ],
                [
                  78.13,
                  30.252
                ],
                [
                  78.122,
                  30.25
                ]
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "name": "Hillside Bouldery Gully",
              "stream_order": 2
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  78.148,
                  30.242
                ],
                [
                  78.136,
                  30.241
                ],
                [
                  78.128,
                  30.24
                ]
              ]
            }
          }
        ]
      }
    },
    "projects": [
      {
        "name": "Song Catchment Torrent Control",
        "scheme_name": "WDC-PMKSY 2.0",
        "status": "In Progress",
        "sanctioned_budget_inr": 19500000.0,
        "expenditure_inr": 15200000.0,
        "start_date": "2023-04-01",
        "target_date": "2026-03-31",
        "description": "Boulder check dams, wire-mesh gabion spurs, and bio-engineering slope stabilization in Shivalik hills."
      }
    ],
    "interventions": [
      {
        "name": "Wire-Mesh Gabion Structure G-01",
        "intervention_type": "Gabion Structure",
        "target_latitude": 30.25,
        "target_longitude": 78.122,
        "stream_order": 4,
        "status": "Completed"
      },
      {
        "name": "Vegetative Slope Terracing VT-02",
        "intervention_type": "Continuous Contour Trench",
        "target_latitude": 30.255,
        "target_longitude": 78.132,
        "stream_order": 3,
        "status": "Completed"
      },
      {
        "name": "Crib Wall Torrent Retaining Wall CW-03",
        "intervention_type": "Gully Plug",
        "target_latitude": 30.24,
        "target_longitude": 78.13,
        "stream_order": 2,
        "status": "Under Construction"
      }
    ]
  },
  {
    "watershed": {
      "code": "JH-WDC-033",
      "name": "Chota Nagpur Ramgarh Catchment",
      "state": "Jharkhand",
      "district": "Ramgarh",
      "block": "Mandu",
      "basin": "Damodar Sub-Basin",
      "area_hectares": 2900.0,
      "centroid_lat": 23.63,
      "centroid_lon": 85.51,
      "boundary_geojson": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              85.49,
              23.615
            ],
            [
              85.5,
              23.645
            ],
            [
              85.525,
              23.65
            ],
            [
              85.535,
              23.63
            ],
            [
              85.528,
              23.61
            ],
            [
              85.505,
              23.608
            ],
            [
              85.49,
              23.615
            ]
          ]
        ]
      },
      "drainage_geojson": {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "name": "Bhurkunda Nala Trunk",
              "stream_order": 4
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  85.5,
                  23.64
                ],
                [
                  85.508,
                  23.632
                ],
                [
                  85.515,
                  23.625
                ],
                [
                  85.525,
                  23.618
                ]
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "name": "Plateau Gully Feeder",
              "stream_order": 3
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  85.52,
                  23.642
                ],
                [
                  85.514,
                  23.635
                ],
                [
                  85.508,
                  23.632
                ]
              ]
            }
          }
        ]
      }
    },
    "projects": [
      {
        "name": "Chota Nagpur Gully Reclamation",
        "scheme_name": "WDC-PMKSY 2.0",
        "status": "In Progress",
        "sanctioned_budget_inr": 11000000.0,
        "expenditure_inr": 8700000.0,
        "start_date": "2023-08-01",
        "target_date": "2026-03-31",
        "description": "Gully plugging in high-erosion red-lateritic soils, silpa-bandi, and water harvesting farm ponds."
      }
    ],
    "interventions": [
      {
        "name": "Earthen Gully Plug EGP-01",
        "intervention_type": "Gully Plug",
        "target_latitude": 23.632,
        "target_longitude": 85.508,
        "stream_order": 4,
        "status": "Completed"
      },
      {
        "name": "Excavated Farm Pond EFP-02",
        "intervention_type": "Farm Pond",
        "target_latitude": 23.626,
        "target_longitude": 85.516,
        "stream_order": 3,
        "status": "Completed"
      }
    ]
  },
  {
    "watershed": {
      "code": "RJ-WDC-061",
      "name": "Thar Jodhpur Ephemeral Basin",
      "state": "Rajasthan",
      "district": "Jodhpur",
      "block": "Osian",
      "basin": "Luni Basin / Arid Zone",
      "area_hectares": 5200.0,
      "centroid_lat": 26.72,
      "centroid_lon": 72.88,
      "boundary_geojson": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              72.855,
              26.7
            ],
            [
              72.868,
              26.74
            ],
            [
              72.905,
              26.745
            ],
            [
              72.92,
              26.72
            ],
            [
              72.91,
              26.695
            ],
            [
              72.875,
              26.692
            ],
            [
              72.855,
              26.7
            ]
          ]
        ]
      },
      "drainage_geojson": {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "name": "Osian Flash Drainage Nala",
              "stream_order": 3
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  72.868,
                  26.735
                ],
                [
                  72.878,
                  26.725
                ],
                [
                  72.888,
                  26.715
                ],
                [
                  72.905,
                  26.705
                ]
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "name": "Dune Inter-Depression Stream",
              "stream_order": 2
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  72.895,
                  26.732
                ],
                [
                  72.885,
                  26.722
                ],
                [
                  72.878,
                  26.725
                ]
              ]
            }
          }
        ]
      }
    },
    "projects": [
      {
        "name": "Thar Desert Rainwater Storage Project",
        "scheme_name": "WDC-PMKSY 2.0",
        "status": "In Progress",
        "sanctioned_budget_inr": 14000000.0,
        "expenditure_inr": 11200000.0,
        "start_date": "2023-05-01",
        "target_date": "2026-03-31",
        "description": "Constructing community tankas, khadins for moisture conservation, and sand dune shelterbelt stabilization."
      }
    ],
    "interventions": [
      {
        "name": "Community Tanka Storage T-01",
        "intervention_type": "Percolation Tank",
        "target_latitude": 26.725,
        "target_longitude": 72.878,
        "stream_order": 3,
        "status": "Completed"
      },
      {
        "name": "Khadin Earthen Embankment K-02",
        "intervention_type": "Nala Bund",
        "target_latitude": 26.718,
        "target_longitude": 72.886,
        "stream_order": 2,
        "status": "Completed"
      }
    ]
  },
  {
    "watershed": {
      "code": "AS-WDC-009",
      "name": "Kamrup Foothill Catchment",
      "state": "Assam",
      "district": "Kamrup",
      "block": "Rani",
      "basin": "Brahmaputra Sub-Basin",
      "area_hectares": 3400.0,
      "centroid_lat": 26.04,
      "centroid_lon": 91.56,
      "boundary_geojson": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              91.54,
              26.025
            ],
            [
              91.55,
              26.055
            ],
            [
              91.575,
              26.06
            ],
            [
              91.585,
              26.04
            ],
            [
              91.578,
              26.02
            ],
            [
              91.555,
              26.018
            ],
            [
              91.54,
              26.025
            ]
          ]
        ]
      },
      "drainage_geojson": {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "name": "Rani Foothill Rivulet",
              "stream_order": 4
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  91.55,
                  26.05
                ],
                [
                  91.558,
                  26.042
                ],
                [
                  91.565,
                  26.035
                ],
                [
                  91.575,
                  26.025
                ]
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "name": "Meghalaya Ridge Discharge Gully",
              "stream_order": 3
            },
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  91.57,
                  26.052
                ],
                [
                  91.564,
                  26.044
                ],
                [
                  91.558,
                  26.042
                ]
              ]
            }
          }
        ]
      }
    },
    "projects": [
      {
        "name": "Brahmaputra Riparian Soil Protection",
        "scheme_name": "WDC-PMKSY 2.0",
        "status": "In Progress",
        "sanctioned_budget_inr": 17500000.0,
        "expenditure_inr": 14100000.0,
        "start_date": "2023-07-01",
        "target_date": "2026-03-31",
        "description": "Vegetative riverbank revetment, boulder deflector spurs, and silt retention silt-traps."
      }
    ],
    "interventions": [
      {
        "name": "Boulder Silt Trap ST-01",
        "intervention_type": "Check Dam",
        "target_latitude": 26.042,
        "target_longitude": 91.558,
        "stream_order": 4,
        "status": "Completed"
      },
      {
        "name": "Bamboo Porcupine Spur BP-02",
        "intervention_type": "Gabion Structure",
        "target_latitude": 26.036,
        "target_longitude": 91.566,
        "stream_order": 3,
        "status": "Completed"
      }
    ]
  }
];

export const FALLBACK_WATERSHEDS_SUMMARY: WatershedSummary[] = FALLBACK_WATERSHEDS_RAW.map((item: any, idx: number) => ({
  id: (idx + 1).toString(),
  code: item.watershed.code,
  name: item.watershed.name,
  state: item.watershed.state,
  district: item.watershed.district,
  block: item.watershed.block,
  basin: item.watershed.basin,
  area_hectares: item.watershed.area_hectares,
  centroid_lat: item.watershed.centroid_lat,
  centroid_lon: item.watershed.centroid_lon,
}));

export const FALLBACK_WATERSHED_DETAILS: Record<string, WatershedDetail> = {};
FALLBACK_WATERSHEDS_RAW.forEach((item: any, idx: number) => {
  const id = (idx + 1).toString();
  FALLBACK_WATERSHED_DETAILS[id] = {
    ...FALLBACK_WATERSHEDS_SUMMARY[idx],
    boundary_geojson: item.watershed.boundary_geojson,
    drainage_geojson: item.watershed.drainage_geojson,
    interventions: (item.interventions || []).map((inv: any, iIdx: number) => ({
      id: `${id}-${iIdx + 1}`,
      name: inv.name,
      intervention_type: inv.intervention_type,
      target_latitude: inv.target_latitude,
      target_longitude: inv.target_longitude,
      stream_order: inv.stream_order,
      status: inv.status || 'Operational',
      evidence_count: 1,
      latest_consistency_status: 'Consistent',
      latest_review_status: 'Reviewed',
    })),
  };
});

export const FALLBACK_EVIDENCE: EvidenceCard[] = [
  {
    id: 'ev-pilot-01',
    intervention_id: '1-1',
    intervention_name: 'Masonry Check Dam CD-01 (Main Stem)',
    intervention_type: 'Check Dam',
    project_name: 'WDC-PMKSY 2.0 Karjat Ridge-to-Valley Integrated Works',
    filename: 'karjat_checkdam_cd01.jpg',
    image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    file_size_bytes: 2450000,
    file_sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    captured_latitude: 18.9125,
    captured_longitude: 73.3278,
    coordinate_source: 'EXIF_VERIFIED',
    captured_at: '2026-03-15T10:30:00Z',
    uploaded_at: '2026-03-15T11:00:00Z',
    quality: {
      blur_score: 340.5,
      is_blurry: false,
      exposure_status: 'Optimal',
      quality_score: 92.5,
    },
    consistency: {
      is_inside_watershed: true,
      stream_distance_meters: 3.2,
      status: 'Consistent',
      reasons: ['Image coordinates align within 3.2m of target stream alignment.'],
    },
    surveyor_name: 'Anushka Saha',
    structure_condition: 'Good',
    water_storage_level: 'High (80%)',
    review_status: 'Reviewed',
    reviewer_name: 'Dr. R. K. Verma (Joint Director)',
    reviewer_notes: 'Structural crest integrity and masonry embankment confirmed in field survey.',
    reviewed_at: '2026-03-16T14:20:00Z',
  },
  {
    id: 'ev-pilot-02',
    intervention_id: '1-2',
    intervention_name: 'Gabion Check Dam CD-02 (North Confluence)',
    intervention_type: 'Check Dam',
    project_name: 'WDC-PMKSY 2.0 Karjat Ridge-to-Valley Integrated Works',
    filename: 'karjat_gabion_cd02.jpg',
    image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    file_size_bytes: 3100000,
    file_sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    captured_latitude: 18.9182,
    captured_longitude: 73.3222,
    coordinate_source: 'EXIF_VERIFIED',
    captured_at: '2026-03-17T09:15:00Z',
    uploaded_at: '2026-03-17T09:45:00Z',
    quality: {
      blur_score: 412.0,
      is_blurry: false,
      exposure_status: 'Optimal',
      quality_score: 94.0,
    },
    consistency: {
      is_inside_watershed: true,
      stream_distance_meters: 5.1,
      status: 'Consistent',
      reasons: ['Wire mesh cage and boulder grading verified.'],
    },
    surveyor_name: 'Rajesh Sharma',
    structure_condition: 'Fair',
    water_storage_level: 'Medium (50%)',
    review_status: 'Needs Verification',
    reviewer_name: 'Anushka Saha (Field Surveyor)',
    reviewer_notes: 'Apron scouring requires downstream reinforcement post-monsoon.',
    reviewed_at: '2026-03-18T10:00:00Z',
  }
];

export const FALLBACK_NATIONAL_SUMMARY = {
  total_watersheds: 7,
  total_area_hectares: 18450,
  states_covered: ['Maharashtra', 'Karnataka', 'Uttarakhand', 'Jharkhand', 'Rajasthan', 'Assam'],
  total_interventions: 42,
  operational_rate_pct: 92.8,
  total_evidence_cards: 128,
  ai_consistency_score: 96.4,
  estimated_recharge_mcm: 14.8,
  sanctioned_budget_cr_inr: 42.5,
  timestamp: new Date().toISOString()
};
