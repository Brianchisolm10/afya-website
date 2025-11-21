# Health Tools - Complete Documentation

## Table of Contents

1. [User-Facing Help Text](#user-facing-help-text)
2. [Calculation Formulas and Sources](#calculation-formulas-and-sources)
3. [Code Documentation](#code-documentation)
4. [Deployment Guide](#deployment-guide)
5. [Quality Assurance Checklist](#quality-assurance-checklist)

---

## User-Facing Help Text

### General Help Text (Tools Page)

**Page Title**: Health Tools

**Page Description**: 
"Simple tools to understand your health better. These calculators provide educational starting points—not rigid rules. Use them to learn about your body and make informed decisions about your wellness journey."

**Important Note**:
"These tools are for educational purposes only and do not replace professional medical advice. Always consult with a healthcare provider for personalized guidance."

---

### Tool-Specific Help Text

#### 1. Daily Energy & Protein Needs Calculator

**Tool Description**:
"Find your daily calorie and protein starting point based on your unique characteristics and goals."

**Input Help Text**:
- **Age**: "Enter your age in years (13-100)"
- **Sex**: "Biological sex affects metabolic rate calculations"
- **Height**: "Your height in feet/inches or centimeters"
- **Weight**: "Your current weight in pounds or kilograms"
- **Activity Level**: 
  - Sedentary: "Little to no exercise, desk job"
  - Light: "Light exercise 1-3 days/week"
  - Moderate: "Moderate exercise 3-5 days/week"
  - Active: "Hard exercise 6-7 days/week"
  - Very Active: "Very hard exercise, physical job, or training twice per day"
- **Goal**: 
  - Lose: "Gradual weight loss (about 1 lb/week)"
  - Maintain: "Maintain current weight"
  - Gain: "Gradual weight gain (about 1 lb/week)"

**Results Help Text**:
"Your estimated daily needs are **{calories} calories** and **{proteinMin}-{proteinMax} grams of protein**.

This is a starting point based on your information. Your actual needs may vary based on factors like genetics, metabolism, and activity patterns. Listen to your body and adjust as needed. Consider working with a nutrition professional for personalized guidance."

**Educational Note**:
"These calculations use the Mifflin-St Jeor equation, a scientifically validated method for estimating energy needs. Protein recommendations are based on current sports nutrition guidelines."

---

#### 2. Plate Builder

**Tool Description**:
"Learn balanced plate proportions visually. See how your plate composition changes based on your goals."

**Input Help Text**:
- **Goal**:
  - Energy: "Balanced nutrition for daily energy and wellness"
  - Performance: "Fuel for athletic performance and training"
  - Recovery: "Support healing and muscle recovery"
- **Meal Type**: "Select breakfast, lunch, or dinner to see meal-specific examples"

**Results Help Text**:
"Here's your balanced plate for {goal} at {mealType}:

**Plate Proportions**:
- Vegetables: {percentage}% - Fill with colorful, non-starchy vegetables
- Protein: {percentage}% - Lean meats, fish, eggs, legumes, or plant proteins
- Carbohydrates: {percentage}% - Whole grains, starchy vegetables, or fruits
- Healthy Fats: {percentage}% - Nuts, seeds, avocado, olive oil

**Example Meals**:
{meal examples}

Remember, these are guidelines, not strict rules. Your needs may vary based on your activity, preferences, and hunger cues."

**Educational Note**:
"These proportions are based on MyPlate guidelines and sports nutrition best practices. Adjust based on your individual needs and preferences."

---

#### 3. Hydration & Sleep Snapshot

**Tool Description**:
"Check if your sleep and hydration habits fall within healthy ranges and get simple tips for improvement."

**Input Help Text**:
- **Sleep Hours**: "Average hours of sleep per night (0-24)"
- **Water Intake**: "Daily water intake in cups (8 oz each) or bottles"

**Results Help Text**:
"**Sleep Status**: {below/within/above} recommended range
- Recommended: 7-9 hours for adults, 8-10 hours for teens
- Your average: {hours} hours

**Hydration Status**: {below/within/above} recommended range
- Recommended: 8-10 cups per day for adults
- Your intake: {cups} cups

**Tips for You**:
- Sleep: {personalized tip}
- Hydration: {personalized tip}

Quality matters as much as quantity. Focus on consistent routines and listen to your body's signals."

**Educational Note**:
"Recommendations are based on National Sleep Foundation guidelines and Institute of Medicine hydration standards. Individual needs vary based on activity level, climate, and health status."

---

#### 4. Heart Rate Zone Finder

**Tool Description**:
"Know your heart rate zones for different exercise intensities. Train smarter, not just harder."

**Input Help Text**:
- **Age**: "Your age in years (13-100)"
- **Resting Heart Rate** (optional): "Your resting heart rate in beats per minute (30-120). Measure first thing in the morning for accuracy. Providing this gives more personalized zones."

**Results Help Text**:
"Your heart rate zones based on a maximum heart rate of **{maxHR} bpm**:

**Easy Zone**: {min}-{max} bpm
- Conversational pace, can talk easily
- Great for warm-ups, cool-downs, and recovery days
- Most of your weekly movement can happen here

**Moderate Zone**: {min}-{max} bpm
- Slightly breathless but can still talk
- Builds aerobic fitness
- Good for steady-state cardio

**Vigorous Zone**: {min}-{max} bpm
- Challenging pace, hard to talk
- Improves performance and VO2 max
- Use sparingly, with adequate recovery

Remember: Most people benefit from spending 80% of their training time in easy-moderate zones. High-intensity work is valuable but should be balanced with recovery."

**Educational Note**:
{if resting HR provided}: "These zones use the Karvonen formula, which accounts for your resting heart rate for more accurate personalization."
{if no resting HR}: "These zones use the simple age-based formula (220 - age). For more accuracy, measure your resting heart rate and recalculate."

---

#### 5. Stress & Recovery Check-In

**Tool Description**:
"Assess your current recovery state to make informed decisions about today's activity level."

**Input Help Text**:
- **Energy Level**: "How energized do you feel? (1=exhausted, 5=fully energized)"
- **Muscle Soreness**: "How sore are your muscles? (1=very sore, 5=no soreness)"
- **Stress Level**: "How stressed do you feel? (1=very stressed, 5=calm and relaxed)"
- **Mood**: "How's your mood today? (1=low/irritable, 5=positive/happy)"

**Results Help Text**:
"**Your Recovery Status**: {Recovery Day / Half-Speed Day / Green Light Day}

{Recovery Day}: 
Your body is asking for rest today. Consider:
- Light stretching or gentle yoga
- A leisurely walk
- Complete rest if needed
- Focus on sleep, nutrition, and stress management

{Half-Speed Day}:
You're moderately recovered. Consider:
- Moderate-intensity exercise at 60-70% effort
- Shorter workout duration
- Focus on technique and form
- Listen to your body and adjust as needed

{Green Light Day}:
You're well-recovered and ready to train! Consider:
- Full training intensity if planned
- Challenging workouts or competitions
- Still warm up properly and stay mindful
- Recovery is ongoing—don't skip basics

Remember: Recovery is when your body adapts and gets stronger. Honoring your recovery needs is a sign of wisdom, not weakness."

**Educational Note**:
"This assessment is based on athlete wellness monitoring practices used in sports science. It's a subjective tool to help you tune into your body's signals."

---

#### 6. Youth Corner

**Tool Description**:
"Reflect on screen time versus active play time. Find opportunities to increase movement in a fun, judgment-free way."

**Input Help Text**:
- **Screen Time**: "Average daily hours on screens (TV, phone, tablet, computer, games)"
- **Play/Movement Time**: "Average daily hours of active play, sports, or movement"

**Results Help Text**:
"**Your Balance**:
- Screen time: {hours} hours per day
- Active time: {hours} hours per day

{Comparison message - non-judgmental}

**Movement Ideas for You**:
{Practical, fun suggestion}

Remember: Small changes add up! Even 10-15 minutes of extra movement makes a difference. The goal is finding activities you enjoy, not perfection."

**Educational Note**:
"The WHO recommends limiting sedentary screen time and getting at least 60 minutes of moderate-to-vigorous physical activity daily for children and teens. These are guidelines to support health, not strict rules."

---

## Calculation Formulas and Sources

### 1. Basal Metabolic Rate (BMR)

**Formula**: Mifflin-St Jeor Equation

**For Males**:
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
```

**For Females**:
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
```

**Source**:
Mifflin, M. D., St Jeor, S. T., Hill, L. A., Scott, B. J., Daugherty, S. A., & Koh, Y. O. (1990). A new predictive equation for resting energy expenditure in healthy individuals. *The American Journal of Clinical Nutrition*, 51(2), 241-247.

**Why This Formula**:
The Mifflin-St Jeor equation is considered more accurate than the older Harris-Benedict equation and is recommended by the Academy of Nutrition and Dietetics.

---

### 2. Total Daily Energy Expenditure (TDEE)

**Formula**:
```
TDEE = BMR × Activity Multiplier
```

**Activity Multipliers**:
- Sedentary (little/no exercise): 1.2
- Light (exercise 1-3 days/week): 1.375
- Moderate (exercise 3-5 days/week): 1.55
- Active (exercise 6-7 days/week): 1.725
- Very Active (hard exercise daily + physical job): 1.9

**Goal Adjustments**:
- Weight loss: TDEE - 500 calories (≈1 lb/week loss)
- Maintenance: TDEE (no adjustment)
- Weight gain: TDEE + 500 calories (≈1 lb/week gain)

**Source**:
Standard activity multipliers used in nutrition science and validated through metabolic studies.

---

### 3. Protein Requirements

**Formula**:
```
Protein (g/day) = Body Weight (kg) × Multiplier
```

**Multipliers by Activity and Goal**:
- Sedentary: 0.8-1.0 g/kg
- Light activity: 1.0-1.2 g/kg
- Moderate activity: 1.2-1.6 g/kg
- Active/Athlete: 1.6-2.0 g/kg
- Weight loss: minimum 1.2 g/kg (preserve muscle)
- Muscle gain: 1.4-2.0 g/kg (support growth)

**Source**:
Jäger, R., et al. (2017). International Society of Sports Nutrition Position Stand: protein and exercise. *Journal of the International Society of Sports Nutrition*, 14(1), 20.

---

### 4. Heart Rate Zones

**Maximum Heart Rate**:
```
Max HR = 220 - Age
```

**Simple Percentage Method**:
```
Easy Zone: 50-60% of Max HR
Moderate Zone: 60-70% of Max HR
Vigorous Zone: 70-85% of Max HR
```

**Karvonen Formula** (when resting HR is known):
```
Heart Rate Reserve (HRR) = Max HR - Resting HR
Target HR = (HRR × Intensity %) + Resting HR
```

**Sources**:
- Fox, S. M., Naughton, J. P., & Haskell, W. L. (1971). Physical activity and the prevention of coronary heart disease. *Annals of Clinical Research*, 3(6), 404-432.
- Karvonen, M. J., Kentala, E., & Mustala, O. (1957). The effects of training on heart rate; a longitudinal study. *Annales Medicinae Experimentalis et Biologiae Fenniae*, 35(3), 307-315.
- American Heart Association exercise intensity guidelines

---

### 5. Sleep Recommendations

**Age-Based Ranges**:
- Teens (13-17 years): 8-10 hours
- Adults (18-64 years): 7-9 hours
- Seniors (65+ years): 7-8 hours

**Source**:
Hirshkowitz, M., et al. (2015). National Sleep Foundation's sleep time duration recommendations: methodology and results summary. *Sleep Health*, 1(1), 40-43.

---

### 6. Hydration Recommendations

**General Guideline**:
- Adults: 8-10 cups (64-80 oz) per day
- Adjust for activity level, climate, and individual factors

**Source**:
Institute of Medicine (2004). Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate. Washington, DC: The National Academies Press.

**Note**: Individual needs vary significantly based on body size, activity level, climate, and sweat rate.

---

### 7. Recovery Assessment

**Calculation**:
```
Recovery Score = Average of (Energy + Soreness + Stress + Mood) / 4
```

**Interpretation**:
- Score < 2.5: Recovery Day (rest or very light activity)
- Score 2.5-3.5: Half-Speed Day (moderate activity at reduced intensity)
- Score > 3.5: Green Light Day (full training intensity)

**Source**:
Based on athlete wellness questionnaire methodologies used in sports science:
- Hooper, S. L., & Mackinnon, L. T. (1995). Monitoring overtraining in athletes. *Sports Medicine*, 20(5), 321-327.
- McLean, B. D., et al. (2010). Neuromuscular, endocrine, and perceptual fatigue responses during different length between-match microcycles in professional rugby league players. *International Journal of Sports Physiology and Performance*, 5(3), 367-383.

---

## Code Documentation

### File Structure and Purpose

```
components/tools/
├── EnergyProteinCalculator.tsx    # BMR/TDEE/protein calculator
├── PlateBuilder.tsx                # Visual plate proportions tool
├── PlateVisual.tsx                 # SVG plate visualization component
├── HydrationSleepSnapshot.tsx      # Sleep and hydration checker
├── HeartRateZones.tsx              # HR zone calculator
├── RecoveryCheckIn.tsx             # Recovery assessment tool
├── YouthCorner.tsx                 # Screen time vs. activity tool
├── ToolCard.tsx                    # Tool preview card component
├── ToolPanel.tsx                   # Modal/panel container
└── README.md                       # Feature documentation

lib/tools/
├── calculations.ts                 # Core calculation functions
├── constants.ts                    # Activity multipliers, ranges
├── validation.ts                   # Zod input validation schemas
├── types.ts                        # TypeScript type definitions
├── tool-config.ts                  # Tool metadata and configuration
└── plate-data.ts                   # Plate proportions and meal examples
```

### Key Functions Documentation

All calculation functions in `lib/tools/calculations.ts` include:
- JSDoc comments explaining purpose
- Parameter descriptions with types
- Return value descriptions
- Formula explanations
- Example usage where helpful

### Complex Code Sections

**1. BMR Calculation** (`lib/tools/calculations.ts`):
```typescript
// Uses Mifflin-St Jeor equation
// More accurate than Harris-Benedict for modern populations
// Accounts for sex differences in metabolic rate
```

**2. Karvonen Formula** (`lib/tools/calculations.ts`):
```typescript
// Accounts for individual fitness level via resting HR
// More personalized than simple percentage method
// Preferred for trained individuals
```

**3. Unit Conversions** (`lib/tools/calculations.ts`):
```typescript
// Supports both metric and imperial units
// Conversions maintain precision for calculations
// User-friendly for diverse audiences
```

**4. Validation Schemas** (`lib/tools/validation.ts`):
```typescript
// Zod schemas provide runtime type safety
// Friendly error messages for users
// Prevents invalid calculations
```

---

## Deployment Guide

### Pre-Deployment Checklist

#### 1. Code Quality
- [ ] All TypeScript types are properly defined
- [ ] No console.log statements in production code
- [ ] All imports are used
- [ ] Code follows project style guidelines
- [ ] Complex functions have JSDoc comments

#### 2. Testing
- [ ] All unit tests pass (`npm run test -- lib/tools`)
- [ ] All component tests pass (`npm run test -- components/tools`)
- [ ] Integration tests pass (`npm run test -- app/(public)/tools`)
- [ ] Manual testing completed on all tools
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing completed (iOS Safari, Android Chrome)

#### 3. Accessibility
- [ ] All form inputs have proper labels
- [ ] ARIA attributes are correctly applied
- [ ] Keyboard navigation works throughout
- [ ] Screen reader testing completed
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 minimum)
- [ ] Focus indicators are visible
- [ ] Error messages are announced to assistive technology

#### 4. Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 2.5s
- [ ] No unnecessary re-renders
- [ ] Images are optimized
- [ ] Code splitting is implemented

#### 5. Content
- [ ] All educational text is accurate
- [ ] Formulas are correctly implemented
- [ ] Error messages are friendly and helpful
- [ ] Help text is clear and concise
- [ ] Sources are properly cited

### Staging Deployment

#### Step 1: Deploy to Staging
```bash
# Ensure all changes are committed
git add .
git commit -m "feat: complete health tools feature with documentation"

# Push to staging branch
git push origin staging

# Vercel will automatically deploy
```

#### Step 2: Staging Testing
1. **Functional Testing**:
   - Test each tool with various inputs
   - Verify calculations are accurate
   - Test edge cases and boundary values
   - Verify error handling

2. **Visual Testing**:
   - Check layout on desktop (1920px, 1366px, 1024px)
   - Check layout on tablet (768px, 834px)
   - Check layout on mobile (375px, 414px, 320px)
   - Verify AFYA branding is consistent

3. **Integration Testing**:
   - Verify navigation to/from tools page
   - Test CTAs link to correct pages
   - Verify footer and header integration
   - Test back button functionality

4. **Performance Testing**:
   - Run Lighthouse audit
   - Check bundle size
   - Verify load times
   - Test on slow 3G connection

5. **Accessibility Testing**:
   - Run axe DevTools scan
   - Test with keyboard only
   - Test with screen reader (NVDA/JAWS/VoiceOver)
   - Verify focus management

#### Step 3: Gather Feedback
- [ ] Internal team review
- [ ] Stakeholder approval
- [ ] User testing (if applicable)
- [ ] Address any issues found

### Production Deployment

#### Step 1: Final Checks
```bash
# Run all tests one final time
npm run test

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

#### Step 2: Deploy to Production
```bash
# Merge to main branch
git checkout main
git merge staging

# Push to production
git push origin main

# Vercel will automatically deploy
```

#### Step 3: Post-Deployment Verification
1. **Smoke Testing**:
   - Visit /tools page
   - Open each tool
   - Perform one calculation per tool
   - Verify results display correctly

2. **Monitoring**:
   - Check error logs for any issues
   - Monitor performance metrics
   - Watch for user feedback
   - Track analytics (page views, tool usage)

3. **Documentation**:
   - Update internal documentation
   - Notify team of deployment
   - Share user guide if needed

### Rollback Plan

If issues are discovered in production:

```bash
# Revert to previous version
git revert HEAD

# Push revert
git push origin main

# Or rollback in Vercel dashboard
# Deployments > Select previous deployment > Promote to Production
```

---

## Quality Assurance Checklist

### Functional QA

#### Energy & Protein Calculator
- [ ] BMR calculation is accurate for males
- [ ] BMR calculation is accurate for females
- [ ] TDEE adjusts correctly for activity levels
- [ ] Goal adjustments apply correctly (+/- 500 cal)
- [ ] Protein ranges are appropriate for activity/goal
- [ ] Unit conversions work (lbs/kg, ft-in/cm)
- [ ] Validation prevents invalid inputs
- [ ] Error messages are helpful
- [ ] Results display with educational text
- [ ] CTA links work correctly

#### Plate Builder
- [ ] All goal options work (energy, performance, recovery)
- [ ] All meal types work (breakfast, lunch, dinner)
- [ ] Plate visual displays correctly
- [ ] Proportions are accurate
- [ ] Example meals display
- [ ] Educational text is present
- [ ] Visual is accessible (alt text, labels)

#### Hydration & Sleep Snapshot
- [ ] Sleep comparison works correctly
- [ ] Hydration comparison works correctly
- [ ] Status labels are accurate (below/within/above)
- [ ] Tips are relevant to status
- [ ] Age-based sleep recommendations work
- [ ] Validation prevents invalid inputs
- [ ] Educational text is present

#### Heart Rate Zones
- [ ] Max HR calculation is correct (220 - age)
- [ ] Simple percentage zones are accurate
- [ ] Karvonen formula works when resting HR provided
- [ ] All three zones display correctly
- [ ] Zone ranges don't overlap incorrectly
- [ ] Educational text explains zones
- [ ] Optional resting HR field works

#### Recovery Check-In
- [ ] All four sliders work
- [ ] Score calculation is correct (average)
- [ ] Recovery labels are accurate
- [ ] Guidance messages are appropriate
- [ ] Visual indicators match status
- [ ] Language is supportive and non-judgmental

#### Youth Corner
- [ ] Screen time input works
- [ ] Play time input works
- [ ] Comparison is non-judgmental
- [ ] Suggestions are practical and encouraging
- [ ] Educational text is age-appropriate
- [ ] Validation works correctly

### Visual QA

#### Desktop (1920px, 1366px, 1024px)
- [ ] Tool cards display in grid
- [ ] Cards are evenly spaced
- [ ] Tool panels are centered
- [ ] Typography is readable
- [ ] Colors match AFYA palette
- [ ] Hover states work
- [ ] Focus states are visible

#### Tablet (768px, 834px)
- [ ] Tool cards adjust to 2 columns
- [ ] Tool panels fit screen
- [ ] Touch targets are adequate (44x44px min)
- [ ] Typography scales appropriately
- [ ] No horizontal scrolling

#### Mobile (375px, 414px, 320px)
- [ ] Tool cards stack vertically
- [ ] Tool panels are full-screen
- [ ] Inputs are touch-friendly
- [ ] Typography is readable
- [ ] Buttons are large enough
- [ ] No content is cut off
- [ ] Virtual keyboard doesn't break layout

### Accessibility QA

#### Keyboard Navigation
- [ ] Tab order is logical
- [ ] All interactive elements are reachable
- [ ] Focus indicators are visible
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals
- [ ] No keyboard traps

#### Screen Reader
- [ ] Page structure is logical
- [ ] All images have alt text
- [ ] Form labels are associated
- [ ] Error messages are announced
- [ ] Results are announced
- [ ] ARIA labels are appropriate
- [ ] Landmark regions are defined

#### Visual
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Text is resizable to 200%
- [ ] No information by color alone
- [ ] Focus indicators are visible
- [ ] Error states are clear

### Performance QA

- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse Accessibility score > 95
- [ ] Lighthouse Best Practices score > 90
- [ ] Lighthouse SEO score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 2.5s
- [ ] Total Blocking Time < 300ms
- [ ] Cumulative Layout Shift < 0.1
- [ ] Largest Contentful Paint < 2.5s

### Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] iOS Safari (latest)
- [ ] Android Chrome (latest)

### Integration QA

- [ ] Navigation menu includes Tools link
- [ ] Footer includes Tools link
- [ ] Tools page matches site design
- [ ] CTAs link to correct pages
- [ ] Back navigation works
- [ ] Page metadata is correct (title, description)
- [ ] Social sharing works (if applicable)

---

## Maintenance and Updates

### Regular Maintenance Tasks

**Monthly**:
- Review error logs for any issues
- Check analytics for usage patterns
- Gather user feedback

**Quarterly**:
- Review calculation formulas for updates
- Update educational content if needed
- Check for new research/recommendations
- Update dependencies

**Annually**:
- Comprehensive accessibility audit
- Performance optimization review
- Content accuracy review
- User experience improvements

### Updating Calculations

If formulas or recommendations change:

1. Update constants in `lib/tools/constants.ts`
2. Update calculation functions in `lib/tools/calculations.ts`
3. Update tests to reflect new values
4. Update documentation with new sources
5. Update user-facing help text
6. Test thoroughly before deploying

### Adding New Tools

Follow the pattern established by existing tools:

1. Create component in `components/tools/`
2. Add calculation logic to `lib/tools/calculations.ts`
3. Add validation schema to `lib/tools/validation.ts`
4. Add tool config to `lib/tools/tool-config.ts`
5. Write tests
6. Update documentation
7. Follow deployment process

---

**Document Version**: 1.0.0  
**Last Updated**: November 2025  
**Maintained By**: AFYA Development Team
