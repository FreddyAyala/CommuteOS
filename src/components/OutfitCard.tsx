import { Shirt, Umbrella, Wind } from 'lucide-react';
import type { WeatherData } from '../lib/api';

interface Props {
  weather: WeatherData | null;
  loading: boolean;
  onClick?: () => void;
}

export function OutfitCard({ weather, loading, onClick }: Props) {
  if (loading || !weather) return <div className="animate-pulse h-48 bg-white/5 rounded-3xl" />;

  const getOutfit = () => {
    const t = weather.temperature;
    if (t < 5) return { text: "Heavy Coat + Scarf", icon: Wind, color: "text-blue-200" };
    if (t < 15) return { text: "Light Jacket + Jeans", icon: Shirt, color: "text-orange-200" };
    if (t < 25) return { text: "Hoodie or T-Shirt", icon: Shirt, color: "text-green-200" };
    return { text: "Shorts & Shades", icon: Sun, color: "text-yellow-200" };
  };

  const outfit = getOutfit();
  const Icon = outfit.icon;

  return (
    <div
      onClick={onClick}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
    >
      <div>
        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
          Outfit Check
        </h3>
        <p className={`text-xl font-medium ${outfit.color}`}>
          {outfit.text}
        </p>
        {weather.isRaining && (
          <div className="flex items-center gap-2 mt-2 text-blue-300 text-sm">
            <Umbrella className="w-4 h-4" />
            <span>Don't forget an umbrella!</span>
          </div>
        )}
      </div>
      <div className="p-4 bg-white/5 rounded-full">
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  );
}

import { Sun } from 'lucide-react';
