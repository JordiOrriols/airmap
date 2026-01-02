import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import Badge from "./badge";

describe("Badge Component", () => {
  it("should render badge with default size", () => {
    const { container } = render(<Badge>5</Badge>);
    const badge = container.querySelector("div");
    expect(badge).toHaveClass("w-8");
    expect(badge).toHaveClass("h-8");
  });

  it("should render badge with small size", () => {
    const { container } = render(<Badge size="sm">1</Badge>);
    const badge = container.querySelector("div");
    expect(badge).toHaveClass("w-7");
    expect(badge).toHaveClass("h-7");
  });

  it("should render badge with large size", () => {
    const { container } = render(<Badge size="lg">10</Badge>);
    const badge = container.querySelector("div");
    expect(badge).toHaveClass("w-10");
    expect(badge).toHaveClass("h-10");
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

  it("should render with correct text size for small", () => {
    const { container } = render(<Badge size="sm">S</Badge>);
    const badge = container.querySelector("div");
    expect(badge?.className).toContain("text-xs");
  });

  it("should render with correct text size for large", () => {
    const { container } = render(<Badge size="lg">L</Badge>);
    const badge = container.querySelector("div");
    expect(badge?.className).toContain("text-lg");
  });

  it("should render with empty children", () => {
    const { container } = render(<Badge />);
    const badge = container.querySelector("div");
    expect(badge).toBeInTheDocument();
  });
});
