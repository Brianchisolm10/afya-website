# Implementation Plan

## Overview
This implementation plan breaks down the AFYA Website V2 development into discrete, manageable coding tasks. Each task builds incrementally on previous work and focuses on implementing specific features from the requirements and design documents.

## Task List

- [x] 1. Database Schema Updates
- [x] 1.1 Add Product and Order models to Prisma schema
  - Create Product model with fields: name, description, price, category, images, sizes, colors, inventory, isDrop, dropStartDate, dropEndDate, slug
  - Create Order model with customer info, items, donation allocation, payment status, fulfillment status
  - Create OrderItem model linking orders to products
  - Add enums: ProductCategory, DonationAllocation, PaymentStatus, FulfillmentStatus
  - _Requirements: 4, 5_

- [x] 1.2 Add Community Stats and Activity Tracking models
  - Create CommunityStats model with totalMinutesMoved, totalClientsServed, totalDonationsRaised, totalGearDonated
  - Create ActivityLog model with clientId, activityType, durationMinutes, date
  - Add activityLogs relation to Client model
  - _Requirements: 30_

- [x] 1.3 Add Gear Drive Submission model
  - Create GearDriveSubmission model with donor info, item details, logistics, status
  - Add enums: GearCondition, DropoffMethod, SubmissionStatus
  - _Requirements: 9_

- [x] 1.4 Run database migrations
  - Generate Prisma migration for all new models
  - Apply migration to development database
  - Verify schema changes
  - _Requirements: All database requirements_

- [ ] 2. Simplified Navigation Component
- [ ] 2.1 Update Navigation component with complete one-word labels
  - Add missing "Start" navigation item (currently has Home, Programs, Shop, Impact, Login)
  - Verify active state highlighting works correctly
  - Verify sticky positioning on scroll
  - Verify smooth transitions
  - _Requirements: 1_

- [x] 2.2 Implement responsive mobile navigation
  - Create hamburger menu for mobile
  - Add slide-in menu animation
  - Ensure touch-friendly tap targets (44x44px minimum)
  - Test on mobile devices
  - _Requirements: 1, 20_

- [x] 2.3 Update layout to use new navigation
  - Replace existing navigation in app/(public)/layout.tsx
  - Ensure navigation works across all pages
  - Test navigation state persistence
  - _Requirements: 1, 22_

- [x] 3. Expanded Footer Component
- [x] 3.1 Create Footer component with 5-column layout
  - Implement Company column (About, Mission, Team, Careers)
  - Implement Programs column (all 7 programs)
  - Implement Shop column (Apparel, Accessories, Drops, Support)
  - Implement Impact column (Donate, Sponsor, Gear Drive, Equipment Coming Soon, Foundations)
  - Implement Support column (FAQ, Contact, Help, Policies, Privacy, Terms, Refunds)
  - _Requirements: 12, 13, 14, 15, 16, 17_

- [x] 3.2 Implement responsive footer stacking
  - Stack columns vertically on mobile
  - Maintain readability and spacing
  - Test on various screen sizes
  - _Requirements: 12, 20_

- [x] 3.3 Add footer styling with AFYA aesthetic
  - Apply turquoise and lavender accents
  - Add hover states for links
  - Include social media icons
  - Add copyright and legal text
  - _Requirements: 12_

- [x] 4. Reusable Component Library
- [x] 4.1 Create Card component with variants
  - Implement base Card component
  - Add variants: elevated, flat, hover
  - Add consistent padding and border radius
  - _Requirements: 18, 19_

- [x] 4.2 Create Button component with variants
  - Implement primary, secondary, outline variants
  - Add loading state
  - Add disabled state
  - Ensure consistent sizing and spacing
  - _Requirements: 18_

- [x] 4.3 Create Section component for page layouts
  - Implement consistent section spacing
  - Add background color variants
  - Add container width management
  - _Requirements: 18, 19_

- [x] 5. Home Page Redesign
- [x] 5.1 Redesign Hero section
  - Create single impactful headline (8-12 words)
  - Add Community Minutes Moved counter (placeholder)
  - Add primary CTA button: "Start Your Journey"
  - Remove repetitive mission statements
  - _Requirements: 2, 30_

- [x] 5.2 Create Programs Preview section
  - Display 3 featured program cards
  - Add "View All Programs" link
  - Use short descriptions (2-3 sentences max)
  - _Requirements: 2, 11_

- [x] 5.3 Create Shop Preview section
  - Add featured products carousel (placeholder)
  - Add "Shop Now" CTA
  - Use clean, minimal design
  - _Requirements: 2_

