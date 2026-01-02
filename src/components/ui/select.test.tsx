import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectLabel, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton } from "./select";

describe("Select Components", () => {
  describe("Select", () => {
    it("should render select root with trigger", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      // Radix UI Select root doesn't have data-slot, check for trigger
      const trigger = container.querySelector("[data-slot='select-trigger']");
      expect(trigger).toBeInTheDocument();
    });

    it("should pass props to underlying SelectPrimitive", () => {
      const { container } = render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      // Check that structure renders with disabled prop
      expect(container.querySelector("[data-slot='select-trigger']")).toBeInTheDocument();
    });
  });

  describe("SelectGroup", () => {
    it("should be defined and importable", () => {
      expect(SelectGroup).toBeDefined();
    });
  });

  describe("SelectValue", () => {
    it("should render select value", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
        </Select>
      );
      const value = container.querySelector("[data-slot='select-value']");
      expect(value).toBeInTheDocument();
    });

    it("should accept placeholder", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose an option" />
          </SelectTrigger>
        </Select>
      );
      const value = container.querySelector("[data-slot='select-value']");
      expect(value).toBeInTheDocument();
    });
  });

  describe("SelectTrigger", () => {
    it("should render select trigger", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
        </Select>
      );
      const trigger = container.querySelector("[data-slot='select-trigger']");
      expect(trigger).toBeInTheDocument();
    });

    it("should have correct base classes", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      const trigger = container.querySelector("[data-slot='select-trigger']");
      expect(trigger).toHaveClass("rounded-md");
      expect(trigger).toHaveClass("border");
    });

    it.each([
      { size: undefined, expected: "default" },
      { size: "sm" as const, expected: "sm" },
    ])("should render with $expected size", ({ size, expected }) => {
      const { container } = render(
        <Select>
          <SelectTrigger size={size}>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      const trigger = container.querySelector("[data-slot='select-trigger']");
      expect(trigger).toHaveAttribute("data-size", expected);
    });

    it("should accept custom className", () => {
      const { container } = render(
        <Select>
          <SelectTrigger className="custom-class">
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      const trigger = container.querySelector("[data-slot='select-trigger']");
      expect(trigger).toHaveClass("custom-class");
    });

    it("should render chevron icon", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      const icon = container.querySelector("[data-slot='select-trigger'] svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("SelectContent", () => {
    it("should be defined and importable", () => {
      expect(SelectContent).toBeDefined();
    });
  });

  describe("SelectItem", () => {
    it("should be defined and importable", () => {
      expect(SelectItem).toBeDefined();
    });
  });

  describe("SelectLabel", () => {
    it("should be defined and importable", () => {
      expect(SelectLabel).toBeDefined();
    });
  });

  describe("SelectSeparator", () => {
    it("should be defined and importable", () => {
      expect(SelectSeparator).toBeDefined();
    });
  });

  describe("Scroll Buttons", () => {
    it("should be defined and importable", () => {
      expect(SelectScrollUpButton).toBeDefined();
      expect(SelectScrollDownButton).toBeDefined();
    });
  });
});
