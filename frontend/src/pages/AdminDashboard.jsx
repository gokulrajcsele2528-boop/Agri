import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '../api/client';
import StatCard from '../components/StatCard';
import { Users, Truck, Package, IndianRupee } from 'lucide-react';

const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#15803d', '#166534'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.adminDashboard().then(setData).catch(console.error);
  }, []);

  if (!data) return <p className="p-8 text-center">Loading admin dashboard...</p>;

  const { stats, bookingsByState, produceByCategory, recentBookings } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Admin Control Panel</h1>
      <p className="text-gray-600">North East agricultural transport — system overview</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Farmers" value={stats.totalFarmers} color="forest" />
        <StatCard icon={Truck} label="Transporters" value={stats.totalTransporters} color="blue" />
        <StatCard icon={Package} label="Active Listings" value={stats.activeListings} color="earth" />
        <StatCard icon={IndianRupee} label="Subsidy Disbursed" value={`₹${stats.totalSubsidyGiven}`} color="amber" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card h-80">
          <h2 className="font-display font-semibold">Bookings by State</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={bookingsByState}>
              <XAxis dataKey="state" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
        <section className="card h-80">
          <h2 className="font-display font-semibold">Produce by Category (kg)</h2>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={produceByCategory} dataKey="total_kg" nameKey="category" cx="50%" cy="50%" outerRadius={90} label>
                {produceByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      <section className="mt-8 card">
        <h2 className="font-display font-semibold">Recent Bookings</h2>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b text-left text-gray-500"><th className="pb-2">Code</th><th>Farmer</th><th>Hub</th><th>Qty</th><th>Cost</th><th>Status</th></tr></thead>
          <tbody>
            {recentBookings.map(b => (
              <tr key={b.tracking_code} className="border-b border-gray-50">
                <td className="py-2 font-mono text-forest-700">{b.tracking_code}</td>
                <td>{b.farmer}</td>
                <td>{b.hub}</td>
                <td>{b.quantity_kg} kg</td>
                <td>₹{b.final_cost}</td>
                <td><span className="badge bg-forest-100 text-forest-800">{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-3 text-center text-sm">
        <p className="card">Collection Hubs: <strong>{stats.collectionHubs}</strong></p>
        <p className="card">Road Heads: <strong>{stats.roadHeads}</strong></p>
        <p className="card">Quantity Moved: <strong>{stats.totalQuantityMoved} kg</strong></p>
      </div>
    </div>
  );
}
