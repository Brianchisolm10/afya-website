# Implementation Plan

- [x] 1. Create modular people component system
  - Build reusable person components with diversity features
  - Implement skin tone palette and body type variations
  - Create modular body parts for consistency
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 1.1 Define skin tone and body type constants
  - Create TypeScript constants for 5 skin tone colors
  - Define body type interfaces (athletic, average, plus-size, slim)
  - Create height variation types (short, average, tall)
  - _Requirements: 1.1, 1.2_

- [x] 1.2 Build reusable person component interface
  - Create PersonProps interface with all customization options
  - Implement base Person component accepting skin tone, body type, pose props
  - Add hair style and color customization options
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 1.3 Create modular body part components
  - Build Head component with skin tone and hair variations
  - Build Torso component with body type variations
  - Build Limbs components (arms, legs) with proportional sizing
  - _Requirements: 1.1, 1.2, 1.5_

- [x] 1.4 Write unit tests for person components
  - Test skin tone rendering for all 5 variations
  - Test body type rendering for all 4 types
  - Test component composition and prop passing
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Enhance existing illustrations with diversity
  - Update current illustrations to use new person components
  - Add diverse representations to existing figures
  - Maintain backward compatibility with current usage
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 7.3_

- [x] 2.1 Update WeightLiftingIllustration
  - Replace current figure with modular person component
  - Add medium skin tone and average body type
  - Maintain existing pose and barbell elements
  - _Requirements: 1.1, 1.2, 7.3_

- [x] 2.2 Update RunningIllustration
  - Replace current figure with modular person component
  - Add dark skin tone and athletic body type
  - Keep motion lines and dynamic pose
  - _Requirements: 1.1, 1.2, 7.3_

- [x] 2.3 Update YogaIllustration
  - Replace current figure with modular person component
  - Add light-medium skin tone and slim body type
  - Maintain yoga pose and peaceful aesthetic
  - _Requirements: 1.1, 1.2, 7.3_

- [x] 2.4 Update CommunityIllustration
  - Replace all 3 figures with diverse person components
  - Use varied skin tones (light, medium, dark)
  - Use varied body types (athletic, average, plus-size)
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 3. Create new strength training illustrations
  - Build 5 new strength training illustrations
  - Use diverse person components in each
  - Ensure proper form representation
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 3.1 Create DeadliftIllustration
  - Build person in deadlift position with barbell
  - Use medium-dark skin tone and athletic body type
  - Show proper form (straight back, hip hinge)
  - Add size variants and accessibility labels
  - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.4_

- [x] 3.2 Create PushUpIllustration
  - Build person in push-up plank position
  - Use light skin tone and average body type
  - Show proper alignment (straight body line)
  - Add size variants and accessibility labels
  - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.4_

- [x] 3.3 Create LungeIllustration
  - Build person in forward lunge position
  - Use dark skin tone and plus-size body type
  - Show proper form (90-degree angles, upright torso)
  - Add size variants and accessibility labels
  - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.4_

- [x] 3.4 Create PlankVariationIllustration
  - Build person in side plank position
  - Use medium skin tone and slim body type
  - Show proper form (straight body, stacked feet)
  - Add size variants and accessibility labels
  - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.4_

- [x] 3.5 Create KettlebellSwingIllustration
  - Build person swinging kettlebell
  - Use light-medium skin tone and athletic body type
  - Show dynamic movement with motion lines
  - Add size variants and accessibility labels
  - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.4_

- [x] 4. Create new cardio activity illustrations
  - Build 3 new cardio illustrations
  - Show dynamic movement and energy
  - Use diverse person components
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 4.1 Create CyclingIllustration
  - Build person on stationary bike
  - Use medium-dark skin tone and average body type
  - Show pedaling motion and proper posture
  - Add size variants and accessibility labels
  - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.4_

- [x] 4.2 Create JumpRopeIllustration
  - Build person jumping rope mid-jump
  - Use light skin tone and slim body type
  - Add jump rope and motion lines
  - Add size variants and accessibility labels
  - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.4_

- [x] 4.3 Create DanceFitnessIllustration
  - Build person in dynamic dance pose
  - Use dark skin tone and plus-size body type
  - Show joyful movement and energy
  - Add size variants and accessibility labels
  - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.4_

