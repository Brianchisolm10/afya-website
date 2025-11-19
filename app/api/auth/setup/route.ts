import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateToken } from '@/lib/tokens';
import { hashPassword } from '@/lib/password';
import { validatePasswordStrength } from '@/lib/validation';
import { logAuditEvent } from '@/lib/audit';
import { handleError, validateRequiredFields, validationError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { token, password, name } = body;

    // Validate required fields using standardized helper
    const fieldError = validateRequiredFields(body, ['token', 'password']);
    if (fieldError) return fieldError;

    // Validate setup token
    const tokenValidation = await validateToken(token, 'ACCOUNT_SETUP');
    
    if (!tokenValidation.valid) {
      return validationError(
        tokenValidation.error || 'Invalid or expired token',
        'token'
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { 
          error: 'Password does not meet strength requirements',
          code: 'WEAK_PASSWORD',
          field: 'password',
          details: { messages: passwordValidation.messages },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Update user record with password and optional name
    const updateData: any = {
      password: hashedPassword,
      status: 'ACTIVE',
    };
    
    if (name) {
      updateData.name = name;
    }

    const user = await prisma.user.update({
      where: { id: tokenValidation.tokenData!.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // Mark token as used
    await prisma.inviteToken.update({
      where: { id: tokenValidation.tokenData!.id },
      data: { usedAt: new Date() },
    });

    // Log account setup completion
    await logAuditEvent(
      'ACCOUNT_SETUP_COMPLETED',
      user.id,
      { email: user.email },
      request.headers.get('x-forwarded-for')
    );

    return NextResponse.json({
      success: true,
      message: 'Account setup completed successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return handleError(error, {
      endpoint: '/api/auth/setup',
      method: 'POST',
    });
  }
}
