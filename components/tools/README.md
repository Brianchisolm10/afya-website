# Health Tools Feature

## Overview

The Health Tools feature provides a collection of simple, educational health calculators and assessments designed to make health education accessible to everyone. These tools serve as supportive resources that complement AFYA's core coaching services.

## Available Tools

### 1. Daily Energy & Protein Needs Calculator

**Purpose**: Helps users estimate their daily calorie and protein requirements based on their individual characteristics and goals.

**How to Use**:
1. Enter your age, sex, height, and weight
2. Select your activity level (sedentary to very active)
3. Choose your goal (lose weight, maintain, or gain weight)
4. Click "Calculate" to see your personalized estimates

**What You'll Learn**:
- Estimated daily calorie needs
- Recommended protein range in grams per day
- Understanding that these are starting points, not rigid rules

**Calculation Methods**:
- **BMR (Basal Metabolic Rate)**: Uses the Mifflin-St Jeor equation
  - Male: (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
  - Female: (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161
- **TDEE (Total Daily Energy Expenditure)**: BMR × activity multiplier
- **Goal Adjustment**: ±500 calories for weight loss/gain
- **Protein**: 0.8-2.0g per kg body weight based on activity and goals

**Sources**:
- Mifflin MD, St Jeor ST, et al. "A new predictive equation for resting energy expenditure in healthy individuals." Am J Clin Nutr. 1990.
- International Society of Sports Nutrition position stand: protein and exercise. J Int Soc Sports Nutr. 2017.

---

### 2. Plate Builder

**Purpose**: Visualizes healthy plate proportions for different goals and meal types.

**How to Use**:
1. Select your goal (energy, performance, or recovery)
2. Choose your meal type (breakfast, lunch, or dinner)
3. View the visual plate representation and example meals

**What You'll Learn**:
- Approximate percentages of vegetables, protein, carbs, and healthy fats
- How plate composition changes based on goals
- Practical meal examples you can try

**Plate Proportions**:
- **Energy Focus**: Balanced approach with emphasis on whole foods
- **Performance Focus**: Higher carbohydrates for fuel
- **Recovery Focus**: Emphasis on protein and anti-inflammatory foods

**Sources**:
- USDA MyPlate guidelines
- Sports nutrition best practices from ISSN and ACSM

---

### 3. Hydration & Sleep Snapshot

**Purpose**: Helps users assess whether their sleep and hydration habits fall within healthy ranges.

**How to Use**:
1. Enter your average nightly sleep hours
2. Enter your daily water intake (cups or bottles)
3. View your status and get personalized tips

**What You'll Learn**:
- Whether your sleep is below, within, or above recommended ranges
- Whether your hydration is adequate
- Simple, actionable tips for improvement

**Recommended Ranges**:
- **Sleep**: 7-9 hours for adults, 8-10 hours for teens
- **Hydration**: 8-10 cups (64-80 oz) for adults, adjusted for activity

**Sources**:
- National Sleep Foundation sleep duration recommendations
- Institute of Medicine dietary reference intakes for water

---

### 4. Heart Rate Zone Finder

**Purpose**: Calculates personalized heart rate training zones for different exercise intensities.

**How to Use**:
1. Enter your age (required)
2. Optionally enter your resting heart rate for more accuracy
3. View your easy, moderate, and vigorous heart rate zones

**What You'll Learn**:
- Your maximum heart rate estimate
- Three training zones with specific BPM ranges
- That most weekly movement can happen in easy-moderate zones

**Calculation Methods**:
- **Simple Method**: Max HR = 220 - age
- **Karvonen Method** (if resting HR provided): 
  - HRR (Heart Rate Reserve) = Max HR - Resting HR
  - Target HR = (HRR × intensity %) + Resting HR
- **Zones**:
  - Easy: 50-60% of max HR or HRR
  - Moderate: 60-70% of max HR or HRR
  - Vigorous: 70-85% of max HR or HRR

**Sources**:
- American Heart Association exercise intensity guidelines
- Karvonen MJ, et al. "The effects of training on heart rate." Ann Med Exp Biol Fenn. 1957.

---

### 5. Stress & Recovery Check-In

**Purpose**: Provides a quick assessment of current recovery state to inform training decisions.

**How to Use**:
1. Rate your energy level (1-5 scale)
2. Rate your muscle soreness (1-5 scale)
3. Rate your stress level (1-5 scale)
4. Rate your mood (1-5 scale)
5. View your recovery assessment and guidance

**What You'll Learn**:
- Your overall recovery status
- Whether today is a recovery day, half-speed day, or green light day
- Supportive guidance for approaching training or self-care

**Assessment Logic**:
- Average score < 2.5: Recovery Day (rest or very light activity)
- Average score 2.5-3.5: Half-Speed Day (moderate activity)
- Average score > 3.5: Green Light Day (full training)

**Sources**:
- Recovery monitoring best practices from sports science literature
- Athlete wellness questionnaire methodologies

---

### 6. Youth Corner

**Purpose**: Helps families reflect on screen time versus active play time in a non-judgmental way.

**How to Use**:
1. Enter daily screen time hours
2. Enter daily play/movement time hours
3. View a gentle comparison and get practical ideas

**What You'll Learn**:
- The balance between screen time and active time
- Practical, achievable ideas for increasing movement
- Encouraging perspective on family wellness

**Recommendations**:
- WHO recommends limiting sedentary screen time for children
- At least 60 minutes of moderate-to-vigorous physical activity daily for youth

**Sources**:
- WHO guidelines on physical activity and sedentary behavior
- American Academy of Pediatrics screen time recommendations

---

## Technical Architecture

### File Structure

```
components/tools/
├── README.md (this file)
├── EnergyProteinCalculator.tsx
├── PlateBuilder.tsx
├── PlateVisual.tsx
├── HydrationSleepSnapshot.tsx
├── HeartRateZones.tsx
├── RecoveryCheckIn.tsx
├── YouthCorner.tsx
├── ToolCard.tsx
├── ToolPanel.tsx
└── __tests__/
    ├── EnergyProteinCalculator.test.ts
    ├── PlateBuilder.test.ts
    ├── HydrationSleepSnapshot.test.ts
    ├── HeartRateZones.test.ts
    ├── RecoveryCheckIn.test.ts
    └── YouthCorner.test.ts

lib/tools/
├── calculations.ts (core calculation functions)
├── constants.ts (activity multipliers, ranges, etc.)
├── validation.ts (Zod schemas for input validation)
├── types.ts (TypeScript interfaces)
├── tool-config.ts (tool metadata)
├── plate-data.ts (plate proportions and meal examples)
└── __tests__/
    ├── bmr-tdee.test.ts
    ├── heart-rate-zones.test.ts
    ├── hydration-sleep.test.ts
    ├── unit-conversions.test.ts
    └── validation.test.ts

app/(public)/tools/
└── page.tsx (main tools page)
```

### Key Design Principles

1. **Client-Side Only**: All calculations happen in the browser. No data is sent to servers or stored.
2. **Privacy First**: No tracking, no data collection, no authentication required.
3. **Educational Focus**: Results include brief, friendly explanations.
4. **Mobile Responsive**: Fully functional on screens as small as 320px.
5. **Accessible**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support.

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

---

## For Developers

### Adding a New Tool

1. **Create the component** in `components/tools/YourTool.tsx`
2. **Add calculation logic** to `lib/tools/calculations.ts` if needed
3. **Define validation schema** in `lib/tools/validation.ts`
4. **Add tool config** to `lib/tools/tool-config.ts`
5. **Write tests** in `components/tools/__tests__/YourTool.test.ts`
6. **Update this README** with tool documentation

### Running Tests

```bash
# Run all tool tests
npm run test -- components/tools lib/tools

# Run specific tool test
npm run test -- components/tools/__tests__/EnergyProteinCalculator.test.ts

# Run with coverage
npm run test -- --coverage components/tools lib/tools
```

### Code Style Guidelines

- Use TypeScript for type safety
- Validate all user inputs with Zod schemas
- Keep calculations in separate utility functions
- Write friendly, encouraging error messages
- Include educational content with results
- Ensure all interactive elements are keyboard accessible
- Test on multiple screen sizes

### Common Patterns

**Input Validation**:
```typescript
const result = energyProteinSchema.safeParse(formData);
if (!result.success) {
  // Show friendly error messages
  return;
}
```

**Calculation with Error Handling**:
```typescript
try {
  const bmr = calculateBMR(weight, height, age, sex);
  const tdee = calculateTDEE(bmr, activityLevel);
  // ... use results
} catch (error) {
  // Show user-friendly error message
}
```

**Results Display**:
```typescript
<div className="results-card">
  <h3>Your Results</h3>
  <p className="result-value">{calories} calories per day</p>
  <p className="explanation">
    This is a starting point based on your info. 
    Listen to your body and adjust as needed.
  </p>
</div>
```

---

## For Content Editors

### Updating Educational Content

Educational messages are embedded in the component files. To update:

1. Open the relevant component file (e.g., `EnergyProteinCalculator.tsx`)
2. Find the results display section
3. Update the explanation text
4. Keep messages to 1-2 sentences
5. Use encouraging, non-judgmental language
6. Test that the updated text displays correctly

### Updating Calculation Parameters

Constants like activity multipliers and recommended ranges are in `lib/tools/constants.ts`. Update these values if recommendations change based on new research.

---

## Accessibility Features

- All form inputs have proper labels and ARIA attributes
- Keyboard navigation works throughout
- Color contrast meets WCAG 2.1 AA standards (4.5:1 minimum)
- Screen readers can access all content
- Focus indicators are visible
- Error messages are announced to screen readers
- Visual information has text alternatives

---

## Performance

- Tools load quickly with code splitting
- Calculations are instant (O(1) complexity)
- No API calls required
- Minimal bundle size per tool
- Optimized for mobile devices

---

## Privacy & Security

- No user data is collected or stored
- No tracking or analytics on tool usage
- All calculations happen client-side
- No authentication required
- No cookies set
- HTTPS enforced for all resources

---

## Future Enhancements

Potential additions for future versions:

- Save and share results
- Progress tracking over time
- Integration with client dashboard
- Additional tools (macro calculator, meal timing, etc.)
- Downloadable guides
- Video explanations
- Multi-language support

---

## Support

For questions or issues with the health tools:
- Technical issues: Contact the development team
- Content questions: Contact AFYA's nutrition/coaching team
- User feedback: Share through the main contact form

---

## License

This feature is part of the AFYA website and follows the same license and terms of use.

---

**Last Updated**: November 2025
**Version**: 1.0.0
