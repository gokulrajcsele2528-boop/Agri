import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Calculator, Truck } from 'lucide-react';

const VEHICLES = [
  { id: 'headload', label: 'Headload / Porter' },
  { id: 'e_rickshaw_cargo', label: 'E-Rickshaw Cargo' },
  { id: 'tempo', label: 'Tempo' },
  { id: 'pickup_truck', label: 'Pickup Truck' },
  { id: 'community_tractor_trailer', label: 'Community Tractor Trailer' },
];

export default function BookTransport() {
  const [hubs, setHubs] = useState([]);
  const [roads, setRoads] = useState([]);
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({ fromHubId: '', toRoadHeadId: '', quantityKg: '100', listingId: '', vehicleType: 'e_rickshaw_cargo', pickupDate: '', pickupSlot: 'morning' });
  const [estimate, setEstimate] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    Promise.all([api.hubs(), api.roadHeads(), api.listings('?status=listed')]).then(([h, r, l]) => {
      setHubs(h);
      setRoads(r);
      setListings(l);
      setForm(f => ({ ...f, fromHubId: h[0]?.id || '', toRoadHeadId: r[0]?.id || '' }));
    });
  }, []);

  const getEstimate = async () => {
    const est = await api.estimate({
      fromHubId: form.fromHubId,
      toRoadHeadId: form.toRoadHeadId,
      quantityKg: parseFloat(form.quantityKg),
      vehicleType: form.vehicleType,
    });
    setEstimate(est);
  };

  const book = async (e) => {
    e.preventDefault();
    const booking = await api.createBooking({
      ...form,
      quantityKg: parseFloat(form.quantityKg),
      listingId: form.listingId || undefined,
    });
    setResult(booking);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Book Low-cost Transport</h1>
      <p className="text-gray-600">Village collection hub → nearest road head / mandi</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form onSubmit={book} className="card space-y-4">
          <div>
            <label className="label">Collection Hub (Village)</label>
            <select className="input-field" value={form.fromHubId} onChange={e => setForm({ ...form, fromHubId: e.target.value })}>
              {hubs.map(h => <option key={h.id} value={h.id}>{h.name} ({h.road_distance_km} km to road)</option>)}
            </select>
          </div>
          <div>
            <label className="label">Road Head / Market</label>
            <select className="input-field" value={form.toRoadHeadId} onChange={e => setForm({ ...form, toRoadHeadId: e.target.value })}>
              {roads.map(r => <option key={r.id} value={r.id}>{r.name} → {r.market_name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Link Produce Listing (optional)</label>
            <select className="input-field" value={form.listingId} onChange={e => setForm({ ...form, listingId: e.target.value })}>
              <option value="">— None —</option>
              {listings.map(l => <option key={l.id} value={l.id}>{l.produce_name} — {l.quantity_kg} kg</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Quantity (kg)</label><input type="number" className="input-field" value={form.quantityKg} onChange={e => setForm({ ...form, quantityKg: e.target.value })} /></div>
            <div>
              <label className="label">Vehicle Type</label>
              <select className="input-field" value={form.vehicleType} onChange={e => setForm({ ...form, vehicleType: e.target.value })}>
                {VEHICLES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Pickup Date</label><input type="date" className="input-field" value={form.pickupDate} onChange={e => setForm({ ...form, pickupDate: e.target.value })} /></div>
            <div>
              <label className="label">Slot</label>
              <select className="input-field" value={form.pickupSlot} onChange={e => setForm({ ...form, pickupSlot: e.target.value })}>
                <option value="early_morning">Early Morning (5-8 AM)</option>
                <option value="morning">Morning (8-11 AM)</option>
                <option value="afternoon">Afternoon</option>
              </select>
            </div>
          </div>
          <button type="button" onClick={getEstimate} className="btn-secondary w-full"><Calculator className="h-4 w-4" /> Get Cost Estimate</button>
          <button type="submit" className="btn-primary w-full"><Truck className="h-4 w-4" /> Confirm Booking</button>
        </form>

        <aside className="space-y-4">
          {estimate && (
            <article className="card border-2 border-forest-200 bg-forest-50">
              <h2 className="font-display text-lg font-semibold text-forest-900">Cost Estimate</h2>
              <p className="mt-2 text-sm">{estimate.fromHub} → {estimate.toRoadHead}</p>
              <p className="text-sm text-gray-600">Market: {estimate.marketName}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt>Distance (terrain adjusted)</dt><dd>{estimate.distanceKm} km</dd></div>
                <div className="flex justify-between"><dt>Estimated cost</dt><dd className="font-bold">₹{estimate.estimatedCost}</dd></div>
                <div className="flex justify-between text-green-700"><dt>Govt subsidy ({estimate.schemeApplied})</dt><dd>- ₹{estimate.subsidyAmount}</dd></div>
                <div className="flex justify-between border-t pt-2 text-lg font-bold"><dt>Final cost</dt><dd className="text-forest-700">₹{estimate.finalCost}</dd></div>
              </dl>
              <p className="mt-3 text-xs text-gray-500">Recommended: {estimate.recommendedVehicle}</p>
            </article>
          )}
          {result && (
            <article className="card border-2 border-green-300 bg-green-50">
              <h2 className="font-display text-lg font-semibold text-green-800">Booking Confirmed!</h2>
              <p className="mt-2 font-mono text-xl font-bold text-green-900">{result.tracking_code}</p>
              <p className="mt-2 text-sm">Final cost: ₹{result.final_cost} • Status: {result.status}</p>
              <p className="mt-1 text-xs text-gray-600">Use this code on Track Shipment page</p>
            </article>
          )}
        </aside>
      </div>
    </div>
  );
}
