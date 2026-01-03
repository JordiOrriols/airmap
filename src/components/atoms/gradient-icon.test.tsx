import { render, screen } from "@testing-library/react";
import GradientIcon from "./gradient-icon";
import { MapPin, Home } from "lucide-react";
import { describe, it, expect } from "vitest";

describe("GradientIcon", () => {
  it("renders icon component", () => {
    const { container } = render(<GradientIcon icon={MapPin} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("applies default size md", () => {
    const { container } = render(<GradientIcon icon={MapPin} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-5", "h-5");
  });

  it("applies custom size sm", () => {
    const { container } = render(<GradientIcon icon={MapPin} size="sm" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-4", "h-4");
  });

  it("applies custom size lg", () => {
    const { container } = render(<GradientIcon icon={MapPin} size="lg" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-6", "h-6");
  });

  it("applies default gradient", () => {
    const { container } = render(<GradientIcon icon={MapPin} />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("bg-gradient-to-r", "from-violet-500", "to-purple-500");
  });

  it("applies custom gradient", () => {
    const { container } = render(
      <GradientIcon icon={MapPin} gradient="from-red-500 to-yellow-500" />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("from-red-500", "to-yellow-500");
  });

  it("renders different icons", () => {
    const { rerender, container } = render(<GradientIcon icon={MapPin} />);
    expect(container.querySelector("svg")).toBeInTheDocument();

    rerender(<GradientIcon icon={Home} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
