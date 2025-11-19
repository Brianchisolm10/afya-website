# Packet Editor & Interactive Viewer Implementation Plan

## Overview

Two major features needed:
1. **Packet Editor** - Admin/coach interface to edit packets before sending to clients
2. **Interactive Packet Viewer** - Client interface with info tooltips for exercises, foods, and metrics

## 1. Packet Editor (Admin/Coach Interface)

### Features Needed

- **Edit Packet Content**
  - Rich text editor for sections
  - Add/remove/reorder exercises
  - Modify nutrition recommendations
  - Adjust macros and calories
  - Edit meal plans
  - Add custom notes

- **Version Control**
  - Track changes
  - Save drafts
  - Revert to previous versions
  - Approval workflow

- **Collaboration**
  - Multiple coaches can edit
  - Comments and notes
  - Assignment to specific coach/nutritionist

- **Status Management**
  - Draft → Review → Approved → Sent
  - Lock packets once sent
  - Allow revisions after sending

### Database Changes Needed

```prisma
model PacketVersion {
  id          String   @id @default(cuid())
  packetId    String
  packet      Packet   @relation(fields: [packetId], references: [id])
  version     Int
  content     Json
  editedBy    String
  editor      User     @relation(fields: [editedBy], references: [id])
  changes     String?  // Description of changes
  createdAt   DateTime @default(now())
}

model PacketComment {
  id        String   @id @default(cuid())
  packetId  String
  packet    Packet   @relation(fields: [packetId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  content   String
  resolved  Boolean  @default(false)
  createdAt DateTime @default(now())
}

// Update Packet model
model Packet {
  // ... existing fields
  status        PacketStatus @default(DRAFT)
  approvedBy    String?
  approver      User?        @relation("ApprovedPackets", fields: [approvedBy], references: [id])
  approvedAt    DateTime?
  sentAt        DateTime?
  versions      PacketVersion[]
  comments      PacketComment[]
  locked        Boolean      @default(false)
}

enum PacketStatus {
  DRAFT
  PENDING      // Generated, awaiting review
  IN_REVIEW    // Being edited by coach
  APPROVED     // Ready to send
  SENT         // Sent to client
  READY        // Keep for backward compatibility
  GENERATING
  FAILED
}
```

### UI Components Needed

1. **Packet Editor Page** (`app/(protected)/admin/packets/[id]/edit/page.tsx`)
   - Split view: Original vs Edited
   - Section-by-section editing
   - Rich text editor (TipTap or similar)
   - Save draft / Approve / Send buttons

2. **Exercise Editor Component**
   - Add/edit exercise details
   - Sets, reps, rest periods
   - Form cues and safety notes
   - Video upload (future)

3. **Nutrition Editor Component**
   - Adjust calories and macros
   - Edit meal plans
   - Modify food lists
   - Add substitutions

4. **Version History Component**
   - List all versions
   - Compare versions
   - Restore previous version

5. **Comments Sidebar**
   - Add comments to sections
   - Tag other coaches
   - Mark as resolved

### API Endpoints Needed

- `GET /api/packets/[id]/edit` - Get packet for editing
- `PUT /api/packets/[id]/edit` - Save draft changes
- `POST /api/packets/[id]/approve` - Approve packet
- `POST /api/packets/[id]/send` - Send to client
- `GET /api/packets/[id]/versions` - Get version history
- `POST /api/packets/[id]/versions/[versionId]/restore` - Restore version
- `POST /api/packets/[id]/comments` - Add comment
- `GET /api/packets/[id]/comments` - Get comments

## 2. Interactive Packet Viewer (Client Interface)

### Features Needed

- **Info Tooltips**
  - Hover/click "i" icon for more info
  - Exercise descriptions and form cues
  - Food nutritional information
  - Metric explanations (BMR, TDEE, etc.)
  - Safety warnings

- **Rich Content**
  - Images for exercises (future)
  - Video demonstrations (future)
  - Expandable sections
  - Print-friendly view

- **Interactive Elements**
  - Check off completed workouts
  - Mark meals as eaten
  - Track progress
  - Notes and feedback

