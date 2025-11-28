import React from "react";
import { MapPin } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import WaypointCard from "../molecules/WaypointCard";

export default function WaypointListPanel({ waypoints, onRemove, onReorder }) {
  if (waypoints.length === 0) return null;

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <div className="mt-6 pt-6 border-t border-white/30">
      <h3 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Waypoints ({waypoints.length})
      </h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="waypoints">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar"
            >
              {waypoints.map((wp, index) => (
                <Draggable key={`waypoint-${index}`} draggableId={`waypoint-${index}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className={snapshot.isDragging ? 'shadow-2xl scale-105' : ''}
                    >
                      <WaypointCard
                        waypoint={wp}
                        index={index}
                        onRemove={onRemove}
                        draggable={true}
                        dragHandleProps={provided.dragHandleProps}
                        draggableProps={provided.draggableProps}
                        innerRef={provided.innerRef}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
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