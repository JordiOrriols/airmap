import { render, screen } from "@testing-library/react";
import PlannerPage from "./planner";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-router-dom", () => ({
  useLocation: () => ({
    state: { route: { id: "test", name: "Test Route", waypoints: [] } },
  }),
  useNavigate: () => vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

vi.mock("../components/organisms/map-view", () => ({
  default: () => <div className="map-view" />,
}));

vi.mock("../components/organisms/route-control-panel", () => ({
  default: () => <div className="route-control-panel" />,
}));

vi.mock("../components/organisms/weather-panel", () => ({
  default: () => <div className="weather-panel" />,
}));

vi.mock("../components/atoms/theme-toggle", () => ({
  default: () => <div className="theme-toggle" />,
}));

vi.mock("../lib/theme-context", () => ({
  useTheme: () => ({
    isDark: false,
    toggleTheme: vi.fn(),
  }),
}));

vi.mock("../api/openaip", () => ({
  fetchAirspaceData: vi.fn(() => Promise.resolve([])),
}));

describe("PlannerPage", () => {
  it("renders planner page", () => {
    const { container } = render(<PlannerPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders map view", () => {
    const { container } = render(<PlannerPage />);
    expect(container.querySelector(".map-view")).toBeInTheDocument();
  });

  it("renders route control panel", () => {
    const { container } = render(<PlannerPage />);
    expect(container.querySelector(".route-control-panel")).toBeInTheDocument();
  });

  it("renders weather panel", () => {
    const { container } = render(<PlannerPage />);
    expect(container.querySelector(".weather-panel")).toBeInTheDocument();
  });

  it("renders theme toggle", () => {
    const { container } = render(<PlannerPage />);
    expect(container.querySelector(".theme-toggle")).toBeInTheDocument();
  });

  it("renders with layout container", () => {
    const { container } = render(<PlannerPage />);
    const layoutDiv = container.querySelector("[class*='flex']");
    expect(layoutDiv).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<PlannerPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
