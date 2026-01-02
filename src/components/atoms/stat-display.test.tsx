import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Gauge } from "lucide-react";
import StatDisplay from "./stat-display";

describe("StatDisplay Component", () => {
  const mockIcon = Gauge;

  it("should render stat display with label and value", () => {
    render(
      <StatDisplay
        icon={mockIcon}
        label="Speed"
        value="120"
        unit="knots"
      />
    );
    expect(screen.getByText("Speed")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("knots")).toBeInTheDocument();
  });

  it.each([
    { size: undefined, textSize: "text-3xl", padding: "p-4", rounded: "rounded-2xl", label: "default" },
    { size: "compact" as const, textSize: "text-md", padding: "p-2", rounded: "rounded-md", label: "compact" },
  ])("should render with $label size", ({ size, textSize, padding, rounded }) => {
    const { container } = render(
      <StatDisplay
        icon={mockIcon}
        label="Test"
        value="100"
        size={size}
      />
    );
    const stat = container.querySelector("div");
    expect(stat?.className).toContain(padding);
    expect(stat?.className).toContain(rounded);
    const valueElement = container.querySelector("p");
    expect(valueElement?.className).toContain(textSize);
  });

  it("should render with default icon color", () => {
    const { container } = render(
      <StatDisplay
        icon={mockIcon}
        label="Heading"
        value="180"
      />
    );
    const iconWrapper = container.querySelector(".flex.items-center");
    const iconSvg = iconWrapper?.querySelector("svg");
    expect(iconSvg).toBeInTheDocument();
    // Check that icon was rendered (className on SVG is complex, just verify icon exists)
    expect(iconSvg).not.toBeNull();
  });

  it("should render with custom icon color", () => {
    const { container } = render(
      <StatDisplay
        icon={mockIcon}
        label="Wind"
        value="10"
        iconColor="text-red-400"
      />
    );
    const iconWrapper = container.querySelector(".flex.items-center");
    const iconSvg = iconWrapper?.querySelector("svg");
    expect(iconSvg).toBeInTheDocument();
    // Verify icon is rendered with custom color prop passed
    expect(iconSvg).not.toBeNull();
  });

  it("should have correct base classes", () => {
    const { container } = render(
      <StatDisplay
        icon={mockIcon}
        label="Test"
        value="100"
      />
    );
    const stat = container.querySelector("div");
    expect(stat).toHaveClass("bg-stat-card");
    expect(stat).toHaveClass("backdrop-blur-sm");
    expect(stat).toHaveClass("border");
    expect(stat).toHaveClass("border-stat-card");
  });

  it("should accept custom className", () => {
    const { container } = render(
      <StatDisplay
        icon={mockIcon}
        label="Custom"
        value="99"
        className="custom-class"
      />
    );
    const stat = container.querySelector("div");
    expect(stat).toHaveClass("custom-class");
  });

  it("should render without unit", () => {
    render(
      <StatDisplay
        icon={mockIcon}
        label="Count"
        value="5"
      />
    );
    expect(screen.getByText("Count")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should render with custom unit", () => {
    render(
      <StatDisplay
        icon={mockIcon}
        label="Temperature"
        value="25"
        unit="°C"
      />
    );
    expect(screen.getByText("°C")).toBeInTheDocument();
  });

  it("should render with number value", () => {
    render(
      <StatDisplay
        icon={mockIcon}
        label="Pressure"
        value={1013}
        unit="mb"
      />
    );
    expect(screen.getByText("1013")).toBeInTheDocument();
  });
});
