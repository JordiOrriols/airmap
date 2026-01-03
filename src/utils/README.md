# Utilities - Helper Functions & Constants

## Overview

Utility functions and constants for geographic calculations, data transformations, storage, and constants used throughout the app.

## 📁 Structure

```
utils/
├── constants.ts         # App-wide constants
├── constants.test.ts    # Constants tests
├── geo.ts              # Geographic calculations
├── geo.test.ts         # Geo tests
├── pointInPolygon.ts   # Point-in-polygon algorithm
├── pointInPolygon.test.ts
├── storage.tsx         # LocalStorage utilities
├── storage.test.ts     # Storage tests
├── index.tsx           # Re-exports
└── README.md           # This file
```

---

## 🗺️ Geographic Utilities

**File:** [geo.ts](geo.ts)

Functions for geographic calculations and transformations.

### Key Functions

```typescript
// Calculate distance between two coordinates
export const calculateDistance = (
  point1: Coordinates,
  point2: Coordinates,
  unit?: 'km' | 'nm' | 'mi'
): number

// Calculate bearing from point1 to point2
export const calculateBearing = (
  point1: Coordinates,
  point2: Coordinates
): number

// Get destination point given start, bearing, distance
export const getDestinationPoint = (
  start: Coordinates,
  bearing: number,
  distance: number,
  unit?: 'km' | 'nm' | 'mi'
): Coordinates

// Check if point is within bounding box
export const isWithinBounds = (
  point: Coordinates,
  bounds: BoundingBox
): boolean

// Convert between coordinate formats
export const dmsToDecimal = (dms: string): number
export const decimalToDMS = (decimal: number): string
```

### Common Types

```typescript
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}
```

### Usage Examples

#### Calculate Distance

```typescript
import { calculateDistance } from '@/utils/geo';

// Distance between two airports
const distance = calculateDistance(
  { latitude: 40.6895, longitude: -74.0872 }, // JFK
  { latitude: 34.0522, longitude: -118.2437 }, // LAX
  'nm' // nautical miles
);

console.log(`${distance.toFixed(1)} nm`); // ~2,100 nm
```

#### Calculate Bearing

```typescript
import { calculateBearing } from '@/utils/geo';

const bearing = calculateBearing(
  { latitude: 40.7, longitude: -74.0 },
  { latitude: 40.8, longitude: -73.9 }
);

console.log(`Heading: ${bearing.toFixed(1)}°`); // ~360° (north)
```

#### Get Destination Point

```typescript
import { getDestinationPoint } from '@/utils/geo';

// 10 nm northeast from current position
const nextPoint = getDestinationPoint(
  { latitude: 40.7, longitude: -74.0 },
  45, // bearing in degrees
  10, // distance
  'nm'
);
```

#### Check Bounds

```typescript
import { isWithinBounds } from '@/utils/geo';

const inArea = isWithinBounds(
  { latitude: 40.7, longitude: -74.0 },
  {
    north: 41.0,
    south: 40.0,
    east: -73.0,
    west: -75.0
  }
);
```

---

## 🎯 Point-in-Polygon

**File:** [pointInPolygon.ts](pointInPolygon.ts)

Determines if a point lies within a polygon (used for airspace detection).

### Key Function

```typescript
// Check if point is inside polygon
export const pointInPolygon = (
  point: [number, number], // [longitude, latitude]
  polygon: number[][][]    // GeoJSON polygon coordinates
): boolean
```

### Usage Example

```typescript
import { pointInPolygon } from '@/utils/pointInPolygon';

// Check if aircraft is in restricted airspace
const inRestricted = pointInPolygon(
  [-74.0, 40.7], // Current position [lng, lat]
  geometry.coordinates // Airspace polygon
);

if (inRestricted) {
  alert('Warning: You are in restricted airspace!');
}
```

### Algorithm

Uses ray casting algorithm:

```
1. Cast a ray from the point to infinity
2. Count intersections with polygon edges
3. Odd count = inside, Even count = outside
```

**Complexity:** O(n) where n = number of polygon vertices

---

## 💾 Storage Utilities

**File:** [storage.tsx](storage.tsx)

Type-safe wrapper around browser LocalStorage.

### Key Functions

```typescript
// Save data to localStorage
export const saveToStorage = <T>(
  key: string,
  data: T,
  options?: StorageOptions
): void

// Get data from localStorage
export const getFromStorage = <T>(
  key: string,
  defaultValue?: T
): T | null

// Remove from localStorage
export const removeFromStorage = (key: string): void

// Clear all app storage
export const clearStorage = (keys?: string[]): void

// Get all stored keys for app
export const getStorageKeys = (): string[]
```

