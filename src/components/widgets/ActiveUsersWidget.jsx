import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon in Vite/React (Leaflet's default breaks with bundlers)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LOCATIONS = [
  { country: 'United Kingdom', pct: 78, flag: '🇬🇧' },
  { country: 'Nigeria', pct: 61, flag: '🇳🇬' },
  { country: 'UAE', pct: 45, flag: '🇦🇪' },
  { country: 'Canada', pct: 59, flag: '🇨🇦' },
  { country: 'United States of America', pct: 78, flag: '🇺🇸' },
];

// Center: Ashok Nagar area (Chennai). Pins with small offsets for visibility.
const MAP_CENTER = [13.038, 80.208];
const MAP_PINS = [
  { name: 'Stanley', position: [13.042, 80.202], color: '#3b82f6' },
  { name: 'Samuel', position: [13.034, 80.214], color: '#ef4444' },
  { name: 'Chisom', position: [13.036, 80.206], color: '#10b981' },
];

function createColoredIcon(color) {
  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `<div style="background-color:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function MapFitBounds() {
  const map = useMap();
  if (MAP_PINS.length > 0) {
    const bounds = L.latLngBounds(MAP_PINS.map((p) => p.position));
    map.fitBounds(bounds.pad(0.3));
  }
  return null;
}

export default function ActiveUsersWidget() {
  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Active Users</span>
          <button type="button" className="p-1.5 rounded-lg bg-[#f6f6f6] hover:bg-[#edf3ff] hover:text-[#5970ff] focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Search users">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        <select className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Select month">
          <option>Month</option>
        </select>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 min-w-0 rounded-lg border border-slate-200 overflow-hidden h-48 bg-slate-100 [&_.leaflet-container]:h-full [&_.leaflet-container]:rounded-lg">
          <MapContainer
            center={MAP_CENTER}
            zoom={14}
            className="h-full w-full"
            scrollWheelZoom={false}
            style={{ height: '100%', minHeight: 192 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapFitBounds />
            {MAP_PINS.map((pin) => (
              <Marker key={pin.name} position={pin.position} icon={createColoredIcon(pin.color)}>
                <Popup>{pin.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className="w-44 shrink-0 space-y-3">
          {LOCATIONS.map((loc) => (
            <div key={loc.country}>
              <div className="flex items-center justify-between text-xs mb-0.5 gap-1">
                <span className="flex items-center gap-1.5 min-w-0">
                  <span aria-hidden className="text-base leading-none">{loc.flag}</span>
                  <span className="text-slate-700 truncate">{loc.country}</span>
                </span>
                <span className="text-slate-600 font-medium shrink-0">{loc.pct}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#47a2fe] rounded-full transition-all"
                  style={{ width: `${loc.pct}%` }}
                  role="progressbar"
                  aria-valuenow={loc.pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${loc.country}: ${loc.pct}%`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
