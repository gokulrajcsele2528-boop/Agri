import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import ProducePage from './pages/ProducePage';
import BookTransport from './pages/BookTransport';
import TransporterDashboard from './pages/TransporterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HubMapPage from './pages/HubMapPage';
import MarketPrices from './pages/MarketPrices';
import CropAdvisory from './pages/CropAdvisory';
import Schemes from './pages/Schemes';
import TrackShipment from './pages/TrackShipment';
import About from './pages/About';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="map" element={<HubMapPage />} />
        <Route path="market" element={<MarketPrices />} />
        <Route path="advisory" element={<CropAdvisory />} />
        <Route path="schemes" element={<Schemes />} />
        <Route path="track" element={<TrackShipment />} />
        <Route path="about" element={<About />} />
        <Route path="dashboard" element={<ProtectedRoute roles={['farmer', 'fpo']}><FarmerDashboard /></ProtectedRoute>} />
        <Route path="produce" element={<ProtectedRoute roles={['farmer', 'fpo']}><ProducePage /></ProtectedRoute>} />
        <Route path="book-transport" element={<ProtectedRoute roles={['farmer', 'fpo']}><BookTransport /></ProtectedRoute>} />
        <Route path="transporter" element={<ProtectedRoute roles={['transporter']}><TransporterDashboard /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
