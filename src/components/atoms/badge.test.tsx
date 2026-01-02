import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import Badge from "./badge";

describe("Badge Component", () => {
  it.each([
    { size: undefined, widthClass: "w-8", heightClass: "h-8", label: "default" },
    { size: "sm" as const, widthClass: "w-7", heightClass: "h-7", label: "small" },
    { size: "lg" as const, widthClass: "w-10", heightClass: "h-10", label: "large" },
  ])("should render badge with $label size", ({ size, widthClass, heightClass }) => {
    const { container } = render(<Badge size={size}>Badge</Badge>);
    const badge = container.querySelector("div");
    expect(badge).toHaveClass(widthClass);
    expect(badge).toHaveClass(heightClass);
  });

  it("should render badge with default gradient", () => {
    const { container } = render(<Badge>Test</Badge>);
    const badge = container.querySelector("div");
    expect(badge?.className).toContain("from-pink-500");
    expect(badge?.className).toContain("to-purple-500");
  });

  it("should render badge with custom gradient", () => {
    const { container } = render(<Badge gradient="from-blue-500 to-cyan-500">Custom</Badge>);
    const badge = container.querySelector("div");
    expect(badge?.className).toContain("from-blue-500");
    expect(badge?.className).toContain("to-cyan-500");
  });

  it("should render badge with children", () => {
    render(<Badge>42</Badge>);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(<Badge className="custom-class">Badge</Badge>);
    const badge = container.querySelector("div");
    expect(badge).toHaveClass("custom-class");
  });

  it("should have correct base classes", () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.querySelector("div");
    expect(badge).toHaveClass("bg-gradient-to-br");
    expect(badge).toHaveClass("flex");
    expect(badge).toHaveClass("items-center");
    expect(badge).toHaveClass("justify-center");
    expect(badge).toHaveClass("text-white");
    expect(badge).toHaveClass("font-bold");
  });

  it.each([
    { size: "sm" as const, textClass: "text-xs" },
    { size: "lg" as const, textClass: "text-lg" },
  ])("should render with correct text size for $size", ({ size, textClass }) => {
    const { container } = render(<Badge size={size}>Badge</Badge>);
    const badge = container.querySelector("div");
    expect(badge?.className).toContain(textClass);
  });

  it("should render with empty children", () => {
    const { container } = render(<Badge />);
    const badge = container.querySelector("div");
    expect(badge).toBeInTheDocument();
  });
});
