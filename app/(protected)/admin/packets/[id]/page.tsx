import { redirect } from 'next/navigation';
import { auth } from '@/lib/get-session';
import { prisma } from '@/lib/db';
import { PacketViewer } from '@/components/dashboard';

export default async function AdminPacketViewPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Check if user has ADMIN or COACH role
  if (session.user.role !== 'ADMIN' && session.user.role !== 'COACH') {
    redirect('/dashboard?error=forbidden');
  }

  // Fetch packet with client data
  const packet = await prisma.packet.findUnique({
    where: { id: params.id },
    include: {
      client: {
        select: {
          id: true,
          fullName: true,
          email: true,
        }
      }
    }
  });

  if (!packet) {
    redirect('/admin?error=packet-not-found');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <a
            href="/admin"
            className="text-sm text-afya-primary hover:text-afya-primary/80 flex items-center gap-2 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Admin Panel
          </a>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-afya-primary to-purple-600 bg-clip-text text-transparent">
            Packet Details
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Client: {packet.client.fullName} ({packet.client.email})
          </p>
        </div>

        <PacketViewer packetId={packet.id} />
      </div>
    </div>
  );
}
