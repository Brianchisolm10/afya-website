import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';
import { sendAccountStatusEmail } from '@/lib/email';
import { requireRole, isLastAdmin, isSelfAction } from '@/lib/authorization';
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

    // Prevent admin from suspending own account
    if (isSelfAction(session.user.id, id)) {
      return NextResponse.json(
        { error: 'Cannot change your own account status. Please contact another administrator.' },
        { status: 409 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || !['ACTIVE', 'SUSPENDED', 'DEACTIVATED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be ACTIVE, SUSPENDED, or DEACTIVATED' },
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
        status: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if this is the last ADMIN user and status is being changed to non-ACTIVE
    if (user.role === 'ADMIN' && status !== 'ACTIVE') {
      const lastAdmin = await isLastAdmin(id);
      if (lastAdmin) {
        return NextResponse.json(
          { error: 'Cannot suspend or deactivate the last ADMIN user. At least one active ADMIN must remain in the system.' },
          { status: 409 }
        );
      }
    }

    // Store old status for audit log
    const oldStatus = user.status;

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
      },
    });

    // Invalidate user's sessions if suspended or deactivated
    if (status === 'SUSPENDED' || status === 'DEACTIVATED') {
      await invalidateUserSessions(
        id,
        `Account status changed to ${status}`,
        request.headers.get('x-forwarded-for')
      );
    }

    // Create audit log entry
    const auditAction = 
      status === 'SUSPENDED' ? 'ACCOUNT_SUSPENDED' :
      status === 'ACTIVE' ? 'ACCOUNT_REACTIVATED' :
      'ACCOUNT_DEACTIVATED';

    await logAuditEvent(
      auditAction,
      session.user.id,
      {
        targetUserId: id,
        targetUserEmail: user.email,
        oldStatus,
        newStatus: status,
      },
      request.headers.get('x-forwarded-for')
    );

    // Send notification email if suspended or reactivated
    if ((status === 'SUSPENDED' || status === 'ACTIVE') && user.email && user.name) {
      try {
        await sendAccountStatusEmail(user.email, user.name, status);
      } catch (emailError) {
        console.error('Failed to send account status email:', emailError);
        // Continue even if email fails
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    console.error('Error changing user status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
