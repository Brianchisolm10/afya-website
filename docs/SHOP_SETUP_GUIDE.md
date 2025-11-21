# Shop Setup Guide

## Issue
The shop page (`/shop`) is currently not functional because the Product model doesn't exist in the Prisma schema.

## Solution

### Step 1: Add Product Model to Prisma Schema

Add the following to `prisma/schema.prisma`:

```prisma
// Product Categories
enum ProductCategory {
  APPAREL
  ACCESSORIES
  DROPS
  COLLECTIONS
}

// Shop Products
model Product {
  id              String          @id @default(cuid())
  name            String
  description     String
  price           Float
  category        ProductCategory
  images          String          // JSON array of image URLs
  sizes           String          // JSON array of available sizes
  colors          String          // JSON array of available colors
  inventory       Int             @default(0)
  isActive        Boolean         @default(true)
  isDrop          Boolean         @default(false)
  dropStartDate   DateTime?
  dropEndDate     DateTime?
  slug            String          @unique
  
  // Relations
  orderItems      OrderItem[]
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  @@index([category])
  @@index([slug])
  @@index([isActive])
  @@index([isDrop])
}

// Shopping Cart
model CartItem {
  id              String    @id @default(cuid())
  sessionId       String    // For guest users
  userId          String?   // For logged-in users
  productId       String
  quantity        Int       @default(1)
  size            String?
  color           String?
  donationAmount  Float?    // Optional donation allocation
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([sessionId])
  @@index([userId])
  @@index([productId])
}

// Orders
model Order {
  id                String      @id @default(cuid())
  userId            String?
  email             String
  status            OrderStatus @default(PENDING)
  
  // Totals
  subtotal          Float
  donationAmount    Float       @default(0)
  total             Float
  
  // Shipping
  shippingName      String
  shippingAddress   String
  shippingCity      String
  shippingState     String
  shippingZip       String
  shippingCountry   String      @default("US")
  
  // Payment
  stripePaymentId   String?
  stripeSessionId   String?
  
  // Items
  items             OrderItem[]
  
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  @@index([userId])
  @@index([email])
  @@index([status])
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

model OrderItem {
  id              String    @id @default(cuid())
  orderId         String
  order           Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId       String
  product         Product   @relation(fields: [productId], references: [id])
  
  quantity        Int
  size            String?
  color           String?
  price           Float     // Price at time of purchase
  
  createdAt       DateTime  @default(now())

  @@index([orderId])
  @@index([productId])
}
```

### Step 2: Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Create and run migration
npx prisma migrate dev --name add_shop_models

# Or for production
npx prisma migrate deploy
```

### Step 3: Seed Products

```bash
# Run the product seeding script
npx ts-node prisma/seed-products.ts
```

### Step 4: Restore Shop Page Functionality

Once the schema is updated and migrations are run, restore the original shop page code from git history or implement the full shop functionality.

The shop page should:
1. Fetch products from the database
2. Display products in a grid with filtering
3. Support virtual scrolling for performance
4. Include cart functionality
5. Support Stripe checkout

## Files to Update

1. `prisma/schema.prisma` - Add Product model and related models
2. `app/(public)/shop/page.tsx` - Restore full functionality
3. `components/shop/ShopPageClient.tsx` - Verify it works with new schema
4. `app/api/shop/*` - Verify all shop API routes work

## Testing

After setup:
1. Visit `/shop` to see products
2. Test filtering by category
3. Test adding items to cart
4. Test checkout flow (requires Stripe setup)

## Related Files

- `prisma/seed-products.ts` - Product seeding script
- `components/shop/ShopPageClient.tsx` - Client-side shop component
- `components/shop/ProductCard.tsx` - Product display component
- `app/api/shop/products/route.ts` - Products API
- `app/api/shop/cart/route.ts` - Cart API
- `app/api/shop/checkout/route.ts` - Checkout API

## Notes

- The shop was implemented in Task 7 of the afya-website-v2 spec
- 25% of all purchases go back to the community
- Products support drops (limited edition items)
- Stripe integration is required for payments
