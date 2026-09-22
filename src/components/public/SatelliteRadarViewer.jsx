import React, { useState, useEffect } from 'react';
import { 
  Radar, 
  Satellite, 
  Play, 
  Pause, 
  RotateCw, 
  Info, 
  Download, 
  Radio, 
  Clock 
} from 'lucide-react';

export default function SatelliteRadarViewer({ t, lang }) {
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' | 'satellite'
  const [isPlaying, setIsPlaying] = useState(true);
  const [frameIndex, setFrameIndex] = useState(4); // 0 to 4

  const frames = [
    { label: "-60 min", time: "19:30 IST" },
    { label: "-45 min", time: "19:45 IST" },
    { label: "-30 min", time: "20:00 IST" },
    { label: "-15 min", time: "20:15 IST" },
    { label: "Live", time: "20:30 IST" }
  ];

  // Animation cycle
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % frames.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-8" aria-label="Doppler Radar & INSAT-3D Satellite Imagery">
      {/* Header bar */}
      <div className="bg-[#0b2545] text-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
            {activeTab === 'radar' ? <Radar className="w-5 h-5" /> : <Satellite className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-serif">
              {activeTab === 'radar' ? 'Doppler Weather Radar (DWR) Mosaic' : 'INSAT-3D / 3DR Satellite Imagery'}
            </h2>
            <p className="text-xs text-slate-300">
              National radar mosaic and geostationary meteorological satellite feed updated every 15 minutes.
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-[#13315c] p-1 rounded-lg border border-slate-600 text-xs">
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-1.5 rounded font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'radar' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span>Radar Mosaic</span>
          </button>
          <button
            onClick={() => setActiveTab('satellite')}
            className={`px-3 py-1.5 rounded font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'satellite' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>INSAT-3D IR</span>
          </button>
        </div>
      </div>

      {/* Main Imagery & Animation Display */}
      <div className="p-4 sm:p-6 bg-slate-900 text-white">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-700">
          {/* Background Simulated Meteorological Image */}
          <div className="absolute inset-0 opacity-75">
            {activeTab === 'radar' ? (
              <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center relative">
                {/* Radar Grid Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-25"></div>
                {/* Simulated Animated Echo Rings */}
                <div 
                  className="w-72 h-72 rounded-full border border-cyan-500/40 absolute transition-transform duration-700"
                  style={{ transform: `scale(${1 + frameIndex * 0.05})` }}
                ></div>
                <div 
                  className="w-48 h-48 rounded-full border border-cyan-400/60 absolute transition-transform duration-700"
                  style={{ transform: `scale(${1 + frameIndex * 0.08})` }}
                ></div>
                <div 
                  className="w-24 h-24 rounded-full bg-red-600/30 blur-md absolute top-1/3 left-1/2 transition-all duration-700"
                  style={{ opacity: 0.6 + frameIndex * 0.08 }}
                ></div>
                <div 
                  className="w-32 h-32 rounded-full bg-purple-600/40 blur-lg absolute bottom-1/4 right-1/3 transition-all duration-700"
                  style={{ opacity: 0.5 + frameIndex * 0.1 }}
                ></div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-800 to-blue-950 flex items-center justify-center relative">
                {/* Cloud bands simulation */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-slate-600/10 to-transparent blur-xl"></div>
                <div 
                  className="w-96 h-64 bg-white/30 rounded-full blur-2xl absolute top-10 left-1/4 transition-transform duration-700"
                  style={{ transform: `translateX(${frameIndex * 10}px)` }}
                ></div>
              </div>
            )}
          </div>

          {/* Foreground Overlay HUD */}
          <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md p-2.5 rounded-lg border border-slate-700 text-xs">
            <div className="flex items-center gap-2 font-mono font-bold text-amber-400">
              <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
              <span>{activeTab === 'radar' ? 'DWR ALL-INDIA MOSAIC (Z_MAX)' : 'INSAT-3D ASIA SEC (IR1)'}</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1.5 font-mono">
              <Clock className="w-3 h-3" />
              <span>Frame: {frames[frameIndex].time} ({frames[frameIndex].label})</span>
            </div>
          </div>

          {/* Color Scale Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[10px]">
            <div className="text-slate-400 font-semibold mb-1">
              {activeTab === 'radar' ? 'Reflectivity (dBZ)' : 'Cloud Top Temp (°C)'}
            </div>
            <div className="flex items-center space-x-1 font-mono">
              <span className="bg-blue-600 px-1.5 py-0.5 rounded-xs text-white">15</span>
              <span className="bg-cyan-500 px-1.5 py-0.5 rounded-xs text-black">25</span>
              <span className="bg-green-500 px-1.5 py-0.5 rounded-xs text-black">35</span>
              <span className="bg-yellow-400 px-1.5 py-0.5 rounded-xs text-black">45</span>
              <span className="bg-orange-500 px-1.5 py-0.5 rounded-xs text-white">55</span>
              <span className="bg-red-600 px-1.5 py-0.5 rounded-xs text-white">65+</span>
            </div>
          </div>
        </div>

        {/* Playback Controls & Frame Timeline */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-800">
          {/* Play/Pause & Speed */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
              title={isPlaying ? "Pause Animation Loop" : "Play Animation Loop"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <span className="text-xs text-slate-400">
              Loop Interval: 1.2s
            </span>
          </div>

          {/* Frame Buttons */}
          <div className="flex items-center space-x-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700">
            {frames.map((f, i) => (
              <button
                key={i}
                onClick={() => {
                  setFrameIndex(i);
                  setIsPlaying(false);
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition ${
                  frameIndex === i
                    ? 'bg-amber-500 text-black shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400">
            Certified by SatMet & Radar Directorate, IMD
          </div>
        </div>
      </div>
    </section>
  );
}
