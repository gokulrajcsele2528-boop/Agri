import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, Map, Package, Truck, IndianRupee, CloudRain, BookOpen,
  LayoutDashboard, LogOut, Menu, X, Sprout, Shield, Search,
} from 'lucide-react';
import { useState } from 'react';

const publicLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/map', label: 'Hub Map', icon: Map },
  { to: '/market', label: 'Market Prices', icon: IndianRupee },
  { to: '/advisory', label: 'Crop Advisory', icon: BookOpen },
  { to: '/schemes', label: 'Govt Schemes', icon: Shield },
  { to: '/track', label: 'Track Shipment', icon: Search },
  { to: '/about', label: 'About Project', icon: Sprout },
];

const farmerLinks = [
  { to: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
  { to: '/produce', label: 'My Produce', icon: Package },
  { to: '/book-transport', label: 'Book Transport', icon: Truck },
];

const transporterLinks = [
  { to: '/transporter', label: 'Transporter Hub', icon: Truck },
];

const adminLinks = [
  { to: '/admin', label: 'Admin Panel', icon: LayoutDashboard },
];

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleLinks = user?.role === 'farmer' || user?.role === 'fpo' ? farmerLinks
    : user?.role === 'transporter' ? transporterLinks
    : user?.role === 'admin' ? adminLinks : [];

  const links = [...publicLinks, ...(isAuthenticated ? roleLinks : [])];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-forest-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-600 text-xl">🌾</span>
            <div>
              <span className="font-display text-lg font-bold text-forest-900">AgriRoute NE</span>
              <p className="text-[10px] leading-tight text-forest-600">North East India • First Mile Transport</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.slice(0, 7).map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-forest-100 text-forest-800' : 'text-gray-600 hover:bg-forest-50'}`
              }>{label}</NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">Hi, <strong>{user.name.split(' ')[0]}</strong></span>
                <button onClick={handleLogout} className="btn-secondary !py-2 !px-3 text-xs">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-forest-700 hover:text-forest-900">Login</Link>
                <Link to="/register" className="btn-primary !py-2">Register</Link>
              </>
            )}
          </div>

          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="border-b border-forest-100 bg-white p-4 lg:hidden">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-forest-50">
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
          {!isAuthenticated && (
            <div className="mt-3 flex gap-2">
              <Link to="/login" className="btn-secondary flex-1" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary flex-1" onClick={() => setMobileOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-forest-100 bg-forest-950 text-forest-100">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-display text-lg font-bold text-white">AgriRoute NE</h3>
              <p className="mt-2 text-sm text-forest-300">
                Low-cost Transportation Solution for Agricultural Produce from Remote Farmers to Nearest Road — North Eastern Region
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white">NE States Covered</h4>
              <p className="mt-2 text-sm text-forest-300">Assam • Arunachal Pradesh • Manipur • Meghalaya • Mizoram • Nagaland • Tripura • Sikkim</p>
            </div>
            <div>
              <h4 className="font-semibold text-white">End Semester Project</h4>
              <p className="mt-2 text-sm text-forest-300">Full Stack • React + Node.js + SQLite • Agricultural Value Chain</p>
            </div>
          </div>
          <p className="mt-8 border-t border-forest-800 pt-6 text-center text-xs text-forest-400">
            © 2026 AgriRoute NE — Empowering remote farmers with affordable first-mile connectivity
          </p>
        </div>
      </footer>
    </div>
  );
}
