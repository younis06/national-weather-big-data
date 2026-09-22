export const INDIAN_STATES_DATA = [
  {
    state: "Delhi (NCT)",
    stateCode: "DL",
    center: [28.6139, 77.2090],
    districts: [
      {
        district: "New Delhi",
        stations: [
          {
            id: "DL-SAF",
            name: "New Delhi (Safdarjung)",
            type: "Primary Observatory (AWS)",
            lat: 28.5842,
            lng: 77.2097,
            temp: 29.6,
            feelsLike: 34.2,
            condition: "Partly Cloudy with Haze",
            conditionCode: "cloudy",
            humidity: 74,
            windSpeed: 8,
            windDirection: "NW",
            pressure: 1008.4,
            rainToday: 4.2,
            aqi: 142,
            aqiCategory: "Moderate",
            uvIndex: 5,
            forecast: [
              { day: "Mon", tempMax: 33, tempMin: 24, cond: "Scattered Rain", rainProb: 60 },
              { day: "Tue", tempMax: 32, tempMin: 23, cond: "Thunderstorm", rainProb: 80 },
              { day: "Wed", tempMax: 31, tempMin: 23, cond: "Moderate Rain", rainProb: 75 },
              { day: "Thu", tempMax: 34, tempMin: 25, cond: "Partly Cloudy", rainProb: 30 },
              { day: "Fri", tempMax: 35, tempMin: 26, cond: "Sunny", rainProb: 10 },
              { day: "Sat", tempMax: 35, tempMin: 26, cond: "Sunny", rainProb: 10 },
              { day: "Sun", tempMax: 34, tempMin: 25, cond: "Partly Cloudy", rainProb: 20 }
            ],
            hourly: [
              { time: "00:00", temp: 26, rain: 0 },
              { time: "03:00", temp: 25, rain: 0 },
              { time: "06:00", temp: 24, rain: 0.5 },
              { time: "09:00", temp: 27, rain: 1.2 },
              { time: "12:00", temp: 31, rain: 2.5 },
              { time: "15:00", temp: 32, rain: 0 },
              { time: "18:00", temp: 30, rain: 0 },
              { time: "21:00", temp: 28, rain: 0 }
            ]
          },
          {
            id: "DL-PAL",
            name: "New Delhi (Palam Airport)",
            type: "Aviation Met Station",
            lat: 28.5700,
            lng: 77.1200,
            temp: 30.2,
            feelsLike: 35.1,
            condition: "Hazy Sunshine",
            conditionCode: "haze",
            humidity: 71,
            windSpeed: 11,
            windDirection: "WNW",
            pressure: 1007.9,
            rainToday: 2.0,
            aqi: 156,
            aqiCategory: "Moderate",
            uvIndex: 6
          }
        ]
      }
    ]
  },
  {
    state: "Maharashtra",
    stateCode: "MH",
    center: [19.0760, 72.8777],
    districts: [
      {
        district: "Mumbai City",
        stations: [
          {
            id: "MH-COL",
            name: "Mumbai (Colaba)",
            type: "Coastal Observatory (AWS)",
            lat: 18.9067,
            lng: 72.8147,
            temp: 27.8,
            feelsLike: 32.5,
            condition: "Heavy Rain with Squall",
            conditionCode: "heavy_rain",
            humidity: 92,
            windSpeed: 28,
            windDirection: "WSW",
            pressure: 1004.2,
            rainToday: 48.6,
            aqi: 45,
            aqiCategory: "Good",
            uvIndex: 3,
            forecast: [
              { day: "Mon", tempMax: 29, tempMin: 25, cond: "Very Heavy Rain", rainProb: 95 },
              { day: "Tue", tempMax: 28, tempMin: 24, cond: "Heavy Rain", rainProb: 90 },
              { day: "Wed", tempMax: 30, tempMin: 25, cond: "Moderate Rain", rainProb: 70 },
              { day: "Thu", tempMax: 31, tempMin: 26, cond: "Intermittent Rain", rainProb: 60 },
              { day: "Fri", tempMax: 31, tempMin: 26, cond: "Passing Showers", rainProb: 40 },
              { day: "Sat", tempMax: 32, tempMin: 26, cond: "Partly Cloudy", rainProb: 30 },
              { day: "Sun", tempMax: 32, tempMin: 27, cond: "Partly Cloudy", rainProb: 20 }
            ],
            hourly: [
              { time: "00:00", temp: 26, rain: 6.2 },
              { time: "03:00", temp: 26, rain: 8.5 },
              { time: "06:00", temp: 25, rain: 12.0 },
              { time: "09:00", temp: 27, rain: 14.5 },
              { time: "12:00", temp: 28, rain: 9.8 },
              { time: "15:00", temp: 28, rain: 7.2 },
              { time: "18:00", temp: 27, rain: 4.5 },
              { time: "21:00", temp: 27, rain: 2.1 }
            ]
          },
          {
            id: "MH-SAN",
            name: "Mumbai (Santacruz)",
            type: "Principal Aviation Station",
            lat: 19.0988,
            lng: 72.8517,
            temp: 26.9,
            feelsLike: 31.8,
            condition: "Continuous Heavy Showers",
            conditionCode: "heavy_rain",
            humidity: 94,
            windSpeed: 24,
            windDirection: "SW",
            pressure: 1004.8,
            rainToday: 62.4,
            aqi: 38,
            aqiCategory: "Good",
            uvIndex: 2
          }
        ]
      },
      {
        district: "Pune",
        stations: [
          {
            id: "MH-PUN",
            name: "Pune (Shivajinagar)",
            type: "Agricultural Meteorology HQ",
            lat: 18.5314,
            lng: 73.8446,
            temp: 25.4,
            feelsLike: 27.2,
            condition: "Overcast with Light Drizzle",
            conditionCode: "rain",
            humidity: 86,
            windSpeed: 14,
            windDirection: "W",
            pressure: 1008.1,
            rainToday: 11.2,
            aqi: 58,
            aqiCategory: "Satisfactory",
            uvIndex: 4
          }
        ]
      }
    ]
  },
  {
    state: "West Bengal",
    stateCode: "WB",
    center: [22.5726, 88.3639],
    districts: [
      {
        district: "Kolkata",
        stations: [
          {
            id: "WB-ALI",
            name: "Kolkata (Alipore)",
            type: "Regional Meteorological Centre",
            lat: 22.5333,
            lng: 88.3333,
            temp: 31.2,
            feelsLike: 39.0,
            condition: "Warm & Humid with Thundershower Watch",
            conditionCode: "thunderstorm",
            humidity: 83,
            windSpeed: 10,
            windDirection: "SE",
            pressure: 1005.6,
            rainToday: 8.4,
            aqi: 88,
            aqiCategory: "Satisfactory",
            uvIndex: 7,
            forecast: [
              { day: "Mon", tempMax: 33, tempMin: 27, cond: "Thundershowers", rainProb: 75 },
              { day: "Tue", tempMax: 32, tempMin: 26, cond: "Heavy Rain", rainProb: 85 },
              { day: "Wed", tempMax: 31, tempMin: 26, cond: "Squall & Rain", rainProb: 90 },
              { day: "Thu", tempMax: 32, tempMin: 27, cond: "Scattered Rain", rainProb: 50 },
              { day: "Fri", tempMax: 34, tempMin: 27, cond: "Partly Cloudy", rainProb: 30 },
              { day: "Sat", tempMax: 34, tempMin: 28, cond: "Humid", rainProb: 20 },
              { day: "Sun", tempMax: 33, tempMin: 27, cond: "Thunderstorm", rainProb: 65 }
            ],
            hourly: [
              { time: "00:00", temp: 28, rain: 0 },
              { time: "03:00", temp: 27, rain: 0 },
              { time: "06:00", temp: 27, rain: 0 },
              { time: "09:00", temp: 29, rain: 0.8 },
              { time: "12:00", temp: 33, rain: 3.4 },
              { time: "15:00", temp: 32, rain: 7.2 },
              { time: "18:00", temp: 29, rain: 2.1 },
              { time: "21:00", temp: 28, rain: 0.5 }
            ]
          }
        ]
      }
    ]
  },
  {
    state: "Tamil Nadu",
    stateCode: "TN",
    center: [13.0827, 80.2707],
    districts: [
      {
        district: "Chennai",
        stations: [
          {
            id: "TN-MEE",
            name: "Chennai (Meenambakkam)",
            type: "Regional Met Centre",
            lat: 12.9941,
            lng: 80.1709,
            temp: 30.5,
            feelsLike: 37.8,
            condition: "Scattered Clouds with Coastal Breeze",
            conditionCode: "partly_cloudy",
            humidity: 78,
            windSpeed: 16,
            windDirection: "ENE",
            pressure: 1007.2,
            rainToday: 1.5,
            aqi: 64,
            aqiCategory: "Satisfactory",
            uvIndex: 8
          }
        ]
      }
    ]
  },
  {
    state: "Karnataka",
    stateCode: "KA",
    center: [12.9716, 77.5946],
    districts: [
      {
        district: "Bengaluru Urban",
        stations: [
          {
            id: "KA-BLR",
            name: "Bengaluru (City)",
            type: "Principal Observatory",
            lat: 12.9716,
            lng: 77.5946,
            temp: 23.8,
            feelsLike: 24.5,
            condition: "Pleasant with Intermittent Drizzle",
            conditionCode: "drizzle",
            humidity: 88,
            windSpeed: 12,
            windDirection: "WNW",
            pressure: 1012.3,
            rainToday: 5.8,
            aqi: 42,
            aqiCategory: "Good",
            uvIndex: 4
          }
        ]
      }
    ]
  },
  {
    state: "Telangana",
    stateCode: "TG",
    center: [17.3850, 78.4867],
    districts: [
      {
        district: "Hyderabad",
        stations: [
          {
            id: "TG-BEG",
            name: "Hyderabad (Begumpet)",
            type: "Synoptic Met Station",
            lat: 17.4531,
            lng: 78.4677,
            temp: 28.2,
            feelsLike: 31.0,
            condition: "Passing Thunderclouds",
            conditionCode: "cloudy",
            humidity: 76,
            windSpeed: 10,
            windDirection: "SW",
            pressure: 1009.1,
            rainToday: 9.2,
            aqi: 72,
            aqiCategory: "Satisfactory",
            uvIndex: 6
          }
        ]
      }
    ]
  },
  {
    state: "Gujarat",
    stateCode: "GJ",
    center: [23.0225, 72.5714],
    districts: [
      {
        district: "Ahmedabad",
        stations: [
          {
            id: "GJ-AHM",
            name: "Ahmedabad (Airport)",
            type: "Met Centre Gujarat",
            lat: 23.0734,
            lng: 72.6266,
            temp: 33.4,
            feelsLike: 38.6,
            condition: "Hot & Humid Haze",
            conditionCode: "haze",
            humidity: 68,
            windSpeed: 7,
            windDirection: "WSW",
            pressure: 1006.5,
            rainToday: 0.0,
            aqi: 112,
            aqiCategory: "Moderate",
            uvIndex: 7
          }
        ]
      }
    ]
  },
  {
    state: "Odisha",
    stateCode: "OD",
    center: [20.2961, 85.8245],
    districts: [
      {
        district: "Khordha / Bhubaneswar",
        stations: [
          {
            id: "OD-BBI",
            name: "Bhubaneswar (Airport)",
            type: "Cyclone Early Warning Centre",
            lat: 20.2444,
            lng: 85.8178,
            temp: 28.9,
            feelsLike: 35.4,
            condition: "Heavy Rain Bands Associated with Bay Low Pressure",
            conditionCode: "heavy_rain",
            humidity: 90,
            windSpeed: 32,
            windDirection: "ENE",
            pressure: 1002.8,
            rainToday: 54.0,
            aqi: 40,
            aqiCategory: "Good",
            uvIndex: 3
          }
        ]
      }
    ]
  },
  {
    state: "Assam",
    stateCode: "AS",
    center: [26.1445, 91.7362],
    districts: [
      {
        district: "Kamrup Metropolitan",
        stations: [
          {
            id: "AS-GHY",
            name: "Guwahati (Borjhar Airport)",
            type: "Regional Met Centre NE",
            lat: 26.1061,
            lng: 91.5859,
            temp: 27.2,
            feelsLike: 31.0,
            condition: "Moderate Rain with Foggy River Fog",
            conditionCode: "rain",
            humidity: 91,
            windSpeed: 6,
            windDirection: "NE",
            pressure: 1007.4,
            rainToday: 22.4,
            aqi: 48,
            aqiCategory: "Good",
            uvIndex: 4
          }
        ]
      }
    ]
  },
  {
    state: "Jammu & Kashmir",
    stateCode: "JK",
    center: [34.0837, 74.7973],
    districts: [
      {
        district: "Srinagar",
        stations: [
          {
            id: "JK-SXR",
            name: "Srinagar (City)",
            type: "Himalayan Mountain Met Centre",
            lat: 34.0837,
            lng: 74.7973,
            temp: 18.4,
            feelsLike: 18.0,
            condition: "Partly Cloudy with Crisp Mountain Breeze",
            conditionCode: "partly_cloudy",
            humidity: 58,
            windSpeed: 9,
            windDirection: "NNW",
            pressure: 1018.2,
            rainToday: 0.0,
            aqi: 32,
            aqiCategory: "Good",
            uvIndex: 6
          }
        ]
      }
    ]
  }
];
