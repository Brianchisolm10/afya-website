# Design Document

## Overview

The Dynamic Multi-Path Intake and Packet Generation System is built on a modular architecture that separates intake logic, packet generation, and content delivery. The system uses a question block library approach for maximum reusability, a rules engine for branching logic, and an asynchronous packet generation pipeline for scalability.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│  Client Browser │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Next.js Application             │
│  ┌───────────────────────────────────┐  │
│  │     Intake Form Components        │  │
│  │  - Path Selection                 │  │
│  │  - Dynamic Question Renderer      │  │
│  │  - Progress Tracker               │  │
│  │  - Validation Engine              │  │
│  └───────────────┬───────────────────┘  │
│                  │                       │
│  ┌───────────────▼───────────────────┐  │
│  │      API Routes Layer             │  │
│  │  - Intake Submission              │  │
│  │  - Packet Generation Trigger      │  │
│  │  - Packet Retrieval               │  │
│  │  - Admin Management               │  │
│  └───────────────┬───────────────────┘  │
└──────────────────┼───────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
┌─────────────────┐  ┌──────────────────┐
│  Database       │  │  Packet Queue    │
│  (SQLite/       │  │  (Background     │
│   PostgreSQL)   │  │   Jobs)          │
└─────────────────┘  └────────┬─────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Packet Generator│
                     │  - Template     │
                     │    Engine       │
                     │  - AI/LLM       │
                     │    Integration  │
                     │  - PDF Export   │
                     └─────────────────┘
```

### Component Breakdown

**Frontend Layer:**
- React components for dynamic form rendering
- State management for intake progress
- Real-time validation
- Responsive design for mobile/desktop

**API Layer:**
- RESTful endpoints for intake operations
- Authentication and authorization
- Request validation
- Error handling

**Business Logic Layer:**
- Branching logic engine
- Question block resolver
- Client profile generator
- Packet routing logic

**Data Layer:**
- Prisma ORM for database operations
- Optimized queries for performance
- Transaction management

**Background Processing:**
- Async packet generation queue
- Template rendering engine
- Content generation (AI/manual)
- PDF export service

## Data Models

### Enhanced Prisma Schema

```prisma
// Client Type Enum
enum ClientType {
  NUTRITION_ONLY
  WORKOUT_ONLY
  FULL_PROGRAM
  ATHLETE_PERFORMANCE
  YOUTH
  GENERAL_WELLNESS
  SPECIAL_SITUATION
}

// Packet Type Enum (expanded)
enum PacketType {
  INTRO
  NUTRITION
  WORKOUT
  PERFORMANCE
  YOUTH
  RECOVERY
  WELLNESS
}

// Packet Status
enum PacketStatus {
  PENDING
  GENERATING
  READY
  FAILED
}