- [x] 5.4 Create Impact Highlight section
  - Display quick stats (clients served, donations raised)
  - Add "See Our Impact" link
  - Use visual counters or metrics
  - _Requirements: 2_

- [x] 5.5 Add Testimonial section
  - Create single rotating testimonial component
  - Use clean, minimal design
  - Add navigation dots
  - _Requirements: 2, 11_

- [x] 6. Programs Page Implementation
- [x] 6.1 Create Programs page structure
  - Create app/(public)/programs/page.tsx
  - Add page header with title and subtitle
  - Implement responsive grid layout
  - _Requirements: 3_

- [x] 6.2 Create ProgramCard component
  - Implement card with icon, title, description, CTA
  - Add gradient backgrounds
  - Add hover effects
  - Limit descriptions to 2-3 sentences
  - _Requirements: 3, 18_

- [x] 6.3 Add all 7 program cards
  - Intro program card
  - Nutrition program card
  - Training program card
  - Athlete program card
  - Youth program card
  - Recovery program card
  - Movement Needs program card
  - _Requirements: 3_

- [x] 6.4 Add future programs placeholder section
  - Create placeholder cards for upcoming programs
  - Add "More coming soon" messaging
  - Use consistent styling
  - _Requirements: 3_

- [x] 6.5 Link program cards to intake form
  - Add links with pre-selected client type
  - Test navigation flow
  - _Requirements: 3_

- [x] 7. Shop Page Foundation
- [x] 7.1 Create Shop page structure
  - Create app/(public)/shop/page.tsx
  - Add page header with title and subtitle
  - Implement category filter tabs
  - _Requirements: 4_

- [x] 7.2 Create ProductCard component
  - Display product image, name, price
  - Add "Drop" badge for limited items
  - Add countdown timer for active drops
  - Add quick "Add to Cart" button
  - _Requirements: 4_

- [x] 7.3 Implement product grid layout
  - Responsive grid (4 cols desktop, 2 tablet, 1 mobile)
  - Add loading states
  - Add empty state
  - _Requirements: 4, 20_

- [x] 7.4 Create product filtering system
  - Filter by category (All, Apparel, Accessories, Drops, Collections)
  - Update URL with filter params
  - Maintain filter state
  - _Requirements: 4_

- [x] 8. Shop API Endpoints
- [x] 8.1 Create products API endpoint
  - Implement GET /api/shop/products
  - Add query params: category, search, limit, offset
  - Return paginated product list
  - _Requirements: 4_

- [x] 8.2 Create product detail API endpoint
  - Implement GET /api/shop/products/[slug]
  - Return product details and related products
  - _Requirements: 4_

- [x] 8.3 Create cart management endpoints
  - Implement POST /api/shop/cart (add to cart)
  - Implement GET /api/shop/cart (get cart)
  - Implement DELETE /api/shop/cart/[itemId] (remove from cart)
  - _Requirements: 4_

- [x] 9. Product Management
- [x] 9.1 Create product seed data
  - Add sample products for each category
  - Include product images (placeholders or real)
  - Set up initial inventory
  - _Requirements: 4_

- [x] 9.2 Create admin product management UI
  - Create admin page for adding/editing products
  - Add image upload functionality
  - Add inventory management
  - _Requirements: 4_

- [x] 10. Donation Allocation Feature
- [x] 10.1 Create DonationAllocationModal component
  - Display two allocation options: Foundations, Sponsor-A-Client
  - Show 25% donation amount
  - Add visual selection feedback
  - Implement accessible keyboard navigation
  - _Requirements: 5_

- [x] 10.2 Integrate modal into checkout flow
  - Trigger modal after "Proceed to Checkout"
  - Store allocation choice in order
  - Prevent checkout without selection
  - _Requirements: 5_

- [x] 10.3 Add allocation to order confirmation
  - Display selected allocation in confirmation email
  - Show allocation in order details
  - _Requirements: 5_

- [x] 11. Stripe Payment Integration
- [x] 11.1 Set up Stripe configuration
  - Install Stripe SDK
  - Configure API keys in environment variables
  - Set up webhook endpoint
  - _Requirements: 4_

- [x] 11.2 Create checkout API endpoint
  - Implement POST /api/shop/checkout
  - Create Stripe PaymentIntent
  - Return client secret
  - _Requirements: 4_

