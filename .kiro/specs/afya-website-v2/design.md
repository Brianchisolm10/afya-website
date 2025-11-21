# Design Document

## Overview

AFYA Website V2 is a comprehensive redesign focused on simplifying navigation, reducing content repetition, and introducing community-focused features. The design emphasizes clean, minimal aesthetics with AFYA's signature turquoise and lavender color palette while supporting future growth through modular architecture.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Public Pages Layer                        │ │
│  │  - Home (Redesigned)                                   │ │
│  │  - Programs (New)                                      │ │
│  │  - Shop (New)                                          │ │
│  │  - Impact (New)                                        │ │
│  │  - About, Contact, etc.                                │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Shared Components Layer                      │ │
│  │  - Navigation (Simplified)                             │ │
│  │  - Footer (Expanded)                                   │ │
│  │  - Card Components                                     │ │
│  │  - Counter Components                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              API Routes Layer                          │ │
│  │  - Shop/Products                                       │ │
│  │  - Donations                                           │ │
│  │  - Community Stats                                     │ │
│  │  - Gear Drive Submissions                              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                            │
│  - Products & Inventory                                      │
│  - Orders & Donations                                        │
│  - Community Stats                                           │
│  - Gear Drive Submissions                                    │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Mobile-First**: All components designed for mobile, enhanced for desktop
2. **Component Reusability**: Shared components across all pages
3. **Content Clarity**: Short, scannable text with clear hierarchy
4. **Visual Consistency**: Unified spacing, typography, and color usage
5. **Future-Proof**: Modular architecture supporting planned features

## Data Models

### Enhanced Prisma Schema


```prisma
// Product Management
model Product {
  id                String          @id @default(cuid())
  name              String
  description       String
  price             Float
  category          ProductCategory
  images            String[]        // Array of image URLs
  sizes             String[]        // Available sizes
  colors            String[]        // Available colors
  inventory         Int             @default(0)
  isActive          Boolean         @default(true)
  isDrop            Boolean         @default(false)
  dropStartDate     DateTime?
  dropEndDate       DateTime?
  slug              String          @unique
  
  orders            OrderItem[]
  
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  
  @@index([category, isActive])
  @@index([slug])
}

enum ProductCategory {
  APPAREL
  ACCESSORIES
  DROPS
  COLLECTIONS
}

// Order Management
model Order {
  id                    String              @id @default(cuid())
  orderNumber           String              @unique
  userId                String?
  user                  User?               @relation(fields: [userId], references: [id])
  
  // Customer Info
  customerEmail         String
  customerName          String
  shippingAddress       Json
  
  // Order Details
  items                 OrderItem[]
  subtotal              Float
  tax                   Float
  shipping              Float
  total                 Float
  
  // Donation Allocation (25% of purchase)
  donationAmount        Float
  donationAllocation    DonationAllocation
  
  // Payment
  paymentStatus         PaymentStatus       @default(PENDING)
  paymentIntentId       String?
  
  // Fulfillment
  fulfillmentStatus     FulfillmentStatus   @default(PENDING)
  trackingNumber        String?
  
  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt
  
  @@index([userId])
  @@index([orderNumber])
  @@index([paymentStatus])
}

model OrderItem {
  id                String    @id @default(cuid())
  orderId           String
  order             Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId         String
  product           Product   @relation(fields: [productId], references: [id])
  
  quantity          Int
  size              String?
  color             String?
  priceAtPurchase   Float
  
  createdAt         DateTime  @default(now())
  
  @@index([orderId])
  @@index([productId])
}

enum DonationAllocation {
  FOUNDATIONS
  SPONSOR_A_CLIENT
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}

enum FulfillmentStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

// Community Stats
model CommunityStats {
  id                    String    @id @default(cuid())
  totalMinutesMoved     Int       @default(0)
  totalClientsServed    Int       @default(0)
  totalDonationsRaised  Float     @default(0)
  totalGearDonated      Int       @default(0)
  
  lastUpdated           DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

// Gear Drive Submissions
model GearDriveSubmission {
  id                String              @id @default(cuid())
  
  // Donor Info
  donorName         String
  donorEmail        String
  donorPhone        String?
  
  // Donation Details
  itemTypes         String[]            // e.g., ["shirts", "shorts", "shoes"]
  estimatedQuantity Int
  condition         GearCondition
  notes             String?
  
  // Logistics
  dropoffMethod     DropoffMethod
  preferredDate     DateTime?
  address           Json?               // For pickup requests
  
  // Status
  status            SubmissionStatus    @default(PENDING)
  processedAt       DateTime?
  
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  
  @@index([status])
  @@index([donorEmail])
}

enum GearCondition {
  EXCELLENT
  GOOD
  FAIR
  WORN
}

enum DropoffMethod {
  DROPOFF
  PICKUP
  SHIPPING
}

enum SubmissionStatus {
  PENDING
  CONFIRMED
  SCHEDULED
  COMPLETED
  CANCELLED
}

// Activity Tracking (for Minutes Moved Counter)
model ActivityLog {
  id                String    @id @default(cuid())
  clientId          String
  client            Client    @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  activityType      String    // e.g., "workout", "training", "movement"
  durationMinutes   Int
  date              DateTime
  notes             String?
  
  createdAt         DateTime  @default(now())
  
  @@index([clientId, date])
  @@index([date])
}

// Add to existing Client model
model Client {
  // ... existing fields ...
  activityLogs      ActivityLog[]
}
```

