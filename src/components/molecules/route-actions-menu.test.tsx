import { render, screen } from "@testing-library/react";
import RouteActionMenu from "./route-actions-menu";
import { describe, it, expect, vi } from "vitest";
import { Settings, Trash2 } from "lucide-react";

vi.mock("../ui/button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }) => (
    <button onClick={onClick} type="button">
      {children}
    </button>
  ),
}));

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("RouteActionsMenu", () => {
  const mockRoute = {
    id: "test-route",
    name: "Test Route",
    waypoints: [],
  };

  const mockActions = [
    {
      label: "Edit",
      icon: Settings,
    },
    {
      label: "Delete",
      icon: Trash2,
    },
  ];

  it("renders menu button", () => {
    render(<RouteActionMenu route={mockRoute} actions={mockActions} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("renders menu icon", () => {
    const { container } = render(<RouteActionMenu route={mockRoute} actions={mockActions} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
