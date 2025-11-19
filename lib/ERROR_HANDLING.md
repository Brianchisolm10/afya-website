# Error Handling Guide

This document describes the standardized error handling system used throughout the AFYA application.

## Overview

The error handling system provides:
- **Standardized error types** for common scenarios
- **Consistent error responses** across all API endpoints
- **Automatic error logging** with severity levels
- **Audit logging** for security-relevant errors
- **Helper functions** for common validation and error scenarios

## Error Types

### Custom Error Classes

All custom errors extend the base `Error` class and include additional metadata:

- **ValidationError**: Invalid input data (400)
- **AuthenticationError**: Authentication required or failed (401)
- **AuthorizationError**: Insufficient permissions (403)
- **NotFoundError**: Resource not found (404)
- **ConflictError**: Resource already exists or conflict (409)
- **DatabaseError**: Database operation failed (500)
- **ExternalServiceError**: External service error (502)

### Error Response Format

All API errors follow this standardized format:

```typescript
{
  error: string;        // Human-readable error message
  code?: string;        // Machine-readable error code
  field?: string;       // Field name for validation errors
  details?: object;     // Additional error details
  timestamp?: string;   // ISO timestamp of error
}
```

## Using Error Handlers in API Routes

### Basic Error Handling

Use the `handleError` function as a catch-all in your try-catch blocks:

```typescript
import { handleError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    // Your API logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error, { 
      endpoint: '/api/example',
      method: 'POST' 
    });
  }
}
```

### Validation Errors

Use validation helpers for common scenarios:

```typescript
import { validateRequiredFields, validateEmail, validationError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const fieldError = validateRequiredFields(body, ['email', 'name']);
    if (fieldError) return fieldError;
    
    // Validate email format
    const emailError = validateEmail(body.email);
    if (emailError) return emailError;
    
    // Custom validation
    if (body.age < 18) {
      return validationError('Must be 18 or older', 'age');
    }
    
    // Continue with logic...
  } catch (error) {
    return handleError(error);
  }
}
```

### Authentication Errors

Use authentication helpers with audit logging:

```typescript
import { handleAuthenticationFailure, authenticationError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    const user = await findUserByEmail(email);
    if (!user) {
      return await handleAuthenticationFailure(
        email,
        'User not found',
        request.headers.get('x-forwarded-for')
      );
    }
    
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return await handleAuthenticationFailure(
        email,
        'Invalid password',
        request.headers.get('x-forwarded-for')
      );
    }
    
    // Continue with login...
  } catch (error) {
    return handleError(error);
  }
}
```

### Authorization Errors

Use authorization helpers with audit logging:

```typescript
import { handleAuthorizationFailure } from '@/lib/errors';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return authenticationError();
    }
    
    if (session.user.role !== 'ADMIN') {
      return await handleAuthorizationFailure(
        session.user.id,
        '/api/admin/users',
        'ADMIN',
        request.headers.get('x-forwarded-for')
      );
    }
    
    // Continue with admin logic...
  } catch (error) {
    return handleError(error);
  }
}
```

### Rate Limit Errors

Use rate limit helpers with audit logging:

```typescript
import { handleRateLimitViolation } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    const rateLimitResult = checkLoginRateLimit(email);
    if (!rateLimitResult.success) {
      return await handleRateLimitViolation(
        email,
        'login',
        rateLimitResult.retryAfter || 900,
        request.headers.get('x-forwarded-for')
      );
    }
    
    // Continue with login...
  } catch (error) {
    return handleError(error);
  }
}
```

### Other Common Errors

```typescript
import { notFoundError, conflictError, internalServerError } from '@/lib/errors';

// Resource not found
const user = await prisma.user.findUnique({ where: { id } });
if (!user) {
  return notFoundError('User not found', 'user');
}

// Conflict (duplicate)
const existing = await prisma.user.findUnique({ where: { email } });
if (existing) {
  return conflictError('A user with this email already exists', 'email');
}

// Internal server error
if (!process.env.REQUIRED_VAR) {
  return internalServerError('Server configuration error');
}
```

## Error Logging

### Automatic Logging

All errors are automatically logged with:
- Timestamp
- Error name and message
- Severity level (low, medium, high, critical)
- Stack trace (in development only)
- Additional context

### Manual Logging

You can manually log errors with context:

```typescript
import { logError } from '@/lib/utils';

try {
  await someOperation();
} catch (error) {
  logError(error as Error, {
    userId: session.user.id,
    operation: 'someOperation',
    additionalData: { foo: 'bar' }
  });
  throw error;
}
```

