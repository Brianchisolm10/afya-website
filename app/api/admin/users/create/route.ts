import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateToken, hashToken } from '@/lib/tokens';
import { logAuditEvent } from '@/lib/audit';
import { sendInvitationEmail } from '@/lib/email';
import { checkAccountCreationRateLimit } from '@/lib/ratelimit';
import { requireRole } from '@/lib/authorization';

export async function POST(request: NextRequest) {
  try {
    // Verify ADMIN role authorization
    const authResult = await requireRole(request, 'ADMIN');
    if (!authResult.authorized) {
      return authResult.response;
    }
    const session = authResult.session!;

    // Check rate limit for account creation
    const rateLimitResult = checkAccountCreationRateLimit(session.user.id);
    if (!rateLimitResult.success) {
      await logAuditEvent(
        'ACCOUNT_CREATION_RATE_LIMITED',
        session.user.id,
        { 
          reason: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter 
        },
        request.headers.get('x-forwarded-for')
      );
      
      return NextResponse.json(
        { 
          error: `Too many account creation requests. Please try again in ${Math.ceil((rateLimitResult.retryAfter || 0) / 60)} minutes.`,
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

    // Parse request body
    const body = await request.json();
    const { email, name, role } = body;

    // Validate required fields
    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, and role are required' },
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

    // Validate role
    if (role !== 'COACH' && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Invalid role. Must be COACH or ADMIN' },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }

    // Create user with no password
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        status: 'ACTIVE',
        password: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate invite token (72-hour expiration)
    const plainToken = generateToken();
    const hashedToken = hashToken(plainToken);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72);

    await prisma.inviteToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        type: 'ACCOUNT_SETUP',
        expiresAt,
      },
    });

    // Generate setup URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const setupUrl = `${baseUrl}/setup/${plainToken}`;

    // Send invitation email
    try {
      await sendInvitationEmail(email, name, role, setupUrl);
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      // Continue even if email fails - admin can manually share the link
    }

    // Log account creation
    await logAuditEvent(
      'ACCOUNT_CREATED',
      session.user.id,
      { 
        createdUserId: user.id,
        email: user.email,
        role: user.role,
      },
      request.headers.get('x-forwarded-for')
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      inviteUrl: setupUrl,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
