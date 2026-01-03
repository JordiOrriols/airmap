import { render, screen, fireEvent } from "@testing-library/react";
import { Home } from "lucide-react";
import IconButton from "./icon-button";
import { describe, it, expect, vi } from "vitest";

describe("IconButton", () => {
  it("renders icon button with icon", () => {
    render(
      <IconButton icon={Home} onClick={vi.fn()} ariaLabel="Test Home" />
    );
    const button = screen.getByRole("button", { name: "Test Home" });
    expect(button).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(
      <IconButton icon={Home} onClick={handleClick} ariaLabel="Test Home" />
    );
    const button = screen.getByRole("button", { name: "Test Home" });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("has correct aria-label", () => {
    render(
      <IconButton
        icon={Home}
        onClick={vi.fn()}
        ariaLabel="Custom Label"
      />
    );
    const button = screen.getByRole("button", { name: "Custom Label" });
    expect(button).toHaveAttribute("aria-label", "Custom Label");
  });

  it("applies custom className", () => {
    render(
      <IconButton
        icon={Home}
        onClick={vi.fn()}
        ariaLabel="Test"
        className="custom-class"
      />
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("has default styling classes", () => {
    render(
      <IconButton icon={Home} onClick={vi.fn()} ariaLabel="Test" />
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "h-9",
      "w-9",
      "inline-flex",
      "rounded-md",
      "border",
      "bg-button-ghost"
    );
  });

  it("renders icon with correct size", () => {
    render(
      <IconButton icon={Home} onClick={vi.fn()} ariaLabel="Test" />
    );
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toHaveClass("w-4", "h-4");
  });
});
