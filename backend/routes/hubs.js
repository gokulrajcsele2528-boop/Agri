import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

router.get('/collection-hubs', (req, res) => {
  const { state, district } = req.query;
  let sql = 'SELECT * FROM collection_hubs WHERE is_active = 1';
  const params = [];
  if (state) { sql += ' AND state = ?'; params.push(state); }
  if (district) { sql += ' AND district = ?'; params.push(district); }
  sql += ' ORDER BY state, district';
  res.json(db.prepare(sql).all(...params));
});

router.get('/road-heads', (req, res) => {
  const { state } = req.query;
  let sql = 'SELECT * FROM road_heads WHERE 1=1';
  const params = [];
  if (state) { sql += ' AND state = ?'; params.push(state); }
  res.json(db.prepare(sql).all(...params));
});

router.get('/nearest-hub', (req, res) => {
  const { lat, lng, state } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });

  let hubs = db.prepare('SELECT * FROM collection_hubs WHERE is_active = 1').all();
  if (state) hubs = hubs.filter(h => h.state === state);

  const R = 6371;
  const la1 = parseFloat(lat);
  const lo1 = parseFloat(lng);

  const ranked = hubs.map(h => {
    const dLat = ((h.latitude - la1) * Math.PI) / 180;
    const dLon = ((h.longitude - lo1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((la1 * Math.PI) / 180) * Math.cos((h.latitude * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return { ...h, distance_km: Math.round(dist * 100) / 100 };
  }).sort((a, b) => a.distance_km - b.distance_km);

  res.json(ranked.slice(0, 5));
});

export default router;
