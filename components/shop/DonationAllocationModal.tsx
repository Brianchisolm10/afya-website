'use client';

import { useState, useEffect } from 'react';

type DonationAllocation = 'FOUNDATIONS' | 'SPONSOR_A_CLIENT';

interface DonationAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (allocation: DonationAllocation) => void;
  donationAmount: number;
}

interface AllocationOption {
  value: DonationAllocation;
  title: string;
  description: string;
  icon: string;
}

const allocationOptions: AllocationOption[] = [
  {
    value: 'FOUNDATIONS' as DonationAllocation,
    title: 'Foundations & Donations',
    description: 'Support AFYA\'s general operations, community programs, and foundational initiatives that make movement accessible to everyone.',
    icon: '❤️'
  },
  {
    value: 'SPONSOR_A_CLIENT' as DonationAllocation,
    title: 'Sponsor-A-Client Program',
    description: 'Directly fund wellness packets for clients in need, helping individuals access personalized health and fitness guidance.',
    icon: '🤝'
  }
];

export default function DonationAllocationModal({
  isOpen,
  onClose,
  onSelect,
  donationAmount
}: DonationAllocationModalProps) {
  const [selectedAllocation, setSelectedAllocation] = useState<DonationAllocation | null>(null);

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedAllocation(null);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && selectedAllocation) {
        handleConfirm();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = selectedAllocation 
          ? allocationOptions.findIndex(opt => opt.value === selectedAllocation)
          : -1;
        
        const nextIndex = e.key === 'ArrowDown' 
          ? (currentIndex + 1) % allocationOptions.length
          : (currentIndex - 1 + allocationOptions.length) % allocationOptions.length;
        
        setSelectedAllocation(allocationOptions[nextIndex].value);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedAllocation, onClose]);

  const handleConfirm = () => {
    if (selectedAllocation) {
      onSelect(selectedAllocation);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-modal-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 
            id="donation-modal-title"
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Choose Your Impact
          </h2>
          <p className="text-gray-600">
            25% of your purchase (${donationAmount.toFixed(2)}) will support your chosen cause
          </p>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          {allocationOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedAllocation(option.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedAllocation(option.value);
                }
              }}
              className={`
                w-full p-6 rounded-xl border-2 text-left transition-all
                focus:outline-none focus:ring-4 focus:ring-offset-2
                ${selectedAllocation === option.value
                  ? 'border-[#40E0D0] bg-gradient-to-br from-[#40E0D0]/10 to-[#9370DB]/10 shadow-lg focus:ring-[#40E0D0]/50'
                  : 'border-gray-200 hover:border-[#40E0D0]/50 hover:shadow-md focus:ring-gray-300'
                }
              `}
              role="radio"
              aria-checked={selectedAllocation === option.value}
              tabIndex={0}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-4xl flex-shrink-0">
                  {option.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {option.description}
                  </p>
                </div>

                {/* Selection Indicator */}
                <div className="flex-shrink-0">
                  <div 
                    className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${selectedAllocation === option.value
                        ? 'border-[#40E0D0] bg-[#40E0D0]'
                        : 'border-gray-300'
                      }
                    `}
                  >
                    {selectedAllocation === option.value && (
                      <svg 
                        className="w-4 h-4 text-white" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedAllocation}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-offset-2
              ${selectedAllocation
                ? 'bg-gradient-to-r from-[#40E0D0] to-[#9370DB] text-white hover:opacity-90 focus:ring-[#40E0D0]/50'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Continue to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
