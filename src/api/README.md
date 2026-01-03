# API Layer - Data Integration

## Overview

The API layer handles all external data integrations:

- **OpenAIP** - Airspace and NOTAM data
- **Weather** - Weather conditions and forecasts
- **React Query** - State management, caching, synchronization

## 📁 Structure

```
api/
├── index.ts           # Main exports
├── openaip.ts         # OpenAIP API client
├── openaip.test.ts    # OpenAIP tests
├── weather.ts         # Weather API client
└── weather.test.ts    # Weather tests
```

---

## 🔌 API Clients

### OpenAIP - Airspace & NOTAM Data

**File:** [openaip.ts](openaip.ts)

Fetches airspace boundaries, regulations, and NOTAMs (Notices to Airmen).

#### Key Functions

```typescript
// Get airspace data for coordinates
export const getAirspace = async (
  latitude: number,
  longitude: number,
  radius?: number
): Promise<AirspaceData[]>

// Get NOTAMs for location
export const getNOTAMs = async (
  latitude: number,
  longitude: number,
  radius?: number
): Promise<NOTAM[]>

// Get airspace geometry
export const getAirspaceGeometry = async (
  airspaceId: string
): Promise<Geometry>
```

#### Usage Example

```typescript
import { getAirspace, getNOTAMs } from "@/api/openaip";

// In a component
const { data: airspaces } = useQuery({
  queryKey: ["airspaces", lat, lng],
  queryFn: () => getAirspace(lat, lng, 50),
});

const { data: notams } = useQuery({
  queryKey: ["notams", lat, lng],
  queryFn: () => getNOTAMs(lat, lng, 100),
});
```

#### Response Types

```typescript
interface AirspaceData {
  id: string;
  name: string;
  type: "restricted" | "danger" | "prohibited" | "class" | "other";
  altitude: {
    min: number;
    max: number;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][];
  };
}

interface NOTAM {
  id: string;
  type: string;
  title: string;
  description: string;
  geometry: GeoJSON.Point;
  effectiveFrom: Date;
  effectiveUntil: Date;
}
```

### Weather - Current & Forecast Data

**File:** [weather.ts](weather.ts)

Fetches current weather and forecasts.

#### Key Functions

```typescript
// Get current weather
export const getCurrentWeather = async (
  latitude: number,
  longitude: number
): Promise<CurrentWeather>

// Get weather forecast
export const getWeatherForecast = async (
  latitude: number,
  longitude: number,
  hours?: number
): Promise<Forecast[]>

// Get METAR data for airport
export const getMetar = async (
  icaoCode: string
): Promise<METARData>
```

#### Usage Example

```typescript
import { getCurrentWeather, getWeatherForecast } from "@/api/weather";

const { data: weather } = useQuery({
  queryKey: ["weather", lat, lng],
  queryFn: () => getCurrentWeather(lat, lng),
  staleTime: 10 * 60 * 1000, // 10 minutes
});

const { data: forecast } = useQuery({
  queryKey: ["forecast", lat, lng],
  queryFn: () => getWeatherForecast(lat, lng, 24),
  staleTime: 30 * 60 * 1000, // 30 minutes
});
```

#### Response Types

```typescript
interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  condition: WeatherCondition;
  visibility: number;
  pressure: number;
  cloudCover: number;
}

interface Forecast {
  timestamp: Date;
  temperature: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  condition: WeatherCondition;
}

interface METARData {
  icao: string;
  rawText: string;
  temperature: number;
  dewpoint: number;
  wind: {
    direction: number;
    speed: number;
    gust?: number;
  };
  visibility: number;
  ceiling?: number;
}

type WeatherCondition = "clear" | "clouds" | "rain" | "snow" | "thunderstorm" | "mist" | "fog";
```

---

## 🔄 React Query Integration

**File:** [../lib/react-query.ts](../lib/react-query.ts)

Centralized React Query configuration.

### Query Client Setup

```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      retryDelay: 1000,
    },
  },
});
```

### Query Patterns

#### Simple Query

```typescript
import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather } from "@/api/weather";

export const useWeather = (latitude: number, longitude: number) => {
  return useQuery({
    queryKey: ["weather", latitude, longitude],
    queryFn: () => getCurrentWeather(latitude, longitude),
    enabled: latitude !== undefined && longitude !== undefined,
  });
};
```

