import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
import type { RouteData } from "../../types";

interface RouteActionsMenuProps {
  route: RouteData;
  actions: Array<{
    label: string;
    icon: React.ComponentType<any>;
    href?: string;
    onSelect?: (route: RouteData, e: React.MouseEvent) => void;
    variant?: "default" | "danger";
  }>;
}

export default function RouteActionsMenu({ route, actions }: RouteActionsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setMenuOpen((prev) => !prev);
        }}
        className="text-button-ghost hover:text-app-primary hover:bg-button-ghost rounded-xl -mt-1"
      >
        <EllipsisVertical className="w-4 h-4" />
      </Button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-card-app border border-app-secondary rounded-xl shadow-card p-2 z-10">
          {actions.map((action, idx) => {
            const Icon = action.icon;
            const content = (
              <Button
                key={action.label}
                variant="ghost"
                className={`w-full justify-start text-sm ${
                  action.variant === "danger"
                    ? "text-red-500 hover:bg-red-500/10"
                    : "text-app-primary hover:bg-button-ghost"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onSelect?.(route, e);
                  setMenuOpen(false);
                }}
              >
                <Icon className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            );

            if (action.href) {
              return (
                <Link to={action.href} key={`${action.label}-${idx}`}>
                  {content}
                </Link>
              );
            }

            return content;
          })}
        </div>
      )}
    </div>
  );
}
