import React, { useEffect, useState } from "react";
import { Polygon, Popup, CircleMarker } from "react-leaflet";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const OPENAIP_API_KEY = import.meta.env.VITE_OPENAIP_API_KEY;

export default function AirspaceLayer({ visible = true }) {
  const { t } = useTranslation();
  const [airspaces, setAirspaces] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Spain geographic bounds: approximately
        // West: -9.5, East: 4.5, South: 36, North: 43.8
        const spainGeometry = "-9.5,36,4.5,43.8";

        // Fetch airspaces from OpenAIP for Spain region
        const airspaceResponse = await fetch(
          `https://api.core.openaip.net/api/airspaces?` +
            `page=1&limit=2000&` +
            `geometry=${spainGeometry}`,
          {
            headers: {
              "x-openaip-api-key": OPENAIP_API_KEY,
            },
          },
        );

        if (airspaceResponse.ok) {
          const airspaceData = await airspaceResponse.json();
          // Filter for CTR, VFR zones, and other relevant airspaces
          const filteredAirspaces = (airspaceData.items || []).filter(
            (airspace) => {
              const type = airspace.type?.toUpperCase();
              return (
                type === "CTR" ||
                type === "TMA" ||
                type === "CLASS_A" ||
                type === "CLASS_B" ||
                type === "CLASS_C" ||
                type === "CLASS_D" ||
                type === "CLASS_E" ||
                type === "VFR" ||
                type === "RMZ" ||
                type === "TMZ"
              );
            },
          );
          setAirspaces(filteredAirspaces);
        } else {
          console.error("Failed to fetch airspaces:", airspaceResponse.status);
        }

        // Fetch airports from OpenAIP for Spain region
        const airportResponse = await fetch(
          `https://api.core.openaip.net/api/airports?` +
            `page=1&limit=2000&` +
            `geometry=${spainGeometry}`,
          {
            headers: {
              "x-openaip-api-key": OPENAIP_API_KEY,
            },
          },
        );

        if (airportResponse.ok) {
          const airportData = await airportResponse.json();
          setAirports(airportData.items || []);
        } else {
          console.error("Failed to fetch airports:", airportResponse.status);
        }
      } catch (error) {
        console.error("Error fetching airspace and airport data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [visible]);

  if (!visible) return null;

  // Color mapping for different airspace classes
  const getAirspaceColor = (airspaceClass) => {
    const colors = {
      A: "#FF0000",
      B: "#FF0000",
      C: "#9900FF",
      D: "#0000FF",
      E: "#9900FF",
      F: "#FFFF00",
      G: "#FFFF00",
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
    return colors[airspaceClass?.toUpperCase()] || colors.OTHER;
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

        const color = getAirspaceColor(airspace.type);

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
        if (!airport.geometry || !airport.geometry.coordinates)
          return null;
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