// Enhanced Client Model
model Client {
  id                    String       @id @default(cuid())
  userId                String       @unique
  user                  User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Basic Info
  fullName              String
  email                 String       @unique
  
  // Client Classification
  clientType            ClientType
  intakeCompletedAt     DateTime?
  
  // Intake Responses (JSON storage for flexibility)
  intakeResponses       Json?
  
  // Original fields preserved
  goal                  String?
  gender                String?
  dateOfBirth           DateTime?
  heightInches          Int?
  weightLbs             Float?
  
  // Activity & Goals
  activityLevel         String?
  dailyMovementPattern  String?
  mainFitnessGoals      String?
  trainingExperience    String?
  trainingHistory       String?
  
  // Training Preferences
  daysPerWeek           Int?
  sessionDuration       Int?
  preferredWorkoutTime  String?
  availableEquipment    String?
  workoutLocation       String?
  trainingStyle         String?
  coachingStyle         String?
  
  // Health & Wellness
  motivation            String?
  biggestStruggle       String?
  injuries              String?
  medicalConditions     String?
  medications           String?
  painOrDiscomfort      String?
  
  // Nutrition
  dietType              String?
  foodAllergies         String?
  foodsToAvoid          String?
  eatsBreakfast         Boolean?
  eatsAnimalProducts    Boolean?
  mealsPerDay           Int?
  beverageConsumption   String?
  waterIntakeOz         Int?
  typicalDayEating      String?
  favoriteMeals         String?
  preferredMacros       String?
  fastingPattern        String?
  culturalDietaryNeeds  String?
  
  // Delivery & Communication
  deliveryPreference    String?
  wantsWeeklyCheckins   Boolean?
  
  // Youth-Specific
  sportsPlayed          String?
  schoolGrade           String?
  eatsBeforePractice    Boolean?
  staysHydrated         Boolean?
  seasonMotivation      String?
  seasonChallenges      String?
  
  // Athlete-Specific
  sport                 String?
  position              String?
  competitionLevel      String?
  seasonPhase           String?
  trainingAge           Int?
  
  // Performance Metrics
  strengthBenchmarks    Json?
  powerMetrics          Json?
  speedMetrics          Json?
  conditioningMetrics   Json?
  
  // Situation Based
  injuryLocation        String?
  painPatterns          String?
  aggravatingPositions  String?
  medicalClearance      Boolean?
  mobilityLimitations   String?
  recoveryGoals         String?
  
  // Relations
  packets               Packet[]
  intakeProgress        IntakeProgress?
  
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt
  
  @@index([clientType])
  @@index([email])
}

