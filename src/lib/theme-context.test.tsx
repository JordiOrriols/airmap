import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./theme-context";

describe("Theme Context", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  describe("ThemeProvider", () => {
    it("should provide default light theme", () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText("light")).toBeInTheDocument();
    });

    it("should restore theme from localStorage", () => {
      localStorage.setItem("theme", "dark");

      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText("dark")).toBeInTheDocument();
    });

    it("should toggle theme", () => {
      const TestComponent = () => {
        const { theme, toggleTheme } = useTheme();
        return (
          <>
            <div data-testid="theme">{theme}</div>
            <button onClick={toggleTheme}>Toggle</button>
          </>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const themeDiv = screen.getByTestId("theme");
      const toggleButton = screen.getByText("Toggle");

      expect(themeDiv).toHaveTextContent("light");
      fireEvent.click(toggleButton);
      expect(themeDiv).toHaveTextContent("dark");
    });

    it("should set theme explicitly", () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <>
            <div data-testid="theme">{theme}</div>
            <button onClick={() => setTheme("dark")}>Set Dark</button>
          </>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const themeDiv = screen.getByTestId("theme");
      const setButton = screen.getByText("Set Dark");

      expect(themeDiv).toHaveTextContent("light");
      fireEvent.click(setButton);
      expect(themeDiv).toHaveTextContent("dark");
    });

    it("should persist theme to localStorage", () => {
      const TestComponent = () => {
        const { toggleTheme } = useTheme();
        return <button onClick={toggleTheme}>Toggle</button>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByText("Toggle");
      fireEvent.click(toggleButton);

      expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("should add dark class to document element when theme is dark", async () => {
      const TestComponent = () => {
        const { toggleTheme } = useTheme();
        return <button onClick={toggleTheme}>Toggle</button>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByText("Toggle");
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(true);
      });
    });

    it("should remove dark class from document element when theme is light", async () => {
      localStorage.setItem("theme", "dark");

      const TestComponent = () => {
        const { toggleTheme } = useTheme();
        return <button onClick={toggleTheme}>Toggle</button>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(true);
      });

      const toggleButton = screen.getByText("Toggle");
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(false);
      });
    });
  });

  describe("useTheme hook", () => {
    it("should throw error when used outside ThemeProvider", () => {
      const TestComponent = () => {
        useTheme();
        return null;
      };

      expect(() => render(<TestComponent />)).toThrow(
        "useTheme must be used within ThemeProvider"
      );
    });

    it("should return theme object with all required properties", () => {
      const TestComponent = () => {
        const themeContext = useTheme();
        return (
          <div>
            {typeof themeContext.theme === "string" &&
              typeof themeContext.toggleTheme === "function" &&
              typeof themeContext.setTheme === "function" && "valid"}
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText("valid")).toBeInTheDocument();
    });

    it("should update on multiple toggles", () => {
      const TestComponent = () => {
        const { theme, toggleTheme } = useTheme();
        return (
          <>
            <div data-testid="theme">{theme}</div>
            <button onClick={toggleTheme}>Toggle</button>
          </>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const themeDiv = screen.getByTestId("theme");
      const toggleButton = screen.getByText("Toggle");

      expect(themeDiv).toHaveTextContent("light");

      fireEvent.click(toggleButton);
      expect(themeDiv).toHaveTextContent("dark");

      fireEvent.click(toggleButton);
      expect(themeDiv).toHaveTextContent("light");

      fireEvent.click(toggleButton);
      expect(themeDiv).toHaveTextContent("dark");
    });
  });
});
