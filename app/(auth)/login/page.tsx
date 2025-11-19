"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState<"credentials" | "magic">("credentials");
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const loggedOut = searchParams.get("loggedOut") === "true";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (loginMethod === "credentials") {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        // Check for errors
        if (result?.error) {
          // Handle specific error types
          if (result.error === "Account suspended") {
            setError("Your account has been suspended. Please contact your administrator.");
          } else if (result.error === "CredentialsSignin") {
            setError("Invalid email or password. Please try again.");
          } else if (result.error.includes("rate limit") || result.error.includes("Too many")) {
            setError("Too many login attempts. Please try again in 15 minutes.");
          } else {
            setError("Invalid email or password. Please try again.");
          }
          setIsLoading(false);
        } else if (result?.ok) {
          // Successful login - get session to check user role
          const sessionResponse = await fetch('/api/auth/session');
          const session = await sessionResponse.json();
          
          // Redirect based on role
          if (session?.user?.role === 'ADMIN') {
            router.push('/admin');
          } else {
            router.push(callbackUrl);
          }
        }
      } else {
        // Magic link flow
        const result = await signIn("nodemailer", {
          email,
          redirect: false,
          callbackUrl,
        });

        if (result?.error) {
          setError("Failed to send magic link. Please try again.");
          setIsLoading(false);
        } else {
          setIsSubmitted(true);
          setIsLoading(false);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-afya-primary to-blue-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full animate-fadeIn" padding="lg">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4" aria-hidden="true">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-6">
              We've sent a magic link to <strong>{email}</strong>. Click the
              link in the email to sign in to your account.
            </p>
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or{" "}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="text-afya-primary hover:underline font-medium inline"
              >
                try again
              </Button>
              .
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-afya-primary to-blue-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full animate-fadeIn" padding="lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to AFYA
          </h1>
          <p className="text-gray-600">
            Sign in to access your personalized health dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
            fullWidth
          />

          {loginMethod === "credentials" && (
            <>
              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                fullWidth
                showPasswordToggle
              />
              <div className="text-right">
                <Link
                  href="/reset-password"
                  className="text-sm text-afya-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-afya-primary rounded"
                >
                  Forgot password?
                </Link>
              </div>
            </>
          )}

          {loggedOut && (
            <div className="rounded-md bg-green-50 p-4" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    You have been successfully logged out.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            variant="primary"
            size="lg"
            fullWidth
          >
            {isLoading
              ? loginMethod === "credentials"
                ? "Signing in..."
                : "Sending magic link..."
              : loginMethod === "credentials"
              ? "Sign In"
              : "Send Magic Link"}
          </Button>
        </form>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => {
              setLoginMethod(loginMethod === "credentials" ? "magic" : "credentials");
              setError("");
              setPassword("");
            }}
            className="w-full text-center text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-afya-primary rounded"
          >
            {loginMethod === "credentials"
              ? "Or sign in with magic link instead"
              : "Or sign in with password instead"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/get-started"
              className="text-afya-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-afya-primary rounded"
            >
              Get started
            </Link>
          </p>
        </div>

        {loginMethod === "magic" && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              We'll send you a magic link to sign in without a password. Check
              your email inbox after clicking the button above.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
