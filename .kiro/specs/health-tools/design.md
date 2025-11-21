# Health Tools Feature - Design Document

## Overview

The Health Tools feature provides a collection of simple, educational health calculators and assessments that make health metrics accessible and non-intimidating. The design emphasizes clarity, encouragement, and education over data overload, aligning with AFYA's mission to make wellness accessible to everyone.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Health Tools Page                        │
│                    (/tools route)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Tool Cards Grid                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Energy  │  │  Plate   │  │ Movement │  │ Hydration│   │
│  │   Tool   │  │ Builder  │  │ Checker  │  │  Sleep   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │   HR     │  │ Recovery │  │  Youth   │                 │
│  │  Zones   │  │ Check-In │  │  Corner  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Tool Panel (Modal/Expanded)               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Tool-Specific Component                              │  │
│  │  - Input Form                                         │  │
│  │  - Calculation Logic                                  │  │
│  │  - Results Display                                    │  │
│  │  - Educational Content                                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (matching existing AFYA design system)
- **State Management**: React hooks (useState, useEffect)
- **Validation**: Zod schemas for input validation
- **Calculations**: Client-side JavaScript (no backend required)
- **Icons**: Lucide React (consistent with existing site)

## Components and Interfaces

### 1. Main Tools Page Component

**File**: `app/(public)/tools/page.tsx`

```typescript
interface ToolsPageProps {
  // No props needed - public page
}

// Displays grid of tool cards
// Handles tool selection/expansion
// Manages active tool state
```

### 2. Tool Card Component

**File**: `components/tools/ToolCard.tsx`

```typescript
interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string; // Tailwind gradient classes
  onOpen: () => void;
}

// Displays tool preview
// Handles click to open tool
// Shows icon, title, description, and CTA button
```

### 3. Tool Panel Component

**File**: `components/tools/ToolPanel.tsx`

```typescript
interface ToolPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Modal or expanded panel container
// Handles close/back navigation
// Provides consistent layout for all tools
```

### 4. Individual Tool Components

Each tool is a self-contained component with its own logic:

#### Energy & Protein Calculator

**File**: `components/tools/EnergyProteinCalculator.tsx`

```typescript
interface EnergyProteinInputs {
  age: number;
  sex: 'male' | 'female';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
}

interface EnergyProteinResults {
  dailyCalories: number;
  proteinRangeMin: number;
  proteinRangeMax: number;
  explanation: string;
}

// Uses Mifflin-St Jeor equation for BMR
// Applies activity multiplier
// Adjusts for goal (+/- 500 cal)
// Calculates protein: 0.8-1.2g per kg for maintenance, up to 2.0g for athletes
```

#### Plate Builder

**File**: `components/tools/PlateBuilder.tsx`

```typescript
interface PlateBuilderInputs {
  goal: 'energy' | 'performance' | 'recovery';
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

interface PlateProportions {
  vegetables: number; // percentage
  protein: number;
  carbs: number;
  fats: number;
  visual: string; // SVG or CSS representation
  examples: string[];
}

// Predefined plate templates for each goal/meal combination
// Visual plate representation using CSS or SVG
// 2-3 example meals per combination
```

#### Movement Minutes Checker

**File**: `components/tools/MovementChecker.tsx`

```typescript
interface MovementInputs {
  totalMinutes: number;
  activeDays: number;
}

interface MovementResults {
  percentOfGoal: number;
  status: 'below' | 'meeting' | 'exceeding';
  encouragement: string;
  suggestion: string;
}

// Compares to 150 min/week baseline
// Provides encouraging feedback
// Suggests practical next steps
```

#### Hydration & Sleep Snapshot

**File**: `components/tools/HydrationSleepSnapshot.tsx`

```typescript
interface HydrationSleepInputs {
  sleepHours: number;
  waterCups: number;
}

interface HydrationSleepResults {
  sleepStatus: 'below' | 'within' | 'above';
  hydrationStatus: 'below' | 'within' | 'above';
  sleepTip: string;
  hydrationTip: string;
}

// Sleep range: 7-9 hours for adults
// Hydration range: 8-10 cups for adults
// Provides specific, actionable tips
```

