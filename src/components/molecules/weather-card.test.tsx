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
  default: ({ label, value }: { label: string; value: string }) => (
    <div>
      {label}: {value}
    </div>
  ),
}));

describe("WeatherCard", () => {
  const mockWeather = {
    condition: "Sunny",
    temp: 25,
    windSpeed: 10,
    windGust: 15,
    cloudCover: 20,
    cloudBase: 5000,
    visibility: 10,
    precipitation: 0,
    feelsLike: 24,
  };

  it("renders weather card", () => {
    const { container } = render(<WeatherCard weather={mockWeather} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("displays temperature", () => {
    render(<WeatherCard weather={mockWeather} />);
    expect(screen.getByText("25°C")).toBeInTheDocument();
  });

  it("displays no data message when weather is null", () => {
    render(<WeatherCard weather={null} />);
    expect(screen.getByText("No weather data available")).toBeInTheDocument();
  });

  it("renders compact mode", () => {
    render(<WeatherCard weather={mockWeather} compact={true} />);
    expect(screen.getByText("25°C")).toBeInTheDocument();
  });
});
