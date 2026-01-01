import { useQuery } from "@tanstack/react-query";
import { createQueryOptions } from "../lib/react-query";

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5";

export interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: string;
  description: string;
  windSpeed: number;
  windGust: number;
  windDirection: number;
  cloudCover: number;
  visibility: number;
  precipitation: number;
  cloudBase: number | null;
}

export interface ForecastData {
  [date: string]: WeatherData[];
}

interface Location {
  lat: number;
  lng: number;
}

const convertWindSpeed = (mps: number): number => {
  return Math.round(mps * 1.94384); // m/s to knots
};

const processWeatherData = (data: any): WeatherData => {
  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    windSpeed: convertWindSpeed(data.wind.speed),
    windGust: data.wind.gust
      ? convertWindSpeed(data.wind.gust)
      : convertWindSpeed(data.wind.speed),
    windDirection: data.wind.deg,
    cloudCover: data.clouds.all,
    visibility: Math.round(data.visibility / 1000),
    precipitation: data.rain?.["1h"] || 0,
    cloudBase:
      data.clouds.all > 50 ? Math.round(data.clouds.all * 30) : null,
  };
};

const MAX_RETRIES = 3;

/**
 * Fetch current weather for a given location
 */
export const fetchCurrentWeather = async (location: Location): Promise<WeatherData> => {
  const url = `${OPENWEATHER_API_URL}/weather?lat=${location.lat}&lon=${location.lng}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch weather: ${response.statusText}`);
  }

  const data = await response.json();
  return processWeatherData(data);
};

/**
 * Fetch weather forecast for a given location
 */
export const fetchWeatherForecast = async (location: Location): Promise<ForecastData> => {
  const url = `${OPENWEATHER_API_URL}/forecast?lat=${location.lat}&lon=${location.lng}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch forecast: ${response.statusText}`);
  }

  const data = await response.json();

  // Group by day
  const grouped: ForecastData = {};
  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split("T")[0] ?? "";
    if (!dayKey) return;

    if (!grouped[dayKey]) {
      grouped[dayKey] = [];
    }

    grouped[dayKey].push({
      temp: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      condition: item.weather[0].main,
      description: item.weather[0].description,
      windSpeed: convertWindSpeed(item.wind.speed),
      windGust: item.wind.gust
        ? convertWindSpeed(item.wind.gust)
        : convertWindSpeed(item.wind.speed),
      windDirection: item.wind.deg,
      cloudCover: item.clouds.all,
      visibility: Math.round(item.visibility / 1000),
      precipitation: (item.rain?.["3h"] || 0) + (item.snow?.["3h"] || 0),
      cloudBase:
        item.clouds.all > 50 ? Math.round(item.clouds.all * 30) : null,
      hour: date.getHours(),
    });
  });

  return grouped;
};

/**
 * React Query hook for current weather
 */
export const useCurrentWeather = (location: Location, enabled = true) => {
  return useQuery(
    createQueryOptions({
      queryKey: ["weather", "current", location.lat, location.lng],
      queryFn: () => fetchCurrentWeather(location),
      enabled,
    })
  );
};

/**
 * React Query hook for weather forecast
 */
export const useWeatherForecast = (location: Location, enabled = true) => {
  return useQuery(
    createQueryOptions({
      queryKey: ["weather", "forecast", location.lat, location.lng],
      queryFn: () => fetchWeatherForecast(location),
      enabled,
    })
  );
};
