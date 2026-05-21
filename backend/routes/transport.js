import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db/database.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { calculateTransportCost, applySubsidy, haversineKm, recommendVehicle } from '../utils/costCalculator.js';

const router = Router();

function generateTrackingCode() {
  return 'ARNE' + Date.now().toString(36).toUpperCase().slice(-6);
}

router.post('/estimate', (req, res) => {
  const { fromHubId, toRoadHeadId, quantityKg, produceTypeId, vehicleType } = req.body;
  const hub = db.prepare('SELECT * FROM collection_hubs WHERE id = ?').get(fromHubId);
  const road = db.prepare('SELECT * FROM road_heads WHERE id = ?').get(toRoadHeadId);
  if (!hub || !road) return res.status(404).json({ error: 'Hub or road head not found' });

  const terrainDistance = hub.road_distance_km || haversineKm(hub.latitude, hub.longitude, road.latitude, road.longitude);
  const produce = produceTypeId ? db.prepare('SELECT * FROM produce_types WHERE id = ?').get(produceTypeId) : null;
  const vType = vehicleType || recommendVehicle(quantityKg, terrainDistance);

  const cost = calculateTransportCost({
    vehicleType: vType,
    distanceKm: terrainDistance,
    quantityKg,
    perishability: produce?.perishability || 'medium',
    roadTerrainFactor: 1.25,
  });

  const scheme = db.prepare(`SELECT * FROM government_schemes WHERE name LIKE '%AgriRoute%' AND is_active = 1`).get();
  let subsidy = { subsidyAmount: 0, finalCost: cost.estimatedCost };
  if (scheme && terrainDistance >= 5) {
    subsidy = applySubsidy(cost.estimatedCost, scheme.subsidy_percent, scheme.max_subsidy);
  }

  res.json({
    ...cost,
    ...subsidy,
    recommendedVehicle: vType,
    fromHub: hub.name,
    toRoadHead: road.name,
    marketName: road.market_name,
    schemeApplied: scheme?.name || null,
  });
});

router.get('/vehicles', authMiddleware, (req, res) => {
  let sql = `SELECT v.*, u.name as transporter_name, u.phone FROM vehicles v JOIN users u ON v.transporter_id = u.id WHERE 1=1`;
  const params = [];
  if (req.user.role === 'transporter') {
    sql += ' AND v.transporter_id = ?';
    params.push(req.user.id);
  }
  if (req.query.available === 'true') sql += ' AND v.is_available = 1';
  res.json(db.prepare(sql).all(...params));
});

router.post('/vehicles', authMiddleware, requireRole('transporter'), (req, res) => {
  const { type, registration, capacityKg, costPerKm, fuelType, currentHubId } = req.body;
  const id = uuid();
  db.prepare(`INSERT INTO vehicles VALUES (?,?,?,?,?,?,?,?,?)`).run(
    id, req.user.id, type, registration, capacityKg, costPerKm, fuelType || 'diesel', 1, currentHubId || null
  );
  res.status(201).json(db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id));
});

