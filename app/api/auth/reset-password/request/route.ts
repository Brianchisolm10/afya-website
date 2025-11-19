import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateToken, hashToken } from '@/lib/tokens';
import { logAuditEvent } from '@/lib/audit';
import { sendPasswordResetEmail } from '@/lib/email';
import { checkPasswordResetRateLimit } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimitResult = checkPasswordResetRateLimit(email);
    if (!rateLimitResult.success) {
      await logAuditEvent(
        'PASSWORD_RESET_RATE_LIMITED',
        null,
        { 
          email, 
          reason: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter 
        },
        request.headers.get('x-forwarded-for')
      );
      
      return NextResponse.json(
        { 
          error: `Too many password reset requests. Please try again in ${rateLimitResult.retryAfter} seconds.`,
          retryAfter: rateLimitResult.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '3600'
          }
        }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Always return success message for security (don't reveal if email exists)
    // But only send email if user exists
    if (user) {
      // Generate password reset token (1-hour expiration)
      const plainToken = generateToken();
      const hashedToken = hashToken(plainToken);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      await prisma.inviteToken.create({
        data: {
          userId: user.id,
          token: hashedToken,
          type: 'PASSWORD_RESET',
          expiresAt,
        },
      });

      // Generate reset URL
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const resetUrl = `${baseUrl}/reset-password/${plainToken}`;

      // Send reset email
      try {
        await sendPasswordResetEmail(
          user.email,
          user.name || 'User',
          resetUrl
        );
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Continue even if email fails
      }

      // Log password reset request
      await logAuditEvent(
        'PASSWORD_RESET_REQUESTED',
        user.id,
        { email: user.email },
        request.headers.get('x-forwarded-for')
      );
    }

    // Always return success message (security best practice)
    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
