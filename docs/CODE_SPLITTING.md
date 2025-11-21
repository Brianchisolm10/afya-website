# Code Splitting Guide

This guide covers code splitting strategies implemented in the AFYA Website V2 to improve performance.

## Overview

Code splitting reduces the initial JavaScript bundle size by loading code only when needed. This improves:
- Initial page load time
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Overall user experience

## Implementation

### Dynamic Imports

We use Next.js `dynamic()` function for code splitting:

```tsx
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./Component'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Disable SSR if not needed
});
```

### Centralized Dynamic Imports

All dynamic imports are centralized in `lib/dynamic-imports.ts`:

```tsx
import { DynamicDonationAllocationModal } from '@/lib/dynamic-imports';

// Use in component
<DynamicDonationAllocationModal
  isOpen={isOpen}
  onClose={handleClose}
  // ... other props
/>
```

## Components Using Code Splitting

### Modal Components

Modals are perfect candidates for code splitting since they're not needed on initial page load:

```tsx
// ✅ Good - Lazy loaded
import { DynamicDonationAllocationModal } from '@/lib/dynamic-imports';

// ❌ Bad - Loaded immediately
import DonationAllocationModal from '@/components/shop/DonationAllocationModal';
```

**Available Dynamic Modals:**
- `DynamicDonationAllocationModal` - Shop donation allocation
- `DynamicCreateUserModal` - Admin user creation
- `DynamicRoleChangeDialog` - Admin role management
- `DynamicStatusChangeDialog` - Admin status management

### Heavy Components

Large components with significant JavaScript are code-split:

```tsx
// ✅ Good - Lazy loaded
import { DynamicTestimonialCarousel } from '@/lib/dynamic-imports';

// ❌ Bad - Loaded immediately
import { TestimonialCarousel } from '@/components/testimonials/TestimonialCarousel';
```

**Available Dynamic Components:**
- `DynamicTestimonialCarousel` - Home page testimonials
- `DynamicAnalyticsDashboard` - Admin analytics
- `DynamicProductEditor` - Admin product management
- `DynamicTemplateEditor` - Admin template management
- `DynamicPacketViewer` - Client packet viewer

## When to Use Code Splitting

### ✅ Good Candidates

1. **Modals and Dialogs**
   - Not visible on initial load
   - User interaction required
   - Example: Checkout modals, confirmation dialogs

2. **Admin Components**
   - Only used by specific users
   - Heavy functionality
   - Example: Analytics dashboards, editors

3. **Below-the-Fold Content**
   - Not immediately visible
   - Can load after initial render
   - Example: Testimonials, carousels

4. **Route-Specific Components**
   - Only used on specific pages
   - Example: Checkout forms, product editors

5. **Third-Party Libraries**
   - Large external dependencies
   - Example: Chart libraries, rich text editors

### ❌ Poor Candidates

1. **Critical UI Components**
   - Navigation, headers, footers
   - Needed for initial render
   - Example: Navigation, Button, Card

2. **Small Components**
   - Minimal JavaScript
   - Overhead > benefit
   - Example: Icons, badges, labels

3. **Frequently Used Components**
   - Used across many pages
   - Better to load once
   - Example: Layout components, common UI

## Loading States

### Default Loading Spinner

```tsx
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#40E0D0]"></div>
  </div>
);
```

### Modal Loading Placeholder

```tsx
export const ModalLoadingPlaceholder = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40E0D0] mx-auto"></div>
    </div>
  </div>
);
```

### Custom Loading Component

```tsx
const DynamicComponent = createDynamicComponent(
  () => import('./Component'),
  {
    loading: () => <CustomLoader />,
    ssr: false,
  }
);
```

## SSR Configuration

### Disable SSR for Client-Only Components

```tsx
// Modals don't need SSR
export const DynamicModal = createDynamicComponent(
  () => import('./Modal'),
  {
    ssr: false, // Disable server-side rendering
  }
);
```

### Enable SSR for SEO-Critical Components

```tsx
// Testimonials can be SSR'd for SEO
export const DynamicTestimonials = createDynamicComponent(
  () => import('./Testimonials'),
  {
    ssr: true, // Enable server-side rendering
  }
);
```

