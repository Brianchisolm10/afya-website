# Design Document

## Overview

The AFYA Website V1 is a Next.js application that combines a public marketing site with an authenticated client portal. The architecture follows a standard three-tier pattern: presentation layer (React components), application layer (Next.js API routes), and data layer (Postgres via Prisma). Authentication is handled by NextAuth.js for simplicity and flexibility. The system integrates with external Google Apps Script automation through webhook endpoints.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Public Pages │  │ Auth Pages   │  │ Client Portal│      │
│  │ (/, /services│  │ (/login)     │  │ (/dashboard) │      │
│  │ /get-started)│  │              │  │ (/admin)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Application                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              App Router (Pages)                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Routes                              │   │
│  │  • POST /api/intake/submit                          │   │
│  │  • POST /api/packets/update (webhook)               │   │
│  │  • GET /api/me/client                               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         NextAuth.js (Authentication)                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Prisma ORM Layer                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  User    │  │  Client  │  │  Packet  │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘

External Integration:
┌─────────────────────────────────────────────────────────────┐
│            Google Apps Script Automation                     │
│  (Generates packets, calls webhook to update status)        │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5 (Auth.js) with Email provider
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Deployment**: Vercel
- **Email**: Resend or similar for magic link emails

### Directory Structure

```
afya-web/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                 # Home page
│   │   │   ├── services/
│   │   │   │   └── page.tsx             # Services page
│   │   │   ├── get-started/
│   │   │   │   └── page.tsx             # Intake form
│   │   │   └── layout.tsx               # Public layout
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx             # Login page
│   │   │   └── layout.tsx               # Auth layout
│   │   ├── (protected)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx             # Client dashboard
│   │   │   ├── admin/
│   │   │   │   └── page.tsx             # Admin panel
│   │   │   └── layout.tsx               # Protected layout
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts         # NextAuth config
│   │   │   ├── intake/
│   │   │   │   └── submit/
│   │   │   │       └── route.ts         # Intake submission
│   │   │   ├── packets/
│   │   │   │   └── update/
│   │   │   │       └── route.ts         # Webhook endpoint
│   │   │   └── me/
│   │   │       └── client/
│   │   │           └── route.ts         # Get client data
│   │   ├── layout.tsx                   # Root layout
│   │   └── globals.css                  # Global styles
│   ├── components/
│   │   ├── ui/                          # Reusable UI components
│   │   ├── forms/                       # Form components
│   │   ├── dashboard/                   # Dashboard components
│   │   └── admin/                       # Admin components
│   ├── lib/
│   │   ├── auth.ts                      # Auth configuration
│   │   ├── db.ts                        # Prisma client
│   │   └── utils.ts                     # Utility functions
│   └── types/
│       └── index.ts                     # TypeScript types
├── prisma/
│   ├── schema.prisma                    # Database schema
│   └── migrations/                      # Database migrations
├── public/                              # Static assets
├── .env.local                           # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Components and Interfaces

### Data Models (Prisma Schema)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(CLIENT)
  client    Client?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  CLIENT
  COACH
  ADMIN
}

model Client {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName  String
  email     String   @unique
  goal      String?
  packets   Packet[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Packet {
  id        String       @id @default(cuid())
  clientId  String
  client    Client       @relation(fields: [clientId], references: [id], onDelete: Cascade)
  type      PacketType
  status    PacketStatus @default(PENDING)
  docUrl    String?
  lastError String?
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  @@index([clientId, type])
}

enum PacketType {
  INTRO
  NUTRITION
  WORKOUT
}

enum PacketStatus {
  PENDING
  READY
  FAILED
}
```

### API Interfaces

#### POST /api/intake/submit

**Request:**
```typescript
{
  fullName: string;
  email: string;
  goal: "WEIGHT_LOSS" | "PERFORMANCE" | "GENERAL_HEALTH";
}
```

**Response:**
```typescript
{
  success: boolean;
  client: {
    id: string;
    fullName: string;
    email: string;
  };
  packets: Array<{
    id: string;
    type: PacketType;
    status: PacketStatus;
  }>;
}
```

