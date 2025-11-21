# Educational Modules Requirements

## Overview

This document outlines the educational platform infrastructure added to the AFYA Website V2. The learning management system (LMS) enables AFYA to offer structured courses, track progress, and issue certificates for health and fitness education.

## Database Schema

### Course Model

Tracks educational courses:

```prisma
model Course {
  id                    String
  title                 String
  slug                  String
  description           String
  category              CourseCategory
  level                 CourseLevel
  objectives            String? // JSON array
  prerequisites         String? // JSON array
  thumbnailUrl          String?
  trailerUrl            String?
  duration              Int? // minutes
  moduleCount           Int
  isFree                Boolean
  price                 Float?
  status                CourseStatus
  publishedAt           DateTime?
  instructorId          String?
  instructor            User?
  modules               CourseModule[]
  enrollments           CourseEnrollment[]
}
```

**Enums:**
- `CourseCategory`: NUTRITION, TRAINING, RECOVERY, MINDSET, LIFESTYLE, GENERAL
- `CourseLevel`: BEGINNER, INTERMEDIATE, ADVANCED, ALL_LEVELS
- `CourseStatus`: DRAFT, PUBLISHED, ARCHIVED

### CourseModule Model

Tracks individual course modules/lessons:

```prisma
model CourseModule {
  id                    String
  courseId              String
  title                 String
  description           String?
  order                 Int
  contentType           ContentType
  contentUrl            String?
  content               String?
  duration              Int? // minutes
  resources             String? // JSON array
  hasQuiz               Boolean
  quizData              String? // JSON
  isPublished           Boolean
  progress              ModuleProgress[]
}
```

**Enums:**
- `ContentType`: VIDEO, ARTICLE, INTERACTIVE, QUIZ, DOWNLOAD

### CourseEnrollment Model

Tracks student enrollments:

```prisma
model CourseEnrollment {
  id                    String
  courseId              String
  userId                String
  status                EnrollmentStatus
  progress              Int // percentage
  completedAt           DateTime?
  certificateUrl        String?
  paymentStatus         PaymentStatus?
  paymentIntentId       String?
  amountPaid            Float?
  enrolledAt            DateTime
  lastAccessedAt        DateTime
}
```

**Enums:**
- `EnrollmentStatus`: ACTIVE, COMPLETED, DROPPED

### ModuleProgress Model

Tracks progress on individual modules:

```prisma
model ModuleProgress {
  id                    String
  moduleId              String
  userId                String
  isCompleted           Boolean
  completedAt           DateTime?
  timeSpent             Int // seconds
  quizScore             Int? // percentage
  quizAttempts          Int
  lastAccessedAt        DateTime
}
```

## Implementation Requirements

### Phase 1: Course Discovery

1. **Learning Center Page** (`/learn`)
   - Course catalog
   - Category filters
   - Level filters
   - Search functionality
   - Featured courses
   - New courses

2. **Course Cards**
   - Thumbnail image
   - Title and description
   - Category and level
   - Duration
   - Module count
   - Price (if applicable)
   - Instructor name
   - Enroll button

3. **Course Filtering**
   - By category
   - By level
   - By price (free/paid)
   - By duration
   - By instructor

### Phase 2: Course Detail & Enrollment

1. **Course Detail Page** (`/learn/[slug]`)
   - Course overview
   - Learning objectives
   - Prerequisites
   - Instructor bio
   - Course curriculum
   - Student reviews
   - Enroll button

2. **Course Curriculum**
   - Module list
   - Module titles
   - Module durations
   - Locked/unlocked status
   - Preview available modules

3. **Enrollment Flow**
   - Click "Enroll"
   - Login required
   - Payment (if paid course)
   - Confirmation
   - Access to course

### Phase 3: Course Player

1. **Course Player Interface**
   - Video player (for video content)
   - Article reader (for text content)
   - Progress bar
   - Module navigation
   - Next/previous buttons
   - Bookmark feature
   - Notes feature

2. **Video Player Features**
   - Play/pause
   - Speed control
   - Quality selection
   - Fullscreen
   - Captions/subtitles
   - Progress tracking

3. **Module Completion**
   - Mark as complete
   - Auto-advance to next module
   - Progress update
   - Unlock next module

### Phase 4: Assessments & Quizzes

1. **Quiz Interface**
   - Multiple choice questions
   - True/false questions
   - Fill in the blank
   - Matching
   - Timer (optional)

