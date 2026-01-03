import { render, screen, fireEvent } from "@testing-library/react";
import TrackingControlPanel from "./tracking-control-panel";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

vi.mock("../atoms/glass-card", () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock("../atoms/stat-display", () => ({
  default: ({ label, value }: { label: string; value: string }) => (
    <div>
      {label}: {value}
    </div>
  ),
}));

vi.mock("./weather-panel", () => ({
  default: () => <div className="weather-panel" />,
}));

describe("TrackingControlPanel", () => {
  const mockSetShowAirspace = vi.fn();

  it("renders current heading", () => {
    render(
      <TrackingControlPanel
        currentHeading={180}
        showAirspace={false}
        setShowAirspace={mockSetShowAirspace}
        weatherLocation={{ lat: 41.52, lng: 2.1 }}
      />
    );
    expect(screen.getByText(/180°/)).toBeInTheDocument();
  });

  it("renders airspace toggle button", () => {
    render(
      <TrackingControlPanel
        currentHeading={180}
        showAirspace={false}
        setShowAirspace={mockSetShowAirspace}
        weatherLocation={{ lat: 41.52, lng: 2.1 }}
      />
    );
    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toBeInTheDocument();
  });

  it("calls setShowAirspace when toggle button clicked", () => {
    render(
      <TrackingControlPanel
        currentHeading={180}
        showAirspace={false}
        setShowAirspace={mockSetShowAirspace}
        weatherLocation={{ lat: 41.52, lng: 2.1 }}
      />
    );
    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);
    expect(mockSetShowAirspace).toHaveBeenCalledWith(true);
  });

  it("renders weather panel when location provided", () => {
    const { container } = render(
      <TrackingControlPanel
        currentHeading={180}
        showAirspace={false}
        setShowAirspace={mockSetShowAirspace}
        weatherLocation={{ lat: 41.52, lng: 2.1 }}
      />
    );
    expect(container.querySelector(".weather-panel")).toBeInTheDocument();
  });

  it("updates airspace display state", () => {
    const { rerender } = render(
      <TrackingControlPanel
        currentHeading={180}
        showAirspace={false}
        setShowAirspace={mockSetShowAirspace}
        weatherLocation={{ lat: 41.52, lng: 2.1 }}
      />
    );
    rerender(
      <TrackingControlPanel
        currentHeading={180}
        showAirspace={true}
        setShowAirspace={mockSetShowAirspace}
        weatherLocation={{ lat: 41.52, lng: 2.1 }}
      />
    );
    expect(mockSetShowAirspace).toHaveBeenCalled();
  });

  it("handles null weather location", () => {
    const { container } = render(
      <TrackingControlPanel
        currentHeading={180}
        showAirspace={false}
        setShowAirspace={mockSetShowAirspace}
        weatherLocation={null}
      />
    );
    expect(container.querySelector(".weather-panel")).toBeInTheDocument();
  });
});
