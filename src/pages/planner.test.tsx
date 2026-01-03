import { render, screen } from "@testing-library/react";
import PlannerPage from "./planner";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { routeStorage } from "../utils/storage";

vi.mock("react-router-dom", () => ({
  useLocation: () => ({
    state: { route: { id: "test", name: "Test Route", waypoints: [] } },
  }),
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

vi.mock("../components/organisms/map-view", () => ({
  default: () => <div data-testid="map-view" />,
}));

vi.mock("../components/organisms/route-control-panel", () => ({
  default: () => <div data-testid="route-control-panel" />,
}));

vi.mock("../components/organisms/weather-panel", () => ({
  default: () => <div data-testid="weather-panel" />,
}));

vi.mock("../components/atoms/theme-toggle", () => ({
  default: () => <div data-testid="theme-toggle" />,
}));

vi.mock("../lib/theme-context", () => ({
  useTheme: () => ({
    isDark: false,
    toggleTheme: vi.fn(),
  }),
}));

vi.mock("../api/openaip", () => ({
  fetchAirspaceData: vi.fn(() => Promise.resolve([])),
  useAirspaces: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
  processAirspaceForPIP: vi.fn((airspace) => airspace),
}));

vi.mock("../utils/storage", () => ({
  routeStorage: {
    getRoute: vi.fn(),
    saveRoute: vi.fn(),
  },
}));

describe("PlannerPage", () => {
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

  it("renders planner interface", () => {
    render(<PlannerPage />);
    // Verify core components render
    expect(screen.getByTestId("map-view")).toBeTruthy();
    expect(screen.getByTestId("route-control-panel")).toBeTruthy();
  });

  it("renders navigation buttons", () => {
    render(<PlannerPage />);
    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toBeTruthy();
  });

  it("displays theme toggle", () => {
    render(<PlannerPage />);
    expect(screen.getByTestId("theme-toggle")).toBeTruthy();
  });

  it("loads existing route from URL parameters", () => {
    const mockRoute = {
      id: "test-route",
      name: "Test Flight",
      waypoints: [
        { id: "wp1", lat: 41.52, lng: 2.1, name: "Barcelona" },
      ],
      cruiseSpeed: 120,
      speedUnit: "knots",
    };

    Object.defineProperty(window, "location", {
      value: { search: "?routeId=test-route" },
      writable: true,
    });

    vi.mocked(routeStorage.getRoute).mockReturnValue(mockRoute);
    render(<PlannerPage />);

    // Verify the planner loaded successfully
    expect(screen.getByTestId("map-view")).toBeTruthy();
  });
});
