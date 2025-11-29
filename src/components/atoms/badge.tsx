import React from "react";

type BadgeProps = {
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  gradient?: string;
  className?: string;
};

export default function Badge({
  children,
  size = "md",
  gradient = "from-pink-500 to-purple-500",
  className = "",
}: BadgeProps) {
  const sizes: Record<string, string> = {
    sm: "w-7 h-7 rounded-lg text-xs",
    md: "w-8 h-8 rounded-xl text-sm",
    lg: "w-10 h-10 rounded-xl text-lg",
  };

  return (
    <div
      className={`bg-gradient-to-br ${gradient} ${sizes[size]} flex items-center justify-center text-white font-bold ${className}`}
    >
      {children}
    </div>
  );
}
