const API = '/api';

function getToken() {
  return localStorage.getItem('agriroute_token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  health: () => request('/health'),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),

  hubs: () => request('/hubs/collection-hubs'),
  roadHeads: () => request('/hubs/road-heads'),
  nearestHub: (lat, lng, state) => request(`/hubs/nearest-hub?lat=${lat}&lng=${lng}${state ? `&state=${state}` : ''}`),

  produceTypes: () => request('/produce/types'),
  listings: (params = '') => request(`/produce/listings${params}`),
  createListing: (body) => request('/produce/listings', { method: 'POST', body: JSON.stringify(body) }),

  estimate: (body) => request('/transport/estimate', { method: 'POST', body: JSON.stringify(body) }),
  bookings: (params = '') => request(`/transport/bookings${params}`),
  createBooking: (body) => request('/transport/bookings', { method: 'POST', body: JSON.stringify(body) }),
  track: (code) => request(`/transport/track/${code}`),
  acceptBooking: (id, body) => request(`/transport/bookings/${id}/accept`, { method: 'PATCH', body: JSON.stringify(body) }),
  updateBookingStatus: (id, status) => request(`/transport/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  vehicles: () => request('/transport/vehicles'),

  schemes: (state) => request(`/schemes${state ? `?state=${state}` : ''}`),
  fpo: () => request('/schemes/fpo'),
  marketPrices: (state) => request(`/market/prices${state ? `?state=${state}` : ''}`),
  advisories: (state) => request(`/market/advisories${state ? `?state=${state}` : ''}`),
  weather: (state) => request(`/market/weather${state ? `?state=${state}` : ''}`),

  adminDashboard: () => request('/analytics/dashboard'),
  farmerSummary: () => request('/analytics/farmer-summary'),
};
