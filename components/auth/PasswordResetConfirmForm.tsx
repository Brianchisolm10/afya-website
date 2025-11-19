"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { validatePasswordStrength } from "@/lib/validation";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

interface PasswordResetConfirmFormProps {
  token: string;
}

export default function PasswordResetConfirmForm({ token }: PasswordResetConfirmFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState("");
  const [tokenError, setTokenError] = useState("");
  const router = useRouter();

  const passwordStrength = validatePasswordStrength(password);

  useEffect(() => {
    // Validate token on mount
    const validateToken = async () => {
      try {
        const response = await fetch("/api/auth/reset-password/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          if (response.status === 410) {
            setTokenError("This password reset link has expired. Please request a new one.");
          } else if (response.status === 404) {
            setTokenError("This password reset link is invalid. Please request a new one.");
          } else {
            setTokenError("Unable to validate reset link. Please try again or request a new one.");
          }
        }
      } catch (err) {
        setTokenError("Unable to connect to the server. Please check your internet connection and try again.");
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password strength
    if (!passwordStrength.valid) {
      setError("Please ensure your password meets all requirements.");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 410) {
          setError("This reset link has expired. Please request a new one.");
        } else if (response.status === 404) {
          setError("Invalid reset link. Please request a new one.");
        } else {
          setError(data.error || "Failed to reset password. Please try again.");
        }
        setIsLoading(false);
      } else {
        // Success - redirect to login
        router.push("/login?reset=success");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-afya-primary to-blue-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full animate-fadeIn" padding="lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-afya-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Validating reset link...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-afya-primary to-blue-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full animate-fadeIn" padding="lg">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-gray-600 mb-6">{tokenError}</p>
            <Button
              variant="primary"
              onClick={() => router.push("/reset-password")}
              fullWidth
            >
              Request New Reset Link
            </Button>
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
            Create New Password
          </h1>
          <p className="text-gray-600">
            Enter a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="password"
            name="password"
            type="password"
            label="New Password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            disabled={isLoading}
            fullWidth
          />

          {password && (
            <PasswordStrengthIndicator strength={passwordStrength} />
          )}

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm New Password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            disabled={isLoading}
            fullWidth
            error={confirmPassword && password !== confirmPassword ? "Passwords do not match" : undefined}
          />

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
            disabled={isLoading || !passwordStrength.valid || password !== confirmPassword}
            isLoading={isLoading}
            variant="primary"
            size="lg"
            fullWidth
          >
            {isLoading ? "Resetting password..." : "Reset Password"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            After resetting your password, you'll need to sign in again on all devices.
          </p>
        </div>
      </Card>
    </div>
  );
}