## Components and Interfaces

### Navigation Component

```typescript
interface NavigationProps {
  currentPath: string;
}

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Programs', href: '/programs' },
  { label: 'Shop', href: '/shop' },
  { label: 'Impact', href: '/impact' },
  { label: 'Start', href: '/intake' },
  { label: 'Login', href: '/login' }
];
```

**Responsibilities:**
- Display one-word navigation labels
- Highlight active page
- Responsive mobile menu (hamburger)
- Sticky positioning on scroll
- Smooth transitions

### Footer Component

```typescript
interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterLink {
  label: string;
  href: string;
  comingSoon?: boolean;
  external?: boolean;
}

const footerColumns: FooterColumn[] = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Mission', href: '/about#mission' },
      { label: 'Team', href: '/about#team' },
      { label: 'Careers', href: '/careers' }
    ]
  },
  // ... other columns
];
```

**Responsibilities:**
- Display 5 organized columns (desktop)
- Stack columns on mobile
- Handle "Coming Soon" indicators
- Social media links
- Copyright and legal links

### Program Card Component

```typescript
interface ProgramCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  estimatedTime?: string;
  clientType: ClientType;
}
```

**Responsibilities:**
- Display program information concisely
- Visual gradient backgrounds
- Hover effects
- Link to intake form with pre-selected path
- Responsive sizing

### Product Card Component

```typescript
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    category: ProductCategory;
    isDrop?: boolean;
    dropEndDate?: Date;
  };
  onAddToCart: (productId: string) => void;
}
```

**Responsibilities:**
- Display product image, name, price
- Show "Drop" badge if applicable
- Countdown timer for drops
- Quick add to cart
- Link to product detail page

### Donation Allocation Modal

```typescript
interface DonationAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (allocation: DonationAllocation) => void;
  donationAmount: number;
}

interface AllocationOption {
  value: DonationAllocation;
  title: string;
  description: string;
  icon: React.ReactNode;
}
```

**Responsibilities:**
- Present two allocation options clearly
- Explain 25% donation amount
- Visual selection feedback
- Confirm and close
- Accessible keyboard navigation

### Community Minutes Counter

```typescript
interface CommunityCounterProps {
  initialCount: number;
  animationDuration?: number;
}
```

**Responsibilities:**
- Display large, prominent counter
- Animate count-up on page load
- Real-time updates via WebSocket or polling
- Contextual explanation text
- Responsive sizing

### Impact Section Card

