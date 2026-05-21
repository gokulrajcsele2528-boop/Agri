import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NE_STATES = ['Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'farmer', state: 'Assam', district: '', village: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="card">
        <h1 className="font-display text-2xl font-bold">Register on AgriRoute NE</h1>
        <p className="mt-1 text-sm text-gray-500">Join as farmer, transporter, or FPO</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div><label className="label">Full Name</label><input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Email</label><input type="email" className="input-field" value={form.email} onChange={e => set('email', e.target.value)} required /></div>
            <div><label className="label">Phone</label><input className="input-field" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
          </div>
          <div><label className="label">Password</label><input type="password" className="input-field" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} /></div>
          <div>
            <label className="label">Role</label>
            <select className="input-field" value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="farmer">Farmer</option>
              <option value="transporter">Transporter</option>
              <option value="fpo">FPO / Cooperative</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">State</label>
              <select className="input-field" value={form.state} onChange={e => set('state', e.target.value)}>
                {NE_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="label">District</label><input className="input-field" value={form.district} onChange={e => set('district', e.target.value)} /></div>
          </div>
          <div><label className="label">Village</label><input className="input-field" value={form.village} onChange={e => set('village', e.target.value)} /></div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p className="mt-4 text-center text-sm">Already registered? <Link to="/login" className="text-forest-700 font-semibold">Login</Link></p>
      </div>
    </div>
  );
}
