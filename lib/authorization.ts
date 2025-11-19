import { NextRequest, NextResponse } from "next/server";
import { auth } from "./get-session";
import { logAuditEvent } from "./audit";
import { prisma } from "./db";

// Import types from Prisma
type Role = "CLIENT" | "COACH" | "ADMIN";

/**
 * Verify that the user is authenticated
 * Returns 401 for unauthenticated requests
 */
export async function requireAuth(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    // Log authentication failure
    await logAuditEvent(
      "AUTH_REQUIRED_FAILED",
      null,
      {
        path: request.nextUrl.pathname,
        method: request.method,
      },
      request.headers.get("x-forwarded-for")
    );

    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized - Authentication required" },
        { status: 401 }
      ),
      session: null,
    };
  }

  // Verify user still exists and is active
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, status: true, role: true },
  });

  if (!user || user.status !== "ACTIVE") {
    await logAuditEvent(
      "AUTH_INACTIVE_USER",
      session.user.id,
      {
        path: request.nextUrl.pathname,
        status: user?.status || "NOT_FOUND",
      },
      request.headers.get("x-forwarded-for")
    );

    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized - Account is not active" },
        { status: 401 }
      ),
      session: null,
    };
  }

  return {
    authorized: true,
    response: null,
    session,
  };
}

/**
 * Verify that the user has the required role
 * Returns 401 for unauthenticated requests
 * Returns 403 for insufficient permissions
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: Role | Role[]
): Promise<{
  authorized: boolean;
  response: NextResponse | null;
  session: any;
}> {
  const session = await auth();

  // Check authentication first
  if (!session?.user?.id) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized - Authentication required" },
        { status: 401 }
      ),
      session: null,
    };
  }

  // Normalize allowedRoles to array
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  // Check if user has one of the allowed roles
  if (!rolesArray.includes(session.user.role)) {
    // Log authorization failure
    await logAuditEvent(
      "AUTHORIZATION_FAILED",
      session.user.id,
      {
        requiredRoles: rolesArray,
        userRole: session.user.role,
        path: request.nextUrl.pathname,
      },
      request.headers.get("x-forwarded-for")
    );

    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      ),
      session: null,
    };
  }

  return {
    authorized: true,
    response: null,
    session,
  };
}

/**
 * Check if a user is the last admin in the system
 * Returns true if the user is the only ADMIN role user
 */
export async function isLastAdmin(userId: string): Promise<boolean> {
  const adminCount = await prisma.user.count({
    where: {
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  if (adminCount !== 1) {
    return false;
  }

  // Check if this user is that one admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, status: true },
  });

  return user?.role === "ADMIN" && user?.status === "ACTIVE";
}

/**
 * Check if the action is being performed on the user's own account
 * Returns true if targetUserId matches the session user's ID
 */
export function isSelfAction(sessionUserId: string, targetUserId: string): boolean {
  return sessionUserId === targetUserId;
}

/**
 * Check if a user can access a specific client's data
 * Admins and coaches can access any client
 * Regular users can only access their own client data
 */
export async function canAccessClient(
  sessionUserId: string,
  sessionRole: Role,
  clientId: string,
  ipAddress?: string | null
): Promise<{ authorized: boolean; reason?: string }> {
  // Admins and coaches can access any client
  if (sessionRole === "ADMIN" || sessionRole === "COACH") {
    // Log admin/coach access for audit trail
    await logAuditEvent(
      "CLIENT_ACCESS_GRANTED",
      sessionUserId,
      {
        clientId,
        role: sessionRole,
        reason: "Admin/Coach access",
      },
      ipAddress
    );
    return { authorized: true };
  }

  // Regular users can only access their own client data
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { userId: true },
  });

  if (!client) {
    await logAuditEvent(
      "CLIENT_ACCESS_DENIED",
      sessionUserId,
      {
        clientId,
        reason: "Client not found",
      },
      ipAddress
    );
    return { authorized: false, reason: "Client not found" };
  }

  if (client.userId !== sessionUserId) {
    await logAuditEvent(
      "CLIENT_ACCESS_DENIED",
      sessionUserId,
      {
        clientId,
        reason: "Not client owner",
      },
      ipAddress
    );
    return { authorized: false, reason: "Access denied to this client's data" };
  }

  return { authorized: true };
}

/**
 * Check if a user can access a specific packet
 * Admins and coaches can access any packet
 * Regular users can only access packets belonging to their client profile
 */
export async function canAccessPacket(
  sessionUserId: string,
  sessionRole: Role,
  packetId: string,
  ipAddress?: string | null
): Promise<{ authorized: boolean; reason?: string }> {
  // Admins and coaches can access any packet
  if (sessionRole === "ADMIN" || sessionRole === "COACH") {
    // Log admin/coach access for audit trail
    await logAuditEvent(
      "PACKET_ACCESS_GRANTED",
      sessionUserId,
      {
        packetId,
        role: sessionRole,
        reason: "Admin/Coach access",
      },
      ipAddress
    );
    return { authorized: true };
  }

  // Regular users can only access their own packets
  const packet = await prisma.packet.findUnique({
    where: { id: packetId },
    include: {
      client: {
        select: { userId: true },
      },
    },
  });

  if (!packet) {
    await logAuditEvent(
      "PACKET_ACCESS_DENIED",
      sessionUserId,
      {
        packetId,
        reason: "Packet not found",
      },
      ipAddress
    );
    return { authorized: false, reason: "Packet not found" };
  }

  if (packet.client.userId !== sessionUserId) {
    await logAuditEvent(
      "PACKET_ACCESS_DENIED",
      sessionUserId,
      {
        packetId,
        reason: "Not packet owner",
      },
      ipAddress
    );
    return { authorized: false, reason: "Access denied to this packet" };
  }

  return { authorized: true };
}
