# Library Integrations - Core Infrastructure

## Overview

This folder contains setup and configuration for core libraries:

- **React Query** - Server state & data fetching
- **i18n** - Internationalization (translations)
- **Theme Context** - Dark/light mode management
- **Utilities** - Helper functions

## 📁 Structure

```
lib/
├── i18n.ts            # i18n configuration
├── i18n.test.ts       # i18n tests
├── react-query.ts     # React Query setup
├── react-query.test.ts
├── theme-context.tsx  # Theme provider & hook
├── theme-context.test.tsx
├── utils.ts           # Shared utilities
├── utils.test.ts
└── README.md          # This file
```

---

## 🌍 Internationalization (i18n)

**File:** [i18n.ts](i18n.ts)

Multi-language support using i18next.

### Supported Languages

| Code | Language |
| ---- | -------- |
| `en` | English  |
| `es` | Spanish  |
| `ca` | Catalan  |

### Configuration

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en";
import es from "@/locales/es";
import ca from "@/locales/ca";

i18n.use(initReactI18next).init({
  resources: { en, es, ca },
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  ns: ["translation"],
  defaultNS: "translation",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
```

### Translation Files

Located in [../locales/](../locales/):

```
locales/
├── en.ts         # English translations
├── es.ts         # Spanish translations
├── ca.ts         # Catalan translations
├── types.ts      # Type definitions
└── README.md     # Translation guide
```

### Translation Structure

```typescript
// locales/en.ts
export const en = {
  translation: {
    app: {
      title: "AirMap",
      description: "Flight planning made simple",
    },
    navigation: {
      home: "Home",
      planner: "Route Planner",
      tracking: "Flight Tracking",
    },
    route: {
      name: "Route Name",
      create: "Create Route",
      edit: "Edit Route",
      delete: "Delete Route",
      noRoutes: "No routes yet",
    },
    // ... nested structure for organization
  },
};
```

### Usage in Components

#### useTranslation Hook

```typescript
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header>
      <h1>{t('app.title')}</h1>
      <p>{t('app.description')}</p>
    </header>
  );
};
```

#### Nested Keys

```typescript
// Using dot notation for nested access
t("navigation.planner"); // "Route Planner"
t("route.create"); // "Create Route"

// Or use nested object structure
t("route.noRoutes"); // "No routes yet"
```

#### With Interpolation

```typescript
// locales/en.ts
export const en = {
  translation: {
    welcome: 'Welcome, {{name}}!',
    distance: 'Distance: {{value}} {{unit}}',
    eta: 'ETA: {{time, datetime}}',
  },
};

