# Packet Template System

## Overview

The Packet Template System provides a flexible, data-driven approach to generating personalized nutrition and workout packets for clients. Templates use placeholders that are dynamically replaced with client data and calculated values.

## Architecture

### Components

1. **Template Definitions** (`packet-templates.ts`)
   - Default templates for all packet types
   - Structured as sections containing content blocks
   - Support for conditional display logic

2. **Template Engine** (`template-engine.ts`)
   - Placeholder replacement system
   - Template rendering logic
   - Calculated values generation

3. **Packet Generation Service** (`packet-generation-service.ts`)
   - Orchestrates packet generation
   - Fetches client data
   - Builds template context
   - Saves generated content

## Template Structure

### PacketTemplate

```typescript
{
  id: string;
  name: string;
  packetType: 'NUTRITION' | 'WORKOUT' | 'PERFORMANCE' | 'YOUTH' | 'RECOVERY' | 'WELLNESS';
  clientType?: string; // Optional: specific client type
  sections: PacketSection[];
  contentBlocks: ContentBlock[];
  isDefault: boolean;
}
```

### PacketSection

```typescript
{
  id: string;
  title: string;
  description?: string;
  order: number;
  contentBlockIds: string[];
  conditionalDisplay?: Condition; // Show/hide based on client data
}
```

### ContentBlock

```typescript
{
  id: string;
  type: 'text' | 'table' | 'list' | 'chart' | 'image' | 'heading' | 'divider';
  content: string; // Can include {{placeholders}}
  dataSource?: string; // Path to client data
  formatting?: FormattingOptions;
  conditionalDisplay?: Condition;
  order: number;
}
```

## Placeholder System

### Syntax

Placeholders use double curly braces: `{{path.to.value}}`

### Available Data Paths

#### Client Data
- `{{client.fullName}}` - Client's full name
- `{{client.email}}` - Client's email
- `{{client.goal}}` - Primary goal
- `{{client.activityLevel}}` - Activity level
- `{{client.trainingExperience}}` - Training experience
- `{{client.dietType}}` - Dietary preferences
- `{{client.foodAllergies}}` - Food allergies
- And many more...

#### Calculated Values
- `{{calculated.dailyCalories}}` - Calculated calorie target
- `{{calculated.macros}}` - Macronutrient breakdown (array)
- `{{calculated.mealTiming}}` - Meal timing recommendations (array)
- `{{calculated.hydrationOz}}` - Daily hydration target
- `{{calculated.trainingSplit}}` - Recommended training split
- `{{calculated.volumeRecommendations}}` - Training volume guidance

#### Intake Responses
- `{{responses.questionId}}` - Any question response by ID

### Examples

```typescript
// Simple text replacement
"Welcome {{client.fullName}}! Your goal is {{client.goal}}."
// Output: "Welcome John Doe! Your goal is lose weight."

// Calculated values
"Your daily calorie target is {{calculated.dailyCalories}} calories."
// Output: "Your daily calorie target is 2200 calories."

// Data source for tables
{
  type: 'table',
  dataSource: 'calculated.macros',
  formatting: {
    headers: ['Nutrient', 'Grams', 'Calories'],
    columns: ['name', 'grams', 'calories']
  }
}
```

## Conditional Display

Sections and content blocks can be conditionally displayed based on client data:

```typescript
{
  conditionalDisplay: {
    type: 'equals',
    questionId: 'client.clientType',
    value: 'ATHLETE_PERFORMANCE'
  }
}
```

### Condition Types
- `equals` - Value equals specified value
- `notEquals` - Value does not equal
- `contains` - Array/string contains value
- `greaterThan` / `lessThan` - Numeric comparisons
- `and` / `or` / `not` - Logical operators
- `isEmpty` / `isNotEmpty` - Check for empty values

## Calculated Values

The system automatically calculates various values based on client data:

### Nutrition Calculations
- **Daily Calories**: Based on BMR, activity level, and goals
- **Macros**: Protein, carbs, fats optimized for goals
- **Meal Timing**: Recommendations based on training schedule
- **Hydration**: Based on body weight and activity

### Workout Calculations
- **Training Split**: Based on frequency and experience
- **Volume Recommendations**: Sets, reps, exercises per session
- **Session Duration**: Optimal training time

## Usage

### Generate a Packet

```typescript
import { PacketGenerationService } from '@/lib/intake';

// Generate packet content
const content = await PacketGenerationService.generatePacket(
  clientId,
  'NUTRITION'
);

// Generate and save in one operation
const content = await PacketGenerationService.generateAndSavePacket(
  clientId,
  packetId,
  'NUTRITION'
);
```

### Access Templates

```typescript
import { getTemplateByPacketType, getAllTemplates } from '@/lib/intake';

// Get default template for a packet type
const template = getTemplateByPacketType('NUTRITION');

// Get all templates
const allTemplates = getAllTemplates();
```

### Seed Templates to Database

```bash
npx tsx prisma/seed-packet-templates.ts
```

## Default Templates

### 1. Nutrition Packet
- Overview with goals and calorie targets
- Macronutrient breakdown
- Meal timing recommendations
- Sample meal plans
- Shopping lists
- Practical tips

### 2. Workout Packet
- Program overview and training split
- Weekly schedule
- Exercise library with instructions
- Progression strategy
- Safety and recovery guidance

### 3. Performance Packet (Athletes)
- NSCA-CSCS aligned programming
- Periodization plan
- Power development protocols
- Strength training
- Sport-specific conditioning
- Recovery strategies

### 4. Youth Packet
- Age-appropriate language
- Safety-first approach
- Fundamental movement patterns
- Progressive development
- Parent/guardian guidance

### 5. Recovery Packet
- Condition-specific modifications
- Safe movement patterns
- Exercises to avoid
- Progressive return protocol
- Pain management strategies

### 6. Wellness Packet
- Holistic health approach
- Daily movement goals
- Simple nutrition principles
- Sleep and stress management
- Sustainable habit building

## Customization

### Creating Custom Templates

1. Define template structure in code or database
2. Use existing content blocks or create new ones
3. Add conditional logic as needed
4. Test with sample client data

### Modifying Existing Templates

Templates can be modified in two ways:

1. **Code**: Edit `lib/intake/packet-templates.ts`
2. **Database**: Update via admin interface (future feature)

### Adding New Placeholders

1. Add calculated value in `CalculatedValuesGenerator`
2. Add client data field in `prepareClientData`
3. Use in templates with `{{calculated.newValue}}` or `{{client.newField}}`

## Best Practices

1. **Keep content blocks focused**: Each block should have a single purpose
2. **Use descriptive IDs**: Make template structure self-documenting
3. **Test with edge cases**: Ensure templates handle missing data gracefully
4. **Provide defaults**: Use fallback values for optional fields
5. **Consider mobile**: Keep content scannable and well-formatted
6. **Maintain consistency**: Use similar structure across packet types
7. **Document custom logic**: Add comments for complex calculations

## Future Enhancements

- Visual template editor in admin interface
- A/B testing for template variations
- Multi-language support
- Rich media content (images, videos)
- Interactive elements (calculators, trackers)
- PDF export with custom styling
- Email delivery with formatting
