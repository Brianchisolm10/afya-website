'use client';

import { useState, ChangeEvent } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Smartphone, Heart } from 'lucide-react';
import Link from 'next/link';

interface YouthInputs {
  screenTimeHours: number;
  playTimeHours: number;
}

interface YouthResults {
  ratio: number;
  message: string;
  suggestion: string;
  encouragement: string;
  visualData: {
    screenPercentage: number;
    playPercentage: number;
  };
}

// Family-friendly suggestions database
const MOVEMENT_SUGGESTIONS = [
  "Try a 10-minute dance party to your favorite songs",
  "Go for a family walk around the neighborhood",
  "Play a game of tag or hide-and-seek",
  "Set up an obstacle course in the backyard or living room",
  "Have a bike ride or scooter adventure",
  "Try a new sport or activity together",
  "Do a fun workout video as a family",
  "Play catch or kick a ball around",
  "Go to a local park or playground",
  "Try jumping rope or hula hooping",
  "Have a family stretching or yoga session",
  "Create an indoor treasure hunt with physical challenges",
];

function getRandomSuggestion(): string {
  return MOVEMENT_SUGGESTIONS[Math.floor(Math.random() * MOVEMENT_SUGGESTIONS.length)];
}

function generateResults(inputs: YouthInputs): YouthResults {
  const totalHours = inputs.screenTimeHours + inputs.playTimeHours;
  const ratio = inputs.playTimeHours / inputs.screenTimeHours;
  
  // Calculate percentages for visualization
  const screenPercentage = totalHours > 0 ? (inputs.screenTimeHours / totalHours) * 100 : 50;
  const playPercentage = totalHours > 0 ? (inputs.playTimeHours / totalHours) * 100 : 50;

  let message: string;
  let encouragement: string;

  if (ratio >= 1.5) {
    // Play time is significantly more than screen time
    message = "You're doing an amazing job balancing screen time with active play!";
    encouragement = "Keep up the great work! Your body and mind are loving all that movement.";
  } else if (ratio >= 1) {
    // Play time equals or slightly exceeds screen time
    message = "You're finding a nice balance between screens and movement!";
    encouragement = "You're on a great path! Every bit of movement counts.";
  } else if (ratio >= 0.5) {
    // Screen time is a bit more than play time
    message = "There's room to add a bit more movement to your day!";
    encouragement = "Small changes can make a big difference. Even 10 extra minutes of play helps!";
  } else {
    // Screen time is significantly more than play time
    message = "Let's find some fun ways to add more movement to your day!";
    encouragement = "Every journey starts with a single step. You've got this!";
  }

  return {
    ratio,
    message,
    suggestion: getRandomSuggestion(),
    encouragement,
    visualData: {
      screenPercentage,
      playPercentage,
    },
  };
}

interface BarVisualizationProps {
  screenHours: number;
  playHours: number;
  screenPercentage: number;
  playPercentage: number;
}

