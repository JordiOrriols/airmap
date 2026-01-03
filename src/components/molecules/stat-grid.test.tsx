import { render, screen } from "@testing-library/react";
import StatGrid from "./stat-grid";
import { describe, it, expect } from "vitest";

describe("StatGrid", () => {
  it("renders stat grid container", () => {
    const { container } = render(
      <StatGrid>
        <div>Stat 1</div>
      </StatGrid>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <StatGrid>
        <div>Stat 1</div>
        <div>Stat 2</div>
      </StatGrid>
    );
    expect(screen.getByText("Stat 1")).toBeInTheDocument();
    expect(screen.getByText("Stat 2")).toBeInTheDocument();
  });

  it("applies grid styling", () => {
    const { container } = render(
      <StatGrid>
        <div>Stat</div>
      </StatGrid>
    );
    const element = container.firstChild;
    expect(element).toHaveClass("grid", "gap-3");
  });
});
