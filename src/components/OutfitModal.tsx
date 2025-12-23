import { X, Shirt, Umbrella, Wind, Sun, Glasses, Thermometer } from 'lucide-react';
import type { WeatherData } from '../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  weather: WeatherData | null;
}

export function OutfitModal({ isOpen, onClose, weather }: Props) {
  if (!isOpen || !weather) return null;

  const getDetailedAdvice = () => {
    const t = weather.temperature;
    const notes = [];

    if (t < 5) {
      notes.push({ title: "Core Layer", text: "Thermal undershirt recommended.", icon: Shirt });
      notes.push({ title: "Outerwear", text: "Heavy down jacket or wool coat.", icon: Wind });
      notes.push({ title: "Accessories", text: "Thick scarf, gloves, and beanie.", icon: Thermometer });
    } else if (t < 15) {
      notes.push({ title: "Top", text: "Sweater or Hoodie.", icon: Shirt });
      notes.push({ title: "Jacket", text: "Denim or leather jacket.", icon: Wind });
      notes.push({ title: "Bottoms", text: "Heavy denim or chinos.", icon: Shirt });
    } else if (t < 25) {
      notes.push({ title: "Top", text: "T-Shirt or light button-down.", icon: Shirt });
      notes.push({ title: "Layer", text: "Bring a light hoodie just in case.", icon: Wind });
    } else {
      notes.push({ title: "Top", text: "Breathable fabric (Linen/Cotton).", icon: Sun });
      notes.push({ title: "Bottoms", text: "Shorts or light trousers.", icon: Shirt });
    }

    if (weather.isRaining) {
      notes.push({ title: "Rain Gear", text: "Waterproof shoes & Umbrella.", icon: Umbrella });
    } else if (t > 15) {
      notes.push({ title: "Sun Protection", text: "Sunglasses needed.", icon: Glasses });
    }

    return notes;
  };

  const advice = getDetailedAdvice();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-white">Outfit Guide</h2>
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
          <p className="text-slate-300 text-sm">
            Optimized for {Math.round(weather.temperature)}°C weather.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {advice.map((item, i) => (
            <div key={i} className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="p-3 bg-slate-800 rounded-full">
                <item.icon className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-950 text-center text-xs text-slate-600">
          Generative Style Engine™
        </div>

      </div>
    </div>
  );
}
