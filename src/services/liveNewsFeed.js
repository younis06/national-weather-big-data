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
}
