import React from "react";
import { Wind, Droplets, Thermometer, Eye, Cloud } from "lucide-react";
import WeatherIcon from "../atoms/weather-icon";

export default function WeatherCard({ weather, compact = false }) {
  if (!weather) {
    return (
      <div className="bg-slate-800/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4">
        <p className="text-white/70 text-sm">No weather data available</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-slate-800/60 backdrop-blur-sm border border-white/30 rounded-xl p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WeatherIcon condition={weather.condition} size="md" />
            <div>
              <p className="text-white font-bold text-lg">{weather.temp}°C</p>
              <p className="text-white/70 text-xs">{weather.condition}</p>
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
    <div className="bg-slate-800/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <WeatherIcon condition={weather.condition} size="lg" />
          <div>
            <p className="text-white font-bold text-2xl">{weather.temp}°C</p>
            <p className="text-white/70 text-sm">{weather.condition}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4 text-cyan-300" />
            <span className="text-xs text-white/80">Wind</span>
          </div>
          <p className="text-white font-bold">{weather.windSpeed} kt</p>
          <p className="text-white/60 text-xs">{weather.windDirection}°</p>
        </div>

        {weather.windGust > weather.windSpeed && (
          <div className="bg-slate-900/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Wind className="w-4 h-4 text-orange-300" />
              <span className="text-xs text-white/80">Gusts</span>
            </div>
            <p className="text-white font-bold">{weather.windGust} kt</p>
          </div>
        )}

        <div className="bg-slate-900/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Cloud className="w-4 h-4 text-gray-300" />
            <span className="text-xs text-white/80">Clouds</span>
          </div>
          <p className="text-white font-bold">{weather.cloudCover}%</p>
          {weather.cloudBase && (
            <p className="text-white/60 text-xs">{weather.cloudBase} ft</p>
          )}
        </div>

        <div className="bg-slate-900/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-blue-300" />
            <span className="text-xs text-white/80">Visibility</span>
          </div>
          <p className="text-white font-bold">{weather.visibility} km</p>
        </div>

        {weather.precipitation > 0 && (
          <div className="bg-slate-900/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-white/80">Rain</span>
            </div>
            <p className="text-white font-bold">{weather.precipitation} mm</p>
          </div>
        )}

        <div className="bg-slate-900/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="w-4 h-4 text-red-300" />
            <span className="text-xs text-white/80">Feels Like</span>
          </div>
          <p className="text-white font-bold">{weather.feelsLike}°C</p>
        </div>
      </div>
    </div>
  );
}