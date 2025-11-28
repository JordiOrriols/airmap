import React from "react";
import GlassCard from "../atoms/glass-card";
import { Button } from "../ui/button";
import StatDisplay from "../atoms/stat-display";
import { Navigation, TrendingUp, Eye, EyeOff } from "lucide-react";
import WeatherPanel from "./weather-panel";

type Props = {
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  currentHeading: number;
  speed: number;
  showAirspace: boolean;
  setShowAirspace: (v: boolean) => void;
  weatherLocation: { lat: number; lng: number } | null;
};

export default function TrackingControlPanel({ isTracking, startTracking, stopTracking, currentHeading, speed, showAirspace, setShowAirspace, weatherLocation }: Props) {
  return (
    <div>
      <div className="absolute left-6 top-32 z-10 w-80">
        <GlassCard className="p-6 space-y-4">
          <Button onClick={isTracking ? stopTracking : startTracking} className={`w-full h-14 text-lg ${isTracking ? "bg-red-500 hover:bg-red-600" : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"}`}>
            {isTracking ? (<><span className="mr-2">■</span>Stop Tracking</>) : (<><span className="mr-2">▶</span>Start Tracking</>)}
          </Button>

          <div className="space-y-3">
            <StatDisplay icon={Navigation} label="Current Heading" value={`${currentHeading.toFixed(0)}°`} iconColor="text-cyan-300" />
            <StatDisplay icon={TrendingUp} label="Ground Speed" value={speed.toFixed(1)} unit="knots" iconColor="text-purple-300" />
          </div>

          <Button onClick={() => setShowAirspace(!showAirspace)} variant="outline" className={`w-full backdrop-blur-sm transition-all duration-300 ${showAirspace ? "bg-blue-500/30 border-blue-400/40 text-white" : "bg-slate-800/60 border-white/30 text-white hover:bg-slate-700/60"}`}>
            {showAirspace ? (<>Airspace</>) : (<>Airspace</>)}
          </Button>
        </GlassCard>

        {weatherLocation && (
          <div className="mt-4">
            <WeatherPanel location={weatherLocation} forecastMode={false} compact={false} />
          </div>
        )}
      </div>
    </div>
  );
}
