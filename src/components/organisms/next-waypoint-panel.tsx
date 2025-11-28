import React from "react";
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
  formatTime 
}) {
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
          <h2 className="text-xl font-bold text-white">Next Waypoint</h2>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm border border-white/30 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {waypoint.name}
              </h3>
              <p className="text-sm text-white/60">
                Waypoint {currentIndex + 1} of {totalWaypoints}
              </p>
            </div>
            <Badge size="lg" gradient="from-orange-500 to-red-500">{currentIndex + 1}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/30">
            <InfoTile
              title="Distance"
              icon={<TrendingUp className="w-3 h-3 text-cyan-300" />}
              value={<span className="text-xl font-bold text-white">{distanceToNext.toFixed(1)} NM</span>}
            />

            <InfoTile
              title="ETA"
              icon={<Clock className="w-3 h-3 text-purple-300" />}
              value={<span className="text-xl font-bold text-white">{formatTime(etaToNext)}</span>}
            />
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-white/70 mb-2">
            <span>Progress</span>
            <span>{currentIndex}/{totalWaypoints} waypoints</span>
          </div>
          <div className="w-full bg-slate-800/60 rounded-full h-3 overflow-hidden border border-white/30">
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