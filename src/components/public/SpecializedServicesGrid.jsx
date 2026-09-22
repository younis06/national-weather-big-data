import React from 'react';
import { 
  Sprout, 
  Wind, 
  Zap, 
  Plane, 
  Compass, 
  Waves, 
  Map, 
  Building2, 
  ChevronRight 
} from 'lucide-react';

export default function SpecializedServicesGrid({ t, lang }) {
  const services = [
    {
      id: "agromet",
      title: t.agrometTitle,
      desc: t.agrometDesc,
      icon: <Sprout className="w-6 h-6 text-emerald-600" />,
      tag: "GKMS",
      badgeColor: "bg-emerald-100 text-emerald-800",
      href: "https://imdpune.gov.in"
    },
    {
      id: "cyclone",
      title: t.cycloneTitle,
      desc: t.cycloneDesc,
      icon: <Wind className="w-6 h-6 text-cyan-600" />,
      tag: "DSS Active",
      badgeColor: "bg-cyan-100 text-cyan-800",
      href: "https://rsmcnewdelhi.imd.gov.in"
    },
    {
      id: "damini",
      title: t.daminiTitle,
      desc: t.daminiDesc,
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      tag: "20km Warning",
      badgeColor: "bg-amber-100 text-amber-800",
      href: "#damini"
    },
    {
      id: "aviation",
      title: t.aviationTitle,
      desc: t.aviationDesc,
      icon: <Plane className="w-6 h-6 text-blue-600" />,
      tag: "METAR/TAF",
      badgeColor: "bg-blue-100 text-blue-800",
      href: "#aviation"
    },
    {
      id: "pilgrimage",
      title: t.pilgrimageTitle,
      desc: t.pilgrimageDesc,
      icon: <Compass className="w-6 h-6 text-purple-600" />,
      tag: "Yatra Guidance",
      badgeColor: "bg-purple-100 text-purple-800",
      href: "#pilgrimage"
    },
    {
      id: "marine",
      title: t.marineTitle,
      desc: t.marineDesc,
      icon: <Waves className="w-6 h-6 text-teal-600" />,
      tag: "Sea State",
      badgeColor: "bg-teal-100 text-teal-800",
      href: "#marine"
    },
    {
      id: "chva",
      title: "Climate Hazard Atlas",
      desc: "Vulnerability maps for extreme weather events, cyclones, floods and heatwaves.",
      icon: <Map className="w-6 h-6 text-rose-600" />,
      tag: "CHVA",
      badgeColor: "bg-rose-100 text-rose-800",
      href: "https://imdpune.gov.in/hazardatlas"
    },
    {
      id: "ums",
      title: "Urban Met Services",
      desc: "Smart city automatic rainfall stations, street flooding nowcasts, and air quality.",
      icon: <Building2 className="w-6 h-6 text-indigo-600" />,
      tag: "Smart Cities",
      badgeColor: "bg-indigo-100 text-indigo-800",
      href: "#ums"
    }
  ];

  return (
    <section className="w-full bg-white rounded-xl shadow-md border border-slate-200 p-5 sm:p-6 mb-8" aria-label="Specialized Meteorological Services">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-serif">
            {t.specializedServicesTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dedicated sector-specific meteorological decision-support divisions of IMD.
          </p>
        </div>
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          8 Active National Divisions
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="group p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-white border border-slate-200 group-hover:scale-105 transition">
                  {svc.icon}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${svc.badgeColor}`}>
                  {svc.tag}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-800 transition">
                {svc.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {svc.desc}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-blue-700 group-hover:text-blue-900">
              <span>Access Portal</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
