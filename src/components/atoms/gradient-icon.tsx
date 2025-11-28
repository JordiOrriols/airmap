import React from "react";

export default function GradientIcon({
  icon: Icon,
  gradient = "from-violet-500 to-purple-500",
  size = "md",
}) {
  const sizeClasses = {
    sm: "p-1.5 rounded-lg",
    md: "p-2 rounded-xl",
    lg: "p-3 rounded-2xl",
    xl: "p-4 rounded-2xl",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  return (
    <div className={`bg-gradient-to-r ${gradient} ${sizeClasses[size]}`}>
      <Icon className={`${iconSizes[size]} text-white`} />
    </div>
  );
}
