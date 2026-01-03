import React from "react";
import { Wind, Droplets, Thermometer, Eye, Cloud } from "lucide-react";
import WeatherIcon from "../atoms/weather-icon";
import StatGrid from "./stat-grid";
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
              <div className="text-orange-300 text-xs">Gusts {weather.windGust} kt</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Build stats array with conditional items
  const weatherStats = [
    {
      key: "wind",
      icon: Wind,
      label: t("weather.wind", "Wind"),
      value: weather.windSpeed,
      unitSymbol: "kt",
      iconColor: "text-cyan-300",
    },
    ...(weather.windGust > weather.windSpeed
      ? [
          {
            key: "gusts",
            icon: Wind,
            label: t("weather.gusts", "Gusts"),
            value: weather.windGust,
            unitSymbol: "kt",
            iconColor: "text-orange-300",
          },
        ]
      : []),
    {
      key: "clouds",
      icon: Cloud,
      label: t("weather.clouds", "Clouds"),
      value: weather.cloudCover,
      unitSymbol: "%",
      additionalInfo: weather.cloudBase ? `Cloud base: ${weather.cloudBase} ft` : undefined,
      iconColor: "text-gray-300",
    },
    {
      key: "visibility",
      icon: Eye,
      label: t("weather.visibility", "Visibility"),
      value: weather.visibility,
      unitSymbol: "km",
      iconColor: "text-blue-300",
    },
    ...(weather.precipitation > 0
      ? [
          {
            key: "rain",
            icon: Droplets,
            label: t("weather.rain", "Precipitation"),
            value: weather.precipitation,
            unitSymbol: "mm",
            iconColor: "text-blue-400",
          },
        ]
      : []),
    {
      key: "feelsLike",
      icon: Thermometer,
      label: t("weather.feels_like", "Feels Like"),
      value: weather.feelsLike,
      unitSymbol: "°C",
      iconColor: "text-red-300",
    },
  ];

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

      <StatGrid items={weatherStats} columns={3} />
    </>
  );
}
