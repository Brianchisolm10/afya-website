# UI Components

This directory contains reusable UI components for the AFYA application. All components are built with accessibility, responsiveness, and consistent styling in mind.

## Components

### Button

A versatile button component with multiple variants and sizes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `isLoading`: boolean (default: false) - Shows loading spinner
- `fullWidth`: boolean (default: false) - Makes button full width
- `as`: 'button' | 'a' - Render as button or anchor tag

**Example:**
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>

<Button as="a" href="/page" variant="outline">
  Link Button
</Button>
```

### Card

A container component for grouping related content.

**Props:**
- `variant`: 'default' | 'bordered' | 'elevated' (default: 'default')
- `padding`: 'none' | 'sm' | 'md' | 'lg' (default: 'md')
- `hoverable`: boolean (default: false) - Adds hover effect

**Example:**
```tsx
import { Card } from '@/components/ui';

<Card variant="elevated" hoverable>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

### Badge

A small label component for displaying status or counts.

**Props:**
- `variant`: 'default' | 'success' | 'warning' | 'danger' | 'info' (default: 'default')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

**Example:**
```tsx
import { Badge } from '@/components/ui';

<Badge variant="success">Ready</Badge>
<Badge variant="danger" size="sm">Error</Badge>
```

### Input

A form input component with label, error, and helper text support.

**Props:**
- `label`: string - Input label
- `error`: string - Error message to display
- `helperText`: string - Helper text below input
- `fullWidth`: boolean (default: false) - Makes input full width
- All standard HTML input attributes

**Example:**
```tsx
import { Input } from '@/components/ui';

<Input
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  required
  fullWidth
/>
```

### Spinner

A loading spinner component.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `color`: 'primary' | 'secondary' | 'white' | 'gray' (default: 'primary')
- `label`: string (default: 'Loading') - Accessible label

**Example:**
```tsx
import { Spinner } from '@/components/ui';

<Spinner size="lg" color="primary" />
```

### Skeleton

A placeholder component for loading states.

**Props:**
- `variant`: 'text' | 'circular' | 'rectangular' (default: 'text')
- `width`: string | number - Width of skeleton
- `height`: string | number - Height of skeleton
- `animation`: 'pulse' | 'wave' | 'none' (default: 'pulse')

**Example:**
```tsx
import { Skeleton } from '@/components/ui';

<Skeleton width="200px" height="24px" />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width="100%" height="100px" />
```

## Accessibility Features

All components include:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus visible states
- Screen reader support
- Semantic HTML elements

## Styling

Components use Tailwind CSS with custom AFYA theme colors:
- `afya-primary`: #1a73e8 (Blue)
- `afya-secondary`: #34a853 (Green)
- `afya-accent`: #fbbc04 (Yellow)
- `afya-dark`: #202124 (Dark Gray)
- `afya-light`: #f8f9fa (Light Gray)

## Responsive Design

All components are responsive and work across:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)
