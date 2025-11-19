# Error Handling and Validation Guide

This document describes the comprehensive error handling and validation system implemented in the AFYA application.

## Overview

The error handling system provides:
- Custom error types for different failure scenarios
- Validation helpers for common data types
- Error boundary components for graceful error display
- Toast notification system for user feedback
- Retry logic for transient failures
- Comprehensive error logging

## Components

### 1. Validation Helpers (`lib/utils.ts`)

#### Email Validation
```typescript
import { isValidEmail } from '@/lib/utils';

if (!isValidEmail(email)) {
  throw new ValidationError('Invalid email format', 'email');
}
```

#### String Validation
```typescript
import { isNonEmptyString } from '@/lib/utils';

if (!isNonEmptyString(name)) {
  throw new ValidationError('Name is required', 'name');
}
```

#### Other Validators
- `isPositiveNumber(value)` - Validates positive numbers
- `isInRange(value, min, max)` - Validates number ranges
- `isValidUrl(url)` - Validates URL format
- `sanitizeInput(input)` - Sanitizes user input to prevent XSS

### 2. Custom Error Types

#### ValidationError
Used for input validation failures:
```typescript
throw new ValidationError('Email is required', 'email');
```

#### AuthenticationError
Used for authentication failures:
```typescript
throw new AuthenticationError('Invalid credentials');
```

#### AuthorizationError
Used for permission/access control failures:
```typescript
throw new AuthorizationError('Insufficient permissions');
```

#### NotFoundError
Used when resources are not found:
```typescript
throw new NotFoundError('Client not found', clientId);
```

#### ConflictError
Used for duplicate/conflict scenarios:
```typescript
throw new ConflictError('Email already exists', 'email');
```

#### DatabaseError
Used for database operation failures:
```typescript
throw new DatabaseError('Query failed', originalError);
```

#### ExternalServiceError
Used for external API/service failures:
```typescript
throw new ExternalServiceError('Google API failed', 'google-drive');
```

### 3. Error Handling in API Routes

#### Basic Pattern
```typescript
import {
  ValidationError,
  formatErrorResponse,
  getErrorStatusCode,
  logError,
  handlePrismaError,
} from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    // Validate input
    if (!isValidEmail(email)) {
      throw new ValidationError('Invalid email', 'email');
    }

    // Perform operation
    const result = await prisma.client.create({ ... });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    // Log error
    logError(error, { endpoint: '/api/example' });

    // Handle Prisma errors
    if (error?.code?.startsWith('P')) {
      const prismaError = handlePrismaError(error);
      return NextResponse.json(
        formatErrorResponse(prismaError),
        { status: getErrorStatusCode(prismaError) }
      );
    }

    // Handle custom errors
    if (error instanceof ValidationError) {
      return NextResponse.json(
        formatErrorResponse(error),
        { status: getErrorStatusCode(error) }
      );
    }

    // Generic error
    return NextResponse.json(
      formatErrorResponse(new Error('Operation failed')),
      { status: 500 }
    );
  }
}
```

### 4. Retry Logic

Use `retryWithBackoff` for operations that may fail transiently:

```typescript
import { retryWithBackoff } from '@/lib/utils';

const data = await retryWithBackoff(
  async () => {
    const response = await fetch('/api/endpoint');
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  },
  {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
  }
);
```

### 5. Error Boundary Component

