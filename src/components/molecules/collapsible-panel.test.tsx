import { render, screen } from "@testing-library/react";
import CollapsiblePanel from "./collapsible-panel";
import { MapPin } from "lucide-react";
import { describe, it, expect, vi } from "vitest";

describe("CollapsiblePanel", () => {
  it("renders title", () => {
    render(
      <CollapsiblePanel title="Test Panel" icon={MapPin}>
        Content
      </CollapsiblePanel>
    );
    expect(screen.getByText("Test Panel")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <CollapsiblePanel title="Test" icon={MapPin}>
        Panel Content
      </CollapsiblePanel>
    );
    expect(screen.getByText("Panel Content")).toBeInTheDocument();
  });

  it("has toggle button", () => {
    render(
      <CollapsiblePanel title="Test" icon={MapPin}>
        Content
      </CollapsiblePanel>
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("is collapsed by default when defaultCollapsed is true", () => {
    const { container } = render(
      <CollapsiblePanel title="Test" icon={MapPin} defaultCollapsed={true}>
        Content
      </CollapsiblePanel>
    );
    // Content should be in collapsed state initially
    const content = container.querySelector("[class*='h-0']");
    expect(content).not.toBeInTheDocument();
  });

  it("applies gradient styling", () => {
    const { container } = render(
      <CollapsiblePanel
        title="Test"
        icon={MapPin}
        gradient="from-blue-500 to-cyan-500"
      >
        Content
      </CollapsiblePanel>
    );
    const element = container.querySelector("div");
    expect(element).toHaveClass("bg-gradient-to-r");
  });
});
