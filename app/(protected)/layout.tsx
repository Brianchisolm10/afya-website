import { auth } from '@/lib/get-session';
import { redirect } from 'next/navigation';
import ProtectedNav from '@/components/layout/ProtectedNav';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProtectedNav user={session.user} />
      <main>{children}</main>
    </div>
  );
}
