import React from "react";

export default function StatDisplay({
  icon: Icon,
  label,
  value,
  unit = null,
  iconColor = "text-cyan-300",
  size = "large",
}) {
  const valueSize = size === "compact" ? "text-md" : "text-3xl";
  const spacing = size === "compact" ? "" : "mb-2";
  const padding = size === "compact" ? "p-2" : "p-4";
  const rounded = size === "compact" ? "rounded-md" : "rounded-2xl";

  return (
    <div className={`bg-stat-card backdrop-blur-sm border border-stat-card ${rounded} ${padding}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className="text-xs text-app-secondary font-medium">{label}</span>
      </div>
      <p className={`${valueSize} font-bold text-app-primary ${spacing}`}>{value}</p>
      {unit && <p className="text-xs text-app-tertiary">{unit}</p>}
    </div>
  );
}
