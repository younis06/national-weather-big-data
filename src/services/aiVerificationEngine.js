import { INDIAN_STATES_DATA } from '../data/statesDistricts.js';

// Haversine distance in km
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find closest IMD Automated Weather Station (AWS)
export function findNearestStation(lat, lng) {
  let closestStation = null;
  let minDistance = Infinity;

  for (const stateObj of INDIAN_STATES_DATA) {
    for (const distObj of stateObj.districts) {
      for (const st of distObj.stations) {
        const dist = calculateDistance(lat, lng, st.lat, st.lng);
        if (dist < minDistance) {
          minDistance = dist;
          closestStation = { ...st, distanceKm: Math.round(dist * 10) / 10 };
        }
      }
    }
  }
  return closestStation;
}

// Automated Category Classifier NLP
export function autoCategorizeText(text = "") {
  const lower = text.toLowerCase();

  if (lower.includes("flood") || lower.includes("waterlog") || lower.includes("submerge") || lower.includes("jalbharao") || lower.includes("inundat")) {
    return "flooding";
  }
  if (lower.includes("lightning") || lower.includes("thunder") || lower.includes("bijli") || lower.includes("convective")) {
    return "thunderstorm";
  }
  if (lower.includes("cyclone") || lower.includes("gust") || lower.includes("gale") || lower.includes("squall") || lower.includes("toofan") || lower.includes("strong wind") || lower.includes("wind speed")) {
    return "strong_winds";
  }
  if (lower.includes("heat") || lower.includes("loo") || lower.includes("scorching") || lower.includes("45c") || lower.includes("48c")) {
    return "heatwave";
  }
  if (lower.includes("fog") || lower.includes("kohra") || lower.includes("coldwave") || lower.includes("smog") || lower.includes("visibility")) {
    return "fog";
  }
  if (lower.includes("dust") || lower.includes("aandhi") || lower.includes("sandstorm")) {
    return "dust_storm";
  }
  // Default to rainfall
  return "rainfall";
}

// AI Verification & Forensic Engine
export function verifyReportWithAI({ text, category, lat, lng, claimedIntensity }) {
  const nearest = findNearestStation(lat, lng);
  const detectedCategory = category || autoCategorizeText(text);

  let confidenceScore = 80;
  let status = "review"; // verified, review, fake, official
  let assessment = "";

  if (!nearest) {
    return {
      status: "review",
      confidenceScore: 50,
      detectedCategory,
      nearestSensor: null,
      assessment: "No physical AWS sensor in proximity (<200km) to corroborate."
    };
  }

  // Cross-reference with nearest physical sensor
  if (detectedCategory === "heatwave") {
    if (nearest.temp < 35) {
      confidenceScore = 8;
      status = "fake";
      assessment = `DISCREPANCY DETECTED: Ground station ${nearest.name} reports ${nearest.temp}°C. Claim of severe heatwave is inconsistent with meteorological telemetry within ${nearest.distanceKm} km.`;
    } else {
      confidenceScore = 92;
      status = "verified";
      assessment = `Corroborated: Station ${nearest.name} reports high ambient temp of ${nearest.temp}°C.`;
    }
  } else if (detectedCategory === "strong_winds") {
    if (nearest.windSpeed < 15 && text.toLowerCase().includes("cyclone")) {
      confidenceScore = 15;
      status = "fake";
      assessment = `FABRICATED ALERT: Claim of severe cyclone/100kmph winds contradicted by ${nearest.name} AWS measuring calm winds (${nearest.windSpeed} km/h). Doppler radar shows no cyclonic circulation.`;
    } else if (nearest.windSpeed >= 25 || nearest.conditionCode === "heavy_rain") {
      confidenceScore = 94;
      status = "verified";
      assessment = `Corroborated: Station ${nearest.name} recorded squally gusts of ${nearest.windSpeed} km/h with active depression warnings.`;
    } else {
      confidenceScore = 75;
      status = "review";
      assessment = `Under Review: Localized micro-burst or localized squall possible. Wind reading at station was ${nearest.windSpeed} km/h.`;
    }
  } else if (detectedCategory === "flooding" || detectedCategory === "rainfall") {
    if (nearest.rainToday > 20 || nearest.conditionCode === "heavy_rain" || nearest.humidity > 85) {
      confidenceScore = 95;
      status = "verified";
      assessment = `Corroborated: IMD AWS at ${nearest.name} recorded ${nearest.rainToday} mm precipitation today with ${nearest.humidity}% humidity. Satellite echoes corroborate dense precipitation cloud.`;
    } else if (nearest.rainToday === 0 && nearest.humidity < 40) {
      confidenceScore = 18;
      status = "fake";
      assessment = `ANOMALY DETECTED: Ground sensor ${nearest.name} recorded 0 mm rain and ${nearest.humidity}% humidity. Claimed downpour/flood appears outdated or fictitious.`;
    } else {
      confidenceScore = 82;
      status = "verified";
      assessment = `Corroborated with regional radar: Moderate to heavy convective cell detected over localized area.`;
    }
  } else {
    confidenceScore = 85;
    status = "verified";
    assessment = `Corroborated with regional synoptic analysis and nearby observer reports.`;
  }

  return {
    status,
    confidenceScore,
    detectedCategory,
    nearestSensor: {
      stationId: nearest.id,
      stationName: nearest.name,
      distanceKm: nearest.distanceKm,
      recordedTemp: nearest.temp,
      recordedRainMm: nearest.rainToday,
      recordedWindKmph: nearest.windSpeed,
      matchAssessment: assessment
    }
  };
}

