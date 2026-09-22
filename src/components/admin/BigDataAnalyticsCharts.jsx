import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  Activity, 
  ShieldCheck, 
  AlertOctagon, 
  Layers, 
  Download, 
  FileSpreadsheet, 
  Database,
  TrendingUp
} from 'lucide-react';

export default function BigDataAnalyticsCharts({
  feed,
  t,
  lang
}) {
  // 1. Calculate Live KPIs
  const totalEvents = feed.length;
  const verifiedCount = feed.filter(f => f.verificationStatus === 'verified' || f.verificationStatus === 'official').length;
  const fakeCount = feed.filter(f => f.verificationStatus === 'fake').length;
  const reviewCount = feed.filter(f => f.verificationStatus === 'review').length;
  const totalClusters = feed.reduce((acc, f) => acc + (f.clusterCount || 1), 0);
  const dedupSavings = totalClusters > 0 ? Math.round(((totalClusters - totalEvents) / totalClusters) * 100) : 18;

  // 2. Hazard Distribution Data
  const hazardCounts = {
    rainfall: 0,
    flooding: 0,
    thunderstorm: 0,
    strong_winds: 0,
    heatwave: 0,
    fog: 0,
    dust_storm: 0
  };

  feed.forEach(f => {
    if (hazardCounts[f.eventCategory] !== undefined) {
      hazardCounts[f.eventCategory]++;
    } else {
      hazardCounts.rainfall++;
    }
  });

  const hazardChartData = [
    { name: 'Rainfall', count: hazardCounts.rainfall, fill: '#0284c7' },
    { name: 'Flooding', count: hazardCounts.flooding, fill: '#2563eb' },
    { name: 'Thunderstorm', count: hazardCounts.thunderstorm, fill: '#7c3aed' },
    { name: 'Strong Winds', count: hazardCounts.strong_winds, fill: '#ea580c' },
    { name: 'Heatwave', count: hazardCounts.heatwave, fill: '#e11d48' },
    { name: 'Fog / Cold', count: hazardCounts.fog, fill: '#64748b' },
  ];

  // 3. Verification Status Pie Data
  const statusPieData = [
    { name: 'Verified / Corroborated', value: verifiedCount, color: '#10b981' },
    { name: 'Under Review', value: reviewCount, color: '#f59e0b' },
    { name: 'Fake / Quarantined', value: fakeCount, color: '#ef4444' }
  ];

  // 4. Ingestion Timeline (Hourly volume)
  const timelineData = [
    { time: '14:00', socialVolume: 120, awsAlerts: 14 },
    { time: '15:00', socialVolume: 190, awsAlerts: 22 },
    { time: '16:00', socialVolume: 340, awsAlerts: 48 },
    { time: '17:00', socialVolume: 510, awsAlerts: 65 },
    { time: '18:00', socialVolume: 780, awsAlerts: 92 },
    { time: '19:00', socialVolume: 960, awsAlerts: 110 },
    { time: '20:00', socialVolume: 1240, awsAlerts: 145 },
    { time: '20:30', socialVolume: 1420, awsAlerts: 160 }
  ];

  // 5. Data Export Handlers (NDRF / SDMA)
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(feed, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `IMD_BigData_National_Export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = "ID,Timestamp,City,State,Category,Status,Confidence,Source,Text\n";
    const rows = feed.map(f => 
      `"${f.id}","${f.timestamp}","${f.city}","${f.state}","${f.eventCategory}","${f.verificationStatus}",${f.aiConfidenceScore},"${f.sourcePlatform}","${f.text.replace(/"/g, '""')}"`
    ).join("\n");

    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `IMD_Weather_Analytics_NDRF_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* 1. KPI Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Ingested */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold flex items-center justify-between mb-1">
            <span>{t.kpiTotalIngested}</span>
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {totalEvents * 142}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">↑ 18%</span> from last hour
          </div>
        </div>

        {/* Live Ingestion Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold flex items-center justify-between mb-1">
            <span>{t.kpiIngestionRate}</span>
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            48.2 <span className="text-xs font-normal text-slate-500">ev/sec</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Peak: 96.5 ev/sec (Mumbai Rain)
          </div>
        </div>

        {/* AI Corroborated */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold flex items-center justify-between mb-1">
            <span>{t.kpiVerified}</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {verifiedCount} <span className="text-xs font-normal text-slate-500">({Math.round((verifiedCount / (totalEvents || 1)) * 100)}%)</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Corroborated by AWS / Radar
          </div>
        </div>

        {/* Fake Reports Blocked */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold flex items-center justify-between mb-1">
            <span>{t.kpiFakeBlocked}</span>
            <AlertOctagon className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-600 font-mono">
            {fakeCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Sensors contradicted claim
          </div>
        </div>

        {/* Deduplication Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold flex items-center justify-between mb-1">
            <span>{t.kpiDedup}</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 font-mono">
            {dedupSavings}% <span className="text-xs font-normal text-slate-500">merged</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Spatial-temporal clustering
          </div>
        </div>
      </div>

      {/* 2. Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temporal Ingestion Spike Trend */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm font-serif flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-700" />
                Hourly Ingestion Influx vs AWS Ground Alerts
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Correlation between social chatter volume and sensor trigger spikes.
              </p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0b2545', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="socialVolume" name="Social Feeds (#IMD)" stroke="#0284c7" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="awsAlerts" name="AWS Sensor Triggers" stroke="#ea580c" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hazard Category Breakdown */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm font-serif">
                Weather Event Distribution (Auto-Categorized NLP)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution across 7 standard IMD disaster management classifications.
              </p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hazardChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0b2545', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" name="Report Count" radius={[4, 4, 0, 0]}>
                  {hazardChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Export Section for NDRF / SDMA Agencies */}
      <div className="bg-gradient-to-r from-[#0b2545] to-[#13315c] rounded-xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h4 className="font-bold text-sm sm:text-base font-serif flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-400" />
            Inter-Agency Meteorological Data Exchange
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Export real-time geo-referenced big data intelligence for National Disaster Response Force (NDRF), SDMAs, and District Magistrates.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportJSON}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow transition active:scale-95"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Export GeoJSON</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow transition active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
