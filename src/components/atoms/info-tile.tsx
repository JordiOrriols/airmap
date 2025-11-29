import React from "react";

type InfoTileProps = {
  title?: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export default function InfoTile({
  title,
  value,
  icon,
  className = "",
  children,
}: InfoTileProps) {
  return (
    <div className={`bg-slate-900/50 rounded-xl p-3 ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon && (
          <div className="w-4 h-4 flex items-center justify-center">{icon}</div>
        )}
        {title && <span className="text-xs text-white/80">{title}</span>}
      </div>
      {value ? <p className="text-white font-bold">{value}</p> : children}
    </div>
  );
}
