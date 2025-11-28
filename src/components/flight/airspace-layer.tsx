import React, { useEffect, useState } from "react";
import { Polygon, Popup, useMap } from "react-leaflet";
import { Loader2 } from "lucide-react";

const OPENAIP_API_KEY = "YOUR_API_KEY"; // Users need to get their own key from openaip.net

export default function AirspaceLayer({ visible = true }) {
  const [airspaces, setAirspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const map = useMap();

  useEffect(() => {
    if (!visible) return;

    const fetchAirspaces = async () => {
      setLoading(true);
      try {
        // Get map bounds for Spain region
        const bounds = map.getBounds();
        const north = bounds.getNorth();
        const south = bounds.getSouth();
        const east = bounds.getEast();
        const west = bounds.getWest();

        // Fetch airspaces from OpenAIP for Spain region
        const response = await fetch(
          `https://api.core.openaip.net/api/airspaces?` +
          `page=1&limit=500&` +
          `geometry=${west},${south},${east},${north}`,
          {
            headers: {
              'x-openaip-api-key': OPENAIP_API_KEY
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAirspaces(data.items || []);
        } else {
          console.error("Failed to fetch airspaces:", response.status);
        }
      } catch (error) {
        console.error("Error fetching airspaces:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAirspaces();

    // Refetch when map moves significantly
    const handleMoveEnd = () => {
      fetchAirspaces();
    };

    map.on('moveend', handleMoveEnd);
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [visible, map]);

  if (!visible) return null;

  // Color mapping for different airspace classes
  const getAirspaceColor = (airspaceClass) => {
    const colors = {
      'A': '#FF0000',
      'B': '#FF0000',
      'C': '#9900FF',
      'D': '#0000FF',
      'E': '#9900FF',
      'F': '#FFFF00',
      'G': '#FFFF00',
      'CTR': '#0000FF',
      'TMA': '#9900FF',
      'RMZ': '#FF6B6B',
      'TMZ': '#4ECDC4',
      'RESTRICTED': '#FF0000',
      'PROHIBITED': '#8B0000',
      'DANGER': '#FFA500',
      'GLIDING': '#00FF00',
      'OTHER': '#808080'
    };
    return colors[airspaceClass] || colors.OTHER;
  };

  const convertToCoordinates = (geometry) => {
    if (!geometry || !geometry.coordinates) return null;

    try {
      // Handle different geometry types from OpenAIP
      if (geometry.type === 'Polygon') {
        return geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
      } else if (geometry.type === 'MultiPolygon') {
        // Return first polygon for now
        return geometry.coordinates[0][0].map(coord => [coord[1], coord[0]]);
      }
    } catch (error) {
      console.error("Error converting coordinates:", error);
    }
    return null;
  };

  const formatAltitude = (limit) => {
    if (!limit) return "N/A";
    
    if (limit.unit === 'F') {
      return `${limit.value} ft`;
    } else if (limit.unit === 'FL') {
      return `FL${limit.value}`;
    } else if (limit.referenceDatum === 'GND') {
      return `${limit.value} ft AGL`;
    }
    return `${limit.value} ${limit.unit}`;
  };

  return (
    <>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          background: 'rgba(0,0,0,0.7)',
          padding: '12px 24px',
          borderRadius: '8px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading airspaces...
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
              opacity: 0.6
            }}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  marginBottom: '8px',
                  color: color 
                }}>
                  {airspace.name}
                </h3>
                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Class:</strong> {airspace.type}
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Lower Limit:</strong>{' '}
                    {formatAltitude(airspace.lowerLimit)}
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Upper Limit:</strong>{' '}
                    {formatAltitude(airspace.upperLimit)}
                  </div>
                  {airspace.country && (
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Country:</strong> {airspace.country}
                    </div>
                  )}
                  {airspace.activity && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                      {airspace.activity}
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Polygon>
        );
      })}
    </>
  );
}