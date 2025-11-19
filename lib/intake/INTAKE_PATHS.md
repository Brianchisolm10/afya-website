# Intake Path Configuration System

This document describes the intake path configuration system, which defines the dynamic question flows for different client types.

## Overview

The intake path system provides a flexible, branching questionnaire experience that adapts to each client's needs. Instead of showing all questions to everyone, the system intelligently displays only relevant question blocks based on the selected client type and user responses.

## Architecture

### Components

1. **Question Blocks** (`question-blocks.ts`)
   - Reusable collections of related questions
   - Organized by category (Demographics, Nutrition, Training, etc.)
   - Can be included in multiple intake paths

2. **Intake Paths** (`intake-paths.ts`)
   - Define which question blocks to show for each client type
   - Specify the order of question blocks
   - Include branching logic rules

3. **Branching Rules**
   - Conditional logic that shows/hides blocks based on responses
   - Supports complex conditions (and, or, not)
   - Evaluated dynamically as user progresses

4. **Conditional Logic Evaluator** (`types/intake.ts`)
   - Evaluates branching rules against user responses
   - Determines which blocks and questions to display
   - Handles nested conditions

## Client Types

The system supports seven distinct intake paths:

### 1. NUTRITION_ONLY
**Purpose:** Clients seeking only nutrition guidance

**Question Blocks:**
- Basic Demographics
- General Goals
- Diet Type
- Allergies & Restrictions
- Nutrition Habits
- Activity Level

**Branching Logic:**
- Skips all training-related blocks
- Focuses exclusively on dietary information

**Estimated Time:** 10-15 minutes

---

### 2. WORKOUT_ONLY
**Purpose:** Clients seeking only training programs

**Question Blocks:**
- Basic Demographics
- General Goals
- Training Goals
- Training Schedule
- Equipment Access
- Health History
- Activity Level
- Allergies & Restrictions (safety only)

**Branching Logic:**
- Skips detailed nutrition blocks (keeps allergies for safety)
- Skips athlete-specific and specialized blocks

**Estimated Time:** 10-15 minutes

---

### 3. FULL_PROGRAM
**Purpose:** Clients seeking comprehensive nutrition and training support

**Question Blocks:**
- Basic Demographics
- General Goals
- Training Goals
- Training Schedule
- Equipment Access
- Diet Type
- Allergies & Restrictions
- Nutrition Habits
- Health History
- Activity Level

**Branching Logic:**
- Includes both nutrition and training sections
- Skips specialized blocks (athlete, youth, wellness, injury)

**Estimated Time:** 20-25 minutes

---

### 4. ATHLETE_PERFORMANCE
**Purpose:** Competitive athletes seeking NSCA-CSCS aligned performance training

**Question Blocks:**
- Basic Demographics
- Athlete Profile (sport, position, competition level)
- General Goals
- Training Schedule
- Equipment Access
- Performance Metrics (conditional)
- Health History
- Activity Level
- Diet Type (optional)
- Allergies & Restrictions (optional)
- Nutrition Habits (optional)

**Branching Logic:**
- Shows performance metrics for high-level athletes (high school+)
- Makes nutrition blocks optional but available
- Uses athlete-specific profile instead of general training goals

**Estimated Time:** 15-20 minutes

---

### 5. YOUTH
**Purpose:** Young athletes (grades 6-12) with age-appropriate guidance

**Question Blocks:**
- Basic Demographics
- Youth Profile (grade, sports, parent info)
- General Goals
- Training Schedule
- Equipment Access
- Health History
- Allergies & Restrictions

**Branching Logic:**
- Skips adult-focused blocks
- Simplifies content for age-appropriate guidance
- Emphasizes safety and parent involvement
- Avoids advanced metrics and complex programming

**Estimated Time:** 10-12 minutes

---

### 6. GENERAL_WELLNESS
**Purpose:** General health improvement without athletic focus

**Question Blocks:**
- Basic Demographics
- Wellness Goals
- Activity Level
- Training Schedule (conditional)
- Equipment Access (conditional)
- Health History
- Diet Type (conditional)
- Allergies & Restrictions
- Nutrition Habits (conditional)

**Branching Logic:**
- Shows training blocks only if exercise is a wellness focus
- Shows nutrition blocks only if weight/energy is a focus
- Skips advanced performance metrics

**Estimated Time:** 8-10 minutes

---

### 7. SPECIAL_SITUATION
**Purpose:** Injury recovery or specific health conditions

**Question Blocks:**
- Basic Demographics
- Injury/Recovery Details
- General Goals
- Health History
- Activity Level
- Training Schedule (conditional)
- Equipment Access (conditional)
- Allergies & Restrictions

**Branching Logic:**
- Shows training blocks only if medically cleared
- Focuses on injury/condition details
- Conditionally shows nutrition based on recovery goals

**Estimated Time:** 12-15 minutes

---

## Branching Logic System

### Rule Structure

```typescript
interface ConditionalRule {
  id: string;
  condition: Condition;
  action: Action;
}
```

### Condition Types

- **equals**: Response equals a specific value
- **notEquals**: Response does not equal a value
- **contains**: Array response contains a value
- **notContains**: Array response does not contain a value
- **greaterThan/lessThan**: Numeric comparisons
- **isEmpty/isNotEmpty**: Check if field has a value
- **and/or/not**: Combine multiple conditions

### Action Types