### Custom Hook - useLocalStorage

```typescript
export const useLocalStorage = <T>(
  key: string,
  initialValue?: T
): [T | null, (value: T) => void, () => void]
```

### Usage Examples

#### Save Route

```typescript
import { saveToStorage } from '@/utils/storage';

const route = {
  id: '123',
  name: 'NYC to Boston',
  waypoints: [/* ... */]
};

saveToStorage('route_123', route);
```

#### Retrieve with Default

```typescript
import { getFromStorage } from '@/utils/storage';

const route = getFromStorage('route_123', {
  id: '',
  name: 'Untitled Route',
  waypoints: []
});
```

#### React Hook - useLocalStorage

```typescript
import { useLocalStorage } from '@/utils/storage';

export const RouteComponent = ({ routeId }: Props) => {
  const [route, setRoute, removeRoute] = useLocalStorage(
    `route_${routeId}`,
    { id: routeId, name: '', waypoints: [] }
  );

  const handleSave = (updatedRoute: Route) => {
    setRoute(updatedRoute);
  };

  const handleDelete = () => {
    removeRoute();
  };

  return (
    <div>
      <input 
        value={route?.name}
        onChange={(e) => setRoute({ ...route, name: e.target.value })}
      />
      <button onClick={() => handleSave(route)}>Save</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};
```

#### Type-Safe Storage

```typescript
import { getFromStorage, saveToStorage } from '@/utils/storage';

interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'ca';
  unitsSystem: 'imperial' | 'metric';
}

// Strongly typed save
const preferences: UserPreferences = {
  theme: 'dark',
  language: 'en',
  unitsSystem: 'metric'
};

saveToStorage<UserPreferences>('preferences', preferences);

// Strongly typed retrieve
const saved = getFromStorage<UserPreferences>('preferences');
```

### Storage Events

```typescript
export interface StorageOptions {
  version?: number;      // Version for migrations
  ttl?: number;          // Time-to-live in ms
  sensitive?: boolean;   // Flag for sensitive data
}
```

---

## ⚙️ Constants

**File:** [constants.ts](constants.ts)

App-wide constants for configuration and lookup values.

### Key Constants

```typescript
// Application info
export const APP_NAME = 'AirMap';
export const APP_VERSION = '1.0.0';

// Airspace types
export const AIRSPACE_TYPES = {
  RESTRICTED: 'restricted',
  DANGER: 'danger',
  PROHIBITED: 'prohibited',
  CLASS_A: 'class-a',
  CLASS_B: 'class-b',
  // ... etc
} as const;

// Flight operations
export const MIN_CRUISE_SPEED = 30; // knots
export const MAX_CRUISE_SPEED = 250; // knots
export const DEFAULT_CRUISE_SPEED = 100; // knots

// Altitude limits
export const MIN_ALTITUDE = 0; // feet
export const MAX_ALTITUDE = 50000; // feet
export const DEFAULT_ALTITUDE = 5000; // feet

// Geographic
export const EARTH_RADIUS_KM = 6371;
export const EARTH_RADIUS_NM = 3440.065;
export const EARTH_RADIUS_MI = 3959;

// Distance units
export const DISTANCE_UNITS = {
  KM: 'km',
  NM: 'nm',
  MI: 'mi',
} as const;

// Weather
export const WEATHER_CONDITIONS = {
  CLEAR: 'clear',
  CLOUDS: 'clouds',
  RAIN: 'rain',
  SNOW: 'snow',
  THUNDERSTORM: 'thunderstorm',
  MIST: 'mist',
  FOG: 'fog',
} as const;

// Intervals (milliseconds)
export const POLLING_INTERVALS = {
  LOCATION: 1000,      // 1 second
  WEATHER: 300000,     // 5 minutes
  AIRSPACE: 600000,    // 10 minutes
} as const;

// Storage keys
export const STORAGE_KEYS = {
  ROUTES: 'airmap_routes',
  PREFERENCES: 'airmap_preferences',
  RECENT_FLIGHTS: 'airmap_recent_flights',
  THEME: 'airmap_theme',
  LANGUAGE: 'airmap_language',
} as const;
```

### Usage Examples

```typescript
import { 
  DEFAULT_CRUISE_SPEED, 
  DISTANCE_UNITS,
  AIRSPACE_TYPES 
} from '@/utils/constants';

// Speed validation
const isValidSpeed = (speed: number) => 
  speed >= MIN_CRUISE_SPEED && speed <= MAX_CRUISE_SPEED;

// Create airspace
const restrictedAirspace = {
  type: AIRSPACE_TYPES.RESTRICTED,
  // ...
};

// Format distance
const formatDistance = (distance: number) =>
  `${distance.toFixed(1)} ${DISTANCE_UNITS.NM}`;
```

