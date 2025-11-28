import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Navigation,
  Trash2,
  Save,
  Plus,
  Plane,
  Edit3,
  MousePointer,
  Download,
  Upload,
  Home,
  Check,
  Eye,
  EyeOff,
  CloudSun,
  Route,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "../utils/index";
import { Link } from "react-router-dom";
import AirspaceLayer from "../components/flight/airspace-layer";
import WaypointListPanel from "../components/organisms/waypoints-list-panel";
import WeatherPanel from "../components/organisms/weather-panel";
import CollapsiblePanel from "../components/molecules/collapsible-panel";
import DraggablePanelContainer from "../components/organisms/draggable-container";
import RouteStatsCard from "../components/molecules/route-stats-card";
import RouteSegmentCard from "../components/molecules/route-segment-card";
import GradientIcon from "../components/atoms/gradient-icon";
import { routeStorage } from "../utils/storage";
import { MAP_CENTER } from "@/utils/constants";
import RouteControlPanel from "../components/organisms/route-control-panel";
import { calculateBearing as geoCalculateBearing, calculateDistance as geoCalculateDistance, speedToKnots } from "../utils/geo";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom waypoint icon
const waypointIcon = new L.DivIcon({
  className: "custom-waypoint-marker",
  html: `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function MapClickHandler({ onMapClick, isEditMode }) {
  useMapEvents({
    click: (e) => {
      if (isEditMode) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

export default function FlightPlanner() {
  const [routeId, setRouteId] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [cruiseSpeed, setCruiseSpeed] = useState(120); // Default cruise speed
  const [speedUnit, setSpeedUnit] = useState("knots"); // "knots" or "kmh"
  const [routeName, setRouteName] = useState("");
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true); // Start in edit mode
  const [saved, setSaved] = useState(false);
  const [showAirspace, setShowAirspace] = useState(true);
  const [weatherLocation, setWeatherLocation] = useState({
    lat: 41.5209,
    lng: 2.105,
  });
  const [leftPanels, setLeftPanels] = useState(["routeControl", "weather"]);
  const [rightPanels, setRightPanels] = useState(["routeInfo"]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Get route ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("routeId");

    if (id) {
      setRouteId(id);
      loadRoute(id);
    }
  }, []);

  // Auto-save route when data changes
  useEffect(() => {
    if (routeId) {
      const timer = setTimeout(() => {
        saveRoute();
      }, 1000); // Auto-save after 1 second of no changes

      return () => clearTimeout(timer);
    }
  }, [waypoints, cruiseSpeed, speedUnit, routeName]);

  const loadRoute = (id) => {
    const route = routeStorage.getRoute(id);
    if (route) {
      setRouteName(route.name);
      setWaypoints(route.waypoints || []);
      setCruiseSpeed(route.cruiseSpeed || 120);
      setSpeedUnit(route.speedUnit || "knots");
    }
  };

  const saveRoute = () => {
    if (!routeId) return;

    const routeData = {
      id: routeId,
      name: routeName || "Unnamed Route",
      waypoints,
      cruiseSpeed,
      speedUnit,
    };

    const success = routeStorage.saveRoute(routeData);

    if (success) {
      // Show saved indicator
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const exportRoute = () => {
    const routeData = {
      name: routeName,
      waypoints,
      cruiseSpeed,
      speedUnit,
      exported: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(routeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${routeName.replace(/\s+/g, "_")}_route.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importRoute = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        setRouteName(importedData.name || "Imported Route");
        setWaypoints(importedData.waypoints || []);
        setCruiseSpeed(importedData.cruiseSpeed || 120);
        setSpeedUnit(importedData.speedUnit || "knots");
      } catch (error) {
        alert("Error importing route. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleMapClick = (latlng) => {
    const newWaypoint = {
      lat: latlng.lat,
      lng: latlng.lng,
      name: `WPT ${waypoints.length + 1}`,
    };
    setWaypoints([...waypoints, newWaypoint]);
    setWeatherLocation({ lat: latlng.lat, lng: latlng.lng });
    if (waypoints.length === 0) {
      setShowRoutePanel(true);
    }
  };

  const removeWaypoint = (index) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const clearRoute = () => {
    setWaypoints([]);
    setShowRoutePanel(false);
  };

  const updateWaypointPosition = (index, newLat, newLng) => {
    const updatedWaypoints = [...waypoints];
    updatedWaypoints[index] = {
      ...updatedWaypoints[index],
      lat: newLat,
      lng: newLng,
    };
    setWaypoints(updatedWaypoints);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const reorderWaypoints = (startIndex, endIndex) => {
    const result = Array.from(waypoints);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setWaypoints(result);
  };

  // Geospatial helpers moved to `src/utils/geo.ts` (imported above)

  // Calculate route segments with bearing and distance
  const routeSegments = waypoints.slice(0, -1).map((wp, index) => {
    const nextWp = waypoints[index + 1];
    const bearing = geoCalculateBearing(wp.lat, wp.lng, nextWp.lat, nextWp.lng);
    const distance = geoCalculateDistance(wp.lat, wp.lng, nextWp.lat, nextWp.lng);
    const speedInKnots = speedToKnots(cruiseSpeed, speedUnit);

    return {
      from: wp.name,
      to: nextWp.name,
      bearing: bearing.toFixed(1),
      distance: distance.toFixed(1),
      time: ((distance / speedInKnots) * 60).toFixed(1), // Time in minutes
    };
  });

  const totalDistance = routeSegments.reduce(
    (sum, seg) => sum + parseFloat(seg.distance),
    0
  );
  const totalTime = routeSegments.reduce(
    (sum, seg) => sum + parseFloat(seg.time),
    0
  );

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handlePanelsChange = (newLeft, newRight) => {
    // Extract IDs from panel objects
    const leftIds = newLeft.map((panel) => panel.id);
    const rightIds = newRight.map((panel) => panel.id);
    setLeftPanels(leftIds);
    setRightPanels(rightIds);
  };

  const getPanelComponents = () => {
    const panels = {
      routeControl: {
        id: "routeControl",
        component: (
          <RouteControlPanel
            routeName={routeName}
            setRouteName={setRouteName}
            cruiseSpeed={cruiseSpeed}
            setCruiseSpeed={setCruiseSpeed}
            speedUnit={speedUnit}
            setSpeedUnit={setSpeedUnit}
            isEditMode={isEditMode}
            toggleEditMode={toggleEditMode}
            showAirspace={showAirspace}
            setShowAirspace={setShowAirspace}
            exportRoute={exportRoute}
            importRoute={importRoute}
            clearRoute={clearRoute}
            waypoints={waypoints}
            removeWaypoint={removeWaypoint}
            reorderWaypoints={reorderWaypoints}
            fileInputRef={fileInputRef}
          />
        ),
      },
      weather: {
        id: "weather",
        component: (
          <CollapsiblePanel
            title="Weather Forecast"
            icon={CloudSun}
            gradient="from-blue-500 to-cyan-500"
            defaultCollapsed={true}
          >
            <WeatherPanel location={weatherLocation} forecastMode={true} />
          </CollapsiblePanel>
        ),
      },
      routeInfo: {
        id: "routeInfo",
        component:
          waypoints.length > 1 ? (
            <CollapsiblePanel
              title="Route Information"
              icon={Route}
              gradient="from-emerald-500 to-teal-500"
            >
              <RouteStatsCard
                totalDistance={totalDistance}
                totalTime={totalTime}
                cruiseSpeed={cruiseSpeed}
                speedUnit={speedUnit}
                formatTime={formatTime}
              />
              <div className="space-y-3 mt-4 max-h-96 overflow-y-auto custom-scrollbar">
                {routeSegments.map((segment, index) => (
                  <RouteSegmentCard
                    key={index}
                    segment={segment}
                    index={index}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            </CollapsiblePanel>
          ) : null,
      },
    };

    return panels;
  };

  const allPanels = getPanelComponents();
  const leftPanelComponents = leftPanels
    .map((id) => allPanels[id])
    .filter((p) => p?.component);
  const rightPanelComponents = rightPanels
    .map((id) => allPanels[id])
    .filter((p) => p?.component);

  const headerComponent = (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center gap-3">
        <Link to={createPageUrl("home")}>
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <Home className="w-5 h-5" />
          </Button>
        </Link>
        <GradientIcon icon={Plane} size="md" />
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Flight Route Planner</h1>
          <p className="text-xs text-white/70">
            {isEditMode ? "Click to add waypoints" : "Drag to reposition"}
          </p>
        </div>
        {saved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-2 py-1 rounded-lg"
          >
            <Check className="w-3 h-3 text-emerald-400" />
            <span className="text-xs text-emerald-300">Saved</span>
          </motion.div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#7c3aed] to-[#2563eb] animate-gradient-shift">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
      `}</style>

      {/* Map Container */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[MAP_CENTER.lat, MAP_CENTER.lng]}
          zoom={MAP_CENTER.zoom}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapClickHandler
            onMapClick={handleMapClick}
            isEditMode={isEditMode}
          />
          <AirspaceLayer visible={showAirspace} />

          {waypoints.map((wp, index) => (
            <Marker
              key={index}
              position={[wp.lat, wp.lng]}
              icon={waypointIcon}
              draggable={!isEditMode}
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  updateWaypointPosition(index, lat, lng);
                },
              }}
            />
          ))}

          {waypoints.length > 1 && (
            <Polyline
              positions={waypoints.map((wp) => [wp.lat, wp.lng])}
              color="#a78bfa"
              weight={3}
              opacity={0.8}
              dashArray="10, 10"
            />
          )}
        </MapContainer>
      </div>

      {/* Draggable Panel Container */}
      <DraggablePanelContainer
        leftPanels={leftPanelComponents}
        rightPanels={rightPanelComponents}
        onPanelsChange={handlePanelsChange}
        headerComponent={headerComponent}
      />
    </div>
  );
}
