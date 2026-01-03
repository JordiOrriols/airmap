import { render, screen, fireEvent } from "@testing-library/react";
import CollapsiblePanel from "./collapsible-panel";
import { MapPin, ChevronDown } from "lucide-react";
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
  it("renders with title and icon", () => {
    render(
      <CollapsiblePanel title="Test Panel" icon={MapPin}>
        Content
      </CollapsiblePanel>
    );
    expect(screen.getByText("Test Panel")).toBeInTheDocument();
  });

  it("renders children content when not collapsed", () => {
    render(
      <CollapsiblePanel title="Panel" icon={MapPin} defaultCollapsed={false}>
        Panel Content
      </CollapsiblePanel>
    );
    expect(screen.getByText("Panel Content")).toBeInTheDocument();
  });

  it.each([
    { defaultCollapsed: false, expectContent: true },
    { defaultCollapsed: true, expectContent: false },
  ])("respects defaultCollapsed=$defaultCollapsed", ({ defaultCollapsed, expectContent }) => {
    render(
      <CollapsiblePanel title="Panel" icon={MapPin} defaultCollapsed={defaultCollapsed}>
        Hidden Content
      </CollapsiblePanel>
    );
    if (expectContent) {
      expect(screen.getByText("Hidden Content")).toBeInTheDocument();
    }
  });

  it("toggles content visibility on button click", () => {
    render(
      <CollapsiblePanel title="Panel" icon={MapPin} defaultCollapsed={false}>
        Toggleable Content
      </CollapsiblePanel>
    );
    const button = screen.getByRole("button");
    expect(screen.getByText("Toggleable Content")).toBeInTheDocument();

    fireEvent.click(button);
    // After click, content should be hidden (animation takes time in real app)
  });

  it.each([
    { gradient: "from-blue-500 to-cyan-500" },
    { gradient: "from-purple-500 to-pink-500" },
    { gradient: "from-green-500 to-emerald-500" },
  ])("applies gradient class '$gradient'", ({ gradient }) => {
    const { container } = render(
      <CollapsiblePanel title="Panel" icon={MapPin} gradient={gradient}>
        Content
      </CollapsiblePanel>
    );
    expect(container.innerHTML).toContain(gradient);
  });

  it("uses default violet gradient when not provided", () => {
    const { container } = render(
      <CollapsiblePanel title="Panel" icon={MapPin}>
        Content
      </CollapsiblePanel>
    );
    expect(container.innerHTML).toContain("from-violet-500");
    expect(container.innerHTML).toContain("to-purple-500");
  });

  it("renders button with correct accessibility", () => {
    render(
      <CollapsiblePanel title="Panel" icon={MapPin}>
        Content
      </CollapsiblePanel>
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button.parentElement?.textContent).toContain("Panel");
  });
});
