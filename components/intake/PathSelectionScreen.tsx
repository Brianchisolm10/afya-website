'use client';

import { useState } from 'react';
import { Card } from '@/components/ui';

// Client Type enum matching Prisma schema
export type ClientType =
  | 'NUTRITION_ONLY'
  | 'WORKOUT_ONLY'
  | 'FULL_PROGRAM'
  | 'ATHLETE_PERFORMANCE'
  | 'YOUTH'
  | 'GENERAL_WELLNESS'
  | 'SPECIAL_SITUATION';

export interface PathOption {
  id: ClientType;
  title: string;
  description: string;
  icon: JSX.Element;
  estimatedTime: string;
  features: string[];
}

export interface PathSelectionScreenProps {
  onPathSelect: (path: ClientType) => void;
  selectedPath?: ClientType;
}

const pathOptions: PathOption[] = [
  {
    id: 'NUTRITION_ONLY',
    title: 'Nutrition Only',
    description: 'Get a personalized nutrition plan tailored to your dietary needs and goals.',
    estimatedTime: '8-10 minutes',
    features: [
      'Dietary preferences & restrictions',
      'Meal planning guidance',
      'Calorie & macro targets',
      'Shopping lists & recipes'
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    id: 'WORKOUT_ONLY',
    title: 'Workout/Training Program Only',
    description: 'Receive a customized workout program based on your fitness level and goals.',
    estimatedTime: '10-12 minutes',
    features: [
      'Training experience & goals',
      'Equipment & schedule',
      'Exercise selection',
      'Progressive programming'
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    id: 'FULL_PROGRAM',
    title: 'Full Program',
    description: 'Complete nutrition and training guidance for comprehensive health transformation.',
    estimatedTime: '15-18 minutes',
    features: [
      'Complete nutrition plan',
      'Full workout program',
      'Integrated approach',
      'Holistic lifestyle guidance'
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'ATHLETE_PERFORMANCE',
    title: 'Athlete Performance Program',
    description: 'Sport-specific training based on NSCA-CSCS principles for competitive athletes.',
    estimatedTime: '18-22 minutes',
    features: [
      'Sport-specific training',
      'Periodization planning',
      'Performance metrics',
      'Competition preparation'
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    id: 'YOUTH',
    title: 'Youth Program',
    description: 'Age-appropriate fitness and nutrition guidance for young athletes and teens.',
    estimatedTime: '10-12 minutes',
    features: [
      'Age-appropriate exercises',
      'Safety-first approach',
      'Growth & development focus',
      'Parent guidance included'
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    id: 'GENERAL_WELLNESS',
    title: 'General Wellness Guidance',
    description: 'Practical health and fitness advice for overall wellbeing and lifestyle improvement.',
    estimatedTime: '8-10 minutes',
    features: [
      'Lifestyle assessment',
      'Basic fitness guidance',
      'Healthy habits',
      'Sustainable approach'
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  {
    id: 'SPECIAL_SITUATION',
    title: 'Movement Needs',
    description: 'Modified guidance for injury recovery, chronic conditions, or specific limitations.',
    estimatedTime: '12-15 minutes',
    features: [
      'Injury/condition assessment',
      'Safe movement patterns',
      'Progressive recovery',
      'Pain management strategies'
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }
];

export default function PathSelectionScreen({
  onPathSelect,
  selectedPath
}: PathSelectionScreenProps) {
  const [hoveredPath, setHoveredPath] = useState<ClientType | null>(null);

  const handlePathClick = (pathId: ClientType) => {
    onPathSelect(pathId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-afya-light to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Path
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select the program that best fits your needs. We'll guide you through a personalized intake 
            to create your custom health and fitness plan.
          </p>
        </div>

        {/* Path Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pathOptions.map((option) => (
            <Card
              key={option.id}
              variant="elevated"
              padding="lg"
              hoverable
              onClick={() => handlePathClick(option.id)}
              onMouseEnter={() => setHoveredPath(option.id)}
              onMouseLeave={() => setHoveredPath(null)}
              className={`relative transition-all duration-300 ${
                selectedPath === option.id
                  ? 'ring-2 ring-afya-primary border-afya-primary'
                  : hoveredPath === option.id
                  ? 'border-afya-secondary'
                  : ''
              }`}
            >
              {/* Selected Indicator */}
              {selectedPath === option.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-afya-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                selectedPath === option.id || hoveredPath === option.id
                  ? 'bg-gradient-to-br from-afya-primary to-afya-secondary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {option.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {option.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4">
                {option.description}
              </p>

              {/* Estimated Time */}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{option.estimatedTime}</span>
              </div>

              {/* Features */}
              <div className="space-y-2">
                {option.features.map((feature, index) => (
                  <div key={index} className="flex items-start text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Not sure which path to choose? All paths can be customized based on your specific needs.
          </p>
        </div>
      </div>
    </div>
  );
}
