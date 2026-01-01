import { useQuery } from "@tanstack/react-query";
import { createQueryOptions } from "../lib/react-query";

const OPENAIP_API_KEY = import.meta.env["VITE_OPENAIP_API_KEY"];
const OPENAIP_API_URL = "https://api.core.openaip.net/api";

export interface AirspaceLowerLimit {
  value: number;
  unit: number | string;
  referenceDatum?: string;
}

export interface AirspaceGeometry {
  type: string;
  coordinates: number[][][] | number[][][][];
}

export interface Airspace {
  _id: string;
  name: string;
  type: number;
  country: string;
  lowerLimit: AirspaceLowerLimit;
  upperLimit: AirspaceLowerLimit;
  geometry: AirspaceGeometry;
  vfrUpperFeet?: number | null;
  vfrUpperDisplay?: string;
  polygon?: number[][] | null;
  activity?: string;
}

export interface Airport {
  _id: string;
  name: string;
  icaoCode?: string;
  iata?: string;
  type: number | string;
  country: string;
  elevation?: {
    value: number;
    unit: number;
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
}

export interface OpenAIPResponse<T> {
  items: T[];
  totalCount: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

/**
 * Convert altitude limit to feet
 */
export const toFeet = (limit: AirspaceLowerLimit | null | undefined): number | null => {
  if (!limit) return null;
  const val = Number(limit.value);
  const unit = limit.unit;
  if (Number.isNaN(val)) return null;
  // unit mapping: 1 => feet, 6 => flight level (value in hundreds)
  if (unit === 1) return val;
  if (unit === 6) return val * 100;
  // Unknown unit -> return raw numeric value
  return val;
};

/**
 * Process airspace data to add VFR upper limits
 */
export const processAirspaceData = (
  airspaces: Airspace[],
  t?: (key: string, fallback: string) => string
): Airspace[] => {
  return airspaces.map((airspace) => {
    const lowerLimit = airspace.lowerLimit;
    const vfrUpperFeet = toFeet(lowerLimit);
    const vfrUpperDisplay = vfrUpperFeet
      ? `${vfrUpperFeet} ft`
      : t?.("airspace.na", "N/A") || "N/A";

    return {
      ...airspace,
      vfrUpperFeet,
      vfrUpperDisplay,
    };
  });
};

/**
 * Process airspace data for point-in-polygon checks
 */
export const processAirspaceForPIP = (airspaces: Airspace[]): Airspace[] => {
  return airspaces
    .map((as) => {
      try {
        let coords: number[][] | null = null;
        if (as.geometry && as.geometry.coordinates) {
          if (as.geometry.type === "Polygon") {
            coords = as.geometry.coordinates[0].map((c) => [c[1], c[0]]);
          } else if (as.geometry.type === "MultiPolygon") {
            coords = as.geometry.coordinates[0][0].map((c) => [c[1], c[0]]);
          }
        }
        const vfrUpperFeet = toFeet(as.lowerLimit);
        return {
          ...as,
          polygon: coords,
          vfrUpperFeet,
        };
      } catch (err) {
        console.warn("Error processing airspace geometry:", err);
        return null;
      }
    })
    .filter((as): as is Airspace => as !== null && as.polygon !== null);
};

/**
 * Fetch airspaces for a bounding box
 */
export const fetchAirspaces = async (bbox: string): Promise<Airspace[]> => {
  const url = `${OPENAIP_API_URL}/airspaces?page=1&limit=1000&bbox=${bbox}`;

  const response = await fetch(url, {
    headers: {
      "x-openaip-api-key": OPENAIP_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch airspaces: ${response.status} ${response.statusText}`);
  }

  const data: OpenAIPResponse<Airspace> = await response.json();
  return data.items || [];
};

/**
 * Fetch airports for a bounding box
 */
export const fetchAirports = async (bbox: string): Promise<Airport[]> => {
  const url = `${OPENAIP_API_URL}/airports?page=1&limit=1000&bbox=${bbox}`;

  const response = await fetch(url, {
    headers: {
      "x-openaip-api-key": OPENAIP_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch airports: ${response.status} ${response.statusText}`);
  }

  const data: OpenAIPResponse<Airport> = await response.json();
  return data.items || [];
};

/**
 * Fetch both airspaces and airports for a bounding box
 */
export const fetchAirspaceData = async (
  bbox: string
): Promise<{ airspaces: Airspace[]; airports: Airport[] }> => {
  const [airspaces, airports] = await Promise.all([fetchAirspaces(bbox), fetchAirports(bbox)]);

  return { airspaces, airports };
};

/**
 * React Query hook for airspaces
 */
export const useAirspaces = (bbox: string, enabled = true) => {
  return useQuery<Airspace[]>(
    createQueryOptions<Airspace[]>({
      queryKey: ["openaip", "airspaces", bbox],
      queryFn: () => fetchAirspaces(bbox),
      enabled: enabled && !!bbox,
    })
  );
};

/**
 * React Query hook for airports
 */
export const useAirports = (bbox: string, enabled = true) => {
  return useQuery<Airport[]>(
    createQueryOptions<Airport[]>({
      queryKey: ["openaip", "airports", bbox],
      queryFn: () => fetchAirports(bbox),
      enabled: enabled && !!bbox,
    })
  );
};

/**
 * React Query hook for both airspaces and airports
 */
export const useAirspaceData = (bbox: string, enabled = true) => {
  return useQuery<{ airspaces: Airspace[]; airports: Airport[] }>(
    createQueryOptions<{ airspaces: Airspace[]; airports: Airport[] }>({
      queryKey: ["openaip", "airspaceData", bbox],
      queryFn: () => fetchAirspaceData(bbox),
      enabled: enabled && !!bbox,
    })
  );
};
