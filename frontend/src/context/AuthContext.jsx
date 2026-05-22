import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const switchUser = async (role) => {
    setLoading(true);
    let email = 'farmer1@demo.com';
    let password = 'demo123';
    if (role === 'transporter') {
      email = 'transporter1@demo.com';
    } else if (role === 'admin') {
      email = 'admin@agriroute.com';
      password = 'admin123';
    } else if (role === 'fpo') {
      email = 'fpo@demo.com';
    }

    try {
      const { user: u, token } = await api.login({ email, password });
      localStorage.setItem('agriroute_token', token);
      setUser(u);
      return u;
    } catch (err) {
      console.error("Auto/Switch login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('agriroute_token');
    if (token) {
      api.me()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('agriroute_token');
          switchUser('farmer');
        })
        .finally(() => setLoading(false));
    } else {
      switchUser('farmer');
    }
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
    switchUser('farmer');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
