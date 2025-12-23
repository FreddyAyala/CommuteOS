import { useState } from 'react';
import { Settings, X, Save } from 'lucide-react';
import type { Location } from '../hooks/useAppStore';
import { LocationPicker } from './LocationPicker';

interface Props {
  home: Location;
  work: Location;
  setHome: (l: Location) => void;
  setWork: (l: Location) => void;
  refreshData: () => void;
}

export function SettingsPanel({ home, work, setHome, setWork, refreshData }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [pickingMode, setPickingMode] = useState<'home' | 'work' | null>(null);

  // Temporary state for the panel before saving
  const [tempHome, setTempHome] = useState<Location>(home);
  const [tempWork, setTempWork] = useState<Location>(work);

  const handleOpen = () => {
    setTempHome(home);
    setTempWork(work);
    setIsOpen(true);
  };

  const handleSave = () => {
    setHome(tempHome);
    setWork(tempWork);
    refreshData();
    setIsOpen(false);
  };

  if (pickingMode) {
    return (
      <LocationPicker
        title={pickingMode === 'home' ? 'Home' : 'Work'}
        initialLocation={pickingMode === 'home' ? tempHome : tempWork}
        onConfirm={(loc) => {
          if (pickingMode === 'home') setTempHome(loc);
          else setTempWork(loc);
          setPickingMode(null);
        }}
        onCancel={() => setPickingMode(null)}
      />
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md z-50"
      >
        <Settings className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Commute Settings</h2>
          <button onClick={() => setIsOpen(false)}><X className="text-slate-400" /></button>
        </div>

        <div className="space-y-6">
          {/* Home Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Home Location</label>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
              <div>
                <div className="text-white font-medium">{tempHome.label || 'Custom Location'}</div>
                <div className="text-xs text-slate-500 font-mono mt-1">{tempHome.lat.toFixed(4)}, {tempHome.lon.toFixed(4)}</div>
              </div>
              <button
                onClick={() => setPickingMode('home')}
                className="px-3 py-2 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 text-xs font-bold rounded-lg transition-colors"
              >
                EDIT
              </button>
            </div>
          </div>

          {/* Work Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Work Location</label>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
              <div>
                <div className="text-white font-medium">{tempWork.label || 'Custom Location'}</div>
                <div className="text-xs text-slate-500 font-mono mt-1">{tempWork.lat.toFixed(4)}, {tempWork.lon.toFixed(4)}</div>
              </div>
              <button
                onClick={() => setPickingMode('work')}
                className="px-3 py-2 bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 text-xs font-bold rounded-lg transition-colors"
              >
                EDIT
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              Save & Update Commute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
