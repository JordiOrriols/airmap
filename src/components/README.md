# Components - Atomic Design Guidelines

## Overview

Components follow the **Atomic Design** methodology, organizing UI elements from simple (atoms) to complex (organisms).

## 🏗️ Component Hierarchy

```
Atoms ────→ Molecules ────→ Organisms ────→ Pages
(Basic)    (Simple)       (Complex)      (Screens)
```

---

## 📦 Atoms - Building Blocks

Smallest reusable components. **Should not depend on other components.**

### Examples

| Component         | Purpose                 | Props                            |
| ----------------- | ----------------------- | -------------------------------- |
| `Badge`           | Label/tag display       | `children`, `gradient`, `size`   |
| `GlassCard`       | Frosted glass container | `children`, `className`          |
| `GradientIcon`    | Icon with gradient      | `icon`, `gradient`               |
| `IconButton`      | Icon-only button        | `icon`, `onClick`, `ariaLabel`   |
| `ScrollContainer` | Scrollable wrapper      | `children`, `className`          |
| `StatDisplay`     | Labeled value           | `label`, `value`, `unit`, `icon` |
| `ThemeToggle`     | Dark/light mode switch  | `isDark`, `onToggle`             |
| `WeatherIcon`     | Weather condition icon  | `condition`, `size`              |

### Atom Guidelines

✅ **DO**:

- Single responsibility
- Accept style props (`className`)
- Export plain HTML semantics
- Use TypeScript interfaces
- Be fully reusable
- Have no business logic

❌ **DON'T**:

- Import other components
- Manage state (except UI state)
- Make API calls
- Have side effects
- Depend on context (except theme/i18n)

### Example: Atom Structure

```
atoms/
└── stat-display/
    ├── stat-display.tsx       # Component
    ├── stat-display.test.tsx  # Tests
    └── index.ts               # Exports
```

```typescript
// stat-display.tsx
interface StatDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ComponentType;
  size?: 'sm' | 'md' | 'lg';
}

export const StatDisplay: React.FC<StatDisplayProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  size = 'md',
}) => {
  return (
    <div className={`stat-display stat-display--${size}`}>
      {Icon && <Icon className="stat-icon" />}
      <div>
        <span className="stat-label">{label}</span>
        <span className="stat-value">
          {value}{unit && ` ${unit}`}
        </span>
      </div>
    </div>
  );
};
```

---

## 🔗 Molecules - Simple Combinations

Combine 2-3 atoms into reusable patterns. **May have local state or callbacks.**

### Examples

| Component          | Purpose            | Uses                          |
| ------------------ | ------------------ | ----------------------------- |
| `CardHeader`       | Header section     | Badge, Gradient Icon          |
| `CollapsiblePanel` | Expandable section | Button, Content               |
| `RouteActionsMenu` | Dropdown menu      | Button, Menu items            |
| `RouteCard`        | Route summary      | Badge, Stats, Button          |
| `StatGrid`         | Multiple stats     | StatDisplay atoms             |
| `WaypointCard`     | Waypoint display   | Badge, Icon Button, Content   |
| `WeatherCard`      | Weather summary    | Icon, Temperature, Conditions |

### Molecule Guidelines

✅ **DO**:

- Combine atoms purposefully
- Have clear, focused purpose
- Accept callback props
- Use local state for UI only
- Be testable and reusable

❌ **DON'T**:

- Directly call APIs
- Manage complex application state
- Have too many props (>8)
- Implement business logic
- Depend on specific pages

### Example: Molecule Structure

```
molecules/
└── route-card/
    ├── route-card.tsx
    ├── route-card.test.tsx
    └── index.ts
```

```typescript
// route-card.tsx
interface RouteCardProps {
  route: RouteData;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  isSelected,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      className={`route-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect?.(route.id)}
    >
      <CardHeader title={route.name} />
      <StatGrid stats={route.stats} />
      <button onClick={() => onDelete?.(route.id)}>Delete</button>
    </div>
  );
};
```

---

## 🧩 Organisms - Complex Sections

Complex domain-specific components combining molecules. **May handle data fetching and state management.**

### Examples

| Component              | Purpose            | Responsibility                  |
| ---------------------- | ------------------ | ------------------------------- |
| `MapView`              | Interactive map    | Map rendering, waypoint markers |
| `NextWaypointPanel`    | Next waypoint info | Display navigation data         |
| `RouteControlPanel`    | Route editing      | Form, validation, updates       |
| `TrackingControlPanel` | Tracking controls  | Control UI for tracking         |
| `WaypointsListPanel`   | Waypoint list      | Drag/drop, add/remove           |
| `WeatherPanel`         | Weather display    | Weather data display            |

### Organism Guidelines

✅ **DO**:

- Manage state and side effects
- Handle data fetching with React Query
- Compose multiple molecules
- Implement domain logic
- Have clear API contract

❌ **DON'T**:

- Put page-level logic here
- Make organisms depend on other organisms
- Render multiple unrelated features
- Have too many responsibilities
- Make API calls directly (use hooks)

### Example: Organism Structure

```
organisms/
└── route-control-panel/
    ├── route-control-panel.tsx
    ├── route-control-panel.test.tsx
    ├── useRoute.ts              # Custom hook
    └── index.ts