---

## 🧪 Testing Utilities

### Mock Data Helpers

```typescript
import { createMockCoordinates, createMockRoute } from '@/utils/test-helpers';

describe('RouteCalculation', () => {
  it('calculates distance correctly', () => {
    const start = createMockCoordinates({ lat: 40.7, lng: -74.0 });
    const end = createMockCoordinates({ lat: 34.0, lng: -118.2 });
    
    const distance = calculateDistance(start, end, 'nm');
    expect(distance).toBeGreaterThan(2000);
  });
});
```

---

## 📝 Best Practices

### 1. Use Constants

❌ **DON'T**:
```typescript
if (type === 'restricted') { /* ... */ }
const speed = 100;
const timeout = 300000;
```

✅ **DO**:
```typescript
import { AIRSPACE_TYPES, DEFAULT_CRUISE_SPEED, POLLING_INTERVALS } from '@/utils/constants';

if (type === AIRSPACE_TYPES.RESTRICTED) { /* ... */ }
const speed = DEFAULT_CRUISE_SPEED;
const timeout = POLLING_INTERVALS.WEATHER;
```

### 2. Use Typed Utility Functions

❌ **DON'T**:
```typescript
// Manual calculation prone to errors
const dist = Math.sqrt(
  Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)
);
```

✅ **DO**:
```typescript
import { calculateDistance } from '@/utils/geo';

const dist = calculateDistance(point1, point2, 'nm');
```

### 3. Type-Safe Storage

❌ **DON'T**:
```typescript
localStorage.setItem('data', JSON.stringify(data));
const data = JSON.parse(localStorage.getItem('data'));
```

✅ **DO**:
```typescript
import { saveToStorage, getFromStorage } from '@/utils/storage';

saveToStorage<MyType>('data', data);
const data = getFromStorage<MyType>('data');
```

### 4. Reuse Geo Utilities

❌ **DON'T**:
```typescript
// Multiple implementations scattered
const bearing1 = Math.atan2(lng2 - lng1, lat2 - lat1);
// ... elsewhere
const bearing2 = /* different implementation */;
```

✅ **DO**:
```typescript
import { calculateBearing } from '@/utils/geo';

const bearing1 = calculateBearing(point1, point2);
const bearing2 = calculateBearing(point3, point4); // Same implementation
```

---

## 🔗 Import Patterns

### From Utilities

```typescript
// Individual imports
import { calculateDistance, calculateBearing } from '@/utils/geo';
import { useLocalStorage } from '@/utils/storage';
import { AIRSPACE_TYPES } from '@/utils/constants';

// Or use index.tsx for convenience
import { calculateDistance, useLocalStorage, AIRSPACE_TYPES } from '@/utils';
```

### In Components

```typescript
import { 
  calculateDistance, 
  pointInPolygon,
  DISTANCE_UNITS 
} from '@/utils';

export const MapLayer = ({ currentPosition, airspaces }: Props) => {
  const isInRestricted = airspaces.some(airspace =>
    pointInPolygon([currentPosition.lng, currentPosition.lat], airspace.geometry)
  );

  const distanceFromBase = calculateDistance(
    currentPosition,
    BASE_COORDINATES,
    DISTANCE_UNITS.NM
  );

  return (
    <div>
      {isInRestricted && <WarningBanner />}
      <p>Distance: {distanceFromBase.toFixed(1)} nm</p>
    </div>
  );
};
```

---

## 📊 Performance Considerations

### Geographic Calculations

- `calculateDistance`: O(1) - constant time
- `calculateBearing`: O(1) - constant time  
- `pointInPolygon`: O(n) - proportional to polygon vertices

For large polygons, consider:
- Spatial indexing (quadtree, R-tree)
- Batch processing
- Web Workers for heavy calculations

### Storage

- LocalStorage limit: ~5-10MB per domain
- Use compression for large datasets
- Consider IndexedDB for bigger storage needs

### Constants

- Use `as const` for type inference
- Creates readonly types
- Enables autocomplete

```typescript
// ✅ Good - const assertion
export const UNITS = {
  KM: 'km',
  NM: 'nm',
  MI: 'mi',
} as const;

type Unit = typeof UNITS[keyof typeof UNITS]; // 'km' | 'nm' | 'mi'
```

