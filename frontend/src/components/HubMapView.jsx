import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

const hubIcon = new L.DivIcon({
  html: '<div style="background:#16a34a;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:14px">📦</div>',
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const roadIcon = new L.DivIcon({
  html: '<div style="background:#b8844f;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:14px">🛣️</div>',
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function HubMapView({ hubs = [], roads = [] }) {
  const center = hubs.length ? [hubs[0].latitude, hubs[0].longitude] : [25.5, 93.0];

  return (
    <MapContainer center={center} zoom={6} className="h-[480px] w-full rounded-2xl shadow-inner" scrollWheelZoom>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {hubs.map(h => (
        <Marker key={h.id} position={[h.latitude, h.longitude]} icon={hubIcon}>
          <Popup>
            <strong>{h.name}</strong><br />
            {h.village}, {h.district}, {h.state}<br />
            Road distance: <b>{h.road_distance_km} km</b><br />
            Capacity: {h.capacity_kg} kg
          </Popup>
        </Marker>
      ))}
      {roads.map(r => (
        <Marker key={r.id} position={[r.latitude, r.longitude]} icon={roadIcon}>
          <Popup>
            <strong>{r.name}</strong><br />
            {r.highway_name} → {r.market_name}<br />
            Cold storage: {r.cold_storage ? 'Yes' : 'No'}
          </Popup>
        </Marker>
      ))}
      {hubs[0] && roads[0] && (
        <Polyline positions={[[hubs[0].latitude, hubs[0].longitude], [roads[0].latitude, roads[0].longitude]]} color="#16a34a" dashArray="8 8" />
      )}
    </MapContainer>
  );
}
