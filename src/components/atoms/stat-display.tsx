import React from "react";

export default function StatDisplay({
  icon: Icon,
  label,
  value,
  unit,
  iconColor = "text-cyan-300",
}) {
  return (
    <div className="bg-card-app backdrop-blur-sm border border-app-secondary rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className="text-xs text-app-primary font-medium">{label}</span>
      </div>
      <p className="text-3xl font-bold text-app-primary">{value}</p>
      {unit && <p className="text-xs text-app-tertiary">{unit}</p>}
    </div>
  );
}
