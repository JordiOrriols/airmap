import React from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { MapPin, Clock, Trash2, Navigation, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import CardHeader from "./card-header";
import StatGrid from "./stat-grid";
import Badge from "../atoms/badge";

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

  return (
    <Card className="bg-slate-900/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 hover:bg-slate-800/70 hover:scale-105 transition-all duration-300 shadow-xl group">
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

      <div className="space-y-3">
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
    </Card>
  );
}