2. **Quiz Submission**
   - Submit answers
   - Instant feedback
   - Score calculation
   - Correct answers shown
   - Retry option

3. **Passing Requirements**
   - Minimum score (e.g., 80%)
   - Unlimited attempts
   - Must pass to proceed
   - Certificate requirement

### Phase 5: Progress & Certificates

1. **Student Dashboard** (`/learn/dashboard`)
   - Enrolled courses
   - Course progress
   - Completed courses
   - Certificates earned
   - Continue learning

2. **Progress Tracking**
   - Overall course progress
   - Module completion status
   - Time spent learning
   - Quiz scores
   - Completion date

3. **Certificate Generation**
   - Auto-generate on completion
   - Include student name
   - Include course name
   - Include completion date
   - Include certificate ID
   - Downloadable PDF
   - Shareable link

## API Endpoints

### Public Endpoints

```typescript
// Get all courses
GET /api/learn/courses
Query: {
  category?: CourseCategory;
  level?: CourseLevel;
  isFree?: boolean;
  search?: string;
  page?: number;
}
Response: {
  courses: Course[];
  total: number;
  hasMore: boolean;
}

// Get course details
GET /api/learn/courses/[slug]
Response: {
  course: Course;
  modules: CourseModule[];
  isEnrolled: boolean;
  progress?: number;
}

// Enroll in course
POST /api/learn/courses/[slug]/enroll
Response: {
  enrollment: CourseEnrollment;
}
```

### Student Endpoints

```typescript
// Get my enrollments
GET /api/learn/enrollments
Response: {
  enrollments: CourseEnrollment[];
}

// Get course content
GET /api/learn/courses/[slug]/modules/[moduleId]
Response: {
  module: CourseModule;
  progress: ModuleProgress;
  nextModule: CourseModule?;
}

// Update module progress
POST /api/learn/courses/[slug]/modules/[moduleId]/progress
Request: {
  isCompleted?: boolean;
  timeSpent?: number;
}
Response: {
  progress: ModuleProgress;
  courseProgress: number;
}

// Submit quiz
POST /api/learn/courses/[slug]/modules/[moduleId]/quiz
Request: {
  answers: object;
}
Response: {
  score: number;
  passed: boolean;
  correctAnswers: object;
}

// Get certificate
GET /api/learn/courses/[slug]/certificate
Response: {
  certificateUrl: string;
}
```

### Instructor Endpoints

```typescript
// Create course
POST /api/learn/instructor/courses
Request: { course: CourseInput }
Response: { course: Course }

// Update course
PUT /api/learn/instructor/courses/[id]
Request: { course: Partial<CourseInput> }
Response: { course: Course }

// Create module
POST /api/learn/instructor/courses/[id]/modules
Request: { module: ModuleInput }
Response: { module: CourseModule }

// Get course analytics
GET /api/learn/instructor/courses/[id]/analytics
Response: {
  enrollments: number;
  completions: number;
  averageProgress: number;
  averageRating: number;
}
```

## Business Logic

### Course Pricing

**Free Courses:**
- Introductory content
- Community courses
- Sponsored courses
- Marketing courses

**Paid Courses:**
- Beginner courses: $29-$49
- Intermediate courses: $49-$99
- Advanced courses: $99-$199
- Certification programs: $199-$499

**Membership Benefits:**
- Active clients: 50% off all courses
- Sponsors: Free access to all courses
- Coaches: Free instructor access

### Progress Calculation

```typescript
function calculateCourseProgress(enrollment: CourseEnrollment): number {
  const modules = await db.courseModule.findMany({
    where: { courseId: enrollment.courseId }
  });
  
  const completedModules = await db.moduleProgress.count({
    where: {
      userId: enrollment.userId,
      moduleId: { in: modules.map(m => m.id) },
      isCompleted: true
    }
  });
  
  return Math.round((completedModules / modules.length) * 100);
}
```

### Certificate Eligibility

```typescript
function canIssueCertificate(enrollment: CourseEnrollment): boolean {
  // Must complete all modules
  if (enrollment.progress < 100) return false;
  
  // Must pass all quizzes with 80%+
  const quizModules = await db.courseModule.findMany({
    where: {
      courseId: enrollment.courseId,
      hasQuiz: true
    }
  });
  
  for (const module of quizModules) {
    const progress = await db.moduleProgress.findUnique({
      where: {
        moduleId_userId: {
          moduleId: module.id,
          userId: enrollment.userId
        }
      }
    });
    
    if (!progress || progress.quizScore < 80) {
      return false;
    }
  }
  
  return true;
}
```

