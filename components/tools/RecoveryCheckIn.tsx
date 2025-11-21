'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Activity, Frown, Meh, Smile, Laugh } from 'lucide-react';
import Link from 'next/link';

interface RecoveryInputs {
  energy: number;
  soreness: number;
  stress: number;
  mood: number;
}

interface RecoveryResults {
  score: number;
  label: 'Recovery Day' | 'Half-Speed Day' | 'Green Light Day';
  guidance: string;
  color: string;
}

const EMOJI_OPTIONS = [
  { value: 1, icon: Frown, label: 'Very Low' },
  { value: 2, icon: Frown, label: 'Low' },
  { value: 3, icon: Meh, label: 'Moderate' },
  { value: 4, icon: Smile, label: 'Good' },
  { value: 5, icon: Laugh, label: 'Excellent' },
];

const RECOVERY_LABELS = {
  recovery: {
    label: 'Recovery Day' as const,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    guidance: 'Your body is asking for rest. Focus on gentle movement, hydration, and sleep today.',
  },
  halfSpeed: {
    label: 'Half-Speed Day' as const,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    guidance: 'You\'re doing okay, but not at your best. Consider lighter activity or shorter sessions today.',
  },
  greenLight: {
    label: 'Green Light Day' as const,
    color: 'text-green-600 bg-green-50 border-green-200',
    guidance: 'You\'re feeling good and ready to go! This is a great day for challenging workouts or activities.',
  },
};

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  description: string;
}

function SliderInput({ label, value, onChange, description }: SliderInputProps) {
  const selectedEmoji = EMOJI_OPTIONS.find(opt => opt.value === value);
  const Icon = selectedEmoji?.icon || Meh;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label id={`${label.toLowerCase().replace(/\s+/g, '-')}-label`} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex items-center gap-2" aria-live="polite" aria-atomic="true">
          <Icon className="w-5 h-5 text-gray-600" aria-hidden="true" />
          <span className="text-sm font-medium text-gray-900">
            {selectedEmoji?.label}
          </span>
        </div>
      </div>
      
      <p id={`${label.toLowerCase().replace(/\s+/g, '-')}-description`} className="text-xs text-gray-500">{description}</p>
      
      <div 
        className="flex gap-2 justify-between" 
        role="radiogroup" 
        aria-labelledby={`${label.toLowerCase().replace(/\s+/g, '-')}-label`}
        aria-describedby={`${label.toLowerCase().replace(/\s+/g, '-')}-description`}
      >
        {EMOJI_OPTIONS.map((option) => {
          const OptionIcon = option.icon;
          const isSelected = value === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              onClick={() => onChange(option.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange(option.value);
                }
              }}
              className={`
                flex-1 p-3 sm:p-4 rounded-lg border-2 transition-all min-h-[44px] touch-target tap-highlight-none
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                ${isSelected 
                  ? 'border-teal-500 bg-teal-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300 active:bg-gray-50'
                }
              `}
              aria-label={`${label}: ${option.label}`}
              aria-checked={isSelected}
            >
              <OptionIcon 
                className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto ${isSelected ? 'text-teal-600' : 'text-gray-400'}`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 px-1">
        <span>Very Low</span>
        <span>Excellent</span>
      </div>
    </div>
  );
}

export function RecoveryCheckIn() {
  const [inputs, setInputs] = useState<RecoveryInputs>({
    energy: 3,
    soreness: 3,
    stress: 3,
    mood: 3,
  });
  
  const [results, setResults] = useState<RecoveryResults | null>(null);

  const handleInputChange = (field: keyof RecoveryInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateRecovery = () => {
    // Calculate average score from all 4 inputs
    const score = (inputs.energy + inputs.soreness + inputs.stress + inputs.mood) / 4;
    
    // Determine recovery label based on score
    let recoveryData;
    if (score < 2.5) {
      recoveryData = RECOVERY_LABELS.recovery;
    } else if (score <= 3.5) {
      recoveryData = RECOVERY_LABELS.halfSpeed;
    } else {
      recoveryData = RECOVERY_LABELS.greenLight;
    }

    setResults({
      score,
      label: recoveryData.label,
      guidance: recoveryData.guidance,
      color: recoveryData.color,
    });
  };

  const handleReset = () => {
    setInputs({
      energy: 3,
      soreness: 3,
      stress: 3,
      mood: 3,
    });
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          How are you feeling today?
        </h3>
        <p className="text-sm text-gray-600">
          Rate each factor on a scale of 1-5 to assess your recovery status
        </p>
      </div>

      <div className="space-y-6">
        <SliderInput
          label="Energy Level"
          value={inputs.energy}
          onChange={(value) => handleInputChange('energy', value)}
          description="How energized do you feel right now?"
        />

        <SliderInput
          label="Muscle Soreness"
          value={inputs.soreness}
          onChange={(value) => handleInputChange('soreness', value)}
          description="How sore or recovered do your muscles feel? (1 = very sore, 5 = fully recovered)"
        />

        <SliderInput
          label="Stress Level"
          value={inputs.stress}
          onChange={(value) => handleInputChange('stress', value)}
          description="How calm and relaxed do you feel? (1 = very stressed, 5 = very calm)"
        />

        <SliderInput
          label="Mood"
          value={inputs.mood}
          onChange={(value) => handleInputChange('mood', value)}
          description="How positive is your mood today?"
        />
      </div>

      {!results ? (
        <Button
          onClick={calculateRecovery}
          className="w-full"
          size="lg"
          aria-label="Calculate recovery status"
        >
          <Activity className="w-5 h-5 mr-2" aria-hidden="true" />
          Check My Recovery Status
        </Button>
      ) : (
        <div className="space-y-4" role="region" aria-label="Recovery assessment results">
          <div className={`p-6 rounded-lg border-2 ${results.color}`} role="status" aria-live="polite">
            <div className="text-center space-y-3">
              <div className="text-2xl font-bold">
                {results.label}
              </div>
              <p className="text-sm leading-relaxed">
                {results.guidance}
              </p>
            </div>
          </div>

          {/* Contextual CTA based on recovery status */}
          <div className="bg-gradient-to-br from-afya-secondary/10 to-afya-primary/10 rounded-xl p-5 border border-afya-secondary/30 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl" role="img" aria-label="Sparkles">✨</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {results.label === 'Recovery Day' && 'Need Support with Recovery?'}
                  {results.label === 'Half-Speed Day' && 'Looking for Balanced Training?'}
                  {results.label === 'Green Light Day' && 'Ready to Level Up?'}
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  {results.label === 'Recovery Day' && 'Our programs include recovery strategies and rest day guidance to help you bounce back stronger.'}
                  {results.label === 'Half-Speed Day' && 'Learn how to adjust your training based on how you feel with personalized coaching.'}
                  {results.label === 'Green Light Day' && 'Make the most of your good days with structured training programs designed for your goals.'}
                </p>
                <a
                  href="/programs"
                  className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Explore Our Programs →
                </a>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              Check Again
            </Button>
            <a href="/get-started" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-afya-secondary to-afya-secondary-light hover:from-afya-secondary-dark hover:to-afya-secondary transition-all duration-300 hover:shadow-lg">
                Get Started
              </Button>
            </a>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg" role="note">
        <p className="text-xs text-gray-600 leading-relaxed">
          <strong>Note:</strong> This tool provides general guidance based on your self-assessment. 
          Listen to your body and adjust your activity level as needed. If you're experiencing 
          persistent fatigue or pain, consider consulting with a healthcare professional.
        </p>
      </div>
    </div>
  );
}
