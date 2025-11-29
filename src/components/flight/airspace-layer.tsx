import React, { useEffect, useState } from "react";
import { Polygon, Popup, CircleMarker, useMap } from "react-leaflet";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const OPENAIP_API_KEY = import.meta.env.VITE_OPENAIP_API_KEY;

export default function AirspaceLayer({ visible = true, reloadTrigger = 0 }) {
  const { t } = useTranslation();
  const [airspaces, setAirspaces] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const map = useMap();

  useEffect(() => {
    if (!visible || !map) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Get current map bounds and expand them with a buffer
        const bounds = map.getBounds();
        const center = map.getCenter();
        const zoomLevel = map.getZoom();

        // Calculate a buffer based on zoom level to ensure we get airspace data
        // At higher zoom levels, we need a larger geographic buffer
        const bufferFactor = Math.pow(2, 16 - zoomLevel) / 100000;

        const north = Math.min(bounds.getNorth() + bufferFactor, 90);
        const south = Math.max(bounds.getSouth() - bufferFactor, -90);
        const east = Math.min(bounds.getEast() + bufferFactor, 180);
        const west = Math.max(bounds.getWest() - bufferFactor, -180);

        // Bbox format: minx,miny,maxx,maxy (west,south,east,north)
        const bbox = `${west},${south},${east},${north}`;

        console.log("Map state:", {
          center: { lat: center.lat, lng: center.lng },
          zoom: zoomLevel,
          bounds: { north, south, east, west },
          bbox,
        });
        console.log("Fetching airspace data with bbox:", bbox);

        // Fetch airspaces from OpenAIP for current map view
        const airspaceUrl = `https://api.core.openaip.net/api/airspaces?page=1&limit=1000&bbox=${bbox}`;
        console.log("Airspace URL:", airspaceUrl);

        const airspaceResponse = await fetch(airspaceUrl, {
          headers: {
            "x-openaip-api-key": OPENAIP_API_KEY,
          },
        });

        if (airspaceResponse.ok) {
          const airspaceData = await airspaceResponse.json();
          console.log("Airspace response:", airspaceData);

          // Filter for VFR, CTR, TMA and ICAO classes A-E
          const filteredAirspaces = (airspaceData.items || []).filter(
            (airspace) => {
              // Debug: log the first few airspaces to see the structure
              console.log("Airspace structure:", {
                name: airspace.name,
                type: airspace.type,
                icaoClass: airspace.icaoClass,
              });

              const type = airspace.type ? String(airspace.type).toUpperCase() : "";
              const icaoClass = airspace.icaoClass;

              // Show VFR zones, CTR, TMA, and ICAO classes A through E
              return (
                type === "VFR" ||
                type === "CTR" ||
                type === "TMA" ||
                icaoClass === 0 || // Class A
                icaoClass === 1 || // Class B
                icaoClass === 2 || // Class C
                icaoClass === 3 || // Class D
                icaoClass === 4 || // Class E
                type === "RMZ" ||
                type === "TMZ"
              );
            }
          );
          console.log("Filtered airspaces:", filteredAirspaces.length);
          console.log("Filtered airspaces:", filteredAirspaces);
          setAirspaces(filteredAirspaces);
        } else {
          const errorText = await airspaceResponse.text();
          console.error(
            "Failed to fetch airspaces:",
            airspaceResponse.status,
            errorText
          );
        }

        // Fetch airports from OpenAIP for current map view
        const airportUrl = `https://api.core.openaip.net/api/airports?page=1&limit=1000&bbox=${bbox}`;
        console.log("Airport URL:", airportUrl);

        const airportResponse = await fetch(airportUrl, {
          headers: {
            "x-openaip-api-key": OPENAIP_API_KEY,
          },
        });

        if (airportResponse.ok) {
          const airportData = await airportResponse.json();
          console.log("Airport response:", airportData);
          setAirports(airportData.items || []);
        } else {
          const errorText = await airportResponse.text();
          console.error(
            "Failed to fetch airports:",
            airportResponse.status,
            errorText
          );
        }
      } catch (error) {
        console.error("Error fetching airspace and airport data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [visible, map, reloadTrigger]);

  if (!visible) return null;

  // Color mapping for different airspace classes
  const getAirspaceColor = (airspace) => {
    const colors = {
      0: "#FF0000", // Class A
      1: "#FF0000", // Class B
      2: "#9900FF", // Class C
      3: "#0000FF", // Class D
      4: "#9900FF", // Class E
      5: "#FFFF00", // Class F
      6: "#FFFF00", // Class G
      CTR: "#0000FF",
      TMA: "#9900FF",
      RMZ: "#FF6B6B",
      TMZ: "#4ECDC4",
      RESTRICTED: "#FF0000",
      PROHIBITED: "#8B0000",
      DANGER: "#FFA500",
      GLIDING: "#00FF00",
      VFR: "#90EE90",
      OTHER: "#808080",
    };

    // Try to match by ICAO class first (numeric)
    if (airspace.icaoClass !== undefined && airspace.icaoClass !== null) {
      if (colors[airspace.icaoClass] !== undefined) {
        return colors[airspace.icaoClass];
      }
    }

    // Then try to match by type string
    if (airspace.type) {
      const typeKey = airspace.type.toUpperCase();
      if (colors[typeKey] !== undefined) {
        return colors[typeKey];
      }
    }

    return colors.OTHER;
  };

  const convertToCoordinates = (geometry) => {
    if (!geometry || !geometry.coordinates) return null;

    try {
      // Handle different geometry types from OpenAIP
      if (geometry.type === "Polygon") {
        return geometry.coordinates[0].map((coord) => [coord[1], coord[0]]);
      } else if (geometry.type === "MultiPolygon") {
        // Return first polygon for now
        return geometry.coordinates[0][0].map((coord) => [coord[1], coord[0]]);
      }
    } catch (error) {
      console.error("Error converting coordinates:", error);
    }
    return null;
  };

  const formatAltitude = (limit) => {
    if (!limit) return t("airspace.na", "N/A");

    if (limit.unit === "F") {
      return `${limit.value} ft`;
    } else if (limit.unit === "FL") {
      return `FL${limit.value}`;
    } else if (limit.referenceDatum === "GND") {
      return `${limit.value} ft AGL`;
    }
    return `${limit.value} ${limit.unit}`;
  };

  return (
    <>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            background: "rgba(0,0,0,0.7)",
            padding: "12px 24px",
            borderRadius: "8px",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          {t("airspace.loading", "Loading airspaces...")}
        </div>
      )}

      {airspaces.map((airspace) => {
        const coordinates = convertToCoordinates(airspace.geometry);
        if (!coordinates) return null;

        const color = getAirspaceColor(airspace);

        return (
          <Polygon
            key={airspace._id}
            positions={coordinates}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.15,
              weight: 2,
              opacity: 0.6,
            }}
          >
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: color,
                  }}
                >
                  {airspace.name}
                </h3>
                <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>{t("airspace.class", "Class")}:</strong>{" "}
                    {airspace.type}
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>{t("airspace.lower_limit", "Lower Limit")}:</strong>{" "}
                    {formatAltitude(airspace.lowerLimit)}
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>{t("airspace.upper_limit", "Upper Limit")}:</strong>{" "}
                    {formatAltitude(airspace.upperLimit)}
                  </div>
                  {airspace.country && (
                    <div style={{ marginBottom: "4px" }}>
                      <strong>{t("airspace.country", "Country")}:</strong>{" "}
                      {airspace.country}
                    </div>
                  )}
                  {airspace.activity && (
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      {airspace.activity}
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Polygon>
        );
      })}

      {/* Render airports as circle markers */}
      {airports.map((airport) => {
        if (!airport.geometry || !airport.geometry.coordinates) return null;
        const [lng, lat] = airport.geometry.coordinates;
        const isMajor = airport.type === "major" || airport.type === "MAJOR";
        const radius = isMajor ? 8 : 5;
        const color = isMajor ? "#FF6B00" : "#00CCFF";

        return (
          <CircleMarker
            key={airport._id}
            center={[lat, lng]}
            radius={radius}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.8,
              weight: 2,
              opacity: 0.9,
            }}
          >
            <Popup>
              <div style={{ minWidth: "150px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: color,
                  }}
                >
                  {airport.name}
                </h3>
                <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  {airport.icao && (
                    <div style={{ marginBottom: "4px" }}>
                      <strong>ICAO:</strong> {airport.icao}
                    </div>
                  )}
                  {airport.iata && (
                    <div style={{ marginBottom: "4px" }}>
                      <strong>IATA:</strong> {airport.iata}
                    </div>
                  )}
                  {airport.elevation && (
                    <div style={{ marginBottom: "4px" }}>
                      <strong>Elevation:</strong> {airport.elevation} ft
                    </div>
                  )}
                  {airport.type && (
                    <div style={{ marginBottom: "4px" }}>
                      <strong>Type:</strong> {airport.type}
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
