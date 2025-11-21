'use client';

import { useState, ChangeEvent, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { calculateBMR, calculateTDEE, calculateProteinRange, lbsToKg, feetInchesToCm } from '@/lib/tools/calculations';
import { energyProteinSchema, validateInput } from '@/lib/tools/validation';
import { ACTIVITY_DESCRIPTIONS, GOAL_DESCRIPTIONS } from '@/lib/tools/constants';
import type { EnergyProteinInputs, EnergyProteinResults } from '@/lib/tools/types';
import Link from 'next/link';
import { useDebounce } from '@/lib/performance/useOptimizedCalculation';

type UnitSystem = 'metric' | 'imperial';

export function EnergyProteinCalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [inputs, setInputs] = useState<Partial<EnergyProteinInputs>>({
    sex: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
  });
  const [imperialInputs, setImperialInputs] = useState({
    weightLbs: '',
    heightFeet: '',
    heightInches: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [results, setResults] = useState<EnergyProteinResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Memoize input change handler to prevent unnecessary re-renders
  const handleInputChange = useCallback((field: keyof EnergyProteinInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
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

  // Debounced imperial input handler for smooth typing experience
  const debouncedImperialUpdate = useDebounce((field: string, value: string, currentImperialInputs: typeof imperialInputs) => {
    // Convert and update metric values
    if (field === 'weightLbs' && value) {
      const lbs = parseFloat(value);
      if (!isNaN(lbs)) {
        handleInputChange('weightKg', lbsToKg(lbs));
      }
    } else if ((field === 'heightFeet' || field === 'heightInches')) {
      const feet = parseFloat(currentImperialInputs.heightFeet || '0');
      const inches = parseFloat(field === 'heightInches' ? value : currentImperialInputs.heightInches || '0');
      if (!isNaN(feet) && !isNaN(inches)) {
        handleInputChange('heightCm', feetInchesToCm(feet, inches));
      }
    }
  }, 150);

  const handleImperialInputChange = useCallback((field: string, value: string) => {
    setImperialInputs(prev => {
      const newInputs = { ...prev, [field]: value };
      // Debounce the conversion to prevent excessive calculations
      debouncedImperialUpdate(field, value, newInputs);
      return newInputs;
    });
  }, [debouncedImperialUpdate]);

  // Memoize calculation handler to prevent recreation on every render
  const handleCalculate = useCallback(() => {
    setIsCalculating(true);
    setErrors({});

    // Use requestAnimationFrame for smooth UI updates
    requestAnimationFrame(() => {
      // Validate inputs
      const validation = validateInput(energyProteinSchema, inputs);
      
      if (!validation.success) {
        setErrors(validation.errors);
        setIsCalculating(false);
        return;
      }

      const validInputs = validation.data;

      // Calculate BMR
      const bmr = calculateBMR(
        validInputs.weightKg,
        validInputs.heightCm,
        validInputs.age,
        validInputs.sex
      );

      // Calculate TDEE
      const tdee = calculateTDEE(bmr, validInputs.activityLevel);

      // Adjust for goal
      let dailyCalories = tdee;
      if (validInputs.goal === 'lose') {
        dailyCalories = tdee - 500;
      } else if (validInputs.goal === 'gain') {
        dailyCalories = tdee + 500;
      }

      // Calculate protein range
      const proteinRange = calculateProteinRange(
        validInputs.weightKg,
        validInputs.activityLevel,
        validInputs.goal
      );

      // Generate explanation
      const explanation = `This is a starting point based on your information. Everyone's body is different, so listen to how you feel and adjust as needed. These numbers are meant to guide you, not restrict you.`;

      setResults({
        dailyCalories,
        proteinRangeMin: proteinRange.min,
        proteinRangeMax: proteinRange.max,
        bmr,
        tdee,
        explanation,
      });

      setIsCalculating(false);
    });
  }, [inputs]);

  const handleReset = useCallback(() => {
    setResults(null);
    setErrors({});
  }, []);

  // Memoize form validation to prevent recalculation on every render
  const isFormValid = useMemo(() => {
    return (
      inputs.age !== undefined &&
      inputs.sex !== undefined &&
      inputs.heightCm !== undefined &&
      inputs.weightKg !== undefined &&
      inputs.activityLevel !== undefined &&
      inputs.goal !== undefined &&
      Object.keys(errors).length === 0
    );
  }, [inputs, errors]);

  if (results) {
    return (
      <div className="space-y-6">
        <div 
          className="bg-gradient-to-br from-afya-primary/10 to-afya-secondary/10 rounded-xl p-6 border border-afya-primary/30 shadow-sm animate-slideUp"
          role="region"
          aria-label="Calculation results"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Daily Needs</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label="Fire emoji">🔥</span>
              <div>
                <p className="text-2xl font-bold text-afya-primary-dark">
                  <span className="sr-only">Estimated daily calories: </span>
                  {results.dailyCalories.toLocaleString()} calories
                </p>
                <p className="text-sm text-gray-600">per day</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label="Muscle emoji">💪</span>
              <div>
                <p className="text-2xl font-bold text-afya-secondary-dark">
                  <span className="sr-only">Recommended protein range: </span>
                  {results.proteinRangeMin}-{results.proteinRangeMax} grams
                </p>
                <p className="text-sm text-gray-600">of protein per day</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-teal-100">
            <p className="text-gray-700 leading-relaxed">{results.explanation}</p>
          </div>
        </div>

        {/* Contextual CTA */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-5 border border-teal-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl" role="img" aria-label="Sparkles">✨</span>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">
                Want Personalized Nutrition Guidance?
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                These numbers are a great starting point, but everyone's needs are unique. Our nutrition programs provide personalized meal plans, ongoing support, and adjustments based on how your body responds.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href="/programs"
                  className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                  View Nutrition Programs →
                </a>
                <span className="hidden sm:inline text-gray-300">|</span>
                <a
                  href="/get-started"
                  className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
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
            <Button className="w-full bg-gradient-to-r from-afya-primary to-afya-primary-light hover:from-afya-primary-dark hover:to-afya-primary transition-all duration-300">
              Explore Programs →
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Unit System Toggle */}
      <div 
        role="group" 
        aria-label="Unit system selection"
        className="flex gap-2 p-1 bg-gray-100 rounded-lg w-full sm:w-fit"
      >
        <button
          onClick={() => setUnitSystem('imperial')}
          role="radio"
          aria-checked={unitSystem === 'imperial'}
          className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] touch-target tap-highlight-none focus:outline-none focus:ring-2 focus:ring-afya-primary focus:ring-offset-2 ${
            unitSystem === 'imperial'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Imperial (lbs, ft)
        </button>
        <button
          onClick={() => setUnitSystem('metric')}
          role="radio"
          aria-checked={unitSystem === 'metric'}
          className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] touch-target tap-highlight-none focus:outline-none focus:ring-2 focus:ring-afya-primary focus:ring-offset-2 ${
            unitSystem === 'metric'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Metric (kg, cm)
        </button>
      </div>

      {/* About You Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">About You</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <Input
              id="age"
              type="number"
              placeholder="e.g., 30"
              value={inputs.age || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('age', parseInt(e.target.value) || 0)}
              error={errors.age}
              min={13}
              max={100}
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age}</p>
            )}
          </div>

          <div>
            <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">
              Sex
            </label>
            <select
              id="sex"
              value={inputs.sex || 'male'}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('sex', e.target.value as 'male' | 'female')}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afya-primary focus:border-transparent text-base min-h-[44px] transition-all duration-200"
              aria-label="Select biological sex for calculation"
              aria-describedby={errors.sex ? "sex-error" : undefined}
              aria-invalid={!!errors.sex}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.sex && (
              <p id="sex-error" className="mt-1 text-sm text-red-600" role="alert">{errors.sex}</p>
            )}
          </div>
        </div>

        {unitSystem === 'imperial' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (lbs)
              </label>
              <Input
                id="weight"
                type="number"
                placeholder="e.g., 150"
                value={imperialInputs.weightLbs}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleImperialInputChange('weightLbs', e.target.value)}
                error={errors.weightKg}
                min={66}
                max={660}
              />
              {errors.weightKg && (
                <p className="mt-1 text-sm text-red-600">Please enter a valid weight</p>
              )}
            </div>

            <div>
              <label id="height-label" className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <div className="flex gap-2" role="group" aria-labelledby="height-label">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Feet"
                    value={imperialInputs.heightFeet}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleImperialInputChange('heightFeet', e.target.value)}
                    error={errors.heightCm}
                    min={3}
                    max={8}
                    aria-label="Height in feet"
                    aria-describedby={errors.heightCm ? "height-error" : undefined}
                    aria-invalid={!!errors.heightCm}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Inches"
                    value={imperialInputs.heightInches}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleImperialInputChange('heightInches', e.target.value)}
                    error={errors.heightCm}
                    min={0}
                    max={11}
                    aria-label="Height in inches"
                    aria-describedby={errors.heightCm ? "height-error" : undefined}
                    aria-invalid={!!errors.heightCm}
                  />
                </div>
              </div>
              {errors.heightCm && (
                <p id="height-error" className="mt-1 text-sm text-red-600" role="alert">Please enter a valid height</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight-kg" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <Input
                id="weight-kg"
                type="number"
                placeholder="e.g., 70"
                value={inputs.weightKg || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('weightKg', parseFloat(e.target.value) || 0)}
                error={errors.weightKg}
                min={30}
                max={300}
              />
              {errors.weightKg && (
                <p className="mt-1 text-sm text-red-600">{errors.weightKg}</p>
              )}
            </div>

            <div>
              <label htmlFor="height-cm" className="block text-sm font-medium text-gray-700 mb-1">
                Height (cm)
              </label>
              <Input
                id="height-cm"
                type="number"
                placeholder="e.g., 170"
                value={inputs.heightCm || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('heightCm', parseFloat(e.target.value) || 0)}
                error={errors.heightCm}
                min={100}
                max={250}
              />
              {errors.heightCm && (
                <p className="mt-1 text-sm text-red-600">{errors.heightCm}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Activity & Goals Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Activity & Goals</h3>
        
        <div>
          <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-1">
            Activity Level
          </label>
          <select
            id="activity"
            value={inputs.activityLevel || 'moderate'}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('activityLevel', e.target.value as any)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base min-h-[44px]"
            aria-label="Select your typical activity level"
            aria-describedby={errors.activityLevel ? "activity-error" : undefined}
            aria-invalid={!!errors.activityLevel}
          >
            {Object.entries(ACTIVITY_DESCRIPTIONS).map(([key, description]) => (
              <option key={key} value={key}>
                {description}
              </option>
            ))}
          </select>
          {errors.activityLevel && (
            <p id="activity-error" className="mt-1 text-sm text-red-600" role="alert">{errors.activityLevel}</p>
          )}
        </div>

        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
            Goal
          </label>
          <select
            id="goal"
            value={inputs.goal || 'maintain'}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('goal', e.target.value as any)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base min-h-[44px]"
            aria-label="Select your health goal"
            aria-describedby={errors.goal ? "goal-error" : undefined}
            aria-invalid={!!errors.goal}
          >
            {Object.entries(GOAL_DESCRIPTIONS).map(([key, description]) => (
              <option key={key} value={key}>
                {description}
              </option>
            ))}
          </select>
          {errors.goal && (
            <p id="goal-error" className="mt-1 text-sm text-red-600" role="alert">{errors.goal}</p>
          )}
        </div>
      </div>

      {/* Calculate Button */}
      <Button
        onClick={handleCalculate}
        disabled={!isFormValid() || isCalculating}
        className="w-full bg-gradient-to-r from-afya-primary to-afya-primary-light hover:from-afya-primary-dark hover:to-afya-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
      >
        {isCalculating ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            Calculating...
          </span>
        ) : (
          'Calculate My Needs'
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