#### Dependent Queries

```typescript
export const useAirspaceWeather = (id: string) => {
  // First query: fetch airspace
  const { data: airspace } = useQuery({
    queryKey: ["airspace", id],
    queryFn: () => getAirspace(id),
  });

  // Second query: depends on first
  const { data: weather } = useQuery({
    queryKey: ["weather", airspace?.latitude, airspace?.longitude],
    queryFn: () => getCurrentWeather(airspace!.latitude, airspace!.longitude),
    enabled: !!airspace, // Only run when airspace is available
  });

  return { airspace, weather };
};
```

#### Query with Variables

```typescript
export const useAirspaces = (latitude: number, longitude: number, radius: number = 50) => {
  return useQuery({
    queryKey: ["airspaces", latitude, longitude, radius],
    queryFn: () => getAirspace(latitude, longitude, radius),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
```

### Query Status Handling

```typescript
const { data, isLoading, isError, error } = useQuery({
  queryKey: ['weather', lat, lng],
  queryFn: () => getCurrentWeather(lat, lng),
});

if (isLoading) return <LoadingSpinner />;
if (isError) return <Error error={error} />;

return <WeatherDisplay weather={data} />;
```

---

## 🛠️ Making API Calls

### Best Practices

#### 1. **Always Use React Query**

❌ **DON'T**:

```typescript
useEffect(() => {
  const fetchData = async () => {
    const res = await fetch("/api/weather");
    setData(await res.json());
  };
  fetchData();
}, []);
```

✅ **DO**:

```typescript
const { data } = useQuery({
  queryKey: ["weather"],
  queryFn: () => getCurrentWeather(lat, lng),
});
```

#### 2. **Handle Loading & Error States**

```typescript
export const WeatherComponent = ({ lat, lng }: Props) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['weather', lat, lng],
    queryFn: () => getCurrentWeather(lat, lng),
  });

  if (isLoading) {
    return <div className="text-gray-500">Loading weather...</div>;
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || 'Failed to load weather'}
      </div>
    );
  }

  return <WeatherDisplay weather={data} />;
};
```

#### 3. **Enable/Disable Queries Conditionally**

```typescript
// Only fetch when coordinates are available
const { data } = useQuery({
  queryKey: ["weather", lat, lng],
  queryFn: () => getCurrentWeather(lat, lng),
  enabled: lat !== undefined && lng !== undefined,
});
```

#### 4. **Use Proper Query Keys**

Query keys should be arrays that identify the query uniquely:

```typescript
// ✅ Good - includes all dependencies
["weather", latitude, longitude][("airspace", id, radius)][("forecast", lat, lng, hours)][
  // ❌ Bad - doesn't include all parameters
  "weather"
]["airspace-data"];
```

#### 5. **Set Appropriate Stale Times**

```typescript
// Static data - can be cached longer
useQuery({
  queryKey: ["airspace", id],
  queryFn: () => getAirspace(id),
  staleTime: 60 * 60 * 1000, // 1 hour
});

// Real-time data - shorter cache
useQuery({
  queryKey: ["weather", lat, lng],
  queryFn: () => getCurrentWeather(lat, lng),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## 🔐 Error Handling

### API-Level Error Handling

```typescript
// In api/openaip.ts
export const getAirspace = async (latitude: number, longitude: number): Promise<AirspaceData[]> => {
  const response = await fetch(`${API_URL}/airspace?lat=${latitude}&lng=${longitude}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch airspace: ${response.status}`);
  }

  return response.json();
};
```

### Component-Level Error Handling

```typescript
export const AirspaceLayer = ({ lat, lng }: Props) => {
  const { data, isError, error } = useQuery({
    queryKey: ['airspace', lat, lng],
    queryFn: () => getAirspace(lat, lng),
  });

  if (isError) {
    return (
      <div role="alert" className="error-message">
        <p>Could not load airspace data</p>
        <p className="text-sm">{error?.message}</p>
        <button onClick={() => /* retry */}>Try again</button>
      </div>
    );
  }

  return <AirspaceDisplay airspaces={data} />;
};
```

---

## 🧪 Testing API Calls

### Mocking with Vitest

```typescript
import { vi } from 'vitest';
import * as weatherApi from '@/api/weather';

