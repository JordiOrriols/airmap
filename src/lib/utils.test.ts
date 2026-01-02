import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("Utility Functions", () => {
  describe("cn", () => {
    it("should merge classNames correctly", () => {
      const result = cn("px-2", "py-1");
      expect(result).toContain("px-2");
      expect(result).toContain("py-1");
    });

    it("should handle conditional classes", () => {
      const isActive = true;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toContain("base-class");
      expect(result).toContain("active-class");
    });

    it("should handle false conditions", () => {
      const isActive = false;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toContain("base-class");
      expect(result).not.toContain("active-class");
    });

    it("should merge conflicting tailwind classes", () => {
      const result = cn("px-2", "px-4");
      expect(result).toContain("px-4");
    });

    it("should handle empty inputs", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("should handle array of classes", () => {
      const result = cn(["px-2", "py-1"], "rounded");
      expect(result).toContain("px-2");
      expect(result).toContain("py-1");
      expect(result).toContain("rounded");
    });

    it("should handle undefined values", () => {
      const result = cn("px-2", undefined, "py-1");
      expect(result).toContain("px-2");
      expect(result).toContain("py-1");
    });

    it("should handle null values", () => {
      const result = cn("px-2", null, "py-1");
      expect(result).toContain("px-2");
      expect(result).toContain("py-1");
    });

    it("should resolve tailwind overrides", () => {
      const result = cn("bg-blue-500 text-white", "bg-red-500");
      expect(result).toContain("bg-red-500");
      expect(result).toContain("text-white");
    });
  });
});
