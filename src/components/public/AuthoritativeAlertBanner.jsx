import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ChevronRight, 
  Info,
  Filter
} from 'lucide-react';
import { OFFICIAL_IMD_WARNINGS } from '../../data/initialBigDataFeed';

export default function AuthoritativeAlertBanner({ t, lang }) {
  const [filterLevel, setFilterLevel] = useState('all');
  const [expandedId, setExpandedId] = useState("WARN-2026-09-01");

  const filteredWarnings = filterLevel === 'all'
    ? OFFICIAL_IMD_WARNINGS
    : OFFICIAL_IMD_WARNINGS.filter(w => w.level === filterLevel);

  const getLevelConfig = (level) => {
    switch (level) {
      case 'red':
        return {
          icon: <AlertOctagon className="w-5 h-5 text-red-600" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-600',
          badgeBg: 'bg-red-600 text-white',
          labelText: t.takeAction,
          cardPattern: 'warning-pattern-red'
        };
      case 'orange':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-500',
          badgeBg: 'bg-orange-500 text-white',
          labelText: t.bePrepared,
          cardPattern: 'warning-pattern-orange'
        };
      case 'yellow':
        return {
          icon: <AlertCircle className="w-5 h-5 text-yellow-700" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-500',
          badgeBg: 'bg-yellow-500 text-slate-900',
          labelText: t.beAware,
          cardPattern: 'warning-pattern-yellow'
        };
      case 'green':
      default:
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-500',
          badgeBg: 'bg-emerald-600 text-white',
          labelText: t.noWarning,
          cardPattern: ''
        };
    }
  };

  return (
    <section className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-6" aria-label="Official IMD Weather Warnings">
      {/* Header Bar */}
      <div className="bg-[#134074] text-white px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-red-600 text-white animate-pulse">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              {t.activeWarnings}
            </h2>
            <p className="text-xs text-slate-200">
              {t.officialSource}
            </p>
          </div>
        </div>

        {/* Level Filters (Accessible non-color dependent) */}
        <div className="flex items-center space-x-1.5 bg-[#0b2545] p-1 rounded-lg border border-slate-600 text-xs">
          <span className="text-slate-300 text-[11px] px-2 hidden md:inline">Filter:</span>
          {['all', 'red', 'orange', 'yellow'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition ${
                filterLevel === lvl
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {lvl === 'all' ? 'All Alerts' : lvl.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Warning Cards List */}
      <div className="p-4 sm:p-6 space-y-4">
        {filteredWarnings.map((warning) => {
          const cfg = getLevelConfig(warning.level);
          const isExpanded = expandedId === warning.id;

          return (
            <div
              key={warning.id}
              className={`rounded-xl border-2 transition-all overflow-hidden ${cfg.borderColor} ${cfg.bgColor} ${cfg.cardPattern}`}
              role="alert"
              aria-live="polite"
            >
              {/* Card Title Banner */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : warning.id)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-white/40 transition"
              >
                <div className="flex items-start sm:items-center space-x-3">
                  <div className="mt-0.5 sm:mt-0">{cfg.icon}</div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wide shadow-xs ${cfg.badgeBg}`}>
                        {cfg.labelText}
                      </span>
                      <span className="text-xs text-slate-600 font-mono font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {t.validUntil}: {warning.validUntil}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {lang === 'hi' ? warning.titleHi : warning.title}
                    </h3>
                    <p className="text-xs text-slate-700 font-semibold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-600" />
                      {lang === 'hi' ? warning.regionHi : warning.region}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <span className="text-xs font-semibold text-blue-800 underline">
                    {isExpanded ? 'Hide Details' : 'View Safety Advisories'}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {/* Collapsible Action Advisory & Details */}
              {isExpanded && (
                <div className="border-t border-slate-200 bg-white/95 p-4 sm:p-5 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Expected Impact */}
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-blue-600" />
                        Expected Meteorological Impact
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {warning.expectedImpact}
                      </p>
                    </div>

                    {/* Citizen Action Advisory */}
                    <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200">
                      <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        {t.recommendedActions}
                      </h4>
                      <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                        {warning.actionAdvisory}
                      </p>
                    </div>
                  </div>

                  {/* Affected Districts */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-xs font-bold text-slate-700 mr-1">
                      {t.affectedDistricts}:
                    </span>
                    {warning.affectedDistricts.map((d, i) => (
                      <span key={i} className="text-xs bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md font-medium">
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500 italic">
                    Issued from the platform's severe-weather alert feed
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
