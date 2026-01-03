import { render, screen } from "@testing-library/react";
import CollapsiblePanel from "./collapsible-panel";
import { MapPin } from "lucide-react";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

vi.mock("react-error-boundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

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

  it("renders with gradient styling", () => {
    const { container } = render(
      <CollapsiblePanel
        title="Test"
        icon={MapPin}
        gradient="from-blue-500 to-cyan-500"
      >
        Content
      </CollapsiblePanel>
    );
    const html = container.innerHTML;
    expect(html).toContain("from-blue-500");
  });

  it("renders with default gradient", () => {
    const { container } = render(
      <CollapsiblePanel title="Test" icon={MapPin}>
        Content
      </CollapsiblePanel>
    );
    const html = container.innerHTML;
    expect(html).toContain("from-violet-500");
  });
});
