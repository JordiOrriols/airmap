import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Input } from "./input";

describe("Input Component", () => {
  it("should render input element", () => {
    const { container } = render(<Input />);
    const input = container.querySelector("input");
    expect(input).toBeInTheDocument();
  });

  it.each([
    { type: undefined, expected: "text" },
    { type: "email", expected: "email" },
    { type: "password", expected: "password" },
    { type: "number", expected: "number" },
  ])("should render with $expected type", ({ type, expected }) => {
    const { container } = render(<Input type={type as any} />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.type).toBe(expected);
  });

  it("should have data-slot attribute", () => {
    const { container } = render(<Input />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("data-slot", "input");
  });

  it("should accept placeholder", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
  });

  it("should accept value prop", () => {
    const { container } = render(<Input value="test value" onChange={() => {}} />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("test value");
  });

  it("should accept disabled prop", () => {
    const { container } = render(<Input disabled />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it("should accept className", () => {
    const { container } = render(<Input className="custom-class" />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("custom-class");
  });

  it("should have correct base classes", () => {
    const { container } = render(<Input />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("rounded-md");
    expect(input).toHaveClass("border");
    expect(input).toHaveClass("h-9");
  });

  it("should accept onChange handler", () => {
    let value = "";
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      value = e.target.value;
    };
    const { container } = render(<Input onChange={handleChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input).toBeInTheDocument();
  });

  it("should accept other input attributes", () => {
    const { container } = render(<Input data-testid="custom-input" maxLength={10} />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("data-testid", "custom-input");
    expect(input).toHaveAttribute("maxLength", "10");
  });

  it("should support aria-invalid for validation", () => {
    const { container } = render(<Input aria-invalid="true" />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("aria-invalid:border-destructive");
  });
});
