# Requirements Document

## Introduction

The Health Tools feature provides a collection of simple, educational health calculators and assessments designed to make health education accessible to everyone. These tools serve as supportive resources that complement AFYA's core coaching services, helping users understand their health metrics without overwhelming them with data or judgment.

## Glossary

- **Health Tools System**: The collection of interactive calculators and assessments accessible through the AFYA website
- **Tool Card**: A compact visual representation of a health tool on the main tools page
- **Tool Panel**: The expanded interface where users interact with a specific tool's inputs and view outputs
- **Educational Output**: The result of a tool calculation paired with 1-2 sentences of friendly, non-judgmental guidance
- **User**: Any visitor to the AFYA website (general public, parents, athletes, or current clients)

## Requirements

### Requirement 1: Health Tools Page Access

**User Story:** As a website visitor, I want to easily find and access health education tools, so that I can learn about my health metrics in a non-intimidating way

#### Acceptance Criteria

1. WHEN a User navigates to the main menu, THE Health Tools System SHALL display a "Tools" navigation item
2. WHEN a User clicks the "Tools" navigation item, THE Health Tools System SHALL navigate to the Health Tools page at `/tools`
3. THE Health Tools System SHALL display all available tools as cards on a single page
4. THE Health Tools System SHALL use AFYA's calm, pastel aesthetic for all tool interfaces
5. THE Health Tools System SHALL ensure the tools page is accessible without authentication

### Requirement 2: Daily Energy & Protein Needs Calculator

**User Story:** As a user interested in nutrition, I want to calculate my daily calorie and protein needs, so that I have a starting point for my nutrition planning

#### Acceptance Criteria

1. WHEN a User opens the Daily Energy & Protein Needs tool, THE Health Tools System SHALL display input fields for age, sex, height, weight, activity level, and goal
2. WHEN a User provides all required inputs, THE Health Tools System SHALL calculate estimated daily calories using the Mifflin-St Jeor equation
3. WHEN a User provides all required inputs, THE Health Tools System SHALL calculate a protein range in grams per day based on goal and activity level
4. THE Health Tools System SHALL display the calorie estimate and protein range as the primary output
5. THE Health Tools System SHALL include 1-2 educational sentences explaining that results are a starting point, not rigid rules
6. THE Health Tools System SHALL validate that age is between 13 and 100 years
7. THE Health Tools System SHALL validate that height and weight are positive numbers

### Requirement 3: Plate Builder Tool

**User Story:** As a user learning about nutrition, I want to see healthy plate proportions visually, so that I can understand balanced meal composition

#### Acceptance Criteria

1. WHEN a User opens the Plate Builder tool, THE Health Tools System SHALL display input options for goal (energy/performance/recovery) and meal type (breakfast/lunch/dinner)
2. WHEN a User selects a goal and meal type, THE Health Tools System SHALL display a visual plate representation showing approximate percentages of plants, protein, carbs, and fats
3. WHEN a User selects a goal and meal type, THE Health Tools System SHALL display 2-3 example meals matching the selected criteria
4. THE Health Tools System SHALL use MyPlate-style visual design principles
5. THE Health Tools System SHALL include a brief explanation of the plate proportions

### Requirement 4: Hydration & Sleep Snapshot

**User Story:** As a user curious about my recovery habits, I want to check if my sleep and hydration are in healthy ranges, so that I can identify areas for improvement

#### Acceptance Criteria

1. WHEN a User opens the Hydration & Sleep Snapshot, THE Health Tools System SHALL display input fields for average nightly sleep (hours) and daily water intake (cups or bottles)
2. WHEN a User provides sleep data, THE Health Tools System SHALL indicate whether the value is within, below, or above typical ranges (7-9 hours for adults)
3. WHEN a User provides hydration data, THE Health Tools System SHALL indicate whether the value is within, below, or above typical ranges (8-10 cups for adults)
4. THE Health Tools System SHALL provide one simple tip for improving sleep
5. THE Health Tools System SHALL provide one simple tip for improving hydration
6. THE Health Tools System SHALL validate that sleep hours are between 0 and 24
7. THE Health Tools System SHALL validate that water intake is a positive number

### Requirement 5: Heart Rate Zone Finder

**User Story:** As a user interested in exercise intensity, I want to know my heart rate zones, so that I can train at appropriate intensities

#### Acceptance Criteria

1. WHEN a User opens the Heart Rate Zone Finder, THE Health Tools System SHALL display an input field for age
2. WHEN a User opens the Heart Rate Zone Finder, THE Health Tools System SHALL display an optional input field for resting heart rate
3. WHEN a User provides their age, THE Health Tools System SHALL calculate approximate easy, moderate, and higher-effort heart rate ranges using age-based formulas
4. WHEN a User provides resting heart rate, THE Health Tools System SHALL use the Karvonen formula for more accurate zone calculations
5. THE Health Tools System SHALL display the three heart rate zones with clear labels
6. THE Health Tools System SHALL include a note explaining that most weekly movement can occur in the easy-moderate zone
7. THE Health Tools System SHALL validate that age is between 13 and 100 years
8. WHERE resting heart rate is provided, THE Health Tools System SHALL validate it is between 30 and 120 bpm

