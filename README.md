# AgriRoute NE 🌾

## Low-cost Transportation Solution for Agricultural Produce from Remote Farmers to Nearest Road in North Eastern Region

**End Semester Full Stack Project** — React + Node.js + SQLite

---

## Project Overview

AgriRoute NE is a comprehensive agricultural logistics platform designed for India's **North Eastern Region** (Assam, Manipur, Meghalaya, Nagaland, Mizoram, Tripura, Arunachal Pradesh, Sikkim).

Remote hill and tribal farmers often live **5–15 km away from the nearest motorable road**. This causes high post-harvest losses and low income. This platform provides:

- **Farmer produce registration** (ginger, pineapple, rice, cardamom, etc.)
- **Village collection hubs** → **road head / mandi** transport booking
- **Low-cost vehicle options** (headload, e-rickshaw, tempo, tractor-trailer)
- **Terrain-adjusted cost calculator** with perishability factor
- **Government subsidy** integration (PMKSY, MOVCD, Kisan Rail, AgriRoute NE subsidy)
- **Real-time shipment tracking**
- **Market prices**, **crop advisories**, **weather alerts**
- **Transporter** job management
- **Admin** analytics dashboard
- **Interactive map** of hubs and road heads

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Leaflet, Recharts |
| Backend | Node.js, Express, SQLite (built-in `node:sqlite`), JWT, bcrypt |
| API | RESTful JSON API |

---

## Quick Start

### Prerequisites
- Node.js 18+ installed

### 1. Backend Setup

```bash
cd backend
npm install
npm run seed
npm run dev
```

Backend runs at: **http://localhost:5000**

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## Demo Login Accounts

| Role | Email | Password |
|------|-------|----------|
| Farmer | farmer1@demo.com | demo123 |
| Farmer 2 | farmer2@demo.com | demo123 |
| Transporter | transporter1@demo.com | demo123 |
| Admin | admin@agriroute.com | admin123 |
| FPO | fpo@demo.com | demo123 |

---

## Modules (Agricultural Workflow — Start to End)

1. **Registration** — Farmer / Transporter / FPO signup with NE state & village
2. **Produce Listing** — Crop type, quantity, quality grade, harvest date, collection hub
3. **Hub Selection** — Nearest village aggregation center on map
4. **Cost Estimation** — Vehicle recommendation + terrain + subsidy calculation
5. **Transport Booking** — Pickup date/slot, tracking code generation
6. **Transporter Assignment** — Accept job, pickup, in-transit, delivered
7. **Tracking** — Public tracking page with status timeline
8. **Market Linkage** — Mandi prices for selling decision
9. **Advisory** — Crop tips, pest alerts, weather warnings
10. **Government Schemes** — Subsidy eligibility display
11. **Admin Analytics** — State-wise bookings, produce categories, subsidies

---

## API Endpoints (Sample)

- `GET /api/health` — Health check
- `POST /api/auth/login` — Login
- `POST /api/auth/register` — Register
- `GET /api/hubs/collection-hubs` — List hubs
- `GET /api/hubs/road-heads` — List road heads
- `POST /api/transport/estimate` — Cost estimate
- `POST /api/transport/bookings` — Create booking
- `GET /api/transport/track/:code` — Track shipment
- `GET /api/market/prices` — Market prices
- `GET /api/analytics/dashboard` — Admin stats

---

## Folder Structure

```
agriroute-ne/
├── backend/
│   ├── server.js
│   ├── db/          (SQLite + seed)
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── api/
│       └── context/
└── README.md
```

---

## For Viva / Presentation

**Problem:** First-mile transport gap in NE India remote agriculture  
**Solution:** Digital coordination of hubs, transporters, subsidies  
**Innovation:** Low-cost multi-vehicle model + terrain/perishability pricing  
**Impact:** Reduced transport cost, less spoilage, better mandi access  

---

## Author

End Semester Project — Agricultural Transportation, North Eastern Region
