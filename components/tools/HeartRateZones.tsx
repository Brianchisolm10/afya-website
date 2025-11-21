'use client';

import { useState, ChangeEvent, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { calculateHeartRateZones } from '@/lib/tools/calculations';
import { heartRateSchema, validateInput } from '@/lib/tools/validation';
import type { HeartRateInputs, HeartRateResults } from '@/lib/tools/types';
import Link from 'next/link';

export function HeartRateZones() {
  const [inputs, setInputs] = useState<Partial<HeartRateInputs>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [results, setResults] = useState<HeartRateResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Memoize input change handler
  const handleInputChange = useCallback((field: keyof HeartRateInputs, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    setInputs(prev => ({ ...prev, [field]: numValue }));
    
    // Clear error for this field when user starts typing
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Optimize calculation with requestAnimationFrame for smooth UI
  const handleCalculate = useCallback(() => {
    setIsCalculating(true);
    setErrors({});

    requestAnimationFrame(() => {
      // Validate inputs
      const validation = validateInput(heartRateSchema, inputs);
      
      if (!validation.success) {
        setErrors(validation.errors);
        setIsCalculating(false);
        return;
      }

      const validInputs = validation.data;

      // Calculate heart rate zones
      const zones = calculateHeartRateZones(validInputs.age, validInputs.restingHR);
      
      // Determine explanation based on whether Karvonen formula was used
      const usingKarvonen = validInputs.restingHR !== undefined;
      const explanation = usingKarvonen
        ? 'These zones are calculated using the Karvonen formula with your resting heart rate for more accuracy.'
        : 'These zones are calculated using a simple age-based formula. For more accuracy, add your resting heart rate.';

      setResults({
        ...zones,
        explanation,
        usingKarvonen,
      });

      setIsCalculating(false);
    });
  }, [inputs]);

  const handleReset = useCallback(() => {
    setResults(null);
    setErrors({});
  }, []);

  // Memoize form validation
  const isFormValid = useMemo(() => {
    return (
      inputs.age !== undefined &&
      inputs.age > 0 &&
      Object.keys(errors).length === 0
    );
  }, [inputs, errors]);

  const getZoneColor = (zone: 'easy' | 'moderate' | 'vigorous') => {
    switch (zone) {
      case 'easy':
        return 'from-afya-primary to-afya-primary-light border-afya-primary/30';
      case 'moderate':
        return 'from-afya-secondary to-afya-secondary-light border-afya-secondary/30';
      case 'vigorous':
        return 'from-coral-400 to-coral-500 border-coral-400/30';
    }
  };

  const getZoneTextColor = (zone: 'easy' | 'moderate' | 'vigorous') => {
    switch (zone) {
      case 'easy':
        return 'text-green-900';
      case 'moderate':
        return 'text-orange-900';
      case 'vigorous':
        return 'text-red-900';
    }
  };

  const getZoneIcon = (zone: 'easy' | 'moderate' | 'vigorous') => {
    switch (zone) {
      case 'easy':
        return '🚶';
      case 'moderate':
        return '🏃';
      case 'vigorous':
        return '💨';
    }
  };

  const getZoneDescription = (zone: 'easy' | 'moderate' | 'vigorous') => {
    switch (zone) {
      case 'easy':
        return 'Comfortable pace, can hold a conversation';
      case 'moderate':
        return 'Challenging but sustainable, can speak in short sentences';
      case 'vigorous':
        return 'Hard effort, difficult to speak';
    }
  };

  if (results) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-coral-400/10 to-afya-secondary/10 rounded-xl p-6 border border-coral-400/30 shadow-sm animate-slideUp" role="region" aria-label="Heart rate zones results">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Heart Rate Zones</h3>
          <p className="text-sm text-gray-600 mb-4">
            Max Heart Rate: <span className="font-semibold">{results.maxHR} bpm</span>
          </p>
          
          <div className="space-y-3">
            {/* Easy Zone */}
            <div className={`bg-gradient-to-r ${getZoneColor('easy')} rounded-lg p-3 sm:p-4 border-2`} role="article" aria-label="Easy heart rate zone">
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl flex-shrink-0" role="img" aria-label="Walking person">{getZoneIcon('easy')}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                    <h4 className={`font-semibold text-sm sm:text-base ${getZoneTextColor('easy')}`}>Easy Zone</h4>
                    <span className={`font-bold text-base sm:text-lg ${getZoneTextColor('easy')}`}>
                      {results.easy.min}-{results.easy.max} bpm
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm ${getZoneTextColor('easy')} opacity-90 leading-relaxed`}>
                    {getZoneDescription('easy')}
                  </p>
                </div>
              </div>
            </div>

            {/* Moderate Zone */}
            <div className={`bg-gradient-to-r ${getZoneColor('moderate')} rounded-lg p-3 sm:p-4 border-2`} role="article" aria-label="Moderate heart rate zone">
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl flex-shrink-0" role="img" aria-label="Running person">{getZoneIcon('moderate')}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                    <h4 className={`font-semibold text-sm sm:text-base ${getZoneTextColor('moderate')}`}>Moderate Zone</h4>
                    <span className={`font-bold text-base sm:text-lg ${getZoneTextColor('moderate')}`}>
                      {results.moderate.min}-{results.moderate.max} bpm
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm ${getZoneTextColor('moderate')} opacity-90 leading-relaxed`}>
                    {getZoneDescription('moderate')}
                  </p>
                </div>
              </div>
            </div>

            {/* Vigorous Zone */}
            <div className={`bg-gradient-to-r ${getZoneColor('vigorous')} rounded-lg p-3 sm:p-4 border-2`} role="article" aria-label="Vigorous heart rate zone">
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl flex-shrink-0" role="img" aria-label="Dashing away">{getZoneIcon('vigorous')}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                    <h4 className={`font-semibold text-sm sm:text-base ${getZoneTextColor('vigorous')}`}>Vigorous Zone</h4>
                    <span className={`font-bold text-base sm:text-lg ${getZoneTextColor('vigorous')}`}>
                      {results.vigorous.min}-{results.vigorous.max} bpm
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm ${getZoneTextColor('vigorous')} opacity-90 leading-relaxed`}>
                    {getZoneDescription('vigorous')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="p-4 bg-white rounded-lg border border-orange-100" role="note">
              <p className="text-gray-700 text-sm leading-relaxed">
                <span role="img" aria-label="Light bulb">💡</span> Most of your weekly movement can happen in the easy to moderate zones. These zones build endurance and support recovery.
              </p>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200" role="note">
              <p className="text-blue-800 text-xs leading-relaxed">
                <span role="img" aria-label="Information">ℹ️</span> {results.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Contextual CTA */}
        <div className="bg-gradient-to-br from-coral-400/10 to-afya-secondary/10 rounded-xl p-5 border border-coral-400/30 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl" role="img" aria-label="Sparkles">✨</span>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">
                Train Smarter with Zone-Based Programming
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                Understanding your heart rate zones is just the beginning. Our training programs use zone-based workouts to help you build endurance, improve performance, and avoid overtraining.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href="/programs"
                  className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  View Training Programs →
                </a>
                <span className="hidden sm:inline text-gray-300">|</span>
                <a
                  href="/get-started"
                  className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Get Started Today →
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Calculate Again
          </Button>
          <Link href="/programs" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-coral-400 to-coral-500 hover:from-coral-500 hover:to-coral-600 transition-all duration-300 hover:shadow-lg">
              Explore Programs →
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          Find your heart rate training zones to help you exercise at the right intensity. Most weekly movement should happen in the easy to moderate zones.
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Age <span className="text-red-500" aria-label="required">*</span>
          </label>
          <Input
            id="age"
            type="number"
            placeholder="e.g., 30"
            value={inputs.age || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('age', e.target.value)}
            error={errors.age}
            min={13}
            max={100}
            aria-label="Enter your age"
            aria-describedby={errors.age ? "age-error age-help" : "age-help"}
            aria-invalid={!!errors.age}
            aria-required="true"
          />
          {errors.age && (
            <p id="age-error" className="mt-1 text-sm text-red-600" role="alert">{errors.age}</p>
          )}
          <p id="age-help" className="mt-1 text-xs text-gray-500">
            Your age is used to calculate your maximum heart rate
          </p>
        </div>

        <div>
          <label htmlFor="restingHR" className="block text-sm font-medium text-gray-700 mb-1">
            Resting Heart Rate <span className="text-gray-400">(optional)</span>
          </label>
          <Input
            id="restingHR"
            type="number"
            placeholder="e.g., 60"
            value={inputs.restingHR || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('restingHR', e.target.value)}
            error={errors.restingHR}
            min={30}
            max={120}
            aria-label="Enter your resting heart rate (optional)"
            aria-describedby={errors.restingHR ? "resting-error resting-help" : "resting-help"}
            aria-invalid={!!errors.restingHR}
          />
          {errors.restingHR && (
            <p id="resting-error" className="mt-1 text-sm text-red-600" role="alert">{errors.restingHR}</p>
          )}
          <p id="resting-help" className="mt-1 text-xs text-gray-500">
            For more accurate zones, measure your resting heart rate first thing in the morning
          </p>
        </div>
      </div>

      {/* Calculate Button */}
      <Button
        onClick={handleCalculate}
        disabled={!isFormValid() || isCalculating}
        className="w-full bg-gradient-to-r from-coral-400 to-coral-500 hover:from-coral-500 hover:to-coral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
      >
        {isCalculating ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            Calculating...
          </span>
        ) : (
          'Find My Zones'
        )}
      </Button>

      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            Please check your inputs and try again. Make sure all required fields are filled in correctly.
          </p>
        </div>
      )}
    </div>
  );
}
