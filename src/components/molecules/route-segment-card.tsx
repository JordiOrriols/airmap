import React from "react";
import { motion } from "framer-motion";
import { Navigation, Clock, TrendingUp } from "lucide-react";
import StatDisplay from "../atoms/stat-display";
import { useTranslation } from "react-i18next";
import Badge from "../atoms/badge";
import { Card } from "../ui/card";

export default function RouteSegmentCard({ segment, index, formatTime }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-4 hover:shadow-md transition-all duration-300 gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Badge size="md" gradient="from-violet-500 to-purple-500">
              {index + 1}
            </Badge>
            <div>
              <p className="text-app-primary font-semibold">{segment.from}</p>
              <p className="text-app-secondary text-sm flex items-center gap-1">
                <span>→</span> {segment.to}
              </p>
              {segment.vfrTo !== undefined && (
                <p className="text-amber-300 text-xs mt-1">VFR @ dest: {segment.vfrTo || t("airspace.na", "N/A")}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-app-secondary">
          <StatDisplay
            icon={Navigation}
            label={t("stat.heading", "Heading")}
            value={`${segment.bearing}°`}
            iconColor="text-cyan-300"
            size="compact"
          />

          <StatDisplay
            icon={TrendingUp}
            label={t("stat.distance", "Distance")}
            value={`${segment.distance} ${t("unit.nm", "NM")}`}
            iconColor="text-emerald-300"
            size="compact"
          />

          <StatDisplay
            icon={Clock}
            label={t("stat.time", "Time")}
            value={formatTime(parseFloat(segment.time))}
            iconColor="text-purple-300"
            size="compact"
          />
        </div>
      </Card>
    </motion.div>
  );
}
