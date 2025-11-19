import { Metadata } from "next";
import Link from "next/link";
import ProfileSettingsForm from "@/components/settings/ProfileSettingsForm";

export const metadata: Metadata = {
  title: "Profile Settings | AFYA",
  description: "Manage your account information and preferences",
};

import { auth } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function ProfileSettingsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'COACH';
  const homeLink = isAdmin ? '/admin' : '/dashboard';
  const homeLabel = isAdmin ? 'Admin' : 'Dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/10 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href={homeLink}
                className="text-afya-primary hover:text-afya-primary-dark transition-colors font-medium"
              >
                {homeLabel}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600 font-medium">Profile Settings</li>
          </ol>
        </nav>

        {/* Page content */}
        <ProfileSettingsForm />
      </div>
    </div>
  );
}