- [x] 5. Create new yoga and flexibility illustrations
  - Build 3 new yoga/flexibility illustrations
  - Show proper form and balance
  - Use diverse person components
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 5.1 Create WarriorPoseIllustration
  - Build person in warrior II yoga pose
  - Use medium skin tone and athletic body type
  - Show proper alignment and balance
  - Add size variants and accessibility labels
  - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.4_

- [x] 5.2 Create ChildPoseIllustration
  - Build person in child's pose (resting)
  - Use light-medium skin tone and average body type
  - Show relaxed, restorative position
  - Add size variants and accessibility labels
  - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.4_

- [x] 5.3 Create TreePoseIllustration
  - Build person in tree balance pose
  - Use dark skin tone and slim body type
  - Show balance and focus
  - Add size variants and accessibility labels
  - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.4_

- [x] 6. Create recovery and wellness illustrations
  - Build 2 new recovery/wellness illustrations
  - Show self-care and recovery activities
  - Use diverse person components
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 6.1 Create FoamRollingIllustration
  - Build person using foam roller on leg
  - Use medium-dark skin tone and athletic body type
  - Show proper foam rolling technique
  - Add size variants and accessibility labels
  - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.4_

- [x] 6.2 Create HydrationIllustration
  - Build person drinking water from bottle
  - Use light skin tone and plus-size body type
  - Show healthy hydration habit
  - Add size variants and accessibility labels
  - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.4_

- [x] 7. Create group and community illustrations
  - Build 2 new group/community illustrations
  - Show 4-5 diverse people together
  - Emphasize inclusivity and community
  - _Requirements: 1.4, 2.1, 2.2, 2.3_

- [x] 7.1 Create GroupClassIllustration
  - Build 4-5 people in fitness class setting
  - Use all 5 skin tones across the group
  - Use varied body types (athletic, average, plus-size, slim)
  - Show mixed gender presentation through varied features
  - Add size variants and accessibility labels
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 7.1, 7.4_

- [x] 7.2 Create PartnerWorkoutIllustration
  - Build 2 people working out together
  - Use contrasting skin tones (light and dark)
  - Use different body types (athletic and average)
  - Show collaboration and support
  - Add size variants and accessibility labels
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 7.1, 7.4_

- [x] 8. Create motivational illustrations
  - Build 2 new motivational illustrations
  - Show achievement and goal-setting
  - Use diverse person components
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 8.1 Create CelebrationIllustration
  - Build person in victory/celebration pose
  - Use medium skin tone and average body type
  - Show joy and achievement
  - Add size variants and accessibility labels
  - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.4_

- [x] 8.2 Create GoalSettingIllustration
  - Build person with checklist or goal board
  - Use dark skin tone and slim body type
  - Show planning and determination
  - Add size variants and accessibility labels
  - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.4_

- [x] 9. Integrate illustrations into homepage
  - Replace generic icons with custom illustrations
  - Update hero section with prominent illustration
  - Add illustrations to program cards
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 9.1 Update homepage hero section
  - Replace current hero content with GroupClassIllustration
  - Position illustration alongside headline text
  - Add DecorativeShapes background elements
  - Ensure responsive behavior on mobile
  - _Requirements: 3.1, 3.5, 9.1, 9.2, 9.3, 9.4_

- [x] 9.2 Update Intro Program card
  - Replace lightning bolt icon with CelebrationIllustration
  - Maintain card layout and styling
  - Ensure illustration size is appropriate (w-16 h-16)
  - _Requirements: 3.2, 3.4, 9.1, 9.2, 9.3_

- [x] 9.3 Update Nutrition Program card
  - Replace shopping cart icon with HydrationIllustration
  - Maintain card layout and styling
  - Ensure illustration size is appropriate (w-16 h-16)
  - _Requirements: 3.2, 3.4, 9.1, 9.2, 9.3_

- [x] 9.4 Update Training Program card
  - Keep or enhance WeightLiftingIllustration
  - Maintain card layout and styling
  - Ensure illustration size is appropriate (w-16 h-16)
  - _Requirements: 3.2, 3.4, 9.1, 9.2, 9.3_

- [x] 9.5 Update impact section
  - Replace generic icons with CommunityIllustration
  - Maintain stat display and layout
  - Ensure illustrations don't overwhelm numbers
  - _Requirements: 3.3, 9.1, 9.2, 9.3_

