import React from "react";
import { Wind, Droplets, Thermometer, Eye, Cloud } from "lucide-react";
import WeatherIcon from "../atoms/weather-icon";
import InfoTile from "../atoms/info-tile";
import Badge from "../atoms/badge";

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
        <InfoTile
          title="Wind"
          icon={<Wind className="w-4 h-4 text-cyan-300" />}
          value={<>{weather.windSpeed} kt</>}
        />

        {weather.windGust > weather.windSpeed && (
          <InfoTile
            title="Gusts"
            icon={<Wind className="w-4 h-4 text-orange-300" />}
            value={<>{weather.windGust} kt</>}
          />
        )}

        <InfoTile
          title="Clouds"
          icon={<Cloud className="w-4 h-4 text-gray-300" />}
          value={<>
            {weather.cloudCover}%
            {weather.cloudBase && (
              <span className="text-white/60 text-xs block">{weather.cloudBase} ft</span>
            )}
          </>}
        />

        <InfoTile
          title="Visibility"
          icon={<Eye className="w-4 h-4 text-blue-300" />}
          value={<>{weather.visibility} km</>}
        />

        {weather.precipitation > 0 && (
          <InfoTile
            title="Precipitation"
            icon={<Droplets className="w-4 h-4 text-blue-400" />}
            value={<>{weather.precipitation} mm</>}
          />
        )}

        <InfoTile
          title="Feels Like"
          icon={<Thermometer className="w-4 h-4 text-red-300" />}
          value={<>{weather.feelsLike}°C</>}
        />
      </div>
    </div>
  );
}