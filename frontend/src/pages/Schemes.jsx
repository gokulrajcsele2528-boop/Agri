import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Shield } from 'lucide-react';

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [fpos, setFpos] = useState([]);

  useEffect(() => {
    Promise.all([api.schemes(), api.fpo()]).then(([s, f]) => { setSchemes(s); setFpos(f); });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Government Schemes & FPO</h1>
      <p className="text-gray-600">Subsidies integrated into transport cost calculation</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {schemes.map(s => (
          <article key={s.id} className="card">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-100"><Shield className="h-5 w-5 text-forest-700" /></span>
              <div>
                <h3 className="font-display font-semibold">{s.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{s.description}</p>
                <p className="mt-2 text-sm font-medium text-forest-700">Subsidy: up to {s.subsidy_percent}% (max ₹{s.max_subsidy})</p>
                <p className="text-xs text-gray-500">States: {s.states}</p>
                <p className="text-xs text-gray-500">Eligibility: {s.eligibility}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold">Farmer Producer Organizations</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {fpos.map(f => (
            <article key={f.id} className="card">
              <h3 className="font-semibold">{f.name}</h3>
              <p className="text-sm text-gray-500">{f.district}, {f.state}</p>
              <p className="mt-2 text-sm">{f.member_count} members • {f.contact_phone}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
