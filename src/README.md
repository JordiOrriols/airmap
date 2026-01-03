# Source Code Structure

## Overview

The `src/` directory contains all application source code, organized by functional domain and architectural layers.

## Directory Organization

```
src/
├── api/                      # API clients & data fetching
├── components/               # React components (atomic design)
├── lib/                      # Shared libraries & utilities
├── locales/                  # i18n translation files
├── pages/                    # Full page components (routes)
├── styles/                   # Global styles & theme
├── utils/                    # Helper functions & constants
├── App.jsx                   # Root component
├── index.jsx                 # Application entry point
├── types.ts                  # Global TypeScript definitions
├── setupTests.ts             # Test configuration
└── basic.test.ts             # Basic smoke tests
```

---

## 📁 Directory Details

### `api/` - API Integration Layer

Handles all external API communication and data fetching.

**Files**:

- `index.ts` - API client setup and exports
- `openaip.ts` - OpenAIP airspace & aircraft data
- `weather.ts` - Weather API integration
- `openaip.test.ts` - API tests
- `weather.test.ts` - Weather API tests

**Key Functions**:

- `useAirspaceData()` - React Query hook for airspace info
- `useCurrentWeather()` - Current weather data
- `useWeatherForecast()` - Weather forecast data
- `fetchFlightData()` - ICAO aircraft tracking

**Best Practices**:

- All API calls use React Query for caching
- Errors are handled and normalized
- TypeScript interfaces for all responses
- Mock data for testing

---

### `components/` - React Components

Organized following Atomic Design pattern.

#### **Atoms** - Basic UI Elements

Smallest building blocks, typically unstyled or lightly styled.

```
atoms/
├── badge/
├── glass-card/
├── gradient-icon/
├── icon-button/
├── scroll-container/
├── stat-display/
├── theme-toggle/
└── weather-icon/
```

**Characteristics**:

- No dependencies on other components
- Single responsibility
- Fully reusable
- Well-tested

**Example**:

```typescript
// StatDisplay - Shows a labeled value
<StatDisplay
  icon={TrendingUp}
  label="Distance"
  value="50.5"
  unit="NM"
/>
```

#### **Molecules** - Simple Combinations

Combine 2-3 atoms into simple reusable patterns.

```
molecules/
├── card-header/           # Header for cards
├── collapsible-panel/     # Expandable panel
├── route-actions-menu/    # Actions dropdown
├── route-card/            # Route display
├── route-segment-card/    # Route segment details
├── route-stats-card/      # Statistics display
├── stat-grid/             # Grid of stats
├── waypoint-card/         # Single waypoint
└── weather-card/          # Weather display
```

**Characteristics**:

- Combines atoms
- Can accept callbacks
- Single purpose
- Usually has some interactivity

**Example**:

```typescript
// StatGrid - Displays multiple stats
<StatGrid stats={[
  { label: 'Speed', value: '100', unit: 'kt' },
  { label: 'Altitude', value: '5000', unit: 'ft' }
]} />
```

#### **Organisms** - Complex Features

Complex, domain-specific components combining molecules and atoms.

```
organisms/
├── map-view/                  # Interactive map
├── next-waypoint-panel/       # Next waypoint info
├── route-control-panel/       # Route editing
├── tracking-control-panel/    # Tracking controls
├── waypoints-list-panel/      # Waypoint management
└── weather-panel/             # Weather information
```

**Characteristics**:

- Manage state and side effects
- Handle data fetching
- Coordinate multiple molecules
- Often page-level sections

**Example**:

```typescript
// RouteControlPanel - Edit route properties
<RouteControlPanel
  route={currentRoute}
  onSave={handleSave}
  onDelete={handleDelete}
/>
```

#### **UI** - Unstyled Components

Base components from ShadCN UI (Radix UI primitives).

```
ui/
├── button.tsx         # Interactive button
├── card.tsx           # Container element
├── input.tsx          # Text input
├── select.tsx         # Dropdown selector
└── ...                # More primitives
```

**Usage**: Foundation for atoms and molecules

#### **Flight** - Domain-Specific

Features specific to flight planning/tracking.

```
flight/
└── airspace-layer/    # Airspace visualization on map
```

---

### `lib/` - Shared Libraries

Reusable utilities and context providers.

**Files**:

- `theme-context.tsx` - Dark/Light mode management
- `theme-context.test.tsx` - Theme tests
- `i18n.ts` - Internationalization setup
- `i18n.test.ts` - i18n tests
- `react-query.ts` - React Query configuration
- `react-query.test.ts` - Query tests
- `utils.ts` - Common utilities
- `utils.test.ts` - Utility tests

**Key Exports**:

- `useTheme()` - Access theme context
- `ThemeProvider` - Theme context provider
- `useTranslation()` - i18n hook
- `queryClient` - React Query client
- `formatDistance()` - Distance formatting
- `formatTime()` - Time formatting

---

### `locales/` - Internationalization

Translation files for multiple languages.

**Structure**:

```
locales/
├── en.ts              # English translations
├── es.ts              # Spanish translations
├── ca.ts              # Catalan translations
├── types.ts           # Translation type definitions
└── index.ts           # i18n setup
```

**Format**:

```typescript
export const en = {
  common: {
    save: "Save",
    cancel: "Cancel",
  },
  planner: {
    title: "Flight Planner",
    // ...
  },
};
```

**Usage**:

```typescript
const { t } = useTranslation();
<button>{t('common.save')}</button>
```

---

### `pages/` - Page Components

Full-page components corresponding to routes.

