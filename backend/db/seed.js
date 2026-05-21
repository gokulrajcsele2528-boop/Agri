import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import db, { initDatabase } from './database.js';

initDatabase();

const hash = (p) => bcrypt.hashSync(p, 10);

const users = [
  { id: uuid(), name: 'Ramen Das', email: 'farmer1@demo.com', password: hash('demo123'), phone: '9876543210', role: 'farmer', state: 'Assam', district: 'Karbi Anglong', village: 'Diphu Hills', latitude: 25.8607, longitude: 93.0172 },
  { id: uuid(), name: 'Mary Kom', email: 'farmer2@demo.com', password: hash('demo123'), phone: '9876543211', role: 'farmer', state: 'Manipur', district: 'Imphal East', village: 'Andro', latitude: 24.7833, longitude: 94.0500 },
  { id: uuid(), name: 'Kong Iang', email: 'farmer3@demo.com', password: hash('demo123'), phone: '9876543212', role: 'farmer', state: 'Meghalaya', district: 'East Khasi Hills', village: 'Mawlynnong', latitude: 25.2000, longitude: 91.9167 },
  { id: uuid(), name: 'Bikash Transport', email: 'transporter1@demo.com', password: hash('demo123'), phone: '9876543220', role: 'transporter', state: 'Assam', district: 'Nagaon', village: 'Kampur', latitude: 26.3500, longitude: 92.9500 },
  { id: uuid(), name: 'NE Agri Movers', email: 'transporter2@demo.com', password: hash('demo123'), phone: '9876543221', role: 'transporter', state: 'Tripura', district: 'West Tripura', village: 'Agartala Rural', latitude: 23.8315, longitude: 91.2868 },
  { id: uuid(), name: 'Admin NE', email: 'admin@agriroute.com', password: hash('admin123'), phone: '9876543299', role: 'admin', state: 'Assam', district: 'Guwahati', village: 'Dispur', latitude: 26.1445, longitude: 91.7362 },
  { id: uuid(), name: 'Karbi FPO', email: 'fpo@demo.com', password: hash('demo123'), phone: '9876543230', role: 'fpo', state: 'Assam', district: 'Karbi Anglong', village: 'Diphu', latitude: 25.8500, longitude: 93.0300 },
];

const hubs = [
  { id: 'hub-diphu', name: 'Diphu Tribal Collection Center', type: 'village_collection', state: 'Assam', district: 'Karbi Anglong', village: 'Diphu', latitude: 25.8607, longitude: 93.0172, road_distance_km: 12.5, capacity_kg: 5000, contact_phone: '0361-2345678' },
  { id: 'hub-andro', name: 'Andro Valley Produce Point', type: 'village_collection', state: 'Manipur', district: 'Imphal East', village: 'Andro', latitude: 24.7833, longitude: 94.0500, road_distance_km: 8.2, capacity_kg: 3000, contact_phone: '0385-2345678' },
  { id: 'hub-mawlynnong', name: 'Mawlynnong Organic Hub', type: 'village_collection', state: 'Meghalaya', district: 'East Khasi Hills', village: 'Mawlynnong', latitude: 25.2000, longitude: 91.9167, road_distance_km: 6.0, capacity_kg: 2500, contact_phone: '0364-2345678' },
  { id: 'hub-ziro', name: 'Ziro Plateau Aggregation', type: 'aggregation', state: 'Arunachal Pradesh', district: 'Lower Subansiri', village: 'Ziro', latitude: 27.5430, longitude: 93.8260, road_distance_km: 15.0, capacity_kg: 8000, contact_phone: '03788-234567' },
  { id: 'hub-mokokchung', name: 'Mokokchung Hill Hub', type: 'village_collection', state: 'Nagaland', district: 'Mokokchung', village: 'Mokokchung Town', latitude: 26.3240, longitude: 94.5150, road_distance_km: 10.0, capacity_kg: 4000, contact_phone: '0369-2345678' },
  { id: 'hub-aizawl', name: 'Aizawl Peri-Urban Center', type: 'aggregation', state: 'Mizoram', district: 'Aizawl', village: 'Durtlang', latitude: 23.7560, longitude: 92.7320, road_distance_km: 5.5, capacity_kg: 6000, contact_phone: '0389-2345678' },
];

