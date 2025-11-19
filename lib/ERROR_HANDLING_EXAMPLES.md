# Error Handling Examples

This document provides practical examples of using the error handling system in API routes.

## Example 1: Basic API Route with Validation

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { handleError, validateRequiredFields, validateEmail } from '@/lib/errors';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const fieldError = validateRequiredFields(body, ['email', 'name']);
    if (fieldError) return fieldError;
    
    // Validate email format
    const emailError = validateEmail(body.email);
    if (emailError) return emailError;
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
      },
    });
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return handleError(error, {
      endpoint: '/api/users',
      method: 'POST',
    });
  }
}
```

## Example 2: Authentication with Rate Limiting

```typescript
import { NextRequest } from 'next/server';
import { 
  handleError, 
  handleAuthenticationFailure,
  handleRateLimitViolation,
  validateRequiredFields 
} from '@/lib/errors';
import { checkLoginRateLimit } from '@/lib/ratelimit';
import { verifyPassword } from '@/lib/password';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ipAddress = request.headers.get('x-forwarded-for');
    
    // Validate required fields
    const fieldError = validateRequiredFields(body, ['email', 'password']);
    if (fieldError) return fieldError;
    
    // Check rate limit
    const rateLimitResult = checkLoginRateLimit(body.email);
    if (!rateLimitResult.success) {
      return await handleRateLimitViolation(
        body.email,
        'login',
        rateLimitResult.retryAfter || 900,
        ipAddress
      );
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });
    
    if (!user || !user.password) {
      return await handleAuthenticationFailure(
        body.email,
        'Invalid credentials',
        ipAddress
      );
    }
    
    // Verify password
    const isValid = await verifyPassword(body.password, user.password);
    if (!isValid) {
      return await handleAuthenticationFailure(
        body.email,
        'Invalid password',
        ipAddress
      );
    }
    
    // Check account status
    if (user.status !== 'ACTIVE') {
      return await handleAuthenticationFailure(
        body.email,
        `Account is ${user.status.toLowerCase()}`,
        ipAddress
      );
    }
    
    // Create session and return success
    // ... session creation logic
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error, {
      endpoint: '/api/auth/login',
      method: 'POST',
    });
  }
}
```

## Example 3: Authorization with Role Check

```typescript
import { NextRequest } from 'next/server';
import { 
  handleError,
  handleAuthorizationFailure,
  authenticationError,
  notFoundError
} from '@/lib/errors';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    const ipAddress = request.headers.get('x-forwarded-for');
    
    // Check authentication
    if (!session?.user) {
      return authenticationError();
    }
    
    // Check authorization
    if (session.user.role !== 'ADMIN') {
      return await handleAuthorizationFailure(
        session.user.id,
        `/api/users/${params.id}`,
        'ADMIN',
        ipAddress
      );
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });
    
    if (!user) {
      return notFoundError('User not found', 'user');
    }
    
    // Delete user
    await prisma.user.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error, {
      endpoint: `/api/users/${params.id}`,
      method: 'DELETE',
      userId: session?.user?.id,
    });
  }
}
```

## Example 4: Handling Prisma Errors

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { handleError, conflictError } from '@/lib/errors';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
      },
    });
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    // Prisma unique constraint error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return conflictError(
          'A user with this email already exists',
          'email'
        );
      }
    }
    
    // All other errors
    return handleError(error, {
      endpoint: '/api/users',
      method: 'POST',
    });
  }
}
```

## Example 5: Custom Validation with Multiple Checks

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { 
  handleError, 
  validateRequiredFields,
  validateEmail,
  validateEnum,
  validationError 
} from '@/lib/errors';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const fieldError = validateRequiredFields(body, ['email', 'name', 'role']);
    if (fieldError) return fieldError;
    
    // Validate email format
    const emailError = validateEmail(body.email);
    if (emailError) return emailError;
    
    // Validate role enum
    const roleError = validateEnum(
      body.role,
      ['CLIENT', 'COACH', 'ADMIN'],
      'role'
    );
    if (roleError) return roleError;
    
    // Custom validation: name length
    if (body.name.length < 2) {
      return validationError('Name must be at least 2 characters', 'name');
    }
    
    // Custom validation: business rule
    if (body.role === 'ADMIN' && !body.adminCode) {
      return validationError('Admin code is required for admin role', 'adminCode');
    }
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        role: body.role,
      },
    });
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return handleError(error, {
      endpoint: '/api/users',
      method: 'POST',
    });
  }
}
```

## Example 6: Token Validation with Audit Logging

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { handleError, validationError, notFoundError } from '@/lib/errors';
import { validateToken } from '@/lib/tokens';
import { logAuditEvent } from '@/lib/audit';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ipAddress = request.headers.get('x-forwarded-for');
    
    // Validate token
    const tokenValidation = await validateToken(body.token, 'PASSWORD_RESET');
    
    if (!tokenValidation.valid) {
      // Log invalid token attempt
      await logAuditEvent(
        'INVALID_TOKEN',
        null,
        { 
          tokenType: 'PASSWORD_RESET',
          reason: tokenValidation.error 
        },
        ipAddress
      );
      
      return validationError(
        tokenValidation.error || 'Invalid or expired token',
        'token'
      );
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: tokenValidation.tokenData!.userId },
    });
    
    if (!user) {
      return notFoundError('User not found', 'user');
    }
    
    // Process password reset
    // ... reset logic
    
    // Log success
    await logAuditEvent(
      'PASSWORD_RESET_COMPLETED',
      user.id,
      { email: user.email },
      ipAddress
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error, {
      endpoint: '/api/auth/reset-password',
      method: 'POST',
    });
  }
}
```

## Example 7: Throwing Custom Errors

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { 
  handleError,
  ValidationError,
  ConflictError,
  NotFoundError 
} from '@/lib/errors';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });
    
    if (!user) {
      throw new NotFoundError('User not found', 'user');
    }
    
    // Validate business rule
    if (user.role === 'ADMIN' && body.status === 'SUSPENDED') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN', status: 'ACTIVE' },
      });
      
      if (adminCount <= 1) {
        throw new ConflictError(
          'Cannot suspend the last active admin',
          'status'
        );
      }
    }
    
    // Update user
    const updated = await prisma.user.update({
      where: { id: params.id },
      data: { status: body.status },
    });
    
    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    return handleError(error, {
      endpoint: `/api/users/${params.id}`,
      method: 'PUT',
    });
  }
}
```

## Summary

Key patterns to follow:

1. **Always wrap in try-catch** and use `handleError` for the catch block
2. **Validate early** using the validation helpers
3. **Use specific error types** for better error messages
4. **Include context** when logging errors
5. **Log security events** using audit logging functions
6. **Return early** on validation errors to avoid nested conditions
7. **Use standardized responses** for consistency across the API
