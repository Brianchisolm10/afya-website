# Implementation Plan

- [x] 1. Set up project structure and shared utilities
  - Create directory structure for tools components and utilities
  - Define TypeScript interfaces for all tool inputs and outputs
  - Create tool configuration file with metadata for all 7 tools
  - _Requirements: 9, 14_

- [x] 1.1 Create calculation utilities
  - Implement BMR and TDEE calculation functions (Mifflin-St Jeor equation)
  - Implement heart rate zone calculations (age-based and Karvonen formulas)
  - Implement protein range calculations based on activity and goals
  - Create utility functions for unit conversions (lbs/kg, in/cm)
  - _Requirements: 2, 6_

- [x] 1.2 Create validation schemas
  - Define Zod schemas for each tool's input validation
  - Create shared validation utilities for common inputs (age, weight, height)
  - Implement input sanitization functions
  - _Requirements: 12_

- [x] 1.3 Create constants and configuration
  - Define activity level multipliers
  - Define protein recommendation ranges
  - Define sleep and hydration ranges by age group
  - Create plate proportion templates for different goals/meals
  - Define recovery assessment thresholds
  - _Requirements: 2, 3, 4, 5, 7_

- [x] 2. Build main tools page and navigation
  - Create `/tools` page route with layout
  - Implement responsive grid layout for tool cards
  - Add "Tools" item to main navigation menu
  - Add tools section to footer
  - _Requirements: 1, 9, 14_

- [x] 2.1 Create ToolCard component
  - Build card component with icon, title, description, and CTA
  - Implement gradient backgrounds matching AFYA aesthetic
  - Add hover and focus states
  - Ensure mobile responsiveness
  - _Requirements: 9_

- [x] 2.2 Create ToolPanel component
  - Build modal/panel container for tool interactions
  - Implement open/close animations
  - Add back navigation to tools overview
  - Ensure keyboard accessibility (ESC to close, focus trap)
  - _Requirements: 10, 13_

- [x] 3. Implement Energy & Protein Calculator
  - Create input form with age, sex, height, weight, activity level, and goal fields
  - Implement BMR calculation using Mifflin-St Jeor equation
  - Calculate TDEE with activity multipliers
  - Adjust calories based on goal (+500 for gain, -500 for loss)
  - Calculate protein range based on activity level and goal
  - Display results with educational explanation
  - _Requirements: 2_

- [x] 3.1 Add input validation and error handling
  - Validate age range (13-100)
  - Validate height and weight as positive numbers
  - Show inline error messages with friendly language
  - Disable calculate button until all inputs are valid
  - _Requirements: 12_

- [x] 3.2 Create results display
  - Show daily calorie estimate prominently
  - Display protein range in grams per day
  - Include 1-2 educational sentences about using results as a starting point
  - Add CTA to explore programs
  - _Requirements: 2, 14_

- [x] 4. Implement Plate Builder tool
  - Create input selectors for goal (energy/performance/recovery) and meal type
  - Build visual plate representation using CSS or SVG
  - Define plate proportions for each goal/meal combination
  - Display 2-3 example meals for selected combination
  - Include brief explanation of proportions
  - _Requirements: 3_

- [x] 4.1 Create plate visual component
  - Design circular plate divided into sections
  - Use colors to represent food groups (vegetables, protein, carbs, fats)
  - Show percentages for each section
  - Ensure visual is accessible (include text alternatives)
  - _Requirements: 3, 13_

- [x] 4.2 Define meal examples database
  - Create meal examples for each goal/meal type combination
  - Include variety of dietary preferences (omnivore, vegetarian, etc.)
  - Use simple, recognizable meal descriptions
  - _Requirements: 3_

- [x] 5. Implement Hydration & Sleep Snapshot
  - Create inputs for sleep hours and water intake
  - Compare sleep to recommended range (7-9 hours for adults)
  - Compare hydration to recommended range (8-10 cups for adults)
  - Display status for each (below/within/above range)
  - Provide one tip for improving sleep
  - Provide one tip for improving hydration
  - _Requirements: 5_

- [x] 5.1 Create range comparison logic
  - Implement age-based sleep recommendations
  - Implement hydration recommendations
  - Generate status labels (below/within/above)
  - _Requirements: 5_

- [x] 5.2 Generate actionable tips
  - Create tip database for sleep improvement
  - Create tip database for hydration improvement
  - Select relevant tip based on user's current status
  - _Requirements: 5_

- [x] 6. Implement Heart Rate Zone Finder
  - Create input for age (required) and resting heart rate (optional)
  - Calculate max heart rate using 220 - age formula
  - Calculate zones using simple percentage method
  - If resting HR provided, use Karvonen formula for more accuracy
  - Display easy, moderate, and vigorous zones with BPM ranges
  - Include explanation about training in easy-moderate zones
  - _Requirements: 6_

