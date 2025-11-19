'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PacketType } from '@/types';
import { Card, Button, Spinner, Badge } from '@/components/ui';
import { ErrorDisplay } from '@/components/ErrorBoundary';
import { retryWithBackoff } from '@/lib/utils';
import { PopulatedContent } from '@/types/intake';

interface PacketData {
  id: string;
  type: PacketType;
  status: string;
  content: PopulatedContent | null;
  pdfUrl: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface PacketViewerProps {
  packetId: string;
  onClose?: () => void;
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

export default function PacketViewer({ packetId, onClose }: PacketViewerProps) {
  const router = useRouter();
  const [packet, setPacket] = useState<PacketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPacket = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await retryWithBackoff(async () => {
        const res = await fetch(`/api/packets/${packetId}`);

        if (res.status === 401) {
          router.push('/login');
          throw new Error('Unauthorized');
        }

        if (res.status === 403) {
          throw new Error('You do not have access to this packet');
        }

        if (!res.ok) {
          throw new Error('Failed to fetch packet');
        }

        return await res.json();
      });

      setPacket(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacket();
  }, [packetId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (packet?.pdfUrl) {
      window.location.href = `/api/packets/${packetId}/download`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error || !packet) {
    return (
      <ErrorDisplay
        title="Failed to load packet"
        message={error || 'Packet not found'}
        onRetry={fetchPacket}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 print:hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {packetTypeLabels[packet.type]}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Version {packet.version} • Last updated {new Date(packet.updatedAt).toLocaleDateString()}
            </p>
          </div>
          {onClose && (
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handlePrint} variant="secondary">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print
          </Button>
          {packet.pdfUrl && (
            <Button onClick={handleDownload} variant="primary">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download PDF
            </Button>
          )}
        </div>
      </div>

      {/* Packet Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 print:shadow-none print:border-0">
        {/* Print Header */}
        <div className="hidden print:block mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {packetTypeLabels[packet.type]}
          </h1>
          <p className="text-sm text-gray-600">
            Prepared for {packet.client.fullName}
          </p>
          <p className="text-sm text-gray-600">
            {new Date(packet.updatedAt).toLocaleDateString()}
          </p>
        </div>

        {packet.content ? (
          <PacketContent content={packet.content} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              This packet is still being generated. Please check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Renders the packet content sections
 */
function PacketContent({ content }: { content: PopulatedContent }) {
  if (!content.sections || content.sections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No content available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {content.sections.map((section, index) => (
        <section key={section.id || index} className="break-inside-avoid">
          {/* Section Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-turquoise-500">
            {section.title}
          </h2>

          {/* Section Description */}
          {section.description && (
            <p className="text-gray-700 mb-4 italic">
              {section.description}
            </p>
          )}

          {/* Section Blocks */}
          <div className="space-y-4">
            {section.blocks.map((block, blockIndex) => (
              <ContentBlock key={block.id || blockIndex} block={block} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * Renders individual content blocks
 */
function ContentBlock({ block }: { block: any }) {
  const { type, content, formatting } = block;

  switch (type) {
    case 'heading':
      return (
        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          {content}
        </h3>
      );

    case 'text':
      return (
        <div 
          className="text-gray-700 leading-relaxed whitespace-pre-wrap"
          style={{
            fontWeight: formatting?.bold ? 'bold' : 'normal',
            fontStyle: formatting?.italic ? 'italic' : 'normal',
            textAlign: formatting?.alignment || 'left',
          }}
        >
          {content}
        </div>
      );

    case 'list':
      const items = Array.isArray(content) ? content : content.split('\n').filter(Boolean);
      const ListTag = formatting?.listStyle === 'numbered' ? 'ol' : 'ul';
      const listClass = formatting?.listStyle === 'numbered' 
        ? 'list-decimal list-inside space-y-2' 
        : 'list-disc list-inside space-y-2';

      return (
        <ListTag className={`${listClass} text-gray-700 ml-4`}>
          {items.map((item: string, i: number) => (
            <li key={i} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ListTag>
      );

    case 'table':
      if (!formatting?.headers || !Array.isArray(content)) {
        return <div className="text-gray-700">{JSON.stringify(content)}</div>;
      }

      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                {formatting.headers.map((header: string, i: number) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {content.map((row: any, rowIndex: number) => (
                <tr key={rowIndex}>
                  {formatting.columns.map((col: string, colIndex: number) => (
                    <td
                      key={colIndex}
                      className="px-4 py-3 text-sm text-gray-700"
                    >
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'divider':
      return <hr className="my-6 border-gray-300" />;

    case 'image':
      return (
        <div className="my-4">
          <img
            src={content}
            alt={formatting?.alt || 'Packet image'}
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      );

    default:
      return (
        <div className="text-gray-700 whitespace-pre-wrap">
          {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        </div>
      );
  }
}