### Requirement 6: Stress & Recovery Check-In

**User Story:** As a user planning my training, I want to assess my current recovery state, so that I can make informed decisions about today's activity level

#### Acceptance Criteria

1. WHEN a User opens the Stress & Recovery Check-In, THE Health Tools System SHALL display 4 input controls for energy, soreness, stress, and mood
2. THE Health Tools System SHALL use sliders or emoji-based inputs for each recovery factor
3. WHEN a User provides all recovery inputs, THE Health Tools System SHALL calculate an overall recovery assessment
4. THE Health Tools System SHALL display one of three labels: "Recovery Day", "Green Light Day", or "Half-Speed Day"
5. THE Health Tools System SHALL provide one sentence of guidance on approaching training or self-care based on the assessment
6. THE Health Tools System SHALL use supportive, non-judgmental language in all outputs

### Requirement 7: Youth Corner Tool (Optional)

**User Story:** As a parent or young person, I want to reflect on screen time versus active play time, so that I can find opportunities to increase movement

#### Acceptance Criteria

1. WHEN a User opens the Youth Corner tool, THE Health Tools System SHALL display input fields for daily screen time hours and daily play/movement hours
2. WHEN a User provides screen time and play time data, THE Health Tools System SHALL calculate the ratio between the two
3. THE Health Tools System SHALL display a gentle, non-judgmental comparison of the two values
4. THE Health Tools System SHALL provide one practical idea for increasing movement time
5. THE Health Tools System SHALL use age-appropriate, encouraging language
6. THE Health Tools System SHALL validate that hours are between 0 and 24

### Requirement 8: Tool Card Display

**User Story:** As a website visitor, I want to see all available tools at a glance, so that I can quickly choose which tool to use

#### Acceptance Criteria

1. THE Health Tools System SHALL display each tool as a card on the main tools page
2. WHEN displaying a tool card, THE Health Tools System SHALL show the tool title, a one-line description, and an "Open Tool" button
3. THE Health Tools System SHALL display tool cards in a responsive grid layout
4. THE Health Tools System SHALL use consistent card styling aligned with AFYA's design system
5. THE Health Tools System SHALL display 6 tool cards on the main page

### Requirement 9: Tool Panel Interaction

**User Story:** As a user interacting with a tool, I want a clean, focused interface, so that I can easily provide inputs and understand outputs

#### Acceptance Criteria

1. WHEN a User clicks "Open Tool" on a tool card, THE Health Tools System SHALL expand or navigate to the tool panel
2. THE Health Tools System SHALL display all input fields clearly labeled with minimal text
3. WHEN a User provides all required inputs, THE Health Tools System SHALL calculate and display results immediately
4. THE Health Tools System SHALL display educational output with no more than 2 sentences of explanation
5. THE Health Tools System SHALL provide a way to close or collapse the tool panel and return to the tools overview
6. THE Health Tools System SHALL maintain a clean, uncluttered interface throughout the interaction

### Requirement 10: Mobile Responsiveness

**User Story:** As a mobile user, I want to use health tools on my phone, so that I can access them anywhere

#### Acceptance Criteria

1. THE Health Tools System SHALL display tool cards in a single column on mobile devices
2. THE Health Tools System SHALL ensure all input controls are touch-friendly on mobile devices
3. THE Health Tools System SHALL ensure tool panels are fully functional on screens as small as 320px wide
4. THE Health Tools System SHALL use responsive typography that remains readable on all screen sizes

### Requirement 11: Input Validation and Error Handling

**User Story:** As a user entering data, I want clear feedback on invalid inputs, so that I can correct mistakes easily

#### Acceptance Criteria

1. WHEN a User enters invalid data, THE Health Tools System SHALL display a friendly error message near the relevant input field
2. THE Health Tools System SHALL prevent calculation until all required inputs are valid
3. THE Health Tools System SHALL use inline validation that provides immediate feedback
4. THE Health Tools System SHALL use encouraging language in error messages
5. THE Health Tools System SHALL clearly indicate which fields are required

### Requirement 12: Accessibility Compliance

**User Story:** As a user with accessibility needs, I want to use health tools with assistive technology, so that I can access health education equally

#### Acceptance Criteria

1. THE Health Tools System SHALL ensure all interactive elements are keyboard accessible
2. THE Health Tools System SHALL provide appropriate ARIA labels for all form inputs
3. THE Health Tools System SHALL maintain a minimum contrast ratio of 4.5:1 for all text
4. THE Health Tools System SHALL ensure screen readers can navigate and understand all tool interfaces
5. THE Health Tools System SHALL provide text alternatives for any visual-only information

### Requirement 13: Integration with Existing Site

**User Story:** As a website visitor, I want health tools to feel like a natural part of the AFYA website, so that I have a cohesive experience

#### Acceptance Criteria

1. THE Health Tools System SHALL use the same navigation component as other public pages
2. THE Health Tools System SHALL use the same footer component as other public pages
3. THE Health Tools System SHALL apply AFYA's existing color palette and typography
4. THE Health Tools System SHALL maintain consistent spacing and layout patterns with other pages
5. WHERE appropriate, THE Health Tools System SHALL include calls-to-action linking to AFYA's core services (Programs, Get Started)