```typescript
interface ImpactSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  stats?: ImpactStat[];
  ctaLabel?: string;
  ctaHref?: string;
  comingSoon?: boolean;
}

interface ImpactStat {
  label: string;
  value: string | number;
  suffix?: string;
}
```

**Responsibilities:**
- Display impact initiative information
- Show statistics if available
- Call-to-action button
- "Coming Soon" state
- Consistent card styling

## Page Designs

### Home Page (Redesigned)

**Structure:**
1. Hero Section
   - Single impactful headline
   - Community Minutes Moved counter
   - Primary CTA: "Start Your Journey"

2. Programs Preview
   - 3-card grid showcasing top programs
   - "View All Programs" link

3. Shop Preview
   - Featured products carousel
   - "Shop Now" CTA

4. Impact Highlight
   - Quick stats (clients served, donations raised)
   - "See Our Impact" link

5. Testimonial/Success Story
   - Single rotating testimonial
   - Clean, minimal design

**Content Guidelines:**
- Hero headline: 8-12 words max
- Section descriptions: 2-3 sentences
- No repeated mission statements
- Focus on action and impact

### Programs Page (New)

**Structure:**
1. Page Header
   - Title: "Our Programs"
   - Subtitle: "Choose the path that fits your goals"

2. Program Grid
   - 7 program cards in responsive grid
   - Each card: Icon, Title, 2-3 sentence description, CTA

3. Future Programs Section
   - Placeholder cards for upcoming programs
   - "More coming soon" messaging

**Program Descriptions (Max 3 sentences each):**
- **Intro**: Get started with personalized wellness guidance. Perfect for beginners exploring health and fitness. Quick assessment, clear next steps.

- **Nutrition**: Custom meal plans tailored to your goals and preferences. Learn sustainable eating habits. Achieve your nutrition targets.

- **Training**: Structured workout programs designed for your fitness level. Build strength, endurance, and confidence. Train smarter, not harder.

- **Athlete**: Performance-focused programming for competitive athletes. Sport-specific training and nutrition. Elevate your game.

- **Youth**: Age-appropriate fitness and nutrition for young athletes. Safe, fun, and effective. Build healthy habits early.

- **Recovery**: Specialized guidance for injury recovery and rehabilitation. Safe movement patterns and progressive protocols. Return to activity confidently.

- **Movement Needs**: Modified programs for chronic conditions or limitations. Adaptive exercises and supportive guidance. Move better, feel better.

### Shop Page (New)

**Structure:**
1. Page Header
   - Title: "Shop AFYA"
   - Subtitle: "Support the movement. 25% of every purchase funds community programs."

2. Category Filter
   - Tabs or pills: All, Apparel, Accessories, Drops, Collections

3. Product Grid
   - Responsive grid (4 cols desktop, 2 cols tablet, 1 col mobile)
   - Product cards with images, names, prices

4. Product Detail Modal/Page
   - Large images
   - Size/color selection
   - Add to cart
   - Product description

5. Cart & Checkout
   - Cart summary
   - Donation allocation step
   - Stripe checkout integration

**Donation Allocation Flow:**
```
Add to Cart → View Cart → Proceed to Checkout → 
Select Donation Allocation (Modal) → Payment → Confirmation
```

### Impact Page (New)

**Structure:**
1. Page Header
   - Title: "Our Impact"
   - Community Minutes Moved counter (large, prominent)
   - Subtitle: "Movement for Everyone, powered by community"

2. Impact Sections (4 cards)
   
   **A. Donations**
   - Icon: Heart or hands
   - Description: How funds are used
   - Stats: Total raised, clients helped
   - CTA: "Donate Now"
   
   **B. Sponsor-A-Client**
   - Icon: People or community
   - Description: Fund packets for those in need
   - Stats: Clients sponsored, active sponsors
   - CTA: "Become a Sponsor"
   
   **C. Gear Drive** (ACTIVE)
   - Icon: Recycling or clothing
   - Description: Donate used workout gear
   - Stats: Items collected, pounds recycled
   - CTA: "Donate Gear" (opens form)
   
   **D. Equipment Donation** (COMING SOON)
   - Icon: Dumbbell or equipment
   - Description: Future program for workout equipment
   - Badge: "Coming Soon"
   - No CTA (grayed out)