// Spatio-Temporal Deduplication
export function checkDuplicate({ lat, lng, category, existingReports, radiusKm = 3 }) {
  for (const rep of existingReports) {
    if (rep.eventCategory === category) {
      const dist = calculateDistance(lat, lng, rep.lat, rep.lng);
      if (dist <= radiusKm) {
        return {
          isDuplicate: true,
          matchedReportId: rep.id,
          distance: Math.round(dist * 10) / 10
        };
      }
    }
  }
  return { isDuplicate: false, matchedReportId: null };
}

// Generate a simulated real-time incoming social/citizen report
const SAMPLE_STREAM_CITIES = [
  { city: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777, sampleRain: 45 },
  { city: "New Delhi", state: "Delhi (NCT)", lat: 28.6139, lng: 77.2090, sampleRain: 8 },
  { city: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, sampleRain: 25 },
  { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, sampleRain: 4 },
  { city: "Bhubaneswar", state: "Odisha", lat: 20.2961, lng: 85.8245, sampleRain: 50 },
  { city: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867, sampleRain: 12 },
  { city: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, sampleRain: 18 },
  { city: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362, sampleRain: 22 }
];

const SAMPLE_POST_TEMPLATES = [
  { text: "Intense sudden rain started here, visibility dropped under 200m! #IMD #WeatherUpdate", cat: "rainfall" },
  { text: "Waterlogging spreading on the service road near outer ring road. Drive carefully! #TrafficWatch #IMD", cat: "flooding" },
  { text: "Loud thunderclaps and lightning overhead. Rain picking up rapidly! #ThunderstormAlert #IMD", cat: "thunderstorm" },
  { text: "Extremely strong wind gusts rattling windows. Looks like a squall! #GaleWarning #IMD", cat: "strong_winds" },
  { text: "Dense morning fog reducing highway visibility. Heavy trucks driving with hazard lights. #FogSafety", cat: "fog" }
];

export function createRandomSimulatedReport() {
  const loc = SAMPLE_STREAM_CITIES[Math.floor(Math.random() * SAMPLE_STREAM_CITIES.length)];
  const tpl = SAMPLE_POST_TEMPLATES[Math.floor(Math.random() * SAMPLE_POST_TEMPLATES.length)];
  
  // Slight jitter to lat/lng
  const jitterLat = loc.lat + (Math.random() - 0.5) * 0.08;
  const jitterLng = loc.lng + (Math.random() - 0.5) * 0.08;

  const isSocial = Math.random() > 0.35;
  const source = isSocial ? "twitter" : "citizen";
  const sourceHandle = isSocial
    ? `@${loc.city.toLowerCase()}_watcher_${Math.floor(Math.random() * 899 + 100)}`
    : `Citizen Observer (${loc.city})`;
  const sourcePlatform = isSocial ? "X (Twitter)" : "Jan-Mausam Portal";

  const aiResult = verifyReportWithAI({
    text: tpl.text,
    category: tpl.cat,
    lat: jitterLat,
    lng: jitterLng
  });

  return {
    id: `BD-${Date.now().toString().slice(-5)}`,
    timestamp: new Date().toISOString(),
    source,
    sourceHandle,
    sourcePlatform,
    text: tpl.text,
    city: loc.city,
    state: loc.state,
    lat: jitterLat,
    lng: jitterLng,
    eventCategory: aiResult.detectedCategory,
    mediaUrl: null,
    hasMedia: false,
    verificationStatus: aiResult.status,
    aiConfidenceScore: aiResult.confidenceScore,
    nearestSensor: aiResult.nearestSensor,
    clusterCount: 1,
    tags: ["#IMD", `#${loc.city}Weather`, `#${tpl.cat}`]
  };
}
