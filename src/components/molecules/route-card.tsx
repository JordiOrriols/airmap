import React from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Trash2, Navigation, Edit, Route, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import Badge from "../atoms/badge";
import MapView from "../organisms/map-view";
import { getMapCenterAndZoom, calculateRouteStats } from "../../utils/geo";

export default function RouteCard({
  route,
  index,
  onDelete,
  startHref,
  editHref,
}) {
  const { t } = useTranslation();

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const { center, zoom: mapZoom } = getMapCenterAndZoom(route.waypoints);
  const { totalDistance, totalTime } = calculateRouteStats(
    route.waypoints,
    route.cruiseSpeed,
    route.speedUnit
  );

  return (
    <Card className="bg-slate-900/70 backdrop-blur-xl border border-white/30 rounded-3xl overflow-hidden hover:bg-slate-800/70 hover:scale-105 transition-all duration-300 shadow-xl group">
      {/* Map Preview */}
      <div className="h-40 relative">
        <MapView
          center={center}
          zoom={mapZoom}
          waypoints={route.waypoints || []}
          currentPosition={null}
          showAirspace={false}
          showWaypoints={true}
          showAircraft={false}
          showPolyline={true}
          interactive={false}
          tileUrl="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          tileAttribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {(!route.waypoints || route.waypoints.length === 0) && (
          <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white/60 text-sm">{t("route.no_waypoints", "No waypoints")}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
            {route.name}
          </h3>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => onDelete(route.id, e)}
            className="text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-xl -mt-1"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-800/60 backdrop-blur-sm border border-white/30 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Route className="w-3.5 h-3.5 text-cyan-300" />
              <span className="text-xs text-white/70">
                {t("route_stats.total_distance", "Distance")}
              </span>
            </div>
            <p className="text-lg font-bold text-white">
              {totalDistance.toFixed(1)}
            </p>
            <p className="text-xs text-white/60">
              {t("route_stats.nautical_miles", "NM")}
            </p>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm border border-white/30 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Timer className="w-3.5 h-3.5 text-purple-300" />
              <span className="text-xs text-white/70">
                {t("route_stats.flight_time", "Time")}
              </span>
            </div>
            <p className="text-lg font-bold text-white">
              {formatTime(totalTime)}
            </p>
            <p className="text-xs text-white/60">
              {route.cruiseSpeed} {route.speedUnit}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
          <Link to={startHref}>
            <Button
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm mb-2"
              disabled={!route.waypoints || route.waypoints.length === 0}
            >
              <Navigation className="w-4 h-4 mr-2" />
              {t("route.start_flight", "Start Flight")}
            </Button>
          </Link>
          <Link to={editHref}>
            <Button
              variant="outline"
              className="w-full bg-slate-800/60 border-white/30 text-white hover:bg-slate-700/60 text-sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              {t("route.edit_route", "Edit Route")}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
