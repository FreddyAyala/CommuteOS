import { useState, useEffect, useCallback } from 'react';
import { fetchWeather, fetchRoute, type WeatherData, type RouteData } from '../lib/api';

const DEFAULT_HOME = { lat: 40.7128, lon: -74.0060 }; // NYC
const DEFAULT_WORK = { lat: 40.7580, lon: -73.9855 }; // Times Square

export interface Location {
  lat: number;
  lon: number;
  label?: string;
}

export function useAppStore() {
  const [home, setHome] = useState<Location>(() => {
    const saved = localStorage.getItem('commute_home');
    return saved ? JSON.parse(saved) : DEFAULT_HOME;
  });

  const [work, setWork] = useState<Location>(() => {
    const saved = localStorage.getItem('commute_work');
    return saved ? JSON.parse(saved) : DEFAULT_WORK;
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [commute, setCommute] = useState<{ driving: RouteData, cycling: RouteData } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('commute_home', JSON.stringify(home));
  }, [home]);

  useEffect(() => {
    localStorage.setItem('commute_work', JSON.stringify(work));
  }, [work]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Weather (for Home location)
      const wData = await fetchWeather(home.lat, home.lon);
      setWeather(wData);

      // 2. Fetch Commute Routes
      const [driving, cycling] = await Promise.all([
        fetchRoute([home.lat, home.lon], [work.lat, work.lon], 'driving'),
        fetchRoute([home.lat, home.lon], [work.lat, work.lon], 'cycling')
      ]);

      setCommute({ driving, cycling });
    } catch (e) {
      console.error("Failed to refresh data", e);
    } finally {
      setLoading(false);
    }
  }, [home, work]);

  // Initial fetch
  useEffect(() => {
    refreshData();
  }, [refreshData]); // Re-fetch if locations change

  return {
    home, setHome,
    work, setWork,
    weather,
    commute,
    loading,
    refreshData
  };
}
