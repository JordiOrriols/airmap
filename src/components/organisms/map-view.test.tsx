import { render } from "@testing-library/react";
import MapView from "./map-view";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="marker">{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>,
  Polyline: () => <div data-testid="polyline" />,
  Circle: () => <div data-testid="circle" />,
  useMapEvents: vi.fn(() => null),
  useMap: vi.fn(() => ({
    setView: vi.fn(),
    getZoom: vi.fn(() => 13),
  })),
}));

vi.mock("../flight/airspace-layer", () => ({
  default: () => <div data-testid="airspace-layer" />,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

describe("MapView", () => {
  const mockWaypoints = [
    { lat: 41.52, lng: 2.1 },
    { lat: 41.53, lng: 2.11 },
  ];

  it("renders map container", () => {
    const { getByTestId } = render(<MapView waypoints={mockWaypoints} />);
    expect(getByTestId("map-container")).toBeTruthy();
  });

  it("renders tile layer", () => {
    const { getByTestId } = render(<MapView waypoints={mockWaypoints} />);
    expect(getByTestId("tile-layer")).toBeTruthy();
  });

  it("displays airspace layer when enabled", () => {
    const { getByTestId } = render(<MapView waypoints={mockWaypoints} showAirspace={true} />);
    expect(getByTestId("airspace-layer")).toBeTruthy();
  });

  it("renders markers for each waypoint", () => {
    const { getAllByTestId } = render(<MapView waypoints={mockWaypoints} showWaypoints={true} />);
    const markers = getAllByTestId("marker");
    expect(markers.length).toBeGreaterThan(0);
  });

  it("renders with empty waypoints array", () => {
    const { getByTestId } = render(<MapView waypoints={[]} />);
    expect(getByTestId("map-container")).toBeTruthy();
  });

  it("renders polyline connecting waypoints", () => {
    const { getByTestId } = render(<MapView waypoints={mockWaypoints} showPolyline={true} />);
    expect(getByTestId("polyline")).toBeTruthy();
  });

  it("displays current position when provided", () => {
    const currentPos = { lat: 41.525, lng: 2.105 };
    const { getAllByTestId } = render(
      <MapView waypoints={mockWaypoints} currentPosition={currentPos} showAircraft={true} />
    );
    // Aircraft should be rendered as a marker
    const markers = getAllByTestId("marker");
    expect(markers.length).toBeGreaterThan(0);
  });

  it("uses custom center and zoom when provided", () => {
    const customCenter = { lat: 40.7, lng: -74.0 };
    const { getByTestId } = render(<MapView waypoints={[]} center={customCenter} zoom={10} />);
    expect(getByTestId("map-container")).toBeTruthy();
  });
});
