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
              Mausam Bhawan, Lodhi Road, New Delhi - 110003.<br />
              Ministry of Earth Sciences, Government of India.
            </p>
            <p className="text-xs text-slate-400">
              National 24x7 Weather Helpline: <span className="text-amber-400 font-bold">1800-180-1717</span> / 1070
            </p>
          </div>

          {/* Col 2: Core Weather Services */}
          <div>
            <h4 className="text-white font-semibold text-sm border-b border-slate-700 pb-2 mb-3">
              Authoritative Forecasts
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

          {/* Col 3: Government Portals & RTI */}
          <div>
            <h4 className="text-white font-semibold text-sm border-b border-slate-700 pb-2 mb-3">
              Government Links
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="https://moes.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">Ministry of Earth Sciences <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://ndma.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">National Disaster Management (NDMA) <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://data.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">Open Government Data (OGD India) <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="#charter" className="hover:text-amber-300">Citizen's Charter & Grievance</a></li>
              <li><a href="#rti" className="hover:text-amber-300">Right to Information (RTI)</a></li>
              <li><a href="#posh" className="hover:text-amber-300">PoSH & Internal Complaints</a></li>
            </ul>
          </div>

          {/* Col 4: Platform Security & Provenance */}
          <div>
            <h4 className="text-white font-semibold text-sm border-b border-slate-700 pb-2 mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              Big Data Provenance
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {t.footerDisclaimer}
            </p>
            <div className="bg-[#13315c] p-2.5 rounded border border-slate-700 text-xs">
              <div className="text-emerald-400 font-semibold mb-1">AI Verification Tier: Active</div>
              <div className="text-slate-300">Cross-referencing 550+ AWS stations with real-time social & citizen feeds.</div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & GIGW Compliance Bar */}
        <div className="border-t border-slate-700/60 pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>{t.footerRights}</p>
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
