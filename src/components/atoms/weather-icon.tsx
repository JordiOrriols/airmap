import React from "react";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudLightning,
  Sun,
  CloudFog,
} from "lucide-react";

export default function WeatherIcon({ condition, size = "md" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const getIcon = () => {
    const lower = condition?.toLowerCase() || "";

    if (lower.includes("thunder") || lower.includes("storm")) {
      return (
        <CloudLightning className={`${sizeClasses[size]} text-yellow-300`} />
      );
    }
    if (lower.includes("rain") || lower.includes("shower")) {
      return <CloudRain className={`${sizeClasses[size]} text-blue-300`} />;
    }
    if (lower.includes("drizzle")) {
      return <CloudDrizzle className={`${sizeClasses[size]} text-blue-200`} />;
    }
    if (lower.includes("snow")) {
      return <CloudSnow className={`${sizeClasses[size]} text-blue-100`} />;
    }
    if (lower.includes("fog") || lower.includes("mist")) {
      return <CloudFog className={`${sizeClasses[size]} text-gray-300`} />;
    }
    if (lower.includes("cloud")) {
      return <Cloud className={`${sizeClasses[size]} text-gray-200`} />;
    }
    if (lower.includes("clear") || lower.includes("sun")) {
      return <Sun className={`${sizeClasses[size]} text-yellow-300`} />;
    }

    return <Cloud className={`${sizeClasses[size]} text-gray-300`} />;
  };

  return getIcon();
}
