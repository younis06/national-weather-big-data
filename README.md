# IMD MAUSAM: National Weather Big Data Analytics Platform
**Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)**  
**Problem Statement ID**: 26069  
**Theme**: Disaster Management & Public Weather Intelligence  

---

## Overview
A scalable National Weather Big Data Analytics Platform and redesigned IMD MAUSAM portal that collects, processes, verifies, and visualizes weather intelligence across India from social media (#IMD), crowdsourced citizen observations (Jan-Mausam), public datasets, Doppler radars, and automated weather stations (AWS).

---

## Key Features

### 1. Dual-Portal Experience
- **Public MAUSAM Portal**:
  - GIGW-compliant government digital service preserving IMD credibility and terminology.
  - WCAG 2.1 AA accessible warnings (Red, Orange, Yellow, Green) with tactile patterns for color-blind users.
  - Location-Centric Weather Hub with browser geolocation, station telemetry, 24-hour precipitation bar charts, and 7-day outlooks.
  - Interactive GIS map fusing official radar echoes, AWS stations, and citizen incident reports.
  - Jan-Mausam Citizen Observation tool with instant AI verification against nearest sensors.
  - Animated Doppler Weather Radar mosaic and INSAT-3D satellite imagery viewer.
  - Full bilingual localization (English & हिन्दी / Hindi), text scalers (A-, A, A+), and high-contrast toggle.

- **Big Data Command Center & Admin Panel**:
  - Multi-dimensional query filters: Date-wise, Event-wise, Location-wise, Verification Status, and Source Channel.
  - AI Fake-Report Detector: Cross-references claims against physical AWS telemetry and Doppler radar reflectivity to quarantine fabricated alerts.
  - Deduplication Engine: Clusters spatial-temporal duplicates within 3km.
  - Natural Language Processing (NLP) classifier: Standardizes into 7 disaster categories (Rainfall, Flooding, Thunderstorm, Strong Winds, Heatwave, Fog, Dust Storm).
  - Meteorological Forensics Workbench: 1-click Approve, Quarantine as Disinformation, or Escalate to Nowcast Alert.
  - Inter-agency data export (GeoJSON & CSV) for NDRF and State Disaster Management Authorities.

---

## Quick Start Instructions

```bash
# 1. Navigate to the project directory
cd C:\Users\younis\.gemini\antigravity\scratch\imd-mausam-bigdata

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
http://localhost:5173/

# 5. Run production build
npm run build
```

### Live weather news feed

The admin ingestion feed reads current India weather/IMD articles from Google News RSS
through the Vite development proxy at `/api/weather-news`. Articles are labeled as
`REVIEW` and are not treated as official IMD warnings until verified by an operator.
When that proxy is unavailable, including on static GitHub Pages hosting, the feed
automatically falls back to live Open-Meteo observations for major Indian cities so
the dashboard continues to receive current data.

### Requirement coverage

- Multi-source ingestion: live weather-news RSS plus browser-submitted public observations.
- Event understanding: reports are classified into rainfall, flooding, thunderstorms, wind,
  heatwave, fog and dust-storm categories.
- Verification: reports have `verified`, `review`, `fake` and `official` states with an
  operator workbench for status changes.
- Deduplication: duplicate live articles are removed by source URL/content identity; public
  observations retain spatial duplicate-cluster metadata.
- Dashboard analysis: the admin view supports date, custom date, event, state, district/city,
  verification, source and text filters. The map and charts use the filtered records.
- Central storage: not yet implemented. The current application keeps data in browser memory
  and external APIs; a shared PostgreSQL/Supabase backend is required for persistent,
  multi-user centralized storage.
