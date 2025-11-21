# AFYA Website V2

A Next.js application for AFYA - Movement for Everyone. This application combines a public marketing site with an authenticated client portal for managing personalized health and fitness packets, plus community-focused features including an e-commerce shop, impact programs, and real-time community engagement tracking.

## Features

### Core Features
- 🏠 Public marketing pages with AFYA mission and services
- 📝 Dynamic intake form system with multiple program paths
- 🔐 Email-based authentication (magic links and password)
- 👥 Account management system with role-based access control
- 📊 Client dashboard with packet status tracking
- 👨‍💼 Admin panel for managing clients, team members, and content
- 🔗 Webhook integration with Google Apps Script
- 📱 Fully responsive, mobile-first design

### V2 New Features
- 🛍️ **Shop**: E-commerce platform for AFYA merchandise with Stripe integration
- 💝 **Donation Allocation**: 25% of every purchase supports Foundations or Sponsor-A-Client programs
- 🌍 **Impact Page**: Showcase community initiatives including donations, sponsorships, and gear drives
- ♻️ **Gear Drive**: Active program for donating used workout clothing
- 📈 **Community Minutes Moved Counter**: Real-time tracking of total movement across all clients
- 🎯 **Programs Page**: Comprehensive display of all 7 AFYA wellness programs
- 🎨 **Enhanced Navigation & Footer**: Simplified navigation with expanded footer organization
- 💳 **Stripe Payment Processing**: Secure checkout with support for cards, Apple Pay, and Google Pay

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- SMTP server for sending emails (Gmail, SendGrid, Resend, etc.)
- Stripe account (for shop functionality) - [Sign up free](https://stripe.com)

### Local Development Setup

1. **Clone the repository and install dependencies:**

```bash
git clone <repository-url>
cd afya-website
npm install
```

2. **Set up environment variables:**

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database - Use your local PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/afya?schema=public"

# NextAuth - For local development
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Email Provider - Configure your SMTP server
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@afya.com"

# Webhook - Generate a secure secret
WEBHOOK_SECRET="generate-with-openssl-rand-base64-32"

# Stripe - Get from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY="sk_test_..." # Use sk_test_ for development
STRIPE_PUBLISHABLE_KEY="pk_test_..." # Use pk_test_ for development
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." # Same as above, for client-side
STRIPE_WEBHOOK_SECRET="whsec_..." # Get from Stripe webhook settings

# Feature Flags (optional)
NEXT_PUBLIC_SHOP_ENABLED="true"
NEXT_PUBLIC_GEAR_DRIVE_ENABLED="true"
```

**Generate secure secrets:**

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate WEBHOOK_SECRET
openssl rand -base64 32
```

**Set up Stripe (for shop functionality):**

1. Create a free Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. For development, use test mode keys (they start with `sk_test_` and `pk_test_`)
4. For production, use live mode keys (they start with `sk_live_` and `pk_live_`)
5. Set up a webhook endpoint (see Stripe Configuration section below)

For detailed Stripe setup instructions, see [docs/STRIPE_SETUP_GUIDE.md](./docs/STRIPE_SETUP_GUIDE.md)

3. **Set up the database:**

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev --name init
```

Generate Prisma Client:

```bash
npx prisma generate
```

4. **Seed initial data:**

Create your first admin user:

```bash
npm run seed:admin
```

Seed community stats (for Community Minutes Moved counter):

```bash
npx tsx scripts/seed-community-stats.ts
```

Seed sample products (optional, for testing shop):

```bash
npx tsx prisma/seed-products.ts
```

Or using npx directly:

```bash
npx tsx scripts/seed-admin.ts
```

The script will prompt you for:
- Admin email address
- Password (hidden input)
- Password confirmation

The password must meet these requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

Alternatively, you can provide credentials as command-line arguments:

```bash
npm run seed:admin admin@example.com SecurePassword123 "Admin User"
```

**Note**: For security, it's recommended to run without arguments and enter the password interactively.

5. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Login as admin:**

- Go to [http://localhost:3000/login](http://localhost:3000/login)
- Enter your admin email and password
- Access the admin panel at [http://localhost:3000/admin/users](http://localhost:3000/admin/users)

7. **(Optional) View your database:**

Open Prisma Studio to view and edit your database:

```bash
npx prisma studio
```

## Project Structure

```
afya-website/
├── app/
│   ├── (public)/          # Public marketing pages
│   │   ├── programs/      # Programs listing page
│   │   ├── shop/          # Shop pages (products, checkout, orders)
│   │   ├── impact/        # Impact page with community initiatives
│   │   └── ...            # Other public pages
│   ├── (auth)/            # Authentication pages (login, setup, reset-password)
│   ├── (protected)/       # Protected client portal pages
│   │   ├── admin/         # Admin panel
│   │   │   ├── users/     # User management
│   │   │   ├── products/  # Product management
│   │   │   ├── content/   # Content management
│   │   │   └── analytics/ # Analytics dashboard
│   │   ├── dashboard/     # Client dashboard
│   │   └── settings/      # User profile settings
│   └── api/               # API routes
│       ├── admin/         # Admin endpoints
│       ├── auth/          # Auth endpoints
│       ├── shop/          # Shop endpoints (products, cart, checkout)
│       ├── impact/        # Impact endpoints (donations, gear drive)
│       ├── community/     # Community stats and activity
│       └── webhooks/      # Webhook handlers (Stripe)
├── components/            # Reusable React components
│   ├── admin/             # Admin-specific components
│   ├── auth/              # Auth components
│   ├── shop/              # Shop components (ProductCard, CheckoutForm, etc.)
│   ├── impact/            # Impact components (DonationForm, GearDriveForm, etc.)
│   ├── community/         # Community components (CommunityCounter)
│   ├── programs/          # Program components (ProgramCard)
│   ├── layout/            # Layout components (Navigation, Footer)
│   ├── settings/          # Profile settings components
│   └── ui/                # Shared UI components
├── lib/                   # Utility functions and configurations
│   ├── auth.ts            # NextAuth configuration
│   ├── authorization.ts   # Role-based access control
│   ├── stripe.ts          # Stripe configuration
│   ├── cache.ts           # Caching utilities
│   ├── email.ts           # Email sending utilities
│   └── ...                # Other utilities
├── types/                 # TypeScript type definitions
├── prisma/                # Database schema and migrations
│   └── schema.prisma      # Database models (User, Product, Order, etc.)
├── docs/                  # Documentation
│   ├── STRIPE_SETUP_GUIDE.md
│   ├── ADMIN_GUIDE.md
│   └── USER_GUIDE.md
└── public/                # Static assets
```

## Shop & Stripe Configuration

### Stripe Setup

AFYA uses Stripe for payment processing in the shop. Stripe provides a comprehensive payment solution with no monthly fees (pay-per-transaction: 2.9% + $0.30).

**Supported Payment Methods:**
- Credit/Debit Cards (Visa, Mastercard, Amex, Discover)
- Apple Pay (automatic on Safari/iOS)
- Google Pay (automatic on Chrome/Android)
- Link by Stripe (one-click checkout)

### Development Setup

1. **Create a Stripe account:**
   - Sign up at [stripe.com](https://stripe.com) (free)
   - Verify your email address

2. **Get your API keys:**
   - Go to [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys)
   - Copy your test mode keys (they start with `sk_test_` and `pk_test_`)
   - Add them to your `.env` file:

   ```env
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

3. **Set up webhook endpoint (for local testing):**
   
   Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Other platforms: https://stripe.com/docs/stripe-cli
   ```

   Login to Stripe CLI:
   ```bash
   stripe login
   ```

   Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

   Copy the webhook signing secret (starts with `whsec_`) and add to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

4. **Test the shop:**
   - Start your development server: `npm run dev`
   - Navigate to `/shop`
   - Use Stripe test cards:
     - Success: `4242 4242 4242 4242`
     - Decline: `4000 0000 0000 0002`
     - Any future expiry date, any CVC

For detailed Stripe setup instructions, see [docs/STRIPE_SETUP_GUIDE.md](./docs/STRIPE_SETUP_GUIDE.md)

### Product Management

Administrators can manage products through the admin panel:

1. **Navigate to Product Management:**
   - Log in as an admin
   - Go to `/admin/products`

2. **Add a Product:**
   - Click "Add Product"
   - Enter product details (name, description, price, category)
   - Upload product images
   - Set inventory levels
   - Configure sizes and colors (optional)
   - Mark as "Drop" for limited-time items (optional)

3. **Edit or Delete Products:**
   - Click the action menu on any product
   - Select "Edit" to modify or "Delete" to remove

4. **Product Categories:**
   - **Apparel**: T-shirts, hoodies, shorts, etc.
   - **Accessories**: Water bottles, bags, bands, etc.
   - **Drops**: Limited-time exclusive items
   - **Collections**: Curated product bundles

### Donation Allocation

Every purchase in the shop includes a 25% donation allocation:

1. **Customer selects allocation during checkout:**
   - **Foundations**: Supports AFYA's general operations and community programs
   - **Sponsor-A-Client**: Funds wellness packets for clients in need

2. **Allocation is recorded with the order:**
   - Visible in order confirmation
   - Tracked in admin analytics
   - Included in donation reports

3. **Admin can view allocation statistics:**
   - Go to `/admin/analytics`
   - View donation allocation breakdown
   - Export reports for accounting

## Impact Programs

### Gear Drive

The Gear Drive program accepts donations of used workout clothing for recycling, upcycling, redistribution, and community events.

**How it works:**
1. Visitors go to `/impact/gear-drive`
2. Fill out the donation form with:
   - Donor information
   - Item types and quantity
   - Condition assessment
   - Preferred dropoff method (dropoff, pickup, or shipping)
3. Submit the form
4. Receive confirmation email with next steps

**Admin Management:**
- View all submissions at `/admin` (coming soon)
- Track submission status
- Coordinate logistics

### Community Minutes Moved Counter

The Community Minutes Moved counter displays the total minutes of movement logged by all AFYA clients.

**How it works:**
1. Clients log activity in their dashboard
2. Activity is recorded via `/api/community/activity`
3. Counter updates in real-time on the home page and impact page
4. Displays aggregate community impact

**Admin can:**
- View detailed activity logs
- Export activity data
- Monitor engagement trends

## Deployment

### Deploy to Vercel

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Set up a PostgreSQL database:**

   Option A: Use Vercel Postgres
   - Go to your Vercel project dashboard
   - Navigate to Storage → Create Database → Postgres
   - Copy the `DATABASE_URL` connection string

   Option B: Use external provider (Supabase, Railway, etc.)
   - Create a PostgreSQL database with your provider
   - Copy the connection string

3. **Connect your GitHub repository to Vercel:**

   - Click "New Project" in Vercel dashboard
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration

4. **Configure environment variables in Vercel:**

   Go to Project Settings → Environment Variables and add:

   ```
   # Database
   DATABASE_URL=<your-postgres-connection-string>
   
   # NextAuth
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   
   # Email
   EMAIL_SERVER_HOST=<your-smtp-host>
   EMAIL_SERVER_PORT=<your-smtp-port>
   EMAIL_SERVER_USER=<your-smtp-user>
   EMAIL_SERVER_PASSWORD=<your-smtp-password>
   EMAIL_FROM=noreply@afya.com
   
   # Webhooks
   WEBHOOK_SECRET=<generate-with-openssl-rand-base64-32>
   
   # Stripe (use live keys for production)
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=<from-stripe-webhook-settings>
   
   # Feature Flags (optional)
   NEXT_PUBLIC_SHOP_ENABLED=true
   NEXT_PUBLIC_GEAR_DRIVE_ENABLED=true
   ```

   **Important**: Make sure to add these variables for all environments (Production, Preview, Development)

5. **Deploy:**

   Click "Deploy" - Vercel will automatically:
   - Install dependencies
   - Run `prisma generate`
   - Run `prisma migrate deploy` (production migrations)
   - Build the Next.js application
   - Deploy to production

6. **Run database migrations (first deployment only):**

   After first deployment, you need to apply migrations to your production database:

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Link your project
   vercel link

   # Run migrations on production database
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

   Alternatively, you can run migrations from your local machine:

   ```bash
   # Set DATABASE_URL to your production database
   DATABASE_URL="<production-database-url>" npx prisma migrate deploy
   ```

7. **Configure Stripe webhook for production:**

   - Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
   - Click "Add endpoint"
   - Enter your webhook URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Select events to listen for:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`
   - Copy the webhook signing secret (starts with `whsec_`)
   - Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

8. **Configure custom domain (optional):**

   - Go to Project Settings → Domains
   - Add your custom domain
   - Update `NEXTAUTH_URL` environment variable to your custom domain

### Post-Deployment Steps

1. **Create an admin user:**

   You have two options to create the initial admin account:

   **Option A: Using the seed script (Recommended)**

   Run the seed script with your production database:

   ```bash
   # Pull production environment variables
   vercel env pull .env.production
   
   # Run the seed script
   npm run seed:admin
   ```

   Or connect directly to production database:

   ```bash
   DATABASE_URL="<production-database-url>" npm run seed:admin admin@example.com SecurePassword123
   ```

   **Option B: Manual SQL update**

   Connect to your production database and manually set a user's role to `ADMIN`:

   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

   Note: This method requires the user to already exist and have a password set.

2. **Seed initial data:**

   Seed community stats:
   ```bash
   DATABASE_URL="<production-database-url>" npx tsx scripts/seed-community-stats.ts
   ```

   Seed sample products (optional):
   ```bash
   DATABASE_URL="<production-database-url>" npx tsx prisma/seed-products.ts
   ```

3. **Configure Google Apps Script webhook:**

   Update your Google Apps Script with the production webhook URL and secret:

   ```javascript
   const WEBHOOK_URL = 'https://your-domain.vercel.app/api/packets/update';
   const WEBHOOK_SECRET = 'your-webhook-secret';
   ```

4. **Test the application:**

   - Visit your production URL
   - Submit an intake form
   - Test authentication with magic link
   - Verify admin panel access
   - Test shop checkout flow with Stripe test mode
   - Test gear drive submission
   - Verify webhook integration

## Database Migrations

### Development Migrations

When making schema changes during development:

```bash
# Create a new migration
npx prisma migrate dev --name description_of_changes

# This will:
# 1. Create a new migration file
# 2. Apply the migration to your dev database
# 3. Regenerate Prisma Client
```

### Production Migrations

To apply migrations to production:

```bash
# Apply all pending migrations
npx prisma migrate deploy

# This should be run:
# - Automatically during Vercel deployment (via build command)
# - Manually when needed using Vercel CLI
```

### Reset Database (Development Only)

To reset your development database:

```bash
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Apply all migrations
# 4. Run seed script (if configured)
```

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | Canonical URL of your site | Yes | `https://afya.com` |
| `NEXTAUTH_SECRET` | Secret for encrypting tokens | Yes | Generate with `openssl rand -base64 32` |
| `EMAIL_SERVER_HOST` | SMTP server hostname | Yes | `smtp.gmail.com` |
| `EMAIL_SERVER_PORT` | SMTP server port | Yes | `587` |
| `EMAIL_SERVER_USER` | SMTP username | Yes | `your-email@gmail.com` |
| `EMAIL_SERVER_PASSWORD` | SMTP password | Yes | Your app password |
| `EMAIL_FROM` | From address for emails | Yes | `noreply@afya.com` |
| `WEBHOOK_SECRET` | Shared secret for webhooks | Yes | Generate with `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | Stripe secret API key | Yes* | `sk_test_...` or `sk_live_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (server) | Yes* | `pk_test_...` or `pk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (client) | Yes* | `pk_test_...` or `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Yes* | `whsec_...` |
| `NEXT_PUBLIC_SHOP_ENABLED` | Enable/disable shop feature | No | `true` or `false` (default: `true`) |
| `NEXT_PUBLIC_GEAR_DRIVE_ENABLED` | Enable/disable gear drive | No | `true` or `false` (default: `true`) |

*Required if shop functionality is enabled

## Account Management

The AFYA platform includes a comprehensive account management system that allows administrators to manage team members, control access, and maintain security across the platform.

### User Roles

The system supports three user roles with different permission levels:

- **CLIENT**: Can access their personal dashboard, view their packets, and manage their profile
- **COACH**: Can access the admin panel, view all clients, but cannot manage team member accounts
- **ADMIN**: Full system access including user management, role assignment, and account administration

### Creating Team Member Accounts

Administrators can invite coaches and other admins to join the platform:

1. **Navigate to User Management:**
   - Log in as an admin
   - Go to `/admin/users` or click "User Management" in the admin navigation

2. **Create a New User:**
   - Click the "Create User" button
   - Enter the team member's email address
   - Enter their full name
   - Select their role (COACH or ADMIN)
   - Click "Create"

3. **Invitation Process:**
   - The system generates a secure setup token valid for 72 hours
   - An invitation email is automatically sent to the team member
   - The email contains a setup link: `https://your-domain.com/setup/[token]`
   - You can also copy the invite URL directly from the success message

4. **Team Member Setup:**
   - The team member clicks the invitation link
   - They are prompted to create a password (minimum 8 characters, one uppercase, one lowercase, one number)
   - They can confirm or update their name
   - After completing setup, their account is activated
   - They can then log in with their email and password

**Important Notes:**
- Setup tokens expire after 72 hours
- Each token can only be used once
- If a token expires, create a new invitation for the user
- Duplicate email addresses are not allowed

### Managing User Accounts

Administrators have full control over user accounts:

#### Viewing Users

The User Management page displays all accounts with:
- Name and email
- Role badge (CLIENT, COACH, ADMIN)
- Account status (Active, Suspended, Deactivated)
- Creation date
- Action menu for each user

#### Searching and Filtering

- **Search**: Type in the search box to filter by name or email
- **Role Filter**: Click role chips to filter by CLIENT, COACH, or ADMIN
- **Status Filter**: Click status chips to filter by ACTIVE, SUSPENDED, or DEACTIVATED

#### Changing User Roles

To change a user's role:

1. Click the action menu (three dots) next to the user
2. Select "Change Role"
3. Choose the new role from the dialog
4. Confirm the change

**What happens when you change a role:**
- The user's role is updated immediately
- All active sessions for that user are invalidated
- The user must log in again to access their new permissions
- A notification email is sent to the user
- The action is logged in the audit trail

**Restrictions:**
- You cannot change the role of the last remaining ADMIN user
- This prevents accidentally locking yourself out of the system

#### Suspending or Deactivating Accounts

To suspend or deactivate an account:

1. Click the action menu next to the user
2. Select "Change Status"
3. Choose SUSPENDED or DEACTIVATED
4. Confirm the action

**What happens when you suspend an account:**
- All active sessions are immediately invalidated
- The user cannot log in
- A notification email is sent to the user
- The action is logged in the audit trail

**To reactivate a suspended account:**
1. Follow the same process
2. Select ACTIVE status
3. The user can log in again

**Restrictions:**
- You cannot suspend your own account
- You cannot suspend the last remaining ADMIN user

### Password Reset Process

Users can reset their password if they forget it:

#### Requesting a Password Reset

1. **User initiates reset:**
   - Go to the login page
   - Click "Forgot password?"
   - Enter their email address
   - Click "Send Reset Link"

2. **System sends reset email:**
   - A secure reset token is generated (valid for 1 hour)
   - An email is sent with the reset link: `https://your-domain.com/reset-password/[token]`
   - For security, the system always shows a success message (even if the email doesn't exist)

3. **User resets password:**
   - Click the reset link in the email
   - Enter a new password (must meet strength requirements)
   - Confirm the new password
   - Click "Reset Password"

4. **System completes reset:**
   - The password is updated
   - All existing sessions are invalidated (for security)
   - The reset token is marked as used
   - A confirmation email is sent
   - The user is redirected to login

**Important Notes:**
- Reset tokens expire after 1 hour
- Each token can only be used once
- If a token expires, request a new reset link
- All sessions are invalidated after password change for security

#### Rate Limiting

To prevent abuse, the system implements rate limiting:
- **Login attempts**: Maximum 5 failed attempts per email per 15 minutes
- **Password reset requests**: Maximum 3 requests per email per hour
- **Account creation**: Maximum 10 new accounts per admin per hour

When rate limits are exceeded, users see a clear message with the retry time.

### User Profile Management

All authenticated users can manage their own profile:

1. **Access Profile Settings:**
   - Click your name or avatar in the navigation
   - Select "Profile Settings"
   - Or navigate to `/settings/profile`

2. **Update Profile Information:**
   - **Name**: Can be updated at any time
   - **Email**: Displayed (read-only for now)
   - **Role**: Displayed (read-only, managed by admins)

3. **Change Password:**
   - Enter your current password
   - Enter a new password (must meet strength requirements)
   - Confirm the new password
   - Click "Save Changes"

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

The password strength indicator shows real-time feedback as you type.

### Security Features

The account management system includes comprehensive security features to protect user accounts and data. For detailed information about security features, see the [Security Features Documentation](./SECURITY_FEATURES.md).

#### Password Security
- All passwords are hashed using bcrypt with cost factor 12
- Passwords are never stored in plain text
- Password strength is validated on the client and server
- Minimum requirements: 8 characters, one uppercase, one lowercase, one number

#### Token Security
- Setup and reset tokens are cryptographically secure
- Tokens are hashed before storage
- Tokens have short expiration times (72 hours for setup, 1 hour for reset)
- Tokens can only be used once

#### Session Security
- Sessions use httpOnly, secure, and sameSite cookies
- Sessions expire after 7 days of inactivity
- Sessions are invalidated on password change, role change, or account suspension
- Multi-device support with individual session management

#### Rate Limiting
- Login attempts: Maximum 5 failed attempts per 15 minutes
- Password reset: Maximum 3 requests per hour
- Account creation: Maximum 10 accounts per admin per hour

#### Audit Logging
- All security-relevant actions are logged
- Logs include: login attempts, password changes, role changes, account status changes
- Logs capture timestamp, user ID, action, and IP address
- Minimum 90-day retention for compliance

#### CSRF Protection
- All forms include CSRF tokens
- NextAuth.js provides built-in CSRF protection

For complete security documentation including compliance information, monitoring guidelines, and incident response procedures, see [SECURITY_FEATURES.md](./SECURITY_FEATURES.md).

### Logout

To log out securely:

1. Click the "Logout" button in the navigation
2. Your session is immediately invalidated
3. All authentication cookies are cleared
4. You are redirected to the login page

You can log out from any authenticated page.

### Troubleshooting Account Management

**Invitation email not received:**
- Check spam/junk folder
- Verify email server configuration in environment variables
- Check Vercel logs for email sending errors
- Resend the invitation by creating a new user with the same email (if not already activated)

**Setup link expired:**
- Setup tokens expire after 72 hours
- Admin must create a new invitation for the user
- The old token cannot be reused

**Password reset link expired:**
- Reset tokens expire after 1 hour
- Request a new password reset link
- The old token cannot be reused

**Cannot log in after role change:**
- This is expected behavior for security
- Your session was invalidated when your role changed
- Simply log in again with your email and password

**Rate limit error:**
- Wait for the specified time period
- For login: 15 minutes after 5 failed attempts
- For password reset: 1 hour after 3 requests
- Contact an administrator if you believe this is an error

**Account suspended message:**
- Your account has been suspended by an administrator
- Contact your administrator for more information
- You cannot log in until your account is reactivated

## Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma Client
npx prisma migrate dev    # Create and apply migration (dev)
npx prisma migrate deploy # Apply migrations (production)
npx prisma migrate reset  # Reset database (dev only)

# Seeding
npm run seed:admin                         # Create initial admin (interactive)
npm run seed:admin <email> <password> <name>  # Create admin (non-interactive)
npx tsx scripts/seed-community-stats.ts    # Initialize community stats
npx tsx prisma/seed-products.ts            # Seed sample products
npx tsx prisma/seed-intake-paths.ts        # Seed intake paths
npx tsx prisma/seed-question-blocks.ts     # Seed question blocks
npx tsx prisma/seed-packet-templates.ts    # Seed packet templates

# Testing
npm run test         # Run all tests
npm run test:unit    # Run unit tests
npm run test:integration  # Run integration tests
npm run test:e2e     # Run end-to-end tests

# Stripe (Development)
stripe listen --forward-to localhost:3000/api/webhooks/stripe  # Forward webhooks locally
```

## Troubleshooting

### Build Errors

**Error: Missing environment variables**
- Ensure all required environment variables are set in Vercel
- Check that variables are added to the correct environment (Production/Preview/Development)

**Error: Prisma Client not generated**
- The build script automatically runs `prisma generate`
- If issues persist, try: `npm run postinstall`

### Database Connection Issues

**Error: Can't reach database server**
- Verify `DATABASE_URL` is correct
- Check that your database allows connections from Vercel IPs
- For Vercel Postgres, ensure you're using the pooled connection string

### Authentication Issues

**Magic links not working**
- Verify `NEXTAUTH_URL` matches your actual domain
- Check `NEXTAUTH_SECRET` is set and at least 32 characters
- Verify email provider credentials are correct
- Check spam folder for magic link emails

**Password login not working**
- Ensure the user has set up their password (via invitation or password reset)
- Check that the account status is ACTIVE (not SUSPENDED or DEACTIVATED)
- Verify you're entering the correct email and password
- Check for rate limiting after multiple failed attempts
- Clear browser cookies and try again

**Invitation emails not sending**
- Verify all `EMAIL_SERVER_*` environment variables are set correctly
- Check Vercel logs for email sending errors
- Test email configuration with a password reset request
- Ensure your SMTP provider allows the sending rate

### Webhook Issues

**Webhook returns 401 Unauthorized**
- Verify `WEBHOOK_SECRET` matches in both application and Google Apps Script
- Check that `X-Webhook-Secret` header is being sent correctly

### Shop & Stripe Issues

**Stripe checkout not loading**
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
- Check browser console for errors
- Ensure you're using the correct key for your environment (test vs. live)

**Payment fails with "Invalid API Key"**
- Verify `STRIPE_SECRET_KEY` is set correctly in environment variables
- Ensure you're using the correct key for your environment
- Check that the key hasn't been revoked in Stripe Dashboard

**Webhook events not received**
- For local development: Ensure Stripe CLI is running (`stripe listen`)
- For production: Verify webhook endpoint is configured in Stripe Dashboard
- Check `STRIPE_WEBHOOK_SECRET` matches the webhook signing secret
- Review Vercel logs for webhook errors

**Products not displaying**
- Ensure products are marked as `isActive: true` in the database
- Check that products have valid images and prices
- Verify product seeding completed successfully

**Donation allocation not saving**
- Check that the order includes `donationAllocation` field
- Verify database schema includes `DonationAllocation` enum
- Review order creation API logs

### Community Features Issues

**Community Minutes Moved counter not updating**
- Verify `CommunityStats` table exists and has data
- Check that activity logging API is working (`/api/community/activity`)
- Ensure clients are logging activity in their dashboard
- Review cache settings if using caching

**Gear Drive form not submitting**
- Check email configuration for confirmation emails
- Verify `GearDriveSubmission` table exists
- Review API logs at `/api/impact/gear-drive`
- Check form validation errors in browser console

## Documentation

For more detailed information, see:

- **[Admin Guide](./docs/ADMIN_GUIDE.md)**: Complete guide for administrators
- **[User Guide](./docs/USER_GUIDE.md)**: Guide for clients and users
- **[Stripe Setup Guide](./docs/STRIPE_SETUP_GUIDE.md)**: Detailed Stripe configuration
- **[Developer Guide](./docs/DEVELOPER_GUIDE.md)**: Development best practices
- **[Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)**: Production deployment checklist
- **[Monitoring Guide](./docs/MONITORING_GUIDE.md)**: System monitoring and alerts

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the relevant documentation in `/docs`
3. Check Vercel deployment logs
4. Review external documentation:
   - Prisma: https://www.prisma.io/docs
   - NextAuth: https://authjs.dev
   - Stripe: https://stripe.com/docs
   - Next.js: https://nextjs.org/docs

## License

[Your License Here]
