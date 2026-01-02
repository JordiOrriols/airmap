import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  fetchCurrentWeather,
  fetchWeatherForecast,
} from "./weather";

describe("Weather API", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe("fetchCurrentWeather", () => {
    it("should fetch current weather for valid coordinates", async () => {
      const mockResponse = {
        main: {
          temp: 20,
          feels_like: 18,
          humidity: 65,
          pressure: 1013,
        },
        weather: [
          {
            main: "Clouds",
            description: "partly cloudy",
            icon: "02d",
          },
        ],
        wind: {
          speed: 5,
          deg: 180,
        },
        clouds: {
          all: 30,
        },
        visibility: 10000,
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const data = await fetchCurrentWeather({ lat: 40.4168, lng: -3.7038 });
      
      expect(data).toBeDefined();
      expect(data.temp).toBe(20);
      expect(data.condition).toBe("Clouds");
      expect(global.fetch).toHaveBeenCalled();
    });

    it("should throw on fetch errors", async () => {
      global.fetch = vi.fn(() =>
        Promise.reject(new Error("Network error"))
      );

      await expect(
        fetchCurrentWeather({ lat: 40.4168, lng: -3.7038 })
      ).rejects.toThrow("Network error");
    });

    it("should throw on non-ok response", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: "Not Found",
        } as Response)
      );

      await expect(
        fetchCurrentWeather({ lat: 40.4168, lng: -3.7038 })
      ).rejects.toThrow("Failed to fetch weather");
    });

    it("should include required latitude and longitude parameters", async () => {
      const mockResponse = {
        main: { temp: 20, feels_like: 18 },
        weather: [{ main: "Clear", description: "clear sky" }],
        wind: { speed: 2, deg: 90 },
        clouds: { all: 0 },
        visibility: 10000,
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      await fetchCurrentWeather({ lat: 41.3874, lng: 2.169 });
      
      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain("41.3874");
      expect(callUrl).toContain("2.169");
    });

    it("should process weather data correctly", async () => {
      const mockResponse = {
        main: { temp: 25, feels_like: 23 },
        weather: [{ main: "Sunny", description: "clear sky" }],
        wind: { speed: 5, deg: 180, gust: 7 },
        clouds: { all: 10 },
        visibility: 10000,
        rain: { "1h": 0.5 },
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const data = await fetchCurrentWeather({ lat: 40.4168, lng: -3.7038 });
      
      expect(data.temp).toBe(25);
      expect(data.feelsLike).toBe(23);
      expect(data.condition).toBe("Sunny");
      expect(data.windSpeed).toBeGreaterThan(0);
      expect(data.precipitation).toBe(0.5);
    });
  });

  describe("fetchWeatherForecast", () => {
    it("should fetch weather forecast for valid coordinates", async () => {
      const mockResponse = {
        list: [
          {
            dt: 1609459200,
            main: {
              temp: 15,
              feels_like: 13,
            },
            weather: [
              {
                main: "Rain",
                description: "light rain",
              },
            ],
            wind: {
              speed: 8,
              deg: 270,
            },
            clouds: {
              all: 80,
            },
            visibility: 5000,
          },
          {
            dt: 1609545600,
            main: {
              temp: 18,
              feels_like: 16,
            },
            weather: [
              {
                main: "Clouds",
                description: "overcast clouds",
              },
            ],
            wind: {
              speed: 4,
              deg: 180,
            },
            clouds: {
              all: 90,
            },
            visibility: 8000,
          },
        ],
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const data = await fetchWeatherForecast({ lat: 40.4168, lng: -3.7038 });
      
      expect(data).toBeDefined();
      expect(typeof data).toBe("object");
      const keys = Object.keys(data);
      expect(keys.length).toBeGreaterThan(0);
    });

    it("should handle forecast response with empty list", async () => {
      const mockResponse = {
        list: [],
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const data = await fetchWeatherForecast({ lat: 40.4168, lng: -3.7038 });
      expect(typeof data).toBe("object");
      expect(Object.keys(data).length).toBe(0);
    });

    it("should throw on fetch errors in forecast", async () => {
      global.fetch = vi.fn(() =>
        Promise.reject(new Error("Network error"))
      );

      await expect(
        fetchWeatherForecast({ lat: 40.4168, lng: -3.7038 })
      ).rejects.toThrow("Network error");
    });

    it("should throw on malformed forecast response missing list", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ invalid: "data" }),
        } as Response)
      );

      await expect(
        fetchWeatherForecast({ lat: 40.4168, lng: -3.7038 })
      ).rejects.toThrow();
    });

    it("should include latitude and longitude parameters", async () => {
      const mockResponse = { list: [] };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      await fetchWeatherForecast({ lat: 41.3874, lng: 2.169 });
      
      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain("41.3874");
      expect(callUrl).toContain("2.169");
    });
  });
});
