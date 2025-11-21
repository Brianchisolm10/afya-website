"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";
import { usePrefetch } from "@/lib/performance/usePrefetch";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [shouldPrefetch, setShouldPrefetch] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const searchParams = useSearchParams();
  const loggedOut = searchParams.get("loggedOut") === "true";

  // Prefetch dashboard resources on form interaction
  usePrefetch(["/dashboard", "/api/me/client"], shouldPrefetch);

  // Validate email format for immediate feedback
  const isEmailValid = email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length === 0 || password.length >= 8;
  const canSubmit = email.length > 0 && password.length > 0 && isEmailValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Immediate feedback - show loading state within 100ms
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: '/admin',
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
        // Show success state for smooth transition
        setIsSuccess(true);
        
        // Small delay to show success state before redirect
        // This provides visual feedback that login was successful
        setTimeout(() => {
          window.location.href = result.url || '/admin';
        }, 300);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // Enable prefetching when user starts interacting with form
  const handleFormInteraction = () => {
    if (!shouldPrefetch) {
      setShouldPrefetch(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-afya-primary to-blue-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full animate-fadeIn" padding="lg">
        {isSuccess ? (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 animate-scaleIn">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Login Successful!
            </h2>
            <p className="text-gray-600">
              Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-afya-primary rounded"
              >
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
            </div>

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
            onFocus={handleFormInteraction}
            onBlur={() => setEmailTouched(true)}
            placeholder="you@example.com"
            disabled={isLoading}
            fullWidth
            error={emailTouched && !isEmailValid ? "Please enter a valid email address" : undefined}
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={handleFormInteraction}
            onBlur={() => setPasswordTouched(true)}
            placeholder="Enter your password"
            disabled={isLoading}
            fullWidth
            showPasswordToggle
            error={passwordTouched && !isPasswordValid ? "Password must be at least 8 characters" : undefined}
          />
          
          <div className="text-right">
            <Link
              href="/reset-password"
              className="text-sm text-afya-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-afya-primary rounded"
            >
              Forgot password?
            </Link>
          </div>

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
            disabled={isLoading || !canSubmit}
            isLoading={isLoading}
            variant="primary"
            size="lg"
            fullWidth
            aria-label={isLoading ? "Signing in, please wait" : "Sign in to your account"}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

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
          </>
        )}
      </Card>
    </div>
  );
}
