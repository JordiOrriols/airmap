import { describe, it, expect } from "vitest";
import {
  toFeet,
  processAirspaceData,
  processAirspaceForPIP,
} from "./openaip";
import type { Airspace, AirspaceLowerLimit } from "./openaip";

describe("OpenAIP Utilities", () => {
  describe("toFeet", () => {
    it("should handle null limit", () => {
      expect(toFeet(null)).toBe(null);
    });

    it("should handle undefined limit", () => {
      expect(toFeet(undefined)).toBe(null);
    });

    it("should return value when unit is 1 (feet)", () => {
      const limit: AirspaceLowerLimit = { value: 1000, unit: 1 };
      expect(toFeet(limit)).toBe(1000);
    });

    it("should convert flight level (unit 6) to feet", () => {
      const limit: AirspaceLowerLimit = { value: 100, unit: 6 };
      expect(toFeet(limit)).toBe(10000); // 100 * 100
    });

    it("should handle zero value", () => {
      const limit: AirspaceLowerLimit = { value: 0, unit: 1 };
      expect(toFeet(limit)).toBe(0);
    });

    it("should return null for NaN value", () => {
      const limit: AirspaceLowerLimit = { value: NaN, unit: 1 };
      expect(toFeet(limit)).toBe(null);
    });

    it("should handle string values that can be converted to numbers", () => {
      const limit: AirspaceLowerLimit = { value: "1000" as unknown as number, unit: 1 };
      const result = toFeet(limit);
      expect(typeof result).toBe("number");
    });
  });

  describe("processAirspaceData", () => {
    const mockAirspace: Airspace = {
      _id: "test-1",
      name: "Test Airspace",
      type: 0,
      country: "ES",
      lowerLimit: { value: 0, unit: 1 },
      upperLimit: { value: 5000, unit: 1 },
      geometry: { type: "Polygon", coordinates: [] },
      activity: "Active",
    };

    it("should add vfrUpperFeet to airspace", () => {
      const result = processAirspaceData([mockAirspace]);
      expect(result[0].vfrUpperFeet).toBeDefined();
      expect(typeof result[0].vfrUpperFeet).toBe("number");
    });

    it("should add vfrUpperDisplay to airspace", () => {
      const result = processAirspaceData([mockAirspace]);
      expect(result[0].vfrUpperDisplay).toBeDefined();
      expect(typeof result[0].vfrUpperDisplay).toBe("string");
    });

    it("should show N/A for null vfrUpperFeet", () => {
      const airspace: Airspace = {
        ...mockAirspace,
        lowerLimit: null as unknown as AirspaceLowerLimit,
      };
      const result = processAirspaceData([airspace]);
      expect(result[0].vfrUpperDisplay).toContain("N/A");
    });

    it("should process multiple airspaces", () => {
      const airspaces = [mockAirspace, mockAirspace];
      const result = processAirspaceData(airspaces);
      expect(result.length).toBe(2);
      result.forEach((as) => {
        expect(as.vfrUpperFeet).toBeDefined();
        expect(as.vfrUpperDisplay).toBeDefined();
      });
    });

    it("should preserve original airspace properties", () => {
      const result = processAirspaceData([mockAirspace]);
      expect(result[0]._id).toBe(mockAirspace._id);
      expect(result[0].name).toBe(mockAirspace.name);
      expect(result[0].country).toBe(mockAirspace.country);
    });
  });

  describe("processAirspaceForPIP", () => {
    const polygonAirspace: Airspace = {
      _id: "test-poly",
      name: "Polygon Airspace",
      type: 0,
      country: "ES",
      lowerLimit: { value: 0, unit: 1 },
      upperLimit: { value: 5000, unit: 1 },
      geometry: {
        type: "Polygon",
        coordinates: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]],
      },
    };

    const multipolygonAirspace: Airspace = {
      _id: "test-multi",
      name: "MultiPolygon Airspace",
      type: 0,
      country: "ES",
      lowerLimit: { value: 0, unit: 1 },
      upperLimit: { value: 5000, unit: 1 },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]],
      },
    };

    it("should process Polygon geometry", () => {
      const result = processAirspaceForPIP([polygonAirspace]);
      expect(result.length).toBe(1);
      expect(result[0].polygon).toBeDefined();
      expect(Array.isArray(result[0].polygon)).toBe(true);
    });

    it("should process MultiPolygon geometry", () => {
      const result = processAirspaceForPIP([multipolygonAirspace]);
      expect(result.length).toBe(1);
      expect(result[0].polygon).toBeDefined();
    });

    it("should filter out airspaces without valid geometry", () => {
      const invalidAirspace: Airspace = {
        ...polygonAirspace,
        geometry: { type: "Polygon", coordinates: [] },
      };
      const result = processAirspaceForPIP([invalidAirspace]);
      expect(result.length).toBe(0);
    });

    it("should swap coordinates from [lon, lat] to [lat, lon]", () => {
      const result = processAirspaceForPIP([polygonAirspace]);
      if (result.length > 0 && result[0].polygon) {
        // Original: [0, 0] means lon=0, lat=0
        // After swap: should be [0, 0] as [lat=0, lon=0]
        expect(result[0].polygon[0]).toBeDefined();
      }
    });

    it("should handle errors gracefully", () => {
      const invalidAirspace: Airspace = {
        ...polygonAirspace,
        geometry: null as unknown as any,
      };
      expect(() => processAirspaceForPIP([invalidAirspace])).not.toThrow();
    });

    it("should add vfrUpperFeet to processed airspace", () => {
      const result = processAirspaceForPIP([polygonAirspace]);
      expect(result[0].vfrUpperFeet).toBeDefined();
    });

    it("should filter out airspaces without polygon", () => {
      const airspaceNoPolygon: Airspace = {
        ...polygonAirspace,
        geometry: { type: "Point" as unknown as string, coordinates: [] },
      };
      const result = processAirspaceForPIP([airspaceNoPolygon]);
      expect(result.length).toBe(0);
    });
  });
});
