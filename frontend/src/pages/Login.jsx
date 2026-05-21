import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('farmer1@demo.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'transporter') navigate('/transporter');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const demos = [
    { email: 'farmer1@demo.com', role: 'Farmer' },
    { email: 'transporter1@demo.com', role: 'Transporter' },
    { email: 'admin@agriroute.com', role: 'Admin', pass: 'admin123' },
  ];

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="card">
        <div className="mb-6 text-center">
          <span className="text-4xl">🌾</span>
          <h1 className="mt-2 font-display text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-gray-500">Login to AgriRoute NE</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            <LogIn className="h-4 w-4" /> {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          New user? <Link to="/register" className="font-semibold text-forest-700">Register</Link>
        </p>
        <div className="mt-6 border-t border-gray-100 pt-4">
          <p className="text-xs font-medium text-gray-500">Quick demo (password: demo123)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {demos.map(d => (
              <button key={d.email} type="button"
                onClick={() => { setEmail(d.email); setPassword(d.pass || 'demo123'); }}
                className="rounded-lg bg-forest-50 px-3 py-1 text-xs font-medium text-forest-700 hover:bg-forest-100">
                {d.role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
