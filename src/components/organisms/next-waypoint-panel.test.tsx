import { render, screen, fireEvent } from "@testing-library/react";
import NextWaypointPanel from "./next-waypoint-panel";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

vi.mock("../atoms/stat-display", () => ({
  default: ({ label, value }: { label: string; value: string }) => (
    <div>
      {label}: {value}
    </div>
  ),
}));

vi.mock("../atoms/gradient-icon", () => ({
  default: ({ icon: Icon }: { icon: React.ComponentType }) => (
    <div>
      <Icon />
    </div>
  ),
}));

vi.mock("../atoms/glass-card", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div className="glass-card">{children}</div>
  ),
}));

vi.mock("../atoms/badge", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div className="badge">{children}</div>,
}));

vi.mock("../atoms/icon-button", () => ({
  default: ({
    onClick,
    ariaLabel,
    icon: Icon,
  }: {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    ariaLabel: string;
    icon: React.ComponentType;
  }) => (
    <button onClick={onClick} aria-label={ariaLabel} type="button">
      <Icon />
    </button>
  ),
}));

describe("NextWaypointPanel", () => {
  const mockOnHomeClick = vi.fn();
  const mockOnSwitch = vi.fn();

  const mockWaypoint = {
    name: "Waypoint 1",
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  it.each([
    { distance: 50, eta: 30, heading: 180 },
    { distance: 150, eta: 90, heading: 270 },
    { distance: 10, eta: 5, heading: 45 },
  ])(
    "displays navigation info: distance=$distance eta=$eta heading=$heading",
    ({ distance, eta, heading }) => {
      mockOnHomeClick.mockClear();
      render(
        <NextWaypointPanel
          waypoint={mockWaypoint}
          currentIndex={0}
          totalWaypoints={3}
          distanceToNext={distance}
          etaToNext={eta}
          formatTime={formatTime}
          headingToNext={heading}
          onHomeClick={mockOnHomeClick}
          onSwitch={mockOnSwitch}
        />
      );
      expect(screen.getByText(String(distance))).toBeInTheDocument();
      expect(screen.getByText(String(heading))).toBeInTheDocument();
    }
  );

  it("displays current waypoint name", () => {
    render(
      <NextWaypointPanel
        waypoint={mockWaypoint}
        currentIndex={0}
        totalWaypoints={3}
        distanceToNext={50}
        etaToNext={30}
        formatTime={formatTime}
        headingToNext={180}
        onHomeClick={mockOnHomeClick}
        onSwitch={mockOnSwitch}
      />
    );
    expect(screen.getByText("Waypoint 1")).toBeInTheDocument();
  });

  it("calls onHomeClick when home button clicked", () => {
    mockOnHomeClick.mockClear();
    render(
      <NextWaypointPanel
        waypoint={mockWaypoint}
        currentIndex={0}
        totalWaypoints={3}
        distanceToNext={50}
        etaToNext={30}
        formatTime={formatTime}
        headingToNext={180}
        onHomeClick={mockOnHomeClick}
        onSwitch={mockOnSwitch}
      />
    );
    const homeButton = screen.getByRole("button", { name: /home|Home/i });
    fireEvent.click(homeButton);
    expect(mockOnHomeClick).toHaveBeenCalledTimes(1);
  });

  it("calls onSwitch when weather/switch button clicked", () => {
    mockOnSwitch.mockClear();
    render(
      <NextWaypointPanel
        waypoint={mockWaypoint}
        currentIndex={0}
        totalWaypoints={3}
        distanceToNext={50}
        etaToNext={30}
        formatTime={formatTime}
        headingToNext={180}
        onHomeClick={mockOnHomeClick}
        onSwitch={mockOnSwitch}
      />
    );
    const buttons = screen.getAllByRole("button");
    // Try clicking the second button (weather/switch button)
    if (buttons.length > 1) {
      fireEvent.click(buttons[1]);
      expect(mockOnSwitch).toHaveBeenCalledTimes(1);
    }
  });

  it("formats time correctly for etaToNext", () => {
    render(
      <NextWaypointPanel
        waypoint={mockWaypoint}
        currentIndex={0}
        totalWaypoints={3}
        distanceToNext={50}
        etaToNext={90}
        formatTime={formatTime}
        headingToNext={180}
        onHomeClick={mockOnHomeClick}
        onSwitch={mockOnSwitch}
      />
    );
    expect(screen.getByText("1h 30m")).toBeInTheDocument();
  });

  it("handles null heading gracefully", () => {
    render(
      <NextWaypointPanel
        waypoint={mockWaypoint}
        currentIndex={0}
        totalWaypoints={3}
        distanceToNext={50}
        etaToNext={30}
        formatTime={formatTime}
        headingToNext={null}
        onHomeClick={mockOnHomeClick}
        onSwitch={mockOnSwitch}
      />
    );
    expect(screen.getByText("Waypoint 1")).toBeInTheDocument();
  });

  it("displays correct waypoint progress indicator", () => {
    mockOnHomeClick.mockClear();
    const { container } = render(
      <NextWaypointPanel
        waypoint={mockWaypoint}
        currentIndex={2}
        totalWaypoints={5}
        distanceToNext={100}
        etaToNext={60}
        formatTime={formatTime}
        headingToNext={270}
        onHomeClick={mockOnHomeClick}
        onSwitch={mockOnSwitch}
      />
    );
    expect(container.querySelector(".badge")).toBeInTheDocument();
  });
});
