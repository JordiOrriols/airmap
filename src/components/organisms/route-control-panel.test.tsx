import { render, screen, fireEvent } from "@testing-library/react";
import RouteControlPanel from "./route-control-panel";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

vi.mock("../molecules/collapsible-panel", () => ({
  default: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div className="collapsible">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

vi.mock("../ui/button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }) => (
    <button onClick={onClick} type="button">
      {children}
    </button>
  ),
}));

vi.mock("../ui/input", () => ({
  Input: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
  }) => <input value={value} onChange={onChange} placeholder={placeholder} type="text" />,
}));

vi.mock("../ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div className="select">{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div className="select-content">{children}</div>
  ),
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div className="select-item" data-value={value}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div className="select-trigger">{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
}));

vi.mock("./waypoints-list-panel", () => ({
  default: () => <div className="waypoints-list" />,
}));

describe("RouteControlPanel", () => {
  const mockProps: any = {
    routeName: "Test Route",
    setRouteName: vi.fn(),
    cruiseSpeed: 100,
    setCruiseSpeed: vi.fn(),
    speedUnit: "kt",
    setSpeedUnit: vi.fn(),
    isEditMode: false,
    toggleEditMode: vi.fn(),
    showAirspace: false,
    setShowAirspace: vi.fn(),
    exportRoute: vi.fn(),
    importRoute: vi.fn(),
    clearRoute: vi.fn(),
    waypoints: [{ id: "wp1", name: "Start", lat: 41.52, lng: 2.1 }],
    removeWaypoint: vi.fn(),
    reorderWaypoints: vi.fn(),
    fileInputRef: { current: null },
    reloadAirspace: vi.fn(),
  };

  it("renders route control panel", () => {
    render(<RouteControlPanel {...mockProps} />);
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("displays route name input", () => {
    render(<RouteControlPanel {...mockProps} />);
    const input = screen.getByDisplayValue("Test Route");
    expect(input).toBeInTheDocument();
  });

  it("displays cruise speed input", () => {
    render(<RouteControlPanel {...mockProps} />);
    const input = screen.getByDisplayValue("100");
    expect(input).toBeInTheDocument();
  });

  it("calls setRouteName on name change", () => {
    render(<RouteControlPanel {...mockProps} />);
    const input = screen.getByDisplayValue("Test Route");
    fireEvent.change(input, { target: { value: "New Route" } });
    expect(mockProps.setRouteName).toHaveBeenCalled();
  });

  it("calls setCruiseSpeed on speed change", () => {
    render(<RouteControlPanel {...mockProps} />);
    const input = screen.getByDisplayValue("100");
    fireEvent.change(input, { target: { value: "120" } });
    expect(mockProps.setCruiseSpeed).toHaveBeenCalled();
  });

  it("renders export button", () => {
    render(<RouteControlPanel {...mockProps} />);
    const exportButton = screen.getByRole("button", { name: /export/i });
    expect(exportButton).toBeInTheDocument();
  });

  it("renders edit toggle button", () => {
    render(<RouteControlPanel {...mockProps} />);
    const editButton = screen.getByRole("button", { name: /mode/i });
    expect(editButton).toBeInTheDocument();
  });

  it("renders waypoints list panel", () => {
    const { container } = render(<RouteControlPanel {...mockProps} />);
    expect(container.querySelector(".waypoints-list")).toBeInTheDocument();
  });
});
