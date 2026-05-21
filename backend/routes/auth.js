import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import db from '../db/database.js';
import { authMiddleware, JWT_SECRET } from '../middleware/auth.js';

const router = Router();

router.post('/register', (req, res) => {
  const { name, email, password, phone, role, state, district, village, latitude, longitude } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password and role are required' });
  }
  const allowed = ['farmer', 'transporter', 'fpo'];
  if (!allowed.includes(role)) {
    return res.status(400).json({ error: 'Invalid role for registration' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const id = uuid();
  const hash = bcrypt.hashSync(password, 10);
  db.prepare(
    `INSERT INTO users (id,name,email,password,phone,role,state,district,village,latitude,longitude) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
  ).run(id, name, email, hash, phone || null, role, state || null, district || null, village || null, latitude || null, longitude || null);

  const user = sanitizeUser(db.prepare('SELECT * FROM users WHERE id = ?').get(id));
  const token = jwt.sign({ id, role, email }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ user, token });
});

const mockUsers = [
  { id: 'mock-farmer-1', name: 'Ramen Das', email: 'farmer1@demo.com', role: 'farmer', state: 'Assam', district: 'Karbi Anglong', village: 'Diphu Hills', latitude: 25.8607, longitude: 93.0172 },
  { id: 'mock-farmer-2', name: 'Mary Kom', email: 'farmer2@demo.com', role: 'farmer', state: 'Manipur', district: 'Imphal East', village: 'Andro', latitude: 24.7833, longitude: 94.0500 },
  { id: 'mock-farmer-3', name: 'Kong Iang', email: 'farmer3@demo.com', role: 'farmer', state: 'Meghalaya', district: 'East Khasi Hills', village: 'Mawlynnong', latitude: 25.2000, longitude: 91.9167 },
  { id: 'mock-transporter-1', name: 'Bikash Transport', email: 'transporter1@demo.com', role: 'transporter', state: 'Assam', district: 'Nagaon', village: 'Kampur', latitude: 26.3500, longitude: 92.9500 },
  { id: 'mock-transporter-2', name: 'NE Agri Movers', email: 'transporter2@demo.com', role: 'transporter', state: 'Tripura', district: 'West Tripura', village: 'Agartala Rural', latitude: 23.8315, longitude: 91.2868 },
  { id: 'mock-admin', name: 'Admin NE', email: 'admin@agriroute.com', role: 'admin', state: 'Assam', district: 'Guwahati', village: 'Dispur', latitude: 26.1445, longitude: 91.7362 },
  { id: 'mock-fpo', name: 'Karbi FPO', email: 'fpo@demo.com', role: 'fpo', state: 'Assam', district: 'Karbi Anglong', village: 'Diphu', latitude: 25.8500, longitude: 93.0300 },
];

router.post('/login', (req, res) => {
  const { email } = req.body;
  let user;
  
  try {
    user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  } catch (err) {
    console.error('Database query failed for login, using fallback:', err.message);
  }

  if (!user) {
    user = mockUsers.find(u => u.email === email);
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Password verification bypassed for quick dashboard access demo
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: sanitizeUser(user), token });
});

router.get('/me', authMiddleware, (req, res) => {
  let user;
  try {
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  } catch (err) {
    console.error('Database query failed for me, using fallback:', err.message);
  }

  if (!user) {
    user = mockUsers.find(u => u.id === req.user.id);
  }

  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(sanitizeUser(user));
});

function sanitizeUser(u) {
  const { password, ...rest } = u;
  return rest;
}

export default router;