- [x] 11.3 Implement checkout page
  - Create app/(public)/shop/checkout/page.tsx
  - Add Stripe Elements for payment
  - Handle payment confirmation
  - Redirect to success page
  - _Requirements: 4_

- [x] 11.4 Create order confirmation page
  - Display order summary
  - Show donation allocation
  - Send confirmation email
  - _Requirements: 4, 5_

- [x] 12. Impact Page Implementation
- [x] 12.1 Create Impact page structure
  - Create app/(public)/impact/page.tsx
  - Add page header with title
  - Add Community Minutes Moved counter (prominent)
  - Create ImpactSectionCard component for reusable section display
  - _Requirements: 6, 30_

- [x] 12.2 Implement Donations section
  - Explain fund usage
  - Display donation stats from CommunityStats
  - Add "Donate Now" CTA
  - _Requirements: 7_

- [x] 12.3 Implement Sponsor-A-Client section
  - Explain sponsorship program
  - Display sponsorship stats
  - Add "Become a Sponsor" CTA
  - _Requirements: 8_

- [x] 12.4 Implement Gear Drive section (ACTIVE)
  - Explain gear donation program
  - List use cases (recycling, upcycling, redistribution, community events)
  - Display gear drive stats
  - Add "Donate Gear" CTA (opens form)
  - _Requirements: 9_

- [x] 12.5 Implement Equipment Donation section (COMING SOON)
  - Add "Coming Soon" badge
  - Display placeholder text
  - Use grayed-out styling
  - No functional CTA
  - _Requirements: 10_

- [x] 13. Community Minutes Moved Counter
- [x] 13.1 Create CommunityCounter component
  - Display large, prominent counter
  - Implement count-up animation on load
  - Add contextual explanation text
  - Make responsive (smaller on mobile)
  - _Requirements: 30_

- [x] 13.2 Create community stats API endpoint
  - Implement GET /api/community/stats
  - Return totalMinutesMoved and other stats
  - Cache response for performance
  - _Requirements: 30_

- [x] 13.3 Implement real-time updates
  - Add WebSocket or polling for live updates
  - Update counter without page refresh
  - _Requirements: 30_

- [x] 13.4 Create activity logging API endpoint
  - Implement POST /api/community/activity
  - Accept activity logs from client dashboard
  - Update CommunityStats aggregate
  - _Requirements: 30_

- [x] 14. Gear Drive Form and Submission
- [x] 14.1 Create GearDriveForm component
  - Add fields: donor info, item types, quantity, condition, dropoff method
  - Implement form validation
  - Add date picker for preferred date
  - Conditional address field for pickup
  - _Requirements: 9_

- [x] 14.2 Create gear drive submission API endpoint
  - Implement POST /api/impact/gear-drive
  - Validate submission data
  - Store in database
  - Send confirmation email
  - _Requirements: 9_

- [x] 14.3 Create submission confirmation page
  - Display confirmation number
  - Show submission details
  - Provide next steps
  - _Requirements: 9_

- [x] 15. Donation System
- [x] 15.1 Create donation API endpoint
  - Implement POST /api/impact/donate
  - Integrate with Stripe for payment
  - Support one-time and recurring donations
  - _Requirements: 7_

- [x] 15.2 Create donation form/page
  - Add amount selection
  - Add donor information fields
  - Add allocation selection
  - Integrate Stripe payment
  - _Requirements: 7_

- [x] 15.3 Create donation confirmation
  - Display donation receipt
  - Send confirmation email
  - Show tax deduction information
  - _Requirements: 7_

- [x] 16. Content Refinement Across Pages
- [x] 16.1 Audit and reduce repetitive content
  - Review all pages for duplicate mission statements
  - Consolidate repeated messaging
  - _Requirements: 11_

- [x] 16.2 Shorten long paragraphs
  - Break paragraphs longer than 4 sentences
  - Use bullet points where appropriate
  - Improve scannability
  - _Requirements: 11, 21_

- [x] 16.3 Update language for accessibility
  - Ensure friendly tone for youth, adults, athletes
  - Remove jargon
  - Use clear, simple language
  - _Requirements: 11_

- [x] 16.4 Update About page content
  - Reduce content length
  - Add section cards
  - Update mission statement
  - _Requirements: 2, 11_

- [x] 16.5 Update Services page content
  - Review and update content to avoid duplication with Programs page
  - Ensure clear differentiation or consolidation
  - _Requirements: 11_

- [x] 17. Mobile Optimization
- [x] 17.1 Test all pages on mobile devices
  - Test on iOS Safari
  - Test on Android Chrome
  - Test on various screen sizes (320px - 768px)
  - _Requirements: 20_

