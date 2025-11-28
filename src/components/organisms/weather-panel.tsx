import React, { useState, useEffect } from "react";
import { Loader2, Calendar, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import WeatherCard from "../molecules/weather-card";
import { useTranslation } from "react-i18next";

const OPENWEATHER_API_KEY = "YOUR_API_KEY"; // Users need to get free key from openweathermap.org

export default function WeatherPanel({
  location = { lat: 41.5209, lng: 2.105 },
  forecastMode = false,
  compact = false,
}) {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedHour, setSelectedHour] = useState("12");

  useEffect(() => {
    if (forecastMode) {
      fetchForecast();
    } else {
      fetchCurrentWeather();
    }
  }, [location.lat, location.lng, forecastMode]);

  useEffect(() => {
    if (forecastMode && forecast.length > 0) {
      updateSelectedWeather();
    }
  }, [selectedDay, selectedHour, forecast]);

  const convertWindSpeed = (mps) => {
    return Math.round(mps * 1.94384); // m/s to knots
  };

  const fetchCurrentWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      if (response.ok) {
        const data = await response.json();
        setWeather({
          temp: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          windSpeed: convertWindSpeed(data.wind.speed),
          windGust: data.wind.gust
            ? convertWindSpeed(data.wind.gust)
            : convertWindSpeed(data.wind.speed),
          windDirection: data.wind.deg,
          cloudCover: data.clouds.all,
          visibility: Math.round(data.visibility / 1000),
          precipitation: data.rain?.["1h"] || 0,
          cloudBase:
            data.clouds.all > 50 ? Math.round(data.clouds.all * 30) : null,
        });
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      if (response.ok) {
        const data = await response.json();

        // Group by day
        const grouped = {};
        data.list.forEach((item) => {
          const date = new Date(item.dt * 1000);
          const dayKey = date.toISOString().split("T")[0];

          if (!grouped[dayKey]) {
            grouped[dayKey] = [];
          }

          grouped[dayKey].push({
            hour: date.getHours(),
            temp: Math.round(item.main.temp),
            feelsLike: Math.round(item.main.feels_like),
            condition: item.weather[0].main,
            description: item.weather[0].description,
            windSpeed: convertWindSpeed(item.wind.speed),
            windGust: item.wind.gust
              ? convertWindSpeed(item.wind.gust)
              : convertWindSpeed(item.wind.speed),
            windDirection: item.wind.deg,
            cloudCover: item.clouds.all,
            visibility: Math.round(item.visibility / 1000),
            precipitation: (item.rain?.["3h"] || 0) + (item.snow?.["3h"] || 0),
            cloudBase:
              item.clouds.all > 50 ? Math.round(item.clouds.all * 30) : null,
          });
        });

        setForecast(grouped);
        updateSelectedWeather();
      }
    } catch (error) {
      console.error("Error fetching forecast:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSelectedWeather = () => {
    const days = Object.keys(forecast);
    if (days.length === 0) return;

    const selectedDayData = forecast[days[selectedDay]];
    if (!selectedDayData) return;

    // Find closest hour
    const hourNum = parseInt(selectedHour);
    const closest = selectedDayData.reduce((prev, curr) => {
      return Math.abs(curr.hour - hourNum) < Math.abs(prev.hour - hourNum)
        ? curr
        : prev;
    });

    setWeather(closest);
  };

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
          <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading weather...
          </div>
        )}

        {!loading && weather && (
          <WeatherCard weather={weather} compact={true} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4">
        {forecastMode && !compact && (
          <div className="mb-4 space-y-3">
            <div>
              <label className="text-xs text-white/80 mb-1 block flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                  {t("weather.select_day", "Select Day")}
              </label>
              <Select
                value={selectedDay.toString()}
                onValueChange={(v) => setSelectedDay(parseInt(v))}
              >
                <SelectTrigger className="bg-slate-800/60 border-white/30 text-white">
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
              <label className="text-xs text-white/80 mb-1 block flex items-center gap-1">
                <Clock className="w-3 h-3" />
                  {t("weather.select_hour", "Select Hour")}
              </label>
              <Select value={selectedHour} onValueChange={setSelectedHour}>
                <SelectTrigger className="bg-slate-800/60 border-white/30 text-white">
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

        {loading && (
          <div className="flex items-center justify-center gap-2 text-white py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
              <span>{t("weather.loading_data", "Loading weather data...")}</span>
          </div>
        )}

        {!loading && weather && <WeatherCard weather={weather} />}

        {!loading && !weather && (
          <div className="text-center text-white/70 py-8">
              <p>{t("weather.no_data", "Weather data unavailable")}</p>
              <p className="text-xs mt-2">{t("weather.check_api", "Check API key configuration")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
