import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";

export default function DraggablePanelContainer({
  leftPanels,
  rightPanels,
  onPanelsChange,
  headerComponent,
}) {
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    if (sourceColumn === destColumn) {
      // Reorder within same column
      const items =
        sourceColumn === "left" ? [...leftPanels] : [...rightPanels];
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);

      onPanelsChange(
        sourceColumn === "left" ? items : leftPanels,
        sourceColumn === "right" ? items : rightPanels
      );
    } else {
      // Move between columns
      const sourceItems =
        sourceColumn === "left" ? [...leftPanels] : [...rightPanels];
      const destItems =
        destColumn === "left" ? [...leftPanels] : [...rightPanels];

      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      onPanelsChange(
        sourceColumn === "left" ? sourceItems : destItems,
        sourceColumn === "right" ? sourceItems : destItems
      );
    }
  };

  const renderColumn = (panels, columnId) => (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`space-y-4 min-h-full ${
            snapshot.isDraggingOver ? "bg-blue-500/10 rounded-2xl" : ""
          }`}
        >
          {panels.map((panel, index) => (
            <Draggable key={panel.id} draggableId={panel.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`${
                    snapshot.isDragging ? "opacity-50 scale-95" : ""
                  } transition-all`}
                >
                  {panel.component}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <motion.div
        initial={{ x: -400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute left-6 top-6 bottom-6 z-10 w-96 flex flex-col"
      >
        {headerComponent && <div className="mb-4">{headerComponent}</div>}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {renderColumn(leftPanels, "left")}
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute right-6 top-6 bottom-6 z-10 w-[420px] overflow-y-auto custom-scrollbar"
      >
        {renderColumn(rightPanels, "right")}
      </motion.div>

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
    </DragDropContext>
  );
}