```

```typescript
// route-control-panel.tsx
interface RouteControlPanelProps {
  route: RouteData;
  onSave: (route: RouteData) => void;
  onDelete: (id: string) => void;
}

export const RouteControlPanel: React.FC<RouteControlPanelProps> = ({
  route,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState(route.name);
  const [speed, setSpeed] = useState(route.cruiseSpeed);

  const handleSave = () => {
    onSave({ ...route, name, cruiseSpeed: speed });
  };

  return (
    <GlassCard>
      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={() => onDelete(route.id)}>Delete</button>
      </div>
    </GlassCard>
  );
};
```

---

## 🎨 UI Components - Unstyled Primitives

Base components from ShadCN UI (Radix UI). **Foundation for all interactive elements.**

### Available Components

- `Button` - Interactive button
- `Card` - Container element
- `Input` - Text input field
- `Select` - Dropdown selector
- `Dialog` - Modal dialog
- `Menu` - Dropdown menu
- `Checkbox` - Checkbox input
- `Label` - Form label

### Usage Example

```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const MyComponent = () => (
  <Card>
    <Button onClick={() => alert('Clicked!')}>
      Click me
    </Button>
  </Card>
);
```

---

## 📊 Component Props Patterns

### Callback Pattern

```typescript
interface MyComponentProps {
  onSave?: (data: Data) => void;
  onDelete?: (id: string) => void;
  onError?: (error: Error) => void;
}
```

### Status Pattern

```typescript
interface MyComponentProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  isSelected?: boolean;
  status?: "idle" | "loading" | "success" | "error";
}
```

### Optional vs Required

```typescript
interface MyComponentProps {
  title: string; // Required
  subtitle?: string; // Optional
  onSubmit?: () => void; // Optional callback
  isOpen: boolean; // Required boolean
}
```

---

## 🧪 Testing Components

### Atom Tests

```typescript
it('renders with correct content', () => {
  render(<Badge>Test Badge</Badge>);
  expect(screen.getByText('Test Badge')).toBeInTheDocument();
});

it('applies gradient class', () => {
  const { container } = render(
    <Badge gradient="from-blue-500 to-teal-500">
      Gradient Badge
    </Badge>
  );
  expect(container.querySelector('.badge')).toHaveClass('gradient');
});
```

### Molecule Tests

```typescript
it('calls onSelect when clicked', () => {
  const onSelect = vi.fn();
  render(<RouteCard route={mockRoute} onSelect={onSelect} />);
  fireEvent.click(screen.getByText(mockRoute.name));
  expect(onSelect).toHaveBeenCalledWith(mockRoute.id);
});

it('shows selected state', () => {
  const { container } = render(
    <RouteCard route={mockRoute} isSelected={true} />
  );
  expect(container.querySelector('.route-card')).toHaveClass('selected');
});
```

### Organism Tests

```typescript
it('saves route with updated data', async () => {
  const onSave = vi.fn();
  render(
    <RouteControlPanel
      route={mockRoute}
      onSave={onSave}
    />
  );

  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'New Name' }
  });
  fireEvent.click(screen.getByText(/save/i));

  await waitFor(() => {
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Name' })
    );
  });
});
```

---

## 📋 Component Checklist

When creating a new component:

- [ ] Component has single, clear responsibility
- [ ] Props are fully typed with TypeScript
- [ ] Component is tested with meaningful assertions
- [ ] Accessibility attributes added (aria-labels, roles)
- [ ] Responsive design considered
- [ ] Dark/light mode compatible
- [ ] README or JSDoc comments added
- [ ] Component is reusable (not page-specific)
- [ ] Named exports in index.ts
- [ ] Component story or example provided

---

## 📚 Component Library

### Storybook

Components can be documented in Storybook (if set up):

```typescript
// MyComponent.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./MyComponent";

const meta = {
  component: MyComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Hello World",
  },
};
```

---

## 🎯 Best Practices Summary

### Naming

- Use descriptive names: `RouteCard` not `RC`
- PascalCase for components: `WaypointCard.tsx`
- Avoid generic names: ❌ `Item`, ❌ `Panel`

### Organization

- One component per file
- Companion test file alongside
- index.ts for exports
- Related assets in same folder

### Props

- Keep prop interfaces small (<8 props)
- Mark optional props clearly
- Document prop purposes
- Use discriminated unions for variants

### Styling

- Use Tailwind classes
- Support dark mode via theme
- Keep styles in component file (not external CSS)
- Consistent spacing/sizing system

### Reusability

- Extract logic to hooks
- Make components composition-friendly
- Avoid business logic in components
- Pass data/callbacks, not implementation
