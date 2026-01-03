import { render, screen } from "@testing-library/react";
import GlassCard from "./glass-card";
import { describe, it, expect } from "vitest";

describe("GlassCard", () => {
  it("renders children content", () => {
    render(<GlassCard>Test Content</GlassCard>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies default glassmorphism styling", () => {
    const { container } = render(<GlassCard>Test</GlassCard>);
    const element = container.firstChild;
    expect(element).toHaveClass(
      "bg-card-app",
      "backdrop-blur-xs",
      "border",
      "border-app-secondary"
    );
  });

  it("applies custom className", () => {
    const { container } = render(
      <GlassCard className="custom-class">Test</GlassCard>
    );
    const element = container.firstChild;
    expect(element).toHaveClass("custom-class");
  });

  it("renders with rounded corners", () => {
    const { container } = render(<GlassCard>Test</GlassCard>);
    const element = container.firstChild;
    expect(element).toHaveClass("rounded-3xl");
  });

  it("renders multiple children", () => {
    render(
      <GlassCard>
        <div>First</div>
        <div>Second</div>
      </GlassCard>
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("renders as div element", () => {
    const { container } = render(<GlassCard>Test</GlassCard>);
    const divElement = container.firstChild;
    expect(divElement?.nodeName).toBe("DIV");
  });
});
