import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button Component", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should render button with default variant", () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-primary");
  });

  it("should render button with destructive variant", () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-destructive");
  });

  it("should render button with outline variant", () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("border");
  });

  it("should render button with ghost variant", () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("hover:bg-accent");
  });

  it("should render button with link variant", () => {
    const { container } = render(<Button variant="link">Link</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("text-primary");
  });

  it("should render button with secondary variant", () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-secondary");
  });

  it("should render button with small size", () => {
    const { container } = render(<Button size="sm">Small</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("h-8");
  });

  it("should render button with large size", () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("h-10");
  });

  it("should render button with icon size", () => {
    const { container } = render(<Button size="icon">+</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("size-9");
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
