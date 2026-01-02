import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { TestIcon } from "lucide-react";
import StatDisplay from "./stat-display";

describe("StatDisplay Component", () => {
  const mockIcon = TestIcon;

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

  it("should render with default size", () => {
    const { container } = render(
      <StatDisplay
        icon={mockIcon}
        label="Altitude"
        value="5000"
      />
    );
    const stat = container.querySelector("div");
    expect(stat?.className).toContain("text-3xl");
    expect(stat?.className).toContain("p-4");
    expect(stat?.className).toContain("rounded-2xl");
  });

  it("should render with compact size", () => {
    const { container } = render(
      <StatDisplay
        icon={mockIcon}
        label="Distance"
        value="50"
        size="compact"
      />
    );
    const stat = container.querySelector("div");
    expect(stat?.className).toContain("text-md");
    expect(stat?.className).toContain("p-2");
    expect(stat?.className).toContain("rounded-md");
  });

  it("should render with default icon color", () => {
    const { container } = render(
      <StatDisplay
        icon={mockIcon}
        label="Heading"
        value="180"
      />
    );
    const stat = container.querySelector("div");
    expect(stat?.className).toContain("text-cyan-300");
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
    const stat = container.querySelector("div");
    expect(stat?.className).toContain("text-red-400");
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
