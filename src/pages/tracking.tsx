import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Navigation,
  Play,
  Pause,
  Home,
  TrendingUp,
  Plane,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "../utils/index";
import { Link } from "react-router-dom";
import AirspaceLayer from "../components/flight/airspace-layer";
import NextWaypointPanel from "../components/organisms/next-waypoint-panel";
import WeatherPanel from "../components/organisms/weather-panel";
import StatDisplay from "../components/atoms/stat-display";
import GradientIcon from "../components/atoms/gradient-icon";
import GlassCard from "../components/atoms/glass-card";
import { routeStorage } from "../utils/storage";
import TrackingControlPanel from "../components/organisms/tracking-control-panel";
import { calculateDistance as geoCalculateDistance, calculateBearing as geoCalculateBearing } from "../utils/geo";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Aircraft icon
const aircraftIcon = (rotation = 0) =>
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

// Waypoint icons
const passedWaypointIcon = new L.DivIcon({
  className: "custom-waypoint-marker",
  html: `<div style="background: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const activeWaypointIcon = new L.DivIcon({
  className: "custom-waypoint-marker",
  html: `<div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); width: 28px; height: 28px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 16px rgba(0,0,0,0.4); animation: pulse 2s infinite;"></div>
  <style>@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }</style>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const upcomingWaypointIcon = new L.DivIcon({
  className: "custom-waypoint-marker",
  html: `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function FlightTracking() {
  const [route, setRoute] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [currentHeading, setCurrentHeading] = useState(0);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [distanceToNext, setDistanceToNext] = useState(0);
  const [etaToNext, setEtaToNext] = useState(0);
  const [showAirspace, setShowAirspace] = useState(true);
  const [weatherLocation, setWeatherLocation] = useState(null);
  const watchIdRef = useRef(null);
  const lastPositionRef = useRef(null);

  useEffect(() => {
    // Load route from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const routeId = urlParams.get("routeId");

    if (routeId) {
      const foundRoute = routeStorage.getRoute(routeId);
      if (
        foundRoute &&
        foundRoute.waypoints &&
        foundRoute.waypoints.length > 0
      ) {
        setRoute(foundRoute);
      }
    }
  }, []);

  // Geospatial helpers moved to `src/utils/geo.ts` and imported as geoCalculateDistance/geoCalculateBearing

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const {
          latitude,
          longitude,
          speed: gpsSpeed,
          heading,
        } = position.coords;
        const newPosition = { lat: latitude, lng: longitude };

        setCurrentPosition(newPosition);
        setWeatherLocation(newPosition);

        // Calculate heading from movement if GPS heading not available
        if (lastPositionRef.current) {
          const calculatedHeading = geoCalculateBearing(
            lastPositionRef.current.lat,
            lastPositionRef.current.lng,
            latitude,
            longitude
          );
          setCurrentHeading(heading || calculatedHeading);
        } else if (heading) {
          setCurrentHeading(heading);
        }

        lastPositionRef.current = newPosition;

        // Convert speed from m/s to knots (1 m/s = 1.94384 knots)
        const speedInKnots = gpsSpeed ? gpsSpeed * 1.94384 : 0;
        setSpeed(speedInKnots);

        // Check waypoint proximity and update current waypoint
        if (route && route.waypoints[currentWaypointIndex]) {
          const nextWaypoint = route.waypoints[currentWaypointIndex];
          const distance = geoCalculateDistance(
            latitude,
            longitude,
            nextWaypoint.lat,
            nextWaypoint.lng
          );
          setDistanceToNext(distance);

          // Calculate ETA in minutes
          if (speedInKnots > 0) {
            setEtaToNext((distance / speedInKnots) * 60);
          }

          // If within 0.1 NM of waypoint, move to next
          if (
            distance < 0.1 &&
            currentWaypointIndex < route.waypoints.length - 1
          ) {
            setCurrentWaypointIndex(currentWaypointIndex + 1);
          }
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please check your permissions.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const getWaypointIcon = (index) => {
    if (index < currentWaypointIndex) return passedWaypointIcon;
    if (index === currentWaypointIndex) return activeWaypointIcon;
    return upcomingWaypointIcon;
  };

  const formatTime = (minutes) => {
    if (!minutes || minutes === Infinity) return "--";
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!route) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] via-[#7c3aed] to-[#2563eb] flex items-center justify-center">
        <Card className="bg-slate-900/80 backdrop-blur-xl border border-white/30 rounded-3xl p-12 text-center">
          <Plane className="w-16 h-16 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            No Route Selected
          </h2>
          <p className="text-white/70 mb-6">
            Please select a route to start tracking
          </p>
          <Link to={createPageUrl("home")}>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
              Go to Routes
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const mapCenter =
    currentPosition ||
    (route.waypoints[0]
      ? [route.waypoints[0].lat, route.waypoints[0].lng]
      : [41.5209, 2.105]);

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
          center={mapCenter}
          zoom={13}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapController center={currentPosition} />
          <AirspaceLayer visible={showAirspace} />

          {/* Route line */}
          {route.waypoints.length > 1 && (
            <Polyline
              positions={route.waypoints.map((wp) => [wp.lat, wp.lng])}
              color="#a78bfa"
              weight={3}
              opacity={0.6}
              dashArray="10, 10"
            />
          )}

          {/* Waypoints */}
          {route.waypoints.map((wp, index) => (
            <Marker
              key={index}
              position={[wp.lat, wp.lng]}
              icon={getWaypointIcon(index)}
            />
          ))}

          {/* Current position */}
          {currentPosition && (
            <>
              <Marker
                position={[currentPosition.lat, currentPosition.lng]}
                icon={aircraftIcon(currentHeading)}
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

      {/* Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/30 rounded-2xl px-8 py-4 shadow-2xl">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("home")}>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
              >
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <GradientIcon icon={Navigation} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-white">{route.name}</h1>
              <p className="text-sm text-white/70">
                {isTracking ? "Flight in progress" : "Ready to start"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Control Panel (extracted) */}
      <TrackingControlPanel
        isTracking={isTracking}
        startTracking={startTracking}
        stopTracking={stopTracking}
        currentHeading={currentHeading}
        speed={speed}
        showAirspace={showAirspace}
        setShowAirspace={setShowAirspace}
        weatherLocation={weatherLocation}
      />

      {/* Next Waypoint Panel */}
      <AnimatePresence>
        {currentWaypointIndex < route.waypoints.length && (
          <NextWaypointPanel
            waypoint={route.waypoints[currentWaypointIndex]}
            currentIndex={currentWaypointIndex}
            totalWaypoints={route.waypoints.length}
            distanceToNext={distanceToNext}
            etaToNext={etaToNext}
            formatTime={formatTime}
          />
        )}
      </AnimatePresence>

      {/* Completion Message */}
      <AnimatePresence>
        {currentWaypointIndex >= route.waypoints.length && isTracking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-8 shadow-2xl text-center">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plane className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                Flight Complete!
              </h3>
              <p className="text-white/70 mb-6">You've reached all waypoints</p>
              <Button
                onClick={stopTracking}
                className="bg-gradient-to-r from-violet-500 to-purple-500"
              >
                Finish Tracking
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