### Database for Info Content

```prisma
model ExerciseInfo {
  id              String   @id @default(cuid())
  name            String   @unique
  description     String
  musclesWorked   String[]
  equipment       String[]
  difficulty      String
  formCues        String[]
  commonMistakes  String[]
  safetyNotes     String[]
  videoUrl        String?
  imageUrl        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model FoodInfo {
  id              String   @id @default(cuid())
  name            String   @unique
  description     String
  calories        Int
  protein         Float
  carbs           Float
  fats            Float
  servingSize     String
  benefits        String[]
  alternatives    String[]
  prepTips        String[]
  imageUrl        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model MetricInfo {
  id          String   @id @default(cuid())
  key         String   @unique  // e.g., "BMR", "TDEE", "macros"
  name        String
  description String
  formula     String?
  explanation String
  tips        String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### UI Components Needed

1. **Interactive Packet Viewer** (`app/(protected)/packets/[id]/view/page.tsx`)
   - Clean, readable layout
   - Info icons throughout
   - Expandable sections
   - Print button
   - Download PDF button

2. **Info Tooltip Component**
   - Hover or click to show
   - Rich content (text, lists, images)
   - Responsive design
   - Accessible (keyboard navigation)

3. **Exercise Card with Info**
   - Exercise name with info icon
   - Sets/reps/rest
   - Expandable details
   - Form cues
   - Video player (future)

4. **Nutrition Info Component**
   - Food items with info icons
   - Nutritional breakdown
   - Alternatives and substitutions
   - Preparation tips

5. **Metric Explainer Component**
   - Metric value with info icon
   - Formula and calculation
   - What it means
   - How to use it

### API Endpoints Needed

- `GET /api/info/exercises/[name]` - Get exercise info
- `GET /api/info/foods/[name]` - Get food info
- `GET /api/info/metrics/[key]` - Get metric info
- `POST /api/info/exercises` - Add/update exercise info (admin)
- `POST /api/info/foods` - Add/update food info (admin)
- `POST /api/info/metrics` - Add/update metric info (admin)

## Implementation Priority

### Phase 1: Basic Packet Editor (High Priority)
1. Update database schema
2. Create basic edit page
3. Implement save/approve workflow
4. Add status management

### Phase 2: Interactive Viewer (High Priority)
1. Create info content database
2. Seed with common exercises/foods/metrics
3. Build tooltip component
4. Integrate into packet viewer

### Phase 3: Advanced Editor Features (Medium Priority)
1. Version control
2. Comments and collaboration
3. Rich text editing
4. Split view comparison

### Phase 4: Enhanced Viewer (Medium Priority)
1. Progress tracking
2. Check-off functionality
3. Client notes and feedback
4. Print optimization

### Phase 5: Media Integration (Lower Priority)
1. Exercise images
2. Video demonstrations
3. Food images
4. Interactive diagrams

## Technical Considerations

### Libraries to Add

```json
{
  "@tiptap/react": "^2.1.0",           // Rich text editor
  "@tiptap/starter-kit": "^2.1.0",     // Editor extensions
  "@radix-ui/react-tooltip": "^1.0.0", // Accessible tooltips
  "@radix-ui/react-dialog": "^1.0.0",  // Modal dialogs
  "react-diff-viewer": "^3.1.1"        // Version comparison
}
```

### Performance

- Lazy load info content
- Cache frequently accessed info
- Optimize PDF generation for edited packets
- Use optimistic UI updates

### Security

- Only admins/coaches can edit
- Clients can only view their own packets
- Audit log for all changes
- Lock packets after sending (optional unlock)

## Next Steps

1. Get approval on approach
2. Update database schema
3. Start with Phase 1 (Basic Editor)
4. Build Phase 2 (Interactive Viewer) in parallel
5. Iterate based on feedback

## Questions to Resolve

1. Should clients be able to provide feedback on packets?
2. Should there be a formal approval process or can coaches send directly?
3. Do you want email notifications when packets are ready?
4. Should edited packets regenerate PDFs automatically?
5. How many coaches/nutritionists will be editing simultaneously?
