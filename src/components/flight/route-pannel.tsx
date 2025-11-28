import React from "react";
import { motion } from "framer-motion";
import { Navigation, Clock, Route, TrendingUp } from "lucide-react";

export default function RoutePanel({ waypoints, routeSegments, totalDistance, totalTime, cruiseSpeed, speedUnit }) {
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", damping: 25 }}
      className="absolute right-6 top-32 bottom-6 z-10 w-[420px] overflow-hidden"
    >
      <div className="h-full bg-slate-900/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl">
              <Route className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Route Information</h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-cyan-300" />
                <span className="text-xs text-white/90 font-medium">Total Distance</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalDistance.toFixed(1)}</p>
              <p className="text-xs text-white/70">nautical miles</p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-purple-300" />
                <span className="text-xs text-white/90 font-medium">Flight Time</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatTime(totalTime)}</p>
              <p className="text-xs text-white/70">at {cruiseSpeed} {speedUnit}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Segments */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {routeSegments.map((segment, index) => (
            <motion.div
              key={index}
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
          ))}
        </div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }
        `}</style>
      </div>
    </motion.div>
  );
}