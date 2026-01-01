import React from "react";

type CardHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export default function CardHeader({
  title,
  subtitle,
  meta,
  actions,
  className = "",
}: CardHeaderProps) {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-app-primary mb-2">{title}</h3>
        {subtitle && <p className="text-app-secondary text-sm">{subtitle}</p>}
      </div>

      {actions && <div className="ml-4 flex items-center gap-2">{actions}</div>}
    </div>
  );
}
