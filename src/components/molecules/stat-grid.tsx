import React from "react";
import StatDisplay from "../atoms/stat-display";

type StatItem = {
  key?: string | number;
  icon?: React.ReactNode;
  label?: string;
  value?: React.ReactNode;
  unit?: React.ReactNode;
  className?: string;
};

type StatGridProps = {
  items: StatItem[];
  columns?: number;
  className?: string;
};

export default function StatGrid({
  items,
  columns = 2,
  className = "",
}: StatGridProps) {
  const cols = `grid-cols-${columns}`;
  return (
    <div className={`grid ${cols} gap-3 ${className}`}>
      {items.map((it, idx) => (
        <StatDisplay
          key={it.key ?? idx}
          label={it.label}
          icon={it.icon}
          value={it.value}
          unit={it.unit}
          className={it.className}
        />
      ))}
    </div>
  );
}
