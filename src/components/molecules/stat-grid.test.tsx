import { render, screen } from "@testing-library/react";
import StatGrid from "./stat-grid";
import { describe, it, expect } from "vitest";

describe("StatGrid", () => {
  it.each([
    {
      items: [
        { key: "stat1", label: "Distance", value: "100", unit: "km" },
        { key: "stat2", label: "Time", value: "2", unit: "h" },
      ],
      expectedLabels: ["Distance", "Time"],
      expectedValues: ["100", "2"],
    },
    {
      items: [{ key: "stat1", label: "Speed", value: "50", unit: "kt" }],
      expectedLabels: ["Speed"],
      expectedValues: ["50"],
    },
    {
      items: [
        { key: "alt1", label: "Altitude", value: "5000", unit: "ft" },
        { key: "alt2", label: "Climb Rate", value: "500", unit: "fpm" },
        { key: "alt3", label: "Heading", value: "180", unit: "°" },
      ],
      expectedLabels: ["Altitude", "Climb Rate", "Heading"],
      expectedValues: ["5000", "500", "180"],
    },
  ])(
    "renders multiple stat items with labels and values",
    ({ items, expectedLabels, expectedValues }) => {
      render(<StatGrid items={items} />);
      expectedLabels.forEach((label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
      expectedValues.forEach((value) => {
        expect(screen.getByText(value)).toBeInTheDocument();
      });
    }
  );

  it("applies correct grid column classes", () => {
    const items = [{ key: "stat1", label: "Test", value: "123" }];
    const { container } = render(<StatGrid items={items} columns={3} />);
    const gridDiv = container.firstChild;
    expect(gridDiv).toHaveClass("grid", "gap-3");
  });

  it("handles empty items array", () => {
    const { container } = render(<StatGrid items={[]} />);
    const gridDiv = container.firstChild;
    expect(gridDiv).toBeInTheDocument();
    expect(screen.queryByText(/^[A-Z]/)).not.toBeInTheDocument();
  });

  it("applies custom className to grid", () => {
    const items = [{ key: "stat1", label: "Test", value: "123" }];
    const { container } = render(<StatGrid items={items} className="custom-class" />);
    const gridDiv = container.firstChild;
    expect(gridDiv).toHaveClass("custom-class");
  });
});
