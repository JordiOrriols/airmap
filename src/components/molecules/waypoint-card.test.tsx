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
  const mockWaypoint = {
    id: "wp1",
    name: "Waypoint 1",
    lat: 41.5209,
    lng: 2.105,
  };

  const mockOnRemove = vi.fn();

  it("renders waypoint name", () => {
    render(
      <WaypointCard
        waypoint={mockWaypoint}
        index={0}
        onRemove={mockOnRemove}
      />
    );
    expect(screen.getByText("Waypoint 1")).toBeInTheDocument();
  });

  it("displays waypoint coordinates", () => {
    render(
      <WaypointCard
        waypoint={mockWaypoint}
        index={0}
        onRemove={mockOnRemove}
      />
    );
    expect(screen.getByText(/41.5209/)).toBeInTheDocument();
    expect(screen.getByText(/2.1050/)).toBeInTheDocument();
  });

  it("displays waypoint index", () => {
    render(
      <WaypointCard
        waypoint={mockWaypoint}
        index={0}
        onRemove={mockOnRemove}
      />
    );
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("calls onRemove when delete button clicked", () => {
    render(
      <WaypointCard
        waypoint={mockWaypoint}
        index={2}
        onRemove={mockOnRemove}
      />
    );
    const deleteButton = screen.getAllByRole("button")[0];
    fireEvent.click(deleteButton);
    expect(mockOnRemove).toHaveBeenCalledWith(2);
  });

  it("displays VFR upper when provided", () => {
    render(
      <WaypointCard
        waypoint={mockWaypoint}
        index={0}
        onRemove={mockOnRemove}
        vfrUpperDisplay="FL100"
      />
    );
    expect(screen.getByText(/VFR.*FL100/)).toBeInTheDocument();
  });

  it("renders drag handle when draggable is true", () => {
    const { container } = render(
      <WaypointCard
        waypoint={mockWaypoint}
        index={0}
        onRemove={mockOnRemove}
        draggable={true}
      />
    );
    const gripIcon = container.querySelector("svg");
    expect(gripIcon).toBeInTheDocument();
  });
});
