import { CloudRain, Sun, Cloud } from 'lucide-react';
import type { WeatherData } from '../lib/api';

interface WeatherCardProps {
  data: WeatherData | null;
  loading: boolean;
  onClick?: () => void;
}

export function WeatherCard({ data, loading, onClick }: WeatherCardProps) {
  if (loading || !data) return <div className="animate-pulse h-48 bg-white/5 rounded-3xl" />;

  const isRaining = data.isRaining;
  const Icon = isRaining ? CloudRain : (data.weatherCode > 2 ? Cloud : Sun);

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/15 transition-colors group"
    >
      <div className={`absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30 ${isRaining ? 'bg-blue-900' : 'bg-orange-500/20'}`} />

      <Icon className="w-16 h-16 mb-4 text-white drop-shadow-lg" />

      <div className="flex items-center gap-2">
        <span className="text-6xl font-bold text-white tracking-tighter">
          {Math.round(data.temperature)}°
        </span>
      </div>

      <p className="mt-2 text-slate-300 font-medium">
        {isRaining ? 'Rainy & Wet' : 'Clear Skies'}
      </p>

      {data.precipitationProbability > 0 && (
        <div className="mt-4 px-3 py-1 bg-blue-500/20 rounded-full text-xs font-semibold text-blue-200">
          {data.precipitationProbability}% chance of rain
        </div>
      )}
    </div>
  );
}
