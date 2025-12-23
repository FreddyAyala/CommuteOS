import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Search, MapPin, Check } from 'lucide-react';
import { searchAddress, type GeocodeResult } from '../lib/api';
import type { Location } from '../hooks/useAppStore';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Map Click Handler
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Map Center Updater
function MapFlyTo({ lat, lon }: { lat: number, lon: number }) {
  const map = useMapEvents({});
  map.flyTo([lat, lon], 13);
  return null;
}

interface Props {
  initialLocation: Location;
  onConfirm: (l: Location) => void;
  onCancel: () => void;
  title: string;
}

export function LocationPicker({ initialLocation, onConfirm, onCancel, title }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [selected, setSelected] = useState<Location>(initialLocation);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setSearching(true);
    const res = await searchAddress(query);
    setResults(res);
    setSearching(false);
  };

  const selectResult = (res: GeocodeResult) => {
    setSelected({ lat: res.lat, lon: res.lon, label: res.display_name.split(',')[0] });
    setResults([]);
  };

  const handleMapClick = (lat: number, lon: number) => {
    setSelected({ lat, lon, label: 'Custom Pin' });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 rounded-3xl border border-white/10 overflow-hidden flex flex-col h-[80vh]">

        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-slate-800/50">
          <h2 className="text-xl font-bold text-white mb-1">Set {title}</h2>
          <p className="text-sm text-slate-400">Search address or click on map</p>
        </div>

        {/* Search Bar */}
        <div className="p-4 z-[1001] relative">
          <div className="relative">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search e.g. 'Empire State Building'..."
              className="w-full bg-slate-800 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            {searching && <div className="absolute right-3 top-3.5 animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />}
          </div>

          {/* Search Results Dropdown */}
          {(results.length > 0 || (query && !searching && results.length === 0 && document.activeElement?.tagName === 'INPUT')) && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
              {results.length > 0 ? (
                results.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => selectResult(r)}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate text-slate-300 text-sm">{r.display_name}</span>
                  </button>
                ))
              ) : (
                query.length > 3 && !searching && (
                  <div className="p-4 text-center text-slate-400 text-sm">
                    No results found. Try a different address.
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative bg-slate-950">
          <MapContainer
            center={[selected.lat, selected.lon]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; OSM'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <Marker position={[selected.lat, selected.lon]} />
            <MapClickHandler onLocationSelect={handleMapClick} />
            <MapFlyTo lat={selected.lat} lon={selected.lon} />
          </MapContainer>

          {/* Current Selection Overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur border border-white/10 p-3 rounded-lg z-[400] text-center">
            <div className="text-xs text-slate-500 uppercase">Selected Coordinates</div>
            <div className="text-white font-mono text-sm">{selected.lat.toFixed(5)}, {selected.lon.toFixed(5)}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-800/50 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selected)}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Check className="w-5 h-5" />
            Confirm Location
          </button>
        </div>

      </div>
    </div>
  );
}