router.get('/bookings', authMiddleware, (req, res) => {
  let sql = `
    SELECT tb.*, u.name as farmer_name, ch.name as from_hub, rh.name as to_road, rh.market_name,
           pt.name as produce_name, vu.name as transporter_name
    FROM transport_bookings tb
    JOIN users u ON tb.farmer_id = u.id
    JOIN collection_hubs ch ON tb.from_hub_id = ch.id
    JOIN road_heads rh ON tb.to_road_head_id = rh.id
    LEFT JOIN produce_listings pl ON tb.listing_id = pl.id
    LEFT JOIN produce_types pt ON pl.produce_type_id = pt.id
    LEFT JOIN users vu ON tb.transporter_id = vu.id
    WHERE 1=1
  `;
  const params = [];
  if (req.user.role === 'farmer') { sql += ' AND tb.farmer_id = ?'; params.push(req.user.id); }
  if (req.user.role === 'transporter') { sql += ' AND tb.transporter_id = ?'; params.push(req.user.id); }
  if (req.query.status) { sql += ' AND tb.status = ?'; params.push(req.query.status); }
  sql += ' ORDER BY tb.created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

router.post('/bookings', authMiddleware, requireRole('farmer', 'fpo'), (req, res) => {
  const { listingId, fromHubId, toRoadHeadId, quantityKg, vehicleType, pickupDate, pickupSlot } = req.body;

  const hub = db.prepare('SELECT * FROM collection_hubs WHERE id = ?').get(fromHubId);
  const road = db.prepare('SELECT * FROM road_heads WHERE id = ?').get(toRoadHeadId);
  if (!hub || !road) return res.status(404).json({ error: 'Invalid hub or road head' });

  let produceTypeId = null;
  if (listingId) {
    const listing = db.prepare('SELECT * FROM produce_listings WHERE id = ?').get(listingId);
    if (listing) produceTypeId = listing.produce_type_id;
  }
  const produce = produceTypeId ? db.prepare('SELECT * FROM produce_types WHERE id = ?').get(produceTypeId) : null;
  const terrainDistance = hub.road_distance_km || 10;
  const vType = vehicleType || recommendVehicle(quantityKg, terrainDistance);
  const cost = calculateTransportCost({ vehicleType: vType, distanceKm: terrainDistance, quantityKg, perishability: produce?.perishability || 'medium', roadTerrainFactor: 1.25 });
  const scheme = db.prepare(`SELECT * FROM government_schemes WHERE name LIKE '%AgriRoute%' AND is_active = 1`).get();
  const subsidy = scheme && terrainDistance >= 5 ? applySubsidy(cost.estimatedCost, scheme.subsidy_percent, scheme.max_subsidy) : { subsidyAmount: 0, finalCost: cost.estimatedCost };

  const id = uuid();
  const trackingCode = generateTrackingCode();
  db.prepare(`
    INSERT INTO transport_bookings (id,farmer_id,listing_id,from_hub_id,to_road_head_id,quantity_kg,distance_km,estimated_cost,subsidy_amount,final_cost,status,pickup_date,pickup_slot,tracking_code)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(id, req.user.id, listingId || null, fromHubId, toRoadHeadId, quantityKg, cost.distanceKm, cost.estimatedCost, subsidy.subsidyAmount, subsidy.finalCost, 'pending', pickupDate, pickupSlot, trackingCode);

  if (listingId) db.prepare(`UPDATE produce_listings SET status = 'booked' WHERE id = ?`).run(listingId);

  res.status(201).json(db.prepare('SELECT * FROM transport_bookings WHERE id = ?').get(id));
});

router.get('/track/:code', (req, res) => {
  const booking = db.prepare(`
    SELECT tb.*, ch.name as from_hub, rh.name as to_road, rh.market_name, u.name as farmer_name, u.phone as farmer_phone
    FROM transport_bookings tb
    JOIN collection_hubs ch ON tb.from_hub_id = ch.id
    JOIN road_heads rh ON tb.to_road_head_id = rh.id
    JOIN users u ON tb.farmer_id = u.id
    WHERE tb.tracking_code = ?
  `).get(req.params.code);
  if (!booking) return res.status(404).json({ error: 'Tracking code not found' });

  const timeline = getStatusTimeline(booking.status);
  res.json({ booking, timeline });
});

router.patch('/bookings/:id/accept', authMiddleware, requireRole('transporter'), (req, res) => {
  const { vehicleId } = req.body;
  const booking = db.prepare('SELECT * FROM transport_bookings WHERE id = ?').get(req.params.id);
  if (!booking || booking.status !== 'pending') return res.status(400).json({ error: 'Booking not available' });

  db.prepare(`UPDATE transport_bookings SET status = 'assigned', transporter_id = ?, vehicle_id = ? WHERE id = ?`)
    .run(req.user.id, vehicleId, req.params.id);
  res.json({ success: true, status: 'assigned' });
});

router.patch('/bookings/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body;
  const valid = ['picked_up', 'in_transit', 'delivered', 'cancelled'];
  if (!valid.includes(status) && status !== 'assigned') return res.status(400).json({ error: 'Invalid status' });

  const booking = db.prepare('SELECT * FROM transport_bookings WHERE id = ?').get(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Not found' });

  const completedAt = status === 'delivered' ? new Date().toISOString() : null;
  db.prepare(`UPDATE transport_bookings SET status = ?, completed_at = COALESCE(?, completed_at) WHERE id = ?`)
    .run(status, completedAt, req.params.id);

  if (status === 'delivered' && booking.listing_id) {
    db.prepare(`UPDATE produce_listings SET status = 'delivered' WHERE id = ?`).run(booking.listing_id);
  }
  res.json({ success: true, status });
});

function getStatusTimeline(current) {
  const steps = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered'];
  const idx = steps.indexOf(current);
  return steps.map((s, i) => ({ status: s, completed: i <= idx, active: i === idx }));
}

export default router;
