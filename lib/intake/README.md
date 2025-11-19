# Question Block Library System

This directory contains the question block library for the dynamic intake system.

## Files

- **question-blocks.ts**: Contains all predefined question blocks organized by category
- **types** (in `/types/intake.ts`): TypeScript type definitions for questions, validation, and conditional logic

## Question Blocks

The system includes the following question blocks:

### Demographics
- `basic-demographics`: Basic personal information (name, email, DOB, gender, height, weight)

### Goals
- `general-goals`: Primary goals, target weight, timeline, motivation

### Nutrition
- `diet-type`: Current diet type and eating patterns
- `allergies-restrictions`: Food allergies and dietary restrictions
- `nutrition-habits`: Water intake, beverages, typical eating patterns

### Training
- `training-goals`: Training objectives and experience level
- `training-schedule`: Availability and preferred training times
- `equipment-access`: Available equipment and training location

### Health
- `health-history`: Injuries, medical conditions, medications, pain
- `activity-level`: Current activity level and daily movement patterns

### Performance (Athletes)
- `athlete-profile`: Sport, position, competition level, season phase
- `performance-metrics`: Strength benchmarks and performance data

### Youth
- `youth-profile`: Grade level, sports, parent information

### Wellness
- `wellness-goals`: Wellness focus areas and barriers

### Situation Based
- `injury-recovery`: Injury details, pain patterns, recovery goals

## Usage

### Import Question Blocks

```typescript
import { allQuestionBlocks, getBlockById, getBlocksByIds } from '@/lib/intake/question-blocks';

// Get all blocks
const blocks = allQuestionBlocks;

// Get specific block
const demographicsBlock = getBlockById('basic-demographics');

// Get multiple blocks
const nutritionBlocks = getBlocksByIds(['diet-type', 'allergies-restrictions']);
```

### Validation

```typescript
import { QuestionValidator } from '@/types/intake';

const result = QuestionValidator.validateResponse(question, value);
if (!result.isValid) {
  console.error(result.errors);
}
```

### Conditional Logic

```typescript
import { ConditionalLogicEvaluator } from '@/types/intake';

const visibleBlocks = ConditionalLogicEvaluator.getVisibleBlocks(
  allBlocks,
  branchingRules,
  responses
);

const visibleQuestions = ConditionalLogicEvaluator.getVisibleQuestions(
  questions,
  responses
);
```

## Seeding the Database

To populate the database with question blocks:

```bash
npx tsx prisma/seed-question-blocks.ts
```

Or add to package.json scripts:

```json
{
  "scripts": {
    "seed:questions": "tsx prisma/seed-question-blocks.ts"
  }
}
```

Then run:

```bash
npm run seed:questions
```

## Adding New Question Blocks

1. Create a new `QuestionBlock` object in `question-blocks.ts`
2. Add it to the `allQuestionBlocks` array
3. Run the seed script to update the database

Example:

```typescript
export const myNewBlock: QuestionBlock = {
  id: 'my-new-block',
  name: 'My New Block',
  title: 'Block Title',
  description: 'Block description',
  category: 'TRAINING',
  order: 25,
  isActive: true,
  questions: [
    {
      id: 'my-question',
      type: 'text',
      label: 'My Question',
      order: 1,
      isRequired: true,
      validation: [
        { type: 'required', message: 'This field is required' }
      ]
    }
  ]
};
```

## Question Types

- **text**: Single-line text input
- **textarea**: Multi-line text input
- **number**: Numeric input
- **select**: Dropdown selection (single choice)
- **multiselect**: Multiple selection dropdown
- **radio**: Radio buttons (single choice)
- **checkbox**: Checkboxes (multiple choice)
- **date**: Date picker
- **range**: Slider for numeric range

## Validation Rules

- **required**: Field must have a value
- **minLength**: Minimum string length
- **maxLength**: Maximum string length
- **min**: Minimum numeric value
- **max**: Maximum numeric value
- **pattern**: Regex pattern match
- **email**: Valid email format
- **url**: Valid URL format
- **custom**: Custom validation function

## Conditional Display

Questions and blocks can be conditionally displayed based on previous answers:

```typescript
conditionalDisplay: {
  type: 'equals',
  questionId: 'primary-goal',
  value: 'lose-weight'
}
```

Supported condition types:
- `equals`, `notEquals`
- `contains`, `notContains`
- `greaterThan`, `lessThan`, `greaterThanOrEqual`, `lessThanOrEqual`
- `isEmpty`, `isNotEmpty`
- `and`, `or`, `not` (for combining conditions)
