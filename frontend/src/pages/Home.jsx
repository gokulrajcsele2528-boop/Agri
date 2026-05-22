import { Link } from 'react-router-dom';
import { Truck, Map, IndianRupee, Sprout, Users, Route, Shield, ArrowRight } from 'lucide-react';

const features = [
  { icon: Sprout, title: 'Produce Registration', desc: 'Farmers list harvest-ready crops with quality grade, quantity & collection hub.' },
  { icon: Truck, title: 'Low-cost Transport', desc: 'E-rickshaw, tractor-trailer, tempo — optimized for hilly NE terrain & perishability.' },
  { icon: Route, title: 'Village to Road Head', desc: 'First-mile connectivity from remote tribal villages to nearest highway & mandi.' },
  { icon: Map, title: 'Hub & Road Mapping', desc: 'Interactive map of collection centers and road-head markets across 8 NE states.' },
  { icon: IndianRupee, title: 'Market Intelligence', desc: 'Live mandi prices, crop advisories, and weather alerts for transport planning.' },
  { icon: Shield, title: 'Government Subsidies', desc: 'PMKSY, MOVCD, Kisan Rail & AgriRoute NE transport subsidy integration.' },
];

const workflow = [
  { step: '01', title: 'Register & List Produce', desc: 'Farmer creates account, registers crop (ginger, pineapple, rice, cardamom) with harvest date.' },
  { step: '02', title: 'Select Collection Hub', desc: 'Nearest village aggregation point based on GPS — Diphu, Andro, Mawlynnong, Ziro, etc.' },
  { step: '03', title: 'Get Cost Estimate', desc: 'AI-based low-cost vehicle recommendation with terrain factor & perishability multiplier.' },
  { step: '04', title: 'Book Transport', desc: 'Schedule pickup slot; government subsidy auto-applied for remote farmers >5km from road.' },
  { step: '05', title: 'Transporter Pickup', desc: 'Local transporter accepts job, picks produce, delivers to road-head mandi.' },
  { step: '06', title: 'Track & Sell', desc: 'Real-time tracking code; produce reaches wholesale market for fair price realization.' },
];

const stats = [
  { value: '8', label: 'NE States' },
  { value: '6+', label: 'Collection Hubs' },
  { value: '40%', label: 'Max Subsidy' },
  { value: '₹8/km', label: 'From (E-rickshaw)' },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-forest-500/30 px-4 py-1.5 text-sm font-medium text-forest-100 ring-1 ring-forest-400/40">
              🌾 End Semester Project • Full Stack Agricultural Platform
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Low-cost Transportation for Agricultural Produce
            </h1>
            <p className="mt-2 text-xl font-medium text-forest-200">Remote Farmers → Nearest Road • North Eastern Region</p>
            <p className="mt-6 text-lg leading-relaxed text-forest-100/90">
              AgriRoute NE connects tribal & hill farmers in Assam, Manipur, Meghalaya and beyond to mandis via affordable first-mile logistics, government subsidies, and real-time tracking.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/dashboard" className="btn-primary !bg-white !text-forest-800 hover:!bg-forest-50">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/book-transport" className="rounded-xl border-2 border-white/40 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
                Book Transport
              </Link>
              <Link to="/map" className="rounded-xl border-2 border-white/40 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
                View Hub Map
              </Link>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map(s => (
              <div key={s.label} className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur-sm ring-1 ring-white/20">
                <p className="font-display text-3xl font-bold">{s.value}</p>
                <p className="text-sm text-forest-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-forest-900">Complete Agricultural Value Chain</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">From farm gate to road head — everything a remote NE farmer needs in one platform</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(f => (
            <div key={f.title} className="card group transition hover:border-forest-300 hover:shadow-md">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-100 text-forest-700 transition group-hover:bg-forest-600 group-hover:text-white">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-forest-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-display text-3xl font-bold text-forest-900">How It Works — Start to End</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workflow.map(w => (
              <div key={w.step} className="relative rounded-2xl border border-forest-200 bg-white p-6">
                <span className="font-display text-4xl font-bold text-forest-200">{w.step}</span>
                <h3 className="mt-2 font-display text-lg font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-earth-500 to-earth-600 p-8 text-white lg:p-12">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div>
              <h2 className="font-display text-2xl font-bold lg:text-3xl">Ready to move your harvest?</h2>
              <p className="mt-2 text-earth-100">Access all roles (Farmer, Transporter, FPO, Admin) instantly from the role switcher in the navigation bar above!</p>
            </div>
            <Link to="/dashboard" className="btn-primary !bg-white !text-earth-800 shrink-0">
              <Users className="h-4 w-4" /> Go to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
