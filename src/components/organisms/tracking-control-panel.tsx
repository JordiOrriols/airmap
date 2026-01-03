import React from "react";
import GlassCard from "../atoms/glass-card";
import StatDisplay from "../atoms/stat-display";
import { Navigation } from "lucide-react";
import WeatherPanel from "./weather-panel";
import { useTranslation } from "react-i18next";

type Props = {
  currentHeading: number;
  showAirspace: boolean;
  setShowAirspace: (v: boolean) => void;
  weatherLocation: { lat: number; lng: number } | null;
};

export default function TrackingControlPanel({
  currentHeading,
  showAirspace,
  setShowAirspace,
  weatherLocation,
}: Props) {
  const { t } = useTranslation();

  return (
    <GlassCard className="p-4 space-y-3">
      <div className="space-y-2">
        <StatDisplay
          icon={Navigation}
          label={t("stat.heading", "Current Heading")}
          value={`${currentHeading.toFixed(0)}°`}
          iconColor="text-cyan-300"
          size="compact"
        />
      </div>

      <button
        onClick={() => setShowAirspace(!showAirspace)}
        className={`w-full rounded-lg border transition-all duration-300 backdrop-blur-sm px-3 py-2.5 text-sm font-medium ${
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
          <WeatherPanel location={weatherLocation} forecastMode={false} compact={true} />
        </div>
      )}
    </GlassCard>
  );
}
