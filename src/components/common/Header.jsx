import React from 'react';
import { 
  CloudSun, 
  ShieldAlert, 
  Activity, 
  Globe2, 
  Eye, 
  PhoneCall, 
  Radio, 
  Layers, 
  FileText,
  AlertTriangle
} from 'lucide-react';

export default function Header({ 
  lang, 
  setLang, 
  t, 
  activeTab, 
  setActiveTab, 
  isStreaming, 
  setIsStreaming, 
  highContrast, 
  setHighContrast,
  textSize,
  setTextSize,
  onOpenReportModal
}) {
  const toggleContrast = () => {
    const nextVal = !highContrast;
    setHighContrast(nextVal);
    if (nextVal) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const handleTextSizeChange = (size) => {
    setTextSize(size);
    document.documentElement.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
    document.documentElement.classList.add(`text-size-${size}`);
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="bg-slate-950 text-slate-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-semibold tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Weather intelligence, in one place</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-amber-300 font-semibold gap-1">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Weather desk: 1070 / 1077</span>
            </div>

            {/* Font Size Adjusters */}
            <div className="hidden sm:flex items-center space-x-1 bg-[#13315c] px-1.5 py-0.5 rounded border border-slate-600">
              <span className="text-[10px] text-slate-400 mr-1">{t.textSize}:</span>
              <button 
                onClick={() => handleTextSizeChange('sm')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${textSize === 'sm' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                title="Decrease font size"
              >
                A-
              </button>
              <button 
                onClick={() => handleTextSizeChange('md')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${textSize === 'md' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                title="Normal font size"
              >
                A
              </button>
              <button 
                onClick={() => handleTextSizeChange('lg')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${textSize === 'lg' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* High Contrast Mode */}
            <button 
              onClick={toggleContrast}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition border ${
                highContrast ? 'bg-yellow-400 text-black border-yellow-300 font-bold' : 'bg-slate-800 text-slate-200 border-slate-600 hover:bg-slate-700'
              }`}
              title="Toggle High Contrast for Accessibility"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{highContrast ? t.normalContrast : t.highContrast}</span>
            </button>

            {/* Language Switcher */}
            <button 
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-0.5 rounded text-xs font-semibold shadow-sm transition"
              title="Switch language between English and Hindi"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'हिन्दी वेबसाइट' : 'English Portal'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#081b33] via-[#102f52] to-[#164e63] py-4 px-4 sm:px-6 border-b border-cyan-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/15 border border-cyan-300/40 flex items-center justify-center text-cyan-200 shadow-lg">
              <CloudSun className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none">
                {t.platformTitle}
              </h1>
              <p className="text-xs sm:text-sm text-cyan-100/75 font-medium mt-1">
                Live observations, forecasts and weather signals
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            {/* Live Ingestion Engine Pulse Indicator */}
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${isStreaming ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
              <span className="font-medium text-slate-700">
                {isStreaming ? 'Live observations' : 'Observations paused'}
              </span>
              <button 
                onClick={() => setIsStreaming(!isStreaming)}
                className="text-[11px] underline text-blue-700 ml-1 font-semibold hover:text-blue-900"
              >
                {isStreaming ? 'Pause' : 'Resume'}
              </button>
            </div>

            {/* Jan-Mausam Citizen Observation Button */}
            <button
              onClick={onOpenReportModal}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg shadow flex items-center gap-1.5 transition active:scale-95"
            >
              <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>{t.reportWeatherBtn}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white px-4 sm:px-6 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
          <nav className="flex space-x-1 sm:space-x-4 py-1" aria-label="Portal Navigation">
            <button
              onClick={() => setActiveTab('public')}
              className={`flex items-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-t-md transition border-b-2 ${
                activeTab === 'public'
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-[#1a447c] border-transparent'
              }`}
            >
              <CloudSun className="w-4 h-4" />
              <span>{t.portalPublic}</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-t-md transition border-b-2 ${
                activeTab === 'admin'
                  ? 'bg-white text-[#0b2545] border-amber-500 shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-[#1a447c] border-transparent'
              }`}
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>{t.portalAdmin}</span>
              <span className="bg-cyan-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                AI Live
              </span>
            </button>
          </nav>

          <div className="hidden lg:flex items-center space-x-4 text-xs text-slate-300 py-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 550+ AWS Stations Active
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> 38 Doppler Radars Online
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> INSAT-3D Satellite Active
            </span>
          </div>
        </div>
      </div>

      {/* 4. Official Press Release & Warning Ticker */}
      <div className="bg-amber-50 border-b border-amber-200 text-amber-950 text-xs py-1.5 px-4 overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-red-700 uppercase bg-red-100 px-2 py-0.5 rounded shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            Weather Alert
          </span>
          <div className="truncate text-slate-800 font-medium">
            <span>
              [21-Sep-2026] The Well-Marked Low Pressure Area over Northwest Bay of Bengal is very likely to concentrate into a Depression during next 24 hours. Red Alert issued for Coastal Maharashtra (Extremely Heavy Rain); Orange Alert for Coastal Odisha & Gangetic West Bengal. Total suspension of fishing operations advised.
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