const roadHeads = [
  { id: 'road-diphu', name: 'NH-29 Diphu Road Head', state: 'Assam', district: 'Karbi Anglong', highway_name: 'NH-29', latitude: 25.8800, longitude: 93.0500, market_name: 'Diphu Wholesale Mandi', cold_storage: 1 },
  { id: 'road-imphal', name: 'Imphal-Jiribam Highway Point', state: 'Manipur', district: 'Imphal East', highway_name: 'NH-37', latitude: 24.8100, longitude: 94.0200, market_name: 'Imphal Khwairamband Market Link', cold_storage: 1 },
  { id: 'road-shillong', name: 'Shillong-Dawki Road Junction', state: 'Meghalaya', district: 'East Khasi Hills', highway_name: 'NH-206', latitude: 25.2200, longitude: 91.9400, market_name: 'Iewduh Market Access', cold_storage: 0 },
  { id: 'road-ziro', name: 'Ziro-Hapoli Road Terminal', state: 'Arunachal Pradesh', district: 'Lower Subansiri', highway_name: 'NH-13', latitude: 27.5600, longitude: 93.8500, market_name: 'Ziro APEDA Collection', cold_storage: 1 },
  { id: 'road-agartala', name: 'Agartala-Sabroom Corridor', state: 'Tripura', district: 'West Tripura', highway_name: 'NH-8', latitude: 23.8500, longitude: 91.3000, market_name: 'Battala Market Hub', cold_storage: 1 },
];

const produceTypes = [
  { id: 'prod-rice', name: 'Sticky Rice (Bora Saul)', category: 'cereals', shelf_life_days: 180, perishability: 'low', avg_price_per_kg: 35 },
  { id: 'prod-pineapple', name: 'Queen Pineapple', category: 'fruits', shelf_life_days: 7, perishability: 'high', avg_price_per_kg: 25 },
  { id: 'prod-ginger', name: 'Naga Ginger', category: 'spices', shelf_life_days: 30, perishability: 'medium', avg_price_per_kg: 80 },
  { id: 'prod-orange', name: 'Khasi Mandarin', category: 'fruits', shelf_life_days: 14, perishability: 'medium', avg_price_per_kg: 45 },
  { id: 'prod-bamboo', name: 'Bamboo Shoot', category: 'vegetables', shelf_life_days: 3, perishability: 'high', avg_price_per_kg: 60 },
  { id: 'prod-black-pepper', name: 'Black Pepper', category: 'spices', shelf_life_days: 365, perishability: 'low', avg_price_per_kg: 450 },
  { id: 'prod-arecanut', name: 'Arecanut', category: 'plantation', shelf_life_days: 90, perishability: 'low', avg_price_per_kg: 280 },
  { id: 'prod-large-cardamom', name: 'Large Cardamom', category: 'spices', shelf_life_days: 365, perishability: 'low', avg_price_per_kg: 1200 },
];

console.log('Seeding AgriRoute NE database...');

db.exec('DELETE FROM payments; DELETE FROM transport_bookings; DELETE FROM produce_listings; DELETE FROM vehicles; DELETE FROM market_prices; DELETE FROM weather_alerts; DELETE FROM crop_advisories; DELETE FROM government_schemes; DELETE FROM fpo_organizations; DELETE FROM road_heads; DELETE FROM collection_hubs; DELETE FROM produce_types; DELETE FROM users;');

const insertUser = db.prepare(`INSERT INTO users (id,name,email,password,phone,role,state,district,village,latitude,longitude) VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
users.forEach(u => insertUser.run(u.id, u.name, u.email, u.password, u.phone, u.role, u.state, u.district, u.village, u.latitude, u.longitude));

const insertHub = db.prepare(`INSERT INTO collection_hubs VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);
hubs.forEach(h => insertHub.run(h.id, h.name, h.type, h.state, h.district, h.village, h.latitude, h.longitude, h.road_distance_km, h.capacity_kg, h.contact_phone, 1));

