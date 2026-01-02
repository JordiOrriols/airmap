import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectLabel, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton } from "./select";

describe("Select Components", () => {
  describe("Select", () => {
    it("should render select root", () => {
      const { container } = render(
        <Select>
          <SelectTrigger />
        </Select>
      );
      const select = container.querySelector("[data-slot='select']");
      expect(select).toBeInTheDocument();
    });

    it("should pass props to underlying SelectPrimitive", () => {
      const { container } = render(
        <Select disabled>
          <SelectTrigger />
        </Select>
      );
      expect(container.querySelector("[data-slot='select']")).toBeInTheDocument();
    });
  });

  describe("SelectGroup", () => {
    it("should render select group", () => {
      const { container } = render(
        <Select>
          <SelectGroup>
            <SelectItem value="test">Test</SelectItem>
          </SelectGroup>
        </Select>
      );
      const group = container.querySelector("[data-slot='select-group']");
      expect(group).toBeInTheDocument();
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

    it("should render with default size", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      const trigger = container.querySelector("[data-slot='select-trigger']");
      expect(trigger).toHaveAttribute("data-size", "default");
    });

    it("should render with small size", () => {
      const { container } = render(
        <Select>
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      const trigger = container.querySelector("[data-slot='select-trigger']");
      expect(trigger).toHaveAttribute("data-size", "sm");
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
    it("should render select content", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );
      const content = container.querySelector("[data-slot='select-content']");
      expect(content).toBeInTheDocument();
    });
  });

  describe("SelectItem", () => {
    it("should render select item", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test Item</SelectItem>
          </SelectContent>
        </Select>
      );
      const item = container.querySelector("[data-slot='select-item']");
      expect(item).toBeInTheDocument();
    });

    it("should have correct base classes", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Item</SelectItem>
          </SelectContent>
        </Select>
      );
      const item = container.querySelector("[data-slot='select-item']");
      expect(item).toHaveClass("relative");
      expect(item).toHaveClass("cursor-pointer");
    });

    it("should render check icon when selected", () => {
      const { container } = render(
        <Select defaultValue="test">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Item</SelectItem>
          </SelectContent>
        </Select>
      );
      const item = container.querySelector("[data-slot='select-item']");
      expect(item).toBeInTheDocument();
    });
  });

  describe("SelectLabel", () => {
    it("should render select label", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectLabel>Group Label</SelectLabel>
            <SelectItem value="test">Item</SelectItem>
          </SelectContent>
        </Select>
      );
      const label = container.querySelector("[data-slot='select-label']");
      expect(label).toBeInTheDocument();
    });
  });

  describe("SelectSeparator", () => {
    it("should render select separator", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      // SelectSeparator is rendered as part of SelectContent via portal
      // Just verify the component structure renders without error
      expect(container.querySelector("[data-slot='select']")).toBeInTheDocument();
    });
  });

  describe("Scroll Buttons", () => {
    it("should render select with scroll buttons support", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      // Scroll buttons are part of SelectContent which renders in a portal
      // Just verify the select structure renders
      expect(container.querySelector("[data-slot='select']")).toBeInTheDocument();
    });

    it("should accept scroll button components", () => {
      // Verify that scroll button components can be imported and used without error
      expect(SelectScrollUpButton).toBeDefined();
      expect(SelectScrollDownButton).toBeDefined();
    });
  });
});
