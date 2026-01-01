import { describe, it, expect } from "vitest";
import { queryClient, defaultQueryOptions, createQueryOptions } from "./react-query";

describe("React Query Configuration", () => {
  describe("defaultQueryOptions", () => {
    it("should have retry set to 3", () => {
      expect(defaultQueryOptions.retry).toBe(3);
    });

    it("should have staleTime of 10 minutes", () => {
      expect(defaultQueryOptions.staleTime).toBe(1000 * 60 * 10);
    });

    it("should have gcTime of 30 minutes", () => {
      expect(defaultQueryOptions.gcTime).toBe(1000 * 60 * 30);
    });

    it("should have retryDelay function", () => {
      expect(typeof defaultQueryOptions.retryDelay).toBe("function");
    });

    it("retryDelay should increase exponentially", () => {
      const retryDelay = defaultQueryOptions.retryDelay as (attempt: number) => number;
      const delay0 = retryDelay(0);
      const delay1 = retryDelay(1);
      const delay2 = retryDelay(2);
      expect(delay0).toBeLessThan(delay1);
      expect(delay1).toBeLessThan(delay2);
    });

    it("retryDelay should follow 2^n pattern", () => {
      const retryDelay = defaultQueryOptions.retryDelay as (attempt: number) => number;
      expect(retryDelay(0)).toBe(1000); // 2^0 * 1000
      expect(retryDelay(1)).toBe(2000); // 2^1 * 1000
      expect(retryDelay(2)).toBe(4000); // 2^2 * 1000
    });
  });

  describe("queryClient", () => {
    it("should be defined", () => {
      expect(queryClient).toBeDefined();
    });

    it("should be a QueryClient instance", () => {
      expect(queryClient.getQueryCache).toBeDefined();
      expect(queryClient.getMutationCache).toBeDefined();
    });
  });

  describe("createQueryOptions", () => {
    it("should merge default options with provided options", () => {
      const customOptions = createQueryOptions({
        queryKey: ["test"],
        queryFn: async () => "test",
      });

      expect(customOptions.retry).toBe(defaultQueryOptions.retry);
      expect(customOptions.staleTime).toBe(defaultQueryOptions.staleTime);
      expect(customOptions.gcTime).toBe(defaultQueryOptions.gcTime);
    });

    it("should allow overriding default options", () => {
      const customOptions = createQueryOptions({
        queryKey: ["test"],
        queryFn: async () => "test",
        retry: 1,
        staleTime: 5000,
      });

      expect(customOptions.retry).toBe(1);
      expect(customOptions.staleTime).toBe(5000);
    });

    it("should include query key and function", () => {
      const queryFn = async () => "data";
      const customOptions = createQueryOptions({
        queryKey: ["test"],
        queryFn,
      });

      expect(customOptions.queryKey).toEqual(["test"]);
      expect(customOptions.queryFn).toBe(queryFn);
    });

    it("should handle generic types", () => {
      interface TestData {
        id: number;
        name: string;
      }

      const customOptions = createQueryOptions<TestData>({
        queryKey: ["test"],
        queryFn: async () => ({ id: 1, name: "test" }),
      });

      expect(customOptions.queryKey).toEqual(["test"]);
    });
  });
});
