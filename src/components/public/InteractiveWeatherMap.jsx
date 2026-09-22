import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Eye, 
  Maximize2, 
  RotateCcw, 
  Filter, 
  Radio, 
  Info,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertOctagon
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { INDIAN_STATES_DATA } from '../../data/statesDistricts';

export default function InteractiveWeatherMap({ 
  t, 
  lang, 
  bigDataFeed, 
  selectedStation, 
  onSelectStation 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupsRef = useRef({
    warnings: null,
    awsStations: null,
    radar: null,
    citizenReports: null,
  });

  // Layer Visibility State
  const [layers, setLayers] = useState({
    warnings: true,
    awsStations: true,
    radar: true,
    citizenReports: true
  });

  const [selectedHazard, setSelectedHazard] = useState('all');
  const [activeInspectorItem, setActiveInspectorItem] = useState(null);

  // Toggle Layer
  const toggleLayer = (layerName) => {
    setLayers(prev => {
      const nextState = !prev[layerName];
      const lg = layerGroupsRef.current[layerName];
      if (lg && mapInstanceRef.current) {
        if (nextState) {
          mapInstanceRef.current.addLayer(lg);
        } else {
          mapInstanceRef.current.removeLayer(lg);
        }
      }
      return { ...prev, [layerName]: nextState };
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create Leaflet map centered on India
      const map = L.map(mapContainerRef.current, {
        center: [22.5, 80.0],
        zoom: 5,
        minZoom: 4,
        maxZoom: 14,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Base Tile Layer (CartoDB Positron / OSM style - official, clean)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> | Map Data &copy; IMD / OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Initialize Layer Groups
      layerGroupsRef.current.warnings = L.layerGroup().addTo(map);
      layerGroupsRef.current.awsStations = L.layerGroup().addTo(map);
      layerGroupsRef.current.radar = L.layerGroup().addTo(map);
      layerGroupsRef.current.citizenReports = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // cleanup handled if unmounted
    };
  }, []);

  // Update Data on Map when bigDataFeed, layers, or selectedHazard change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { warnings, awsStations, radar, citizenReports } = layerGroupsRef.current;
    if (!warnings || !awsStations || !radar || !citizenReports) return;

    // 1. Render Official Warnings (Polygons)
    warnings.clearLayers();
    if (layers.warnings) {
      // Coastal Maharashtra (Red)
      const konkanPoly = L.polygon([
        [19.9, 72.7],
        [19.2, 73.2],
        [18.2, 73.4],
        [17.5, 73.6],
        [17.5, 72.9],
        [18.8, 72.6]
      ], {
        color: '#dc2626',
        fillColor: '#ef4444',
        fillOpacity: 0.35,
        weight: 2,
        dashArray: '5, 5'
      }).bindTooltip("<b>RED WARNING: Extremely Heavy Rain</b><br>Coastal Maharashtra & Mumbai", { permanent: false });
      konkanPoly.on('click', () => {
        setActiveInspectorItem({
          type: 'warning',
          level: 'red',
          title: 'Extremely Heavy Rain Alert',
          area: 'Coastal Maharashtra (Konkan)',
          advisory: 'Take action: Flooding of low lying areas. Fishermen warning in place.',
          source: 'IMD NWFC Bulletin'
        });
      });
      warnings.addLayer(konkanPoly);

      // Odisha & Gangetic WB Coast (Orange)
      const odishaPoly = L.polygon([
        [21.8, 86.8],
        [21.0, 87.5],
        [19.8, 86.2],
        [19.2, 85.0],
        [19.7, 84.8],
        [20.8, 86.0]
      ], {
        color: '#ea580c',
        fillColor: '#f97316',
        fillOpacity: 0.3,
        weight: 2
      }).bindTooltip("<b>ORANGE ALERT: Deep Depression</b><br>North Odisha & Gangetic WB", { permanent: false });
      odishaPoly.on('click', () => {
        setActiveInspectorItem({
          type: 'warning',
          level: 'orange',
          title: 'Deep Depression Squall & Rain Alert',
          area: 'Odisha & Gangetic West Bengal Coastal Belt',
          advisory: 'Be prepared: Gale wind 55-65 kmph gusting to 75 kmph.',
          source: 'Cyclone Warning Division (CWD)'
        });
      });
      warnings.addLayer(odishaPoly);

      // NCR Delhi (Yellow)
      const ncrCircle = L.circle([28.6139, 77.2090], {
        radius: 65000,
        color: '#ca8a04',
        fillColor: '#eab308',
        fillOpacity: 0.25,
        weight: 2
      }).bindTooltip("<b>YELLOW WATCH: Thunderstorm & Gusty Winds</b><br>NCR Delhi", { permanent: false });
      ncrCircle.on('click', () => {
        setActiveInspectorItem({
          type: 'warning',
          level: 'yellow',
          title: 'Thunderstorm Watch',
          area: 'National Capital Region',
          advisory: 'Be aware: Lightning & wind gusts 30-40 km/h.',
          source: 'RMC New Delhi'
        });
      });
      warnings.addLayer(ncrCircle);
    }

    // 2. Render Radar Reflectivity Simulation
    radar.clearLayers();
    if (layers.radar) {
      // Doppler Radar coverage concentric rings (Mumbai & Kolkata DWR)
      const radarMumbai = L.circle([18.9067, 72.8147], {
        radius: 120000,
        color: '#0284c7',
        fillColor: '#38bdf8',
        fillOpacity: 0.15,
        weight: 1
      });
      radar.addLayer(radarMumbai);

      // Intense Rain Core (simulated 45+ dBZ echo)
      const intenseCell = L.polygon([
        [19.0, 72.8],
        [19.3, 72.9],
        [19.2, 73.1],
        [18.9, 73.0]
      ], {
        color: '#7c3aed',
        fillColor: '#9333ea',
        fillOpacity: 0.5,
        weight: 1
      }).bindTooltip("<b>Doppler Radar Echo: 48 dBZ (Intense Precipitation)</b>", { sticky: true });
      radar.addLayer(intenseCell);
    }

    // 3. Render IMD AWS Physical Stations
    awsStations.clearLayers();
    if (layers.awsStations) {
      for (const stObj of INDIAN_STATES_DATA) {
        for (const distObj of stObj.districts) {
          for (const st of distObj.stations) {
            const isSelected = selectedStation && selectedStation.id === st.id;
            
            // Custom SVG icon for AWS
            const awsIcon = L.divIcon({
              className: 'custom-aws-marker',
              html: `
                <div style="
                  background: ${isSelected ? '#0284c7' : '#0b2545'};
                  color: white;
                  border: 2px solid ${isSelected ? '#f59e0b' : '#38bdf8'};
                  border-radius: 50%;
                  width: ${isSelected ? '28px' : '22px'};
                  height: ${isSelected ? '28px' : '22px'};
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                  font-size: 11px;
                  font-weight: bold;
                ">
                  📡
                </div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });

            const marker = L.marker([st.lat, st.lng], { icon: awsIcon });
            marker.on('click', () => {
              if (onSelectStation) onSelectStation(st);
              setActiveInspectorItem({
                type: 'aws',
                station: st,
                district: distObj.district,
                state: stObj.state
              });
            });
            marker.bindTooltip(`<b>${st.name}</b><br>${st.temp}°C | ${st.condition}`, { direction: 'top' });
            awsStations.addLayer(marker);
          }
        }
      }
    }

    // 4. Render Citizen & Social Big Data Reports
    citizenReports.clearLayers();
    if (layers.citizenReports) {
      const filteredReports = selectedHazard === 'all'
        ? bigDataFeed
        : bigDataFeed.filter(r => r.eventCategory === selectedHazard);

      for (const item of filteredReports) {
        // Different styling based on verification status
        let bgColor = '#10b981'; // verified
        let borderColor = '#047857';
        let badgeIcon = '✓';

        if (item.verificationStatus === 'fake') {
          bgColor = '#ef4444';
          borderColor = '#991b1b';
          badgeIcon = '✕';
        } else if (item.verificationStatus === 'review') {
          bgColor = '#f59e0b';
          borderColor = '#b45309';
          badgeIcon = '?';
        } else if (item.verificationStatus === 'official') {
          bgColor = '#3b82f6';
          borderColor = '#1d4ed8';
          badgeIcon = '🏛️';
        }

        const iconHtml = `
          <div style="
            background: ${bgColor};
            color: white;
            border: 2px solid white;
            outline: 2px solid ${borderColor};
            border-radius: 6px;
            padding: 3px 6px;
            font-size: 10px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 3px;
            box-shadow: 0 3px 8px rgba(0,0,0,0.35);
            white-space: nowrap;
          ">
            <span>${item.source === 'twitter' ? '𝕏' : '👥'}</span>
            <span>${item.eventCategory.toUpperCase().slice(0, 4)}</span>
            <span style="background: rgba(0,0,0,0.25); border-radius: 4px; padding: 1px 3px;">${badgeIcon}</span>
          </div>
        `;

        const reportIcon = L.divIcon({
          className: 'custom-citizen-marker',
          html: iconHtml,
          iconSize: [60, 24],
          iconAnchor: [30, 12]
        });

        const marker = L.marker([item.lat, item.lng], { icon: reportIcon });
        marker.on('click', () => {
          setActiveInspectorItem({
            type: 'bigdata',
            data: item
          });
        });
        marker.bindTooltip(`<b>${item.city}</b>: ${item.text.slice(0, 45)}...<br><i>AI Confidence: ${item.aiConfidenceScore}%</i>`, { direction: 'top' });
        citizenReports.addLayer(marker);
      }
    }
  }, [bigDataFeed, layers, selectedHazard, selectedStation]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([22.5, 80.0], 5);
    }
  };

  return (
    <section className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-8" aria-label="National Geospatial Weather Map">
      {/* 1. Map Header Controls */}
      <div className="bg-[#0b2545] text-white p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-blue-600 text-white">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight font-serif">
              {t.interactiveMapTitle}
            </h2>
            <p className="text-xs text-slate-300">
              Interactive meteorological GIS fusing official radar, AWS network, and AI-corroborated social intelligence.
            </p>
          </div>
        </div>

        {/* Hazard filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-[#13315c] px-2.5 py-1 rounded-lg border border-slate-600 text-xs">
            <Filter className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            <span className="text-slate-300 mr-1 hidden sm:inline">{t.filterByHazard}:</span>
            <select
              value={selectedHazard}
              onChange={(e) => setSelectedHazard(e.target.value)}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none"
            >
              <option value="all" className="bg-[#0b2545]">All Events</option>
              <option value="rainfall" className="bg-[#0b2545]">{t.catRainfall}</option>
              <option value="flooding" className="bg-[#0b2545]">{t.catFlooding}</option>
              <option value="thunderstorm" className="bg-[#0b2545]">{t.catThunderstorm}</option>
              <option value="strong_winds" className="bg-[#0b2545]">{t.catStrongWinds}</option>
              <option value="heatwave" className="bg-[#0b2545]">{t.catHeatwave}</option>
              <option value="fog" className="bg-[#0b2545]">{t.catFog}</option>
            </select>
          </div>

          <button
            onClick={resetView}
            className="bg-[#13315c] hover:bg-[#1a447c] text-slate-200 hover:text-white px-2.5 py-1 rounded-lg border border-slate-600 text-xs flex items-center gap-1 transition"
            title="Reset to All India View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.allIndia}</span>
          </button>
        </div>
      </div>

      {/* 2. Map Layer Toggle Bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <span className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">Active Layers:</span>

          {/* Warnings Layer */}
          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layers.warnings}
              onChange={() => toggleLayer('warnings')}
              className="rounded text-red-600 focus:ring-red-500 w-3.5 h-3.5"
            />
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-600 inline-block"></span>
              {t.layerWarnings}
            </span>
          </label>

          {/* AWS Stations Layer */}
          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layers.awsStations}
              onChange={() => toggleLayer('awsStations')}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0b2545] inline-block border border-cyan-400"></span>
              {t.layerAWS}
            </span>
          </label>

          {/* Doppler Radar */}
          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layers.radar}
              onChange={() => toggleLayer('radar')}
              className="rounded text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
            />
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"></span>
              {t.layerRadar}
            </span>
          </label>

          {/* Citizen & Social Media Reports */}
          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layers.citizenReports}
              onChange={() => toggleLayer('citizenReports')}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block"></span>
              {t.layerCitizen}
            </span>
          </label>
        </div>

        {/* Legend Indicator */}
        <div className="hidden lg:flex items-center space-x-3 text-[11px] text-slate-600">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> AI Corroborated</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Under Review</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Anomaly/Fake Quarantined</span>
        </div>
      </div>

      {/* 3. Map Viewport & Detail Inspector Sidebar */}
      <div className="relative w-full h-[520px] bg-slate-200">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Inspector Panel for Clicked Features */}
        {activeInspectorItem && (
          <div className="absolute top-4 right-4 z-[500] w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-300 p-4 max-h-[480px] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-700" />
                {activeInspectorItem.type === 'aws' ? 'IMD Ground Station' : activeInspectorItem.type === 'warning' ? 'Official IMD Warning' : 'Big Data Incident Intelligence'}
              </span>
              <button 
                onClick={() => setActiveInspectorItem(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-1 rounded hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* If clicked Big Data item */}
            {activeInspectorItem.type === 'bigdata' && (
              <div className="space-y-3">
                {/* Source & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {activeInspectorItem.data.sourcePlatform}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {activeInspectorItem.data.sourceHandle}
                    </span>
                  </div>

                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    activeInspectorItem.data.verificationStatus === 'verified'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : activeInspectorItem.data.verificationStatus === 'fake'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {activeInspectorItem.data.verificationStatus === 'verified' ? '✓ AI Verified' : activeInspectorItem.data.verificationStatus === 'fake' ? '✕ Quarantined Fake' : '? Under Review'}
                  </span>
                </div>

                {/* Post Content */}
                <p className="text-xs text-slate-800 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  "{activeInspectorItem.data.text}"
                </p>

                {/* Media Image Preview if available */}
                {activeInspectorItem.data.hasMedia && activeInspectorItem.data.mediaUrl && (
                  <div className="rounded-lg overflow-hidden border border-slate-200 max-h-40">
                    <img 
                      src={activeInspectorItem.data.mediaUrl} 
                      alt="Citizen evidence" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}

                {/* AI Forensics & Sensor Cross-Reference */}
                <div className="bg-blue-50/80 p-3 rounded-lg border border-blue-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-900">AI Confidence Index:</span>
                    <span className="font-extrabold text-blue-800 font-mono text-sm">
                      {activeInspectorItem.data.aiConfidenceScore}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${activeInspectorItem.data.aiConfidenceScore >= 80 ? 'bg-emerald-600' : activeInspectorItem.data.aiConfidenceScore >= 40 ? 'bg-amber-500' : 'bg-red-600'}`}
                      style={{ width: `${activeInspectorItem.data.aiConfidenceScore}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-700 leading-normal pt-1">
                    {activeInspectorItem.data.nearestSensor?.matchAssessment}
                  </p>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Location: {activeInspectorItem.data.city}, {activeInspectorItem.data.state}</span>
                  <span>Cluster: {activeInspectorItem.data.clusterCount} reports</span>
                </div>
              </div>
            )}

            {/* If clicked AWS Station */}
            {activeInspectorItem.type === 'aws' && (
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{activeInspectorItem.station.name}</h4>
                  <p className="text-xs text-slate-500">{activeInspectorItem.district}, {activeInspectorItem.state}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <div className="text-slate-500 text-[10px]">Temperature</div>
                    <div className="text-base font-bold text-slate-900">{activeInspectorItem.station.temp}°C</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <div className="text-slate-500 text-[10px]">Humidity</div>
                    <div className="text-base font-bold text-slate-900">{activeInspectorItem.station.humidity}%</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <div className="text-slate-500 text-[10px]">Rain Today</div>
                    <div className="text-base font-bold text-blue-700">{activeInspectorItem.station.rainToday || 0} mm</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <div className="text-slate-500 text-[10px]">Wind Speed</div>
                    <div className="text-base font-bold text-slate-900">{activeInspectorItem.station.windSpeed} km/h</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  Sky: <span className="font-semibold text-slate-800">{activeInspectorItem.station.condition}</span>
                </p>
              </div>
            )}

            {/* If clicked Warning Polygon */}
            {activeInspectorItem.type === 'warning' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                    activeInspectorItem.level === 'red' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {activeInspectorItem.level.toUpperCase()} WARNING
                  </span>
                  <span className="text-xs font-bold text-slate-800">{activeInspectorItem.title}</span>
                </div>
                <p className="text-xs font-semibold text-slate-700">{activeInspectorItem.area}</p>
                <div className="bg-amber-50 p-2.5 rounded border border-amber-200 text-xs text-amber-950">
                  <b>Safety Action:</b> {activeInspectorItem.advisory}
                </div>
                <div className="text-[10px] text-slate-500">{activeInspectorItem.source}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