3. Community Stats Dashboard
   - Visual metrics
   - Charts or counters
   - Updated regularly

**Gear Drive Form:**
```typescript
interface GearDriveFormData {
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  itemTypes: string[];
  estimatedQuantity: number;
  condition: GearCondition;
  dropoffMethod: DropoffMethod;
  preferredDate?: Date;
  address?: Address;
  notes?: string;
}
```

## API Endpoints

### Shop & Products

```typescript
// GET /api/shop/products
// Query params: category, search, limit, offset
interface ProductListResponse {
  products: Product[];
  total: number;
  hasMore: boolean;
}

// GET /api/shop/products/[slug]
interface ProductDetailResponse {
  product: Product;
  relatedProducts: Product[];
}

// POST /api/shop/cart
interface AddToCartRequest {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

// POST /api/shop/checkout
interface CheckoutRequest {
  items: CartItem[];
  donationAllocation: DonationAllocation;
  shippingAddress: Address;
  customerInfo: CustomerInfo;
}

interface CheckoutResponse {
  orderId: string;
  paymentIntentId: string;
  clientSecret: string;
}
```

### Community Stats

```typescript
// GET /api/community/stats
interface CommunityStatsResponse {
  totalMinutesMoved: number;
  totalClientsServed: number;
  totalDonationsRaised: number;
  totalGearDonated: number;
  lastUpdated: string;
}

// POST /api/community/activity
// (Called by client dashboard when logging activity)
interface LogActivityRequest {
  clientId: string;
  activityType: string;
  durationMinutes: number;
  date: string;
}
```

### Gear Drive

```typescript
// POST /api/impact/gear-drive
interface GearDriveSubmissionRequest {
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  itemTypes: string[];
  estimatedQuantity: number;
  condition: GearCondition;
  dropoffMethod: DropoffMethod;
  preferredDate?: string;
  address?: Address;
  notes?: string;
}

interface GearDriveSubmissionResponse {
  submissionId: string;
  confirmationNumber: string;
  message: string;
}
```

### Donations

```typescript
// POST /api/impact/donate
interface DonationRequest {
  amount: number;
  donorName: string;
  donorEmail: string;
  allocation: DonationAllocation;
  isRecurring?: boolean;
}

interface DonationResponse {
  donationId: string;
  paymentIntentId: string;
  clientSecret: string;
}
```

## Styling & Design System

### Color Palette

```css
/* Primary Colors */
--afya-turquoise: #40E0D0;
--afya-turquoise-light: #7FFFD4;
--afya-turquoise-dark: #20B2AA;

/* Secondary Colors */
--afya-lavender: #9370DB;
--afya-lavender-light: #DDA0DD;
--afya-lavender-dark: #8A2BE2;

/* Neutral Colors */
--afya-grey: #6b7280;
--afya-grey-light: #9ca3af;
--afya-grey-dark: #4b5563;

/* Semantic Colors */
--afya-success: #10b981;
--afya-warning: #f59e0b;
--afya-error: #ef4444;
--afya-info: #3b82f6;

/* Background */
--afya-bg-light: #f9fafb;
--afya-bg-white: #ffffff;
```

### Typography Scale

```css
/* Headings */
--text-5xl: 3rem;      /* 48px - Hero */
--text-4xl: 2.25rem;   /* 36px - Page Title */
--text-3xl: 1.875rem;  /* 30px - Section Title */
--text-2xl: 1.5rem;    /* 24px - Card Title */
--text-xl: 1.25rem;    /* 20px - Subheading */

/* Body */
--text-lg: 1.125rem;   /* 18px - Large body */
--text-base: 1rem;     /* 16px - Body */
--text-sm: 0.875rem;   /* 14px - Small text */
--text-xs: 0.75rem;    /* 12px - Caption */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing Scale

```css
/* Consistent spacing */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

