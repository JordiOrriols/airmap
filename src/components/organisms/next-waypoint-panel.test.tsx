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
  const mockOnWeatherToggle = vi.fn();

  const mockWaypoint = {
    id: "wp1",
    name: "Waypoint 1",
    lat: 41.52,
    lng: 2.1,
  };

  it.each([
    { distance: 50, heading: 180, eta: "12:30" },
    { distance: 150, heading: 270, eta: "13:15" },
    { distance: 10, heading: 45, eta: "11:45" },
  ])(
    "displays waypoint info: distance=$distance heading=$heading eta=$eta",
    ({ distance, heading, eta }) => {
      render(
        <NextWaypointPanel
          currentWaypoint={mockWaypoint}
          distanceToWaypoint={distance}
          headingToWaypoint={heading}
          eta={eta}
          onHomeClick={mockOnHomeClick}
          onWeatherToggle={mockOnWeatherToggle}
        />
      );
      expect(screen.getByText(String(distance))).toBeInTheDocument();
      expect(screen.getByText(String(heading))).toBeInTheDocument();
      expect(screen.getByText(eta)).toBeInTheDocument();
    }
  );

  it("displays current waypoint name", () => {
    render(
      <NextWaypointPanel
        currentWaypoint={mockWaypoint}
        distanceToWaypoint={50}
        headingToWaypoint={180}
        eta="12:30"
        onHomeClick={mockOnHomeClick}
        onWeatherToggle={mockOnWeatherToggle}
      />
    );
    expect(screen.getByText("Waypoint 1")).toBeInTheDocument();
  });

  it("calls onHomeClick when home button clicked", () => {
    mockOnHomeClick.mockClear();
    render(
      <NextWaypointPanel
        currentWaypoint={mockWaypoint}
        distanceToWaypoint={50}
        headingToWaypoint={180}
        eta="12:30"
        onHomeClick={mockOnHomeClick}
        onWeatherToggle={mockOnWeatherToggle}
      />
    );
    const homeButton = screen.getByRole("button", { name: /home|Home/i });
    fireEvent.click(homeButton);
    expect(mockOnHomeClick).toHaveBeenCalledTimes(1);
  });

  it("calls onWeatherToggle when weather button clicked", () => {
    mockOnWeatherToggle.mockClear();
    render(
      <NextWaypointPanel
        currentWaypoint={mockWaypoint}
        distanceToWaypoint={50}
        headingToWaypoint={180}
        eta="12:30"
        onHomeClick={mockOnHomeClick}
        onWeatherToggle={mockOnWeatherToggle}
      />
    );
    const weatherButton = screen.getByRole("button", { name: /weather|cloud/i });
    fireEvent.click(weatherButton);
    expect(mockOnWeatherToggle).toHaveBeenCalledTimes(1);
  });

  it("both buttons are clickable independently", () => {
    mockOnHomeClick.mockClear();
    mockOnWeatherToggle.mockClear();
    render(
      <NextWaypointPanel
        currentWaypoint={mockWaypoint}
        distanceToWaypoint={50}
        headingToWaypoint={180}
        eta="12:30"
        onHomeClick={mockOnHomeClick}
        onWeatherToggle={mockOnWeatherToggle}
      />
    );
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    expect(mockOnHomeClick).toHaveBeenCalledTimes(1);
    expect(mockOnWeatherToggle).toHaveBeenCalledTimes(1);
  });

  it("handles null currentWaypoint gracefully", () => {
    render(
      <NextWaypointPanel
        currentWaypoint={null}
        distanceToWaypoint={0}
        headingToWaypoint={0}
        eta=""
        onHomeClick={mockOnHomeClick}
        onWeatherToggle={mockOnWeatherToggle}
      />
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("updates when waypoint changes", () => {
    const { rerender } = render(
      <NextWaypointPanel
        currentWaypoint={mockWaypoint}
        distanceToWaypoint={50}
        headingToWaypoint={180}
        eta="12:30"
        onHomeClick={mockOnHomeClick}
        onWeatherToggle={mockOnWeatherToggle}
      />
    );
    expect(screen.getByText("Waypoint 1")).toBeInTheDocument();

    const newWaypoint = { ...mockWaypoint, name: "Waypoint 2" };
    rerender(
      <NextWaypointPanel
        currentWaypoint={newWaypoint}
        distanceToWaypoint={75}
        headingToWaypoint={270}
        eta="13:00"
        onHomeClick={mockOnHomeClick}
        onWeatherToggle={mockOnWeatherToggle}
      />
    );
    expect(screen.getByText("Waypoint 2")).toBeInTheDocument();
  });
});
