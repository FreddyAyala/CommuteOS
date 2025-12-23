import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { X } from 'lucide-react';
import type { RouteData } from '../lib/api';
import type { Location } from '../hooks/useAppStore';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Vite/Webpack
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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  route: RouteData | null;
  start: Location;
  end: Location;
}

// Component to auto-zoom to the route bounds
function BoundsUpdater({ route, start, end }: { route: RouteData | null, start: Location, end: Location }) {
  const map = useMap();

  useEffect(() => {
    if (!route || !route.geometry) {
      // Just fly to start if no route
      map.setView([start.lat, start.lon], 13);
      return;
    }

    const coordinates = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map, start, end]);

  return null;
}

export function RouteMapModal({ isOpen, onClose, route, start, end }: Props) {
  if (!isOpen) return null;

  const polylinePositions = route?.geometry?.coordinates.map((c: number[]) => [c[1], c[0]]) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[80vh] bg-slate-900 rounded-3xl border border-white/10 overflow-hidden flex flex-col">

        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-white">Commute Details</h2>
            <p className="text-sm text-slate-400">
              From <span className="text-white font-medium">Home</span> to <span className="text-white font-medium">Work</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[start.lat, start.lon]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <Marker position={[start.lat, start.lon]}>
              <Popup>Home</Popup>
            </Marker>

            <Marker position={[end.lat, end.lon]}>
              <Popup>Work</Popup>
            </Marker>

            {polylinePositions.length > 0 && (
              <Polyline
                positions={polylinePositions as [number, number][]}
                pathOptions={{ color: '#3b82f6', weight: 5, opacity: 0.7 }}
              />
            )}

            <BoundsUpdater route={route} start={start} end={end} />
          </MapContainer>
        </div>

        {/* Footer Stats */}
        <div className="p-4 bg-slate-800/50 border-t border-white/10 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold">Total Distance</div>
            <div className="text-xl font-mono text-white">
              {route ? (route.distance / 1609.34).toFixed(1) : 0} miles
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold">Est. Duration</div>
            <div className="text-xl font-mono text-white">
              {route ? Math.round(route.duration / 60) : 0} mins
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