// New: Intake Progress Tracking
model IntakeProgress {
  id                String    @id @default(cuid())
  clientId          String    @unique
  client            Client    @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  selectedPath      ClientType?
  currentStep       Int       @default(0)
  totalSteps        Int?
  responses         Json      @default("{}")
  isComplete        Boolean   @default(false)
  lastSavedAt       DateTime  @default(now())
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

// Enhanced Packet Model
model Packet {
  id                String        @id @default(cuid())
  clientId          String
  client            Client        @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  type              PacketType
  status            PacketStatus  @default(PENDING)
  
  // Content Storage
  content           Json?         // Structured packet data
  docUrl            String?       // Generated document URL
  pdfUrl            String?       // PDF export URL
  
  // Generation Metadata
  templateId        String?
  generatedBy       String?       // 'SYSTEM' or userId of coach
  generationMethod  String?       // 'AI', 'TEMPLATE', 'MANUAL'
  
  // Error Handling
  lastError         String?
  retryCount        Int           @default(0)
  
  // Versioning
  version           Int           @default(1)
  previousVersionId String?
  
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  
  @@index([clientId, type])
  @@index([status])
}

// New: Question Block Library
model QuestionBlock {
  id                String    @id @default(cuid())
  name              String    @unique
  category          String    // 'NUTRITION', 'TRAINING', 'HEALTH', etc.
  questions         Json      // Array of question definitions
  order             Int       @default(0)
  isActive          Boolean   @default(true)
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([category])
}

// New: Intake Path Configuration
model IntakePath {
  id                String    @id @default(cuid())
  clientType        ClientType @unique
  name              String
  description       String
  questionBlocks    Json      // Array of question block IDs in order
  branchingRules    Json      // Conditional logic rules
  isActive          Boolean   @default(true)
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

// New: Packet Template
model PacketTemplate {
  id                String      @id @default(cuid())
  name              String
  packetType        PacketType
  clientType        ClientType?
  
  // Template Content
  sections          Json        // Array of section definitions
  contentBlocks     Json        // Reusable content blocks
  
  // Metadata
  isDefault         Boolean     @default(false)
  createdBy         String?
  
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  
  @@index([packetType, clientType])
}

// Analytics
model IntakeAnalytics {
  id                String    @id @default(cuid())
  clientType        ClientType
  startedAt         DateTime
  completedAt       DateTime?
  abandonedAt       DateTime?
  completionTime    Int?      // seconds
  dropOffStep       Int?
  
  createdAt         DateTime  @default(now())
}
```

## Components and Interfaces

### Frontend Components

#### 1. PathSelectionScreen
```typescript
interface PathOption {
  id: ClientType;
  title: string;
  description: string;
  icon: string;
  estimatedTime: string;
}

interface PathSelectionScreenProps {
  onPathSelect: (path: ClientType) => void;
}
```

**Responsibilities:**
- Display all 7 intake path options
- Provide clear descriptions and time estimates
- Handle path selection and navigation

#### 2. DynamicIntakeForm
```typescript
interface IntakeFormProps {
  clientType: ClientType;
  savedProgress?: IntakeProgress;
  onSubmit: (responses: IntakeResponses) => Promise<void>;
  onSave: (responses: Partial<IntakeResponses>) => Promise<void>;
}

interface IntakeResponses {
  [questionId: string]: any;
}
```

**Responsibilities:**
- Render questions based on selected path
- Handle branching logic
- Auto-save progress
- Validate responses
- Display progress indicator

#### 3. QuestionRenderer
```typescript
interface Question {
  id: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'textarea' | 'date' | 'range';
  label: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: ValidationRule[];
  conditionalDisplay?: ConditionalRule;
  helpText?: string;
}

interface QuestionRendererProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}
```

**Responsibilities:**
- Render appropriate input component based on question type
- Handle user input
- Display validation errors
- Show help text

#### 4. ProgressTracker
```typescript
interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  sections: Array<{ name: string; steps: number }>;
}
```

**Responsibilities:**
- Display visual progress indicator
- Show section names
- Allow navigation between completed sections

#### 5. PacketViewer
```typescript
interface PacketViewerProps {
  packet: Packet;
  onDownload: () => void;
  onPrint: () => void;
}
```

**Responsibilities:**
- Display packet content in readable format
- Provide download/print options
- Handle different packet types

#### 6. AdminPacketManager
```typescript
interface AdminPacketManagerProps {
  client: Client;
  packets: Packet[];
  onEdit: (packetId: string) => void;
  onRegenerate: (packetId: string) => void;
  onDelete: (packetId: string) => void;
}
```

**Responsibilities:**
- Display all client packets
- Show generation status
- Provide management actions
- Allow manual editing

### Backend Services

#### 1. IntakeService
```typescript
class IntakeService {
  async getIntakePath(clientType: ClientType): Promise<IntakePath>;
  async getQuestionBlocks(blockIds: string[]): Promise<QuestionBlock[]>;
  async evaluateBranchingLogic(responses: IntakeResponses, rules: BranchingRule[]): Promise<string[]>;
  async saveProgress(clientId: string, progress: Partial<IntakeProgress>): Promise<void>;
  async submitIntake(clientId: string, responses: IntakeResponses): Promise<Client>;
  async generateClientProfile(responses: IntakeResponses, clientType: ClientType): Promise<ClientProfile>;
}
```

#### 2. PacketRoutingService
```typescript
class PacketRoutingService {
  async determineRequiredPackets(clientType: ClientType, responses: IntakeResponses): Promise<PacketType[]>;
  async queuePacketGeneration(clientId: string, packetType: PacketType): Promise<string>;
  async getPacketStatus(packetId: string): Promise<PacketStatus>;
}
```

#### 3. PacketGenerationService
```typescript
class PacketGenerationService {
  async generatePacket(clientId: string, packetType: PacketType): Promise<Packet>;
  async getTemplate(packetType: PacketType, clientType: ClientType): Promise<PacketTemplate>;
  async populateTemplate(template: PacketTemplate, clientData: Client): Promise<PacketContent>;
  async generateWithAI(clientData: Client, packetType: PacketType): Promise<PacketContent>;
  async exportToPDF(packet: Packet): Promise<string>;
}
```

#### 4. ValidationService
```typescript
class ValidationService {
  validateResponse(question: Question, value: any): ValidationResult;
  validateIntakeCompletion(responses: IntakeResponses, requiredQuestions: string[]): ValidationResult;
  sanitizeInput(value: any, type: string): any;
}
```

## Branching Logic Engine

### Rule Structure

```typescript
interface BranchingRule {
  id: string;
  condition: Condition;
  action: Action;
}

