import { render, screen } from "@testing-library/react";
import TrackingPage from "./tracking";
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

vi.mock("../components/organisms/next-waypoint-panel", () => ({
  default: () => <div className="next-waypoint-panel" />,
}));

vi.mock("../components/organisms/weather-panel", () => ({
  default: () => <div className="weather-panel" />,
}));

vi.mock("../components/organisms/tracking-control-panel", () => ({
  default: () => <div className="tracking-control-panel" />,
}));

vi.mock("../components/atoms/glass-card", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div className="glass-card">{children}</div>
  ),
}));

describe("TrackingPage", () => {
  it("renders tracking page", () => {
    const { container } = render(<TrackingPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders map view", () => {
    const { container } = render(<TrackingPage />);
    expect(container.querySelector(".map-view")).toBeInTheDocument();
  });

  it("renders next waypoint panel", () => {
    const { container } = render(<TrackingPage />);
    expect(container.querySelector(".next-waypoint-panel")).toBeInTheDocument();
  });

  it("renders tracking control panel", () => {
    const { container } = render(<TrackingPage />);
    expect(container.querySelector(".tracking-control-panel")).toBeInTheDocument();
  });

  it("renders weather panel", () => {
    const { container } = render(<TrackingPage />);
    expect(container.querySelector(".weather-panel")).toBeInTheDocument();
  });

  it("renders glass card container", () => {
    const { container } = render(<TrackingPage />);
    expect(container.querySelector(".glass-card")).toBeInTheDocument();
  });

  it("renders toggle buttons for panels", () => {
    render(<TrackingPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
