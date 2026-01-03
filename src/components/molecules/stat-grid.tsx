import React from "react";
import StatDisplay from "../atoms/stat-display";

type StatItem = {
  key?: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  value?: React.ReactNode;
  unitSymbol?: React.ReactNode;
  additionalInfo?: React.ReactNode;
  className?: string;
  iconColor?: string;
};

type StatGridProps = {
  items: StatItem[];
  columns?: number;
  className?: string;
  compact?: boolean;
};

export default function StatGrid({
  items,
  columns = 2,
  className = "",
  compact = true,
}: StatGridProps) {
  const colsMap = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };
  const colsClass = colsMap[columns as keyof typeof colsMap] || `grid-cols-${columns}`;

  return (
    <div className={`grid ${colsClass} gap-3 ${className}`}>
      {items.map((it, idx) => (
        <StatDisplay
          key={it.key ?? idx}
          label={it.label}
          icon={it.icon ?? (() => null)}
          value={it.value}
          unitSymbol={it.unitSymbol}
          additionalInfo={it.additionalInfo}
          className={it.className ?? ""}
          iconColor={it.iconColor ?? "text-cyan-300"}
          size={compact ? "compact" : "large"}
        />
      ))}
    </div>
  );
}
