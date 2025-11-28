import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, GripVertical } from "lucide-react";
import { Button } from "../components/ui/button";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function WaypointList({ waypoints, onRemove, onReorder }) {
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
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-slate-800/60 backdrop-blur-sm border border-white/30 rounded-xl p-3 flex items-center justify-between transition-all ${
                        snapshot.isDragging ? 'shadow-2xl scale-105 bg-slate-700/70' : 'hover:bg-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab active:cursor-grabbing text-white/50 hover:text-white/80 transition-colors"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="bg-gradient-to-br from-pink-500 to-purple-500 w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{wp.name}</p>
                          <p className="text-white/70 text-xs">
                            {wp.lat.toFixed(4)}°, {wp.lng.toFixed(4)}°
                          </p>
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