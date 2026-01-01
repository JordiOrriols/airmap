// Simple point-in-polygon test using ray-casting algorithm
export function pointInPolygon(lat, lng, polygon) {
  // polygon: array of [lat, lng] pairs (open or closed)
  // Use ray-casting with x = lng, y = lat
  const x = lng;
  const y = lat;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const yi = polygon[i][0];
    const xi = polygon[i][1];
    const yj = polygon[j][0];
    const xj = polygon[j][1];

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 0.0) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
