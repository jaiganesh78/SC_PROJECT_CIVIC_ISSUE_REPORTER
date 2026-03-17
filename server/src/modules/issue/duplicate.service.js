const Issue = require("../../models/Issue.model");

/**
 * Calculate distance between two geo points using Haversine formula
 * Returns distance in meters
 */
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Find possible duplicate issues based on:
 * - Same AI-decided category
 * - Within radius (meters)
 * - Not closed
 * - Created within lookback window
 */
async function findDuplicateIssues({
  category,
  latitude,
  longitude,
  radiusMeters = 100,
  lookbackDays = 14,
}) {
  const since = new Date();
  since.setDate(since.getDate() - lookbackDays);

  // 1️⃣ Fetch candidate issues (coarse DB filter)
  const candidates = await Issue.find({
    category,
    status: { $nin: ["closed","fake"] },
    createdAt: { $gte: since },
  }).select("_id latitude longitude status createdAt");

  // 2️⃣ Precise geo-distance check
  const duplicates = [];

  for (const issue of candidates) {
    const distance = calculateDistanceMeters(
      latitude,
      longitude,
      issue.latitude,
      issue.longitude
    );

    if (distance <= radiusMeters) {
      duplicates.push({
        issue_id: issue._id,
        distance_meters: Math.round(distance),
        status: issue.status,
        created_at: issue.createdAt,
      });
    }
  }

  return duplicates;
}

module.exports = {
  findDuplicateIssues,
};
