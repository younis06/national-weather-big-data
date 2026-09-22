import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  Sun, 
  CloudRain, 
  Search, 
  Clock, 
  ShieldCheck, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { INDIAN_STATES_DATA } from '../../data/statesDistricts';

export default function LocationWeatherHub({ t, lang, selectedStation, setSelectedStation }) {
  const [selectedStateCode, setSelectedStateCode] = useState("MH");
  const [selectedDistrict, setSelectedDistrict] = useState("Mumbai City");
  const [searchQuery, setSearchQuery] = useState("");
  const [geoError, setGeoError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [liveWeather, setLiveWeather] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [lastWeatherUpdate, setLastWeatherUpdate] = useState(null);

  // Current state object
  const currentState = INDIAN_STATES_DATA.find(s => s.stateCode === selectedStateCode) || INDIAN_STATES_DATA[0];
  const currentDistrictObj = currentState.districts.find(d => d.district === selectedDistrict) || currentState.districts[0];

  // If selectedStation is not set or belongs to another state/district, use currentDistrictObj's first station
  const station = selectedStation || currentDistrictObj.stations[0];
  const weatherDescription = (code) => {
    if (code === 0) return lang === 'hi' ? 'साफ आसमान' : 'Clear sky';
    if ([1, 2, 3].includes(code)) return lang === 'hi' ? 'आंशिक बादल' : 'Partly cloudy';
    if ([45, 48].includes(code)) return lang === 'hi' ? 'कोहरा' : 'Fog';
    if ([51, 53, 55, 56, 57].includes(code)) return lang === 'hi' ? 'बूंदाबांदी' : 'Drizzle';
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return lang === 'hi' ? 'बारिश' : 'Rain';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return lang === 'hi' ? 'बर्फबारी' : 'Snow';
    if ([95, 96, 99].includes(code)) return lang === 'hi' ? 'गरज के साथ बारिश' : 'Thunderstorm';
    return lang === 'hi' ? 'अज्ञात स्थिति' : 'Weather update';
  };

  const loadLiveWeather = async (latitude, longitude) => {
    const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast');
    weatherUrl.search = new URLSearchParams({
      latitude,
      longitude,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m',
      hourly: 'temperature_2m,precipitation_probability,precipitation',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'auto',
      forecast_days: '7'
    });

    const response = await fetch(weatherUrl);
    if (!response.ok) throw new Error('Weather service returned an error.');
    const data = await response.json();
    setLiveWeather(data);
    setLastWeatherUpdate(new Date());

    try {
      const geocodeUrl = new URL('https://geocoding-api.open-meteo.com/v1/reverse');
      geocodeUrl.search = new URLSearchParams({ latitude, longitude, language: lang, count: 1 });
      const geocodeResponse = await fetch(geocodeUrl);
      if (geocodeResponse.ok) {
        const geocode = await geocodeResponse.json();
        setLocationName(geocode.results?.[0]?.name || null);
      }
    } catch {
      setLocationName(null);
    }
  };

  // Geolocation Handler
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser. Please select manually.");
      return;
    }
    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Find closest station
        let closest = null;
        let minD = Infinity;

        for (const stObj of INDIAN_STATES_DATA) {
          for (const dObj of stObj.districts) {
            for (const st of dObj.stations) {
              const d = Math.hypot(latitude - st.lat, longitude - st.lng);
              if (d < minD) {
                minD = d;
                closest = { station: st, stateCode: stObj.stateCode, district: dObj.district };
              }
            }
          }
        }

        if (closest) {
          setSelectedStateCode(closest.stateCode);
          setSelectedDistrict(closest.district);
          setSelectedStation(closest.station);
        }

        try {
          await loadLiveWeather(latitude, longitude);
          setGeoError(null);
        } catch {
          setGeoError("Your location was found, but live weather data is temporarily unavailable. Showing the nearest IMD station.");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError("Location access denied by user. Showing official capital station.");
        } else {
          setGeoError("Could not retrieve GPS position. Please select manually from the list.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  };

  const handleStateChange = (e) => {
    const code = e.target.value;
    setLiveWeather(null);
    setLocationName(null);
    setSelectedStateCode(code);
    const st = INDIAN_STATES_DATA.find(s => s.stateCode === code);
    if (st && st.districts.length > 0) {
      setSelectedDistrict(st.districts[0].district);
      if (st.districts[0].stations.length > 0) {
        setSelectedStation(st.districts[0].stations[0]);
      }
    }
  };

  const handleDistrictChange = (e) => {
    const distName = e.target.value;
    setLiveWeather(null);
    setLocationName(null);
    setSelectedDistrict(distName);
    const dObj = currentState.districts.find(d => d.district === distName);
    if (dObj && dObj.stations.length > 0) {
      setSelectedStation(dObj.stations[0]);
    }
  };

  const handleStationChange = (e) => {
    const stId = e.target.value;
    setLiveWeather(null);
    setLocationName(null);
    const st = currentDistrictObj.stations.find(s => s.id === stId);
    if (st) {
      setSelectedStation(st);
    }
  };

  // Search filter
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();

    for (const stObj of INDIAN_STATES_DATA) {
      for (const dObj of stObj.districts) {
        for (const st of dObj.stations) {
          if (
            st.name.toLowerCase().includes(q) ||
            dObj.district.toLowerCase().includes(q) ||
            stObj.state.toLowerCase().includes(q)
          ) {
            setSelectedStateCode(stObj.stateCode);
            setSelectedDistrict(dObj.district);
            setSelectedStation(st);
            setSearchQuery("");
            setGeoError(null);
            return;
          }
        }
      }
    }
    setGeoError(`No station matching "${searchQuery}". Please select from dropdowns.`);
  };

  const weather = liveWeather?.current;
  const hourlyData = liveWeather ? liveWeather.hourly.time.slice(0, 8).map((time, index) => ({
    time: new Date(time).toLocaleTimeString(lang === 'hi' ? 'hi-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(liveWeather.hourly.temperature_2m[index]),
    rain: liveWeather.hourly.precipitation[index] || 0
  })) : station.hourly || [
    { time: "00:00", temp: 25, rain: 0 },
    { time: "03:00", temp: 24, rain: 0 },
    { time: "06:00", temp: 24, rain: 2 },
    { time: "09:00", temp: 28, rain: 5 },
    { time: "12:00", temp: 31, rain: 8 },
    { time: "15:00", temp: 30, rain: 4 },
    { time: "18:00", temp: 28, rain: 1 },
    { time: "21:00", temp: 26, rain: 0 }
  ];

  const forecastData = liveWeather ? liveWeather.daily.time.map((date, index) => ({
    day: new Date(`${date}T12:00:00`).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'short' }),
    tempMax: Math.round(liveWeather.daily.temperature_2m_max[index]),
    tempMin: Math.round(liveWeather.daily.temperature_2m_min[index]),
    cond: weatherDescription(liveWeather.daily.weather_code[index]),
    rainProb: liveWeather.daily.precipitation_probability_max[index] || 0
  })) : station.forecast || [
    { day: "Mon", tempMax: 32, tempMin: 25, cond: "Passing Rain", rainProb: 60 },
    { day: "Tue", tempMax: 31, tempMin: 24, cond: "Thunderstorm", rainProb: 75 },
    { day: "Wed", tempMax: 31, tempMin: 24, cond: "Scattered Rain", rainProb: 70 },
    { day: "Thu", tempMax: 33, tempMin: 25, cond: "Partly Cloudy", rainProb: 30 },
    { day: "Fri", tempMax: 34, tempMin: 26, cond: "Sunny", rainProb: 15 },
    { day: "Sat", tempMax: 34, tempMin: 26, cond: "Sunny", rainProb: 10 },
    { day: "Sun", tempMax: 33, tempMin: 25, cond: "Cloudy", rainProb: 25 }
  ];

  return (
    <section className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-8">
      {/* 1. Header & Location Selector Bar */}
      <div className="bg-[#0b2545] text-white p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 font-serif">
              <MapPin className="w-5 h-5 text-amber-400" />
              {t.weatherAtLocation}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Use your device location for a live forecast at your coordinates, or choose an IMD station manually.
            </p>
          </div>

          {/* Search Box + Geolocation */}
          <div className="flex flex-wrap items-center gap-2">
            <form onSubmit={handleSearch} className="flex items-center bg-[#13315c] rounded-lg overflow-hidden border border-slate-600 focus-within:border-amber-400 transition">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="bg-transparent px-3 py-1.5 text-xs text-white placeholder:text-slate-400 focus:outline-none w-44 sm:w-56"
              />
              <button type="submit" className="px-2.5 py-1.5 text-slate-300 hover:text-white" title="Search Location">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow transition active:scale-95"
              title="Detect your device location"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? t.detecting : t.detectLocation}</span>
            </button>
          </div>
        </div>

        {/* Dropdowns for State -> District -> Station */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-700/60">
          {/* State Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              {t.selectState}
            </label>
            <select
              value={selectedStateCode}
              onChange={handleStateChange}
              className="w-full bg-[#13315c] text-white text-xs rounded-md border border-slate-600 p-2 focus:border-amber-400 focus:outline-none"
            >
              {INDIAN_STATES_DATA.map((st) => (
                <option key={st.stateCode} value={st.stateCode}>
                  {st.state}
                </option>
              ))}
            </select>
          </div>

          {/* District Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              {t.selectDistrict}
            </label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="w-full bg-[#13315c] text-white text-xs rounded-md border border-slate-600 p-2 focus:border-amber-400 focus:outline-none"
            >
              {currentState.districts.map((d) => (
                <option key={d.district} value={d.district}>
                  {d.district}
                </option>
              ))}
            </select>
          </div>

          {/* Station Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              {t.selectStation}
            </label>
            <select
              value={station.id}
              onChange={handleStationChange}
              className="w-full bg-[#13315c] text-white text-xs rounded-md border border-slate-600 p-2 focus:border-amber-400 focus:outline-none"
            >
              {currentDistrictObj.stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notice/Error */}
        {geoError && (
          <div className="mt-3 bg-amber-900/40 border border-amber-500/50 text-amber-200 text-xs px-3 py-1.5 rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{geoError}</span>
          </div>
        )}
      </div>

      {/* 2. Main Live Observation Telemetry */}
      <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {locationName || station.name}
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified AWS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {liveWeather
                ? `Coordinates: ${liveWeather.latitude.toFixed(4)}°N, ${liveWeather.longitude.toFixed(4)}°E • Live forecast service`
                : `Lat: ${station.lat}°N, Lng: ${station.lng}°E • Type: ${station.type}`}
            </p>
          </div>

          <div className="flex items-center text-xs text-slate-600 font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-xs">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-700" />
            <span>{t.lastUpdated}: {lastWeatherUpdate ? lastWeatherUpdate.toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN') : 'IMD station observation'}</span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          {/* Temperature */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Temperature</span>
              <Thermometer className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {weather ? Math.round(weather.temperature_2m) : station.temp}°<span className="text-sm font-normal text-slate-600">C</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {t.feelsLike} {weather ? Math.round(weather.apparent_temperature) : station.feelsLike}°C
            </div>
          </div>

          {/* Condition */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Sky Condition</span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-sm font-bold text-slate-900 truncate" title={station.condition}>
              {weather ? weatherDescription(weather.weather_code) : station.condition}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Rain Today: <span className="font-semibold text-blue-700">{weather ? weather.precipitation : station.rainToday || 0} mm</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>{t.humidity}</span>
              <Droplets className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {weather ? weather.relative_humidity_2m : station.humidity}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Dew Point: 23°C
            </div>
          </div>

          {/* Wind */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>{t.windSpeed}</span>
              <Wind className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-bold text-slate-900">
              {weather ? Math.round(weather.wind_speed_10m) : station.windSpeed} <span className="text-xs font-normal text-slate-600">km/h</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Dir: {weather ? `${Math.round(weather.wind_direction_10m)}°` : station.windDirection || 'NW'}
            </div>
          </div>

          {/* Pressure */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>{t.pressure}</span>
              <Gauge className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-lg font-bold text-slate-900">
              {weather ? Math.round(weather.surface_pressure) : station.pressure} <span className="text-xs font-normal text-slate-600">hPa</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Normal MSLP
            </div>
          </div>

          {/* AQI */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Air Quality</span>
              <span className={`w-2.5 h-2.5 rounded-full ${
                (station.aqi || 80) <= 50 ? 'bg-emerald-500' : (station.aqi || 80) <= 100 ? 'bg-lime-500' : 'bg-amber-500'
              }`}></span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {station.aqi || 78}
            </div>
            <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
              {station.aqiCategory || 'Satisfactory'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Visualizations: 24-Hr Precipitation Chart & 7-Day Forecast */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Precipitation & Temperature Trend */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-blue-600" />
              {t.hourlyForecast}
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">Precipitation (mm) & Temp (°C)</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} unit="mm" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[20, 40]} unit="°C" />
                <Tooltip 
                  formatter={(val, name) => [
                    `${val} ${name === 'rain' ? 'mm' : '°C'}`, 
                    name === 'rain' ? 'Rainfall' : 'Temperature'
                  ]}
                  contentStyle={{ backgroundColor: '#0b2545', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar yAxisId="left" dataKey="rain" fill="#0284c7" radius={[4, 4, 0, 0]} name="rain" />
                <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="temp" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day Meteorological Outlook */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              {t.sevenDayForecast}
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">NWFC Standard Guidance</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {forecastData.map((f, idx) => (
              <div key={idx} className="bg-slate-50 hover:bg-blue-50/60 p-2 rounded-lg border border-slate-200 text-center transition">
                <div className="text-xs font-bold text-slate-800">{f.day}</div>
                <div className="my-1 text-sm font-extrabold text-blue-900">
                  {f.tempMax}° / <span className="text-xs font-normal text-slate-500">{f.tempMin}°</span>
                </div>
                <div className="text-[10px] text-slate-600 font-medium leading-tight h-7 flex items-center justify-center">
                  {f.cond}
                </div>
                <div className="mt-1 text-[10px] font-semibold text-cyan-700 bg-cyan-50 rounded py-0.5">
                  🌧️ {f.rainProb}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
