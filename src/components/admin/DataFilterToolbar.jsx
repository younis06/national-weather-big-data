import React from 'react';
import { 
  Filter, 
  Calendar, 
  MapPin, 
  Tag, 
  CheckCircle, 
  Search, 
  RotateCcw,
  Share2
} from 'lucide-react';
import { INDIAN_STATES_DATA } from '../../data/statesDistricts';

export default function DataFilterToolbar({
  t,
  lang,
  filters,
  setFilters,
  onResetFilters
}) {
  const handleStateChange = (e) => {
    const val = e.target.value;
    setFilters(prev => ({
      ...prev,
      state: val,
      district: 'all' // reset district when state changes
    }));
  };

  const selectedStateObj = INDIAN_STATES_DATA.find(s => s.state === filters.state);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-blue-700" />
          <h3 className="font-bold text-sm sm:text-base text-slate-900 font-serif">
            Multi-Dimensional Intelligence Filter
          </h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
            Big Data Query Engine
          </span>
        </div>

        {/* Free text search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search #tag, city, keyword..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            onClick={onResetFilters}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 font-semibold flex items-center gap-1 transition"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 5-Dimensional Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 text-xs">
        {/* 1. Date-wise Filter */}
        <div>
          <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            {t.filterDate}
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="today">Today (21-Sep-2026)</option>
            <option value="24h">Past 24 Hours</option>
            <option value="7d">Past 7 Days</option>
            <option value="all">All Ingested Records</option>
          </select>
        </div>

        {/* 2. Event-wise Filter */}
        <div>
          <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-purple-600" />
            {t.filterEvent}
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="all">All Categories</option>
            <option value="rainfall">{t.catRainfall}</option>
            <option value="flooding">{t.catFlooding}</option>
            <option value="thunderstorm">{t.catThunderstorm}</option>
            <option value="strong_winds">{t.catStrongWinds}</option>
            <option value="heatwave">{t.catHeatwave}</option>
            <option value="fog">{t.catFog}</option>
            <option value="dust_storm">{t.catDustStorm}</option>
          </select>
        </div>

        {/* 3. Location-wise Filter (State) */}
        <div>
          <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            State / UT
          </label>
          <select
            value={filters.state}
            onChange={handleStateChange}
            className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="all">All India (National)</option>
            {INDIAN_STATES_DATA.map((st) => (
              <option key={st.stateCode} value={st.state}>
                {st.state}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Verification Status Tracking */}
        <div>
          <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            {t.filterStatus}
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="all">{t.statusAll}</option>
            <option value="verified">{t.statusVerified}</option>
            <option value="review">{t.statusReview}</option>
            <option value="fake">{t.statusFake}</option>
            <option value="official">{t.statusOfficial}</option>
          </select>
        </div>

        {/* 5. Source Stream Filter */}
        <div>
          <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5 text-cyan-600" />
            {t.filterSource}
          </label>
          <select
            value={filters.source}
            onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="all">All Channels (Unified)</option>
            <option value="twitter">X / Twitter (#IMD)</option>
            <option value="citizen">Jan-Mausam (Citizen App)</option>
            <option value="public_api">Public Datasets & Buoys</option>
          </select>
        </div>
      </div>
    </div>
  );
}