### Error Severity Levels

Errors are automatically assigned severity levels:

- **Low**: ValidationError, NotFoundError
- **Medium**: ConflictError, ExternalServiceError
- **High**: AuthenticationError, AuthorizationError
- **Critical**: DatabaseError

## Audit Logging

Security-relevant errors are automatically logged to the audit log:

### Authentication Failures

```typescript
await logAuthenticationFailure(email, reason, ipAddress);
```

Logs:
- Failed login attempts
- Invalid credentials
- Suspended account access attempts

### Authorization Failures

```typescript
await logAuthorizationFailure(userId, resource, requiredRole, ipAddress);
```

Logs:
- Unauthorized access attempts
- Insufficient permissions
- Role-based access violations

### Rate Limit Violations

```typescript
await logRateLimitViolation(identifier, limitType, ipAddress);
```

Logs:
- Login rate limit exceeded
- Password reset rate limit exceeded
- Account creation rate limit exceeded

## Best Practices

### 1. Always Use Try-Catch

Wrap all API route logic in try-catch blocks:

```typescript
export async function POST(request: NextRequest) {
  try {
    // Your logic here
  } catch (error) {
    return handleError(error);
  }
}
```

### 2. Validate Early

Validate input data before processing:

```typescript
// Validate required fields first
const fieldError = validateRequiredFields(body, ['email', 'password']);
if (fieldError) return fieldError;

// Then validate formats
const emailError = validateEmail(body.email);
if (emailError) return emailError;

// Then business logic validation
if (body.age < 18) {
  return validationError('Must be 18 or older', 'age');
}
```

### 3. Use Specific Error Types

Throw specific error types for better error handling:

```typescript
if (!user) {
  throw new NotFoundError('User not found', 'user');
}

if (user.status === 'SUSPENDED') {
  throw new AuthenticationError('Account is suspended');
}

if (existingEmail) {
  throw new ConflictError('Email already exists', 'email');
}
```

### 4. Include Context in Logs

Always include relevant context when logging errors:

```typescript
return handleError(error, {
  endpoint: request.url,
  method: request.method,
  userId: session?.user?.id,
  timestamp: new Date().toISOString()
});
```

### 5. Don't Expose Internal Details

Never expose internal error details to clients:

```typescript
// ❌ Bad
return NextResponse.json({ 
  error: error.message,  // Might expose internal details
  stack: error.stack      // Never expose stack traces
});

// ✅ Good
return handleError(error);  // Sanitizes error messages
```

### 6. Log Security Events

Always log security-relevant events:

```typescript
// Failed authentication
await handleAuthenticationFailure(email, reason, ipAddress);

// Failed authorization
await handleAuthorizationFailure(userId, resource, role, ipAddress);

// Rate limit violations
await handleRateLimitViolation(identifier, type, retryAfter, ipAddress);
```

## Testing Error Handling

### Unit Tests

Test error handling logic:

```typescript
describe('Error Handling', () => {
  it('should return 400 for validation errors', () => {
    const error = new ValidationError('Invalid email', 'email');
    const response = formatErrorResponse(error);
    expect(response.code).toBe('VALIDATION_ERROR');
    expect(response.field).toBe('email');
  });
  
  it('should return 401 for authentication errors', () => {
    const error = new AuthenticationError();
    const statusCode = getErrorStatusCode(error);
    expect(statusCode).toBe(401);
  });
});
```

### Integration Tests

Test API error responses:

```typescript
describe('POST /api/users', () => {
  it('should return 400 for missing fields', async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({})
    });
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.code).toBe('VALIDATION_ERROR');
  });
  
  it('should return 409 for duplicate email', async () => {
    await createUser({ email: 'test@example.com' });
    
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' })
    });
    
    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.code).toBe('DUPLICATE_ENTRY');
  });
});
```

## Migration Guide

To migrate existing API routes to use the new error handling system:

### Before

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Logic...
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### After

```typescript
import { handleError, validateRequiredFields } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const fieldError = validateRequiredFields(body, ['email']);
    if (fieldError) return fieldError;
    
    // Logic...
  } catch (error) {
    return handleError(error, { endpoint: '/api/example' });
  }
}
```

## Summary

The error handling system provides:

✅ Consistent error responses across all endpoints  
✅ Automatic error logging with severity levels  
✅ Audit logging for security events  
✅ Helper functions for common scenarios  
✅ Type-safe error handling  
✅ Production-ready error sanitization  

Use the provided utilities to ensure consistent, secure, and maintainable error handling throughout the application.
