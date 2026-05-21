import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function ProducePage() {
  const [types, setTypes] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({ produceTypeId: '', quantityKg: '', qualityGrade: 'B', harvestDate: '', readyDate: '', hubId: '', notes: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    Promise.all([api.produceTypes(), api.hubs(), api.listings()]).then(([t, h, l]) => {
      setTypes(t);
      setHubs(h);
      setListings(l);
      if (t[0]) setForm(f => ({ ...f, produceTypeId: t[0].id }));
      if (h[0]) setForm(f => ({ ...f, hubId: h[0].id }));
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.createListing({ ...form, quantityKg: parseFloat(form.quantityKg) });
      setMsg('Produce listed successfully!');
      setListings(await api.listings());
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Produce Management</h1>
      <p className="text-gray-600">Register harvest-ready crops for transport booking</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form onSubmit={submit} className="card space-y-4">
          <h2 className="font-display text-lg font-semibold">New Produce Listing</h2>
          <div>
            <label className="label">Crop / Produce</label>
            <select className="input-field" value={form.produceTypeId} onChange={e => setForm({ ...form, produceTypeId: e.target.value })}>
              {types.map(t => <option key={t.id} value={t.id}>{t.name} ({t.category})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Quantity (kg)</label><input type="number" className="input-field" value={form.quantityKg} onChange={e => setForm({ ...form, quantityKg: e.target.value })} required /></div>
            <div>
              <label className="label">Quality Grade</label>
              <select className="input-field" value={form.qualityGrade} onChange={e => setForm({ ...form, qualityGrade: e.target.value })}>
                <option>A</option><option>B</option><option>C</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Harvest Date</label><input type="date" className="input-field" value={form.harvestDate} onChange={e => setForm({ ...form, harvestDate: e.target.value })} /></div>
            <div><label className="label">Ready for Pickup</label><input type="date" className="input-field" value={form.readyDate} onChange={e => setForm({ ...form, readyDate: e.target.value })} /></div>
          </div>
          <div>
            <label className="label">Collection Hub</label>
            <select className="input-field" value={form.hubId} onChange={e => setForm({ ...form, hubId: e.target.value })}>
              {hubs.map(h => <option key={h.id} value={h.id}>{h.name} — {h.district}</option>)}
            </select>
          </div>
          <div><label className="label">Notes</label><textarea className="input-field" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
          {msg && <p className="text-sm text-forest-700">{msg}</p>}
          <button type="submit" className="btn-primary">List Produce</button>
        </form>

        <section className="card">
          <h2 className="font-display text-lg font-semibold">My Listings</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-gray-500"><th className="pb-2">Produce</th><th>Qty</th><th>Status</th></tr></thead>
              <tbody>
                {listings.map(l => (
                  <tr key={l.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium">{l.produce_name}</td>
                    <td>{l.quantity_kg} kg</td>
                    <td><span className="badge bg-forest-100 text-forest-800">{l.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