- [x] 9.6 Test homepage responsive behavior
  - Test hero illustration on mobile (< 768px)
  - Test program cards on tablet (768px - 1024px)
  - Test impact section on desktop (> 1024px)
  - Verify all illustrations scale appropriately
  - _Requirements: 3.5, 9.1, 9.2, 9.3, 9.4_

- [x] 10. Integrate illustrations into tools page
  - Map appropriate illustrations to each tool
  - Update tool card components
  - Ensure consistent sizing
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 10.1 Update Energy & Protein Calculator tool
  - Add HydrationIllustration or nutrition-related illustration
  - Update ToolPanel component to accept illustration prop
  - Maintain tool functionality and layout
  - _Requirements: 4.1, 9.1, 9.2_

- [x] 10.2 Update Plate Builder tool
  - Add existing PlateVisual or create enhanced version
  - Ensure illustration complements the interactive plate
  - Maintain tool functionality
  - _Requirements: 4.2, 9.1, 9.2_

- [x] 10.3 Update Heart Rate Zones tool
  - Add RunningIllustration or CyclingIllustration
  - Position illustration in tool header or sidebar
  - Maintain calculator functionality
  - _Requirements: 4.3, 9.1, 9.2_

- [x] 10.4 Update Hydration & Sleep Snapshot tool
  - Add FoamRollingIllustration or recovery illustration
  - Position illustration appropriately
  - Maintain tool functionality
  - _Requirements: 4.4, 9.1, 9.2_

- [x] 10.5 Update Recovery Check-In tool
  - Add ChildPoseIllustration or stretching illustration
  - Position illustration in tool interface
  - Maintain check-in functionality
  - _Requirements: 4.5, 9.1, 9.2_

- [x] 10.6 Update Youth Corner tool
  - Add JumpRopeIllustration or youth-friendly illustration
  - Ensure illustration appeals to younger audience
  - Maintain tool functionality
  - _Requirements: 4.6, 9.1, 9.2_

- [ ] 11. Integrate illustrations into programs page
  - Add unique illustrations to each program card
  - Ensure visual distinction between programs
  - Maintain responsive layout
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 11.1 Update Intro Program card on programs page
  - Add CelebrationIllustration or beginner-friendly illustration
  - Ensure larger size than homepage version
  - Maintain card hover effects and layout
  - _Requirements: 5.1, 5.2, 9.1, 9.2_

- [ ] 11.2 Update Nutrition Program card on programs page
  - Add nutrition-focused illustration
  - Ensure visual consistency with program theme
  - Maintain card hover effects and layout
  - _Requirements: 5.1, 5.3, 9.1, 9.2_

- [ ] 11.3 Update Training Program card on programs page
  - Add strength training illustration (DeadliftIllustration or similar)
  - Ensure visual consistency with program theme
  - Maintain card hover effects and layout
  - _Requirements: 5.1, 5.4, 9.1, 9.2_

- [ ] 11.4 Test programs page responsive behavior
  - Test program cards on mobile, tablet, and desktop
  - Verify illustration sizing across breakpoints
  - Ensure cards maintain visual hierarchy
  - _Requirements: 5.5, 9.1, 9.2, 9.3, 9.4_

- [ ] 12. Integrate illustrations into about page
  - Add community and mission-focused illustrations
  - Enhance values and impact sections
  - Maintain page narrative flow
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 12.1 Update about page mission section
  - Add GroupClassIllustration or CommunityIllustration
  - Position illustration to complement mission text
  - Ensure illustration reinforces inclusivity message
  - _Requirements: 6.1, 6.2, 9.1, 9.2_

- [ ] 12.2 Update about page values section
  - Add PartnerWorkoutIllustration showing collaboration
  - Position illustration near values list
  - Maintain section layout and readability
  - _Requirements: 6.1, 6.3, 9.1, 9.2_

- [ ] 12.3 Update about page impact section
  - Add diverse group illustration
  - Show community engagement visually
  - Complement impact statistics
  - _Requirements: 6.1, 6.4, 9.1, 9.2_

- [ ] 12.4 Test about page responsive behavior
  - Test illustrations on mobile, tablet, and desktop
  - Verify illustrations don't overwhelm text content
  - Ensure page maintains narrative flow
  - _Requirements: 6.5, 9.1, 9.2, 9.3, 9.4_

