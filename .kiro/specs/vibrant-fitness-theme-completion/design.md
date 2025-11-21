# Design Document

## Overview

This design outlines the implementation of an enhanced fitness illustration system for the AFYA website, focusing on diverse people representation, expanded illustration library, and seamless integration across all public pages. The design maintains the vibrant cyan and hot pink color palette while introducing more detailed and inclusive character designs.

## Architecture

### Component Structure

```
components/
├── illustrations/
│   ├── FitnessIllustrations.tsx          # Main illustration library (enhanced)
│   ├── PeopleComponents.tsx              # Reusable people figure components
│   └── IllustrationShowcase.tsx          # Development/testing showcase
├── ui/
│   └── IllustrationWrapper.tsx           # Responsive wrapper component
```

### Design Principles

1. **Diversity First**: Every illustration featuring people should show variety in body types, skin tones, and presentation
2. **Minimalist Aesthetic**: Maintain flat design with solid colors, no gradients in figures
3. **Modular Construction**: Build people from reusable components (heads, bodies, limbs) for consistency
4. **Color Consistency**: Use the established theme colors (cyan, hot pink, navy, lime, peach)
5. **Scalability**: All illustrations must work at multiple sizes (sm: 64px, md: 96px, lg: 128px, xl: 192px)

## Components and Interfaces

### 1. Enhanced People Component System

#### Skin Tone Palette
```typescript
const SKIN_TONES = {
  light: '#FFE0BD',      // Light peach
  lightMedium: '#F1C27D', // Tan
  medium: '#C68642',      // Medium brown
  mediumDark: '#8D5524',  // Dark tan
  dark: '#5C4033',        // Deep brown
} as const;
```

#### Body Type Variations
```typescript
interface BodyTypeProps {
  type: 'athletic' | 'average' | 'plus-size' | 'slim';
  height: 'short' | 'average' | 'tall';
}
```

#### Reusable Person Component
```typescript
interface PersonProps {
  skinTone: keyof typeof SKIN_TONES;
  bodyType: BodyTypeProps['type'];
  height: BodyTypeProps['height'];
  hairStyle: 'short' | 'medium' | 'long' | 'curly' | 'bald' | 'ponytail';
  hairColor: string;
  clothingColor: string;
  pose: 'standing' | 'sitting' | 'active' | 'stretching';
  className?: string;
}
```

### 2. Expanded Illustration Library

#### New Illustrations to Create

**Strength Training (5 illustrations)**
1. `DeadliftIllustration` - Person performing deadlift with proper form
2. `PushUpIllustration` - Person in push-up position
3. `LungeIllustration` - Person performing forward lunge
4. `PlankVariationIllustration` - Person in side plank
5. `KettlebellSwingIllustration` - Person swinging kettlebell

**Cardio Activities (3 illustrations)**
1. `CyclingIllustration` - Person on stationary bike
2. `JumpRopeIllustration` - Person jumping rope
3. `DanceFitnessIllustration` - Person in dance pose

**Yoga & Flexibility (3 illustrations)**
1. `WarriorPoseIllustration` - Person in warrior yoga pose
2. `ChildPoseIllustration` - Person in child's pose
3. `TreePoseIllustration` - Person in tree balance pose

**Recovery & Wellness (2 illustrations)**
1. `FoamRollingIllustration` - Person using foam roller
2. `HydrationIllustration` - Person drinking water

**Group & Community (2 illustrations)**
1. `GroupClassIllustration` - 4-5 diverse people in fitness class
2. `PartnerWorkoutIllustration` - Two people working out together

**Motivational (2 illustrations)**
1. `CelebrationIllustration` - Person in victory pose
2. `GoalSettingIllustration` - Person with checklist/goals

### 3. Page Integration Design

#### Homepage Hero Section
```tsx
<section className="bg-gradient-to-br from-afya-periwinkle via-white to-afya-cream">
  <div className="grid md:grid-cols-2 gap-12 items-center">
    <div>
      <h1>It's Time to Regain Your Fitness</h1>
      <p>Join our community...</p>
      <Button>Get Started</Button>
    </div>
    <div className="relative">
      {/* Main illustration */}
      <GroupClassIllustration className="w-full h-auto max-w-lg" />
      {/* Decorative background */}
      <DecorativeShapes className="absolute inset-0 -z-10" />
    </div>
  </div>
</section>
```

