import { describe, it, expect } from "vitest";

describe("Basic Test Suite", () => {
  it("should run basic tests", () => {
    expect(true).toBe(true);
  });

  it("should add numbers correctly", () => {
    expect(1 + 1).toBe(2);
  });
});
