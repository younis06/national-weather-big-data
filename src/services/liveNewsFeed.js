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

const STOP_WORDS = new Set(['the', 'and', 'for', 'from', 'with', 'will', 'into', 'over', 'near', 'today', 'latest', 'weather', 'imd']);

function storyKey(item) {
  const words = item.text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word));
  return new Set(words);
}

function relatedStories(items) {
  const groups = [];
  for (const item of items) {
    const words = storyKey(item);
    const match = groups.find((group) => {
      if (group.category !== item.eventCategory || group.city !== item.city) return false;
      const overlap = [...words].filter((word) => group.words.has(word)).length;
      return overlap / Math.max(1, Math.min(words.size, group.words.size)) >= 0.45;
    });
    if (match) {
      match.items.push(item);
      words.forEach((word) => match.words.add(word));
    } else {
      groups.push({ category: item.eventCategory, city: item.city, words, items: [item] });
    }
  }

  return groups.map((group) => {
    const sources = [...new Map(group.items.map((item) => [item.sourceHandle, {
      name: item.sourceHandle,
      url: item.externalUrl
    }])).values()];
    const primary = group.items[0];
    return {
      ...primary,
      id: `NEWS-GROUP-${group.items.map((item) => item.id).sort().join('-')}`,
      sourceHandle: sources.length > 1 ? `${sources.length} independent sources` : primary.sourceHandle,
      sourceCount: sources.length,
      relatedSources: sources,
      clusterCount: group.items.length,
      verificationStatus: sources.length > 1 ? 'verified' : 'review',
      aiConfidenceScore: sources.length > 1 ? Math.min(90, 55 + sources.length * 10) : 0,
      text: sources.length > 1
        ? `${primary.text} Corroborated by ${sources.length} independent publishers.`
        : primary.text
    };
  });
}

export async function fetchLiveWeatherNews() {
  try {
    const response = await fetch('/api/weather-news');
    if (!response.ok) throw new Error(`Live news feed returned HTTP ${response.status}.`);

    const xml = new DOMParser().parseFromString(await response.text(), 'application/xml');
    if (xml.querySelector('parsererror')) throw new Error('Live news feed returned invalid XML.');

    const items = Array.from(xml.querySelectorAll('item')).slice(0, 50).map((item, index) => {
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
    return relatedStories(items);
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