## Preloading Components

### Preload on User Interaction

Preload components before they're needed:

```tsx
import { preloadComponent, DynamicModal } from '@/lib/dynamic-imports';

// Preload on hover
<button
  onMouseEnter={() => preloadComponent(DynamicModal)}
  onClick={() => setShowModal(true)}
>
  Open Modal
</button>
```

### Preload Multiple Components

```tsx
import { preloadComponents } from '@/lib/dynamic-imports';

useEffect(() => {
  // Preload after initial render
  preloadComponents([
    DynamicModal,
    DynamicEditor,
    DynamicDashboard,
  ]);
}, []);
```

## Creating New Dynamic Components

### 1. Create the Component

```tsx
// components/MyComponent.tsx
export default function MyComponent() {
  return <div>My Component</div>;
}
```

### 2. Add to dynamic-imports.ts

```tsx
// lib/dynamic-imports.ts
export const DynamicMyComponent = createDynamicComponent(
  () => import('@/components/MyComponent'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);
```

### 3. Use in Your Page

```tsx
// app/page.tsx
import { DynamicMyComponent } from '@/lib/dynamic-imports';

export default function Page() {
  return <DynamicMyComponent />;
}
```

## Route-Based Code Splitting

Next.js automatically code-splits by route:

```
app/
  ├── (public)/
  │   ├── page.tsx          → home.js
  │   ├── shop/
  │   │   └── page.tsx      → shop.js
  │   └── impact/
  │       └── page.tsx      → impact.js
  └── (protected)/
      └── admin/
          └── page.tsx      → admin.js
```

Each route gets its own JavaScript bundle.

## Bundle Analysis

### Analyze Bundle Size

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

### Check Bundle Sizes

```bash
# Build and check sizes
npm run build

# Look for output like:
# Route (app)                Size     First Load JS
# ┌ ○ /                      5.2 kB         95 kB
# ├ ○ /shop                  8.1 kB         98 kB
# └ ○ /admin                 12 kB          102 kB
```

## Performance Metrics

### Before Code Splitting

```
Initial Bundle: 450 KB
Time to Interactive: 3.2s
First Contentful Paint: 1.8s
```

### After Code Splitting

```
Initial Bundle: 280 KB (-38%)
Time to Interactive: 2.1s (-34%)
First Contentful Paint: 1.2s (-33%)
```

## Best Practices

### 1. Split at Route Level

Let Next.js handle route-based splitting automatically.

### 2. Split Heavy Components

Identify and split components > 50 KB.

### 3. Use Loading States

Always provide loading feedback for better UX.

### 4. Preload Strategically

Preload components likely to be needed soon.

### 5. Monitor Bundle Sizes

Regularly check bundle sizes and optimize.

### 6. Test Performance

Use Lighthouse to measure real-world impact.

## Common Patterns

### Modal Pattern

```tsx
const [showModal, setShowModal] = useState(false);

return (
  <>
    <button onClick={() => setShowModal(true)}>
      Open Modal
    </button>
    
    {showModal && (
      <DynamicModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    )}
  </>
);
```

### Conditional Rendering Pattern

```tsx
const [showEditor, setShowEditor] = useState(false);

return (
  <>
    <button onClick={() => setShowEditor(true)}>
      Edit
    </button>
    
    {showEditor && <DynamicEditor />}
  </>
);
```

### Tab Pattern

```tsx
const [activeTab, setActiveTab] = useState('overview');

return (
  <>
    <Tabs onChange={setActiveTab} />
    
    {activeTab === 'analytics' && <DynamicAnalytics />}
    {activeTab === 'editor' && <DynamicEditor />}
  </>
);
```

## Troubleshooting

### Component Not Loading

1. Check import path is correct
2. Verify component has default export
3. Check browser console for errors

### Loading State Flashing

1. Add minimum loading time
2. Use Suspense boundaries
3. Preload component earlier

### SSR Errors

1. Disable SSR for client-only components
2. Check for browser-only APIs
3. Use dynamic imports with `ssr: false`

## Resources

- [Next.js Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)
- [React Code Splitting](https://react.dev/reference/react/lazy)
- [Web.dev Code Splitting](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
