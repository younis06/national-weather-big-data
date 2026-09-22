import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AuthoritativeAlertBanner from './components/public/AuthoritativeAlertBanner';
import LocationWeatherHub from './components/public/LocationWeatherHub';
import InteractiveWeatherMap from './components/public/InteractiveWeatherMap';
import SatelliteRadarViewer from './components/public/SatelliteRadarViewer';
import SpecializedServicesGrid from './components/public/SpecializedServicesGrid';
import CitizenReportModal from './components/public/CitizenReportModal';
import AdminDashboard from './components/admin/AdminDashboard';

import { translations } from './data/translations';
import { fetchLiveWeatherNews } from './services/liveNewsFeed';

export default function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('public'); // 'public' | 'admin'
  const [isStreaming, setIsStreaming] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState('md');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  // Big Data Ingested Feed State
  const [bigDataFeed, setBigDataFeed] = useState([]);
  const [newsFeedStatus, setNewsFeedStatus] = useState('loading');

  const t = translations[lang] || translations.en;

  const refreshLiveNews = async () => {
    try {
      const liveItems = await fetchLiveWeatherNews();
      setBigDataFeed((previous) => {
        const citizenItems = previous.filter((item) => item.source === 'citizen');
        return [...citizenItems, ...liveItems].slice(0, 50);
      });
      setNewsFeedStatus('live');
    } catch (error) {
      console.error('Unable to load live weather news:', error);
      setNewsFeedStatus('error');
    }
  };

  useEffect(() => {
    if (!isStreaming) return undefined;
    refreshLiveNews();
    const interval = setInterval(refreshLiveNews, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Handle citizen manual submission from modal
  const handleAddCitizenReport = (report) => {
    setBigDataFeed((prev) => [report, ...prev]);
  };

  // Handle Admin Verification status update (Approve, Flag as Fake, Escalate)
  const handleUpdateStatus = (id, newStatus) => {
    setBigDataFeed((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              verificationStatus: newStatus,
              aiConfidenceScore: newStatus === 'verified' ? 95 : newStatus === 'fake' ? 10 : 99
            }
          : item
      )
    );
  };

  // Manual Trigger for Stream Pulse
  const handleTriggerSimulation = () => {
    refreshLiveNews();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb] text-slate-800 font-sans transition-colors">
      {/* 1. Official Government Header */}
      <Header
        lang={lang}
        setLang={setLang}
        t={t}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isStreaming={isStreaming}
        setIsStreaming={setIsStreaming}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        textSize={textSize}
        setTextSize={setTextSize}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* 2. Main Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6" id="main-content">
        {activeTab === 'public' ? (
          /* PUBLIC IMD MAUSAM PORTAL */
          <div className="space-y-6">
            {/* Authoritative Severe Disaster Warnings (WCAG Compliant) */}
            <AuthoritativeAlertBanner t={t} lang={lang} />

            {/* Location-Centric Weather Experience (Nowcast & 7-Day) */}
            <LocationWeatherHub
              t={t}
              lang={lang}
              selectedStation={selectedStation}
              setSelectedStation={setSelectedStation}
            />

            {/* National Geospatial Interactive Weather & Big Data Map */}
            <InteractiveWeatherMap
              t={t}
              lang={lang}
              bigDataFeed={bigDataFeed}
              selectedStation={selectedStation}
              onSelectStation={(st) => setSelectedStation(st)}
            />

            {/* Live Doppler Radar & INSAT-3D Satellite Viewer */}
            <SatelliteRadarViewer t={t} lang={lang} />

            {/* Core Specialized IMD Services (Agromet, Cyclone, Damini, etc.) */}
            <SpecializedServicesGrid t={t} lang={lang} />
          </div>
        ) : (
          /* Live weather analytics workspace */
          <AdminDashboard
            t={t}
            lang={lang}
            feed={bigDataFeed}
            onUpdateStatus={handleUpdateStatus}
            onTriggerSimulation={handleTriggerSimulation}
            newsFeedStatus={newsFeedStatus}
          />
        )}
      </main>

      {/* 3. Official Government Footer */}
      <Footer t={t} lang={lang} />

      {/* 4. Jan-Mausam Citizen Reporting Modal */}
      <CitizenReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        t={t}
        lang={lang}
        onAddReport={handleAddCitizenReport}
        existingReports={bigDataFeed}
      />
    </div>
  );
}
