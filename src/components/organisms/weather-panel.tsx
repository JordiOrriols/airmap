import React, { useState, useEffect, useCallback } from "react";
import { Loader2, Calendar, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import WeatherCard from "../molecules/weather-card";
import { useTranslation } from "react-i18next";
import { useCurrentWeather, useWeatherForecast } from "../../api/weather";
import type { WeatherData, ForecastData } from "../../api/weather";

export default function WeatherPanel({
  location = { lat: 41.5209, lng: 2.105 },
  forecastMode = false,
  compact = false,
}) {
  const { t } = useTranslation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData>({});
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedHour, setSelectedHour] = useState("12");

  const currentWeatherQuery = useCurrentWeather(location, !forecastMode);
  const forecastQuery = useWeatherForecast(location, forecastMode);

  const loading = forecastMode ? forecastQuery.isLoading : currentWeatherQuery.isLoading;

  const updateSelectedWeatherFromForecast = useCallback(
    (forecastData: ForecastData) => {
      const days = Object.keys(forecastData);
      if (days.length === 0) return;

      const dayKey = days[selectedDay];
      if (!dayKey) return;

      const selectedDayData = forecastData[dayKey];
      if (!selectedDayData || selectedDayData.length === 0) return;

      // Find closest hour
      const hourNum = parseInt(selectedHour, 10);
      if (selectedDayData.length === 0) return;
      const first = selectedDayData[0];
      if (!first) return;
      const closest = selectedDayData.reduce<WeatherData>((prev, curr) => {
        const prevHour = prev.hour ?? 0;
        const currHour = curr.hour ?? 0;
        return Math.abs(currHour - hourNum) < Math.abs(prevHour - hourNum) ? curr : prev;
      }, first);

      setWeather(closest);
    },
    [selectedDay, selectedHour]
  );

  useEffect(() => {
    if (forecastMode && forecastQuery.data) {
      const grouped = forecastQuery.data;
      setForecast(grouped);
      updateSelectedWeatherFromForecast(grouped);
    } else if (!forecastMode && currentWeatherQuery.data) {
      setWeather(currentWeatherQuery.data);
    }
  }, [
    currentWeatherQuery.data,
    forecastQuery.data,
    forecastMode,
    updateSelectedWeatherFromForecast,
  ]);

  useEffect(() => {
    if (forecastMode && Object.keys(forecast).length > 0) {
      updateSelectedWeatherFromForecast(forecast);
    }
  }, [forecast, forecastMode, updateSelectedWeatherFromForecast]);

  const getDayOptions = () => {
    return Object.keys(forecast).map((day, index) => {
      const date = new Date(day);
      return {
        value: index,
        label:
          index === 0
            ? t("date.today", "Today")
            : index === 1
              ? t("date.tomorrow", "Tomorrow")
              : date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                }),
      };
    });
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString(),
    label: `${i.toString().padStart(2, "0")}:00`,
  }));

  if (compact) {
    return (
      <div className="space-y-2">
        {loading && (
          <div className="flex items-center justify-center gap-2 text-app-secondary text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading weather...
          </div>
        )}

        {!loading && weather && <WeatherCard weather={weather} compact={true} />}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card-app backdrop-blur-sm border border-app-secondary rounded-2xl p-4">
        {forecastMode && !compact && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-app-secondary mb-1 block flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {t("weather.select_day", "Select Day")}
              </label>
              <Select
                value={selectedDay.toString()}
                onValueChange={(v) => setSelectedDay(parseInt(v))}
              >
                <SelectTrigger className="bg-input-app border-app-secondary text-input-app">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getDayOptions().map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-app-secondary mb-1 block flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {t("weather.select_hour", "Select Hour")}
              </label>
              <Select value={selectedHour} onValueChange={setSelectedHour}>
                <SelectTrigger className="bg-input-app border-app-secondary text-input-app">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {hourOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-app-secondary py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>{t("weather.loading_data", "Loading weather data...")}</span>
        </div>
      )}

      {!loading && weather && <WeatherCard weather={weather} />}

      {!loading && !weather && (
        <div className="text-center text-app-secondary py-8">
          <p>{t("weather.no_data", "Weather data unavailable")}</p>
          <p className="text-xs mt-2">{t("weather.check_api", "Check API key configuration")}</p>
        </div>
      )}
    </div>
  );
}
