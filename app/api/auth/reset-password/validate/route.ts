import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the reset token
    const resetToken = await prisma.inviteToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 404 }
      );
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Token has expired" },
        { status: 410 }
      );
    }

    // Check if token has been used
    if (resetToken.usedAt) {
      return NextResponse.json(
        { error: "Token has already been used" },
        { status: 410 }
      );
    }

    // Check if token is for password reset
    if (resetToken.type !== "PASSWORD_RESET") {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate token" },
      { status: 500 }
    );
  }
}
