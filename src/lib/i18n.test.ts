import { describe, it, expect } from "vitest";
import { en } from "../locales/en";
import { es } from "../locales/es";
import { ca } from "../locales/ca";

describe("i18n", () => {
  describe("Language resources", () => {
    it("should have English translation", () => {
      expect(en).toBeDefined();
      expect(typeof en).toBe("object");
    });

    it("should have Spanish translation", () => {
      expect(es).toBeDefined();
      expect(typeof es).toBe("object");
    });

    it("should have Catalan translation", () => {
      expect(ca).toBeDefined();
      expect(typeof ca).toBe("object");
    });

    it("should have translation property", () => {
      expect(en).toHaveProperty("translation");
      expect(es).toHaveProperty("translation");
      expect(ca).toHaveProperty("translation");
    });

    it("English translation should be an object", () => {
      expect(typeof en.translation).toBe("object");
      expect(en.translation).not.toBeNull();
    });

    it("Spanish translation should be an object", () => {
      expect(typeof es.translation).toBe("object");
      expect(es.translation).not.toBeNull();
    });

    it("Catalan translation should be an object", () => {
      expect(typeof ca.translation).toBe("object");
      expect(ca.translation).not.toBeNull();
    });
  });
});
