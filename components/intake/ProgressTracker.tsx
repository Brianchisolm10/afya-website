'use client';

import { QuestionBlock } from '@/types/intake';

export interface ProgressSection {
  name: string;
  blockIds: string[];
  isComplete: boolean;
  isCurrent: boolean;
}

export interface ProgressTrackerProps {
  currentBlockIndex: number;
  totalBlocks: number;
  sections?: ProgressSection[];
  onNavigate?: (blockIndex: number) => void;
}

export default function ProgressTracker({
  currentBlockIndex,
  totalBlocks,
  sections,
  onNavigate
}: ProgressTrackerProps) {
  const progressPercentage = totalBlocks > 0 
    ? Math.round(((currentBlockIndex + 1) / totalBlocks) * 100)
    : 0;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress
            </span>
            <span className="text-sm font-semibold text-afya-primary">
              {progressPercentage}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-afya-primary to-afya-secondary h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">
              Section {currentBlockIndex + 1} of {totalBlocks}
            </span>
          </div>
        </div>

        {/* Section Navigation (if sections provided) */}
        {sections && sections.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {sections.map((section, index) => {
              const canNavigate = section.isComplete && onNavigate;
              
              return (
                <button
                  key={index}
                  onClick={() => canNavigate && onNavigate(index)}
                  disabled={!canNavigate}
                  className={`
                    flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                    ${section.isCurrent
                      ? 'bg-afya-primary text-white'
                      : section.isComplete
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500'
                    }
                    ${canNavigate ? 'cursor-pointer' : 'cursor-default'}
                  `}
                  aria-current={section.isCurrent ? 'step' : undefined}
                >
                  <div className="flex items-center gap-1.5">
                    {section.isComplete && !section.isCurrent && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>{section.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