interface Condition {
  type: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'and' | 'or' | 'not';
  questionId?: string;
  value?: any;
  conditions?: Condition[]; // For nested logic
}

interface Action {
  type: 'show' | 'hide' | 'skip' | 'require';
  targetBlockIds: string[];
}
```

### Example Rules

```typescript
// Example: Show athlete-specific questions only if competition level is selected
{
  id: 'athlete-performance-check',
  condition: {
    type: 'equals',
    questionId: 'competition-level',
    value: ['high-school', 'college', 'professional']
  },
  action: {
    type: 'show',
    targetBlockIds: ['performance-metrics', 'periodization-preferences']
  }
}

// Example: Skip nutrition questions for workout-only clients
{
  id: 'skip-nutrition-for-workout-only',
  condition: {
    type: 'equals',
    questionId: 'client-type',
    value: 'WORKOUT_ONLY'
  },
  action: {
    type: 'skip',
    targetBlockIds: ['nutrition-basics', 'meal-planning', 'dietary-restrictions']
  }
}
```

## Packet Generation Pipeline

### Generation Flow

```
1. Intake Submitted
   ↓
2. Client Profile Created
   ↓
3. Packet Types Determined (based on ClientType)
   ↓
4. Packets Queued (status: PENDING)
   ↓
5. Background Job Picks Up Queue
   ↓
6. For Each Packet:
   a. Load Template
   b. Populate with Client Data
   c. Generate Custom Content (AI/Manual)
   d. Format Document
   e. Export to PDF
   f. Store URLs
   g. Update Status to READY
   ↓
