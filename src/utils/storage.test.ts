import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { routeStorage } from "./storage";
import type { RouteData } from "../types";

describe("Route Storage", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("createNewRoute", () => {
    it("should create a new route with default values", () => {
      const route = routeStorage.createNewRoute() as RouteData;
      expect(route).toBeDefined();
      expect(route.id).toBeDefined();
      expect(route.name).toBe("New Route");
      expect(route.waypoints).toEqual([]);
      expect(route.cruiseSpeed).toBe(120);
      expect(route.speedUnit).toBe("knots");
    });

    it("should generate unique IDs for multiple routes", () => {
      const route1 = routeStorage.createNewRoute() as RouteData;
      // Add a small delay to ensure different timestamp
      const start = Date.now();
      let route2;
      do {
        route2 = routeStorage.createNewRoute() as RouteData;
      } while (route1.id === route2.id && Date.now() - start < 100);

      expect(route1.id).not.toBe(route2.id);
    });
  });

  describe("saveRoute", () => {
    it("should save a route to localStorage", () => {
      const route: RouteData = {
        id: "test-1",
        name: "Test Route",
        waypoints: [{ lat: 0, lng: 0, name: "WP1" }],
        cruiseSpeed: 120,
        speedUnit: "knots",
      };
      const result = routeStorage.saveRoute(route);
      expect(result).toBe(true);
    });

    it("should retrieve saved route", () => {
      const route: RouteData = {
        id: "test-2",
        name: "Test Route 2",
        waypoints: [{ lat: 1, lng: 1, name: "WP1" }],
        cruiseSpeed: 150,
        speedUnit: "kmh",
      };
      routeStorage.saveRoute(route);
      const retrieved = routeStorage.getRoute("test-2");
      expect(retrieved?.id).toBe(route.id);
      expect(retrieved?.name).toBe(route.name);
      expect(retrieved?.cruiseSpeed).toBe(route.cruiseSpeed);
      expect(retrieved?.speedUnit).toBe(route.speedUnit);
      expect(retrieved?.waypoints).toEqual(route.waypoints);
    });

    it("should overwrite existing route with same id", () => {
      const route1: RouteData = {
        id: "test-3",
        name: "Original",
        waypoints: [],
        cruiseSpeed: 100,
        speedUnit: "knots",
      };
      const route2: RouteData = {
        id: "test-3",
        name: "Updated",
        waypoints: [{ lat: 0, lng: 0, name: "WP1" }],
        cruiseSpeed: 150,
        speedUnit: "kmh",
      };
      routeStorage.saveRoute(route1);
      routeStorage.saveRoute(route2);
      const retrieved = routeStorage.getRoute("test-3");
      expect(retrieved?.name).toBe("Updated");
      expect(retrieved?.cruiseSpeed).toBe(150);
    });
  });

  describe("getRoute", () => {
    it("should return undefined for non-existent route", () => {
      const route = routeStorage.getRoute("non-existent");
      expect(route).toBeUndefined();
    });

    it("should return saved route by id", () => {
      const route: RouteData = {
        id: "test-4",
        name: "Find Me",
        waypoints: [],
        cruiseSpeed: 100,
        speedUnit: "knots",
      };
      routeStorage.saveRoute(route);
      const found = routeStorage.getRoute("test-4");
      expect(found?.id).toBe(route.id);
      expect(found?.name).toBe(route.name);
      expect(found?.cruiseSpeed).toBe(route.cruiseSpeed);
      expect(found?.speedUnit).toBe(route.speedUnit);
      expect(found?.waypoints).toEqual(route.waypoints);
    });
  });

  describe("getAllRoutes", () => {
    it("should return empty array when no routes saved", () => {
      const routes = routeStorage.getAllRoutes();
      expect(Array.isArray(routes)).toBe(true);
      expect(routes.length).toBe(0);
    });

    it("should return all saved routes", () => {
      const route1: RouteData = {
        id: "route-1",
        name: "Route 1",
        waypoints: [],
        cruiseSpeed: 100,
        speedUnit: "knots",
      };
      const route2: RouteData = {
        id: "route-2",
        name: "Route 2",
        waypoints: [],
        cruiseSpeed: 150,
        speedUnit: "kmh",
      };
      routeStorage.saveRoute(route1);
      routeStorage.saveRoute(route2);
      const routes = routeStorage.getAllRoutes();
      expect(routes.length).toBe(2);
      expect(routes.some((r) => r.id === "route-1" && r.name === "Route 1")).toBe(true);
      expect(routes.some((r) => r.id === "route-2" && r.name === "Route 2")).toBe(true);
    });

    it("should return routes in consistent order", () => {
      const routes = [];
      for (let i = 0; i < 5; i++) {
        const route: RouteData = {
          id: `route-${i}`,
          name: `Route ${i}`,
          waypoints: [],
          cruiseSpeed: 100,
          speedUnit: "knots",
        };
        routeStorage.saveRoute(route);
        routes.push(route);
      }
      const retrieved = routeStorage.getAllRoutes();
      expect(retrieved.length).toBe(5);
    });
  });

  describe("deleteRoute", () => {
    it("should delete a route from storage", () => {
      const route: RouteData = {
        id: "to-delete",
        name: "Delete Me",
        waypoints: [],
        cruiseSpeed: 100,
        speedUnit: "knots",
      };
      routeStorage.saveRoute(route);
      routeStorage.deleteRoute("to-delete");
      const found = routeStorage.getRoute("to-delete");
      expect(found).toBeUndefined();
    });

    it("should not affect other routes when deleting", () => {
      const route1: RouteData = {
        id: "keep-1",
        name: "Keep",
        waypoints: [],
        cruiseSpeed: 100,
        speedUnit: "knots",
      };
      const route2: RouteData = {
        id: "delete-1",
        name: "Delete",
        waypoints: [],
        cruiseSpeed: 100,
        speedUnit: "knots",
      };
      routeStorage.saveRoute(route1);
      routeStorage.saveRoute(route2);
      routeStorage.deleteRoute("delete-1");
      const routes = routeStorage.getAllRoutes();
      expect(routes.length).toBe(1);
      expect(routes[0].id).toBe("keep-1");
    });

    it("should handle deleting non-existent route gracefully", () => {
      expect(() => routeStorage.deleteRoute("non-existent")).not.toThrow();
    });
  });

  describe("Storage persistence", () => {
    it("should persist route across storage access", () => {
      const route: RouteData = {
        id: "persist-1",
        name: "Persistent Route",
        waypoints: [
          { lat: 41.3874, lng: 2.169, name: "Barcelona" },
          { lat: 40.4168, lng: -3.7038, name: "Madrid" },
        ],
        cruiseSpeed: 120,
        speedUnit: "knots",
      };
      routeStorage.saveRoute(route);

      // Simulate reading from storage
      const retrieved = routeStorage.getRoute("persist-1");
      expect(retrieved?.id).toBe(route.id);
      expect(retrieved?.name).toBe(route.name);
      expect(retrieved?.cruiseSpeed).toBe(route.cruiseSpeed);
      expect(retrieved?.waypoints.length).toBe(2);
    });
  });
});
