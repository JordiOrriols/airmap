import React from "react";
import { Wind, Droplets, Thermometer, Eye, Cloud } from "lucide-react";
import WeatherIcon from "../atoms/weather-icon";
import StatDisplay from "../atoms/stat-display";
import Badge from "../atoms/badge";
import { useTranslation } from "react-i18next";

export default function WeatherCard({ weather, compact = false }) {
  const { t } = useTranslation();
  if (!weather) {
    return (
      <div className="bg-card-app backdrop-blur-sm border border-app-secondary rounded-2xl p-4">
        <p className="text-app-secondary text-sm">
          {t("weather.no_data", "No weather data available")}
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-card-app backdrop-blur-sm border border-app-secondary rounded-xl p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WeatherIcon condition={weather.condition} size="md" />
            <div>
              <p className="text-app-primary font-bold text-lg">{weather.temp}°C</p>
              <p className="text-app-secondary text-xs">{weather.condition}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-cyan-300 text-xs">
              <Wind className="w-3 h-3" />
              <span>{weather.windSpeed} kt</span>
            </div>
            {weather.windGust > weather.windSpeed && (
              <div className="text-orange-300 text-xs">
                Gusts {weather.windGust} kt
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <WeatherIcon condition={weather.condition} size="lg" />
          <div>
            <p className="text-app-primary font-bold text-2xl">{weather.temp}°C</p>
            <p className="text-app-secondary text-sm">{weather.condition}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatDisplay
          icon={Wind}
          label={t("weather.wind", "Wind")}
          value={`${weather.windSpeed} kt`}
          iconColor="text-cyan-300"
        />

        {weather.windGust > weather.windSpeed && (
          <StatDisplay
            icon={Wind}
            label={t("weather.gusts", "Gusts")}
            value={`${weather.windGust} kt`}
            iconColor="text-orange-300"
          />
        )}

        <StatDisplay
          icon={Cloud}
          label={t("weather.clouds", "Clouds")}
          value={weather.cloudBase ? `${weather.cloudCover}% (${weather.cloudBase} ft)` : `${weather.cloudCover}%`}
          iconColor="text-gray-300"
        />

        <StatDisplay
          icon={Eye}
          label={t("weather.visibility", "Visibility")}
          value={`${weather.visibility} km`}
          iconColor="text-blue-300"
        />

        {weather.precipitation > 0 && (
          <StatDisplay
            icon={Droplets}
            label={t("weather.rain", "Precipitation")}
            value={`${weather.precipitation} mm`}
            iconColor="text-blue-400"
          />
        )}

        <StatDisplay
          icon={Thermometer}
          label={t("weather.feels_like", "Feels Like")}
          value={`${weather.feelsLike}°C`}
          iconColor="text-red-300"
        />
      </div>
    </>
  );
}
