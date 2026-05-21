import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { CloudRain } from 'lucide-react';

export default function CropAdvisory() {
  const [advisories, setAdvisories] = useState([]);
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    Promise.all([api.advisories(), api.weather()]).then(([a, w]) => { setAdvisories(a); setWeather(w); });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Crop Advisory & Weather</h1>
      <p className="text-gray-600">Seasonal guidance and transport-risk alerts for NE farmers</p>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold"><CloudRain className="h-5 w-5 text-amber-600" /> Weather Alerts</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {weather.map(w => (
            <article key={w.id} className={`card border-l-4 ${w.severity === 'high' ? 'border-l-red-500 bg-red-50' : 'border-l-amber-500 bg-amber-50'}`}>
              <p className="font-semibold">{w.alert_type} — {w.district}, {w.state}</p>
              <p className="mt-2 text-sm">{w.message}</p>
              <p className="mt-2 text-xs text-gray-500">Valid until: {w.valid_until}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Crop Advisories</h2>
        <div className="mt-4 space-y-4">
          {advisories.map(a => (
            <article key={a.id} className="card">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge bg-forest-100 text-forest-800">{a.state}</span>
                <span className="badge bg-earth-100 text-earth-800">{a.season}</span>
                <span className="font-semibold">{a.crop}</span>
              </div>
              <p className="mt-3 text-sm">{a.advisory}</p>
              {a.pest_alert && <p className="mt-2 text-sm text-red-700">🐛 Pest alert: {a.pest_alert}</p>}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