const insertRoad = db.prepare(`INSERT INTO road_heads VALUES (?,?,?,?,?,?,?,?,?)`);
roadHeads.forEach(r => insertRoad.run(r.id, r.name, r.state, r.district, r.highway_name, r.latitude, r.longitude, r.market_name, r.cold_storage));

const insertProduce = db.prepare(`INSERT INTO produce_types VALUES (?,?,?,?,?,?)`);
produceTypes.forEach(p => insertProduce.run(p.id, p.name, p.category, p.shelf_life_days, p.perishability, p.avg_price_per_kg));

const farmerIds = users.filter(u => u.role === 'farmer').map(u => u.id);
const transporterIds = users.filter(u => u.role === 'transporter').map(u => u.id);

const insertListing = db.prepare(`INSERT INTO produce_listings (id,farmer_id,produce_type_id,quantity_kg,quality_grade,harvest_date,ready_date,status,hub_id,notes) VALUES (?,?,?,?,?,?,?,?,?,?)`);
insertListing.run(uuid(), farmerIds[0], 'prod-ginger', 500, 'A', '2026-05-10', '2026-05-15', 'listed', 'hub-diphu', 'Organic Naga ginger batch');
insertListing.run(uuid(), farmerIds[1], 'prod-rice', 1200, 'B', '2026-05-12', '2026-05-18', 'listed', 'hub-andro', 'Sticky rice for local mandi');
insertListing.run(uuid(), farmerIds[2], 'prod-pineapple', 300, 'A', '2026-05-14', '2026-05-16', 'listed', 'hub-mawlynnong', 'Queen pineapple - urgent transport needed');

db.prepare(`INSERT INTO vehicles VALUES (?,?,?,?,?,?,?,?,?)`).run(uuid(), transporterIds[0], 'e_rickshaw_cargo', 'AS-01-AB-1234', 500, 8, 'electric', 1, 'hub-diphu');
db.prepare(`INSERT INTO vehicles VALUES (?,?,?,?,?,?,?,?,?)`).run(uuid(), transporterIds[0], 'pickup_truck', 'AS-01-CD-5678', 2000, 15, 'diesel', 1, 'hub-diphu');
db.prepare(`INSERT INTO vehicles VALUES (?,?,?,?,?,?,?,?,?)`).run(uuid(), transporterIds[1], 'community_tractor_trailer', 'TR-02-EF-9012', 3000, 12, 'diesel', 1, 'hub-aizawl');
db.prepare(`INSERT INTO vehicles VALUES (?,?,?,?,?,?,?,?,?)`).run(uuid(), transporterIds[1], 'tempo', 'TR-02-GH-3456', 1500, 14, 'diesel', 1, null);

const schemes = [
  { id: uuid(), name: 'PMKSY - Per Drop More Crop', description: 'Subsidy on micro-irrigation for NE farmers', subsidy_percent: 55, max_subsidy: 50000, states: 'All NE', eligibility: 'Small & marginal farmers with land records' },
  { id: uuid(), name: 'Mission Organic Value Chain Development (MOVCD)', description: 'Transport subsidy for organic produce in NE', subsidy_percent: 40, max_subsidy: 5000, states: 'Sikkim,Meghalaya,Arunachal Pradesh', eligibility: 'Certified organic farmers' },
  { id: uuid(), name: 'Kisan Rail - NE Connectivity', description: 'Reduced freight for agri-produce to mainland markets', subsidy_percent: 30, max_subsidy: 10000, states: 'All NE', eligibility: 'FPO / cooperative registered batches' },
  { id: uuid(), name: 'PMFBY Crop Insurance', description: 'Crop insurance for weather-related losses', subsidy_percent: 90, max_subsidy: 0, states: 'All NE', eligibility: 'All enrolled farmers' },
  { id: uuid(), name: 'AgriRoute NE Transport Subsidy', description: 'Platform subsidy for first-mile transport from remote villages to road head', subsidy_percent: 25, max_subsidy: 750, states: 'Assam,Manipur,Meghalaya,Nagaland', eligibility: 'Farmers >5km from nearest road' },
];
schemes.forEach(s => db.prepare(`INSERT INTO government_schemes VALUES (?,?,?,?,?,?,?,?)`).run(s.id, s.name, s.description, s.subsidy_percent, s.max_subsidy, s.states, s.eligibility, 1));