7. Notify Client
```

### Template System

Templates are JSON structures with placeholders:

```typescript
interface PacketTemplate {
  sections: Section[];
  contentBlocks: ContentBlock[];
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
  content: string; // Can include {{placeholders}}
  dataSource?: string; // Path to client data
  formatting?: FormattingOptions;
}
```

### Example Nutrition Packet Template

```json
{
  "sections": [
    {
      "id": "overview",
      "title": "Your Nutrition Overview",
      "order": 1,
      "contentBlockIds": ["welcome", "goals-summary", "calorie-target"]
    },
    {
      "id": "macros",
      "title": "Macronutrient Breakdown",
      "order": 2,
      "contentBlockIds": ["macro-chart", "macro-explanation"]
    },
    {
      "id": "meal-plan",
      "title": "Sample Meal Plan",
      "order": 3,
      "contentBlockIds": ["daily-schedule", "meal-examples", "recipes"]
    }
  ],
  "contentBlocks": [
    {
      "id": "welcome",
      "type": "text",
      "content": "Welcome {{client.fullName}}! This nutrition plan is designed specifically for your goal of {{client.goal}}."
    },
    {
      "id": "calorie-target",
      "type": "text",
      "content": "Based on your activity level ({{client.activityLevel}}) and goals, your daily calorie target is {{calculated.dailyCalories}} calories."
    },
    {
      "id": "macro-chart",
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

## AI Integration for Packet Generation

### AI-Powered Content Generation

For more personalized and dynamic content, integrate with AI services:

```typescript
interface AIGenerationConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  model: string;
  temperature: number;
  maxTokens: number;
}

class AIPacketGenerator {
  async generateNutritionPlan(client: Client): Promise<NutritionPlanContent> {
    const prompt = this.buildNutritionPrompt(client);
    const response = await this.callAI(prompt);
    return this.parseNutritionResponse(response);
  }
  
  async generateWorkoutPlan(client: Client): Promise<WorkoutPlanContent> {
    const prompt = this.buildWorkoutPrompt(client);
    const response = await this.callAI(prompt);
    return this.parseWorkoutResponse(response);
  }
  
  private buildNutritionPrompt(client: Client): string {
    return `
      Create a personalized nutrition plan for:
      - Name: ${client.fullName}
      - Goal: ${client.goal}
      - Activity Level: ${client.activityLevel}
      - Dietary Restrictions: ${client.foodAllergies}, ${client.foodsToAvoid}
      - Cultural Needs: ${client.culturalDietaryNeeds}
      - Preferences: ${client.favoriteMeals}
      
      Include:
      1. Daily calorie target with explanation
      2. Macronutrient breakdown (protein, carbs, fats)
      3. Meal timing recommendations
      4. Sample meal plan for 3 days
      5. Shopping list
      6. Practical tips for adherence
      
      Format as structured JSON.
    `;
  }
}
```

## Error Handling

### Packet Generation Failures

```typescript
interface PacketGenerationError {
  packetId: string;
  errorType: 'TEMPLATE_ERROR' | 'DATA_ERROR' | 'AI_ERROR' | 'EXPORT_ERROR';
  message: string;
  retryable: boolean;
}

class PacketErrorHandler {
  async handleGenerationError(error: PacketGenerationError): Promise<void> {
    // Log error
    await this.logError(error);
    
    // Update packet status
    await prisma.packet.update({
      where: { id: error.packetId },
      data: {
        status: 'FAILED',
        lastError: error.message,
        retryCount: { increment: 1 }
      }
    });
    
    // Retry if appropriate
    if (error.retryable && await this.shouldRetry(error.packetId)) {
      await this.queueRetry(error.packetId);
    } else {
      // Notify admin
      await this.notifyAdmin(error);
    }
  }
  
  private async shouldRetry(packetId: string): Promise<boolean> {
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      select: { retryCount: true }
    });
    return packet && packet.retryCount < 3;
  }
}
```

## Testing Strategy

### Unit Tests
- Question rendering logic
- Validation rules
- Branching logic evaluation
- Template population
- Data transformations

### Integration Tests
- Intake submission flow
- Packet generation pipeline
- API endpoints
- Database operations

### End-to-End Tests
- Complete intake flows for each path
- Packet generation and delivery
- Admin management workflows
- Client dashboard access

### Performance Tests
- Concurrent intake submissions
- Packet generation under load
- Database query optimization
- API response times

## Security Considerations

### Data Protection
- Encrypt sensitive health information at rest
- Use HTTPS for all data transmission
- Implement proper authentication and authorization
- Sanitize all user inputs

### Access Control
- Clients can only access their own packets
- Coaches can access assigned client data
- Admins have full access with audit logging
- Role-based permissions for all operations

### HIPAA Compliance Considerations
- If handling protected health information (PHI), implement:
  - Business Associate Agreements (BAAs)
  - Audit logging for all PHI access
  - Data retention and deletion policies
  - Breach notification procedures

## Performance Optimization

### Caching Strategy
- Cache question blocks and intake paths
- Cache packet templates
- Use Redis for session management
- Implement CDN for static assets

### Database Optimization
- Index frequently queried fields
- Use database transactions for consistency
- Implement connection pooling
- Optimize JSON queries

### Async Processing
- Use background job queue for packet generation
- Implement job prioritization
- Handle job failures gracefully
- Monitor queue health

## Deployment Considerations

### Environment Variables
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
AI_API_KEY=
AI_MODEL=
PACKET_STORAGE_PATH=
PDF_EXPORT_SERVICE_URL=
REDIS_URL=
```

### Scaling Strategy
- Horizontal scaling for web servers
- Separate worker processes for packet generation
- Database read replicas for reporting
- CDN for packet delivery

## Future Enhancements

### Phase 2 Features
- Mobile app for intake completion
- Video exercise demonstrations
- Progress tracking and check-ins
- Automated packet updates based on progress
- Integration with wearable devices
- Multi-language support
- White-label options for coaches

### Advanced AI Features
- Conversational intake (chatbot)
- Real-time nutrition tracking
- Adaptive workout progression
- Predictive analytics for client success
