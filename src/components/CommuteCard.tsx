import { Car, Bike, Clock } from 'lucide-react';
import type { RouteData, WeatherData } from '../lib/api';
import { calculateUberPrice } from '../lib/api';
import { cn } from '../lib/utils';

interface CommuteCardProps {
  commute: { driving: RouteData; cycling: RouteData } | null;
  weather: WeatherData | null;
  loading: boolean;
  onClick?: () => void;
}

export function CommuteCard({ commute, weather, loading, onClick }: CommuteCardProps) {
  if (loading || !commute) return <div className="animate-pulse h-48 bg-white/5 rounded-3xl" />;

  const isRaining = weather?.isRaining ?? false;
  const uberPrice = calculateUberPrice(commute.driving.distance, commute.driving.duration, isRaining ? 1.4 : 1.0);
  const uberTime = Math.round(commute.driving.duration / 60);

  const bikeTime = Math.round(commute.cycling.duration / 60);
  const bikeRecommneded = !isRaining && weather && weather.temperature > 10 && weather.temperature < 28;

  const cards = [
    {
      type: 'Uber',
      icon: Car,
      price: `$${uberPrice.toFixed(2)}`,
      time: `${uberTime} min`,
      recommended: isRaining,
      color: 'bg-black/40' // Uber black
    },
    {
      type: 'Bike',
      icon: Bike,
      price: '$3.50',
      time: `${bikeTime} min`,
      recommended: bikeRecommneded,
      color: 'bg-blue-500/20' // CitiBike blueish
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards.map((c) => (
        <div
          key={c.type}
          onClick={onClick}
          className={cn(
            "relative p-5 rounded-3xl border transition-all hover:scale-[1.02] cursor-pointer",
            c.recommended
              ? "bg-white/10 border-green-400/50 shadow-[0_0_20px_rgba(74,222,128,0.2)]"
              : "bg-white/5 border-white/10 opacity-70 hover:opacity-100"
          )}
        >
          {c.recommended && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
              BEST OPTION
            </div>
          )}

          <div className="flex justify-between items-start mb-4">
            <div className={cn("p-3 rounded-2xl", c.color)}>
              <c.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{c.price}</div>
              <div className="flex items-center justify-end text-xs text-slate-400 gap-1">
                <Clock className="w-3 h-3" /> {c.time}
              </div>
            </div>
          </div>

          <div className="mt-2 text-sm text-slate-300 font-medium">
            Take an {c.type}
          </div>
        </div>
      ))}
    </div>
  );
}
