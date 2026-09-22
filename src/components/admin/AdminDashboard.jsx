import React, { useState } from 'react';
import { 
  Activity, 
  Sparkles, 
  ShieldAlert, 
  Radio, 
  FileText, 
  Layers, 
  RefreshCw 
} from 'lucide-react';
import DataFilterToolbar from './DataFilterToolbar';
import LiveIngestionFeed from './LiveIngestionFeed';
import AIVerificationWorkbench from './AIVerificationWorkbench';
import BigDataAnalyticsCharts from './BigDataAnalyticsCharts';

export default function AdminDashboard({
  t,
  lang,
  feed,
  onUpdateStatus,
  onTriggerSimulation,
  newsFeedStatus
}) {
  const [selectedItemId, setSelectedItemId] = useState(feed[0]?.id || null);
  const [filters, setFilters] = useState({
    dateRange: 'today',
    category: 'all',
    state: 'all',
    district: 'all',
    status: 'all',
    source: 'all',
    searchQuery: ''
  });

  const handleResetFilters = () => {
    setFilters({
      dateRange: 'today',
      category: 'all',
      state: 'all',
      district: 'all',
      status: 'all',
      source: 'all',
      searchQuery: ''
    });
  };

  // Apply filters
  const filteredFeed = feed.filter(item => {
    // 1. Category
    if (filters.category !== 'all' && item.eventCategory !== filters.category) return false;
    // 2. State
    if (filters.state !== 'all' && item.state !== filters.state) return false;
    // 3. Status
    if (filters.status !== 'all' && item.verificationStatus !== filters.status) return false;
    // 4. Source
    if (filters.source !== 'all' && item.source !== filters.source) return false;
    // 5. Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchText = item.text.toLowerCase().includes(q);
      const matchCity = item.city.toLowerCase().includes(q);
      const matchHandle = item.sourceHandle.toLowerCase().includes(q);
      const matchTags = item.tags?.some(tag => tag.toLowerCase().includes(q));
      if (!matchText && !matchCity && !matchHandle && !matchTags) return false;
    }
    return true;
  });

  const selectedItem = feed.find(f => f.id === selectedItemId) || filteredFeed[0] || null;

  return (
    <div className="space-y-6">
      {/* Admin Title & Overview Banner */}
      <div className="bg-[#0b2545] text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-serif">
              {t.adminTitle}
            </h2>
            <span className="bg-amber-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded uppercase">
              Live analytics workspace
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            {t.adminSubtitle}. Combining live weather news, public observations and sensor data for quick review.
          </p>
          <p className={`text-[11px] mt-2 font-semibold ${newsFeedStatus === 'live' ? 'text-emerald-300' : newsFeedStatus === 'error' ? 'text-amber-300' : 'text-slate-300'}`}>
            {newsFeedStatus === 'live' ? 'Live weather news connected' : newsFeedStatus === 'error' ? 'Live weather news unavailable; retry with Refresh Live News' : 'Connecting to live weather news...'}
          </p>
        </div>

        {/* Refresh the external news feed */}
        <button
          onClick={onTriggerSimulation}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow flex items-center gap-2 transition active:scale-95 shrink-0"
          title="Refresh live weather news"
        >
          <RefreshCw className="w-4 h-4 text-cyan-300" />
          <span>Refresh Live News</span>
        </button>
      </div>

      {/* 1. Multi-Dimensional Filter Toolbar */}
      <DataFilterToolbar
        t={t}
        lang={lang}
        filters={filters}
        setFilters={setFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 2. Big Data Analytics KPIs & Charts */}
      <BigDataAnalyticsCharts
        feed={filteredFeed}
        t={t}
        lang={lang}
      />

      {/* 3. Operational Grid: Live Ingestion Feed + AI Forensics Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Ingestion Stream (5 cols) */}
        <div className="lg:col-span-5">
          <LiveIngestionFeed
            items={filteredFeed}
            selectedItemId={selectedItem?.id}
            onSelectItem={(it) => setSelectedItemId(it.id)}
            t={t}
            lang={lang}
          />
        </div>

        {/* Right Column: AI Forensics Workbench (7 cols) */}
        <div className="lg:col-span-7">
          <AIVerificationWorkbench
            item={selectedItem}
            onUpdateStatus={onUpdateStatus}
            t={t}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
