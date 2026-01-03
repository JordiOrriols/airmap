import React from "react";

type StatDisplayProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: React.ReactNode;
  value: React.ReactNode;
  unitSymbol?: React.ReactNode;
  additionalInfo?: React.ReactNode;
  iconColor?: string;
  size?: "large" | "compact";
  className?: string;
};

export default function StatDisplay({
  icon: Icon,
  label,
  value,
  unitSymbol = null,
  additionalInfo = null,
  iconColor = "text-cyan-300",
  size = "large",
  className = "",
}: StatDisplayProps) {
  const valueSize = size === "compact" ? "text-md" : "text-3xl";
  const padding = size === "compact" ? "p-2" : "p-4";
  const rounded = size === "compact" ? "rounded-md" : "rounded-2xl";
  const isCompact = size === "compact";

  return (
    <div
      className={`bg-stat-card backdrop-blur-sm border border-stat-card ${rounded} ${padding} ${className}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className="text-xs text-app-secondary font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <p className={`${valueSize} font-bold text-app-primary`}>{value}</p>
        {unitSymbol && <p className="text-xs text-gray-400 font-medium">{unitSymbol}</p>}
      </div>
      {additionalInfo && !isCompact && (
        <p className="text-xs text-app-tertiary mt-2">{additionalInfo}</p>
      )}
    </div>
  );
}
