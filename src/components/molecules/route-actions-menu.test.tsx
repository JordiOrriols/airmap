import { render, screen } from "@testing-library/react";
import RouteActionMenu from "./route-actions-menu";
import { describe, it, expect, vi } from "vitest";

describe("RouteActionsMenu", () => {
  const mockHandlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onExport: vi.fn(),
  };

  it("renders menu button", () => {
    render(
      <RouteActionMenu
        routeId="test-route"
        routeName="Test Route"
        {...mockHandlers}
      />
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("has menu trigger icon", () => {
    const { container } = render(
      <RouteActionMenu
        routeId="test-route"
        routeName="Test Route"
        {...mockHandlers}
      />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
