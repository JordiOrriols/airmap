import React from "react";
import { Button } from "../ui/button";
import { X, GripVertical } from "lucide-react";

export default function WaypointCard({
  waypoint,
  index,
  onRemove,
  draggable = true,
  dragHandleProps = {},
  draggableProps = {},
  innerRef,
  vfrUpperDisplay,
}) {
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      className="bg-slate-800/60 backdrop-blur-sm border border-white/30 rounded-xl p-3 flex items-center justify-between transition-all hover:bg-slate-700/60 mb-2"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {draggable && (
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing text-white/50 hover:text-white/80 transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}
        <div className="bg-gradient-to-br from-pink-500 to-purple-500 w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">
            {waypoint.name}
          </p>
          <p className="text-white/70 text-xs">
            {waypoint.lat.toFixed(4)}°, {waypoint.lng.toFixed(4)}°
          </p>
          {vfrUpperDisplay !== undefined && (
            <p className="text-amber-300 text-xs mt-1">VFR: {vfrUpperDisplay || "N/A"}</p>
          )}
        </div>
      </div>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onRemove(index)}
        className="flex-shrink-0 h-8 w-8 text-white/70 hover:text-white hover:bg-red-500/30"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
