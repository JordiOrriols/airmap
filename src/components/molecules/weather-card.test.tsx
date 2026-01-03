import { render, screen } from "@testing-library/react";
import WeatherCard from "./weather-card";
import { describe, it, expect } from "vitest";

describe("WeatherCard", () => {
  const mockWeather = {
    condition: "Sunny",
    temp: 25,
    humidity: 60,
    windSpeed: 10,
  };

  it("renders weather card", () => {
    const { container } = render(<WeatherCard weather={mockWeather} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("displays temperature", () => {
    render(<WeatherCard weather={mockWeather} />);
    expect(screen.getByText(/25/)).toBeInTheDocument();
  });

  it("displays weather condition", () => {
    render(<WeatherCard weather={mockWeather} />);
    expect(screen.getByText(/Sunny/)).toBeInTheDocument();
  });

  it("displays humidity", () => {
    render(<WeatherCard weather={mockWeather} />);
    expect(screen.getByText(/60/)).toBeInTheDocument();
  });
});
