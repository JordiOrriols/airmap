import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import MapView from "../components/organisms/map-view";
import L from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Navigation, Home, Plane } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "../utils/index";
import { Link } from "react-router-dom";
import NextWaypointPanel from "../components/organisms/next-waypoint-panel";
import GradientIcon from "../components/atoms/gradient-icon";
import { routeStorage } from "../utils/storage";
import GlassCard from "../components/atoms/glass-card";
import WeatherPanel from "../components/organisms/weather-panel";
import { CloudSun, MapPin } from "lucide-react";
import IconButton from "../components/atoms/icon-button";
import {
  calculateDistance as geoCalculateDistance,
  calculateBearing as geoCalculateBearing,
} from "../utils/geo";
import type { RouteData } from "../types";

type LatLng = { lat: number; lng: number };

// Fix for default marker icon
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
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

// MapController removed; centering handled by `MapView` component

export default function FlightTracking() {
  const { t } = useTranslation();
  const [route, setRoute] = useState<RouteData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isAcquiring, setIsAcquiring] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [currentHeading, setCurrentHeading] = useState(0);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [distanceToNext, setDistanceToNext] = useState(0);
  const [etaToNext, setEtaToNext] = useState(0);
  const [headingToNext, setHeadingToNext] = useState<number | null>(null);
  const [weatherLocation, setWeatherLocation] = useState<LatLng | null>(null);
  const [activePanel, setActivePanel] = useState<"next" | "weather">("next");
  const watchIdRef = useRef<number | null>(null);
  const lastPositionRef = useRef<LatLng | null>(null);

  useEffect(() => {
    // Load route from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const routeId = urlParams.get("routeId");

    if (routeId) {
      const foundRoute = routeStorage.getRoute(routeId) as RouteData | undefined;
      if (foundRoute && foundRoute.waypoints && foundRoute.waypoints.length > 0) {
        setRoute(foundRoute);
      }
    }
  }, []);

  // Geospatial helpers moved to `src/utils/geo.ts` and imported as geoCalculateDistance/geoCalculateBearing
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      alert(t("tracking.geolocation_unsupported", "Geolocation is not supported by your browser"));
      return;
    }

    setIsTracking(true);
    setIsAcquiring(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed: gpsSpeed, heading } = position.coords;
        const newPosition: LatLng = { lat: latitude, lng: longitude };

        setCurrentPosition(newPosition);
        setIsAcquiring(false);
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

          const bearingToNext = geoCalculateBearing(
            latitude,
            longitude,
            nextWaypoint.lat,
            nextWaypoint.lng
          );
          setHeadingToNext(bearingToNext);

          // Calculate ETA in minutes
          if (speedInKnots > 0) {
            setEtaToNext((distance / speedInKnots) * 60);
          }

          // If within 0.1 NM of waypoint, move to next
          if (distance < 0.1 && currentWaypointIndex < route.waypoints.length - 1) {
            setCurrentWaypointIndex(currentWaypointIndex + 1);
          }
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsAcquiring(false);
        alert(
          t(
            "tracking.unable_get_location",
            "Unable to get your location. Please check your permissions."
          )
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
  }, [t, route, currentWaypointIndex]);

  // Auto-start tracking once a route is loaded
  useEffect(() => {
    if (route && !isTracking) {
      startTracking();
    }
  }, [route, isTracking, startTracking]);

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setIsAcquiring(false);
  };

  // Fallback heading when we don't have a GPS fix yet
  useEffect(() => {
    if (!route) return;
    const nextWaypoint = route.waypoints[currentWaypointIndex];
    if (!nextWaypoint) return;

    if (!currentPosition) {
      const from = route.waypoints[Math.max(0, currentWaypointIndex - 1)] ?? nextWaypoint;
      const bearing = geoCalculateBearing(from.lat, from.lng, nextWaypoint.lat, nextWaypoint.lng);
      setHeadingToNext(bearing);
    }
  }, [route, currentWaypointIndex, currentPosition]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const formatTime = (minutes) => {
    if (!minutes || minutes === Infinity) return "--";
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!route) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] via-[#7c3aed] to-[#2563eb] flex items-center justify-center">
        <Card className="bg-header backdrop-blur-xl border border-app-secondary rounded-3xl p-12 text-center">
          <Plane className="w-16 h-16 text-header mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-header mb-2">
            {t("tracking.no_route.title", "No Route Selected")}
          </h2>
          <p className="text-header-secondary mb-6">
            {t("tracking.no_route.desc", "Please select a route to start tracking")}
          </p>
          <Link to={createPageUrl("home")}>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
              {t("tracking.go_to_routes", "Go to Routes")}
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const mapCenter: [number, number] = currentPosition
    ? [currentPosition.lat, currentPosition.lng]
    : route?.waypoints[0]
      ? [route.waypoints[0].lat, route.waypoints[0].lng]
      : [41.5209, 2.105];

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
        <MapContainer center={mapCenter} zoom={13} className="w-full h-full" zoomControl={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
        </MapContainer>
      </div>

      <MapView
        center={mapCenter}
        zoom={13}
        waypoints={route.waypoints}
        currentPosition={currentPosition}
        currentHeading={currentHeading}
        showAirspace={true}
        showWaypoints={true}
        showAircraft={true}
        showPolyline={route.waypoints.length > 1}
        interactive={true}
        aircraftIcon={aircraftIcon}
        currentWaypointIndex={currentWaypointIndex}
      />

      {/* Status / Panels */}
      <div className="absolute bottom-6 left-6 z-20 w-[50vw] max-w-[520px] min-w-[280px]">
        {isAcquiring ? (
          <GlassCard className="p-5 flex items-center justify-center gap-2 text-app-secondary text-sm">
            <span className="inline-block h-5 w-5 rounded-full border-2 border-app-secondary border-t-transparent animate-spin"></span>
            {t("tracking.requesting_location", "Requesting location...")}
          </GlassCard>
        ) : (
          <GlassCard className="p-4">
            {activePanel === "next" && currentWaypointIndex < route.waypoints.length && (
              <NextWaypointPanel
                waypoint={route.waypoints[currentWaypointIndex]!}
                currentIndex={currentWaypointIndex}
                totalWaypoints={route.waypoints.length}
                distanceToNext={distanceToNext}
                etaToNext={etaToNext}
                formatTime={formatTime}
                headingToNext={headingToNext}
                onSwitch={() => setActivePanel("weather")}
                onHomeClick={() => (window.location.href = createPageUrl("home"))}
              />
            )}

            {activePanel === "weather" && weatherLocation && (
              <GlassCard className="p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <GradientIcon icon={CloudSun} gradient="from-blue-400 to-cyan-400" />
                    <h2 className="text-lg font-bold text-app-primary">
                      {t("tracking.weather", "Weather")}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconButton
                      icon={Home}
                      onClick={() => (window.location.href = createPageUrl("home"))}
                      ariaLabel={t("tracking.go_home", "Go Home")}
                    />
                    <IconButton
                      icon={MapPin}
                      onClick={() => setActivePanel("next")}
                      ariaLabel={t("tracking.show_next", "Show Next Waypoint")}
                    />
                  </div>
                </div>
                <WeatherPanel location={weatherLocation} forecastMode={false} compact={true} />
              </GlassCard>
            )}
          </GlassCard>
        )}
      </div>

      {/* Completion Message */}
      <AnimatePresence>
        {currentWaypointIndex >= route.waypoints.length && isTracking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="bg-header backdrop-blur-xl border border-app-secondary rounded-3xl px-12 py-8 shadow-card text-center">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plane className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-header mb-2">Flight Complete!</h3>
              <p className="text-header-secondary mb-6">You&apos;ve reached all waypoints</p>
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
