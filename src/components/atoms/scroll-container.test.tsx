import { render, screen } from "@testing-library/react";
import ScrollContainer from "./scroll-container";
import { describe, it, expect } from "vitest";

describe("ScrollContainer", () => {
  it("renders children", () => {
    render(
      <ScrollContainer>
        <div>Scrollable Content</div>
      </ScrollContainer>
    );
    expect(screen.getByText("Scrollable Content")).toBeInTheDocument();
  });

  it("applies custom scrollbar styling", () => {
    const { container } = render(
      <ScrollContainer>
        <div>Content</div>
      </ScrollContainer>
    );
    const element = container.firstChild;
    expect(element).toHaveClass("custom-scrollbar");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ScrollContainer className="custom-class">
        <div>Content</div>
      </ScrollContainer>
    );
    const element = container.firstChild;
    expect(element).toHaveClass("custom-class", "custom-scrollbar");
  });

  it("renders multiple children", () => {
    render(
      <ScrollContainer>
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </ScrollContainer>
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.getByText("Third")).toBeInTheDocument();
  });

  it("maintains scroll container structure", () => {
    const { container } = render(
      <ScrollContainer>
        <div>Content</div>
      </ScrollContainer>
    );
    const divElement = container.firstChild;
    expect(divElement?.nodeName).toBe("DIV");
  });

  it("accepts style prop", () => {
    const { container } = render(
      <ScrollContainer style={{ height: "100px" }}>
        <div>Content</div>
      </ScrollContainer>
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.height).toBe("100px");
  });
});
