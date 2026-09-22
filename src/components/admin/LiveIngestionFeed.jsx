import React from 'react';
import { 
  Radio, 
  Sparkles, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Layers
} from 'lucide-react';

export default function LiveIngestionFeed({
  items,
  selectedItemId,
  onSelectItem,
  t,
  lang
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[580px]">
      {/* Feed Header */}
      <div className="bg-[#0b2545] text-white p-3.5 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <h3 className="font-bold text-sm font-serif">
            {t.streamFeedTitle}
          </h3>
          <span className="bg-emerald-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.5 rounded-full">
            {items.length} Live
          </span>
        </div>

        <span className="text-[11px] text-slate-300 font-mono">
          Auto-Ingesting #IMD
        </span>
      </div>

      {/* Feed Items Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100">
        {items.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No events match the current filter criteria.
          </div>
        ) : (
          items.map((item) => {
            const isSelected = selectedItemId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`pt-2.5 p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-600 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  {/* Top line: Source, Handle, Timestamp, Status */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        item.source === 'twitter' ? 'bg-slate-900 text-white' : item.source === 'citizen' ? 'bg-emerald-700 text-white' : 'bg-blue-700 text-white'
                      }`}>
                        {item.source === 'twitter' ? '𝕏 Post' : item.source === 'citizen' ? 'Jan-Mausam' : 'Buoy/Sensor'}
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate" title={item.sourceHandle}>
                        {item.sourceHandle}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                      item.verificationStatus === 'verified'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : item.verificationStatus === 'fake'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : item.verificationStatus === 'official'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {item.verificationStatus === 'verified' ? <CheckCircle className="w-3 h-3" /> : item.verificationStatus === 'fake' ? <XCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      <span>{item.verificationStatus.toUpperCase()}</span>
                    </span>
                  </div>

                  {/* Post content */}
                  <p className="text-xs text-slate-800 leading-snug line-clamp-2 font-medium">
                    {item.text}
                  </p>
                </div>

                {/* Bottom line: Location, Category tag, AI score */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 mt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-slate-700 font-semibold truncate">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    {item.city}, {item.state}
                  </span>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                      {item.eventCategory}
                    </span>
                    <span className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                      item.aiConfidenceScore >= 80 ? 'bg-emerald-100 text-emerald-800' : item.aiConfidenceScore >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      AI: {item.aiConfidenceScore}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
