import { render, screen } from "@testing-library/react";
import TrackingPage from "./tracking";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { routeStorage } from "../utils/storage";

// Mock geolocation
Object.defineProperty(global.navigator, "geolocation", {
  writable: true,
  value: {
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
});

vi.mock("react-router-dom", () => {
  const mockSearchParams = new URLSearchParams("routeId=test-route");
  return {
    useLocation: () => ({
      state: { route: { id: "test", name: "Test Route", waypoints: [] } },
    }),
    useNavigate: () => vi.fn(),
    useSearchParams: () => [mockSearchParams],
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

vi.mock("../components/organisms/map-view", () => ({
  default: () => <div data-testid="map-view" />,
}));

vi.mock("../components/organisms/next-waypoint-panel", () => ({
  default: () => <div data-testid="next-waypoint-panel" />,
}));

vi.mock("../components/organisms/weather-panel", () => ({
  default: () => <div data-testid="weather-panel" />,
}));

vi.mock("../utils/storage", () => ({
  routeStorage: {
    getRoute: vi.fn(),
  },
}));

describe("TrackingPage", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset URL search params
    Object.defineProperty(window, "location", {
      value: { search: "" },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it("shows no route message when route not found", () => {
    vi.mocked(routeStorage.getRoute).mockReturnValue(undefined);
    render(<TrackingPage />);
    expect(screen.getByText(/No Route Selected/i)).toBeTruthy();
    expect(screen.getByText(/Go to Routes/i)).toBeTruthy();
  });

  it("renders tracking interface when valid route exists", () => {
    const mockRoute = {
      id: "test-route",
      name: "Test Route",
      waypoints: [
        { id: "wp1", lat: 41.52, lng: 2.1, name: "Start" },
        { id: "wp2", lat: 41.53, lng: 2.11, name: "End" },
      ],
      cruiseSpeed: 120,
      speedUnit: "knots",
    };

    Object.defineProperty(window, "location", {
      value: { search: "?routeId=test-route" },
      writable: true,
    });

    vi.mocked(routeStorage.getRoute).mockReturnValue(mockRoute);
    render(<TrackingPage />);

    // Verify core UI elements render
    expect(screen.getByTestId("map-view")).toBeTruthy();
  });

  it("displays navigation link when no route", () => {
    vi.mocked(routeStorage.getRoute).mockReturnValue(undefined);
    render(<TrackingPage />);

    const homeLink = screen.getByRole("link", { name: /go to routes/i });
    expect(homeLink).toBeTruthy();
  });
});
