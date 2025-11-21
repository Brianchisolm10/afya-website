# Developer Guide: Dynamic Intake and Packet System

This guide provides technical documentation for developers working with the Dynamic Intake and Packet System.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [API Endpoints](#api-endpoints)
3. [Data Models](#data-models)
4. [Branching Logic Syntax](#branching-logic-syntax)
5. [Template Syntax](#template-syntax)
6. [Services and Utilities](#services-and-utilities)
7. [Testing](#testing)
8. [Deployment](#deployment)

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                      │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React)          │  API Routes (Next.js)          │
│  - Path Selection          │  - Intake Submission           │
│  - Dynamic Forms           │  - Packet Management           │
│  - Packet Viewer           │  - Template Management         │
│  - Admin Dashboard         │  - Analytics                   │
└──────────────┬──────────────────────────┬───────────────────┘
               │                          │
               ▼                          ▼
    ┌──────────────────┐      ┌──────────────────┐
    │   Database       │      │  Background Jobs │
    │   (Prisma)       │      │  (Job Queue)     │
    └──────────────────┘      └──────────────────┘
```

### Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Background Jobs**: In-memory queue (can be replaced with BullMQ/pg-boss)
- **PDF Generation**: Custom service
- **Type Safety**: TypeScript

### Directory Structure

```
├── app/
│   ├── (public)/intake/          # Public intake form
│   ├── (protected)/
│   │   ├── dashboard/            # Client dashboard
│   │   └── admin/                # Admin panel
│   └── api/
│       ├── intake/               # Intake endpoints
│       ├── packets/              # Packet endpoints
│       └── admin/                # Admin endpoints
├── components/
│   ├── intake/                   # Intake form components
│   ├── dashboard/                # Dashboard components
│   └── admin/                    # Admin components
├── lib/
│   ├── intake/                   # Intake business logic
│   │   ├── intake-service.ts
│   │   ├── packet-generation-service.ts
│   │   ├── template-engine.ts
│   │   └── ...
│   ├── auth.ts                   # Authentication
│   └── db.ts                     # Database client
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
└── types/
    └── intake.ts                 # TypeScript types
```

---

## API Endpoints

### Intake Endpoints

#### GET /api/intake/progress

Get saved intake progress for authenticated user.

**Authentication**: Required

**Response**:
```typescript
{
  id: string;
  selectedPath: ClientType | null;
  currentStep: number;
  totalSteps: number | null;
  responses: Record<string, any>;
  isComplete: boolean;
  lastSavedAt: string;
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `404`: No progress found

#### POST /api/intake/progress

Save intake progress.

**Authentication**: Required

**Request Body**:
```typescript
{
  selectedPath?: ClientType;
  currentStep?: number;
  totalSteps?: number;
  responses?: Record<string, any>;
}
```

**Response**:
```typescript
{
  success: boolean;
  progress: IntakeProgress;
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid request
- `401`: Unauthorized

#### POST /api/intake/submit-dynamic

Submit completed intake form.

**Authentication**: Required

**Request Body**:
```typescript
{
  clientType: ClientType;
  responses: Record<string, any>;
}
```

**Response**:
```typescript
{
  success: boolean;
  clientId: string;
  packetIds: string[];
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid or incomplete data
- `401`: Unauthorized
- `500`: Server error

#### POST /api/intake/analytics

Track intake analytics events.

**Authentication**: Optional

**Request Body**:
```typescript
{
  clientType: ClientType;
  event: 'started' | 'abandoned' | 'completed';
  dropOffStep?: number;
  completionTime?: number;
}
```

**Response**:
```typescript
{
  success: boolean;
}
```

### Packet Endpoints

#### GET /api/packets/[id]

Get packet by ID.

**Authentication**: Required

**Authorization**: User must own the packet or be an admin

**Response**:
```typescript
{
  id: string;
  type: PacketType;
  status: PacketStatus;
  content: PacketContent | null;
  docUrl: string | null;
  pdfUrl: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found

#### GET /api/packets/[id]/download

Download packet as PDF.

**Authentication**: Required

**Authorization**: User must own the packet or be an admin

**Response**: PDF file

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found or PDF not generated

#### PUT /api/packets/[id]/edit

Edit packet content (admin only).

**Authentication**: Required (Admin)

**Request Body**:
```typescript
{
  content: PacketContent;
  notifyClient?: boolean;
}
```

**Response**:
```typescript
{
  success: boolean;
  packet: Packet;
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid content
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found

#### POST /api/packets/[id]/send

Send packet notification to client.

**Authentication**: Required (Admin)

**Request Body**:
```typescript
{
  message?: string;
}
```

**Response**:
```typescript
{
  success: boolean;
}
```

#### GET /api/packets/status

Get packet status for current user.

**Authentication**: Required

**Response**:
```typescript
{
  packets: Array<{
    id: string;
    type: PacketType;
    status: PacketStatus;
    updatedAt: string;
  }>;
}
```

### Admin Endpoints

#### GET /api/admin/templates

Get all packet templates.

**Authentication**: Required (Admin)

**Response**:
```typescript
{
  templates: PacketTemplate[];
}
```

#### POST /api/admin/templates

Create new template.

**Authentication**: Required (Admin)

**Request Body**:
```typescript
{
  name: string;
  packetType: PacketType;
  clientType?: ClientType;
  sections: Section[];
  contentBlocks: ContentBlock[];
  isDefault?: boolean;
}
```

#### PUT /api/admin/templates/[id]

Update template.

**Authentication**: Required (Admin)

**Request Body**: Same as POST /api/admin/templates

#### DELETE /api/admin/templates/[id]

Delete template.

**Authentication**: Required (Admin)

**Response**:
```typescript
{
  success: boolean;
}
```

#### GET /api/admin/analytics

Get analytics data.

**Authentication**: Required (Admin)

**Query Parameters**:
- `startDate`: ISO date string
- `endDate`: ISO date string
- `clientType`: Optional filter

**Response**:
```typescript
{
  completionRate: number;
  averageCompletionTime: number;
  clientTypeDistribution: Record<ClientType, number>;
  abandonmentByStep: Array<{ step: number; count: number }>;
  packetGenerationMetrics: {
    successRate: number;
    averageTime: number;
    failuresByType: Record<string, number>;
  };
}
```

#### GET /api/admin/analytics/export

Export analytics data.

**Authentication**: Required (Admin)

**Query Parameters**:
- `format`: 'csv' | 'json' | 'pdf'
- `startDate`: ISO date string
- `endDate`: ISO date string

**Response**: File download

#### POST /api/admin/packets/[id]/regenerate

Regenerate packet.

**Authentication**: Required (Admin)

**Response**:
```typescript
{
  success: boolean;
  packetId: string;
  status: PacketStatus;
}
```

#### GET /api/admin/packets/errors

Get failed packets.

**Authentication**: Required (Admin)

**Response**:
```typescript
{
  packets: Array<{
    id: string;
    clientId: string;
    type: PacketType;
    lastError: string;
    retryCount: number;
    updatedAt: string;
  }>;
}
```

---

## Data Models

### Core Models

#### Client

```typescript
model Client {
  id                    String       @id @default(cuid())
  userId                String       @unique
  user                  User         @relation(...)
  
  // Basic Info
  fullName              String
  email                 String       @unique
  
  // Client Classification
  clientType            ClientType
  intakeCompletedAt     DateTime?
  
  // Intake Responses (JSON)
  intakeResponses       Json?
  
  // Relations
  packets               Packet[]
  intakeProgress        IntakeProgress?
  
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt
}
```

#### Packet

```typescript
model Packet {
  id                String        @id @default(cuid())
  clientId          String
  client            Client        @relation(...)
  
  type              PacketType
  status            PacketStatus  @default(PENDING)
  
  // Content Storage
  content           Json?
  docUrl            String?
  pdfUrl            String?
  
  // Generation Metadata
  templateId        String?
  generatedBy       String?
  generationMethod  String?
  
  // Error Handling
  lastError         String?
  retryCount        Int           @default(0)
  
  // Versioning
  version           Int           @default(1)
  previousVersionId String?
  
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
}
```

#### IntakeProgress

```typescript
model IntakeProgress {
  id                String    @id @default(cuid())
  clientId          String    @unique
  client            Client    @relation(...)
  
  selectedPath      ClientType?
  currentStep       Int       @default(0)
  totalSteps        Int?
  responses         Json      @default("{}")
  isComplete        Boolean   @default(false)
  lastSavedAt       DateTime  @default(now())
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

#### QuestionBlock

```typescript
model QuestionBlock {
  id                String    @id @default(cuid())
  name              String    @unique
  category          String
  questions         Json      // Array of Question objects
  order             Int       @default(0)
  isActive          Boolean   @default(true)
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

#### IntakePath

```typescript
model IntakePath {
  id                String    @id @default(cuid())
  clientType        ClientType @unique
  name              String
  description       String
  questionBlocks    Json      // Array of block IDs
  branchingRules    Json      // Conditional logic
  isActive          Boolean   @default(true)
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

#### PacketTemplate

```typescript
model PacketTemplate {
  id                String      @id @default(cuid())
  name              String
  packetType        PacketType
  clientType        ClientType?
  
  sections          Json        // Array of Section objects
  contentBlocks     Json        // Array of ContentBlock objects
  
  isDefault         Boolean     @default(false)
  createdBy         String?
  
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
}
```

### Enums

```typescript
enum ClientType {
  NUTRITION_ONLY
  WORKOUT_ONLY
  FULL_PROGRAM
  ATHLETE_PERFORMANCE
  YOUTH
  GENERAL_WELLNESS
  SPECIAL_SITUATION
}

enum PacketType {
  INTRO
  NUTRITION
  WORKOUT
  PERFORMANCE
  YOUTH
  RECOVERY
  WELLNESS
}

enum PacketStatus {
  PENDING
  GENERATING
  READY
  FAILED
}
```

### TypeScript Interfaces

#### Question

```typescript
interface Question {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: ValidationRule[];
  conditionalDisplay?: ConditionalRule;
  helpText?: string;
  required?: boolean;
}

type QuestionType = 
  | 'text' 
  | 'number' 
  | 'select' 
  | 'multiselect' 
  | 'radio' 
  | 'checkbox' 
  | 'textarea' 
  | 'date' 
  | 'range';
```

#### ValidationRule

```typescript
interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}
```

#### PacketContent

```typescript
interface PacketContent {
  sections: PacketSection[];
  metadata?: {
    generatedAt: string;
    version: number;
    clientType: ClientType;
  };
}

interface PacketSection {
  id: string;
  title: string;
  content: ContentBlock[];
  order: number;
}

interface ContentBlock {
  id: string;
  type: 'text' | 'table' | 'list' | 'chart' | 'image';
  content: any;
  formatting?: Record<string, any>;
}
```

---

## Branching Logic Syntax

### Overview

Branching logic determines which questions or question blocks to show based on previous answers.

### Rule Structure

```typescript
interface BranchingRule {
  id: string;
  condition: Condition;
  action: Action;
}

interface Condition {
  type: ConditionType;
  questionId?: string;
  value?: any;
  conditions?: Condition[]; // For nested logic
}

type ConditionType = 
  | 'equals' 
  | 'notEquals'
  | 'contains' 
  | 'notContains'
  | 'greaterThan' 
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'and' 
  | 'or' 
  | 'not';

interface Action {
  type: 'show' | 'hide' | 'skip' | 'require';
  targetBlockIds: string[];
}
```

### Examples

#### Simple Equality Check

Show follow-up questions if user has injuries:

```json
{
  "id": "show-injury-details",
  "condition": {
    "type": "equals",
    "questionId": "has-injuries",
    "value": true
  },
  "action": {
    "type": "show",
    "targetBlockIds": ["injury-details", "injury-history"]
  }
}
```

#### Array Contains Check

Show vegan-specific questions if diet type includes vegan:

```json
{
  "id": "show-vegan-questions",
  "condition": {
    "type": "contains",
    "questionId": "diet-type",
    "value": "vegan"
  },
  "action": {
    "type": "show",
    "targetBlockIds": ["vegan-nutrition"]
  }
}
```

#### Numeric Comparison

Show advanced training if experience is high:

```json
{
  "id": "show-advanced-training",
  "condition": {
    "type": "greaterThan",
    "questionId": "training-years",
    "value": 3
  },
  "action": {
    "type": "show",
    "targetBlockIds": ["advanced-techniques"]
  }
}
```

#### Complex Logic (AND)

Show performance metrics if athlete AND competitive level:

```json
{
  "id": "show-performance-metrics",
  "condition": {
    "type": "and",
    "conditions": [
      {
        "type": "equals",
        "questionId": "client-type",
        "value": "ATHLETE_PERFORMANCE"
      },
      {
        "type": "contains",
        "questionId": "competition-level",
        "value": ["college", "professional"]
      }
    ]
  },
  "action": {
    "type": "show",
    "targetBlockIds": ["performance-testing", "periodization"]
  }
}
```

#### Complex Logic (OR)

Show equipment alternatives if no gym OR home workout:

```json
{
  "id": "show-equipment-alternatives",
  "condition": {
    "type": "or",
    "conditions": [
      {
        "type": "equals",
        "questionId": "gym-access",
        "value": false
      },
      {
        "type": "equals",
        "questionId": "workout-location",
        "value": "home"
      }
    ]
  },
  "action": {
    "type": "show",
    "targetBlockIds": ["bodyweight-exercises", "minimal-equipment"]
  }
}
```

### Evaluation Logic

The branching logic is evaluated in `lib/intake/intake-service.ts`:

```typescript
function evaluateBranchingLogic(
  responses: Record<string, any>,
  rules: BranchingRule[]
): string[] {
  const visibleBlocks: string[] = [];
  
  for (const rule of rules) {
    if (evaluateCondition(rule.condition, responses)) {
      if (rule.action.type === 'show') {
        visibleBlocks.push(...rule.action.targetBlockIds);
      }
    }
  }
  
  return visibleBlocks;
}
```

---

## Template Syntax

### Overview

Templates define the structure and content of generated packets. They use placeholders that are replaced with actual client data during generation.

### Placeholder Syntax

Placeholders use double curly braces: `{{path.to.value}}`

### Available Data Paths

#### Client Data

```
{{client.fullName}}
{{client.email}}
{{client.age}}
{{client.gender}}
{{client.goal}}
{{client.activityLevel}}
{{client.trainingExperience}}
{{client.dietType}}
{{client.foodAllergies}}
{{client.availableEquipment}}
{{client.daysPerWeek}}
{{client.sessionDuration}}
```

#### Intake Responses

Access any intake response by question ID:

```
{{responses.training-goals}}
{{responses.dietary-restrictions}}
{{responses.injury-history}}
```

#### Calculated Values

Values computed during packet generation:

```
{{calculated.dailyCalories}}
{{calculated.proteinGrams}}
{{calculated.carbGrams}}
{{calculated.fatGrams}}
{{calculated.proteinPercentage}}
{{calculated.carbPercentage}}
{{calculated.fatPercentage}}
{{calculated.trainingDays}}
{{calculated.restDays}}
```

#### Dates

```
{{date.today}}           // Current date
{{date.startDate}}       // Program start date
{{date.weekNumber}}      // Current week number
{{date.monthName}}       // Current month name
```

### Template Structure

```typescript
interface PacketTemplate {
  id: string;
  name: string;
  packetType: PacketType;
  clientType?: ClientType;
  sections: Section[];
  contentBlocks: ContentBlock[];
  isDefault: boolean;
}

interface Section {
  id: string;
  title: string;
  order: number;
  contentBlockIds: string[];
  conditionalDisplay?: ConditionalRule;
}

interface ContentBlock {
  id: string;
  type: 'text' | 'table' | 'list' | 'chart' | 'image';
  content: string | object;
  dataSource?: string;
  formatting?: FormattingOptions;
}
```

### Example Template

```json
{
  "id": "nutrition-basic",
  "name": "Basic Nutrition Template",
  "packetType": "NUTRITION",
  "sections": [
    {
      "id": "overview",
      "title": "Your Nutrition Overview",
      "order": 1,
      "contentBlockIds": ["welcome", "goals", "calorie-target"]
    },
    {
      "id": "macros",
      "title": "Macronutrient Breakdown",
      "order": 2,
      "contentBlockIds": ["macro-table", "macro-explanation"]
    }
  ],
  "contentBlocks": [
    {
      "id": "welcome",
      "type": "text",
      "content": "Welcome {{client.fullName}}! This nutrition plan is designed for your goal of {{client.goal}}."
    },
    {
      "id": "calorie-target",
      "type": "text",
      "content": "Based on your activity level ({{client.activityLevel}}), your daily calorie target is {{calculated.dailyCalories}} calories."
    },
    {
      "id": "macro-table",
      "type": "table",
      "dataSource": "calculated.macros",
      "formatting": {
        "headers": ["Nutrient", "Grams", "Calories", "Percentage"],
        "columns": ["name", "grams", "calories", "percentage"]
      }
    }
  ]
}
```

### Conditional Content

Show content only when conditions are met:

```json
{
  "id": "vegan-section",
  "title": "Vegan Protein Sources",
  "order": 5,
  "contentBlockIds": ["vegan-proteins"],
  "conditionalDisplay": {
    "type": "equals",
    "field": "client.dietType",
    "value": "vegan"
  }
}
```

### Helper Functions

Templates can use helper functions for formatting:

```
{{format.number(calculated.dailyCalories, 0)}}  // Round to integer
{{format.percentage(calculated.proteinPercentage)}}  // Format as %
{{format.date(date.today, 'MMMM D, YYYY')}}  // Format date
{{format.capitalize(client.goal)}}  // Capitalize text
```

### Template Processing

Templates are processed by `lib/intake/template-engine.ts`:

```typescript
class TemplateEngine {
  populateTemplate(
    template: PacketTemplate,
    clientData: Client,
    calculatedValues: Record<string, any>
  ): PacketContent {
    const context = {
      client: clientData,
      responses: clientData.intakeResponses,
      calculated: calculatedValues,
      date: this.getDateContext()
    };
    
    const sections = template.sections
      .filter(section => this.evaluateCondition(section.conditionalDisplay, context))
      .map(section => this.processSection(section, template.contentBlocks, context));
    
    return {
      sections,
      metadata: {
        generatedAt: new Date().toISOString(),
        version: 1,
        clientType: clientData.clientType
      }
    };
  }
  
  private replacePlaceholders(content: string, context: any): string {
    return content.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      return this.getValueByPath(context, path.trim()) || match;
    });
  }
}
```

---

## Services and Utilities

### IntakeService

Location: `lib/intake/intake-service.ts`

**Purpose**: Manages intake form logic, progress tracking, and submission.

**Key Methods**:

```typescript
class IntakeService {
  // Get intake path configuration
  async getIntakePath(clientType: ClientType): Promise<IntakePath>
  
  // Get question blocks for a path
  async getQuestionBlocks(blockIds: string[]): Promise<QuestionBlock[]>
  
  // Evaluate branching logic
  evaluateBranchingLogic(
    responses: Record<string, any>,
    rules: BranchingRule[]
  ): string[]
  
  // Save intake progress
  async saveProgress(
    userId: string,
    progress: Partial<IntakeProgress>
  ): Promise<IntakeProgress>
  
  // Submit completed intake
  async submitIntake(
    userId: string,
    clientType: ClientType,
    responses: Record<string, any>
  ): Promise<{ clientId: string; packetIds: string[] }>
  
  // Generate client profile from responses
  generateClientProfile(
    responses: Record<string, any>,
    clientType: ClientType
  ): ClientProfile
}
```

### PacketGenerationService

Location: `lib/intake/packet-generation-service.ts`

**Purpose**: Orchestrates packet generation process.

**Key Methods**:

```typescript
class PacketGenerationService {
  // Generate a packet
  async generatePacket(
    clientId: string,
    packetType: PacketType
  ): Promise<Packet>
  
  // Get appropriate template
  async getTemplate(
    packetType: PacketType,
    clientType: ClientType
  ): Promise<PacketTemplate>
  
  // Populate template with data
  async populateTemplate(
    template: PacketTemplate,
    client: Client
  ): Promise<PacketContent>
  
  // Calculate derived values
  calculateValues(client: Client): Record<string, any>
  
  // Export to PDF
  async exportToPDF(packet: Packet): Promise<string>
}
```

### PacketRoutingService

Location: `lib/intake/packet-routing-service.ts`

**Purpose**: Determines which packets to generate based on client type.

**Key Methods**:

```typescript
class PacketRoutingService {
  // Determine required packet types
  determineRequiredPackets(
    clientType: ClientType,
    responses: Record<string, any>
  ): PacketType[]
  
  // Queue packets for generation
  async queuePackets(
    clientId: string,
    packetTypes: PacketType[]
  ): Promise<string[]>
}
```

### TemplateEngine

Location: `lib/intake/template-engine.ts`

**Purpose**: Processes templates and replaces placeholders.

**Key Methods**:

```typescript
class TemplateEngine {
  // Populate template with data
  populateTemplate(
    template: PacketTemplate,
    clientData: Client,
    calculatedValues: Record<string, any>
  ): PacketContent
  
  // Replace placeholders in text
  replacePlaceholders(
    content: string,
    context: Record<string, any>
  ): string
  
  // Evaluate conditional display
  evaluateCondition(
    condition: ConditionalRule | undefined,
    context: Record<string, any>
  ): boolean
  
  // Get value by path (e.g., "client.fullName")
  getValueByPath(
    obj: any,
    path: string
  ): any
}
```

### PDF Export Service

Location: `lib/intake/pdf-export-service.ts`

**Purpose**: Generates PDF files from packet content.

**Key Methods**:

```typescript
class PDFExportService {
  // Generate PDF from packet
  async generatePDF(packet: Packet): Promise<string>
  
  // Format content for PDF
  formatContent(content: PacketContent): string
  
  // Save PDF file
  async savePDF(
    packetId: string,
    pdfBuffer: Buffer
  ): Promise<string>
}
```

### Job Queue

Location: `lib/intake/job-queue.ts`

**Purpose**: Manages background packet generation jobs.

**Key Methods**:

```typescript
class JobQueue {
  // Add job to queue
  async addJob(
    type: 'generate-packet',
    data: { clientId: string; packetType: PacketType }
  ): Promise<string>
  
  // Process jobs
  async processJobs(): Promise<void>
  
  // Retry failed job
  async retryJob(jobId: string): Promise<void>
  
  // Get job status
  async getJobStatus(jobId: string): Promise<JobStatus>
}
```

### Cache Service

Location: `lib/intake/cache-service.ts`

**Purpose**: Caches frequently accessed data for performance.

**Key Methods**:

```typescript
class CacheService {
  // Get from cache
  async get<T>(key: string): Promise<T | null>
  
  // Set in cache
  async set<T>(
    key: string,
    value: T,
    ttl?: number
  ): Promise<void>
  
  // Delete from cache
  async delete(key: string): Promise<void>
  
  // Clear all cache
  async clear(): Promise<void>
}
```

### Validation Service

Location: `lib/validation.ts`

**Purpose**: Validates user input and data.

**Key Methods**:

```typescript
// Validate email
function validateEmail(email: string): boolean

// Validate password strength
function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
}

// Sanitize input
function sanitizeInput(input: string): string

// Validate intake responses
function validateIntakeResponses(
  responses: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; errors: string[] }
```

---

## Testing

### Test Structure

Tests are located in `lib/intake/__tests__/`

```
lib/intake/__tests__/
├── branching-logic.test.ts    # Branching logic evaluation
├── validation.test.ts         # Input validation
├── template-engine.test.ts    # Template processing
├── packet-routing.test.ts     # Packet routing logic
├── integration.test.ts        # Integration tests
└── e2e.test.ts               # End-to-end tests
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test branching-logic.test.ts

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { IntakeService } from '../intake-service';

describe('IntakeService', () => {
  describe('evaluateBranchingLogic', () => {
    it('should show blocks when condition is met', () => {
      const service = new IntakeService();
      const responses = { 'has-injuries': true };
      const rules = [{
        id: 'show-injury-details',
        condition: {
          type: 'equals',
          questionId: 'has-injuries',
          value: true
        },
        action: {
          type: 'show',
          targetBlockIds: ['injury-details']
        }
      }];
      
      const result = service.evaluateBranchingLogic(responses, rules);
      expect(result).toContain('injury-details');
    });
  });
});
```

### Integration Test Example

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '@/lib/db';

describe('Intake Submission Flow', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.client.deleteMany();
    await prisma.packet.deleteMany();
  });
  
  it('should create client and queue packets', async () => {
    const userId = 'test-user-id';
    const responses = {
      'full-name': 'Test User',
      'email': 'test@example.com',
      'goal': 'weight-loss'
    };
    
    const service = new IntakeService();
    const result = await service.submitIntake(
      userId,
      'NUTRITION_ONLY',
      responses
    );
    
    expect(result.clientId).toBeDefined();
    expect(result.packetIds).toHaveLength(1);
    
    const client = await prisma.client.findUnique({
      where: { id: result.clientId }
    });
    expect(client).toBeDefined();
    expect(client?.clientType).toBe('NUTRITION_ONLY');
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('complete nutrition intake flow', async ({ page }) => {
  // Navigate to intake
  await page.goto('/intake');
  
  // Select path
  await page.click('[data-testid="path-nutrition-only"]');
  
  // Fill out form
  await page.fill('[name="full-name"]', 'Test User');
  await page.fill('[name="email"]', 'test@example.com');
  await page.selectOption('[name="goal"]', 'weight-loss');
  
  // Submit
  await page.click('[data-testid="submit-intake"]');
  
  // Verify redirect to dashboard
  await expect(page).toHaveURL('/dashboard');
  
  // Verify packet appears
  await expect(page.locator('[data-testid="packet-nutrition"]')).toBeVisible();
});
```

---

## Deployment

### Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://yourdomain.com"

# Email (for notifications)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-password"
SMTP_FROM="noreply@yourdomain.com"

# Optional: AI Integration
OPENAI_API_KEY="sk-..."
AI_MODEL="gpt-4"

# Optional: Redis (for caching)
REDIS_URL="redis://localhost:6379"

# File Storage
PACKET_STORAGE_PATH="/var/data/packets"
PDF_EXPORT_SERVICE_URL="http://localhost:3001"
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data
npm run seed:questions
npm run seed:paths
npm run seed:templates
```

### Build and Deploy

```bash
# Install dependencies
npm install

# Build application
npm run build

# Start production server
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Monitoring

**Recommended Tools**:
- Error tracking: Sentry
- Performance monitoring: New Relic or Datadog
- Log aggregation: LogRocket or Papertrail
- Uptime monitoring: Pingdom or UptimeRobot

**Key Metrics to Monitor**:
- Intake completion rate
- Packet generation success rate
- Average packet generation time
- API response times
- Error rates by endpoint
- Database query performance

### Scaling Considerations

**Horizontal Scaling**:
- Deploy multiple Next.js instances behind load balancer
- Use Redis for session storage
- Separate background job workers

**Database Scaling**:
- Use read replicas for analytics queries
- Implement connection pooling
- Consider database sharding for large datasets

**Background Jobs**:
- Use dedicated job queue service (BullMQ, pg-boss)
- Scale workers independently
- Implement job prioritization

**Caching**:
- Cache question blocks and intake paths
- Cache packet templates
- Use CDN for static assets and PDFs

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Seed data
npm run seed:all

# Start development server
npm run dev
```

### Code Style

**Linting**:
```bash
npm run lint
```

**Formatting**:
```bash
npm run format
```

**Type Checking**:
```bash
npm run type-check
```

### Git Workflow

**Branch Naming**:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

**Commit Messages**:
```
type(scope): description

Examples:
feat(intake): add youth program path
fix(packets): resolve PDF generation error
refactor(templates): improve placeholder parsing
docs(api): update endpoint documentation
```

### Pull Request Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Run linting and type checking
4. Create pull request with description
5. Request code review
6. Address feedback
7. Merge after approval

---

## Troubleshooting

### Common Issues

**Packet Generation Fails**

*Symptoms*: Packets stuck in PENDING or FAILED status

*Possible Causes*:
- Missing template
- Invalid client data
- Background job not running
- Database connection issue

*Solutions*:
1. Check error logs in packet.lastError
2. Verify template exists and is valid
3. Ensure background job processor is running
4. Check database connectivity

**Branching Logic Not Working**

*Symptoms*: Questions not showing/hiding as expected

*Possible Causes*:
- Incorrect condition syntax
- Question ID mismatch
- Response data not saved

*Solutions*:
1. Verify condition syntax in intake path
2. Check question IDs match exactly
3. Confirm responses are being saved
4. Test logic with console logging

**Template Placeholders Not Replaced**

*Symptoms*: `{{placeholder}}` appears in generated packet

*Possible Causes*:
- Incorrect placeholder path
- Missing data in client profile
- Template engine error

*Solutions*:
1. Verify placeholder path matches data structure
2. Check client data includes required fields
3. Review template engine logs
4. Test with sample data

### Debug Mode

Enable debug logging:

```typescript
// In .env
DEBUG=true
LOG_LEVEL=debug

// In code
import { logger } from '@/lib/logger';

logger.debug('Evaluating branching logic', { responses, rules });
```

### Performance Issues

**Slow Intake Loading**

*Solutions*:
- Enable caching for question blocks
- Optimize database queries
- Reduce payload size
- Implement lazy loading

**Slow Packet Generation**

*Solutions*:
- Profile template processing
- Optimize calculations
- Use background jobs
- Cache templates

---

## Best Practices

### Code Organization

- Keep components small and focused
- Use TypeScript for type safety
- Implement error boundaries
- Write comprehensive tests
- Document complex logic

### Security

- Validate all user input
- Sanitize data before storage
- Use parameterized queries
- Implement rate limiting
- Follow OWASP guidelines

### Performance

- Minimize database queries
- Use indexes appropriately
- Implement caching strategically
- Optimize bundle size
- Use lazy loading

### Maintainability

- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions small and pure
- Follow consistent naming conventions
- Update documentation with changes

---

## Additional Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Related Guides

- User Guide: `docs/USER_GUIDE.md`
- Admin Guide: `docs/ADMIN_GUIDE.md`
- API Reference: `docs/API_REFERENCE.md` (if separate)

### Support

- Technical Issues: Create GitHub issue
- Questions: Contact development team
- Security Issues: security@afyaperformance.com

---

*Last Updated: November 2025*