#### POST /api/packets/update

**Headers:**
```
X-Webhook-Secret: <shared_secret>
```

**Request:**
```typescript
{
  clientEmail?: string;
  clientId?: string;
  packetType: "INTRO" | "NUTRITION" | "WORKOUT";
  status: "READY" | "FAILED";
  docUrl?: string;
  error?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  packet?: {
    id: string;
    type: PacketType;
    status: PacketStatus;
    docUrl: string | null;
  };
  error?: string;
}
```

#### GET /api/me/client

**Authentication:** Required (session cookie)

**Response:**
```typescript
{
  client: {
    id: string;
    fullName: string;
    email: string;
    goal: string | null;
    createdAt: string;
  };
  packets: Array<{
    id: string;
    type: PacketType;
    status: PacketStatus;
    docUrl: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

### Key React Components

#### IntakeForm Component
- Location: `src/components/forms/IntakeForm.tsx`
- Purpose: Collects new client information
- State: form data, submission status, validation errors
- Behavior: Validates input, calls POST /api/intake/submit, shows confirmation

#### PacketCard Component
- Location: `src/components/dashboard/PacketCard.tsx`
- Props: packet (type, status, docUrl)
- Purpose: Displays individual packet status with appropriate badge and action button
- Variants: PENDING (gray badge), READY (green badge + link), FAILED (red badge)

#### ClientTable Component
- Location: `src/components/admin/ClientTable.tsx`
- Purpose: Displays all clients in admin panel
- Features: Sortable columns, click to view details, packet count display

#### ProtectedRoute Component
- Location: `src/components/auth/ProtectedRoute.tsx`
- Purpose: Wraps protected pages, checks authentication and role
- Behavior: Redirects to login if unauthenticated, shows 403 if insufficient role

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant NextAuth
    participant Email
    participant Database

    User->>Browser: Click "Login"
    Browser->>NextAuth: Request magic link
    NextAuth->>Database: Create verification token
    NextAuth->>Email: Send magic link
    Email->>User: Deliver email
    User->>Browser: Click magic link
    Browser->>NextAuth: Verify token
    NextAuth->>Database: Validate token & get user
    NextAuth->>Browser: Set session cookie
    Browser->>User: Redirect to dashboard
```

### Intake and Packet Flow

```mermaid
sequenceDiagram
    participant Visitor
    participant Website
    participant API
    participant Database
    participant Google

    Visitor->>Website: Fill intake form
    Website->>API: POST /api/intake/submit
    API->>Database: Create User + Client
    API->>Database: Create Packet (PENDING)
    API->>Website: Return success
    Website->>Visitor: Show confirmation

    Note over Google: Later, async process
    Google->>Google: Generate packet document
    Google->>API: POST /api/packets/update
    API->>Database: Update Packet (READY + URL)
    API->>Google: Return success

    Visitor->>Website: Login & view dashboard
    Website->>API: GET /api/me/client
    API->>Database: Fetch client + packets
    API->>Website: Return data with READY packets
    Website->>Visitor: Show packet links
```

## Data Models

### User Model
- Primary entity for authentication
- Links to Client through one-to-one relationship
- Role determines access level (CLIENT, COACH, ADMIN)
- Email is unique identifier for login

### Client Model
- Extends User with profile information
- Stores intake form data (fullName, email, goal)
- One-to-many relationship with Packets
- Email duplicated for easy lookup from Google Script

### Packet Model
- Represents a generated document
- Linked to Client via foreign key
- Type enum: INTRO, NUTRITION, WORKOUT
- Status enum: PENDING (created), READY (available), FAILED (error)
- docUrl stores Google Drive link when ready
- lastError stores debugging information for failed packets

## Error Handling

### Client-Side Error Handling

1. **Form Validation Errors**
   - Display inline validation messages for invalid email format
   - Show required field indicators
   - Prevent submission until valid

2. **API Request Errors**
   - Show toast notifications for network failures
   - Display user-friendly error messages
   - Provide retry mechanisms for transient failures

3. **Authentication Errors**
   - Redirect to login page with return URL
   - Show clear messages for expired sessions
   - Handle magic link expiration gracefully

