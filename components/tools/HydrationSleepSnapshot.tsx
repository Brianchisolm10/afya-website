'use client';

import { useState, ChangeEvent } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  getSleepRecommendations,
  getHydrationRecommendations,
  compareToRange,
  getSleepTip,
  getHydrationTip,
} from '@/lib/tools/calculations';
import { hydrationSleepSchema, validateInput } from '@/lib/tools/validation';
import type { HydrationSleepInputs, HydrationSleepResults } from '@/lib/tools/types';
import Link from 'next/link';

export function HydrationSleepSnapshot() {
  const [inputs, setInputs] = useState<Partial<HydrationSleepInputs>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [results, setResults] = useState<HydrationSleepResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field: keyof HydrationSleepInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCheck = () => {
    setIsCalculating(true);
    setErrors({});

    // Validate inputs
    const validation = validateInput(hydrationSleepSchema, inputs);
    
    if (!validation.success) {
      setErrors(validation.errors);
      setIsCalculating(false);
      return;
    }

    const validInputs = validation.data;

    // Get recommendations
    const sleepRange = getSleepRecommendations();
    const hydrationRange = getHydrationRecommendations();

    // Compare to ranges
    const sleepStatus = compareToRange(validInputs.sleepHours, sleepRange.min, sleepRange.max);
    const hydrationStatus = compareToRange(validInputs.waterCups, hydrationRange.min, hydrationRange.max);

    // Get tips
    const sleepTip = getSleepTip(sleepStatus);
    const hydrationTip = getHydrationTip(hydrationStatus);

    setResults({
      sleepStatus,
      hydrationStatus,
      sleepTip,
      hydrationTip,
      sleepRange,
      hydrationRange,
    });

    setIsCalculating(false);
  };

  const handleReset = () => {
    setResults(null);
    setErrors({});
  };

  const isFormValid = () => {
    return (
      inputs.sleepHours !== undefined &&
      inputs.waterCups !== undefined &&
      Object.keys(errors).length === 0
    );
  };

  const getStatusColor = (status: 'below' | 'within' | 'above') => {
    switch (status) {
      case 'below':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'within':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'above':
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getStatusLabel = (status: 'below' | 'within' | 'above') => {
    switch (status) {
      case 'below':
        return 'Below Range';
      case 'within':
        return 'Within Range';
      case 'above':
        return 'Above Range';
    }
  };

  const getStatusIcon = (status: 'below' | 'within' | 'above') => {
    switch (status) {
      case 'below':
        return '⚠️';
      case 'within':
        return '✅';
      case 'above':
        return 'ℹ️';
    }
  };

  if (results) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-afya-primary/10 to-afya-secondary/10 rounded-xl p-6 border border-afya-primary/30 shadow-sm animate-slideUp" role="region" aria-label="Recovery snapshot results">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Recovery Snapshot</h3>
          
          <div className="space-y-4">
            {/* Sleep Status */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <span className="text-3xl" role="img" aria-label="Sleeping face">😴</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Sleep</h4>
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(results.sleepStatus)}`}
                      role="status"
                      aria-label={`Sleep status: ${getStatusLabel(results.sleepStatus)}`}
                    >
                      <span role="img" aria-hidden="true">{getStatusIcon(results.sleepStatus)}</span> {getStatusLabel(results.sleepStatus)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    You're getting <span className="font-semibold">{inputs.sleepHours} hours</span> per night
                  </p>
                  <p className="text-gray-500 text-xs">
                    Recommended: {results.sleepRange.min}-{results.sleepRange.max} hours
                  </p>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg" role="note">
                    <p className="text-sm text-gray-700"><span role="img" aria-label="Light bulb">💡</span> {results.sleepTip}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hydration Status */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <span className="text-3xl" role="img" aria-label="Water droplet">💧</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Hydration</h4>
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(results.hydrationStatus)}`}
                      role="status"
                      aria-label={`Hydration status: ${getStatusLabel(results.hydrationStatus)}`}
                    >
                      <span role="img" aria-hidden="true">{getStatusIcon(results.hydrationStatus)}</span> {getStatusLabel(results.hydrationStatus)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    You're drinking <span className="font-semibold">{inputs.waterCups} cups</span> per day
                  </p>
                  <p className="text-gray-500 text-xs">
                    Recommended: {results.hydrationRange.min}-{results.hydrationRange.max} cups
                  </p>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg" role="note">
                    <p className="text-sm text-gray-700"><span role="img" aria-label="Light bulb">💡</span> {results.hydrationTip}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-purple-100">
            <p className="text-gray-700 text-sm leading-relaxed">
              These are general guidelines. Everyone's needs are different, so listen to your body and adjust based on how you feel.
            </p>
          </div>
        </div>

        {/* Contextual CTA */}
        <div className="bg-gradient-to-br from-afya-primary/10 to-afya-secondary/10 rounded-xl p-5 border border-afya-primary/30 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl" role="img" aria-label="Sparkles">✨</span>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">
                Build Better Recovery Habits
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                Sleep and hydration are foundational to health and performance. Our programs include strategies to optimize both, plus accountability to help you build lasting habits.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href="/programs"
                  className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                >
                  View Recovery Programs →
                </a>
                <span className="hidden sm:inline text-gray-300">|</span>
                <a
                  href="/get-started"
                  className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Get Started Today →
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Check Again
          </Button>
          <Link href="/programs" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-afya-primary to-afya-primary-light hover:from-afya-primary-dark hover:to-afya-primary transition-all duration-300 hover:shadow-lg">
              Explore Programs →
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          Check if your sleep and hydration are in healthy ranges. Small improvements in these areas can make a big difference in how you feel.
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <label htmlFor="sleep" className="block text-sm font-medium text-gray-700 mb-1">
            Average Nightly Sleep (hours)
          </label>
          <Input
            id="sleep"
            type="number"
            placeholder="e.g., 7.5"
            value={inputs.sleepHours || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('sleepHours', e.target.value)}
            error={errors.sleepHours}
            min={0}
            max={24}
            step={0.5}
            aria-label="Enter average nightly sleep in hours"
            aria-describedby={errors.sleepHours ? "sleep-error sleep-help" : "sleep-help"}
            aria-invalid={!!errors.sleepHours}
          />
          {errors.sleepHours && (
            <p id="sleep-error" className="mt-1 text-sm text-red-600" role="alert">{errors.sleepHours}</p>
          )}
          <p id="sleep-help" className="mt-1 text-xs text-gray-500">
            How many hours do you typically sleep each night?
          </p>
        </div>

        <div>
          <label htmlFor="water" className="block text-sm font-medium text-gray-700 mb-1">
            Daily Water Intake (cups)
          </label>
          <Input
            id="water"
            type="number"
            placeholder="e.g., 8"
            value={inputs.waterCups || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('waterCups', e.target.value)}
            error={errors.waterCups}
            min={0}
            step={0.5}
            aria-label="Enter daily water intake in cups"
            aria-describedby={errors.waterCups ? "water-error water-help" : "water-help"}
            aria-invalid={!!errors.waterCups}
          />
          {errors.waterCups && (
            <p id="water-error" className="mt-1 text-sm text-red-600" role="alert">{errors.waterCups}</p>
          )}
          <p id="water-help" className="mt-1 text-xs text-gray-500">
            About how many cups (8 oz) of water do you drink daily?
          </p>
        </div>
      </div>

      {/* Check Button */}
      <Button
        onClick={handleCheck}
        disabled={!isFormValid() || isCalculating}
        className="w-full bg-gradient-to-r from-afya-primary to-afya-primary-light hover:from-afya-primary-dark hover:to-afya-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
      >
        {isCalculating ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            Checking...
          </span>
        ) : (
          'Check My Habits'
        )}
      </Button>

      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            Please check your inputs and try again. Make sure all fields are filled in correctly.
          </p>
        </div>
      )}
    </div>
  );
}