### Component Patterns

**Card Component:**
```css
.card {
  background: var(--afya-bg-white);
  border-radius: 1rem;
  padding: var(--space-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

**Button Component:**
```css
.button-primary {
  background: linear-gradient(135deg, var(--afya-turquoise), var(--afya-lavender));
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-weight: var(--font-semibold);
  transition: opacity 0.2s;
}

.button-primary:hover {
  opacity: 0.9;
}
```

## Performance Optimization

### Image Optimization
- Use Next.js Image component
- Lazy load below-the-fold images
- WebP format with fallbacks
- Responsive image sizes

### Code Splitting
- Dynamic imports for modals
- Route-based code splitting
- Lazy load heavy components (charts, counters)

### Caching Strategy
- Static page generation where possible
- ISR for product pages (revalidate: 60)
- API route caching for stats
- CDN for static assets

## Payment Integration

### Stripe Payment Methods

AFYA will use Stripe as the primary payment processor, which provides comprehensive payment method support at no monthly cost (pay-per-transaction: 2.9% + $0.30).

**Supported Payment Methods (All Included):**
- **Credit/Debit Cards**: Visa, Mastercard, Amex, Discover
- **Apple Pay**: Automatic on Safari/iOS devices
- **Google Pay**: Automatic on Chrome/Android devices
- **Link by Stripe**: One-click checkout for returning customers

**Implementation Approach:**
- Use Stripe Payment Element for unified payment UI
- Automatically displays available payment methods based on customer's device/browser
- Single integration handles all payment types
- No additional configuration needed for Apple Pay/Google Pay

**Pricing:**
- No setup fees or monthly costs
- 2.9% + $0.30 per successful transaction
- Same rate for all payment methods
- Example: $50 sale = $1.75 fee, you receive $48.25

**Future Consideration:**
- PayPal can be added separately if demand warrants (2.99% + $0.49 per transaction)
- Currently not included to maintain simplicity and unified payment experience

### Stripe Configuration

**Environment Variables:**
```env
STRIPE_SECRET_KEY=sk_test_... (development) / sk_live_... (production)
STRIPE_PUBLISHABLE_KEY=pk_test_... (development) / pk_live_... (production)
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://afya.com
```

**Required Setup:**
1. Create Stripe account (free)
2. Obtain API keys from Stripe Dashboard
3. Configure webhook endpoint for order updates
4. Test in Stripe test mode before going live

## Security Considerations

### Payment Processing
- Stripe integration for PCI compliance
- No card data stored locally
- Webhook verification for order updates
- Secure checkout flow
- Payment Element handles all payment method security

### Data Protection
- Sanitize all user inputs
- Rate limiting on forms
- CSRF protection
- Secure donation allocation storage

## Testing Strategy

### Unit Tests
- Component rendering
- Form validation
- Utility functions
- API route handlers

### Integration Tests
- Checkout flow
- Donation allocation
- Gear drive submission
- Stats updates

### E2E Tests
- Complete purchase flow
- Navigation across pages
- Mobile responsiveness
- Form submissions

## Deployment Considerations

### Environment Variables
```
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SHOP_ENABLED=true
NEXT_PUBLIC_GEAR_DRIVE_ENABLED=true
```

### Database Migrations
- Add Product, Order, OrderItem tables
- Add CommunityStats table
- Add GearDriveSubmission table
- Add ActivityLog table
- Update Client model

### Feature Flags
- Shop enabled/disabled
- Gear Drive enabled/disabled
- Equipment Donation visible/hidden
- Donation allocation required/optional

## Future Enhancements

### Phase 2 Features
- Client subscriptions (recurring packets)
- Merchandise drops with countdown
- Sponsor dashboard
- Event management
- Local chapters
- Educational modules

### Analytics & Tracking
- Product view tracking
- Conversion funnel analysis
- Donation allocation preferences
- Community engagement metrics
- A/B testing framework

This design provides a solid foundation for AFYA Website V2 while maintaining flexibility for future growth and community initiatives.