### Content Unlocking

**Sequential Unlocking:**
- Modules unlock in order
- Must complete previous module
- Prevents skipping ahead
- Ensures learning progression

**Flexible Unlocking:**
- All modules available immediately
- Can complete in any order
- Better for reference material
- Suitable for advanced learners

## Testing Requirements

### Unit Tests

- Progress calculation
- Certificate eligibility
- Quiz scoring
- Content unlocking logic

### Integration Tests

- Enrollment flow
- Module completion
- Quiz submission
- Certificate generation

### E2E Tests

- Complete course enrollment
- Watch video and complete module
- Take and pass quiz
- Receive certificate

## User Experience

### Course Discovery

1. **Browse Courses**
   - Grid layout
   - Filter sidebar
   - Sort options
   - Search bar

2. **Course Preview**
   - Hover for details
   - Click for full page
   - Preview first module
   - Read reviews

### Learning Experience

1. **Course Player**
   - Clean, distraction-free
   - Easy navigation
   - Progress visible
   - Resources accessible

2. **Mobile Learning**
   - Responsive player
   - Offline downloads (future)
   - Mobile-optimized quizzes
   - Progress sync

3. **Engagement Features**
   - Discussion forums
   - Q&A with instructor
   - Peer interaction
   - Study groups

### Progress Tracking

1. **Visual Progress**
   - Progress bars
   - Completion badges
   - Streak tracking
   - Milestone celebrations

2. **Notifications**
   - New module available
   - Course updates
   - Certificate ready
   - Reminder to continue

## Content Creation

### Instructor Tools

1. **Course Builder**
   - Drag-and-drop curriculum
   - Rich text editor
   - Video uploader
   - Quiz builder
   - Resource manager

2. **Content Guidelines**
   - Video quality standards
   - Audio requirements
   - Transcript requirements
   - Accessibility standards

3. **Review Process**
   - Submit for review
   - Admin approval
   - Feedback loop
   - Publish when ready

### Content Types

**Video Lessons:**
- Talking head
- Screen recording
- Demonstration
- Animation
- Mixed media

**Written Content:**
- Articles
- Guides
- Checklists
- Worksheets
- Templates

**Interactive Content:**
- Quizzes
- Assessments
- Calculators
- Planners
- Trackers

## Future Enhancements

### Phase 6: Advanced Features

- **Live Classes**: Real-time instruction
- **Cohort Learning**: Group-based courses
- **Assignments**: Homework and projects
- **Peer Review**: Student feedback
- **Discussion Forums**: Community interaction
- **Office Hours**: Instructor Q&A
- **Course Bundles**: Package deals
- **Learning Paths**: Curated sequences
- **Micro-Credentials**: Skill badges
- **Continuing Education**: CEU credits

### Integration Opportunities

- Zoom for live classes
- Vimeo for video hosting
- Teachable/Thinkific integration
- LinkedIn Learning sync
- Credential verification
- Resume integration

## Compliance & Quality

### Educational Standards

- Accurate information
- Evidence-based content
- Expert instruction
- Regular updates
- Quality assurance

### Accessibility

- WCAG 2.1 AA compliance
- Closed captions
- Transcripts
- Screen reader support
- Keyboard navigation

### Data Privacy

- Student data protection
- Progress data security
- FERPA compliance (if applicable)
- GDPR compliance
- Opt-out options

## Success Metrics

### Course Metrics

- Enrollment rate
- Completion rate
- Average progress
- Time to complete
- Student satisfaction
- Quiz pass rate

### Platform Metrics

- Total courses
- Total students
- Total completions
- Certificates issued
- Revenue generated
- Instructor satisfaction

### Monitoring

- Course analytics dashboard
- Student engagement tracking
- Drop-off analysis
- Content effectiveness
- A/B testing

## Resources

- [Teachable Best Practices](https://teachable.com/blog/online-course-best-practices)
- [Course Creation Guide](https://www.udemy.com/course-creation/)
- [LMS Selection Guide](https://www.capterra.com/learning-management-system-software/)
- [Educational Video Production](https://www.techsmith.com/blog/educational-video-production/)

## Status

**Current Status**: Infrastructure Ready, Learning Center Placeholder Created
**Next Steps**: Implement Phase 1 (Course Discovery)
**Estimated Effort**: 4-5 sprints for full implementation
**Priority**: Medium (value-add feature)