- [x] 17.2 Optimize touch targets
  - Ensure all buttons/links are 44x44px minimum
  - Add appropriate spacing between interactive elements
  - _Requirements: 20_

- [x] 17.3 Fix mobile-specific issues
  - Address any layout breaks
  - Fix overflow issues
  - Optimize font sizes for readability
  - _Requirements: 20_

- [x] 18. Typography and Spacing Consistency
- [x] 18.1 Implement typography scale
  - Define CSS variables for text sizes
  - Apply consistent heading hierarchy
  - Ensure readable line lengths (60-80 characters)
  - _Requirements: 19_

- [x] 18.2 Implement spacing scale
  - Define CSS variables for spacing
  - Apply consistent section spacing
  - Ensure consistent component padding/margins
  - _Requirements: 19_

- [x] 18.3 Audit and fix inconsistencies
  - Review all pages for typography consistency
  - Fix spacing inconsistencies
  - _Requirements: 19_

- [x] 19. Performance Optimization
- [x] 19.1 Optimize images
  - Convert images to WebP format
  - Implement lazy loading
  - Use Next.js Image component
  - Add responsive image sizes
  - _Requirements: Performance section_

- [x] 19.2 Implement code splitting
  - Dynamic imports for modals
  - Lazy load heavy components
  - Route-based code splitting
  - _Requirements: Performance section_

- [x] 19.3 Add caching strategies
  - Implement ISR for product pages
  - Cache API responses
  - Add CDN for static assets
  - _Requirements: Performance section_

- [x] 20. Testing
- [x] 20.1 Write unit tests for components
  - Test Card component variants
  - Test Button component states
  - Test form validation
  - _Requirements: Testing section_

- [x] 20.2 Write integration tests
  - Test checkout flow
  - Test donation allocation
  - Test gear drive submission
  - _Requirements: Testing section_

- [x] 20.3 Write E2E tests
  - Test complete purchase flow
  - Test navigation across pages
  - Test form submissions
  - _Requirements: Testing section_

- [x] 21. Documentation
- [x] 21.1 Update README with new features
  - Document Shop setup
  - Document Stripe configuration
  - Document new environment variables
  - _Requirements: All_

- [x] 21.2 Create admin guide for shop management
  - Document product management
  - Document order fulfillment
  - Document gear drive management
  - _Requirements: 4, 9_

- [x] 21.3 Update user guide
  - Document new navigation
  - Document shop usage
  - Document impact programs
  - _Requirements: All_

- [x] 22. Deployment Preparation
- [x] 22.1 Set up environment variables
  - Add Stripe keys
  - Add feature flags
  - Configure production settings
  - _Requirements: Deployment section_

- [x] 22.2 Run database migrations in production
  - Backup production database
  - Apply migrations
  - Verify schema changes
  - _Requirements: All database requirements_

- [x] 22.3 Seed initial data
  - Add initial products
  - Initialize CommunityStats
  - Add placeholder content
  - _Requirements: 4, 30_

- [x] 22.4 Test in staging environment
  - Full end-to-end testing
  - Payment flow testing
  - Mobile testing
  - _Requirements: All_

- [x] 23. Future-Proofing Setup
- [x] 23.1 Add subscription infrastructure
  - Add subscription fields to Product model
  - Add recurring payment support
  - Document subscription requirements
  - _Requirements: 23_

- [x] 23.2 Add drop management infrastructure
  - Add drop scheduling fields
  - Add countdown timer component
  - Add notification signup
  - _Requirements: 24_

- [x] 23.3 Add sponsorship dashboard placeholders
  - Create sponsor account schema
  - Add dashboard route placeholders
  - Document sponsorship requirements
  - _Requirements: 25_

- [x] 23.4 Add event management placeholders
  - Create event schema
  - Add event listing page placeholder
  - Document event requirements
  - _Requirements: 27_

- [x] 23.5 Add chapter management placeholders
  - Create chapter schema
  - Add location-based filtering
  - Document chapter requirements
  - _Requirements: 28_

- [x] 23.6 Add educational module placeholders
  - Create content schema
  - Add course navigation components
  - Document education requirements
  - _Requirements: 29_

## Notes

- Each task should be completed and tested before moving to the next
- Refer to requirements.md and design.md for detailed specifications
- Use existing AFYA design system (turquoise & lavender theme)
- Maintain mobile-first approach throughout development
- Test on multiple devices and browsers regularly
