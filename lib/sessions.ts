import { prisma } from "./db";
import { logAuditEvent } from "./audit";

/**
 * Invalidate all sessions for a specific user
 * This is used when:
 * - User changes their password
 * - User's role is changed by an admin
 * - User's account is suspended
 * 
 * @param userId - The ID of the user whose sessions should be invalidated
 * @param reason - The reason for invalidation (for audit logging)
 * @param ipAddress - Optional IP address for audit logging
 */
export async function invalidateUserSessions(
  userId: string,
  reason: string,
  ipAddress?: string | null
): Promise<void> {
  try {
    // Delete all sessions for the user
    const result = await prisma.session.deleteMany({
      where: {
        userId,
      },
    });

    // Log the session invalidation
    await logAuditEvent(
      "SESSIONS_INVALIDATED",
      userId,
      {
        reason,
        sessionsDeleted: result.count,
      },
      ipAddress
    );
  } catch (error) {
    console.error("Error invalidating user sessions:", error);
    throw error;
  }
}
