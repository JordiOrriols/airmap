import { render, screen, waitFor } from "@testing-library/react";
import WeatherPanel from "./weather-panel";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("lucide-react", () => ({
  Loader2: () => <div data-testid="loader" />,
  Calendar: () => <div />,
  Clock: () => <div />,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

vi.mock("../ui/select", () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="select" data-value={value}>
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid={`select-item-${value}`}>{children}</div>
  ),
  SelectTrigger: ({ children }: any) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: () => null,
}));

vi.mock("../molecules/weather-card", () => ({
  default: ({ weather }: any) => (
    <div data-testid="weather-card">
      {weather?.temperature && <span>{weather.temperature}°</span>}
    </div>
  ),
}));

vi.mock("../../api/weather", () => ({
  useCurrentWeather: vi.fn(() => ({
    data: { temperature: 20, condition: "clear", humidity: 65, windSpeed: 10 },
    isLoading: false,
    error: null,
  })),
  useWeatherForecast: vi.fn(() => ({
    data: {},
    isLoading: false,
    error: null,
  })),
}));

describe("WeatherPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders weather card with current weather data", async () => {
    render(<WeatherPanel location={{ lat: 41.52, lng: 2.1 }} />);

    await waitFor(() => {
      const weatherCard = screen.getByTestId("weather-card");
      expect(weatherCard).toBeTruthy();
      expect(weatherCard.textContent).toContain("20°");
    });
  });

  it("uses default location when not provided", async () => {
    render(<WeatherPanel />);

    await waitFor(() => {
      const weatherCard = screen.getByTestId("weather-card");
      expect(weatherCard).toBeTruthy();
    });
  });

  it("renders compact mode with weather card", async () => {
    render(<WeatherPanel location={{ lat: 41.52, lng: 2.1 }} compact={true} />);

    await waitFor(() => {
      const weatherCard = screen.getByTestId("weather-card");
      expect(weatherCard).toBeTruthy();
    });
  });

  it("renders non-compact mode with default location", async () => {
    render(<WeatherPanel />);

    await waitFor(() => {
      const weatherCard = screen.getByTestId("weather-card");
      expect(weatherCard).toBeTruthy();
    });
  });
});