// Component
export const RouteInfo = ({ route }: Props) => {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t('distance', {
        value: route.distance.toFixed(1),
        unit: 'nm'
      })}</p>
      <p>{t('eta', {
        time: route.estimatedTime
      })}</p>
    </div>
  );
};
```

#### Language Switching

```typescript
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <select onChange={(e) => handleLanguageChange(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="ca">Català</option>
    </select>
  );
};
```

### Translation Best Practices

1. **Use Keys Consistently**

   ```typescript
   ✅ t('route.edit')    // Clear hierarchy
   ❌ t('editRoute')     // Harder to maintain
   ```

2. **Namespace Related Strings**

   ```typescript
   // Group by feature
   route: {
     create: '...',
     edit: '...',
     delete: '...',
   }
   ```

3. **Extract Magic Strings**

   ```typescript
   ❌ if (status === 'pending') { }
   ✅ if (status === ROUTE_STATUS.PENDING) { }

   // Translation key: 'route.status.pending'
   ```

4. **Handle Pluralization**

   ```typescript
   // locales/en.ts
   routes: {
     one: '1 route',
     other: '{{count}} routes',
   }

   // Component
   const { t } = useTranslation();
   t('routes', { count: routeCount })
   ```

---

## 🎨 Theme Context - Dark/Light Mode

**File:** [theme-context.tsx](theme-context.tsx)

Manages application theme (dark/light mode) with persistence.

### Setup

```typescript
import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDark, setIsDark] = useState(() => {
    // Restore from localStorage or system preference
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Update localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update DOM class
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### Theme Implementation

#### CSS Variables

```css
/* styles/theme.css */

:root {
  /* Light mode (default) */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-text-primary: #000000;
  --color-text-secondary: #666666;
  --color-border: #e0e0e0;

  --color-primary: #007bff;
  --color-success: #28a745;
  --color-warning: #ffc107;
  --color-error: #dc3545;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Dark mode */
:root.dark {
  --color-bg-primary: #1a1a1a;
  --color-bg-secondary: #2d2d2d;
  --color-text-primary: #ffffff;
  --color-text-secondary: #a0a0a0;
  --color-border: #444444;

  --color-primary: #4a9eff;
  --color-success: #51cf66;
  --color-warning: #ffd43b;
  --color-error: #ff6b6b;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.5);
}
```

#### Using Theme in Components

```typescript
import { useTheme } from '@/lib/theme-context';
import styles from './MyComponent.module.css';

export const MyComponent = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={isDark ? styles.dark : styles.light}>
      <p className="text-color-text-primary">
        Content
      </p>
      <button onClick={toggleTheme}>
        Switch to {isDark ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
};
```

#### Tailwind CSS Integration

If using Tailwind (as in this project):

```css
/* With Tailwind's @apply */
.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded;
}

.dark .btn-primary {
  @apply bg-blue-600;
}
```

Or use Tailwind's dark mode:

```tsx
<div className="bg-white dark:bg-slate-900">
  <p className="text-black dark:text-white">Content</p>
</div>
```

### Theme Persistence Flow

```
User Toggles Theme
        ↓
toggleTheme() called
        ↓
State updated (isDark)
        ↓
useEffect triggers
        ↓
Save to localStorage
        ↓
Add/remove 'dark' class on document
        ↓
CSS variables update
        ↓
UI re-renders with new colors
```

### Testing Theme

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { useTheme } from '@/lib/theme-context';

describe('ThemeProvider', () => {
  it('toggles dark mode', () => {
    const TestComponent = () => {
      const { isDark, toggleTheme } = useTheme();
      return (
        <div>
          <p>{isDark ? 'Dark' : 'Light'}</p>
          <button onClick={toggleTheme}>Toggle</button>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText('Light')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('persists theme to localStorage', () => {
    render(<ThemeProvider><div>Test</div></ThemeProvider>);
    expect(localStorage.getItem('theme')).toBeTruthy();
  });
});
```

---

## 🔄 React Query Setup

**File:** [react-query.ts](react-query.ts)

Centralized React Query configuration.

### Configuration

```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

### Provider Setup

```typescript
// main.jsx or App.jsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { ThemeProvider } from '@/lib/theme-context';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <YourApp />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

### Query Patterns

See [api/README.md](../api/README.md) for detailed query patterns.

---

## 🛠️ Utility Functions

**File:** [utils.ts](utils.ts)

Shared helper functions used across the application.

### Common Utilities

```typescript
// Format date to readable string
export const formatDate = (date: Date, format?: string): string

// Format time duration
export const formatDuration = (seconds: number): string

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void

// Deep clone object
export const deepClone = <T>(obj: T): T

// Sleep/delay
export const sleep = (ms: number): Promise<void>
```

### Usage Examples

```typescript
import { formatDate, debounce, sleep } from "@/lib/utils";

// Format date
const dateStr = formatDate(new Date(), "YYYY-MM-DD HH:mm");

// Debounced search
const debouncedSearch = debounce((query: string) => {
  fetchResults(query);
}, 300);

// Async delay
await sleep(1000); // Wait 1 second
```

---

## 🧪 Testing Setup

### Mocking Providers

```typescript
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { ThemeProvider } from '@/lib/theme-context';

export const TestProviders = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </QueryClientProvider>
);

// Usage in tests
render(
  <TestProviders>
    <YourComponent />
  </TestProviders>
);
```

### Mocking i18n

```typescript
import i18next from "i18next";

beforeEach(() => {
  i18next.changeLanguage("en");
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn() },
  }),
}));
```

---

## 📚 Integration Order

When setting up a new app with these libraries:

1. **i18n** - Initialize translations early
2. **Theme Context** - Set up theme provider
3. **React Query** - Configure queryClient
4. **App Components** - Wrap with providers

```typescript
// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Initialize i18n first
import '@/lib/i18n'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { ThemeProvider } from '@/lib/theme-context'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
```

---

## 🔗 Library Documentation

- **i18next**: https://www.i18next.com/
- **React i18next**: https://react.i18next.com/
- **React Query**: https://tanstack.com/query/latest
- **Tailwind CSS**: https://tailwindcss.com/
