import { redirect } from 'next/navigation';
import { auth } from '@/lib/get-session';
import UserManagementPage from './UserManagementPage';

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Only ADMIN role can access user management
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard?error=forbidden');
  }

  return <UserManagementPage />;
}
