import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Radio, 
  MapPin, 
  Clock, 
  Gauge, 
  Droplets, 
  Thermometer, 
  Wind,
  Layers,
  ArrowRight,
  Share2,
  ExternalLink
} from 'lucide-react';
import { getAuthenticityAssessment } from '../../utils/authenticity.js';

export default function AIVerificationWorkbench({
  item,
  onUpdateStatus,
  t,
  lang
}) {
  if (!item) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-400 flex flex-col items-center justify-center h-[580px]">
        <Sparkles className="w-10 h-10 text-slate-300 mb-2" />
        <h4 className="font-bold text-slate-700 text-sm">Select an Ingested Record</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Click any report from the live feed to inspect AI verification telemetry, physical station cross-referencing, and take administrative actions.
        </p>
      </div>
    );
  }

  const nearest = item.nearestSensor;
  const authenticity = getAuthenticityAssessment(item);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[580px]">
      {/* Header */}
      <div className="bg-[#13315c] text-white p-3.5 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-sm font-serif">
            {t.workbenchTitle}
          </h3>
        </div>
        <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-600">
          ID: {item.id}
        </span>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* 1. Report Origin & Verification Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                {item.sourcePlatform}
              </span>
              <span className="text-xs text-blue-700 font-semibold">
                {item.sourceHandle}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
              <span>{item.city}, {item.state}</span>
              <span>•</span>
              <span className="font-mono">{item.timestamp}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-violet-200 bg-violet-50">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-violet-950">Authenticity assessment</span>
              <span className="text-sm font-extrabold text-violet-900">{authenticity.score}% · {authenticity.label}</span>
            </div>
            <p className="text-[11px] text-violet-900 mt-1 leading-relaxed">{authenticity.reason}</p>
            <p className="text-[10px] text-violet-700 mt-1">This is an evidence-based assessment, not a guarantee of truth. Open the publisher links below to inspect the original reports.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-full ${
              item.verificationStatus === 'verified'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : item.verificationStatus === 'fake'
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {item.verificationStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* 2. Text & Media Inspection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Ingested Post Payload & Metadata
          </label>
          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs text-xs text-slate-900 leading-relaxed font-medium">
            "{item.text}"
          </div>
          {item.relatedSources?.length > 0 && (
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-xs font-bold text-emerald-900 mb-1">
                Independent publisher cross-check ({item.relatedSources.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {item.relatedSources.map((source) => (
                  <a key={source.name} href={source.url || '#'} target="_blank" rel="noreferrer" className="text-xs text-emerald-800 underline">
                  {source.name} {source.verified ? `(trusted ${source.verificationBasis})` : '(unverified source)'}
                  </a>
                ))}
              </div>
            </div>
          )}
          {item.evidenceChecks?.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs font-bold text-slate-800 mb-1">Evidence checks passed</div>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-700">
                {item.evidenceChecks.map((check) => <li key={check}>{check}</li>)}
              </ul>
              <p className="text-[10px] text-slate-500 mt-2">
                Citation links are retained from the live RSS result. They support source inspection but do not independently prove the event.
              </p>
            </div>
          )}

          {item.hasMedia && item.mediaUrl && (
            <div className="rounded-lg overflow-hidden border border-slate-200 max-h-48 relative">
              <img src={item.mediaUrl} alt="Attached Evidence" className="w-full h-full object-cover" />
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                Media Forensic Analyzed
              </span>
            </div>
          )}

          {/* Hashtags and Categorization */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-600 mr-1">NLP Detected Category:</span>
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded-md border border-purple-300">
              {item.eventCategory.toUpperCase()}
            </span>
            {item.tags?.map((tg, i) => (
              <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-mono">
                {tg}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Physical IMD AWS Sensor Cross-Reference (Forensics) */}
        <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-blue-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              Ground Truth Sensor Cross-Reference
            </span>
            <span className="font-mono font-extrabold text-blue-900 text-sm">
              Confidence: {authenticity.score}%
            </span>
          </div>

          {nearest ? (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-700 font-medium">
                <span>Nearest AWS: <b className="text-slate-900">{nearest.stationName}</b></span>
                <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">Dist: {nearest.distanceKm} km</span>
              </div>

              {/* Sensor Comparison Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-1.5 rounded border border-blue-200">
                  <div className="text-[10px] text-slate-500">Recorded Rain</div>
                  <div className="font-bold text-blue-700">{nearest.recordedRainMm !== undefined ? `${nearest.recordedRainMm} mm` : 'N/A'}</div>
                </div>
                <div className="bg-white p-1.5 rounded border border-blue-200">
                  <div className="text-[10px] text-slate-500">Recorded Wind</div>
                  <div className="font-bold text-slate-900">{nearest.recordedWindKmph !== undefined ? `${nearest.recordedWindKmph} km/h` : 'N/A'}</div>
                </div>
                <div className="bg-white p-1.5 rounded border border-blue-200">
                  <div className="text-[10px] text-slate-500">Recorded Temp</div>
                  <div className="font-bold text-slate-900">{nearest.recordedTemp !== undefined ? `${nearest.recordedTemp}°C` : 'N/A'}</div>
                </div>
              </div>

              {/* Assessment Message */}
              <div className={`p-2 rounded text-[11px] leading-relaxed font-medium ${
                item.verificationStatus === 'fake' ? 'bg-red-100/80 text-red-900 border border-red-200' : 'bg-emerald-100/80 text-emerald-900 border border-emerald-200'
              }`}>
                {nearest.matchAssessment}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No physical sensor telemetry available.</p>
          )}
        </div>

        {/* 4. Deduplication & Cluster Metrics */}
        <div className="flex items-center justify-between text-xs bg-slate-100 p-2.5 rounded-lg border border-slate-200">
          <span className="font-medium text-slate-700">Spatio-Temporal Cluster:</span>
          <span className="font-bold text-slate-900">
            {item.clusterCount > 1 ? `${item.clusterCount} Duplicate reports merged (within 3km)` : 'Unique single incident'}
          </span>
        </div>
      </div>

      {/* 5. Officer 1-Click Action Bar */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 grid grid-cols-3 gap-2">
        {/* Approve & Publish */}
        <button
          onClick={() => onUpdateStatus(item.id, 'verified')}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1 shadow-xs transition"
          title="Approve report and publish to national GIS weather map"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="truncate">Verify & Publish</span>
        </button>

        {/* Flag as Fake/Misleading */}
        <button
          onClick={() => onUpdateStatus(item.id, 'fake')}
          className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1 shadow-xs transition"
          title="Flag as disinformation or sensor mismatch and quarantine"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span className="truncate">Flag as Fake</span>
        </button>

        {/* Escalate to Severe Weather Bulletin */}
        <button
          onClick={() => onUpdateStatus(item.id, 'official')}
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1 shadow-xs transition"
          title="Escalate incident to National Weather Forecasting Centre (NWFC) Nowcast"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="truncate">Escalate Alert</span>
        </button>
      </div>
    </div>
  );
}
