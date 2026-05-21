import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

router.get('/prices', (req, res) => {
  const { state, produceTypeId } = req.query;
  let sql = `
    SELECT mp.*, pt.name as produce_name, pt.category
    FROM market_prices mp
    JOIN produce_types pt ON mp.produce_type_id = pt.id
    WHERE 1=1
  `;
  const params = [];
  if (state) { sql += ' AND mp.state = ?'; params.push(state); }
  if (produceTypeId) { sql += ' AND mp.produce_type_id = ?'; params.push(produceTypeId); }
  sql += ' ORDER BY mp.date DESC, pt.name';
  res.json(db.prepare(sql).all(...params));
});

router.get('/advisories', (req, res) => {
  const { state } = req.query;
  let sql = 'SELECT * FROM crop_advisories WHERE 1=1';
  const params = [];
  if (state) { sql += ' AND state = ?'; params.push(state); }
  sql += ' ORDER BY created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

router.get('/weather', (req, res) => {
  const { state } = req.query;
  let sql = 'SELECT * FROM weather_alerts WHERE 1=1';
  const params = [];
  if (state) { sql += ' AND state = ?'; params.push(state); }
  res.json(db.prepare(sql).all(...params));
});

export default router;
