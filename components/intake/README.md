# Dynamic Intake Form Components

This directory contains the components for the dynamic multi-path intake system. The system provides an intelligent, branching intake form that adapts based on user responses and the selected client type.

## Components

### PathSelectionScreen

The initial screen where users select their intake path (e.g., Nutrition Only, Full Program, Athlete Performance, etc.).

**Props:**
- `onPathSelect: (path: ClientType) => void` - Callback when a path is selected
- `selectedPath?: ClientType` - Currently selected path (optional)

**Usage:**
```tsx
import { PathSelectionScreen } from '@/components/intake';

<PathSelectionScreen
  onPathSelect={(path) => console.log('Selected:', path)}
  selectedPath="FULL_PROGRAM"
/>
```

### QuestionRenderer

Renders individual questions with appropriate input types and validation.

**Supported Question Types:**
- `text` - Single-line text input
- `number` - Numeric input with optional unit display
- `select` - Dropdown selection
- `multiselect` - Multiple checkbox selections
- `radio` - Radio button group
- `checkbox` - Checkbox group (same as multiselect)
- `textarea` - Multi-line text input
- `date` - Date picker
- `range` - Slider input

**Props:**
- `question: Question` - Question configuration object
- `value: any` - Current value
- `onChange: (value: any) => void` - Value change handler
- `error?: string` - Validation error message

**Usage:**
```tsx
import { QuestionRenderer } from '@/components/intake';

<QuestionRenderer
  question={questionConfig}
  value={responses[questionId]}
  onChange={(value) => handleChange(questionId, value)}
  error={errors[questionId]}
/>
```

### ProgressTracker

Displays intake progress with a visual progress bar and section navigation.

**Props:**
- `currentBlockIndex: number` - Current question block index
- `totalBlocks: number` - Total number of blocks
- `sections?: ProgressSection[]` - Optional section information
- `onNavigate?: (blockIndex: number) => void` - Navigation callback

**Usage:**
```tsx
import { ProgressTracker } from '@/components/intake';

<ProgressTracker
  currentBlockIndex={2}
  totalBlocks={5}
  sections={progressSections}
  onNavigate={(index) => setCurrentBlock(index)}
/>
```

### DynamicIntakeForm

The main form component that orchestrates the entire intake experience.

**Features:**
- Dynamic question rendering based on intake path
- Intelligent branching logic
- Real-time validation
- Auto-save functionality
- Progress tracking
- Section navigation

**Props:**
- `intakePath: IntakePathConfig` - Intake path configuration
- `initialResponses?: IntakeResponses` - Pre-filled responses (for resume)
- `onSubmit: (responses: IntakeResponses) => Promise<void>` - Submit handler
- `onSave?: (responses: IntakeResponses) => Promise<void>` - Auto-save handler
- `autoSaveInterval?: number` - Auto-save interval in milliseconds (default: 30000)

**Usage:**
```tsx
import { DynamicIntakeForm } from '@/components/intake';
import { getPathByClientType } from '@/lib/intake/intake-paths';

const intakePath = getPathByClientType('FULL_PROGRAM');

<DynamicIntakeForm
  intakePath={intakePath}
  initialResponses={savedResponses}
  onSubmit={handleSubmit}
  onSave={handleAutoSave}
  autoSaveInterval={30000}
/>
```

## Branching Logic

The intake form uses a sophisticated branching logic system to show/hide questions based on user responses:

### Condition Types
- `equals` - Check if value equals a specific value
- `notEquals` - Check if value does not equal a value
- `contains` - Check if array contains a value
- `notContains` - Check if array does not contain a value
- `greaterThan` / `lessThan` - Numeric comparisons
- `isEmpty` / `isNotEmpty` - Check if field has a value
- `and` / `or` / `not` - Combine multiple conditions

### Action Types
- `show` - Display question blocks when condition is met
- `hide` / `skip` - Hide question blocks when condition is met
- `require` - Mark blocks as required when condition is met

### Example Branching Rule
```typescript
{
  id: 'show-athlete-metrics',
  condition: {
    type: 'or',
    conditions: [
      { type: 'equals', questionId: 'competition-level', value: 'college' },
      { type: 'equals', questionId: 'competition-level', value: 'professional' }
    ]
  },
  action: {
    type: 'show',
    targetBlockIds: ['performance-metrics']
  }
}
```

## Validation

Validation is handled automatically using the `QuestionValidator` class from `@/types/intake`.

### Validation Types
- `required` - Field must have a value
- `minLength` / `maxLength` - String length constraints
- `min` / `max` - Numeric constraints
- `pattern` - Regex pattern matching
- `email` - Email format validation
- `url` - URL format validation
- `custom` - Custom validation function

### Example Validation
```typescript
{
  id: 'email',
  type: 'text',
  label: 'Email Address',
  validation: [
    { type: 'required', message: 'Email is required' },
    { type: 'email', message: 'Please enter a valid email' }
  ]
}
```

## Auto-Save

The form automatically saves progress at regular intervals and on field blur events.

### API Endpoints

**Save Progress:**
```
POST /api/intake/progress
Body: {
  selectedPath: string,
  currentStep: number,
  totalSteps: number,
  responses: Record<string, any>,
  isComplete: boolean
}
```

**Load Progress:**
```
GET /api/intake/progress
Returns: {
  progress: {
    selectedPath: string,
    currentStep: number,
    totalSteps: number,
    responses: Record<string, any>,
    isComplete: boolean,
    lastSavedAt: Date
  }
}
```

### Using the Hook
```typescript
import { useIntakeProgress } from '@/lib/intake/useIntakeProgress';

const { saveProgress, loadProgress, isSaving, isLoading } = useIntakeProgress();

// Load saved progress
const progress = await loadProgress();

// Save progress
await saveProgress({
  selectedPath: 'FULL_PROGRAM',
  currentStep: 2,
  responses: { ... }
});
```

## Complete Example

See `app/(public)/intake/page.tsx` for a complete implementation example that includes:
- Path selection
- Progress loading
- Dynamic form rendering
- Auto-save
- Submission handling

## Data Flow

```
1. User selects path → PathSelectionScreen
2. Load saved progress → useIntakeProgress.loadProgress()
3. Render form → DynamicIntakeForm
4. User answers questions → QuestionRenderer
5. Evaluate branching logic → ConditionalLogicEvaluator
6. Auto-save progress → useIntakeProgress.saveProgress()
7. Validate responses → QuestionValidator
8. Submit intake → onSubmit callback
```

## Styling

All components use the Afya design system with Tailwind CSS:
- Primary color: `afya-primary`
- Secondary color: `afya-secondary`
- Light background: `afya-light`
- Accent color: `afya-accent`

Components are fully responsive and work on mobile, tablet, and desktop devices.

## Accessibility

All components follow accessibility best practices:
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Focus management
- Error announcements

## Testing

To test the intake form:

1. Navigate to `/get-started`
2. Select an intake path
3. Fill out the form
4. Test auto-save by refreshing the page
5. Test validation by submitting with empty required fields
6. Test branching logic by selecting different options

## Future Enhancements

- Multi-language support
- Voice input for questions
- Progress analytics
- Question skip/back navigation
- Mobile app integration
