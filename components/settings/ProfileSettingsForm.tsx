"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card, Badge } from "@/components/ui";
import { validatePasswordStrength } from "@/lib/validation";
import PasswordStrengthIndicator from "@/components/auth/PasswordStrengthIndicator";
import { useToast } from "@/components/Toast";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  createdAt: string;
}

export default function ProfileSettingsForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  
  // Form fields
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  
  const { success, error: showError } = useToast();
  const passwordStrength = validatePasswordStrength(newPassword);

  // Fetch user data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/me/profile");
        
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        
        const data = await response.json();
        setProfile(data.user);
        setName(data.user.name || "");
      } catch (err) {
        setError("Unable to load profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password if changing
    if (showPasswordSection) {
      if (!currentPassword) {
        setError("Current password is required to change your password.");
        return;
      }

      if (!newPassword) {
        setError("Please enter a new password.");
        return;
      }

      if (!passwordStrength.valid) {
        setError("Please ensure your new password meets all requirements.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("New passwords do not match.");
        return;
      }
    }

    setIsSaving(true);

    try {
      const updateData: any = {};
      
      // Only include name if it changed
      if (name !== profile?.name) {
        updateData.name = name;
      }

      // Include password fields if changing password
      if (showPasswordSection && newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      const response = await fetch("/api/me/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update profile. Please try again.");
        setIsSaving(false);
        return;
      }

      // Update local profile state
      setProfile(data.user);
      setName(data.user.name || "");
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSection(false);

      // Display success toast
      success("Profile updated", "Your profile has been updated successfully.");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "info";
      case "COACH":
        return "success";
      case "CLIENT":
        return "default";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <Card padding="lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-afya-primary"></div>
        </div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card padding="lg">
        <div className="text-center py-12">
          <p className="text-red-600">Unable to load profile</p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Personal Information
          </h3>

          <Input
            id="name"
            name="name"
            type="text"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            disabled={isSaving}
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              disabled
              fullWidth
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email address cannot be changed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Badge variant={getRoleBadgeVariant(profile.role)} size="md">
              {profile.role}
            </Badge>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Security
            </h3>
            {!showPasswordSection && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordSection(true)}
              >
                Change Password
              </Button>
            )}
          </div>

          {showPasswordSection && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">
                  Update your password to keep your account secure
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowPasswordSection(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                >
                  Cancel
                </Button>
              </div>

              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                label="Current Password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                disabled={isSaving}
                fullWidth
              />

              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                label="New Password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a new password"
                disabled={isSaving}
                fullWidth
              />

              {newPassword && (
                <PasswordStrengthIndicator strength={passwordStrength} />
              )}

              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm New Password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                disabled={isSaving}
                fullWidth
                error={
                  confirmPassword && newPassword !== confirmPassword
                    ? "Passwords do not match"
                    : undefined
                }
              />
            </div>
          )}
        </div>

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

        <div className="flex justify-end pt-4 border-t">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSaving}
            isLoading={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
