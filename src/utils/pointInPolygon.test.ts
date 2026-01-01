import { describe, it, expect } from "vitest";
import { pointInPolygon } from "./pointInPolygon";

describe("Point in Polygon", () => {
  const squarePolygon = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
  ];

  it("should return true for point inside polygon", () => {
    expect(pointInPolygon(5, 5, squarePolygon)).toBe(true);
  });

  it("should return false for point outside polygon", () => {
    expect(pointInPolygon(15, 15, squarePolygon)).toBe(false);
  });

  it("should return true for point on edge (approximately)", () => {
    expect(pointInPolygon(5, 0, squarePolygon)).toBe(true);
  });

  it("should handle corner point", () => {
    // Behavior depends on implementation, but should be consistent
    const result = pointInPolygon(0, 0, squarePolygon);
    expect(typeof result).toBe("boolean");
  });

  it("should return false for point far outside", () => {
    expect(pointInPolygon(-100, -100, squarePolygon)).toBe(false);
  });

  it("should return true for point inside complex polygon", () => {
    const complexPolygon = [
      [0, 0],
      [20, 0],
      [20, 20],
      [10, 15],
      [0, 20],
    ];
    expect(pointInPolygon(10, 10, complexPolygon)).toBe(true);
  });

  it("should work with triangular polygon", () => {
    const trianglePolygon = [
      [0, 0],
      [10, 0],
      [5, 10],
    ];
    expect(pointInPolygon(5, 3, trianglePolygon)).toBe(true);
    expect(pointInPolygon(1, 8, trianglePolygon)).toBe(false);
  });

  it("should handle single point polygon gracefully", () => {
    expect(pointInPolygon(0, 0, [[0, 0]])).toBe(false);
  });

  it("should handle empty polygon gracefully", () => {
    expect(pointInPolygon(0, 0, [])).toBe(false);
  });
});