#### Heart Rate Zone Finder

**File**: `components/tools/HeartRateZones.tsx`

```typescript
interface HeartRateInputs {
  age: number;
  restingHR?: number;
}

interface HeartRateZones {
  easy: { min: number; max: number };
  moderate: { min: number; max: number };
  vigorous: { min: number; max: number };
  maxHR: number;
  explanation: string;
}

// Max HR = 220 - age (simple formula)
// If resting HR provided, use Karvonen formula
// Easy: 50-60% of HRR
// Moderate: 60-70% of HRR
// Vigorous: 70-85% of HRR
```

#### Stress & Recovery Check-In

**File**: `components/tools/RecoveryCheckIn.tsx`

```typescript
interface RecoveryInputs {
  energy: number; // 1-5 scale
  soreness: number; // 1-5 scale
  stress: number; // 1-5 scale
  mood: number; // 1-5 scale
}

interface RecoveryResults {
  score: number; // aggregate score
  label: 'Recovery Day' | 'Half-Speed Day' | 'Green Light Day';
  guidance: string;
  color: string; // for visual indicator
}

// Average the 4 inputs
// Score < 2.5: Recovery Day
// Score 2.5-3.5: Half-Speed Day
// Score > 3.5: Green Light Day
```

#### Youth Corner Tool

**File**: `components/tools/YouthCorner.tsx`

```typescript
interface YouthInputs {
  screenTimeHours: number;
  playTimeHours: number;
}

interface YouthResults {
  ratio: number;
  message: string;
  suggestion: string;
  encouragement: string;
}

// Compare screen time to play time
// Gentle, non-judgmental feedback
// Practical suggestions for families
```

### 5. Shared Utilities

**File**: `lib/tools/calculations.ts`

```typescript
// Shared calculation functions
export function calculateBMR(weight: number, height: number, age: number, sex: string): number;
export function calculateTDEE(bmr: number, activityLevel: string): number;
export function calculateHeartRateZones(age: number, restingHR?: number): HeartRateZones;
export function validateToolInput(schema: ZodSchema, data: unknown): ValidationResult;
```

**File**: `lib/tools/constants.ts`

```typescript
// Activity level multipliers
export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Protein recommendations (g per kg body weight)
export const PROTEIN_RANGES = {
  sedentary: { min: 0.8, max: 1.0 },
  active: { min: 1.2, max: 1.6 },
  athlete: { min: 1.6, max: 2.0 },
};

// Sleep recommendations by age
export const SLEEP_RANGES = {
  teen: { min: 8, max: 10 },
  adult: { min: 7, max: 9 },
  senior: { min: 7, max: 8 },
};
```

**File**: `lib/tools/validation.ts`

```typescript
import { z } from 'zod';

export const energyProteinSchema = z.object({
  age: z.number().min(13).max(100),
  sex: z.enum(['male', 'female']),
  heightCm: z.number().min(100).max(250),
  weightKg: z.number().min(30).max(300),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  goal: z.enum(['lose', 'maintain', 'gain']),
});

// Additional schemas for other tools...
```

## Data Models

### Tool Configuration

```typescript
interface ToolConfig {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  gradient: string; // Tailwind gradient classes
  category: 'nutrition' | 'movement' | 'recovery' | 'youth';
  order: number;
  isActive: boolean;
}

// Stored in: lib/tools/tool-config.ts
export const TOOL_CONFIGS: ToolConfig[] = [
  {
    id: 'energy-protein',
    title: 'Daily Energy & Protein Needs',
    description: 'Find your calorie and protein starting point',
    icon: 'Utensils',
    gradient: 'from-teal-400 to-cyan-500',
    category: 'nutrition',
    order: 1,
    isActive: true,
  },
  // ... other tools
];
```

