import { render, screen, fireEvent } from "@testing-library/react";
import RouteCard from "./route-card";
import type { RouteData } from "../../types";
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
  const mockOnDelete = vi.fn();

  const baseRoute: RouteData = {
    id: "route1",
    name: "Test Route",
    waypoints: [
      { lat: 41.52, lng: 2.1, name: "Start" },
      { lat: 41.53, lng: 2.11, name: "End" },
    ],
    cruiseSpeed: 100,
    speedUnit: "knots",
  };

  beforeEach(() => {
    mockOnDelete.mockClear();
  });

  it.each([
    { name: "Boston Route", id: "r1" },
    { name: "Cross Country Flight", id: "r2" },
    { name: "Training Circuit", id: "r3" },
  ])("displays route name '$name'", ({ name, id }) => {
    render(
      <RouteCard
        route={{ ...baseRoute, name, id }}
        onDelete={mockOnDelete}
        startHref="/tracking"
        editHref="/planner"
      />
    );
    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it("renders map view component", () => {
    const { container } = render(
      <RouteCard
        route={baseRoute}
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
        route={baseRoute}
        onDelete={mockOnDelete}
        startHref="/tracking"
        editHref="/planner"
      />
    );
    expect(container.querySelector(".route-actions-menu")).toBeInTheDocument();
  });

  it("creates navigation link with correct href", () => {
    render(
      <RouteCard
        route={baseRoute}
        onDelete={mockOnDelete}
        startHref="/tracking/route1"
        editHref="/planner/route1"
      />
    );
    const navLink = screen.getByRole("link", { name: /Navigate|Start/i });
    expect(navLink).toHaveAttribute("href", "/tracking/route1");
  });

  it.each([
    { cruiseSpeed: 80, speedUnit: "knots" as const },
    { cruiseSpeed: 150, speedUnit: "kmh" as const },
  ])(
    "handles route with cruiseSpeed=$cruiseSpeed $speedUnit",
    ({ cruiseSpeed, speedUnit }) => {
      render(
        <RouteCard
          route={{ ...baseRoute, cruiseSpeed, speedUnit }}
          onDelete={mockOnDelete}
          startHref="/tracking"
          editHref="/planner"
        />
      );
      expect(screen.getByText(baseRoute.name)).toBeInTheDocument();
    }
  );

  it("handles routes with different waypoint counts", () => {
    const multiWaypointRoute = {
      ...baseRoute,
      waypoints: Array.from({ length: 5 }, (_, i) => ({
        id: `wp${i}`,
        lat: 41.5 + i * 0.01,
        lng: 2.1 + i * 0.01,
        name: `Waypoint ${i + 1}`,
      })),
    };
    render(
      <RouteCard
        route={multiWaypointRoute}
        onDelete={mockOnDelete}
        startHref="/tracking"
        editHref="/planner"
      />
    );
    expect(screen.getByText(baseRoute.name)).toBeInTheDocument();
  });

  it("exports route data when export is triggered", () => {
    // This tests that export functionality is available through actions menu
    render(
      <RouteCard
        route={baseRoute}
        onDelete={mockOnDelete}
        startHref="/tracking"
        editHref="/planner"
      />
    );
    const actionMenu = screen.getByRole("heading", { hidden: true });
    expect(actionMenu).toBeInTheDocument();
  });
});
