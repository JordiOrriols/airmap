import React from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Clock, TrendingUp, CloudSun, Home, Navigation } from "lucide-react";
import GradientIcon from "../atoms/gradient-icon";
import GlassCard from "../atoms/glass-card";
import IconButton from "../atoms/icon-button";
import StatGrid from "../molecules/stat-grid";
import Badge from "../atoms/badge";

type NextWaypointPanelProps = {
  waypoint: { name: string };
  currentIndex: number;
  totalWaypoints: number;
  distanceToNext: number;
  etaToNext: number;
  formatTime: (minutes: number) => string;
  headingToNext: number | null;
  onSwitch?: () => void;
  onHomeClick?: () => void;
};

export default function NextWaypointPanel({
  waypoint,
  currentIndex,
  totalWaypoints,
  distanceToNext,
  etaToNext,
  formatTime,
  headingToNext,
  onSwitch,
  onHomeClick,
}: NextWaypointPanelProps) {
  const { t } = useTranslation();

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <GradientIcon icon={MapPin} gradient="from-orange-500 to-red-500" />
          <h2 className="text-lg font-bold text-app-primary">
            {t("next_waypoint.title", "Next Waypoint")}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {onHomeClick && (
            <IconButton
              icon={Home}
              onClick={onHomeClick}
              ariaLabel={t("tracking.go_home", "Go Home")}
            />
          )}
          {onSwitch && (
            <IconButton
              icon={CloudSun}
              onClick={onSwitch}
              ariaLabel={t("next_waypoint.show_weather", "Show Weather")}
            />
          )}
        </div>
      </div>

      <div className="bg-card-app backdrop-blur-sm border border-app-secondary rounded-xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-app-primary mb-0.5">{waypoint.name}</h3>
            <p className="text-xs text-app-secondary">
              {t("next_waypoint.waypoint_of", {
                index: currentIndex + 1,
                total: totalWaypoints,
              })}
            </p>
          </div>
          <Badge size="md" gradient="from-orange-500 to-red-500">
            {currentIndex + 1}
          </Badge>
        </div>

        <div className="pt-3 border-t border-app-secondary">
          <StatGrid
            items={[
              {
                key: "distance",
                icon: TrendingUp,
                label: t("next_waypoint.distance", "Distance"),
                value: distanceToNext.toFixed(1),
                unitSymbol: "NM",
                iconColor: "text-cyan-300",
              },
              {
                key: "eta",
                icon: Clock,
                label: t("next_waypoint.eta", "ETA"),
                value: formatTime(etaToNext),
                iconColor: "text-purple-300",
              },
              {
                key: "heading",
                icon: Navigation,
                label: t("next_waypoint.heading", "Heading"),
                value: headingToNext !== null ? headingToNext.toFixed(0) : "--",
                unitSymbol: headingToNext !== null ? "°" : undefined,
                iconColor: "text-emerald-300",
              },
            ]}
            columns={3}
          />
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-app-secondary mb-2">
          <span>{t("next_waypoint.progress", "Progress")}</span>
          <span>
            {t("next_waypoint.waypoints_status", {
              current: currentIndex,
              total: totalWaypoints,
            })}
          </span>
        </div>
        <div className="w-full bg-input-app rounded-full h-2 overflow-hidden border border-app-secondary">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500"
            style={{ width: `${(currentIndex / totalWaypoints) * 100}%` }}
          />
        </div>
      </div>
    </GlassCard>
  );
}
