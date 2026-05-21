import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Truck, CheckCircle } from 'lucide-react';

export default function TransporterDashboard() {
  const [pending, setPending] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const load = () => {
    api.bookings('?status=pending').then(setPending);
    api.bookings().then(b => setMyJobs(b.filter(x => x.status !== 'pending' && x.status !== 'delivered')));
    api.vehicles().then(setVehicles);
  };

  useEffect(() => { load(); }, []);

  const accept = async (id) => {
    const vId = vehicles[0]?.id;
    if (!vId) return alert('Add a vehicle first');
    await api.acceptBooking(id, { vehicleId: vId });
    load();
  };

  const updateStatus = async (id, status) => {
    await api.updateBookingStatus(id, status);
    load();
  };

  const nextStatus = { assigned: 'picked_up', picked_up: 'in_transit', in_transit: 'delivered' };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Transporter Hub</h1>
      <p className="text-gray-600">Accept bookings & manage village-to-road deliveries</p>

      <section className="mt-6 card">
        <h2 className="font-semibold flex items-center gap-2"><Truck className="h-5 w-5" /> My Vehicles</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {vehicles.map(v => (
            <li key={v.id} className="rounded-lg bg-forest-50 px-3 py-2 text-sm">{v.type} — {v.capacity_kg} kg — ₹{v.cost_per_km}/km</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 card">
        <h2 className="font-display text-lg font-semibold">Pending Requests</h2>
        <div className="mt-4 space-y-3">
          {pending.length === 0 ? <p className="text-sm text-gray-500">No pending bookings</p> : pending.map(b => (
            <article key={b.id} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono font-bold text-forest-700">{b.tracking_code}</p>
                <p className="text-sm">{b.from_hub} → {b.to_road} • {b.quantity_kg} kg</p>
                <p className="text-sm font-medium">Earnings: ₹{b.final_cost}</p>
              </div>
              <button onClick={() => accept(b.id)} className="btn-primary shrink-0">Accept Job</button>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 card">
        <h2 className="font-display text-lg font-semibold">Active Jobs</h2>
        <div className="mt-4 space-y-3">
          {myJobs.map(b => (
            <article key={b.id} className="rounded-xl border p-4">
              <p className="font-mono font-bold">{b.tracking_code} — <span className="capitalize">{b.status.replace('_', ' ')}</span></p>
              {nextStatus[b.status] && (
                <button onClick={() => updateStatus(b.id, nextStatus[b.status])} className="btn-secondary mt-3 text-xs">
                  <CheckCircle className="h-4 w-4" /> Mark as {nextStatus[b.status].replace('_', ' ')}
                </button>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
