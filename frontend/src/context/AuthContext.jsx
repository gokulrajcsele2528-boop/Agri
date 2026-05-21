import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('agriroute_token');
    if (token) {
      api.me().then(setUser).catch(() => localStorage.removeItem('agriroute_token')).finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { user: u, token } = await api.login({ email, password });
    localStorage.setItem('agriroute_token', token);
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const { user: u, token } = await api.register(data);
    localStorage.setItem('agriroute_token', token);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('agriroute_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
