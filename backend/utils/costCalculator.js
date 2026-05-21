const VEHICLE_RATES = {
  headload: { base: 50, per_km: 2, per_kg: 0.5, max_kg: 50 },
  e_rickshaw_cargo: { base: 100, per_km: 8, per_kg: 0.3, max_kg: 500 },
  community_tractor_trailer: { base: 200, per_km: 12, per_kg: 0.15, max_kg: 3000 },
  pickup_truck: { base: 300, per_km: 15, per_kg: 0.2, max_kg: 2000 },
  tempo: { base: 250, per_km: 14, per_kg: 0.25, max_kg: 1500 },
};

const PERISHABILITY_MULTIPLIER = { low: 1, medium: 1.15, high: 1.35 };

export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateTransportCost({ vehicleType, distanceKm, quantityKg, perishability = 'medium', roadTerrainFactor = 1.2 }) {
  const rates = VEHICLE_RATES[vehicleType] || VEHICLE_RATES.e_rickshaw_cargo;
  const terrain = distanceKm * roadTerrainFactor;
  const perishMult = PERISHABILITY_MULTIPLIER[perishability] || 1.15;

  let cost = rates.base + terrain * rates.per_km + quantityKg * rates.per_kg;
  cost *= perishMult;

  if (quantityKg > rates.max_kg) {
    const trips = Math.ceil(quantityKg / rates.max_kg);
    cost *= trips * 0.85;
  }

  return {
    estimatedCost: Math.round(cost * 100) / 100,
    distanceKm: Math.round(terrain * 100) / 100,
    vehicleType,
    breakdown: { base: rates.base, distanceCharge: terrain * rates.per_km, weightCharge: quantityKg * rates.per_kg, perishabilityFactor: perishMult },
  };
}

export function applySubsidy(estimatedCost, subsidyPercent, maxSubsidy) {
  const subsidy = Math.min(estimatedCost * (subsidyPercent / 100), maxSubsidy);
  return {
    subsidyAmount: Math.round(subsidy * 100) / 100,
    finalCost: Math.round((estimatedCost - subsidy) * 100) / 100,
  };
}

export function recommendVehicle(quantityKg, distanceKm) {
  if (quantityKg <= 50 && distanceKm <= 5) return 'headload';
  if (quantityKg <= 500) return 'e_rickshaw_cargo';
  if (quantityKg <= 1500) return 'tempo';
  if (quantityKg <= 2000) return 'pickup_truck';
  return 'community_tractor_trailer';
}
