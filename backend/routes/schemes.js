import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

router.get('/', (req, res) => {
  const { state } = req.query;
  let schemes = db.prepare('SELECT * FROM government_schemes WHERE is_active = 1').all();
  if (state) {
    schemes = schemes.filter(s => s.states.includes(state) || s.states.includes('All NE'));
  }
  res.json(schemes);
});

router.get('/fpo', (_req, res) => {
  res.json(db.prepare('SELECT * FROM fpo_organizations ORDER BY state').all());
});

export default router;
