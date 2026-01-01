import React from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { MapPin, Clock, Trash2, Navigation, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import CardHeader from "./card-header";
import StatGrid from "./stat-grid";
import Badge from "../atoms/badge";
import MapView from "../organisms/map-view";
import { getMapCenterAndZoom } from "../../utils/geo";

export default function RouteCard({
  route,
  index,
  onDelete,
  startHref,
  editHref,
}) {
  const { t } = useTranslation();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const { center, zoom: mapZoom } = getMapCenterAndZoom(route.waypoints);

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

      <div className="p-6 pt-0">
        <CardHeader
          title={
            <span className="group-hover:text-cyan-300 transition-colors">
              {route.name}
            </span>
          }
          subtitle={
            <span>{t("route.updated", { date: formatDate(route.updated) })}</span>
          }
          actions={
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => onDelete(route.id, e)}
              className="text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-xl"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          }
        />

        <div className="space-y-3 mt-4">
        <div className="flex items-center gap-3 text-white/80">
          <Badge className="p-2" gradient="from-pink-500 to-purple-500">
            <MapPin className="w-4 h-4 text-white" />
          </Badge>
          <span className="text-sm">
            {t("planner.route_info.waypoints", {
              count: route.waypoints?.length || 0,
            })}
          </span>
        </div>

        <div className="flex items-center gap-3 text-white/80">
          <Badge className="p-2" gradient="from-cyan-500 to-blue-500">
            <Clock className="w-4 h-4 text-white" />
          </Badge>
          <span className="text-sm">
            {route.cruiseSpeed} {route.speedUnit}
          </span>
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
