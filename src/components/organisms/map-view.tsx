import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AirspaceLayer from "../flight/airspace-layer";

type LatLng = { lat: number; lng: number };

type MapViewProps = {
  center?: LatLng | [number, number];
  zoom?: number;
  waypoints?: LatLng[];
  currentPosition?: LatLng | null;
  currentHeading?: number;
  showAirspace?: boolean;
  airspaceReloadTrigger?: number;
  showWaypoints?: boolean;
  showAircraft?: boolean;
  showPolyline?: boolean;
  interactive?: boolean; // enable map interactions
  allowMapClick?: boolean; // allow adding markers via map click
  onMapClick?: (latlng: LatLng) => void;
  onMarkerDrag?: (index: number, lat: number, lng: number) => void;
  waypointIcon?: L.DivIcon;
  passedWaypointIcon?: L.DivIcon;
  activeWaypointIcon?: L.DivIcon;
  upcomingWaypointIcon?: L.DivIcon;
  aircraftIcon?: (rotation?: number) => L.DivIcon;
  tileUrl?: string;
  tileAttribution?: string;
};

function MapClickHandler({
  allowMapClick,
  onMapClick,
}: {
  allowMapClick?: boolean;
  onMapClick?: (latlng: LatLng) => void;
}) {
  useMapEvents({
    click: (e) => {
      if (allowMapClick && onMapClick) onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function MapController({ center }: { center?: LatLng | [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (!center) return;
    const coords = Array.isArray(center) ? center : [center.lat, center.lng];
    map.setView(coords as [number, number], map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapView({
  center = { lat: 41.5209, lng: 2.105 },
  zoom = 13,
  waypoints = [],
  currentPosition = null,
  currentHeading = 0,
  showAirspace = true,
  airspaceReloadTrigger = 0,
  showWaypoints = true,
  showAircraft = true,
  showPolyline = true,
  interactive = true,
  allowMapClick = false,
  onMapClick,
  onMarkerDrag,
  waypointIcon,
  upcomingWaypointIcon,
  aircraftIcon,
  tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}: MapViewProps) {
  // Default icons
  const defaultWaypointIcon = new L.DivIcon({
    className: "custom-waypoint-marker",
    html: `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 24px; height: 24px; border-radius: 50%; border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const getWaypointIcon = (index: number) => {
    if (index < 0) return waypointIcon || defaultWaypointIcon;
    // For flexibility, prefer passed specific icons when provided
    if (index < 0 && waypointIcon) return waypointIcon;
    return upcomingWaypointIcon || waypointIcon || defaultWaypointIcon;
  };

  const getWaypointIconWithNumber = (index: number) => {
    return new L.DivIcon({
      className: "custom-waypoint-marker-with-number",
      html: `<div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-weight: bold; font-size: 14px; font-family: Arial, sans-serif;">${index + 1}</span>
        </div>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const defaultAircraftIcon = (rotation = 0) =>
    new L.DivIcon({
      className: "custom-aircraft-marker",
      html: `<div style="transform: rotate(${rotation}deg); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14 10H22L16 14L18 22L12 18L6 22L8 14L2 10H10L12 2Z" fill="#3b82f6" stroke="white" stroke-width="2"/>
        </svg>
      </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer
        center={Array.isArray(center) ? center : [center.lat, center.lng]}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={false}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        scrollWheelZoom={interactive}
        boxZoom={interactive}
        keyboard={interactive}
      >
        <TileLayer url={tileUrl} attribution={tileAttribution} />

        <MapClickHandler allowMapClick={allowMapClick} onMapClick={onMapClick} />
        <MapController center={currentPosition || center} />

        {showAirspace && <AirspaceLayer visible={true} reloadTrigger={airspaceReloadTrigger} />}

        {showWaypoints &&
          waypoints.map((wp, idx) => (
            <Marker
              key={idx}
              position={[wp.lat, wp.lng]}
              icon={getWaypointIconWithNumber(idx)}
              draggable={Boolean(onMarkerDrag)}
              eventHandlers={{
                dragend: (e) => {
                  if (onMarkerDrag) {
                    const { lat, lng } = e.target.getLatLng();
                    onMarkerDrag(idx, lat, lng);
                  }
                },
              }}
            />
          ))}

        {showPolyline && waypoints.length > 1 && (
          <Polyline
            positions={waypoints.map((w) => [w.lat, w.lng])}
            color="#a78bfa"
            weight={3}
            opacity={0.8}
            dashArray="10, 10"
          />
        )}

        {showAircraft && currentPosition && (
          <>
            <Marker
              position={[currentPosition.lat, currentPosition.lng]}
              icon={(aircraftIcon || defaultAircraftIcon)(currentHeading)}
            />
            <Circle
              center={[currentPosition.lat, currentPosition.lng]}
              radius={50}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.2,
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}
