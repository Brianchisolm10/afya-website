import React from 'react';

interface PlateSection {
  label: string;
  percentage: number;
  color: string;
  description: string;
}

interface PlateVisualProps {
  sections: PlateSection[];
  size?: number;
}

export default function PlateVisual({ sections, size = 300 }: PlateVisualProps) {
  // Calculate SVG paths for each section
  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  let currentAngle = -90; // Start at top
  const radius = size / 2;
  const viewBoxSize = size;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Plate Visual */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="w-full h-full drop-shadow-lg"
          role="img"
          aria-label="Visual representation of plate proportions"
        >
          {/* Plate background */}
          <circle
            cx={radius}
            cy={radius}
            r={radius}
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          
          {/* Plate sections */}
          {sections.map((section, index) => {
            const angleSize = (section.percentage / 100) * 360;
            const path = createArcPath(currentAngle, currentAngle + angleSize, radius - 2);
            const labelAngle = currentAngle + angleSize / 2;
            const labelRad = (labelAngle * Math.PI) / 180;
            const labelRadius = radius * 0.65;
            const labelX = radius + labelRadius * Math.cos(labelRad);
            const labelY = radius + labelRadius * Math.sin(labelRad);
            
            currentAngle += angleSize;
            
            return (
              <g key={index}>
                <path
                  d={path}
                  fill={section.color}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-opacity hover:opacity-80"
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold fill-gray-800 pointer-events-none"
                  style={{ fontSize: '14px' }}
                >
                  {section.percentage}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {sections.map((section, index) => (
          <div key={index} className="flex items-start gap-2">
            <div
              className="w-4 h-4 rounded-sm flex-shrink-0 mt-0.5"
              style={{ backgroundColor: section.color }}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {section.label} ({section.percentage}%)
              </p>
              <p className="text-xs text-gray-600">{section.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Screen reader accessible description */}
      <div className="sr-only">
        Plate proportions: {sections.map(s => `${s.label} ${s.percentage}%`).join(', ')}
      </div>
    </div>
  );
}