### Server-Side Error Handling

1. **API Route Error Responses**
   - Return appropriate HTTP status codes (400, 401, 403, 404, 500)
   - Include error messages in response body
   - Log errors to console/monitoring service

2. **Database Errors**
   - Catch Prisma errors and return generic messages to client
   - Log full error details server-side
   - Handle unique constraint violations (duplicate email)

3. **Webhook Authentication**
   - Verify X-Webhook-Secret header
   - Return 401 for invalid/missing secret
   - Log unauthorized webhook attempts

4. **Packet Update Failures**
   - Store error message in Packet.lastError field
   - Set status to FAILED
   - Allow admin to view error details

### Error Logging Strategy

- Use console.error for development
- Integrate with Vercel Analytics or Sentry for production
- Log webhook failures with client identifier for debugging
- Track authentication failures for security monitoring

## Testing Strategy

### Unit Testing
- Test utility functions in `src/lib/utils.ts`
- Test form validation logic
- Test API route handlers with mocked database

### Integration Testing
- Test complete intake flow (form submission → database creation)
- Test webhook endpoint with various payloads
- Test authentication flow with NextAuth

### End-to-End Testing
- Test user journey: intake → login → view dashboard
- Test admin flow: login → view clients → view packet details
- Test packet update flow: webhook call → dashboard refresh

### Manual Testing Checklist
- Verify all public pages render correctly
- Test intake form with valid and invalid data
- Test login with magic link
- Verify dashboard shows correct packet statuses
- Test admin panel with different roles
- Verify webhook updates packet status correctly
- Test responsive design on mobile devices

### Testing Tools
- Jest for unit tests
- React Testing Library for component tests
- Playwright or Cypress for E2E tests (optional for V1)
- Postman/Thunder Client for API testing

## Security Considerations

1. **Authentication**
   - Use secure session cookies (httpOnly, secure, sameSite)
   - Implement CSRF protection via NextAuth
   - Set reasonable session expiration (7 days)

2. **Authorization**
   - Verify user role on all protected routes
   - Check userId matches requested client data
   - Validate admin role for /admin routes

3. **Webhook Security**
   - Require shared secret header for webhook endpoint
   - Use environment variable for secret (not hardcoded)
   - Log and monitor unauthorized webhook attempts

4. **Data Validation**
   - Validate all API inputs server-side
   - Sanitize user inputs to prevent XSS
   - Use Prisma parameterized queries to prevent SQL injection

5. **Environment Variables**
   - Store sensitive data in .env.local (not committed)
   - Use Vercel environment variables for production
   - Required variables: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, WEBHOOK_SECRET

## Deployment Configuration

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/afya"

# NextAuth
NEXTAUTH_URL="https://afya.com"
NEXTAUTH_SECRET="<generated-secret>"

# Email Provider (Resend)
RESEND_API_KEY="<api-key>"
EMAIL_FROM="noreply@afya.com"

# Webhook
WEBHOOK_SECRET="<shared-secret-with-google-script>"
```

### Vercel Deployment Steps

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set up PostgreSQL database (Vercel Postgres or external)
4. Run Prisma migrations on deployment
5. Configure custom domain
6. Enable Vercel Analytics (optional)

### Database Migration Strategy

- Use Prisma Migrate for schema changes
- Run migrations automatically on deployment via build script
- Keep migration files in version control
- Test migrations on staging environment first

## Performance Considerations

1. **Database Queries**
   - Use Prisma's `include` to fetch related data in single query
   - Add indexes on frequently queried fields (clientId, email)
   - Limit admin table queries with pagination (future enhancement)

2. **Caching**
   - Use Next.js static generation for public pages
   - Cache dashboard data with revalidation
   - Consider Redis for session storage (future enhancement)

3. **Asset Optimization**
   - Use Next.js Image component for optimized images
   - Minimize JavaScript bundle size
   - Enable Vercel Edge Network for CDN

4. **API Response Times**
   - Keep API routes lightweight
   - Avoid N+1 queries with Prisma includes
   - Set reasonable timeout limits
