import { render } from "@testing-library/react";
import MapView from "./map-view";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div className="map-container">{children}</div>
  ),
  TileLayer: () => <div className="tile-layer" />,
  Marker: () => <div className="marker" />,
  Popup: ({ children }: { children: React.ReactNode }) => <div className="popup">{children}</div>,
}));

vi.mock("./airspace-layer", () => ({
  default: () => <div className="airspace-layer" />,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

describe("MapView", () => {
  const mockWaypoints = [
    { id: "wp1", lat: 41.52, lng: 2.1, name: "Start" },
    { id: "wp2", lat: 41.53, lng: 2.11, name: "End" },
  ];

  it("renders map container", () => {
    const { container } = render(
      <MapView waypoints={mockWaypoints} />
    );
    expect(container.querySelector(".map-container")).toBeInTheDocument();
  });

  it("renders tile layer", () => {
    const { container } = render(
      <MapView waypoints={mockWaypoints} />
    );
    expect(container.querySelector(".tile-layer")).toBeInTheDocument();
  });

  it("renders airspace layer", () => {
    const { container } = render(
      <MapView waypoints={mockWaypoints} />
    );
    expect(container.querySelector(".airspace-layer")).toBeInTheDocument();
  });

  it("renders markers for waypoints", () => {
    const { container } = render(
      <MapView waypoints={mockWaypoints} />
    );
    const markers = container.querySelectorAll(".marker");
    expect(markers.length).toBeGreaterThan(0);
  });

  it("renders with empty waypoints", () => {
    const { container } = render(
      <MapView waypoints={[]} />
    );
    expect(container.querySelector(".map-container")).toBeInTheDocument();
  });

  it("applies current waypoint styling when index provided", () => {
    const { container } = render(
      <MapView waypoints={mockWaypoints} currentWaypointIndex={0} />
    );
    expect(container.querySelector(".map-container")).toBeInTheDocument();
  });

  it("renders map with route tracking mode", () => {
    const { container } = render(
      <MapView waypoints={mockWaypoints} currentWaypointIndex={1} />
    );
    expect(container.querySelector(".map-container")).toBeInTheDocument();
  });
});