### No Database Required

All calculations are performed client-side. No user data is stored. This keeps the tools:
- Fast and responsive
- Privacy-friendly
- Simple to maintain
- Accessible without authentication

## User Interface Design

### Design System Integration

**Colors** (from existing AFYA palette):
- Primary: Turquoise (#40E0D0)
- Secondary: Lavender (#E6E6FA)
- Accent: Coral (#FF7F50)
- Neutrals: Warm grays
- Success: Soft green
- Info: Soft blue

**Typography**:
- Headings: Existing heading styles (font-sans, bold)
- Body: Existing body styles (font-sans, regular)
- Labels: text-sm, text-gray-600

**Spacing**:
- Consistent with existing pages (p-6, gap-6, etc.)
- Mobile-first responsive spacing

### Tool Cards Layout

```
┌─────────────────────────────────────────────────────────┐
│  Health Tools                                            │
│  Simple tools to understand your health better          │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   🍽️         │  │   🥗         │  │   🏃         │ │
│  │              │  │              │  │              │ │
│  │ Energy &     │  │ Plate        │  │ Movement     │ │
│  │ Protein      │  │ Builder      │  │ Checker      │ │
│  │              │  │              │  │              │ │
│  │ Find your    │  │ Learn        │  │ Track your   │ │
│  │ daily needs  │  │ balanced     │  │ weekly       │ │
│  │              │  │ portions     │  │ activity     │ │
│  │              │  │              │  │              │ │
│  │ [Open Tool]  │  │ [Open Tool]  │  │ [Open Tool]  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   💧         │  │   ❤️         │  │   🧘         │ │
│  │ Hydration &  │  │ Heart Rate   │  │ Recovery     │ │
│  │ Sleep        │  │ Zones        │  │ Check-In     │ │
│  │ ...          │  │ ...          │  │ ...          │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Tool Panel Layout (Modal)

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Tools                                    ✕   │
│                                                          │
│  Daily Energy & Protein Needs                           │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  About You                                              │
│  ┌────────────┐  ┌────────────┐                        │
│  │ Age: [  ]  │  │ Sex: [▼]   │                        │
│  └────────────┘  └────────────┘                        │
│                                                          │
│  ┌────────────┐  ┌────────────┐                        │
│  │ Height: [] │  │ Weight: [] │                        │
│  └────────────┘  └────────────┘                        │
│                                                          │
│  Activity & Goals                                       │
│  ┌──────────────────────────┐                          │
│  │ Activity Level: [▼]      │                          │
│  └──────────────────────────┘                          │
│                                                          │
│  ┌──────────────────────────┐                          │
│  │ Goal: [▼]                │                          │
│  └──────────────────────────┘                          │
│                                                          │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  Your Daily Needs                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🔥 2,200 calories per day                      │   │
│  │  💪 120-150 grams of protein per day            │   │
│  │                                                  │   │
│  │  This is a starting point based on your info.   │   │
│  │  Listen to your body and adjust as needed.      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  [Calculate Again]  [Explore Programs →]                │
└─────────────────────────────────────────────────────────┘
```

### Mobile Responsive Design

- Cards stack vertically on mobile
- Tool panels become full-screen on mobile
- Inputs use native mobile controls (number pads, dropdowns)
- Touch-friendly button sizes (min 44x44px)
- Simplified layouts for small screens

## Error Handling

### Input Validation

```typescript
// Real-time validation as user types
// Show errors inline, near the input
// Use friendly, helpful error messages

Examples:
- "Age should be between 13 and 100"
- "Please enter your height in cm"
- "Weight must be a positive number"
```

### Calculation Errors

```typescript
// Handle edge cases gracefully
// Provide fallback values when appropriate
// Never show technical error messages

Examples:
- If BMR calculation fails, show: "We couldn't calculate that. Please check your inputs."
- If values are extreme, show: "These values seem unusual. Double-check your entries."
```

### User Experience

- Disable "Calculate" button until all required inputs are valid
- Show loading state during calculations (even if instant)
- Provide clear success feedback when results appear
- Allow easy reset/recalculation

## Testing Strategy

### Unit Tests

**File**: `lib/tools/__tests__/calculations.test.ts`

```typescript
describe('BMR Calculations', () => {
  test('calculates BMR correctly for male', () => {
    const bmr = calculateBMR(80, 180, 30, 'male');
    expect(bmr).toBeCloseTo(1850, 0);
  });

  test('calculates BMR correctly for female', () => {
    const bmr = calculateBMR(65, 165, 25, 'female');
    expect(bmr).toBeCloseTo(1450, 0);
  });
});

describe('Heart Rate Zones', () => {
  test('calculates zones for 30-year-old', () => {
    const zones = calculateHeartRateZones(30);
    expect(zones.maxHR).toBe(190);
    expect(zones.moderate.min).toBeGreaterThan(zones.easy.max);
  });
});

// Test all calculation functions
// Test edge cases and boundary values
// Test validation schemas
```

### Component Tests

**File**: `components/tools/__tests__/EnergyProteinCalculator.test.tsx`

```typescript
describe('EnergyProteinCalculator', () => {
  test('renders input form', () => {
    render(<EnergyProteinCalculator />);
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
  });

  test('shows validation errors for invalid inputs', async () => {
    render(<EnergyProteinCalculator />);
    const ageInput = screen.getByLabelText(/age/i);
    await userEvent.type(ageInput, '5');
    expect(screen.getByText(/age should be between/i)).toBeInTheDocument();
  });

  test('calculates and displays results', async () => {
    render(<EnergyProteinCalculator />);
    // Fill in all inputs
    // Click calculate
    // Verify results appear
  });
});

// Test each tool component
// Test user interactions
// Test error states
// Test accessibility
```

### Integration Tests

```typescript
describe('Health Tools Page', () => {
  test('displays all tool cards', () => {
    render(<ToolsPage />);
    expect(screen.getByText(/Energy & Protein/i)).toBeInTheDocument();
    expect(screen.getByText(/Plate Builder/i)).toBeInTheDocument();
    // ... all tools
  });

  test('opens tool panel when card is clicked', async () => {
    render(<ToolsPage />);
    const openButton = screen.getByRole('button', { name: /open.*energy/i });
    await userEvent.click(openButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('closes tool panel and returns to overview', async () => {
    // Test navigation flow
  });
});
```

### Accessibility Tests

```typescript
describe('Accessibility', () => {
  test('all tools are keyboard navigable', async () => {
    render(<ToolsPage />);
    // Tab through all interactive elements
    // Verify focus order
  });

  test('screen reader can access all content', () => {
    // Test ARIA labels
    // Test semantic HTML
    // Test alt text
  });

  test('meets WCAG 2.1 AA standards', () => {
    // Test color contrast
    // Test text sizing
    // Test focus indicators
  });
});
```

### Manual Testing Checklist

- [ ] All calculations produce accurate results
- [ ] Input validation works correctly
- [ ] Error messages are helpful and friendly
- [ ] Mobile experience is smooth
- [ ] Tools work on all major browsers
- [ ] Loading states appear appropriately
- [ ] Results are easy to understand
- [ ] Educational content is clear
- [ ] Design matches AFYA aesthetic
- [ ] Navigation is intuitive
- [ ] CTAs link to appropriate pages

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**
   - Lazy load individual tool components
   - Only load active tool's code
   - Reduce initial bundle size

2. **Calculation Performance**
   - All calculations are O(1) complexity
   - No heavy computations
   - Instant results

3. **Asset Optimization**
   - Use SVG for icons (scalable, small)
   - Optimize any images
   - Minimize CSS

4. **Caching**
   - Static page generation where possible
   - Cache tool configurations
   - No API calls needed

### Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 2.5s
- Lighthouse Score: > 90
- Bundle Size: < 100KB per tool

## Security Considerations

### Input Sanitization

```typescript
// Sanitize all user inputs
// Prevent XSS attacks
// Validate data types
// Limit input ranges

export function sanitizeNumericInput(value: string): number | null {
  const num = parseFloat(value);
  if (isNaN(num) || !isFinite(num)) return null;
  return num;
}
```

### Privacy

- No data is sent to server
- No data is stored
- No tracking of tool usage
- No personal information collected
- All calculations happen client-side

### Content Security

- Use Content Security Policy headers
- Sanitize any dynamic content
- Prevent injection attacks
- Use HTTPS for all resources

## Integration Points

### Navigation Integration

```typescript
// Add to main navigation
// File: components/layout/Navigation.tsx

const navItems = [
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Tools', href: '/tools' }, // NEW
  { label: 'Impact', href: '/impact' },
  { label: 'Shop', href: '/shop' },
  // ...
];
```

### Call-to-Action Integration

```typescript
// Link from tools to core services
// After showing results, suggest:

- "Ready for personalized coaching? Explore our Programs →"
- "Want a custom nutrition plan? Get Started →"
- "Learn more about our approach on the About page →"
```

### Footer Integration

```typescript
// Add tools to footer links
// File: components/layout/Footer.tsx

Resources:
- Health Tools (NEW)
- FAQ
- Blog
- Success Stories
```

## Future Enhancements

### Phase 2 Potential Features

1. **Save & Share Results**
   - Allow users to save calculations
   - Generate shareable links
   - Email results to self

2. **Progress Tracking**
   - Track tool usage over time
   - Show trends and changes
   - Require authentication

3. **Personalized Recommendations**
   - Based on tool results, suggest specific programs
   - Connect to intake form
   - Smart CTAs

4. **Additional Tools**
   - Macro calculator
   - Meal timing guide
   - Supplement guide
   - Injury risk assessment
   - Training load calculator

5. **Integration with Client Dashboard**
   - Pre-fill tools with client data
   - Save results to client profile
   - Track progress over time

6. **Educational Content Expansion**
   - Link to blog posts
   - Video explanations
   - Downloadable guides
   - FAQ integration

### Analytics & Insights

- Track which tools are most popular
- Identify drop-off points
- A/B test different educational messages
- Measure conversion to programs

## Deployment Considerations

### Rollout Strategy

1. **Phase 1**: Deploy 3 core tools (Energy/Protein, Movement, Recovery)
2. **Phase 2**: Add remaining tools based on user feedback
3. **Phase 3**: Enhance with additional features

### Monitoring

- Track page views and engagement
- Monitor calculation accuracy
- Watch for errors or edge cases
- Gather user feedback

### Maintenance

- Update formulas based on latest research
- Refresh educational content
- Add seasonal tips
- Keep design current

## Success Metrics

### Key Performance Indicators

1. **Engagement**
   - Tool usage rate (% of visitors who use at least one tool)
   - Average tools used per session
   - Time spent on tools page

2. **Conversion**
   - % of tool users who click "Get Started"
   - % who explore Programs page
   - % who sign up for services

3. **User Satisfaction**
   - Qualitative feedback
   - Return usage rate
   - Social sharing

4. **Technical Performance**
   - Page load time
   - Error rate
   - Browser compatibility

### Target Goals

- 30% of visitors use at least one tool
- 15% of tool users convert to leads
- < 1% error rate
- > 90 Lighthouse score
- 4.5+ user satisfaction rating

## Conclusion

The Health Tools feature provides accessible, educational health calculators that complement AFYA's core coaching services. By keeping tools simple, friendly, and focused on education rather than data overload, we create "aha moments" that inspire users to take the next step in their health journey.

The design prioritizes:
- Simplicity and clarity
- Non-judgmental, encouraging language
- Mobile-first responsive design
- Privacy and security
- Integration with existing AFYA brand and services

This feature positions AFYA as a trusted health education resource while creating natural pathways to the organization's core coaching programs.