- [ ] 13. Create illustration showcase component
  - Build development/testing showcase page
  - Display all illustrations with metadata
  - Enable visual regression testing
  - _Requirements: 10.1, 10.2, 10.5_

- [ ] 13.1 Build IllustrationShowcase component
  - Create grid layout displaying all illustrations
  - Show illustration name, category, and description
  - Include size variant toggles (sm, md, lg, xl)
  - Add background color toggles to test contrast
  - _Requirements: 10.1, 10.2, 10.5_

- [ ] 13.2 Create illustration metadata registry
  - Build ILLUSTRATION_REGISTRY with all metadata
  - Include diversity features for each illustration
  - Add recommended use cases
  - Document ARIA labels
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 13.3 Add showcase to development environment
  - Create route at /dev/illustrations (dev only)
  - Ensure showcase is not included in production build
  - Add navigation link in development mode
  - _Requirements: 10.5_

- [ ] 14. Implement accessibility features
  - Add ARIA labels to all illustrations
  - Ensure color contrast compliance
  - Add screen reader descriptions
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 14.1 Add ARIA labels to all illustrations
  - Add role="img" to all SVG elements
  - Add descriptive aria-label attributes
  - Include <title> and <desc> elements in SVGs
  - _Requirements: 7.1, 7.4_

- [ ] 14.2 Verify color contrast ratios
  - Test all skin tones against white background
  - Test all skin tones against cream background
  - Test all skin tones against periwinkle background
  - Ensure all combinations meet WCAG AA standards (4.5:1)
  - _Requirements: 7.2, 7.3_

- [ ] 14.3 Add screen reader support
  - Ensure all illustrations have text alternatives
  - Test with NVDA or JAWS screen reader
  - Verify proper announcement of illustration purpose
  - _Requirements: 7.4, 7.5_

- [ ] 14.4 Test keyboard navigation
  - Verify illustrations don't interfere with keyboard navigation
  - Test focus states on interactive elements containing illustrations
  - Ensure tab order is logical
  - _Requirements: 7.3_

- [ ] 15. Optimize performance
  - Minimize SVG file sizes
  - Implement lazy loading where appropriate
  - Measure bundle size impact
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 15.1 Optimize SVG code
  - Remove unnecessary elements and attributes
  - Simplify paths where possible
  - Ensure each illustration is under 5KB
  - _Requirements: 8.1, 8.4_

- [ ] 15.2 Implement lazy loading for below-fold illustrations
  - Add lazy loading to about page illustrations
  - Add lazy loading to programs page illustrations
  - Ensure hero illustrations load immediately
  - _Requirements: 8.3_

- [ ] 15.3 Measure bundle size impact
  - Run build and measure total bundle size
  - Ensure illustration library adds < 50KB to bundle
  - Identify any optimization opportunities
  - _Requirements: 8.1, 8.4_

- [ ] 15.4 Test mobile performance
  - Test page load times on 3G connection
  - Test rendering performance on low-end devices
  - Verify no jank or layout shifts
  - _Requirements: 8.2, 8.3_

- [ ] 16. Create comprehensive documentation
  - Write usage guide for all illustrations
  - Document design principles
  - Create contribution guidelines
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 16.1 Write illustration usage guide
  - Document how to import and use each illustration
  - Provide code examples for common use cases
  - Explain size variants and customization options
  - Include accessibility best practices
  - _Requirements: 10.1, 10.2, 10.4_

- [ ] 16.2 Document design principles
  - Explain color palette and usage
  - Document diversity guidelines
  - Describe minimalist aesthetic principles
  - Provide examples of good vs. poor usage
  - _Requirements: 10.3, 10.4_

- [ ] 16.3 Create contribution guidelines
  - Document how to create new illustrations
  - Explain modular person component system
  - Provide checklist for new illustration submissions
  - Include testing requirements
  - _Requirements: 10.3, 10.4, 10.5_

- [ ] 16.4 Update VIBRANT_FITNESS_THEME.md
  - Add new illustrations to documentation
  - Update usage examples
  - Document diversity features
  - Add showcase page reference
  - _Requirements: 10.1, 10.2, 10.5_

