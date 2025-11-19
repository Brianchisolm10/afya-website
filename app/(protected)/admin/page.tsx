import { redirect } from 'next/navigation';
import { auth } from '@/lib/get-session';
import { prisma } from '@/lib/db';
import AdminPanel from './AdminPanel';

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Check if user has ADMIN or COACH role
  if (session.user.role !== 'ADMIN' && session.user.role !== 'COACH') {
    redirect('/dashboard?error=forbidden');
  }

  // Fetch all clients with packet counts
  const clients = await prisma.client.findMany({
    include: {
      packets: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform data to include packet count and status breakdown
  const clientsWithPacketInfo = clients.map((client) => ({
    id: client.id,
    fullName: client.fullName,
    email: client.email,
    createdAt: client.createdAt.toISOString(),
    packetCount: client.packets.length,
    pendingCount: client.packets.filter(p => p.status === 'PENDING').length,
    readyCount: client.packets.filter(p => p.status === 'READY').length,
    failedCount: client.packets.filter(p => p.status === 'FAILED').length,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-afya-primary to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage clients and monitor packet delivery status
          </p>
        </div>

        <AdminPanel clients={clientsWithPacketInfo} />
      </div>
    </div>
  );
}
