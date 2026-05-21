import { useEffect, useState } from 'react';
import { api } from '../api/client';

const STATES = ['', 'Assam', 'Manipur', 'Meghalaya', 'Tripura'];

export default function MarketPrices() {
  const [state, setState] = useState('');
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    api.marketPrices(state || undefined).then(setPrices);
  }, [state]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Mandi Market Prices</h1>
      <p className="text-gray-600">Daily wholesale rates to help farmers decide when to transport & sell</p>
      <select className="input-field mt-4 max-w-xs" value={state} onChange={e => setState(e.target.value)}>
        <option value="">All States</option>
        {STATES.filter(Boolean).map(s => <option key={s}>{s}</option>)}
      </select>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {prices.map(p => (
          <article key={p.id} className="card">
            <p className="text-xs font-medium uppercase text-forest-600">{p.category}</p>
            <h3 className="font-display text-lg font-semibold">{p.produce_name}</h3>
            <p className="mt-2 text-2xl font-bold text-forest-700">₹{p.price_per_kg}<span className="text-sm font-normal text-gray-500">/kg</span></p>
            <p className="mt-1 text-sm text-gray-500">{p.market_name} • {p.state}</p>
            <p className="text-xs text-gray-400">{p.date}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
