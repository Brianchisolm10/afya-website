"use client";

import { useState } from 'react';
import PlateVisual from './PlateVisual';
import { getPlateConfiguration, type GoalType, type MealType } from '@/lib/tools/plate-data';

export function PlateBuilder() {
  const [goal, setGoal] = useState<GoalType>('energy');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = () => {
    setShowResults(true);
  };

  const configuration = getPlateConfiguration(goal, mealType);

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-gradient-to-br from-afya-secondary/10 to-afya-primary/10 rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Build Your Plate
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Select your goal and meal type to see balanced plate proportions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Goal Selection */}
          <div>
            <label
              htmlFor="goal"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              What's your goal?
            </label>
            <select
              id="goal"
              value={goal}
              onChange={(e) => {
                setGoal(e.target.value as GoalType);
                setShowResults(false);
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-afya-primary focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-base min-h-[44px]"
              aria-label="Select your nutrition goal"
              aria-describedby="goal-description"
            >
              <option value="energy">General Energy & Health</option>
              <option value="performance">Athletic Performance</option>
              <option value="recovery">Recovery & Healing</option>
            </select>
            <p id="goal-description" className="text-xs text-gray-500 mt-1">
              {goal === 'energy' && 'Balanced nutrition for daily activities'}
              {goal === 'performance' && 'Optimized for training and competition'}
              {goal === 'recovery' && 'Support healing and reduce inflammation'}
            </p>
          </div>

          {/* Meal Type Selection */}
          <div>
            <label
              htmlFor="mealType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Which meal?
            </label>
            <select
              id="mealType"
              value={mealType}
              onChange={(e) => {
                setMealType(e.target.value as MealType);
                setShowResults(false);
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-afya-primary focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-base min-h-[44px]"
              aria-label="Select meal type"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-afya-primary to-afya-secondary text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-afya-primary min-h-[44px] touch-target tap-highlight-none text-sm sm:text-base"
          aria-label="Generate plate visualization"
        >
          Show My Plate
        </button>
      </div>

      {/* Results Section */}
      {showResults && (
        <div className="space-y-8 animate-fadeIn" role="region" aria-label="Plate builder results">
          {/* Plate Visual */}
          <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 text-center">
              Your {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Plate
            </h3>
            <p className="text-sm text-gray-600 mb-6 sm:mb-8 text-center">
              {goal === 'energy' && 'Balanced for daily energy'}
              {goal === 'performance' && 'Optimized for performance'}
              {goal === 'recovery' && 'Focused on recovery'}
            </p>
            
            <div className="flex justify-center" role="img" aria-label={`Plate visualization showing ${configuration.sections.map(s => `${s.percentage}% ${s.label}`).join(', ')}`}>
              <PlateVisual sections={configuration.sections} size={Math.min(280, typeof window !== 'undefined' ? window.innerWidth - 80 : 280)} />
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-gradient-to-br from-afya-primary/5 to-afya-secondary/5 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Why These Proportions?
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {configuration.explanation}
            </p>
          </div>

          {/* Meal Examples */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Example Meals
            </h4>
            <div className="space-y-3">
              {configuration.examples.map((example, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-afya-primary to-afya-secondary flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{example.name}</p>
                    {example.dietaryNote && (
                      <p className="text-xs text-afya-primary mt-1 font-medium">
                        {example.dietaryNote}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Educational Note */}
          <div className="bg-gradient-to-br from-afya-accent/10 to-afya-accent/5 rounded-xl p-6 border border-afya-accent/20" role="note">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-2xl" role="img" aria-label="Light bulb">💡</div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Remember
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  These proportions are general guidelines, not strict rules. Your individual needs may vary based on your activity level, metabolism, and health goals. Listen to your body and adjust as needed.
                </p>
              </div>
            </div>
          </div>

          {/* Contextual CTA */}
          <div className="bg-gradient-to-br from-afya-primary/10 to-afya-secondary/10 rounded-xl p-6 border border-afya-primary/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-2xl" role="img" aria-label="Sparkles">✨</div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 mb-2">
                  Want Personalized Meal Plans?
                </h4>
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  These plate examples are a great starting point, but everyone's nutritional needs are unique. Our nutrition programs provide customized meal plans, recipes, and ongoing support tailored to your specific goals and preferences.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href="/programs"
                    className="inline-flex items-center text-sm font-medium text-afya-primary hover:text-afya-secondary transition-colors"
                  >
                    View Nutrition Programs →
                  </a>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <a
                    href="/get-started"
                    className="inline-flex items-center text-sm font-medium text-afya-primary hover:text-afya-secondary transition-colors"
                  >
                    Get Started Today →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
            <a
              href="/programs"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-afya-primary to-afya-secondary hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-afya-primary min-h-[44px] touch-target tap-highlight-none text-sm sm:text-base"
            >
              Explore Nutrition Programs
            </a>
            <button
              onClick={() => setShowResults(false)}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-afya-primary bg-white border-2 border-afya-primary hover:bg-afya-primary hover:text-white active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-afya-primary min-h-[44px] touch-target tap-highlight-none text-sm sm:text-base"
            >
              Try Another Combination
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
