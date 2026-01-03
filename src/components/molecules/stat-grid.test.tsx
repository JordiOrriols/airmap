import { render, screen } from "@testing-library/react";
import StatGrid from "./stat-grid";
import { describe, it, expect } from "vitest";

describe("StatGrid", () => {
  it("renders stat grid with items", () => {
    const items = [
      { key: "stat1", label: "Distance", value: "100", unit: "km" },
      { key: "stat2", label: "Time", value: "2", unit: "h" },
    ];
    const { container } = render(<StatGrid items={items} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders stat grid labels", () => {
    const items = [
      { key: "stat1", label: "Distance", value: "100", unit: "km" },
    ];
    render(<StatGrid items={items} />);
    expect(screen.getByText("Distance")).toBeInTheDocument();
  });

  it("renders stat grid values", () => {
    const items = [
      { key: "stat1", label: "Distance", value: "100", unit: "km" },
    ];
    render(<StatGrid items={items} />);
    expect(screen.getByText("100")).toBeInTheDocument();
  });
});
