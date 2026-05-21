import { useState } from 'react';
import { api } from '../api/client';
import { Search, CheckCircle, Circle } from 'lucide-react';

export default function TrackShipment() {
  const [code, setCode] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const track = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setData(await api.track(code.trim().toUpperCase()));
    } catch (err) {
      setError(err.message);
      setData(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-center font-display text-3xl font-bold">Track Shipment</h1>
      <p className="text-center text-gray-600">Enter tracking code from booking confirmation</p>
      <form onSubmit={track} className="mt-8 flex gap-2">
        <input className="input-field flex-1 font-mono uppercase" placeholder="e.g. ARNE..." value={code} onChange={e => setCode(e.target.value)} />
        <button type="submit" className="btn-primary"><Search className="h-4 w-4" /> Track</button>
      </form>
      {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      {data && (
        <article className="card mt-8">
          <p className="font-mono text-2xl font-bold text-forest-700">{data.booking.tracking_code}</p>
          <p className="text-sm text-gray-600">{data.booking.from_hub} → {data.booking.to_road}</p>
          <p className="text-sm">Market: {data.booking.market_name} • {data.booking.quantity_kg} kg • ₹{data.booking.final_cost}</p>
          <ol className="mt-8 space-y-4">
            {data.timeline.map(step => (
              <li key={step.status} className="flex items-center gap-3">
                {step.completed ? <CheckCircle className="h-6 w-6 text-forest-600" /> : <Circle className="h-6 w-6 text-gray-300" />}
                <span className={`capitalize ${step.active ? 'font-bold text-forest-800' : 'text-gray-600'}`}>{step.status.replace('_', ' ')}</span>
              </li>
            ))}
          </ol>
        </article>
      )}
    </div>
  );
}
