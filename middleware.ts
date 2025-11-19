import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Temporarily simplified middleware to avoid edge runtime issues
// TODO: Re-enable auth middleware once NextAuth v5 edge compatibility is resolved
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
