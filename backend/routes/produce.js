import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db/database.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/types', (_req, res) => {
  res.json(db.prepare('SELECT * FROM produce_types ORDER BY category, name').all());
});

router.get('/listings', authMiddleware, (req, res) => {
  const { status, farmerId } = req.query;
  let sql = `
    SELECT pl.*, pt.name as produce_name, pt.category, pt.perishability,
           u.name as farmer_name, u.village, u.state, ch.name as hub_name
    FROM produce_listings pl
    JOIN produce_types pt ON pl.produce_type_id = pt.id
    JOIN users u ON pl.farmer_id = u.id
    LEFT JOIN collection_hubs ch ON pl.hub_id = ch.id
    WHERE 1=1
  `;
  const params = [];
  if (req.user.role === 'farmer') {
    sql += ' AND pl.farmer_id = ?';
    params.push(req.user.id);
  } else if (farmerId) {
    sql += ' AND pl.farmer_id = ?';
    params.push(farmerId);
  }
  if (status) { sql += ' AND pl.status = ?'; params.push(status); }
  sql += ' ORDER BY pl.created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

router.post('/listings', authMiddleware, requireRole('farmer', 'fpo'), (req, res) => {
  const { produceTypeId, quantityKg, qualityGrade, harvestDate, readyDate, hubId, notes } = req.body;
  if (!produceTypeId || !quantityKg) {
    return res.status(400).json({ error: 'Produce type and quantity required' });
  }
  const id = uuid();
  db.prepare(
    `INSERT INTO produce_listings (id,farmer_id,produce_type_id,quantity_kg,quality_grade,harvest_date,ready_date,hub_id,notes,status)
     VALUES (?,?,?,?,?,?,?,?,?,'listed')`
  ).run(id, req.user.id, produceTypeId, quantityKg, qualityGrade || 'B', harvestDate, readyDate, hubId, notes);

  const listing = db.prepare(`
    SELECT pl.*, pt.name as produce_name FROM produce_listings pl
    JOIN produce_types pt ON pl.produce_type_id = pt.id WHERE pl.id = ?
  `).get(id);
  res.status(201).json(listing);
});

router.patch('/listings/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body;
  const listing = db.prepare('SELECT * FROM produce_listings WHERE id = ?').get(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  if (req.user.role === 'farmer' && listing.farmer_id !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  db.prepare('UPDATE produce_listings SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true, status });
});

export default router;
