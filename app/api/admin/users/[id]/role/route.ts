import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';
import { sendRoleChangedEmail } from '@/lib/email';
import { requireRole, isLastAdmin } from '@/lib/authorization';
import { invalidateUserSessions } from '@/lib/sessions';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify ADMIN role authorization
    const authResult = await requireRole(request, 'ADMIN');
    if (!authResult.authorized) {
      return authResult.response;
    }
    const session = authResult.session!;

    const { id } = params;

    // Parse request body
    const body = await request.json();
    const { role } = body;

    // Validate role
    if (!role || !['CLIENT', 'COACH', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be CLIENT, COACH, or ADMIN' },
        { status: 400 }
      );
    }

    // Fetch the user to be updated
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if this is the last ADMIN user
    if (user.role === 'ADMIN' && role !== 'ADMIN') {
      const lastAdmin = await isLastAdmin(id);
      if (lastAdmin) {
        return NextResponse.json(
          { error: 'Cannot change role of the last ADMIN user. At least one ADMIN must remain in the system.' },
          { status: 409 }
        );
      }
    }

    // Store old role for audit log
    const oldRole = user.role;

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // Invalidate user's sessions
    await invalidateUserSessions(
      id,
      `Role changed from ${oldRole} to ${role}`,
      request.headers.get('x-forwarded-for')
    );

    // Create audit log entry
    await logAuditEvent(
      'ROLE_CHANGED',
      session.user.id,
      {
        targetUserId: id,
        targetUserEmail: user.email,
        oldRole,
        newRole: role,
      },
      request.headers.get('x-forwarded-for')
    );

    // Send notification email
    if (user.email && user.name) {
      try {
        await sendRoleChangedEmail(user.email, user.name, role);
      } catch (emailError) {
        console.error('Failed to send role changed email:', emailError);
        // Continue even if email fails
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Error changing user role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
