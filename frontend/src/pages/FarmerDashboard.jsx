import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, IndianRupee, Plus, ArrowRight } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    Promise.all([
      api.farmerSummary(),
      api.listings(),
      api.bookings(),
      api.weather(user?.state),
    ]).then(([s, l, b, w]) => {
      setSummary(s);
      setListings(l.slice(0, 5));
      setBookings(b.filter(x => x.status !== 'delivered').slice(0, 5));
      setWeather(w);
    }).catch(console.error);
  }, [user?.state]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-900">Farmer Dashboard</h1>
          <p className="text-gray-600">{user?.name} • {user?.village}, {user?.district}, {user?.state}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/produce" className="btn-secondary"><Plus className="h-4 w-4" /> List Produce</Link>
          <Link to="/book-transport" className="btn-primary"><Truck className="h-4 w-4" /> Book Transport</Link>
        </div>
      </div>

      {weather.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-amber-800">⚠️ Weather Alert — {weather[0].alert_type}</p>
          <p className="mt-1 text-sm text-amber-700">{weather[0].message}</p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Produce Listings" value={summary?.listings ?? '—'} color="forest" />
        <StatCard icon={Truck} label="Active Bookings" value={summary?.activeBookings ?? '—'} color="blue" />
        <StatCard icon={Package} label="Total Transported (kg)" value={summary?.totalTransported ?? '—'} color="earth" />
        <StatCard icon={IndianRupee} label="Subsidy Saved (₹)" value={summary?.savingsFromSubsidy ?? '—'} color="amber" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">My Produce</h2>
            <Link to="/produce" className="text-sm font-medium text-forest-700">View all <ArrowRight className="inline h-4 w-4" /></Link>
          </div>
          <ul className="mt-4 space-y-3">
            {listings.length === 0 ? <p className="text-sm text-gray-500">No listings yet</p> : listings.map(l => (
              <li key={l.id} className="flex items-center justify-between rounded-xl bg-forest-50 px-4 py-3">
                <div>
                  <p className="font-medium">{l.produce_name}</p>
                  <p className="text-xs text-gray-500">{l.quantity_kg} kg • Grade {l.quality_grade}</p>
                </div>
                <span className={`badge ${l.status === 'listed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{l.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Active Transport</h2>
            <Link to="/track" className="text-sm font-medium text-forest-700">Track</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {bookings.length === 0 ? <p className="text-sm text-gray-500">No active bookings</p> : bookings.map(b => (
              <li key={b.id} className="rounded-xl border border-gray-100 px-4 py-3">
                <p className="font-mono text-sm font-bold text-forest-700">{b.tracking_code}</p>
                <p className="text-xs text-gray-500">{b.from_hub} → {b.to_road}</p>
                <p className="mt-1 text-sm">₹{b.final_cost} • {b.status}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
