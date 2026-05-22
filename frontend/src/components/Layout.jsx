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
  const { user, logout, switchUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleLinks = user?.role === 'farmer' || user?.role === 'fpo' ? farmerLinks
    : user?.role === 'transporter' ? transporterLinks
    : user?.role === 'admin' ? adminLinks : [];

  const links = [...publicLinks, ...(isAuthenticated ? roleLinks : [])];

  const handleRoleChange = async (role) => {
    const newUser = await switchUser(role);
    if (newUser) {
      if (newUser.role === 'farmer' || newUser.role === 'fpo') {
        navigate('/dashboard');
      } else if (newUser.role === 'transporter') {
        navigate('/transporter');
      } else if (newUser.role === 'admin') {
        navigate('/admin');
      }
    }
  };

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

          <nav className="hidden items-center gap-1 lg:flex flex-wrap">
            {publicLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-forest-100 text-forest-800' : 'text-gray-600 hover:bg-forest-50'}`
              }>{label}</NavLink>
            ))}
            {isAuthenticated && roleLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-earth-100 text-earth-800' : 'text-earth-700 bg-earth-50 hover:bg-earth-100'}`
              }>{label}</NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex items-center gap-2 bg-forest-50 rounded-xl p-1 border border-forest-100">
              <span className="text-xs font-semibold text-forest-700 px-2">Role:</span>
              <select
                value={user?.role || 'farmer'}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="bg-white border border-forest-200 text-xs font-semibold text-forest-800 rounded-lg py-1 px-2.5 focus:ring-1 focus:ring-forest-500 cursor-pointer outline-none shadow-sm"
              >
                <option value="farmer">🌾 Farmer</option>
                <option value="fpo">🏢 FPO</option>
                <option value="transporter">🚚 Transporter</option>
                <option value="admin">👑 Admin</option>
              </select>
            </div>
            {isAuthenticated && user && (
              <span className="text-xs text-gray-600">
                Hi, <strong>{user.name.split(' ')[0]}</strong>
              </span>
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
          <div className="mt-3 flex flex-col gap-2 border-t border-forest-100 pt-3">
            <div className="flex items-center justify-between bg-forest-50 rounded-xl p-2 border border-forest-100">
              <span className="text-sm font-semibold text-forest-700">Switch Role:</span>
              <select
                value={user?.role || 'farmer'}
                onChange={(e) => {
                  handleRoleChange(e.target.value);
                  setMobileOpen(false);
                }}
                className="bg-white border border-forest-200 text-sm font-semibold text-forest-800 rounded-lg py-1 px-3 focus:ring-1 focus:ring-forest-500 cursor-pointer outline-none"
              >
                <option value="farmer">🌾 Farmer</option>
                <option value="fpo">🏢 FPO</option>
                <option value="transporter">🚚 Transporter</option>
                <option value="admin">👑 Admin</option>
              </select>
            </div>
          </div>
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
