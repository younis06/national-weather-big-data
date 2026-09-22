const CATEGORY_RULES = [
  { category: 'flooding', words: ['flood', 'waterlog', 'inundat'] },
  { category: 'thunderstorm', words: ['thunder', 'lightning', 'storm'] },
  { category: 'strong_winds', words: ['cyclone', 'wind', 'gale'] },
  { category: 'heatwave', words: ['heatwave', 'heat wave', 'hot'] },
  { category: 'fog', words: ['fog', 'visibility'] },
  { category: 'rainfall', words: ['rain', 'monsoon', 'downpour', 'weather'] }
];

function detectCategory(text) {
  const haystack = text.toLowerCase();
  return CATEGORY_RULES.find((rule) => rule.words.some((word) => haystack.includes(word)))?.category || 'rainfall';
}

function findLocation(text) {
  const locations = [
    ['Mumbai', 'Maharashtra'], ['Delhi', 'Delhi (NCT)'], ['Kolkata', 'West Bengal'],
    ['Chennai', 'Tamil Nadu'], ['Bengaluru', 'Karnataka'], ['Bangalore', 'Karnataka'],
    ['Hyderabad', 'Telangana'], ['Pune', 'Maharashtra'], ['Odisha', 'Odisha'],
    ['West Bengal', 'West Bengal'], ['Kerala', 'Kerala'], ['Assam', 'Assam']
  ];
  const match = locations.find(([city]) => text.toLowerCase().includes(city.toLowerCase()));
  return match ? { city: match[0], state: match[1] } : { city: 'India', state: 'National' };
}

export async function fetchLiveWeatherNews() {
  try {
    const response = await fetch('/api/weather-news');
    if (!response.ok) throw new Error(`Live news feed returned HTTP ${response.status}.`);

    const xml = new DOMParser().parseFromString(await response.text(), 'application/xml');
    if (xml.querySelector('parsererror')) throw new Error('Live news feed returned invalid XML.');

    return Array.from(xml.querySelectorAll('item')).slice(0, 30).map((item, index) => {
      const title = item.querySelector('title')?.textContent?.trim() || 'Weather news update';
      const description = item.querySelector('description')?.textContent?.replace(/<[^>]+>/g, '').trim() || title;
      const location = findLocation(`${title} ${description}`);
      const timestamp = item.querySelector('pubDate')?.textContent || new Date().toISOString();
      const category = detectCategory(`${title} ${description}`);

      return {
        id: `NEWS-${Date.parse(timestamp) || Date.now()}-${index}`,
        timestamp: new Date(timestamp).toISOString(),
        source: 'news',
        sourceHandle: item.querySelector('source')?.textContent?.trim() || 'Google News',
        sourcePlatform: 'Google News RSS',
        text: `${title}${description && description !== title ? ` — ${description}` : ''}`,
        city: location.city,
        state: location.state,
        lat: null,
        lng: null,
        eventCategory: category,
        mediaUrl: null,
        hasMedia: false,
        verificationStatus: 'review',
        aiConfidenceScore: 0,
        nearestSensor: null,
        clusterCount: 1,
        tags: ['Live news', '#Weather', '#IMD'],
        externalUrl: item.querySelector('link')?.textContent?.trim() || null
      };
    });
  } catch (error) {
    console.warn('News proxy unavailable; loading live weather observations instead.', error);
    return fetchLiveWeatherObservations();
  }
}

const OBSERVATION_LOCATIONS = [
  ['Delhi', 'Delhi (NCT)', 28.6139, 77.2090],
  ['Mumbai', 'Maharashtra', 19.0760, 72.8777],
  ['Bengaluru', 'Karnataka', 12.9716, 77.5946],
  ['Kolkata', 'West Bengal', 22.5726, 88.3639],
  ['Chennai', 'Tamil Nadu', 13.0827, 80.2707],
  ['Hyderabad', 'Telangana', 17.3850, 78.4867],
  ['Bhubaneswar', 'Odisha', 20.2961, 85.8245],
  ['Guwahati', 'Assam', 26.1445, 91.7362]
];

async function fetchLiveWeatherObservations() {
  const records = await Promise.all(OBSERVATION_LOCATIONS.map(async ([city, state, lat, lng]) => {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.search = new URLSearchParams({
      latitude: lat,
      longitude: lng,
      current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
      timezone: 'auto'
    });
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Weather observation failed for ${city}.`);
    const data = await response.json();
    const current = data.current;
    return {
      id: `OBS-${city}-${current.time}`,
      timestamp: new Date(current.time).toISOString(),
      source: 'weather_api',
      sourceHandle: 'Open-Meteo live observation',
      sourcePlatform: 'Open-Meteo',
      text: `${city} live observation: ${current.temperature_2m}°C, ${current.relative_humidity_2m}% humidity, ${current.wind_speed_10m} km/h wind, ${current.precipitation} mm precipitation. Weather code ${current.weather_code}.`,
      city,
      state,
      lat,
      lng,
      eventCategory: current.precipitation > 0 ? 'rainfall' : 'rainfall',
      mediaUrl: null,
      hasMedia: false,
      verificationStatus: 'official',
      aiConfidenceScore: 100,
      nearestSensor: null,
      clusterCount: 1,
      tags: ['Live observation', '#Weather', '#OpenMeteo'],
      externalUrl: 'https://open-meteo.com/'
    };
  }));
  return records;
}
