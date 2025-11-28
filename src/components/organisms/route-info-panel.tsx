import React from "react";
import { Route } from "lucide-react";
import GradientIcon from "../atoms/gradient-icon";
import RouteStatsCard from "../molecules/route-stats-card";
import RouteSegmentCard from "../molecules/route-segment-card";

export default function RouteInfoPanel({ 
  waypoints, 
  routeSegments, 
  totalDistance, 
  totalTime, 
  cruiseSpeed, 
  speedUnit 
}) {
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="h-full bg-slate-900/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <GradientIcon icon={Route} gradient="from-emerald-500 to-teal-500" />
            <h2 className="text-xl font-bold text-white">Route Information</h2>
          </div>

          <RouteStatsCard
            totalDistance={totalDistance}
            totalTime={totalTime}
            cruiseSpeed={cruiseSpeed}
            speedUnit={speedUnit}
            formatTime={formatTime}
          />
        </div>

        {/* Scrollable Segments */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {routeSegments.map((segment, index) => (
            <RouteSegmentCard
              key={index}
              segment={segment}
              index={index}
              formatTime={formatTime}
            />
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
  );
}