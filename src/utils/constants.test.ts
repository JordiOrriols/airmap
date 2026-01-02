import { describe, it, expect } from "vitest";
import { MAP_CENTER } from "./constants";

describe("Constants", () => {
  describe("MAP_CENTER", () => {
    it("should have correct latitude", () => {
      expect(MAP_CENTER.lat).toBe(41.5209);
    });

    it("should have correct longitude", () => {
      expect(MAP_CENTER.lng).toBe(2.105);
    });

    it("should have correct zoom level", () => {
      expect(MAP_CENTER.zoom).toBe(10);
    });

    it("should have all required properties", () => {
      expect(MAP_CENTER).toHaveProperty("lat");
      expect(MAP_CENTER).toHaveProperty("lng");
      expect(MAP_CENTER).toHaveProperty("zoom");
    });

    it("should have valid coordinates", () => {
      expect(MAP_CENTER.lat).toBeGreaterThanOrEqual(-90);
      expect(MAP_CENTER.lat).toBeLessThanOrEqual(90);
      expect(MAP_CENTER.lng).toBeGreaterThanOrEqual(-180);
      expect(MAP_CENTER.lng).toBeLessThanOrEqual(180);
    });

    it("should have valid zoom level", () => {
      expect(MAP_CENTER.zoom).toBeGreaterThanOrEqual(0);
      expect(MAP_CENTER.zoom).toBeLessThanOrEqual(20);
    });
  });
});
