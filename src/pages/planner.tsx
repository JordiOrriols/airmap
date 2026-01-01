import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import MapView from "../components/organisms/map-view";
import L from "leaflet";
import { Button } from "../components/ui/button";
import {
  Plane,
  Home,
  Check,
  CloudSun,
  Route,
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "../utils/index";
import { Link } from "react-router-dom";
import { pointInPolygon } from "../utils/pointInPolygon";
import WeatherPanel from "../components/organisms/weather-panel";
import CollapsiblePanel from "../components/molecules/collapsible-panel";
import RouteStatsCard from "../components/molecules/route-stats-card";
import RouteSegmentCard from "../components/molecules/route-segment-card";
import GradientIcon from "../components/atoms/gradient-icon";
import ThemeToggle from "../components/atoms/theme-toggle";
import { routeStorage } from "../utils/storage";
import { MAP_CENTER } from "@/utils/constants";
import RouteControlPanel from "../components/organisms/route-control-panel";
import {
  calculateBearing as geoCalculateBearing,
  calculateDistance as geoCalculateDistance,
  speedToKnots,
} from "../utils/geo";
import { useAirspaces, processAirspaceForPIP } from "../api/openaip";
import type { RouteData, SpeedUnit, Waypoint } from "../types";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom waypoint icon (kept for passing to MapView)
const waypointIcon = new L.DivIcon({
  className: "custom-waypoint-marker",
  html: `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function FlightPlanner() {
  const [routeId, setRouteId] = useState<string | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [cruiseSpeed, setCruiseSpeed] = useState<number>(120); // Default cruise speed
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>("knots"); // "knots" or "kmh"
  const [routeName, setRouteName] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(true); // Start in edit mode
  const [saved, setSaved] = useState<boolean>(false);
  const [showAirspace, setShowAirspace] = useState<boolean>(false);
  const [airspaceReloadTrigger, setAirspaceReloadTrigger] = useState<number>(0);
  const [waypointVfrs, setWaypointVfrs] = useState<(string | null)[]>([]);
  const [weatherLocation, setWeatherLocation] = useState<{ lat: number; lng: number }>(
    {
      lat: MAP_CENTER.lat,
      lng: MAP_CENTER.lng,
    }
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Get route ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("routeId");

    if (id) {
      setRouteId(id);
      loadRoute(id);
    }
  }, []);

  const { t } = useTranslation();

  // Auto-save route when data changes
  useEffect(() => {
    if (!routeId) return;

    const timer = setTimeout(() => {
      saveRoute();
    }, 1000); // Auto-save after 1 second of no changes

    return () => clearTimeout(timer);
  }, [waypoints, cruiseSpeed, speedUnit, routeName, routeId]);

  const loadRoute = (id: string) => {
    const route = routeStorage.getRoute(id) as RouteData | undefined;
    if (route) {
      setRouteName(route.name);
      setWaypoints(route.waypoints || []);
      setCruiseSpeed(route.cruiseSpeed || 120);
      setSpeedUnit((route.speedUnit as SpeedUnit) || "knots");
    }
  };

  const saveRoute = () => {
    if (!routeId) return;

    const routeData: RouteData = {
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

  const importRoute = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const result = e.target?.result;
        if (typeof result !== "string") return;

        const importedData = JSON.parse(result) as Partial<RouteData> & {
          waypoints?: Waypoint[];
        };
        setRouteName(importedData.name || t("route.imported_name", "Imported Route"));
        setWaypoints(importedData.waypoints || []);
        setCruiseSpeed(importedData.cruiseSpeed || 120);
        setSpeedUnit((importedData.speedUnit as SpeedUnit) || "knots");
      } catch (error) {
        alert(t("planner.import_error", "Error importing route. Please check the file format."));
      }
    };
    reader.readAsText(file);
  };

  const handleMapClick = (latlng: L.LatLng) => {
    const newWaypoint = {
      lat: latlng.lat,
      lng: latlng.lng,
      name: `WPT ${waypoints.length + 1}`,
    };
    setWaypoints([...waypoints, newWaypoint]);
    setWeatherLocation({ lat: latlng.lat, lng: latlng.lng });
  };

  const removeWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const clearRoute = () => {
    setWaypoints([]);
  };

  const updateWaypointPosition = (index: number, newLat: number, newLng: number) => {
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

  const reloadAirspace = () => {
    // Trigger airspace reload by incrementing the trigger counter
    setAirspaceReloadTrigger((prev) => prev + 1);
  };

  // Compute bounding box from waypoints
  const waypointsBbox = React.useMemo(() => {
    if (!waypoints || waypoints.length === 0) return "";

    let minLat = 90,
      maxLat = -90,
      minLng = 180,
      maxLng = -180;
    waypoints.forEach((w) => {
      if (w.lat < minLat) minLat = w.lat;
      if (w.lat > maxLat) maxLat = w.lat;
      if (w.lng < minLng) minLng = w.lng;
      if (w.lng > maxLng) maxLng = w.lng;
    });

    const buffer = 0.1; // ~11km buffer
    const north = Math.min(maxLat + buffer, 90);
    const south = Math.max(minLat - buffer, -90);
    const east = Math.min(maxLng + buffer, 180);
    const west = Math.max(minLng - buffer, -180);

    return `${west},${south},${east},${north}`;
  }, [waypoints]);

  // Fetch airspaces using react-query
  const { data: airspacesData } = useAirspaces(waypointsBbox, showAirspace && waypoints.length > 0);

  // Compute per-waypoint VFR upper limits
  useEffect(() => {
    if (!waypoints || waypoints.length === 0) {
      setWaypointVfrs([]);
      return;
    }

    if (!airspacesData) {
      setWaypointVfrs(waypoints.map(() => null));
      return;
    }

    try {
      // Process airspaces for point-in-polygon checks
      const processed = processAirspaceForPIP(airspacesData);

      // For each waypoint, find airspaces that contain it and pick minimal vfrUpperFeet
      const vfrs = waypoints.map((wp) => {
        const matches = processed
          .filter((as) => as.polygon && pointInPolygon(wp.lat, wp.lng, as.polygon))
          .map((as) => as.vfrUpperFeet)
          .filter((v) => v !== null && v !== undefined);

        if (matches.length === 0) return null;
        const minFeet = Math.min(...matches);
        return `${minFeet} ft`;
      });

      setWaypointVfrs(vfrs);
    } catch (error) {
      console.error("Error computing waypoint VFRs:", error);
      setWaypointVfrs(waypoints.map(() => null));
    }
  }, [waypoints, airspacesData, airspaceReloadTrigger, showAirspace]);

  const reorderWaypoints = (startIndex: number, endIndex: number) => {
    const result = Array.from(waypoints);
    const [removed] = result.splice(startIndex, 1);
    if (!removed) return;
    result.splice(endIndex, 0, removed);
    setWaypoints(result);
  };

  // Geospatial helpers moved to `src/utils/geo.ts` (imported above)

  // Calculate route segments with bearing and distance
  const routeSegments = waypoints
    .slice(0, -1)
    .map((wp, index) => {
      const nextWp = waypoints[index + 1];
      if (!nextWp) return null;

      const bearing = geoCalculateBearing(wp.lat, wp.lng, nextWp.lat, nextWp.lng);
      const distance = geoCalculateDistance(wp.lat, wp.lng, nextWp.lat, nextWp.lng);
      const speedInKnots = speedToKnots(cruiseSpeed, speedUnit);
      return {
        from: wp.name,
        to: nextWp.name,
        bearing: bearing.toFixed(1),
        distance: distance.toFixed(1),
        time: ((distance / speedInKnots) * 60).toFixed(1), // Time in minutes
        vfrFrom: waypointVfrs[index] || null,
        vfrTo: waypointVfrs[index + 1] || null,
      };
    })
    .filter(Boolean) as {
      from: string;
      to: string;
      bearing: string;
      distance: string;
      time: string;
      vfrFrom: string | null;
      vfrTo: string | null;
    }[];

  const totalDistance = routeSegments.reduce((sum, seg) => sum + parseFloat(seg.distance), 0);
  const totalTime = routeSegments.reduce((sum, seg) => sum + parseFloat(seg.time), 0);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const headerComponent = (
    <div className="bg-header backdrop-blur-xl border border-app-secondary rounded-2xl p-4 shadow-card">
      <div className="flex items-center gap-3">
        <Link to={createPageUrl("home")}>
          <Button
            variant="ghost"
            size="icon"
            className="text-header-secondary hover:text-header hover:bg-button-ghost rounded-xl"
          >
            <Home className="w-5 h-5" />
          </Button>
        </Link>
        <GradientIcon icon={Plane} size="md" />
        <div className="flex-1">
          <h1 className="text-xl font-bold text-header">
            {t("planner.header.title", "Flight Route Planner")}
          </h1>
          <p className="text-xs text-header-secondary">
            {isEditMode
              ? t("planner.header.mode_edit", "Click to add waypoints")
              : t("planner.header.mode_move", "Drag to reposition")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
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
      <MapView
        center={MAP_CENTER}
        zoom={MAP_CENTER.zoom}
        waypoints={waypoints}
        currentPosition={null}
        showAirspace={showAirspace}
        airspaceReloadTrigger={airspaceReloadTrigger}
        showWaypoints={true}
        showAircraft={false}
        showPolyline={waypoints.length > 1}
        interactive={true}
        allowMapClick={isEditMode}
        onMapClick={(latlng) => handleMapClick(latlng)}
        onMarkerDrag={(index, lat, lng) => updateWaypointPosition(index, lat, lng)}
        waypointIcon={waypointIcon}
      />

      {/* Simple left sidebar with collapsible panels */}
      <div className="space-y-4 overflow-y-auto absolute left-0 top-0 bottom-0 p-6 z-20 w-120">
        {headerComponent}
        {/* Route Control */}
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
          reloadAirspace={reloadAirspace}
        />

        <CollapsiblePanel
          title={t("planner.route_control.weather_title", "Weather Forecast")}
          icon={CloudSun}
          gradient="from-blue-500 to-cyan-500"
          defaultCollapsed={true}
        >
          <WeatherPanel location={weatherLocation} forecastMode={true} />
        </CollapsiblePanel>

        {waypoints.length > 1 ? (
          <CollapsiblePanel
            title={t("planner.route_info.title", "Route Information")}
            icon={Route}
            gradient="from-emerald-500 to-teal-500"
            defaultCollapsed={true}
          >
            <RouteStatsCard
              totalDistance={totalDistance}
              totalTime={totalTime}
              cruiseSpeed={cruiseSpeed}
              speedUnit={speedUnit}
              formatTime={formatTime}
            />
            <div className="space-y-3 mt-4">
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
        ) : null}
      </div>
    </div>
  );
}
