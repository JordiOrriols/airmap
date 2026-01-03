import React from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Navigation, Route, Timer, Edit, Trash2, Download } from "lucide-react";
import { Link } from "react-router-dom";
import MapView from "../organisms/map-view";
import { getMapCenterAndZoom, calculateRouteStats } from "../../utils/geo";
import RouteActionsMenu from "./route-actions-menu";
import StatGrid from "./stat-grid";
import type { RouteData } from "../../types";

type RouteCardProps = {
  route: RouteData;
  onDelete: (routeId: string, e: React.MouseEvent) => void;
  startHref: string;
  editHref: string;
};

export default function RouteCard({ route, onDelete, startHref, editHref }: RouteCardProps) {
  const { t } = useTranslation();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const { center, zoom: mapZoom } = getMapCenterAndZoom(route.waypoints);
  const mapCenter = center ?? { lat: 41.5209, lng: 2.105 };
  const { totalDistance, totalTime } = calculateRouteStats(
    route.waypoints,
    route.cruiseSpeed,
    route.speedUnit
  );

  const handleExport = (_: unknown, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const data = {
      name: route.name,
      waypoints: route.waypoints,
      cruiseSpeed: route.cruiseSpeed,
      speedUnit: route.speedUnit,
      exported: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${route.name.replace(/\s+/g, "_") || "route"}_route.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const actions = [
    {
      label: t("route.edit_route", "Edit Route"),
      icon: Edit,
      href: editHref,
    },
    {
      label: t("route.export_route", "Export"),
      icon: Download,
      onSelect: handleExport,
    },
    {
      label: t("route.delete_route", "Remove"),
      icon: Trash2,
      variant: "danger" as const,
      onSelect: (_route, e: React.MouseEvent) => onDelete(route.id, e),
    },
  ];

  return (
    <Card className="bg-card-app hover:bg-card-hover backdrop-blur-md border border-app-secondary rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-card group">
      {/* Map Preview */}
      <div className="h-40 relative">
        <MapView
          center={mapCenter}
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
          <div className="absolute inset-0 bg-card-app/80 flex items-center justify-center backdrop-blur-sm">
            <span className="text-app-secondary text-sm">
              {t("route.no_waypoints", "No waypoints")}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 pt-0">
        <div className="flex items-start justify-between mb-4 relative">
          <h3 className="text-lg font-bold text-app-primary group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
            {route.name}
          </h3>
          <RouteActionsMenu route={route} actions={actions} />
        </div>

        <StatGrid
          className="mb-4"
          items={[
            {
              key: "distance",
              icon: Route,
              label: t("route_stats.total_distance", "Distance"),
              value: totalDistance.toFixed(1),
              unitSymbol: "NM",
              additionalInfo: t("route.waypoints_count", "{{count}} waypoints", {
                count: route.waypoints.length,
              }),
              iconColor: "text-stat-distance-icon",
            },
            {
              key: "time",
              icon: Timer,
              label: t("route_stats.flight_time", "Time"),
              value: formatTime(totalTime),
              additionalInfo: `${route.cruiseSpeed} ${route.speedUnit}`,
              iconColor: "text-stat-time-icon",
            },
          ]}
          columns={2}
          compact={false}
        />

        <div className="mt-4 pt-4 border-t border-app-primary space-y-2">
          <Link to={startHref}>
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm shadow-md hover:shadow-lg"
              disabled={!route.waypoints || route.waypoints.length === 0}
            >
              <Navigation className="w-4 h-4 mr-2" />
              {t("route.start_flight", "Start Flight")}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
