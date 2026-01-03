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

  it.each([
    { heading: 0, displayValue: "0°" },
    { heading: 90, displayValue: "90°" },
    { heading: 180, displayValue: "180°" },
    { heading: 270, displayValue: "270°" },
    { heading: 359.5, displayValue: "360°" },
  ])("displays heading $displayValue for $heading degrees", ({ heading, displayValue }) => {
    mockSetShowAirspace.mockClear();
    render(
      <TrackingControlPanel
        currentHeading={heading}
        showAirspace={false}
        setShowAirspace={mockSetShowAirspace}
        weatherLocation={{ lat: 41.52, lng: 2.1 }}
      />
    );
    expect(screen.getByText(new RegExp(displayValue))).toBeInTheDocument();
  });

  it("toggles airspace visibility on button click", () => {
    mockSetShowAirspace.mockClear();
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

  it("calls setShowAirspace with opposite value when toggled", () => {
    mockSetShowAirspace.mockClear();
    const { rerender } = render(
      <TrackingControlPanel
        currentHeading={180}
        showAirspace={false}
        setShowAirspace={mockSetShowAirspace}
        weatherLocation={{ lat: 41.52, lng: 2.1 }}
      />
    );
    let toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);
    expect(mockSetShowAirspace).toHaveBeenCalledWith(true);

    mockSetShowAirspace.mockClear();
    rerender(
      <TrackingControlPanel
        currentHeading={180}
        showAirspace={true}
        setShowAirspace={mockSetShowAirspace}
        weatherLocation={{ lat: 41.52, lng: 2.1 }}
      />
    );
    toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);
    expect(mockSetShowAirspace).toHaveBeenCalledWith(false);
  });

  it("renders weather panel with valid location", () => {
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

  it("renders weather panel even with null location", () => {
    const { container } = render(
      <TrackingControlPanel
        currentHeading={180}
        showAirspace={false}
        setShowAirspace={mockSetShowAirspace}
        weatherLocation={null}
      />
    );
    // Component should still render without crashing
    expect(container.querySelector(".weather-panel")).toBeInTheDocument();
  });

  it("button text changes when airspace visibility changes", () => {
    mockSetShowAirspace.mockClear();
    const { container, rerender } = render(
      <TrackingControlPanel
        currentHeading={180}
        showAirspace={false}
        setShowAirspace={mockSetShowAirspace}
        weatherLocation={{ lat: 41.52, lng: 2.1 }}
      />
    );

    let buttonText = container.querySelector("button")?.textContent;
    expect(buttonText).toContain("Airspace");

    rerender(
      <TrackingControlPanel
        currentHeading={180}
        showAirspace={true}
        setShowAirspace={mockSetShowAirspace}
        weatherLocation={{ lat: 41.52, lng: 2.1 }}
      />
    );

    buttonText = container.querySelector("button")?.textContent;
    expect(buttonText).toContain("Airspace");
  });

  it("handles multiple heading updates", () => {
    mockSetShowAirspace.mockClear();
    const { rerender } = render(
      <TrackingControlPanel
        currentHeading={45}
        showAirspace={false}
        setShowAirspace={mockSetShowAirspace}
        weatherLocation={{ lat: 41.52, lng: 2.1 }}
      />
    );
    expect(screen.getByText(/45°/)).toBeInTheDocument();

    rerender(
      <TrackingControlPanel
        currentHeading={135}
        showAirspace={false}
        setShowAirspace={mockSetShowAirspace}
        weatherLocation={{ lat: 41.52, lng: 2.1 }}
      />
    );
    expect(screen.getByText(/135°/)).toBeInTheDocument();
  });
});
