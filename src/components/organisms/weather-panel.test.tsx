import { render, screen } from "@testing-library/react";
import WeatherPanel from "./weather-panel";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

vi.mock("../ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div className="select">{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div className="select-content">{children}</div>
  ),
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div className="select-item" data-value={value}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div className="select-trigger">{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
}));

vi.mock("../molecules/weather-card", () => ({
  default: () => <div className="weather-card" />,
}));

vi.mock("../../api/weather", () => ({
  useCurrentWeather: () => ({
    data: null,
    isLoading: false,
    error: null,
  }),
  useWeatherForecast: () => ({
    data: {},
    isLoading: false,
    error: null,
  }),
}));

describe("WeatherPanel", () => {
  it("renders weather panel", () => {
    const { container } = render(<WeatherPanel location={{ lat: 41.52, lng: 2.1 }} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders weather card", () => {
    const { container } = render(<WeatherPanel location={{ lat: 41.52, lng: 2.1 }} />);
    expect(container.querySelector(".weather-card")).toBeInTheDocument();
  });

  it("renders current weather by default", () => {
    render(<WeatherPanel location={{ lat: 41.52, lng: 2.1 }} forecastMode={false} />);
    const panel = screen.getByRole("heading", { level: 2, hidden: true });
    // Weather panel renders without explicit heading
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders forecast mode when enabled", () => {
    render(<WeatherPanel location={{ lat: 41.52, lng: 2.1 }} forecastMode={true} />);
    expect(screen.getByRole("combobox", { hidden: true })).toBeInTheDocument();
  });

  it("renders compact mode", () => {
    const { container } = render(
      <WeatherPanel location={{ lat: 41.52, lng: 2.1 }} compact={true} />
    );
    expect(container.querySelector(".weather-card")).toBeInTheDocument();
  });

  it("uses default location when not provided", () => {
    const { container } = render(<WeatherPanel />);
    expect(container.querySelector(".weather-card")).toBeInTheDocument();
  });
});
