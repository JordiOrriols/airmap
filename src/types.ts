export type SpeedUnit = "knots" | "kmh";

export interface Waypoint {
  lat: number;
  lng: number;
  name: string;
}

export interface RouteData {
  id: string;
  name: string;
  waypoints: Waypoint[];
  cruiseSpeed: number;
  speedUnit: SpeedUnit;
  created?: string;
  updated?: string;
  exported?: string;
}
