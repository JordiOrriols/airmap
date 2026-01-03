import { render, screen } from "@testing-library/react";
import CardHeader from "./card-header";
import { describe, it, expect } from "vitest";

describe("CardHeader", () => {
  it("renders title", () => {
    render(<CardHeader title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<CardHeader title="Test" subtitle="Subtitle" />);
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
  });

  it("handles missing subtitle gracefully", () => {
    render(<CardHeader title="Test" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("applies title styling", () => {
    render(<CardHeader title="Test Title" />);
    const heading = screen.getByText("Test Title");
    expect(heading).toHaveClass("text-xl", "font-bold", "text-app-primary");
  });

  it("applies custom className", () => {
    const { container } = render(
      <CardHeader title="Test" className="custom-class" />
    );
    const element = container.firstChild;
    expect(element).toHaveClass("custom-class");
  });

  it("renders header with flex layout", () => {
    const { container } = render(<CardHeader title="Test" />);
    const element = container.firstChild;
    expect(element).toHaveClass("flex", "items-start", "justify-between");
  });

  it("renders actions when provided", () => {
    render(
      <CardHeader
        title="Test"
        actions={<button>Action</button>}
      />
    );
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});
