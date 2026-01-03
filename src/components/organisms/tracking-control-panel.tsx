import React from "react";
import GlassCard from "../atoms/glass-card";
import StatDisplay from "../atoms/stat-display";
import { Navigation, TrendingUp } from "lucide-react";
import WeatherPanel from "./weather-panel";
import { useTranslation } from "react-i18next";

type Props = {
  currentHeading: number;
  speed: number;
  showAirspace: boolean;
  setShowAirspace: (v: boolean) => void;
  weatherLocation: { lat: number; lng: number } | null;
};

export default function TrackingControlPanel({
  currentHeading,
  speed,
  showAirspace,
  setShowAirspace,
  weatherLocation,
}: Props) {
  const { t } = useTranslation();

  return (
    <GlassCard className="p-6 space-y-4">
      <div className="space-y-3">
        <StatDisplay
          icon={Navigation}
          label={t("stat.heading", "Current Heading")}
          value={`${currentHeading.toFixed(0)}°`}
          iconColor="text-cyan-300"
        />
        <StatDisplay
          icon={TrendingUp}
          label={t("stat.ground_speed", "Ground Speed")}
          value={speed.toFixed(1)}
          unit={t("unit.knots", "knots")}
          iconColor="text-purple-300"
        />
      </div>

      <button
        onClick={() => setShowAirspace(!showAirspace)}
        className={`w-full rounded-xl border transition-all duration-300 backdrop-blur-sm px-4 py-3 text-sm font-medium ${
          showAirspace
            ? "bg-blue-500/30 border-blue-400/40 text-white"
            : "bg-input-app border-app-secondary text-input-app hover:bg-button-ghost"
        }`}
      >
        {showAirspace
          ? t("planner.route_control.airspace_on", "Airspace")
          : t("planner.route_control.airspace_off", "Airspace")}
      </button>

      {weatherLocation && (
        <div className="pt-1">
          <WeatherPanel location={weatherLocation} forecastMode={false} compact={false} />
        </div>
      )}
    </GlassCard>
  );
}