- [x] 6.1 Implement zone calculations
  - Code simple max HR formula (220 - age)
  - Implement Karvonen formula for when resting HR is provided
  - Calculate three zones: easy (50-60%), moderate (60-70%), vigorous (70-85%)
  - _Requirements: 6_

- [x] 6.2 Create zone display component
  - Show three zones with clear labels and BPM ranges
  - Use color coding for visual distinction
  - Include educational note about zone usage
  - Ensure accessibility with proper labels
  - _Requirements: 6, 13_

- [x] 7. Implement Stress & Recovery Check-In
  - Create 4 input controls for energy, soreness, stress, and mood
  - Use slider or emoji-based inputs (1-5 scale)
  - Calculate aggregate recovery score
  - Determine recovery label (Recovery Day / Half-Speed Day / Green Light Day)
  - Display label with color coding
  - Provide one sentence of guidance for today's activity
  - _Requirements: 7_

- [x] 7.1 Create interactive input controls
  - Build slider components or emoji selectors
  - Ensure touch-friendly on mobile
  - Show current value for each input
  - Make controls accessible with keyboard
  - _Requirements: 7, 13_

- [x] 7.2 Generate recovery assessment
  - Calculate average score from 4 inputs
  - Map score to recovery label (< 2.5: Recovery, 2.5-3.5: Half-Speed, > 3.5: Green Light)
  - Generate appropriate guidance message
  - Use supportive, non-judgmental language
  - _Requirements: 7_

- [x] 8. Implement Youth Corner tool
  - Create inputs for daily screen time and play/movement time
  - Calculate ratio between screen time and active time
  - Display gentle, non-judgmental comparison
  - Provide one practical idea for increasing movement
  - Use age-appropriate, encouraging language
  - _Requirements: 8_

- [x] 8.1 Create comparison visualization
  - Show screen time vs. play time visually
  - Use friendly graphics appropriate for youth/families
  - Avoid judgmental language or "red flags"
  - _Requirements: 8_

- [x] 8.2 Generate family-friendly suggestions
  - Create suggestion database for increasing movement
  - Provide practical, achievable ideas
  - Use encouraging tone
  - _Requirements: 8_

- [x] 9. Implement mobile responsiveness
  - Ensure tool cards stack properly on mobile
  - Make tool panels full-screen on small devices
  - Optimize input controls for touch
  - Test on various screen sizes (320px to 1920px)
  - Ensure readable typography on all devices
  - _Requirements: 11_

- [x] 10. Implement accessibility features
  - Add ARIA labels to all form inputs
  - Ensure keyboard navigation works for all tools
  - Test with screen readers
  - Verify color contrast meets WCAG 2.1 AA (4.5:1 minimum)
  - Add focus indicators to all interactive elements
  - Provide text alternatives for visual information
  - _Requirements: 13_

- [x] 11. Add CTAs and integration points
  - Add "Explore Programs" CTA to tool results
  - Add "Get Started" CTA where appropriate
  - Link to relevant blog posts or resources
  - Ensure CTAs are contextual to tool results
  - _Requirements: 14_

- [x] 12. Style and polish
  - Apply AFYA color palette (turquoise, lavender)
  - Ensure consistent spacing and typography
  - Add smooth transitions and animations
  - Polish loading states
  - Refine error message styling
  - _Requirements: 14_

- [x] 13. Testing and quality assurance
  - Write unit tests for all calculation functions
  - Write component tests for each tool
  - Test input validation edge cases
  - Verify calculations are accurate
  - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
  - Test on multiple devices (desktop, tablet, mobile)
  - Verify accessibility with automated tools
  - Conduct manual accessibility testing
  - _Requirements: All_

- [x] 13.1 Write unit tests
  - Test BMR and TDEE calculations
  - Test heart rate zone calculations
  - Test protein range calculations
  - Test recovery score calculations
  - Test validation schemas
  - Test edge cases and boundary values
  - _Requirements: All_

- [x] 13.2 Write component tests
  - Test each tool component renders correctly
  - Test user interactions (input, calculate, view results)
  - Test error states and validation
  - Test accessibility features
  - _Requirements: All_

- [x] 13.3 Write integration tests
  - Test tools page displays all cards
  - Test opening and closing tool panels
  - Test navigation flow
  - Test mobile responsiveness
  - _Requirements: All_

- [x] 14. Documentation and deployment
  - Create user-facing help text for each tool
  - Document calculation formulas and sources
  - Add comments to complex code sections
  - Create README for tools feature
  - Deploy to staging for review
  - Conduct final QA
  - Deploy to production
  - _Requirements: All_
