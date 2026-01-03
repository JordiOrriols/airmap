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
  const mockWaypoint = {
    id: "wp1",
    name: "Waypoint 1",
    lat: 41.52,
    lng: 2.1,
  };

  const mockOnHomeClick = vi.fn();
  const mockOnWeatherToggle = vi.fn();

  it("renders waypoint name", () => {
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

  it("renders distance info", () => {
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
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it("renders heading info", () => {
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
    expect(screen.getByText(/180/)).toBeInTheDocument();
  });

  it("renders ETA", () => {
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
    expect(screen.getByText("12:30")).toBeInTheDocument();
  });

  it("renders home button", () => {
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
    expect(homeButton).toBeInTheDocument();
  });

  it("calls onHomeClick when home button clicked", () => {
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
    expect(mockOnHomeClick).toHaveBeenCalled();
  });

  it("renders weather toggle button", () => {
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
    expect(weatherButton).toBeInTheDocument();
  });

  it("calls onWeatherToggle when weather button clicked", () => {
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
    expect(mockOnWeatherToggle).toHaveBeenCalled();
  });

  it("handles null currentWaypoint", () => {
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
    expect(screen.getByRole("button", { name: /home|Home/i })).toBeInTheDocument();
  });
});
