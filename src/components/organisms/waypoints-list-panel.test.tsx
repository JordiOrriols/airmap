import { render, screen, fireEvent } from "@testing-library/react";
import WaypointsListPanel from "./waypoints-list-panel";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

vi.mock("../atoms/icon-button", () => ({
  default: ({
    onClick,
    ariaLabel,
  }: {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    ariaLabel: string;
  }) => (
    <button onClick={onClick} aria-label={ariaLabel} type="button">
      {ariaLabel}
    </button>
  ),
}));

vi.mock("../molecules/waypoint-card", () => ({
  default: ({ waypoint, index, onRemove }: { waypoint: any; index: number; onRemove: (i: number) => void }) => (
    <div className="waypoint-card">
      <span>{waypoint.name}</span>
      <button
        onClick={() => onRemove(index)}
        aria-label={`Remove ${waypoint.name}`}
        type="button"
      >
        Remove
      </button>
    </div>
  ),
}));

vi.mock("@hello-pangea/dnd", () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Droppable: ({ children }: { children: (provided: any) => React.ReactNode }) => (
    <div>{children({ droppableProps: {}, placeholder: null })}</div>
  ),
  Draggable: ({ children }: { children: (provided: any) => React.ReactNode }) => (
    <div>{children({ dragHandleProps: {}, draggableProps: {} })}</div>
  ),
}));

describe("WaypointsListPanel", () => {
  const mockWaypoints = [
    { lat: 41.52, lng: 2.1, name: "Start" },
    { lat: 41.53, lng: 2.11, name: "Waypoint 2" },
  ];

  const mockOnRemove = vi.fn();
  const mockOnReorder = vi.fn();
  const mockOnClear = vi.fn();

  it("renders waypoints list", () => {
    render(
      <WaypointsListPanel
        waypoints={mockWaypoints}
        onClear={mockOnClear}
      />
    );
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Waypoint 2")).toBeInTheDocument();
  });

  it("renders clear button", () => {
    render(
      <WaypointsListPanel
        waypoints={mockWaypoints}
        onClear={mockOnClear}
      />
    );
    const clearButton = screen.getByRole("button", { name: /clear|trash/i });
    expect(clearButton).toBeInTheDocument();
  });

  it("calls onClear when clear button clicked", () => {
    render(
      <WaypointsListPanel
        waypoints={mockWaypoints}
        onClear={mockOnClear}
      />
    );
    const clearButton = screen.getByRole("button", { name: /clear|trash/i });
    fireEvent.click(clearButton);
    expect(mockOnClear).toHaveBeenCalled();
  });

  it("renders waypoint cards", () => {
    const { container } = render(
      <WaypointsListPanel
        waypoints={mockWaypoints}
        onClear={mockOnClear}
      />
    );
    const cards = container.querySelectorAll(".waypoint-card");
    expect(cards.length).toBe(2);
  });

  it("renders empty state message when no waypoints", () => {
    render(
      <WaypointsListPanel
        waypoints={[]}
        onClear={mockOnClear}
      />
    );
    expect(screen.getByText(/No waypoints/i)).toBeInTheDocument();
  });

  it("handles waypoint removal", () => {
    render(
      <WaypointsListPanel
        waypoints={mockWaypoints}
        onClear={mockOnClear}
      />
    );
    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    fireEvent.click(removeButtons[0]);
    expect(mockOnWaypointsChange).toHaveBeenCalled();
  });
});
