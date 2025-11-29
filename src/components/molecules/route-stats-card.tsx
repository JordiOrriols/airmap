import React from "react";
import { TrendingUp, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function RouteStatsCard({
  totalDistance,
  totalTime,
  cruiseSpeed,
  speedUnit,
  formatTime,
}) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-800/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-cyan-300" />
          <span className="text-xs text-white/90 font-medium">
            {t("route_stats.total_distance", "Total Distance")}
          </span>
        </div>
        <p className="text-2xl font-bold text-white">
          {totalDistance.toFixed(1)}
        </p>
        <p className="text-xs text-white/70">
          {t("route_stats.nautical_miles", "nautical miles")}
        </p>
      </div>

      <div className="bg-slate-800/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-purple-300" />
          <span className="text-xs text-white/90 font-medium">
            {t("route_stats.flight_time", "Flight Time")}
          </span>
        </div>
        <p className="text-2xl font-bold text-white">{formatTime(totalTime)}</p>
        <p className="text-xs text-white/70">
          {t("route_stats.at_speed", "at {{speed}} {{unit}}", {
            speed: cruiseSpeed,
            unit: speedUnit,
          })}
        </p>
      </div>
    </div>
  );
}
