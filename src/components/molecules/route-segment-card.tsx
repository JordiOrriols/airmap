import React from "react";
import { motion } from "framer-motion";
import { Navigation, Clock, TrendingUp } from "lucide-react";

export default function RouteSegmentCard({ segment, index, formatTime }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="bg-slate-800/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4 hover:bg-slate-700/60 transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-violet-500 to-purple-500 w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
            <div>
              <p className="text-white font-semibold">{segment.from}</p>
              <p className="text-white/60 text-sm flex items-center gap-1">
                <span>→</span> {segment.to}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-white/30">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Navigation className="w-3 h-3 text-cyan-300" style={{ transform: `rotate(${segment.bearing}deg)` }} />
              <span className="text-xs text-white/80">Heading</span>
            </div>
            <p className="text-white font-bold">{segment.bearing}°</p>
          </div>

          <div>
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-emerald-300" />
              <span className="text-xs text-white/80">Distance</span>
            </div>
            <p className="text-white font-bold">{segment.distance} NM</p>
          </div>

          <div>
            <div className="flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-purple-300" />
              <span className="text-xs text-white/80">Time</span>
            </div>
            <p className="text-white font-bold">{formatTime(parseFloat(segment.time))}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}