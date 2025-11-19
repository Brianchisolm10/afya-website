import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import { comparePassword } from "./password";
import { logAuditEvent } from "./audit";
import { checkLoginRateLimit, resetLoginRateLimit } from "./ratelimit";

export const authConfig = {
  // Don't use adapter with credentials provider and JWT strategy
  // adapter: PrismaAdapter(prisma),
  providers: [
    // EmailProvider removed - it requires database adapter
    // EmailProvider({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: Number(process.env.EMAIL_SERVER_PORT),
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        console.log('[AUTH] Authorize called with:', { email: credentials?.email, hasPassword: !!credentials?.password });
        
        if (!credentials?.email || !credentials?.password) {
          console.log('[AUTH] Missing credentials');
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        console.log('[AUTH] Processing login for:', email);

        // Check rate limit before processing
        const rateLimitResult = checkLoginRateLimit(email);
        if (!rateLimitResult.success) {
          await logAuditEvent(
            "LOGIN_RATE_LIMITED",
            null,
            { 
              email, 
              reason: "Rate limit exceeded",
              retryAfter: rateLimitResult.retryAfter 
            },
            request?.headers?.get("x-forwarded-for") || null
          );
          throw new Error(
            `Too many login attempts. Please try again in ${rateLimitResult.retryAfter} seconds.`
          );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
        });
        console.log('[AUTH] User found:', !!user, 'Has password:', !!user?.password);

        // User not found or no password set
        if (!user || !user.password) {
          console.log('[AUTH] Login failed - user not found or no password');
          await logAuditEvent(
            "LOGIN_FAILED",
            null,
            { email, reason: "Invalid credentials" },
            request?.headers?.get("x-forwarded-for") || null
          );
          return null;
        }

        // Check account status
        console.log('[AUTH] Checking status:', user.status);
        if (user.status !== "ACTIVE") {
          console.log('[AUTH] Login failed - account not active');
          await logAuditEvent(
            "LOGIN_FAILED",
            user.id,
            { email, reason: `Account ${user.status.toLowerCase()}` },
            request?.headers?.get("x-forwarded-for") || null
          );
          throw new Error(`Account ${user.status.toLowerCase()}`);
        }
        console.log('[AUTH] Status check passed');

        // Verify password
        const isValid = await comparePassword(password, user.password);
        console.log('[AUTH] Password valid:', isValid);

        if (!isValid) {
          console.log('[AUTH] Login failed - invalid password');
          await logAuditEvent(
            "LOGIN_FAILED",
            user.id,
            { email, reason: "Invalid credentials" },
            request?.headers?.get("x-forwarded-for") || null
          );
          return null;
        }

        // Log successful login
        try {
          await logAuditEvent(
            "LOGIN_SUCCESS",
            user.id,
            { email },
            request?.headers?.get("x-forwarded-for") || null
          );
          console.log('[AUTH] Audit log created');
        } catch (err) {
          console.error('[AUTH] Failed to log audit event:', err);
        }

        // Reset rate limit on successful login
        try {
          resetLoginRateLimit(email);
          console.log('[AUTH] Rate limit reset');
        } catch (err) {
          console.error('[AUTH] Failed to reset rate limit:', err);
        }

        // Update last login timestamp
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });
          console.log('[AUTH] Last login updated');
        } catch (err) {
          console.error('[AUTH] Failed to update last login:', err);
        }

        const returnUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        };
        console.log('[AUTH] Login successful, returning user:', returnUser);
        return returnUser;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
    error: "/login/error",
  },
  callbacks: {
    async session({ session, user, token }) {
      // For database strategy, user comes from database
      // For JWT strategy, user info comes from token
      if (session.user) {
        if (user) {
          // Database session
          session.user.id = user.id;
          session.user.role = user.role;
          session.user.status = user.status;
        } else if (token) {
          // JWT session (credentials provider)
          session.user.id = token.sub as string;
          session.user.role = token.role as string;
          session.user.status = token.status as string;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add user info to token on sign in
      if (user) {
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt", // Changed to JWT for credentials provider compatibility
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  debug: true, // Enable debug mode to see detailed logs
  // CSRF protection is enabled by default in NextAuth
  // All forms using NextAuth signIn/signOut automatically include CSRF tokens
};

// Export the config for use in the API route
// Don't call NextAuth here - it's called in the API route handler
