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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Clients & Packets
        </h1>
        <p className="mt-2 text-gray-600">
          Manage clients and monitor packet delivery status
        </p>
      </div>

      <AdminPanel clients={clientsWithPacketInfo} />
    </div>
  );
}