#### Program Cards Mapping
- **Intro Program**: `CelebrationIllustration` (welcoming, beginner-friendly)
- **Nutrition Program**: `PlateBuilderIllustration` (existing, enhanced with person)
- **Training Program**: `WeightLiftingIllustration` (existing, enhanced diversity)

#### Tools Page Mapping
```typescript
const TOOL_ILLUSTRATIONS = {
  'energy-protein-calculator': 'PlateBuilderIllustration',
  'plate-builder': 'HydrationIllustration',
  'heart-rate-zones': 'RunningIllustration',
  'hydration-sleep': 'FoamRollingIllustration',
  'recovery-checkin': 'ChildPoseIllustration',
  'youth-corner': 'JumpRopeIllustration',
} as const;
```

#### About Page Sections
- **Mission Section**: `CommunityIllustration` (enhanced with 5+ diverse people)
- **Values Section**: `PartnerWorkoutIllustration` (collaboration)
- **Impact Section**: `GroupClassIllustration` (community engagement)

## Data Models

### Illustration Metadata
```typescript
interface IllustrationMetadata {
  name: string;
  description: string;
  category: 'strength' | 'cardio' | 'yoga' | 'recovery' | 'community' | 'motivational';
  peopleCount: number;
  diversityFeatures: {
    skinTones: number;
    bodyTypes: number;
    genderRepresentation: 'mixed' | 'single' | 'neutral';
  };
  recommendedUse: string[];
  ariaLabel: string;
}
```

### Illustration Registry
```typescript
// For documentation and showcase
export const ILLUSTRATION_REGISTRY: Record<string, IllustrationMetadata> = {
  WeightLiftingIllustration: {
    name: 'Weight Lifting',
    description: 'Person performing barbell lift with proper form',
    category: 'strength',
    peopleCount: 1,
    diversityFeatures: {
      skinTones: 1,
      bodyTypes: 1,
      genderRepresentation: 'neutral',
    },
    recommendedUse: ['Training programs', 'Strength tools', 'Hero sections'],
    ariaLabel: 'Illustration of person lifting weights',
  },
  // ... more entries
};
```

## Error Handling

### Fallback Strategy
1. **Missing Illustration**: Display placeholder with icon and text
2. **Load Failure**: Gracefully degrade to text-only display
3. **Accessibility**: Always provide text alternative

```typescript
const IllustrationWithFallback: React.FC<{
  illustration: React.ComponentType;
  fallbackText: string;
  ariaLabel: string;
}> = ({ illustration: Illustration, fallbackText, ariaLabel }) => {
  return (
    <div role="img" aria-label={ariaLabel}>
      <Illustration />
      <span className="sr-only">{fallbackText}</span>
    </div>
  );
};
```

## Testing Strategy

### Visual Regression Testing
1. **Snapshot Tests**: Capture SVG output for each illustration
2. **Size Variants**: Test all size props (sm, md, lg, xl)
3. **Diversity Check**: Verify skin tone and body type variations render correctly

### Accessibility Testing
1. **ARIA Labels**: Verify all illustrations have descriptive labels
2. **Contrast Ratios**: Test color combinations meet WCAG AA standards
3. **Screen Reader**: Test with NVDA/JAWS for proper announcements

### Performance Testing
1. **Bundle Size**: Measure impact on bundle size (target: < 50KB total)
2. **Render Performance**: Test rendering time for pages with multiple illustrations
3. **Mobile Performance**: Test on low-end devices

### Integration Testing
```typescript
describe('Homepage Illustrations', () => {
  it('should display hero illustration', () => {
    render(<HomePage />);
    expect(screen.getByRole('img', { name: /group fitness class/i })).toBeInTheDocument();
  });

  it('should display program card illustrations', () => {
    render(<HomePage />);
    expect(screen.getAllByRole('img')).toHaveLength(expectedCount);
  });

  it('should be responsive', () => {
    // Test at different viewport sizes
  });
});
```

## Implementation Phases

### Phase 1: Enhanced People Components (Foundation)
- Create reusable person component system
- Implement skin tone and body type variations
- Build modular body parts (heads, torsos, limbs)
- Test diversity rendering

### Phase 2: Expand Illustration Library
- Create 15+ new illustrations using person components
- Enhance existing illustrations with diversity
- Add proper ARIA labels and accessibility features
- Document each illustration in registry

