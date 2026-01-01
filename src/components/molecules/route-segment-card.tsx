import React from "react";
import { motion } from "framer-motion";
import { Navigation, Clock, TrendingUp } from "lucide-react";
import InfoTile from "../atoms/info-tile";
import { useTranslation } from "react-i18next";
import Badge from "../atoms/badge";

export default function RouteSegmentCard({ segment, index, formatTime }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="bg-card-app backdrop-blur-sm border border-app-secondary rounded-2xl p-4 hover:bg-card-hover transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
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

        <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-app-secondary">
          <InfoTile
            title={t("stat.heading", "Heading")}
            icon={
              <Navigation
                className="w-3 h-3 text-cyan-300"
                style={{ transform: `rotate(${segment.bearing}deg)` }}
              />
            }
            value={<>{segment.bearing}°</>}
          />

          <InfoTile
            title={t("stat.distance", "Distance")}
            icon={<TrendingUp className="w-3 h-3 text-emerald-300" />}
            value={
              <>
                {segment.distance} {t("unit.nm", "NM")}
              </>
            }
          />

          <InfoTile
            title={t("stat.time", "Time")}
            icon={<Clock className="w-3 h-3 text-purple-300" />}
            value={<>{formatTime(parseFloat(segment.time))}</>}
          />
        </div>
      </div>
    </motion.div>
  );
}
