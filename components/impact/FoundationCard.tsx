'use client';

import Card from '@/components/ui/Card';

interface FoundationCardProps {
  name: string;
  description: string;
  website: string;
  logo?: string;
}

export function FoundationCard({
  name,
  description,
  website,
  logo,
}: FoundationCardProps) {
  return (
    <Card variant="hover" className="h-full">
      <a
        href={website}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <div className="flex flex-col h-full">
          {/* Logo or Icon */}
          <div className="mb-4 h-16 flex items-center justify-center">
            {logo ? (
              <img
                src={logo}
                alt={`${name} logo`}
                className="max-h-16 max-w-full object-contain"
              />
            ) : (
              <div className="text-4xl">🏥</div>
            )}
          </div>

          {/* Name */}
          <h4 className="text-xl font-bold mb-2 text-gray-900">{name}</h4>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>

          {/* Visit Link */}
          <div className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] to-[#9370DB] hover:opacity-80 transition-opacity">
            Visit Website →
          </div>
        </div>
      </a>
    </Card>
  );
}
