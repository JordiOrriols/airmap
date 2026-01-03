import { render, screen } from "@testing-library/react";
import WeatherIcon from "./weather-icon";
import { describe, it, expect } from "vitest";

describe("WeatherIcon", () => {
  it("renders cloud icon for cloudy condition", () => {
    const { container } = render(<WeatherIcon condition="Cloudy" size="md" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders rain icon for rainy condition", () => {
    const { container } = render(<WeatherIcon condition="Rainy" size="md" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders sunny icon for clear condition", () => {
    const { container } = render(<WeatherIcon condition="Clear" size="md" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders snow icon for snowy condition", () => {
    const { container } = render(<WeatherIcon condition="Snow" size="md" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders thunderstorm icon for stormy condition", () => {
    const { container } = render(<WeatherIcon condition="Thunderstorm" size="md" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("applies size sm", () => {
    const { container } = render(<WeatherIcon condition="Sunny" size="sm" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-4", "h-4");
  });

  it("applies size lg", () => {
    const { container } = render(<WeatherIcon condition="Sunny" size="lg" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-8", "h-8");
  });

  it("applies default size md", () => {
    const { container } = render(<WeatherIcon condition="Sunny" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-6", "h-6");
  });

  it("handles unknown conditions gracefully", () => {
    const { container } = render(<WeatherIcon condition="Unknown" size="md" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