function BarVisualization({ screenHours, playHours, screenPercentage, playPercentage }: BarVisualizationProps) {
  return (
    <div className="space-y-4" role="img" aria-label={`Activity balance: ${screenHours} hours screen time (${Math.round(screenPercentage)}%), ${playHours} hours play time (${Math.round(playPercentage)}%)`}>
      {/* Screen Time Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-500" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-700">Screen Time</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{screenHours} hours</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden" role="progressbar" aria-valuenow={screenPercentage} aria-valuemin={0} aria-valuemax={100} aria-label={`Screen time: ${Math.round(screenPercentage)}%`}>
          <div
            className="bg-gradient-to-r from-afya-secondary to-afya-secondary-light h-full rounded-full flex items-center justify-center transition-all duration-500"
            style={{ width: `${screenPercentage}%` }}
          >
            {screenPercentage > 15 && (
              <span className="text-white text-xs font-medium" aria-hidden="true">
                {Math.round(screenPercentage)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Play Time Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-green-500" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-700">Play & Movement</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{playHours} hours</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden" role="progressbar" aria-valuenow={playPercentage} aria-valuemin={0} aria-valuemax={100} aria-label={`Play and movement time: ${Math.round(playPercentage)}%`}>
          <div
            className="bg-gradient-to-r from-afya-primary to-afya-primary-light h-full rounded-full flex items-center justify-center transition-all duration-500"
            style={{ width: `${playPercentage}%` }}
          >
            {playPercentage > 15 && (
              <span className="text-white text-xs font-medium" aria-hidden="true">
                {Math.round(playPercentage)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function YouthCorner() {
  const [inputs, setInputs] = useState<Partial<YouthInputs>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [results, setResults] = useState<YouthResults | null>(null);

  const handleInputChange = (field: keyof YouthInputs, value: string) => {
    const numValue = parseFloat(value);
    
    // Validate input
    if (value && (isNaN(numValue) || numValue < 0 || numValue > 24)) {
      setErrors(prev => ({
        ...prev,
        [field]: 'Please enter a number between 0 and 24',
      }));
      return;
    }

    setInputs(prev => ({ ...prev, [field]: numValue || 0 }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCheck = () => {
    // Validate that both inputs are provided
    if (inputs.screenTimeHours === undefined || inputs.playTimeHours === undefined) {
      setErrors({
        general: 'Please fill in both fields',
      });
      return;
    }

    const validInputs = inputs as YouthInputs;
    const calculatedResults = generateResults(validInputs);
    setResults(calculatedResults);
  };

  const handleReset = () => {
    setResults(null);
    setErrors({});
  };

  const isFormValid = () => {
    return (
      inputs.screenTimeHours !== undefined &&
      inputs.playTimeHours !== undefined &&
      Object.keys(errors).length === 0
    );
  };

  if (results) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-afya-primary/10 to-afya-secondary/10 rounded-xl p-6 border border-afya-primary/30 shadow-sm animate-slideUp" role="region" aria-label="Activity balance results">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Activity Balance</h3>
          
          {/* Visual Comparison */}
          <div className="bg-white rounded-lg p-5 border border-gray-200 mb-4">
            <BarVisualization
              screenHours={inputs.screenTimeHours!}
              playHours={inputs.playTimeHours!}
              screenPercentage={results.visualData.screenPercentage}
              playPercentage={results.visualData.playPercentage}
            />
          </div>

          {/* Message */}
          <div className="bg-white rounded-lg p-5 border border-yellow-200 mb-4" role="status" aria-live="polite">
            <div className="flex items-start gap-3">
              <span className="text-3xl" role="img" aria-label="Star">🌟</span>
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {results.message}
                </p>
                <p className="text-gray-700 text-sm">
                  {results.encouragement}
                </p>
              </div>
            </div>
          </div>

          {/* Suggestion */}
          <div className="bg-gradient-to-r from-afya-primary/10 to-afya-primary-light/10 rounded-xl p-5 border border-afya-primary/30 shadow-sm" role="complementary">
            <div className="flex items-start gap-3">
              <span className="text-3xl" role="img" aria-label="Light bulb">💡</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">Try This Today:</h4>
                <p className="text-gray-700 text-sm">
                  {results.suggestion}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-yellow-100" role="note">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Remember:</strong> Both screen time and play time have their place! 
              The goal is to find a balance that feels good and keeps you healthy and happy.
            </p>
          </div>
        </div>

        {/* Contextual CTA for families */}
        <div className="bg-gradient-to-br from-afya-secondary/10 to-afya-secondary-light/10 rounded-xl p-5 border border-afya-secondary/30 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl" role="img" aria-label="Family">👨‍👩‍👧‍👦</span>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">
                Youth & Family Programs
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                We offer specialized programs for young athletes and families looking to build healthy habits together. Get age-appropriate guidance, fun activities, and support for the whole family.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href="/programs"
                  className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  View Youth Programs →
                </a>
                <span className="hidden sm:inline text-gray-300">|</span>
                <a
                  href="/get-started"
                  className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
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
            <Button className="w-full bg-gradient-to-r from-afya-primary to-afya-secondary hover:from-afya-primary-dark hover:to-afya-secondary-dark transition-all duration-300 hover:shadow-lg">
              Explore Programs →
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          Let's take a friendly look at how you spend your time! This tool helps you think about 
          balancing screen time with active play and movement.
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <label htmlFor="screenTime" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-500" aria-hidden="true" />
              Daily Screen Time (hours)
            </div>
          </label>
          <Input
            id="screenTime"
            type="number"
            placeholder="e.g., 3"
            value={inputs.screenTimeHours !== undefined ? inputs.screenTimeHours : ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('screenTimeHours', e.target.value)}
            error={errors.screenTimeHours}
            min={0}
            max={24}
            step={0.5}
            aria-label="Enter daily screen time in hours"
            aria-describedby={errors.screenTimeHours ? "screen-error screen-help" : "screen-help"}
            aria-invalid={!!errors.screenTimeHours}
          />
          {errors.screenTimeHours && (
            <p id="screen-error" className="mt-1 text-sm text-red-600" role="alert">{errors.screenTimeHours}</p>
          )}
          <p id="screen-help" className="mt-1 text-xs text-gray-500">
            Include TV, phones, tablets, computers, and video games
          </p>
        </div>

        <div>
          <label htmlFor="playTime" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-green-500" aria-hidden="true" />
              Daily Play & Movement Time (hours)
            </div>
          </label>
          <Input
            id="playTime"
            type="number"
            placeholder="e.g., 2"
            value={inputs.playTimeHours !== undefined ? inputs.playTimeHours : ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('playTimeHours', e.target.value)}
            error={errors.playTimeHours}
            min={0}
            max={24}
            step={0.5}
            aria-label="Enter daily play and movement time in hours"
            aria-describedby={errors.playTimeHours ? "play-error play-help" : "play-help"}
            aria-invalid={!!errors.playTimeHours}
          />
          {errors.playTimeHours && (
            <p id="play-error" className="mt-1 text-sm text-red-600" role="alert">{errors.playTimeHours}</p>
          )}
          <p id="play-help" className="mt-1 text-xs text-gray-500">
            Include sports, outdoor play, dancing, walking, and active games
          </p>
        </div>
      </div>

      {/* Check Button */}
      <Button
        onClick={handleCheck}
        disabled={!isFormValid()}
        className="w-full bg-gradient-to-r from-afya-primary to-afya-secondary hover:from-afya-primary-dark hover:to-afya-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
      >
        Check My Balance
      </Button>

      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errors.general}</p>
        </div>
      )}

      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 leading-relaxed">
          <strong>For families:</strong> This tool is designed to spark positive conversations 
          about healthy habits. Use it as a starting point to explore fun ways to stay active together!
        </p>
      </div>
    </div>
  );
}