### Phase 3: Homepage Integration
- Replace hero section generic icons with custom illustrations
- Update program cards with relevant illustrations
- Add community illustrations to impact section
- Test responsive behavior

### Phase 4: Tools & Programs Pages
- Map illustrations to each tool
- Update program cards with unique illustrations
- Ensure consistent sizing and positioning
- Test user experience

### Phase 5: About & Supporting Pages
- Add community illustrations to About page
- Update Contact page with relevant illustrations
- Add illustrations to Services page
- Ensure brand consistency

### Phase 6: Documentation & Showcase
- Create illustration showcase component
- Write comprehensive usage documentation
- Add design guidelines for future illustrations
- Create contribution guide

## Design Decisions & Rationales

### Why Modular Person Components?
**Decision**: Build people from reusable components rather than creating each illustration from scratch.

**Rationale**: 
- Ensures visual consistency across all illustrations
- Makes it easy to create diverse representations
- Reduces code duplication
- Simplifies maintenance and updates

### Why Inline SVG Instead of Image Files?
**Decision**: Use inline SVG components rather than external SVG files.

**Rationale**:
- Eliminates HTTP requests for better performance
- Allows dynamic styling with CSS/Tailwind
- Enables easy color customization
- Better for accessibility (direct ARIA label support)

### Why Limit to 5 Skin Tones?
**Decision**: Use 5 distinct skin tone colors rather than a full spectrum.

**Rationale**:
- Provides meaningful diversity without overwhelming complexity
- Ensures each tone has sufficient contrast with backgrounds
- Maintains visual consistency across illustrations
- Simplifies implementation and testing

### Why Separate Illustration Categories?
**Decision**: Organize illustrations by activity type (strength, cardio, yoga, etc.).

**Rationale**:
- Makes it easier for developers to find appropriate illustrations
- Helps ensure coverage across all program types
- Facilitates documentation and showcase organization
- Aligns with AFYA's program structure

## Accessibility Considerations

### Color Contrast
- All skin tones tested against white, cream, and periwinkle backgrounds
- Clothing colors chosen to provide sufficient contrast
- Navy used for hair/details to ensure visibility

### Screen Reader Support
```typescript
// Example implementation
<svg role="img" aria-label="Person performing yoga warrior pose">
  <title>Yoga Warrior Pose</title>
  <desc>Illustration showing a person in a yoga warrior pose with arms extended</desc>
  {/* SVG content */}
</svg>
```

### Keyboard Navigation
- Illustrations are decorative and don't require keyboard interaction
- When used as links/buttons, ensure proper focus states on parent element

### Motion Sensitivity
- Avoid animations on illustrations by default
- Respect `prefers-reduced-motion` media query
- Keep any hover effects subtle

## Performance Optimization

### SVG Optimization
```bash
# Use SVGO to optimize SVG code
svgo --multipass --pretty input.svg output.svg
```

### Code Splitting
```typescript
// Lazy load illustration showcase (not critical for initial render)
const IllustrationShowcase = dynamic(
  () => import('@/components/illustrations/IllustrationShowcase'),
  { ssr: false }
);
```

### Caching Strategy
- Illustrations are part of the bundle (no separate caching needed)
- Component code cached via Next.js build process
- No runtime fetching required

## Mobile Considerations

### Responsive Sizing
```typescript
// Responsive illustration wrapper
const ResponsiveIllustration: React.FC<{
  illustration: React.ComponentType<{ className?: string }>;
}> = ({ illustration: Illustration }) => {
  return (
    <Illustration 
      className="
        w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64
      " 
    />
  );
};
```

### Touch Targets
- Ensure illustrations used as buttons/links have minimum 44x44px touch target
- Add padding around interactive illustrations

### Performance on Low-End Devices
- Keep SVG complexity reasonable (< 100 elements per illustration)
- Avoid excessive use of filters or effects
- Test on devices with limited GPU capabilities

## Future Enhancements

### Potential Additions
1. **Animation System**: Subtle animations for hover states
2. **Customization API**: Allow dynamic color changes via props
3. **Illustration Builder**: Admin interface to create custom illustrations
4. **Seasonal Variations**: Holiday or seasonal themed illustrations
5. **Accessibility Modes**: High contrast versions for low vision users

### Scalability Considerations
- Design system supports adding new illustrations without breaking existing ones
- Modular approach allows for easy updates and variations
- Documentation ensures consistency as team grows

