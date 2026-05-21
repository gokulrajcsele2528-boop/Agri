import { Router } from 'express';
import db from '../db/database.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', authMiddleware, requireRole('admin'), (_req, res) => {
  const stats = {
    totalFarmers: db.prepare(`SELECT COUNT(*) as c FROM users WHERE role = 'farmer'`).get().c,
    totalTransporters: db.prepare(`SELECT COUNT(*) as c FROM users WHERE role = 'transporter'`).get().c,
    activeListings: db.prepare(`SELECT COUNT(*) as c FROM produce_listings WHERE status = 'listed'`).get().c,
    totalBookings: db.prepare(`SELECT COUNT(*) as c FROM transport_bookings`).get().c,
    pendingBookings: db.prepare(`SELECT COUNT(*) as c FROM transport_bookings WHERE status = 'pending'`).get().c,
    deliveredBookings: db.prepare(`SELECT COUNT(*) as c FROM transport_bookings WHERE status = 'delivered'`).get().c,
    totalQuantityMoved: db.prepare(`SELECT COALESCE(SUM(quantity_kg),0) as t FROM transport_bookings WHERE status = 'delivered'`).get().t,
    totalSubsidyGiven: db.prepare(`SELECT COALESCE(SUM(subsidy_amount),0) as t FROM transport_bookings`).get().t,
    collectionHubs: db.prepare(`SELECT COUNT(*) as c FROM collection_hubs WHERE is_active = 1`).get().c,
    roadHeads: db.prepare(`SELECT COUNT(*) as c FROM road_heads`).get().c,
  };

  const bookingsByState = db.prepare(`
    SELECT ch.state, COUNT(*) as bookings, SUM(tb.quantity_kg) as kg_moved
    FROM transport_bookings tb
    JOIN collection_hubs ch ON tb.from_hub_id = ch.id
    GROUP BY ch.state
  `).all();

  const produceByCategory = db.prepare(`
    SELECT pt.category, SUM(pl.quantity_kg) as total_kg
    FROM produce_listings pl
    JOIN produce_types pt ON pl.produce_type_id = pt.id
    GROUP BY pt.category
  `).all();

  const recentBookings = db.prepare(`
    SELECT tb.tracking_code, tb.status, tb.quantity_kg, tb.final_cost, ch.name as hub, u.name as farmer
    FROM transport_bookings tb
    JOIN collection_hubs ch ON tb.from_hub_id = ch.id
    JOIN users u ON tb.farmer_id = u.id
    ORDER BY tb.created_at DESC LIMIT 10
  `).all();

  res.json({ stats, bookingsByState, produceByCategory, recentBookings });
});

router.get('/farmer-summary', authMiddleware, (req, res) => {
  const id = req.user.id;
  res.json({
    listings: db.prepare(`SELECT COUNT(*) as c FROM produce_listings WHERE farmer_id = ?`).get(id).c,
    activeBookings: db.prepare(`SELECT COUNT(*) as c FROM transport_bookings WHERE farmer_id = ? AND status NOT IN ('delivered','cancelled')`).get(id).c,
    totalTransported: db.prepare(`SELECT COALESCE(SUM(quantity_kg),0) as t FROM transport_bookings WHERE farmer_id = ? AND status = 'delivered'`).get(id).t,
    savingsFromSubsidy: db.prepare(`SELECT COALESCE(SUM(subsidy_amount),0) as t FROM transport_bookings WHERE farmer_id = ?`).get(id).t,
  });
});

export default router;
