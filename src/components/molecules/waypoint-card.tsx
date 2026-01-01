import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
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
    <div ref={innerRef} {...draggableProps} className="mb-2">
      <Card className="flex flex-row items-center justify-between gap-3 p-3 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {draggable && (
            <div
              {...dragHandleProps}
              className="cursor-grab active:cursor-grabbing text-app-tertiary hover:text-app-secondary transition-colors"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}
          <div className="bg-gradient-to-br from-pink-500 to-purple-500 w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-app-primary font-medium text-sm truncate">{waypoint.name}</p>
            <p className="text-app-secondary text-xs">
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
          className="flex-shrink-0 h-8 w-8 text-app-tertiary hover:text-app-primary hover:bg-red-500/30"
        >
          <X className="w-4 h-4" />
        </Button>
      </Card>
    </div>
  );
}
