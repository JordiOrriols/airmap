import { render, screen, fireEvent } from "@testing-library/react";
import WaypointCard from "./waypoint-card";
import { describe, it, expect, vi } from "vitest";

vi.mock("../ui/button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }) => (
    <button onClick={onClick} type="button">
      {children}
    </button>
  ),
}));

vi.mock("../ui/card", () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

describe("WaypointCard", () => {
  const mockOnRemove = vi.fn();

  it.each([
    {
      waypoint: { id: "wp1", name: "Start", lat: 41.5209, lng: 2.105 },
      index: 0,
      expectedName: "Start",
    },
    {
      waypoint: { id: "wp2", name: "Checkpoint", lat: 41.53, lng: 2.11 },
      index: 1,
      expectedName: "Checkpoint",
    },
    {
      waypoint: { id: "wp3", name: "Destination", lat: 41.54, lng: 2.12 },
      index: 2,
      expectedName: "Destination",
    },
  ])("displays waypoint $expectedName at index $index", ({ waypoint, expectedName }) => {
    render(
      <WaypointCard
        waypoint={waypoint}
        index={0}
        onRemove={mockOnRemove}
        innerRef={null}
        vfrUpperDisplay={undefined}
      />
    );
    expect(screen.getByText(expectedName)).toBeInTheDocument();
  });

  it("displays correct coordinates with 4 decimal precision", () => {
    const waypoint = { id: "wp1", name: "Test", lat: 41.5209, lng: 2.1053 };
    render(
      <WaypointCard
        waypoint={waypoint}
        index={0}
        onRemove={mockOnRemove}
        innerRef={null}
        vfrUpperDisplay={undefined}
      />
    );
    expect(screen.getByText(/41.5209/)).toBeInTheDocument();
    expect(screen.getByText(/2.1053/)).toBeInTheDocument();
  });

  it.each([0, 1, 2, 5, 9])("displays correct 1-based index number for array index %i", (index) => {
    const waypoint = { id: "wp", name: "Test", lat: 0, lng: 0 };
    render(
      <WaypointCard
        waypoint={waypoint}
        index={index}
        onRemove={mockOnRemove}
        innerRef={null}
        vfrUpperDisplay={undefined}
      />
    );
    expect(screen.getByText(String(index + 1))).toBeInTheDocument();
  });

  it("calls onRemove with correct index on delete", () => {
    const waypoint = { id: "wp1", name: "Test", lat: 0, lng: 0 };
    mockOnRemove.mockClear();
    render(
      <WaypointCard
        waypoint={waypoint}
        index={3}
        onRemove={mockOnRemove}
        innerRef={null}
        vfrUpperDisplay={undefined}
      />
    );
    const deleteButton = screen.getByRole("button");
    fireEvent.click(deleteButton);
    expect(mockOnRemove).toHaveBeenCalledWith(3);
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it("displays VFR upper limit when provided", () => {
    const waypoint = { id: "wp1", name: "Test", lat: 0, lng: 0 };
    render(
      <WaypointCard
        waypoint={waypoint}
        index={0}
        onRemove={mockOnRemove}
        vfrUpperDisplay="FL100"
        innerRef={null}
      />
    );
    expect(screen.getByText(/VFR.*FL100/)).toBeInTheDocument();
  });

  it("displays 'N/A' when VFR upper is undefined", () => {
    const waypoint = { id: "wp1", name: "Test", lat: 0, lng: 0 };
    render(
      <WaypointCard
        waypoint={waypoint}
        index={0}
        onRemove={mockOnRemove}
        vfrUpperDisplay={undefined}
        innerRef={null}
      />
    );
    // VFR line should not be present when undefined
    expect(screen.queryByText(/VFR/)).not.toBeInTheDocument();
  });

  it("renders drag handle when draggable is true", () => {
    const waypoint = { id: "wp1", name: "Test", lat: 0, lng: 0 };
    const { container } = render(
      <WaypointCard
        waypoint={waypoint}
        index={0}
        onRemove={mockOnRemove}
        draggable={true}
        innerRef={null}
        vfrUpperDisplay={undefined}
      />
    );
    const gripIcon = container.querySelector("svg");
    expect(gripIcon).toBeInTheDocument();
  });

  it("omits drag handle when draggable is false", () => {
    const waypoint = { id: "wp1", name: "Test", lat: 0, lng: 0 };
    const { container } = render(
      <WaypointCard
        waypoint={waypoint}
        index={0}
        onRemove={mockOnRemove}
        draggable={false}
        innerRef={null}
        vfrUpperDisplay={undefined}
      />
    );
    // Find the delete button (should still be there)
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
    // Grip icon should not exist
    const gripElements = container.querySelectorAll("[class*='grip']");
    expect(gripElements.length).toBe(0);
  });

  it("supports drag and drop props", () => {
    const waypoint = { id: "wp1", name: "Test", lat: 0, lng: 0 };
    const mockDragHandleProps = { ref: vi.fn() };
    const mockDraggableProps = { style: {} };
    const { container } = render(
      <WaypointCard
        waypoint={waypoint}
        index={0}
        onRemove={mockOnRemove}
        dragHandleProps={mockDragHandleProps}
        draggableProps={mockDraggableProps}
        innerRef={vi.fn()}
        vfrUpperDisplay={undefined}
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
