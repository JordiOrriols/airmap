import React from "react";
import { TrendingUp, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatGrid from "./stat-grid";

export default function RouteStatsCard({
  totalDistance,
  totalTime,
  cruiseSpeed,
  speedUnit,
  formatTime,
}) {
  const { t } = useTranslation();

  return (
    <StatGrid
      items={[
        {
          key: "distance",
          icon: TrendingUp,
          label: t("route_stats.total_distance", "Total Distance"),
          value: totalDistance.toFixed(1),
          unitSymbol: "NM",
        },
        {
          key: "time",
          icon: Clock,
          label: t("route_stats.flight_time", "Flight Time"),
          value: formatTime(totalTime),
          additionalInfo: t("route_stats.at_speed", "at {{speed}} {{unit}}", {
            speed: cruiseSpeed,
            unit: speedUnit,
          }),
        },
      ]}
      columns={2}
      compact={false}
    />
  );
}
