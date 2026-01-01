export const toRad = (deg: number) => (deg * Math.PI) / 180;
export const toDeg = (rad: number) => (rad * 180) / Math.PI;

export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 3440.065; // nautical miles
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // nautical miles
}

export function speedToKnots(speed: number, unit: "knots" | "kmh") {
  if (unit === "kmh") return speed / 1.852;
  return speed;
}

type LatLng = { lat: number; lng: number };

export function getMapCenterAndZoom(waypoints?: LatLng[]) {
  if (!waypoints || waypoints.length === 0) {
    return { center: { lat: 41.5209, lng: 2.105 }, zoom: 8 };
  }
  
  if (waypoints.length === 1) {
    return { center: waypoints[0], zoom: 11 };
  }

  // Calculate bounds to fit all waypoints
  const lats = waypoints.map(wp => wp.lat);
  const lngs = waypoints.map(wp => wp.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;
  
  // Calculate zoom with padding for better visibility
  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;
  // Add 40% padding to bounds
  const maxDiff = Math.max(latDiff, lngDiff) * 1.4;
  
  let zoom = 7;
  if (maxDiff < 0.01) zoom = 12;
  else if (maxDiff < 0.05) zoom = 10;
  else if (maxDiff < 0.1) zoom = 9;
  else if (maxDiff < 0.5) zoom = 8;
  else if (maxDiff < 1) zoom = 7;
  else if (maxDiff < 2) zoom = 6;
  
  return { center: { lat: centerLat, lng: centerLng }, zoom };
}

export function calculateRouteStats(
  waypoints?: LatLng[],
  cruiseSpeed?: number,
  speedUnit?: "knots" | "kmh"
) {
  if (!waypoints || waypoints.length < 2 || !cruiseSpeed) {
    return { totalDistance: 0, totalTime: 0 };
  }

  let totalDistance = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const wp = waypoints[i];
    const nextWp = waypoints[i + 1];
    totalDistance += calculateDistance(wp.lat, wp.lng, nextWp.lat, nextWp.lng);
  }

  const speedInKnots = speedToKnots(cruiseSpeed, speedUnit || "knots");
  const totalTime = (totalDistance / speedInKnots) * 60; // Time in minutes

  return { totalDistance, totalTime };
}
