import React from 'react';
import { CloudSun, Shield, Phone, Mail, ExternalLink } from 'lucide-react';

export default function Footer({ t, lang }) {
  return (
    <footer className="w-full bg-[#0b2545] text-slate-300 border-t-4 border-amber-500 pt-10 pb-6 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: IMD Organization Details */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-3">
              <div className="w-8 h-8 rounded-full bg-[#003366] border border-cyan-400 flex items-center justify-center text-cyan-200">
                <CloudSun className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-serif">{t.deptTitle}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              A practical workspace for live weather intelligence, forecasts and public observations.
            </p>
            <p className="text-xs text-slate-400">
              Weather desk: <span className="text-cyan-300 font-bold">1070 / 1077</span>
            </p>
          </div>

          {/* Col 2: Core Weather Services */}
          <div>
            <h4 className="text-white font-semibold text-sm border-b border-slate-700 pb-2 mb-3">
              Weather Tools
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#alerts" className="hover:text-amber-300 transition">All India Severe Weather Warnings</a></li>
              <li><a href="#nowcast" className="hover:text-amber-300 transition">District & Station-wise Nowcasts (3-Hour)</a></li>
              <li><a href="#radar" className="hover:text-amber-300 transition">Doppler Weather Radar (DWR) Mosaic</a></li>
              <li><a href="#satellite" className="hover:text-amber-300 transition">INSAT-3D/3DR Satellite Meteorology</a></li>
              <li><a href="#agromet" className="hover:text-amber-300 transition">Gramin Krishi Mausam Sewa (Agromet)</a></li>
              <li><a href="#cyclone" className="hover:text-amber-300 transition">Cyclone Decision Support System (DSS)</a></li>
            </ul>
          </div>

          {/* Col 3: Helpful Links */}
          <div>
            <h4 className="text-white font-semibold text-sm border-b border-slate-700 pb-2 mb-3">
              Helpful Links
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#alerts" className="hover:text-cyan-300">Severe weather alerts</a></li>
              <li><a href="#map" className="hover:text-cyan-300">Weather map</a></li>
              <li><a href="#radar" className="hover:text-cyan-300">Radar and satellite</a></li>
              <li><a href="#about" className="hover:text-cyan-300">About this platform</a></li>
            </ul>
          </div>

          {/* Col 4: Platform Security & Provenance */}
          <div>
            <h4 className="text-white font-semibold text-sm border-b border-slate-700 pb-2 mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              Data Provenance
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {t.footerDisclaimer}
            </p>
            <div className="bg-[#13315c] p-2.5 rounded border border-slate-700 text-xs">
              <div className="text-emerald-400 font-semibold mb-1">Verification layer: Active</div>
              <div className="text-slate-300">Cross-referencing 550+ AWS stations with real-time social & citizen feeds.</div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & GIGW Compliance Bar */}
        <div className="border-t border-slate-700/60 pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 National Weather Big Data Analytics</p>
          <div className="flex flex-wrap items-center gap-4">
            <span>Website Policy</span>
            <span>•</span>
            <span>Accessibility Statement</span>
            <span>•</span>
            <span>Terms of Use</span>
            <span>•</span>
            <span>Hyperlink Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