Wrap components to catch and display errors gracefully:

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Layout({ children }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
```

Custom fallback UI:
```typescript
<ErrorBoundary
  fallback={
    <div>Custom error UI</div>
  }
  onError={(error, errorInfo) => {
    // Custom error handling
  }}
>
  {children}
</ErrorBoundary>
```

### 6. Error Display Component

Display errors within components:

```typescript
import { ErrorDisplay } from '@/components/ErrorBoundary';

{error && (
  <ErrorDisplay
    title="Failed to load data"
    message={error}
    onRetry={fetchData}
  />
)}
```

### 7. Toast Notifications

#### Setup
The `ToastProvider` is already configured in the root layout.

#### Usage in Components
```typescript
import { useToast } from '@/components/Toast';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Success!', 'Operation completed successfully');
  };

  const handleError = () => {
    toast.error('Error!', 'Something went wrong');
  };

  const handleWarning = () => {
    toast.warning('Warning!', 'Please review this');
  };

  const handleInfo = () => {
    toast.info('Info', 'Here is some information');
  };

  return <button onClick={handleSuccess}>Click me</button>;
}
```

#### Custom Toast
```typescript
toast.showToast({
  type: 'success',
  title: 'Custom Toast',
  message: 'With custom duration',
  duration: 10000, // 10 seconds
});
```

## Best Practices

### 1. Always Validate Input
```typescript
// ✅ Good
if (!isValidEmail(email)) {
  throw new ValidationError('Invalid email', 'email');
}

// ❌ Bad
// No validation
```

### 2. Use Specific Error Types
```typescript
// ✅ Good
throw new NotFoundError('Client not found', clientId);

// ❌ Bad
throw new Error('Not found');
```

### 3. Log Errors with Context
```typescript
// ✅ Good
logError(error, {
  endpoint: '/api/intake/submit',
  userId: user.id,
  timestamp: new Date().toISOString(),
});

// ❌ Bad
console.error(error);
```

### 4. Handle Prisma Errors
```typescript
// ✅ Good
if (error?.code?.startsWith('P')) {
  const prismaError = handlePrismaError(error);
  // Handle appropriately
}

// ❌ Bad
// Generic error handling for all database errors
```

### 5. Provide User Feedback
```typescript
// ✅ Good
try {
  await submitForm();
  toast.success('Form submitted!');
} catch (error) {
  toast.error('Submission failed', error.message);
}

// ❌ Bad
// Silent failure
```

### 6. Use Retry for Transient Failures
```typescript
// ✅ Good - Retry database queries
const data = await retryWithBackoff(() => prisma.client.findMany());

// ❌ Bad - Don't retry validation errors
const data = await retryWithBackoff(() => {
  if (!isValidEmail(email)) throw new ValidationError('Invalid');
  return prisma.client.create({ ... });
});
```

## Error Response Format

All API errors follow this format:

```typescript
{
  error: string;      // Human-readable error message
  code?: string;      // Machine-readable error code
  field?: string;     // Field name for validation errors
}
```

## HTTP Status Codes

- `400` - Validation errors
- `401` - Authentication errors
- `403` - Authorization errors
- `404` - Not found errors
- `409` - Conflict errors (e.g., duplicate email)
- `500` - Internal server errors
- `502` - External service errors

## Testing Error Handling

### Test Validation
```typescript
// Test invalid email
const response = await fetch('/api/intake/submit', {
  method: 'POST',
  body: JSON.stringify({ email: 'invalid' }),
});
expect(response.status).toBe(400);
```

### Test Error Boundaries
```typescript
// Trigger error in component
const ThrowError = () => {
  throw new Error('Test error');
};

render(
  <ErrorBoundary>
    <ThrowError />
  </ErrorBoundary>
);
// Verify error UI is displayed
```

### Test Retry Logic
```typescript
let attempts = 0;
const result = await retryWithBackoff(async () => {
  attempts++;
  if (attempts < 3) throw new Error('Transient error');
  return 'success';
});
expect(attempts).toBe(3);
expect(result).toBe('success');
```

## Monitoring and Logging

In production, errors are logged with:
- Timestamp
- Error type and message
- Stack trace
- Request context (endpoint, user, etc.)

Consider integrating with services like:
- Sentry for error tracking
- LogRocket for session replay
- Datadog for monitoring

## Future Enhancements

- [ ] Add error tracking service integration (Sentry)
- [ ] Implement rate limiting for API endpoints
- [ ] Add request ID tracking for debugging
- [ ] Create error analytics dashboard
- [ ] Add automated error alerting
- [ ] Implement circuit breaker pattern for external services
