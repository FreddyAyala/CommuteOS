import { useState } from 'react';
import { useAppStore } from './hooks/useAppStore';
import { WeatherCard } from './components/WeatherCard';
import { CommuteCard } from './components/CommuteCard';
import { OutfitCard } from './components/OutfitCard';
import { SettingsPanel } from './components/SettingsPanel';
import { RouteMapModal } from './components/RouteMapModal';
import { WeatherModal } from './components/WeatherModal';
import { OutfitModal } from './components/OutfitModal';

function App() {
  const { home, work, setHome, setWork, weather, commute, loading, refreshData } = useAppStore();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isOutfitOpen, setIsOutfitOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 font-sans selection:bg-blue-500/30">

      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <header>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            CommuteOS
          </h1>
          <p className="mt-2 text-slate-400 text-lg">
            Good morning. Your dashboard is ready.
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Weather - Takes up 1 column */}
          <div className="md:col-span-1">
            <WeatherCard
              data={weather}
              loading={loading}
              onClick={() => setIsWeatherOpen(true)}
            />
          </div>

          {/* Commute - Takes up 2 columns */}
          <div className="md:col-span-2">
            <CommuteCard
              commute={commute}
              weather={weather}
              loading={loading}
              onClick={() => setIsMapOpen(true)}
            />
          </div>

          {/* Outfit Recommendation - Full Width */}
          <div className="md:col-span-3">
            <OutfitCard
              weather={weather}
              loading={loading}
              onClick={() => setIsOutfitOpen(true)}
            />
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center text-slate-500 text-sm mt-12 py-6 border-t border-white/5">
          <p>Powered by Open-Meteo & OSRM • No API Keys Required</p>
        </div>

      </div>

      <SettingsPanel
        home={home}
        work={work}
        setHome={setHome}
        setWork={setWork}
        refreshData={refreshData}
      />

      <RouteMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        route={commute ? commute.driving : null}
        start={home}
        end={work}
      />

      <WeatherModal
        isOpen={isWeatherOpen}
        onClose={() => setIsWeatherOpen(false)}
        weather={weather}
        locationName={home.label || 'Home'}
      />

      <OutfitModal
        isOpen={isOutfitOpen}
        onClose={() => setIsOutfitOpen(false)}
        weather={weather}
      />
    </div>
  );
}

export default App;
