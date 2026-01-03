import { render, screen } from "@testing-library/react";
import WeatherCard from "./weather-card";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

vi.mock("../atoms/weather-icon", () => ({
  default: () => <div>WeatherIcon</div>,
}));

vi.mock("../atoms/stat-display", () => ({
  default: ({
    label,
    value,
    unitSymbol,
    additionalInfo,
  }: {
    label: string;
    value: string;
    unitSymbol?: string;
    additionalInfo?: string;
  }) => (
    <div>
      {label}: {value}
      {unitSymbol && <span>{unitSymbol}</span>}
      {additionalInfo && <span>{additionalInfo}</span>}
    </div>
  ),
}));

describe("WeatherCard", () => {
  it.each([
    {
      temp: 25,
      windSpeed: 10,
      condition: "Sunny",
      description: "warm sunny day",
    },
    {
      temp: 5,
      windSpeed: 25,
      condition: "Rainy",
      description: "cold rainy day",
    },
    {
      temp: 0,
      windSpeed: 40,
      condition: "Stormy",
      description: "freezing stormy conditions",
    },
  ])("displays weather information for $description", ({ temp, condition }) => {
    const mockWeather = {
      condition,
      temp,
      windSpeed: 10,
      windGust: 15,
      cloudCover: 50,
      cloudBase: 3000,
      visibility: 10,
      precipitation: 0,
      feelsLike: temp - 1,
    };
    render(<WeatherCard weather={mockWeather} />);
    expect(screen.getByText(new RegExp(`${temp}°C`))).toBeInTheDocument();
    expect(screen.getAllByText("kt").length).toBeGreaterThan(0);
  });

  it("displays no data message when weather is null", () => {
    render(<WeatherCard weather={null} />);
    expect(screen.getByText("No weather data available")).toBeInTheDocument();
  });

  it("renders compact mode with fewer details", () => {
    const mockWeather = {
      condition: "Sunny",
      temp: 22,
      windSpeed: 8,
      windGust: 12,
      cloudCover: 10,
      cloudBase: 5000,
      visibility: 15,
      precipitation: 0,
      feelsLike: 21,
    };
    render(<WeatherCard weather={mockWeather} compact={true} />);
    expect(screen.getByText("22°C")).toBeInTheDocument();
  });

  it("displays wind gust when greater than wind speed", () => {
    const mockWeather = {
      condition: "Windy",
      temp: 15,
      windSpeed: 20,
      windGust: 35,
      cloudCover: 40,
      cloudBase: 2000,
      visibility: 8,
      precipitation: 0,
      feelsLike: 12,
    };
    render(<WeatherCard weather={mockWeather} />);
    expect(screen.getAllByText("kt").length).toBeGreaterThan(1);
  });

  it("omits wind gust when not greater than wind speed", () => {
    const mockWeather = {
      condition: "Calm",
      temp: 20,
      windSpeed: 10,
      windGust: 10,
      cloudCover: 20,
      cloudBase: 4000,
      visibility: 12,
      precipitation: 0,
      feelsLike: 19,
    };
    render(<WeatherCard weather={mockWeather} />);
    // Verify gusts are not displayed if equal to wind speed
    expect(screen.queryByText("Gusts")).not.toBeInTheDocument();
  });

  it("displays precipitation when greater than zero", () => {
    const mockWeather = {
      condition: "Rainy",
      temp: 12,
      windSpeed: 15,
      windGust: 18,
      cloudCover: 90,
      cloudBase: 1000,
      visibility: 5,
      precipitation: 2.5,
      feelsLike: 10,
    };
    render(<WeatherCard weather={mockWeather} />);
    expect(screen.getByText(/2\.5/)).toBeInTheDocument();
    expect(screen.getByText("mm")).toBeInTheDocument();
  });
});
