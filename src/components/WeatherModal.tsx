import { X, CloudRain, Sun, Cloud, CloudSnow } from 'lucide-react';
import type { WeatherData } from '../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  weather: WeatherData | null;
  locationName: string;
}

function getWeatherIcon(code: number) {
  if (code >= 71) return CloudSnow;
  if (code >= 51) return CloudRain;
  if (code > 2) return Cloud;
  return Sun;
}

function getDayName(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function WeatherModal({ isOpen, onClose, weather, locationName }: Props) {
  if (!isOpen || !weather) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Weekly Forecast</h2>
              <p className="text-slate-400 font-medium">{locationName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="text-5xl font-bold text-white">{Math.round(weather.temperature)}°</div>
            <div className="text-slate-300">
              <div className="font-semibold">Current</div>
              <div className="text-sm opacity-70">Feels like {Math.round(weather.temperature)}°</div>
            </div>
          </div>
        </div>

        {/* Daily List */}
        <div className="p-4 space-y-1 bg-slate-900 max-h-[50vh] overflow-y-auto">
          {weather.daily.time.map((t, i) => {
            const Icon = getWeatherIcon(weather.daily.weatherCode[i]);
            const isToday = i === 0;
            return (
              <div
                key={t}
                className={`flex items-center justify-between p-3 rounded-xl ${isToday ? 'bg-white/10' : 'hover:bg-white/5'}`}
              >
                <div className="w-12 font-semibold text-slate-300">
                  {isToday ? 'Today' : getDayName(t)}
                </div>

                <Icon className="w-6 h-6 text-slate-400" />

                <div className="flex items-center gap-4 w-24 justify-end">
                  <span className="text-white font-bold">{Math.round(weather.daily.temperatureMax[i])}°</span>
                  <span className="text-slate-500 font-medium">{Math.round(weather.daily.temperatureMin[i])}°</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
