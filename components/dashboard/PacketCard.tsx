import { PacketType, PacketStatus } from '@/types';
import { Card, Badge, Button, Spinner } from '@/components/ui';

interface PacketCardProps {
  packet: {
    id: string;
    type: PacketType;
    status: PacketStatus;
    docUrl: string | null;
    pdfUrl?: string | null;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  };
  onView?: (packetId: string) => void;
}

const packetTypeLabels: Record<PacketType, string> = {
  INTRO: 'Introduction Packet',
  NUTRITION: 'Nutrition Packet',
  WORKOUT: 'Workout Packet',
  PERFORMANCE: 'Performance Packet',
  YOUTH: 'Youth Training Packet',
  RECOVERY: 'Recovery Packet',
  WELLNESS: 'Wellness Packet',
};

const packetTypeDescriptions: Record<PacketType, string> = {
  INTRO: 'Welcome and getting started guide',
  NUTRITION: 'Personalized nutrition plan and meal guidance',
  WORKOUT: 'Custom workout program and exercise routines',
  PERFORMANCE: 'Athletic performance training program',
  YOUTH: 'Age-appropriate training and development',
  RECOVERY: 'Injury recovery and modification guidance',
  WELLNESS: 'General wellness and lifestyle guidance',
};

const statusConfig: Record<PacketStatus, { variant: 'default' | 'success' | 'danger'; label: string }> = {
  PENDING: { variant: 'default', label: 'Preparing' },
  GENERATING: { variant: 'default', label: 'Generating' },
  READY: { variant: 'success', label: 'Ready' },
  FAILED: { variant: 'danger', label: 'Error' },
};

export default function PacketCard({ packet, onView }: PacketCardProps) {
  const { id, type, status, docUrl, pdfUrl, updatedAt } = packet;
  const statusInfo = statusConfig[status];

  const handleView = () => {
    if (onView) {
      onView(id);
    }
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card hoverable className="animate-fadeIn">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {packetTypeLabels[type]}
          </h3>
          <p className="text-sm text-gray-600">
            {packetTypeDescriptions[type]}
          </p>
        </div>
        <Badge variant={statusInfo.variant}>
          {statusInfo.label}
        </Badge>
      </div>

      {updatedAt && status === 'READY' && (
        <p className="text-xs text-gray-500 mb-4">
          Updated {formatDate(updatedAt)}
        </p>
      )}

      {status === 'READY' && (
        <div className="flex gap-2">
          <Button
            onClick={handleView}
            variant="primary"
            fullWidth
            aria-label={`View ${packetTypeLabels[type]}`}
          >
            View Packet
          </Button>
          {pdfUrl && (
            <Button
              as="a"
              href={`/api/packets/${id}/download`}
              download
              variant="secondary"
              aria-label={`Download ${packetTypeLabels[type]} PDF`}
            >
              Download
            </Button>
          )}
        </div>
      )}

      {(status === 'PENDING' || status === 'GENERATING') && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Spinner size="sm" color="gray" />
          <p>Your packet is being prepared. Check back soon!</p>
        </div>
      )}

      {status === 'FAILED' && (
        <div>
          <p className="text-sm text-red-600 mb-3" role="alert">
            There was an issue generating your packet. Our team has been notified.
          </p>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      )}
    </Card>
  );
}
