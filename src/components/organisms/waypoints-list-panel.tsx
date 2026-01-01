import React from "react";
import { MapPin } from "lucide-react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import WaypointCard from "../molecules/waypoint-card";
import { useTranslation } from "react-i18next";
import type { Waypoint } from "../../types";

type WaypointListPanelProps = {
  waypoints: Waypoint[];
  onRemove: (index: number) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  vfrs?: (string | null)[];
};

export default function WaypointListPanel({
  waypoints,
  onRemove,
  onReorder,
  vfrs = [],
}: WaypointListPanelProps) {
  const { t } = useTranslation();
  if (waypoints.length === 0) return null;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <div className="mt-6 pt-6 border-t border-app-secondary">
      <h3 className="text-sm font-semibold text-app-primary mb-3 flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        {t("waypoints.title", "Waypoints")} ({waypoints.length})
      </h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="waypoints">
          {(provided) => (
            <div className="space-y-2">
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {waypoints.map((wp, index) => (
                  <Draggable
                    key={`waypoint-${index}`}
                    draggableId={`waypoint-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div className={snapshot.isDragging ? "shadow-2xl scale-105" : ""}>
                        <WaypointCard
                          waypoint={wp}
                          index={index}
                          onRemove={onRemove}
                          draggable={true}
                          dragHandleProps={provided.dragHandleProps ?? undefined}
                          draggableProps={provided.draggableProps}
                          innerRef={provided.innerRef}
                          vfrUpperDisplay={vfrs[index]}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
