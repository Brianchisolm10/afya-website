import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateToken } from '@/lib/tokens';
import { hashPassword } from '@/lib/password';
import { validatePasswordStrength } from '@/lib/validation';
import { logAuditEvent } from '@/lib/audit';
import { sendPasswordChangedEmail } from '@/lib/email';
import { invalidateUserSessions } from '@/lib/sessions';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { token, password } = body;

    // Validate required fields
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: token and password are required' },
        { status: 400 }
      );
    }

    // Validate reset token
    const tokenValidation = await validateToken(token, 'PASSWORD_RESET');
    
    if (!tokenValidation.valid) {
      return NextResponse.json(
        { error: tokenValidation.error || 'Invalid token' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { 
          error: 'Password does not meet strength requirements',
          messages: passwordValidation.messages,
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Get user details before update
    const user = await prisma.user.findUnique({
      where: { id: tokenValidation.tokenData!.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Invalidate all user sessions
    await invalidateUserSessions(
      user.id,
      'Password reset',
      request.headers.get('x-forwarded-for')
    );

    // Mark token as used
    await prisma.inviteToken.update({
      where: { id: tokenValidation.tokenData!.id },
      data: { usedAt: new Date() },
    });

    // Send confirmation email
    try {
      await sendPasswordChangedEmail(
        user.email,
        user.name || 'User'
      );
    } catch (emailError) {
      console.error('Failed to send password changed email:', emailError);
      // Continue even if email fails
    }

    // Log password reset completion
    await logAuditEvent(
      'PASSWORD_RESET_COMPLETED',
      user.id,
      { email: user.email },
      request.headers.get('x-forwarded-for')
    );

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    console.error('Error confirming password reset:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
