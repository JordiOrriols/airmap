import React from "react";
import InfoTile from "../atoms/info-tile";

type StatItem = {
  key?: string | number;
  title?: string;
  icon?: React.ReactNode;
  value?: React.ReactNode;
  className?: string;
};

type StatGridProps = {
  items: StatItem[];
  columns?: number;
  className?: string;
};

export default function StatGrid({ items, columns = 2, className = "" }: StatGridProps) {
  const cols = `grid-cols-${columns}`;
  return (
    <div className={`grid ${cols} gap-3 ${className}`}>
      {items.map((it, idx) => (
        <InfoTile key={it.key ?? idx} title={it.title} icon={it.icon} value={it.value} className={it.className} />
      ))}
    </div>
  );
}
