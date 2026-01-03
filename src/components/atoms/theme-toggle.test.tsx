import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "./theme-toggle";
import { ThemeProvider } from "../../lib/theme-context";
import { describe, it, expect } from "vitest";

describe("ThemeToggle", () => {
  it("renders toggle button", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("has title attribute", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("title");
  });

  it("toggles theme on click", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole("button");
    const initialTitle = button.getAttribute("title");

    fireEvent.click(button);

    // Title should change after theme toggle
    const newTitle = button.getAttribute("title");
    expect(initialTitle).not.toBe(newTitle);
  });

  it("displays sun or moon icon based on theme", () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
