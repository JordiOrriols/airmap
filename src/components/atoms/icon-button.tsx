import React from "react";
import type { LucideIcon } from "lucide-react";

type IconButtonProps = {
  icon: LucideIcon;
  onClick: () => void;
  ariaLabel: string;
  className?: string;
};

export default function IconButton({
  icon: Icon,
  onClick,
  ariaLabel,
  className = "",
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`h-9 w-9 inline-flex items-center justify-center rounded-md border border-app-secondary bg-button-ghost hover:bg-button-ghost/80 text-app-secondary ${className}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