- **show**: Display question blocks when condition is met
- **hide**: Hide question blocks when condition is met
- **skip**: Skip question blocks (similar to hide)
- **require**: Mark question blocks as required when condition is met

### Example Rules

```typescript
// Show performance metrics for high-level athletes
{
  id: 'athlete-show-metrics',
  condition: {
    type: 'or',
    conditions: [
      { type: 'equals', questionId: 'competition-level', value: 'high-school' },
      { type: 'equals', questionId: 'competition-level', value: 'college' },
      { type: 'equals', questionId: 'competition-level', value: 'professional' }
    ]
  },
  action: {
    type: 'show',
    targetBlockIds: ['performance-metrics']
  }
}

// Show training blocks only if medically cleared
{
  id: 'situation-show-training',
  condition: {
    type: 'equals',
    questionId: 'medical-clearance',
    value: 'yes'
  },
  action: {
    type: 'show',
    targetBlockIds: ['training-schedule', 'equipment-access']
  }
}
```

## Usage

### Getting an Intake Path

```typescript
import { getPathByClientType, getPathById } from '@/lib/intake/intake-paths';

// Get path by client type
const path = getPathByClientType('NUTRITION_ONLY');

// Get path by ID
const path = getPathById('nutrition-only');
```

### Evaluating Branching Logic

```typescript
import { ConditionalLogicEvaluator } from '@/types/intake';
import { getBlocksByIds } from '@/lib/intake/question-blocks';

// Get visible blocks based on responses
const visibleBlockIds = ConditionalLogicEvaluator.getVisibleBlocks(
  allBlocks,
  path.branchingRules,
  userResponses
);

// Get the actual block objects
const visibleBlocks = getBlocksByIds(visibleBlockIds);
```

### Validating Responses

```typescript
import { QuestionValidator } from '@/types/intake';

// Validate a single response
const result = QuestionValidator.validateResponse(question, value);

// Validate entire intake
const result = QuestionValidator.validateIntake(questions, responses);
```

## Database Schema

### IntakePath Model

```prisma
model IntakePath {
  id                String    @id @default(cuid())
  clientType        ClientType @unique
  name              String
  description       String
  questionBlocks    Json      // Array of question block IDs
  branchingRules    Json      // Conditional logic rules
  isActive          Boolean   @default(true)
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

## Seeding the Database

To populate the database with intake paths:

```bash
npx tsx prisma/seed-intake-paths.ts
```

This will create or update all seven intake paths in the database.

## Best Practices

### Creating New Paths

1. Define the client type in the Prisma schema
2. Create the path configuration in `intake-paths.ts`
3. Specify question blocks in logical order
4. Add branching rules for dynamic behavior
5. Test the path with various response scenarios
6. Update the seed script and run it

### Modifying Existing Paths

1. Update the path configuration in `intake-paths.ts`
2. Test branching logic thoroughly
3. Run the seed script to update the database
4. Consider backward compatibility with existing responses

### Adding Branching Rules

1. Identify the condition that triggers the rule
2. Determine which blocks should be affected
3. Choose the appropriate action type (show/hide/skip/require)
4. Test with various response combinations
5. Document the rule's purpose

### Question Block Organization

1. Keep blocks focused on a single topic
2. Make blocks reusable across multiple paths
3. Use conditional display at the question level for fine-grained control
4. Order blocks logically within each path
5. Consider the user experience and flow

## Testing

### Manual Testing Checklist

- [ ] Each path displays the correct question blocks
- [ ] Branching rules show/hide blocks as expected
- [ ] Required fields are enforced
- [ ] Validation works correctly
- [ ] Progress tracking updates properly
- [ ] Auto-save functionality works
- [ ] Intake can be completed and submitted
- [ ] Client profile is generated correctly

### Automated Testing

```typescript
// Example test
describe('Intake Path Configuration', () => {
  it('should show performance metrics for college athletes', () => {
    const responses = {
      'competition-level': 'college'
    };
    
    const visibleBlocks = ConditionalLogicEvaluator.getVisibleBlocks(
      allBlocks,
      athletePerformancePath.branchingRules,
      responses
    );
    
    expect(visibleBlocks).toContain('performance-metrics');
  });
});
```

## Troubleshooting

### Blocks Not Showing

1. Check if the block ID is in the path's `questionBlockIds`
2. Verify branching rules aren't hiding the block
3. Check if the block has a `conditionalDisplay` that's not met
4. Ensure the block is marked as `isActive: true`

### Branching Rules Not Working

1. Verify the condition questionId matches the actual question ID
2. Check that the response value matches the expected format
3. Test the condition logic in isolation
4. Check for conflicting rules

### Validation Errors

1. Ensure required fields are marked correctly
2. Check validation rules are properly defined
3. Verify the validation logic in `QuestionValidator`
4. Test edge cases (empty values, arrays, etc.)

## Future Enhancements

- [ ] Path versioning for tracking changes
- [ ] A/B testing different path configurations
- [ ] Analytics on completion rates per path
- [ ] Visual path builder UI for admins
- [ ] Path templates for common scenarios
- [ ] Multi-language support
- [ ] Conditional path recommendations
- [ ] Progress prediction based on responses

## Related Documentation

- [Question Blocks](./README.md) - Question block library documentation
- [Intake Types](../../types/intake.ts) - TypeScript type definitions
- [Design Document](../../.kiro/specs/dynamic-intake-and-packet-system/design.md) - System architecture
- [Requirements](../../.kiro/specs/dynamic-intake-and-packet-system/requirements.md) - Feature requirements
