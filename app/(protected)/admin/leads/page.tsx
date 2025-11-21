import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { prisma } from '@/lib/db';
import LeadsTable from '@/components/admin/LeadsTable';

export default async function LeadsPage() {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      notes: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discovery Leads</h1>
        <p className="text-gray-600 mt-2">
          Manage leads from the discovery form
        </p>
      </div>

      <LeadsTable leads={leads} />
    </div>
  );
}
