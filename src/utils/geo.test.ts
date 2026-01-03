import { describe, it, expect } from "vitest";
import {
  toRad,
  toDeg,
  calculateBearing,
  calculateDistance,
  speedToKnots,
  getMapCenterAndZoom,
  calculateRouteStats,
} from "./geo";

describe("Geo Utilities", () => {
  describe("toRad", () => {
    it("should convert 0 degrees to 0 radians", () => {
      expect(toRad(0)).toBe(0);
    });

    it("should convert 180 degrees to π radians", () => {
      expect(toRad(180)).toBeCloseTo(Math.PI, 5);
    });

    it("should convert 360 degrees to 2π radians", () => {
      expect(toRad(360)).toBeCloseTo(2 * Math.PI, 5);
    });
  });

  describe("toDeg", () => {
    it("should convert 0 radians to 0 degrees", () => {
      expect(toDeg(0)).toBe(0);
    });

    it("should convert π radians to 180 degrees", () => {
      expect(toDeg(Math.PI)).toBeCloseTo(180, 5);
    });

    it("should convert 2π radians to 360 degrees", () => {
      expect(toDeg(2 * Math.PI)).toBeCloseTo(360, 5);
    });
  });

  describe("calculateBearing", () => {
    it("should calculate bearing between two points", () => {
      // Barcelona to Madrid (roughly north-west from Barcelona)
      const bearing = calculateBearing(41.3874, 2.169, 40.4168, -3.7038);
      expect(bearing).toBeGreaterThan(0);
      expect(bearing).toBeLessThan(360);
    });

    it("should return bearing of 0 for same point", () => {
      const bearing = calculateBearing(0, 0, 0, 0);
      expect(bearing).toBe(0);
    });

    it("should return valid bearing for north movement", () => {
      const bearing = calculateBearing(0, 0, 1, 0);
      expect(bearing).toBeCloseTo(0, 0);
    });
  });

  describe("calculateDistance", () => {
    it("should calculate distance between two points", () => {
      const distance = calculateDistance(41.3874, 2.169, 40.4168, -3.7038);
      expect(distance).toBeGreaterThan(0);
    });

    it("should return 0 for same point", () => {
      const distance = calculateDistance(0, 0, 0, 0);
      expect(distance).toBe(0);
    });

    it("should return positive distance for different points", () => {
      const distance = calculateDistance(0, 0, 1, 1);
      expect(distance).toBeGreaterThan(0);
    });

    it("should calculate distance in nautical miles", () => {
      // Rough check: 1 degree latitude ≈ 60 nautical miles
      const distance = calculateDistance(0, 0, 1, 0);
      expect(distance).toBeGreaterThan(50);
      expect(distance).toBeLessThan(70);
    });
  });

  describe("speedToKnots", () => {
    it("should return speed unchanged when unit is knots", () => {
      expect(speedToKnots(100, "knots")).toBe(100);
    });

    it("should convert km/h to knots", () => {
      // 1 knot ≈ 1.852 km/h, so 185.2 km/h ≈ 100 knots
      expect(speedToKnots(185.2, "kmh")).toBeCloseTo(100, 0);
    });

    it("should handle zero speed", () => {
      expect(speedToKnots(0, "knots")).toBe(0);
      expect(speedToKnots(0, "kmh")).toBe(0);
    });

    it("should handle negative speed", () => {
      expect(speedToKnots(-100, "knots")).toBe(-100);
    });
  });

  describe("getMapCenterAndZoom", () => {
    it("should return default center for empty waypoints", () => {
      const result = getMapCenterAndZoom([]);
      expect(result.center.lat).toBe(41.5209);
      expect(result.center.lng).toBe(2.105);
      expect(result.zoom).toBe(11);
    });

    it("should return default center for undefined waypoints", () => {
      const result = getMapCenterAndZoom(undefined);
      expect(result.center.lat).toBe(41.5209);
      expect(result.center.lng).toBe(2.105);
      expect(result.zoom).toBe(11);
    });

    it("should return correct center for single waypoint", () => {
      const result = getMapCenterAndZoom([{ lat: 41.3874, lng: 2.169 }]);
      expect(result.center.lat).toBe(41.3874);
      expect(result.center.lng).toBe(2.169);
      expect(result.zoom).toBe(13);
    });

    it("should calculate center for multiple waypoints", () => {
      const result = getMapCenterAndZoom([
        { lat: 0, lng: 0 },
        { lat: 2, lng: 2 },
      ]);
      expect(result.center.lat).toBeCloseTo(1, 5);
      expect(result.center.lng).toBeCloseTo(1, 5);
    });

    it("should adjust zoom based on waypoints spread", () => {
      const result1 = getMapCenterAndZoom([
        { lat: 0, lng: 0 },
        { lat: 0.01, lng: 0.01 },
      ]);
      const result2 = getMapCenterAndZoom([
        { lat: 0, lng: 0 },
        { lat: 10, lng: 10 },
      ]);
      expect(result1.zoom).toBeGreaterThan(result2.zoom);
    });
  });

  describe("calculateRouteStats", () => {
    it("should return zero stats for no waypoints", () => {
      const result = calculateRouteStats(undefined, 100, "knots");
      expect(result.totalDistance).toBe(0);
      expect(result.totalTime).toBe(0);
    });

    it("should return zero stats for single waypoint", () => {
      const result = calculateRouteStats([{ lat: 0, lng: 0 }], 100, "knots");
      expect(result.totalDistance).toBe(0);
      expect(result.totalTime).toBe(0);
    });

    it("should return zero stats for no cruise speed", () => {
      const result = calculateRouteStats(
        [
          { lat: 0, lng: 0 },
          { lat: 1, lng: 1 },
        ],
        undefined,
        "knots"
      );
      expect(result.totalDistance).toBe(0);
      expect(result.totalTime).toBe(0);
    });

    it("should calculate total distance and time", () => {
      const result = calculateRouteStats(
        [
          { lat: 0, lng: 0 },
          { lat: 1, lng: 0 },
          { lat: 1, lng: 1 },
        ],
        100,
        "knots"
      );
      expect(result.totalDistance).toBeGreaterThan(0);
      expect(result.totalTime).toBeGreaterThan(0);
    });

    it("should calculate time correctly based on speed", () => {
      const waypoints = [
        { lat: 0, lng: 0 },
        { lat: 1, lng: 0 },
      ];
      const result100 = calculateRouteStats(waypoints, 100, "knots");
      const result200 = calculateRouteStats(waypoints, 200, "knots");
      expect(result100.totalTime).toBeCloseTo(result200.totalTime * 2, 0);
    });
  });
});
