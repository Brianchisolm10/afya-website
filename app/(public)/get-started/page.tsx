'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PathSelectionScreen, ClientType } from '@/components/intake';
import { Button } from "@/components/ui";

export default function GetStartedPage() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<ClientType | null>(null);
  const [showPathSelection, setShowPathSelection] = useState(true);

  const handlePathSelect = (path: ClientType) => {
    setSelectedPath(path);
  };

  const handleContinue = () => {
    if (selectedPath) {
      // Navigate to intake form with selected path
      router.push(`/intake?path=${selectedPath}`);
    }
  };

  const handleBack = () => {
    setSelectedPath(null);
  };

  // Show path selection screen
  if (showPathSelection && !selectedPath) {
    return <PathSelectionScreen onPathSelect={handlePathSelect} selectedPath={selectedPath || undefined} />;
  }

  // Show confirmation screen after path selection
  if (selectedPath) {
    return (
      <div className="py-12 md:py-16 bg-afya-light min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ready to Begin
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              You've selected your path. Let's get started with your personalized intake.
            </p>
          </div>

          {/* Confirmation Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-8">
            <div className="max-w-2xl mx-auto">
              {/* Selected Path Display - Enhanced */}
              <div className="mb-8 relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-afya-primary/10 via-afya-secondary/10 to-afya-light rounded-2xl"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-afya-primary/5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-afya-secondary/5 rounded-full -ml-24 -mb-24"></div>
                
                {/* Content */}
                <div className="relative p-8 border-2 border-afya-primary/20 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      {/* Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-afya-primary to-afya-secondary rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-afya-primary uppercase tracking-wide mb-1">
                          Your Selected Path
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                          {selectedPath.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h2>
                      </div>
                    </div>
                    <button
                      onClick={handleBack}
                      className="flex items-center space-x-2 px-4 py-2 text-afya-primary hover:bg-afya-primary/10 rounded-lg transition-all duration-200 font-medium group"
                    >
                      <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                      </svg>
                      <span>Change</span>
                    </button>
                  </div>
                  
                  {/* Success indicator */}
                  <div className="flex items-center space-x-2 text-green-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Path confirmed - Ready to begin</span>
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                What to Expect
              </h3>
              <div className="space-y-3 mb-8">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Questions tailored to your selected path</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Progress tracking throughout the form</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Auto-save feature to resume later if needed</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Personalized packets generated based on your responses</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleContinue}
                  variant="primary"
                  size="lg"
                  className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Continue to Intake Form
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
                <Button
                  onClick={handleBack}
                  variant="secondary"
                  size="lg"
                  className="hover:shadow-md transition-all duration-200"
                >
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Change Path
                </Button>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-gradient-to-br from-afya-light to-white border border-gray-200 rounded-lg p-6 md:p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              What Happens Next?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-afya-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  1
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Complete Intake</h4>
                <p className="text-sm text-gray-700">
                  Answer questions specific to your selected path
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-afya-secondary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  2
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Automatic Processing</h4>
                <p className="text-sm text-gray-700">
                  Your personalized packets are generated automatically
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-afya-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  3
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Access Your Plan</h4>
                <p className="text-sm text-gray-700">
                  View and download your customized guidance packets
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
