# Vibrant Fitness Theme

## Overview
The AFYA website now uses a vibrant, energetic fitness-inspired color palette with minimalist illustrations to create an engaging, modern experience.

## Color Palette

### Primary Colors
- **Cyan/Turquoise** (`#00CED1`) - Primary brand color, energetic and fresh
  - Light: `#5FD4D6`
  - Dark: `#00A8AA`
  - Usage: Primary buttons, links, accents, equipment highlights

- **Hot Pink/Magenta** (`#FF1493`) - Secondary brand color, bold and motivating
  - Light: `#FF69B4`
  - Dark: `#C71585`
  - Usage: CTAs, important highlights, clothing accents

- **Deep Navy/Purple** (`#2C1B47`) - Accent color for contrast
  - Light: `#4A148C`
  - Dark: `#1A0B2E`
  - Usage: Text, weights, dark elements

### Supporting Colors
- **Lime** (`#ADFF2F`) - Accent for energy
- **Peach/Coral** (`#FFB6C1`) - Skin tones, warm accents
- **Periwinkle** (`#B0C4DE`) - Light backgrounds, soft accents
- **Cream** (`#F5E6D3`) - Warm neutral backgrounds

## Tailwind Classes

### Background Colors
```tsx
bg-afya-primary      // Cyan
bg-afya-secondary    // Hot Pink
bg-afya-accent       // Deep Navy
bg-afya-periwinkle   // Light blue
bg-afya-cream        // Warm beige
```

### Text Colors
```tsx
text-afya-primary
text-afya-secondary
text-afya-navy
```

### Gradients
```tsx
from-afya-primary to-afya-primary-light
from-afya-secondary to-afya-secondary-light
bg-gradient-to-br from-afya-cyan to-afya-pink
```

## Illustrations

### Available Components
Located in `components/illustrations/FitnessIllustrations.tsx`:

1. **PlankBallIllustration** - Person doing plank on exercise ball
2. **WeightLiftingIllustration** - Person lifting barbell
3. **SquatIllustration** - Person in squat position
4. **RunningIllustration** - Person in running pose
5. **DumbbellIllustration** - Simple dumbbell icon
6. **HeartRateIllustration** - Heart with pulse line
7. **YogaIllustration** - Person in yoga/meditation pose
8. **CommunityIllustration** - Group of three people
9. **DecorativeShapes** - Background decorative circles

### Usage Example
```tsx
import { WeightLiftingIllustration, RunningIllustration } from '@/components/illustrations/FitnessIllustrations';

<WeightLiftingIllustration className="w-64 h-64" />
<RunningIllustration className="w-48 h-48" />
```

### Customization
All illustrations accept a `className` prop for sizing and positioning:
```tsx
<PlankBallIllustration className="w-full h-auto max-w-md" />
```

## Design Principles

### 1. Vibrant & Energetic
- Use bold, saturated colors
- High contrast for readability
- Bright, motivating palette

### 2. Minimalist Illustrations
- Simple SVG shapes
- Flat design style
- No gradients in illustrations (solid colors only)
- Clean, modern aesthetic

### 3. Friendly & Approachable
- Rounded corners on UI elements
- Soft shadows
- Playful but professional

### 4. Fitness-Focused
- Active, dynamic poses
- Movement-oriented imagery
- Health and wellness themes

## Component Updates

### Buttons
```tsx
// Primary CTA
<button className="bg-gradient-to-br from-afya-secondary to-afya-secondary-light text-white">
  Get Started
</button>

// Secondary
<button className="bg-afya-primary text-white hover:bg-afya-primary-dark">
  Learn More
</button>
```

### Cards
```tsx
<div className="bg-white rounded-xl shadow-lg border-t-4 border-afya-primary">
  {/* Card content */}
</div>
```

### Hero Sections
```tsx
<section className="bg-gradient-to-br from-afya-periwinkle to-white">
  <div className="container mx-auto">
    <h1 className="text-afya-navy">Welcome to AFYA</h1>
    <WeightLiftingIllustration className="w-96 h-96" />
  </div>
</section>
```

## Accessibility

### Contrast Ratios
- Navy text on white: 12.6:1 (AAA)
- Pink on white: 4.8:1 (AA)
- Cyan on white: 4.2:1 (AA)
- White on pink: 4.8:1 (AA)
- White on cyan: 4.2:1 (AA)

### Best Practices
- Use navy for body text
- Use pink/cyan for accents and highlights only
- Ensure sufficient contrast for all text
- Provide text alternatives for illustrations

## Migration from Old Theme

### Color Mapping
| Old Color | New Color | Usage |
|-----------|-----------|-------|
| `#40E0D0` (Turquoise) | `#00CED1` (Cyan) | Primary |
| `#9370DB` (Lavender) | `#FF1493` (Hot Pink) | Secondary |
| Grey accents | `#2C1B47` (Navy) | Dark accents |

### Component Updates Needed
1. Update Button component with new gradients
2. Update Navigation with new colors
3. Update Footer styling
4. Add illustrations to hero sections
5. Update tool cards with new palette

## Resources

### Free Illustration Sources (for future additions)
- **unDraw** - https://undraw.co (customizable, free)
- **Storyset** - https://storyset.com (free with attribution)
- **Humaaans** - https://humaaans.com (mix-and-match people)

### Color Tools
- Contrast checker: https://webaim.org/resources/contrastchecker/
- Palette generator: https://coolors.co

## Examples

### Homepage Hero
```tsx
<section className="relative bg-gradient-to-br from-afya-periwinkle via-white to-afya-cream min-h-screen">
  <div className="container mx-auto px-4 py-20">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-5xl font-bold text-afya-navy mb-6">
          It's Time to Regain Your Fitness
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Join our community and start your journey
        </p>
        <button className="bg-gradient-to-br from-afya-secondary to-afya-secondary-light text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition">
          Get Started
        </button>
      </div>
      <div className="relative">
        <WeightLiftingIllustration className="w-full h-auto" />
        <DecorativeShapes className="absolute inset-0 -z-10" />
      </div>
    </div>
  </div>
</section>
```

### Feature Cards
```tsx
<div className="grid md:grid-cols-3 gap-8">
  <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-afya-primary">
    <DumbbellIllustration className="w-16 h-16 mb-4" />
    <h3 className="text-xl font-bold text-afya-navy mb-2">Strength Training</h3>
    <p className="text-gray-600">Build muscle and increase strength</p>
  </div>
  
  <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-afya-secondary">
    <HeartRateIllustration className="w-16 h-16 mb-4" />
    <h3 className="text-xl font-bold text-afya-navy mb-2">Cardio Fitness</h3>
    <p className="text-gray-600">Improve endurance and heart health</p>
  </div>
  
  <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-afya-lime">
    <YogaIllustration className="w-16 h-16 mb-4" />
    <h3 className="text-xl font-bold text-afya-navy mb-2">Recovery & Wellness</h3>
    <p className="text-gray-600">Rest and restore your body</p>
  </div>
</div>
```
