export interface WeatherData {
  temperature: number;
  precipitationProbability: number; // 0-100
  weatherCode: number;
  isRaining: boolean;
  daily: {
    time: string[];
    weatherCode: number[];
    temperatureMax: number[];
    temperatureMin: number[];
  };
}

export interface RouteData {
  distance: number; // meters
  duration: number; // seconds
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geometry: any; // GeoJSON
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code,precipitation_probability&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  const res = await fetch(url);
  const data = await res.json();

  const current = data.current;
  const daily = data.daily;

  // WMO Weather interpretation codes (0-99)
  // 51, 53, 55 = Drizzle, 61, 63, 65 = Rain, 80, 81, 82 = Showers
  const rainCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99];
  const isRaining = rainCodes.includes(current.weather_code) || current.precipitation > 0;

  return {
    temperature: current.temperature_2m,
    precipitationProbability: current.precipitation_probability ?? 0,
    weatherCode: current.weather_code,
    isRaining,
    daily: {
      time: daily.time,
      weatherCode: daily.weather_code,
      temperatureMax: daily.temperature_2m_max,
      temperatureMin: daily.temperature_2m_min
    }
  };
}

export async function fetchRoute(start: [number, number], end: [number, number], profile: 'driving' | 'walking' | 'cycling' = 'driving'): Promise<RouteData> {
  // OSRM Public API
  // Note: OSRM uses lon,lat order
  const startStr = `${start[1]},${start[0]}`;
  const endStr = `${end[1]},${end[0]}`;
  const url = `https://router.project-osrm.org/route/v1/${profile}/${startStr};${endStr}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }
    return {
      distance: data.routes[0].distance,
      duration: data.routes[0].duration,
      geometry: data.routes[0].geometry
    };
  } catch (error) {
    console.warn('OSRM Fetch Error:', error);
    // Fallback or re-throw depending on desired behavior.
    // Returning 0s for now to prevent app crash, UI should handle loading/error states.
    return { distance: 0, duration: 0, geometry: null };
  }
}

export function calculateUberPrice(distanceMeters: number, durationSeconds: number, surgeMultiplier: number = 1.0): number {
  const baseFee = 2.50; // Base fare
  const perMinute = 0.35; // Cost per minute
  const perMile = 1.75; // Cost per mile

  const durationMinutes = durationSeconds / 60;
  const distanceMiles = distanceMeters / 1609.34;

  const price = (baseFee + (durationMinutes * perMinute) + (distanceMiles * perMile)) * surgeMultiplier;
  return Math.max(price, 8.00); // Minimum fare $8
}

export interface GeocodeResult {
  lat: number;
  lon: number;
  display_name: string;
}

export async function searchAddress(query: string): Promise<GeocodeResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'CommuteOS/1.0' // Nominatim requires a User-Agent
      }
    });
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      display_name: item.display_name
    }));
  } catch (error) {
    console.error("Geocoding failed", error);
    return [];
  }
}
