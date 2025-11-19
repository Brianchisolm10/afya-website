# Quick Start: Packet Template System

## Setup

### 1. Seed Templates to Database

```bash
npx tsx prisma/seed-packet-templates.ts
```

This will populate your database with all 6 default templates.

## Basic Usage

### Generate a Packet

```typescript
import { PacketGenerationService } from '@/lib/intake';

// Generate and save a nutrition packet
const content = await PacketGenerationService.generateAndSavePacket(
  'client-id-here',
  'packet-id-here',
  'NUTRITION'
);
```

### Available Packet Types

- `NUTRITION` - Nutrition guidance packet
- `WORKOUT` - Workout program packet
- `PERFORMANCE` - Athlete performance packet
- `YOUTH` - Youth-specific packet
- `RECOVERY` - Recovery/modification packet
- `WELLNESS` - General wellness packet

## Template Placeholders

### Client Data

```typescript
{{client.fullName}}          // "John Doe"
{{client.email}}             // "john@example.com"
{{client.goal}}              // "lose weight"
{{client.activityLevel}}     // "moderately-active"
{{client.trainingExperience}} // "intermediate"
{{client.dietType}}          // "no restrictions"
{{client.foodAllergies}}     // "peanuts, shellfish"
```

### Calculated Values

```typescript
{{calculated.dailyCalories}}  // 2200
{{calculated.hydrationOz}}    // 100
{{calculated.trainingSplit}}  // "Upper/Lower Split"
```

### Calculated Arrays (for tables/lists)

```typescript
// Macros array
{{calculated.macros}}
// [
//   { name: "Protein", grams: 165, calories: 660, percentage: 30 },
//   { name: "Carbohydrates", grams: 220, calories: 880, percentage: 40 },
//   { name: "Fats", grams: 73, calories: 660, percentage: 30 }
// ]

// Meal timing array
{{calculated.mealTiming}}
// [
//   "Breakfast: 7:00-9:00 AM",
//   "Lunch: 12:00-2:00 PM",
//   "Dinner: 6:00-8:00 PM"
// ]
```

## Creating Custom Content

### Text Block

```typescript
{
  id: 'my-text-block',
  type: 'text',
  content: 'Hello {{client.fullName}}! Your goal is {{client.goal}}.',
  order: 1
}
```

### Table Block

```typescript
{
  id: 'macro-table',
  type: 'table',
  content: '',
  dataSource: 'calculated.macros',
  formatting: {
    headers: ['Nutrient', 'Grams', 'Calories', 'Percentage'],
    columns: ['name', 'grams', 'calories', 'percentage']
  },
  order: 2
}
```

### List Block

```typescript
{
  id: 'meal-times',
  type: 'list',
  content: '',
  dataSource: 'calculated.mealTiming',
  formatting: {
    listStyle: 'bullet' // or 'numbered'
  },
  order: 3
}
```

## Conditional Display

### Show section only for specific client type

```typescript
{
  id: 'athlete-section',
  title: 'Performance Metrics',
  conditionalDisplay: {
    type: 'equals',
    questionId: 'client.clientType',
    value: 'ATHLETE_PERFORMANCE'
  },
  contentBlockIds: ['metrics-block']
}
```

### Show block if value exists

```typescript
{
  id: 'injury-warning',
  type: 'text',
  content: '⚠️ Note: {{client.injuries}}',
  conditionalDisplay: {
    type: 'isNotEmpty',
    questionId: 'client.injuries'
  }
}
```

## Common Patterns

### Welcome Message

```typescript
{
  id: 'welcome',
  type: 'text',
  content: 'Welcome {{client.fullName}}! This {{packetType}} plan is designed for your goal of {{client.goal}}.',
  order: 1
}
```

### Goal-Based Recommendations

```typescript
{
  id: 'calorie-target',
  type: 'text',
  content: 'Based on your goal to {{client.goal}}, your daily calorie target is {{calculated.dailyCalories}} calories.',
  order: 2
}
```

### Safety Warnings

```typescript
{
  id: 'injury-note',
  type: 'text',
  content: '⚠️ IMPORTANT: You reported: {{client.injuries}}. This program takes your limitations into account.',
  conditionalDisplay: {
    type: 'isNotEmpty',
    questionId: 'client.injuries'
  }
}
```

## Testing Templates

### Test with Sample Data

```typescript
import { TemplateRenderer } from '@/lib/intake/template-engine';
import { nutritionPacketTemplate } from '@/lib/intake/packet-templates';

const mockContext = {
  client: {
    fullName: 'Test User',
    goal: 'lose weight',
    activityLevel: 'moderately-active'
  },
  calculated: {
    dailyCalories: 2000,
    macros: [
      { name: 'Protein', grams: 150, calories: 600, percentage: 30 }
    ]
  },
  responses: {}
};

const result = TemplateRenderer.renderTemplate(
  nutritionPacketTemplate,
  mockContext
);

console.log(result);
```

## Troubleshooting

### Placeholder not replacing

- Check spelling: `{{client.fullName}}` not `{{client.fullname}}`
- Verify data exists in client object
- Check for typos in path

### Table not rendering

- Ensure `dataSource` points to an array
- Verify `columns` match data object keys
- Check that data is not null/undefined

### Section not showing

- Check `conditionalDisplay` logic
- Verify condition references correct field
- Test condition with sample data

## Next Steps

- Read full documentation: `TEMPLATE_SYSTEM.md`
- Explore default templates: `packet-templates.ts`
- Customize templates for your needs
- Add new calculated values in `template-engine.ts`
