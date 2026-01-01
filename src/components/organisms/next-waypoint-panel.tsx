import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Clock, TrendingUp } from "lucide-react";
import GradientIcon from "../atoms/gradient-icon";
import GlassCard from "../atoms/glass-card";
import InfoTile from "../atoms/info-tile";
import Badge from "../atoms/badge";

export default function NextWaypointPanel({
  waypoint,
  currentIndex,
  totalWaypoints,
  distanceToNext,
  etaToNext,
  formatTime,
}) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="absolute right-6 top-32 z-10 w-96"
    >
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <GradientIcon icon={MapPin} gradient="from-orange-500 to-red-500" />
          <h2 className="text-xl font-bold text-app-primary">
            {t("next_waypoint.title", "Next Waypoint")}
          </h2>
        </div>

        <div className="bg-card-app backdrop-blur-sm border border-app-secondary rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-app-primary mb-1">
                {waypoint.name}
              </h3>
              <p className="text-sm text-app-secondary">
                {t("next_waypoint.waypoint_of", {
                  index: currentIndex + 1,
                  total: totalWaypoints,
                })}
              </p>
            </div>
            <Badge size="lg" gradient="from-orange-500 to-red-500">
              {currentIndex + 1}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-app-secondary">
            <InfoTile
              title={t("next_waypoint.distance", "Distance")}
              icon={<TrendingUp className="w-3 h-3 text-cyan-300" />}
              value={
                <span className="text-xl font-bold text-app-primary">
                  {distanceToNext.toFixed(1)} {t("unit.nm", "NM")}
                </span>
              }
            />

            <InfoTile
              title={t("next_waypoint.eta", "ETA")}
              icon={<Clock className="w-3 h-3 text-purple-300" />}
              value={
                <span className="text-xl font-bold text-app-primary">
                  {formatTime(etaToNext)}
                </span>
              }
            />
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-app-secondary mb-2">
            <span>{t("next_waypoint.progress", "Progress")}</span>
            <span>
              {t("next_waypoint.waypoints_status", {
                current: currentIndex,
                total: totalWaypoints,
              })}
            </span>
          </div>
          <div className="w-full bg-input-app rounded-full h-3 overflow-hidden border border-app-secondary">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500"
              style={{ width: `${(currentIndex / totalWaypoints) * 100}%` }}
            />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
