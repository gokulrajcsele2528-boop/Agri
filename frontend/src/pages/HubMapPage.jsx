import { useEffect, useState } from 'react';
import { api } from '../api/client';
import HubMapView from '../components/HubMapView';

export default function HubMapPage() {
  const [hubs, setHubs] = useState([]);
  const [roads, setRoads] = useState([]);

  useEffect(() => {
    Promise.all([api.hubs(), api.roadHeads()]).then(([h, r]) => { setHubs(h); setRoads(r); });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Hub & Road Head Map</h1>
      <p className="text-gray-600">Collection centers (📦) and nearest highway road heads (🛣️) across NE India</p>
      <div className="mt-6">
        <HubMapView hubs={hubs} roads={roads} />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hubs.map(h => (
          <article key={h.id} className="card text-sm">
            <h3 className="font-semibold">{h.name}</h3>
            <p className="text-gray-500">{h.district}, {h.state}</p>
            <p className="mt-1">Road distance: <strong>{h.road_distance_km} km</strong> • Capacity: {h.capacity_kg} kg</p>
          </article>
        ))}
      </div>
    </div>
  );
}