produceTypes.forEach(p => {
  db.prepare(`INSERT INTO market_prices VALUES (?,?,?,?,?,?)`).run(uuid(), p.id, 'Guwahati Fancy Bazaar', 'Assam', p.avg_price_per_kg * 1.1, '2026-05-17');
  db.prepare(`INSERT INTO market_prices VALUES (?,?,?,?,?,?)`).run(uuid(), p.id, 'Imphal Ima Market', 'Manipur', p.avg_price_per_kg * 1.05, '2026-05-17');
});

const advisories = [
  { state: 'Assam', season: 'Kharif', crop: 'Sticky Rice', advisory: 'Transplant seedlings before monsoon onset. Maintain 5cm water level.', pest_alert: 'Stem borer - use pheromone traps' },
  { state: 'Meghalaya', season: 'Year-round', crop: 'Queen Pineapple', advisory: 'Harvest at 80% eye color change. Transport within 48 hours.', pest_alert: 'Mealybug on leaves - neem spray recommended' },
  { state: 'Manipur', season: 'Rabi', crop: 'Naga Ginger', advisory: 'Cure rhizomes for 7 days before bulk transport to prevent rot.', pest_alert: 'Rhizome rot - ensure drainage' },
  { state: 'Nagaland', season: 'Kharif', crop: 'Large Cardamom', advisory: 'Harvest capsules when 75% turn brown. Dry to 12% moisture.', pest_alert: 'Capsule borer - monitor weekly' },
];
advisories.forEach(a => db.prepare(`INSERT INTO crop_advisories (id,state,season,crop,advisory,pest_alert) VALUES (?,?,?,?,?,?)`).run(uuid(), a.state, a.season, a.crop, a.advisory, a.pest_alert));

const weather = [
  { state: 'Assam', district: 'Karbi Anglong', alert_type: 'Heavy Rain', severity: 'moderate', message: 'Heavy rainfall expected May 19-21. Delay pineapple transport.', valid_until: '2026-05-22' },
  { state: 'Meghalaya', district: 'East Khasi Hills', alert_type: 'Landslide Risk', severity: 'high', message: 'Landslide risk on Shillong-Dawki road. Use alternate hub routing.', valid_until: '2026-05-20' },
  { state: 'Manipur', district: 'Imphal East', alert_type: 'Heat Wave', severity: 'low', message: 'Temperature above 35°C. Transport perishables in early morning slots.', valid_until: '2026-05-19' },
];
weather.forEach(w => db.prepare(`INSERT INTO weather_alerts (id,state,district,alert_type,severity,message,valid_until) VALUES (?,?,?,?,?,?,?)`).run(uuid(), w.state, w.district, w.alert_type, w.severity, w.message, w.valid_until));

db.prepare(`INSERT INTO fpo_organizations VALUES (?,?,?,?,?,?,?)`).run(uuid(), 'Karbi Anglong Organic Farmers FPO', 'Assam', 'Karbi Anglong', 450, 'fpo@demo.com', '9876543230');
db.prepare(`INSERT INTO fpo_organizations VALUES (?,?,?,?,?,?,?)`).run(uuid(), 'Meghalaya Pineapple Growers Cooperative', 'Meghalaya', 'Ri-Bhoi', 320, 'pineapple@fpo.in', '9876543240');

console.log('Seed complete!');
console.log('Demo accounts: farmer1@demo.com / demo123 | transporter1@demo.com / demo123 | admin@agriroute.com / admin123');
