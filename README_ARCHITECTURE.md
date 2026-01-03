# AirMap - Project Architecture Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Architecture Patterns](#architecture-patterns)
4. [Component Organization](#component-organization)
5. [Best Practices](#best-practices)
6. [Dark/Light Mode Implementation](#darklight-mode-implementation)
7. [Technology Stack](#technology-stack)
8. [Development Workflow](#development-workflow)

---

## Project Overview

**AirMap** is a flight planning and tracking application built with React, TypeScript, and modern web technologies. It provides features for:

- Route planning with waypoint management
- Real-time aircraft tracking
- Weather monitoring
- Airspace visualization
- Dark/Light theme support
- Multi-language support (i18n)

### Key Technologies

- **Frontend Framework**: React 19+ with TypeScript
- **Styling**: Tailwind CSS with custom theme system
- **State Management**: React Query (TanStack Query)
- **Map Visualization**: React Leaflet with Leaflet.js
- **Routing**: React Router v7
- **Drag & Drop**: @hello-pangea/dnd
- **Testing**: Vitest + React Testing Library
- **Build Tool**: Vite

---

## Folder Structure

```
src/
├── api/                 # API integration & data fetching
├── components/          # React components (atomic design)
├── lib/                 # Utility libraries & context
├── locales/             # i18n translations
├── pages/               # Page components (routes)
├── styles/              # Global styles & theme
├── utils/               # Utility functions & helpers
├── types.ts             # TypeScript type definitions
├── App.jsx              # Root app component
├── index.jsx            # Entry point
└── setupTests.ts        # Test configuration
```

### Root-level Configuration Files

- `vite.config.mjs` - Vite build configuration
- `vitest.config.ts` - Vitest testing configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - ShadCN UI components registry
- `eslint.config.js` - ESLint rules
- `.prettierrc.json` - Code formatting rules

---

## Architecture Patterns

### Atomic Design Pattern

The component architecture follows the **Atomic Design** methodology:

```
components/
├── atoms/               # Basic building blocks
│   ├── badge/
│   ├── button/
│   ├── icon-button/
│   ├── stat-display/
│   └── weather-icon/
├── molecules/           # Simple combinations of atoms
│   ├── card-header/
│   ├── collapsible-panel/
│   ├── route-card/
│   ├── stat-grid/
│   ├── waypoint-card/
│   └── weather-card/
├── organisms/           # Complex UI sections
│   ├── map-view/
│   ├── next-waypoint-panel/
│   ├── route-control-panel/
│   ├── tracking-control-panel/
│   ├── waypoints-list-panel/
│   └── weather-panel/
├── ui/                  # ShadCN UI components (Radix UI)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── select.tsx
└── flight/              # Domain-specific components
    └── airspace-layer/
```

### Benefits

- **Reusability**: Small, focused components
- **Maintainability**: Clear separation of concerns
- **Testability**: Easier to test isolated components
- **Scalability**: Simple to extend and compose

---

## Component Organization

### Atoms (Basic Building Blocks)

Atoms are the smallest functional components. They don't depend on other components but may use hooks and utilities.

**Examples**: Badge, Icon Button, Stat Display, Weather Icon

**File Structure**:
```
badge.tsx          # Component implementation
badge.test.tsx     # Unit tests
```

### Molecules (Simple Combinations)

Molecules combine atoms to create simple, reusable UI patterns.

**Examples**: Card Header, Collapsible Panel, Route Card, Stat Grid

**Key Principle**: A molecule should do one thing well and be reusable.

### Organisms (Complex Sections)

Organisms are complex, domain-specific components that combine molecules and atoms to create sections of the UI.

**Examples**: Map View, Route Control Panel, Weather Panel

**Responsibilities**:
- Manage complex state
- Handle data fetching
- Coordinate with API
- Compose multiple molecules

### UI Components

Unstyled, accessible components from ShadCN UI (built on Radix UI). These provide foundational interactive elements.

**Examples**: Button, Card, Input, Select, Dialog

---

## Best Practices

### 1. Component Design

✅ **DO**:
- Keep components focused and single-purpose
- Use TypeScript interfaces for props
- Memoize expensive components with `React.memo`
- Use custom hooks to extract logic
- Write tests alongside components

❌ **DON'T**:
- Mix API calls in atom/molecule components
- Create components with too many props (>5-7)
- Use `any` type - use proper TypeScript
- Make components directly export styled elements

### 2. Type Safety

```typescript
// ✅ Good - explicit type definitions
interface RouteCardProps {
  route: RouteData;
  onEdit: (id: string) => void;
  isSelected?: boolean;
}

// ❌ Avoid - implicit any
interface RouteCardProps {
  route: any;
  onEdit: Function;
}
```

### 3. Hook Usage

```typescript
// ✅ Extract logic to custom hooks
const useFetchRoute = (id: string) => {
  return useQuery({
    queryKey: ['route', id],
    queryFn: () => fetchRoute(id),
  });
};

// ❌ Avoid - business logic in components
const MyComponent = () => {
  const [route, setRoute] = useState(null);
  // Complex logic scattered in component
};
```

### 4. Testing

```typescript
// ✅ Test behavior, not implementation
it('calls onRemove when delete button clicked', () => {
  render(<WaypointCard {...props} />);
  fireEvent.click(screen.getByRole('button', { name: /remove/i }));
  expect(props.onRemove).toHaveBeenCalled();
});

// ❌ Avoid - testing implementation details
it('sets state to deleted', () => {
  // Testing internal state is fragile
});
```

### 5. Code Organization

```
src/
├── [feature]/
│   ├── components/
│   │   ├── MyComponent.tsx
│   │   └── MyComponent.test.tsx
│   ├── hooks/
│   │   └── useMyFeature.ts
│   ├── types.ts
│   └── index.ts
```

### 6. Naming Conventions

- **Components**: PascalCase (`RouteCard.tsx`)
- **Hooks**: camelCase starting with `use` (`useRoute.ts`)
- **Utils**: camelCase (`calculateDistance.ts`)
- **Types**: PascalCase (`RouteData`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_ZOOM_LEVEL`)

### 7. State Management

- **Local State**: Use `useState` for component-specific UI state
- **Shared State**: Use React Context (theme, user preferences)
- **Server State**: Use React Query (`useQuery`, `useMutation`)
- **Never**: Use Redux unless absolutely necessary

---

## Dark/Light Mode Implementation

### How It Works

The dark/light mode system uses React Context to manage theme state globally.

#### 1. **Theme Context** (`src/lib/theme-context.tsx`)

```typescript
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Read from localStorage or system preference
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : systemPrefersDark();
  });

  const toggleTheme = () => {
    setIsDark(prev => !prev);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

#### 2. **Styling Strategy**

Uses **Tailwind CSS** with custom color variables:

```css
/* index.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 0%;
    --card-bg: 0 0% 96%;
    /* ... more colors ... */
  }

  [data-theme="dark"] {
    --background: 0 0% 3.6%;
    --foreground: 0 0% 98%;
    --card-bg: 0 0% 10%;
    /* ... more colors ... */
  }
}

@layer components {
  .bg-app-primary {
    @apply bg-[var(--app-primary)];
  }
  
  .text-app-primary {
    @apply text-[var(--app-primary)];
  }
}
```

#### 3. **Theme Classes**

Apply theme globally via `document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')` or `className={isDark ? 'dark' : ''}`

#### 4. **Component Integration**

```typescript
const MyComponent = () => {
  const { isDark } = useTheme();

  return (
    <div className={`
      transition-colors duration-300
      bg-app-primary text-app-foreground
      ${isDark ? 'dark-specific-class' : 'light-specific-class'}
    `}>
      Content
    </div>
  );
};
```

### Color System

**Light Mode**:
- Primary: Clean blues and teals
- Background: Light grays and whites
- Text: Dark charcoals

**Dark Mode**:
- Primary: Vibrant blues and teals (for contrast)
- Background: Deep charcoals and blacks
- Text: Light grays and whites

### Persistence

Theme preference is saved to localStorage:
```typescript
localStorage.setItem('theme', isDark ? 'dark' : 'light');
```

On app load, it reads this preference or falls back to system preference.

### System Preference Detection

```typescript
const systemPrefersDark = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};
```

---

## Technology Stack

### Core

| Technology | Purpose | Version |
|-----------|---------|---------|
| React | UI Framework | 19.2.3 |
| TypeScript | Type Safety | 5.9.3 |
| Vite | Build Tool | 5.4.11 |
| Tailwind CSS | Styling | 4.1.18 |

### Libraries

| Library | Purpose |
|---------|---------|
| React Query | Server State Management |
| React Router | Client Routing |
| Leaflet | Map Library |
| React Leaflet | Leaflet React Wrapper |
| i18next | Internationalization |
| Lucide React | Icon Library |
| ShadCN UI | Component Library |
| Framer Motion | Animations |

### Development

| Tool | Purpose |
|------|---------|
| Vitest | Unit Testing |
| React Testing Library | Component Testing |
| ESLint | Linting |
| Prettier | Code Formatting |
| Husky | Git Hooks |

---

## Development Workflow

### Setup

```bash
npm install
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Testing

```bash
npm run test        # Run all tests
npm run test:ui     # Interactive test UI
npm run test:coverage # Coverage report
```

### Code Quality

```bash
npm run lint        # Check for linting issues
npm run lint:fix    # Auto-fix linting issues
npm run format      # Format code with Prettier
npm run compile     # TypeScript compilation check
```

### Git Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -m "feat: description"`
3. Run tests: `npm run test`
4. Push and create PR

### Commit Conventions

Follows Conventional Commits:

```
feat: add new feature
fix: fix a bug
docs: documentation changes
style: code style changes
refactor: code refactoring
test: add/update tests
chore: maintenance tasks
```

---

## File-Level Documentation

See also:
- `README.md` - High-level project overview
- `src/README.md` - Source code structure
- `src/components/README.md` - Component guidelines
- `src/api/README.md` - API integration details
- `src/lib/README.md` - Library utilities
- `src/utils/README.md` - Helper functions

---

## Key Takeaways

1. **Atomic Design**: Organize components from simple (atoms) to complex (organisms)
2. **Type Safety**: Use TypeScript for all components and utilities
3. **Testing**: Write tests for behaviors, not implementation
4. **Theme System**: Use CSS variables + Context API for dark/light mode
5. **State Management**: Use appropriate tools for different state types
6. **Code Style**: Follow ESLint + Prettier for consistency
7. **Documentation**: Keep components and functions well-documented

