import { render, screen } from "@testing-library/react";
import RouteCard from "./route-card";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

vi.mock("../ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div className="card">{children}</div>
  ),
}));

vi.mock("../ui/button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }) => (
    <button onClick={onClick} type="button">
      {children}
    </button>
  ),
}));

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock("../organisms/map-view", () => ({
  default: () => <div className="map-view" />,
}));

vi.mock("../../utils/geo", () => ({
  getMapCenterAndZoom: () => ({ center: { lat: 41.52, lng: 2.1 }, zoom: 13 }),
  calculateRouteStats: () => ({ totalDistance: 100, totalTime: 60 }),
}));

vi.mock("./route-actions-menu", () => ({
  default: () => <div className="route-actions-menu" />,
}));

describe("RouteCard", () => {
  const mockRoute = {
    id: "route1",
    name: "Test Route",
    waypoints: [
      { id: "wp1", lat: 41.52, lng: 2.1, name: "Start" },
      { id: "wp2", lat: 41.53, lng: 2.11, name: "End" },
    ],
    cruiseSpeed: 100,
    speedUnit: "kt" as const,
  };

  const mockOnDelete = vi.fn();

  beforeEach(() => {
    mockOnDelete.mockClear();
  });

  it("renders route card", () => {
    render(
      <RouteCard
        route={mockRoute}
        onDelete={mockOnDelete}
        startHref="/tracking"
        editHref="/planner"
      />
    );
    expect(screen.getByText("Test Route")).toBeInTheDocument();
  });

  it("displays route name", () => {
    render(
      <RouteCard
        route={mockRoute}
        onDelete={mockOnDelete}
        startHref="/tracking"
        editHref="/planner"
      />
    );
    expect(screen.getByText("Test Route")).toBeInTheDocument();
  });

  it("renders map view", () => {
    const { container } = render(
      <RouteCard
        route={mockRoute}
        onDelete={mockOnDelete}
        startHref="/tracking"
        editHref="/planner"
      />
    );
    expect(container.querySelector(".map-view")).toBeInTheDocument();
  });

  it("renders route actions menu", () => {
    const { container } = render(
      <RouteCard
        route={mockRoute}
        onDelete={mockOnDelete}
        startHref="/tracking"
        editHref="/planner"
      />
    );
    expect(container.querySelector(".route-actions-menu")).toBeInTheDocument();
  });

  it("displays navigation button link", () => {
    render(
      <RouteCard
        route={mockRoute}
        onDelete={mockOnDelete}
        startHref="/tracking/route1"
        editHref="/planner/route1"
      />
    );
    const navLink = screen.getByRole("link", { name: /Navigate|Start/ });
    expect(navLink).toHaveAttribute("href", "/tracking/route1");
  });
});
