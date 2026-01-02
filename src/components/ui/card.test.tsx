import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "./card";

describe("Card Components", () => {
  describe("Card", () => {
    it("should render card with correct structure", () => {
      const { container } = render(<Card>Card content</Card>);
      const card = container.querySelector("[data-slot='card']");
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass("bg-card");
      expect(card).toHaveClass("rounded-xl");
      expect(card).toHaveClass("border");
    });

    it("should accept additional className", () => {
      const { container } = render(<Card className="custom-class">Card</Card>);
      const card = container.querySelector("[data-slot='card']");
      expect(card).toHaveClass("custom-class");
    });

    it("should render children", () => {
      const { container } = render(
        <Card>
          <div>Child content</div>
        </Card>
      );
      expect(container.textContent).toContain("Child content");
    });
  });

  describe("CardHeader", () => {
    it("should render card header", () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      const header = container.querySelector("[data-slot='card-header']");
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass("px-6");
    });

    it("should accept additional className", () => {
      const { container } = render(<CardHeader className="custom">Header</CardHeader>);
      const header = container.querySelector("[data-slot='card-header']");
      expect(header).toHaveClass("custom");
    });
  });

  describe("CardTitle", () => {
    it("should render card title", () => {
      const { container } = render(<CardTitle>Title</CardTitle>);
      const title = container.querySelector("[data-slot='card-title']");
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass("font-semibold");
    });

    it("should accept additional className", () => {
      const { container } = render(<CardTitle className="custom">Title</CardTitle>);
      const title = container.querySelector("[data-slot='card-title']");
      expect(title).toHaveClass("custom");
    });
  });

  describe("CardDescription", () => {
    it("should render card description", () => {
      const { container } = render(<CardDescription>Description</CardDescription>);
      const description = container.querySelector("[data-slot='card-description']");
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass("text-muted-foreground");
      expect(description).toHaveClass("text-sm");
    });

    it("should accept additional className", () => {
      const { container } = render(<CardDescription className="custom">Desc</CardDescription>);
      const description = container.querySelector("[data-slot='card-description']");
      expect(description).toHaveClass("custom");
    });
  });

  describe("CardAction", () => {
    it("should render card action", () => {
      const { container } = render(<CardAction>Action</CardAction>);
      const action = container.querySelector("[data-slot='card-action']");
      expect(action).toBeInTheDocument();
      expect(action).toHaveClass("col-start-2");
    });

    it("should accept additional className", () => {
      const { container } = render(<CardAction className="custom">Action</CardAction>);
      const action = container.querySelector("[data-slot='card-action']");
      expect(action).toHaveClass("custom");
    });
  });

  describe("CardContent", () => {
    it("should render card content", () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const content = container.querySelector("[data-slot='card-content']");
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass("px-6");
    });

    it("should accept additional className", () => {
      const { container } = render(<CardContent className="custom">Content</CardContent>);
      const content = container.querySelector("[data-slot='card-content']");
      expect(content).toHaveClass("custom");
    });
  });

  describe("CardFooter", () => {
    it("should render card footer", () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      const footer = container.querySelector("[data-slot='card-footer']");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass("px-6");
    });

    it("should accept additional className", () => {
      const { container } = render(<CardFooter className="custom">Footer</CardFooter>);
      const footer = container.querySelector("[data-slot='card-footer']");
      expect(footer).toHaveClass("custom");
    });
  });

  describe("Card Composition", () => {
    it("should render complete card structure", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
            <CardAction>Action</CardAction>
          </CardHeader>
          <CardContent>Main content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      );

      expect(container.querySelector("[data-slot='card']")).toBeInTheDocument();
      expect(container.querySelector("[data-slot='card-header']")).toBeInTheDocument();
      expect(container.querySelector("[data-slot='card-title']")).toBeInTheDocument();
      expect(container.querySelector("[data-slot='card-description']")).toBeInTheDocument();
      expect(container.querySelector("[data-slot='card-action']")).toBeInTheDocument();
      expect(container.querySelector("[data-slot='card-content']")).toBeInTheDocument();
      expect(container.querySelector("[data-slot='card-footer']")).toBeInTheDocument();
    });
  });
});
