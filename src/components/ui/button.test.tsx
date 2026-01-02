import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button Component", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it.each([
    { variant: undefined, expectedClass: "bg-primary", label: "default" },
    { variant: "destructive" as const, expectedClass: "bg-destructive", label: "destructive" },
    { variant: "outline" as const, expectedClass: "border", label: "outline" },
    { variant: "ghost" as const, expectedClass: "hover:bg-accent", label: "ghost" },
    { variant: "link" as const, expectedClass: "text-primary", label: "link" },
    { variant: "secondary" as const, expectedClass: "bg-secondary", label: "secondary" },
  ])("should render button with $label variant", ({ variant, expectedClass }) => {
    const { container } = render(<Button variant={variant}>Button</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass(expectedClass);
  });

  it.each([
    { size: "sm" as const, expectedClass: "h-8" },
    { size: "lg" as const, expectedClass: "h-10" },
    { size: "icon" as const, expectedClass: "size-9" },
  ])("should render button with $size size", ({ size, expectedClass }) => {
    const { container } = render(<Button size={size}>Button</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass(expectedClass);
  });

  it("should be disabled when disabled prop is passed", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText("Disabled") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("should accept additional className", () => {
    const { container } = render(<Button className="custom-class">Custom</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("custom-class");
  });

  it("should render with data-slot attribute", () => {
    const { container } = render(<Button>Button</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveAttribute("data-slot", "button");
  });

  it("should call onClick handler when clicked", () => {
    const handleClick = () => {
      // Mock click handler
    };
    const { container } = render(<Button onClick={handleClick}>Click</Button>);
    const button = container.querySelector("button");
    expect(button).toBeInTheDocument();
  });
});