describe('WeatherComponent', () => {
  it('displays weather data when loaded', async () => {
    vi.spyOn(weatherApi, 'getCurrentWeather').mockResolvedValue({
      temperature: 25,
      condition: 'clear',
      windSpeed: 5,
      // ... other properties
    });

    render(<WeatherComponent lat={40.7} lng={-74.0} />);

    await waitFor(() => {
      expect(screen.getByText('25°C')).toBeInTheDocument();
    });
  });

  it('handles errors gracefully', async () => {
    vi.spyOn(weatherApi, 'getCurrentWeather').mockRejectedValue(
      new Error('API Error')
    );

    render(<WeatherComponent lat={40.7} lng={-74.0} />);

    await waitFor(() => {
      expect(screen.getByText(/could not load/i)).toBeInTheDocument();
    });
  });
});
```

### Mocking React Query

```typescript
import { QueryClient, useQuery } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';

describe('WeatherPanel', () => {
  it('renders weather data', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    queryClient.setQueryData(
      ['weather', 40.7, -74.0],
      {
        temperature: 25,
        condition: 'clear',
      }
    );

    render(
      <QueryClientProvider client={queryClient}>
        <WeatherPanel lat={40.7} lng={-74.0} />
      </QueryClientProvider>
    );

    expect(screen.getByText('25°C')).toBeInTheDocument();
  });
});
```

---

## 📊 API Response Caching Strategy

| Data Type           | Stale Time | Cache Time | Reason                          |
| ------------------- | ---------- | ---------- | ------------------------------- |
| Airspace boundaries | 1 hour     | 2 hours    | Static, rarely changes          |
| NOTAMs              | 30 minutes | 1 hour     | Important, updates occasionally |
| Current weather     | 5 minutes  | 10 minutes | Changes frequently              |
| Weather forecast    | 30 minutes | 1 hour     | Relatively stable               |
| METAR               | 10 minutes | 20 minutes | Updates frequently              |

---

## 🔄 Data Flow

```
Component
  ↓
useQuery Hook
  ↓
React Query Cache
  ↓
API Client (getWeather, getAirspace, etc)
  ↓
HTTP Request
  ↓
External API (OpenAIP, Weather Service)
  ↓
Response → Cache → Component Update
```

---

## 🌐 Environment Setup

### API Endpoints

Set in environment variables:

```bash
# .env
VITE_OPENAIP_API_URL=https://api.openairmap.org/v2
VITE_WEATHER_API_URL=https://api.openweathermap.org/v2.5
VITE_WEATHER_API_KEY=your_key_here
```

### Usage in Code

```typescript
const API_BASE_URL = import.meta.env.VITE_OPENAIP_API_URL;
const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY;
```

---

## 📚 Common Patterns

### Infinite Queries (Pagination)

```typescript
export const useAirspacesInfinite = (radius: number) => {
  return useInfiniteQuery({
    queryKey: ["airspaces", radius],
    queryFn: ({ pageParam = 0 }) => getAirspace(0, 0, radius, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};
```

### Prefetching

```typescript
export const prefetchWeather = async (lat: number, lng: number) => {
  await queryClient.prefetchQuery({
    queryKey: ["weather", lat, lng],
    queryFn: () => getCurrentWeather(lat, lng),
  });
};
```

### Mutations (Create/Update/Delete)

```typescript
export const useSaveRoute = () => {
  return useMutation({
    mutationFn: (route: RouteData) =>
      fetch("/api/routes", {
        method: "POST",
        body: JSON.stringify(route),
      }).then((r) => r.json()),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
};
```

---

## 🚀 Performance Tips

1. **Use Query Keys Strategically**
   - Include all query dependencies in key
   - Enables automatic invalidation

2. **Set Appropriate Stale Times**
   - Balance freshness vs. requests
   - Consider data update frequency

3. **Enable Queries Conditionally**
   - Don't fetch if data not needed
   - Use `enabled` prop

4. **Prefetch Data**
   - Anticipate user navigation
   - Prefetch on hover/route entry

5. **Handle Network Errors**
   - Retry failed requests
   - Show retry UI to users