**Files**:

- `planner.tsx` - Route planning page
- `tracking.tsx` - Live tracking page
- `home.tsx` - Home/landing page

**Characteristics**:

- Connected to routes
- Manage page-level state
- Compose multiple organisms
- Handle page-specific logic

**Example**:

```typescript
export default function PlannerPage() {
  // Page-level state
  const [route, setRoute] = useState<RouteData>();

  return (
    <div className="planner-layout">
      <MapView waypoints={route?.waypoints} />
      <RouteControlPanel route={route} onUpdate={setRoute} />
    </div>
  );
}
```

---

### `styles/` - Global Styles

**Files**:

- `theme.css` - CSS variables for colors
- `globals.css` - Global styles (in index.css)

**Color Variables**:

```css
--app-primary: #0ea5e9; /* Primary color */
--app-secondary: #64748b; /* Secondary color */
--app-foreground: #1e293b; /* Text color */
--app-background: #ffffff; /* Background */
--input-app: #f1f5f9; /* Input background */
--card-app: rgba(255, 255, 255, 0.7); /* Card background */
```

Automatically switch based on dark/light mode.

---

### `utils/` - Helper Functions

Utility functions organized by domain.

**Files**:

- `constants.ts` - Application constants
- `constants.test.ts` - Constant tests
- `geo.ts` - Geospatial calculations
- `geo.test.ts` - Geography tests
- `pointInPolygon.ts` - Geometric algorithms
- `pointInPolygon.test.ts` - Geometry tests
- `storage.tsx` - LocalStorage management
- `storage.test.ts` - Storage tests
- `index.tsx` - Utility exports
- `index.test.ts` - Utility tests

**Key Functions**:

**Geospatial** (`geo.ts`):

- `calculateDistance(lat1, lng1, lat2, lng2)` - Great circle distance
- `calculateBearing(lat1, lng1, lat2, lng2)` - Compass bearing
- `calculateBbox(waypoints)` - Bounding box
- `interpolatePosition(start, end, progress)` - Linear interpolation

**Storage** (`storage.ts`):

- `saveRoute(route)` - Save to localStorage
- `getRoute(id)` - Retrieve from localStorage
- `deleteRoute(id)` - Delete route
- `getAllRoutes()` - List all routes

**Point in Polygon** (`pointInPolygon.ts`):

- `pointInPolygon(point, polygon)` - Check containment
- `raycast()` - Geometric algorithm

---

### `types.ts` - Global Type Definitions

Core TypeScript interfaces used throughout the app.

**Key Types**:

```typescript
interface RouteData {
  id: string;
  name: string;
  waypoints: Waypoint[];
  cruiseSpeed: number;
  speedUnit: "knots" | "kmh";
}

interface Waypoint {
  lat: number;
  lng: number;
  name: string;
}

interface CurrentPosition {
  lat: number;
  lng: number;
  heading: number;
  altitude: number;
  speed: number;
}

interface WeatherData {
  temp: number;
  windSpeed: number;
  windGust: number;
  condition: string;
  cloudCover: number;
  visibility: number;
}
```

---

### `App.jsx` - Root Component

Entry point component that sets up:

- Route providers (React Router)
- Context providers (Theme, i18n, React Query)
- Global error boundaries
- Top-level layout

**Structure**:

```
QueryClientProvider
  └─ ThemeProvider
      └─ I18nProvider
          └─ RouterProvider
              └─ Routes
```

---

### `index.jsx` - Application Entry Point

Mounts the React app to the DOM and imports styles.

---

### `setupTests.ts` - Test Configuration

Configures testing environment:

- React Testing Library defaults
- Mock setup
- Globals

---

## 📊 Data Flow

```
Pages (planner.tsx, tracking.tsx)
  ↓
Organisms (map-view, route-control-panel)
  ↓
Molecules (route-card, waypoint-card)
  ↓
Atoms (badge, stat-display)
  ↓
UI Components (button, card, input)
```

With data coming from:

```
api/ (useQuery hooks)
  ↓
lib/ (React Query, theme, i18n)
  ↓
utils/ (calculations, storage)
  ↓
Components (display & interaction)
```

---

## 🔍 Import Patterns

**Absolute imports** (configured in vite.config.mjs):

```typescript
// ✅ Preferred
import RouteCard from "@/components/molecules/route-card";
import { calculateDistance } from "@/utils/geo";
import { useTheme } from "@/lib/theme-context";
import { RouteData } from "@/types";

// ❌ Avoid relative
import RouteCard from "../../../components/molecules/route-card";
```

---

## 📝 File Naming

- **Components**: `PascalCase.tsx` (e.g., `RouteCard.tsx`)
- **Hooks**: `camelCase.ts` starting with `use` (e.g., `useRoute.ts`)
- **Utils**: `camelCase.ts` (e.g., `calculateDistance.ts`)
- **Tests**: `[name].test.tsx` alongside component/file
- **Types**: `types.ts` (lowercase)
- **Styles**: `[component].css` or global `theme.css`

---

## 🧪 Testing Structure

Each component has a companion `.test.tsx` file:

```
MyComponent.tsx
MyComponent.test.tsx
```

**Test Coverage Target**: 80%+

**Test Types**:

- Unit tests for utils and hooks
- Component tests for rendering and interaction
- Integration tests for multi-component flows

---

## 📚 See Also

- `README_ARCHITECTURE.md` - Full architecture guide
- `src/components/README.md` - Component guidelines
- `src/api/README.md` - API documentation
- Component-level JSDoc comments for detailed documentation
