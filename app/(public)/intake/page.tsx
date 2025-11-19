'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { DynamicIntakeForm } from '@/components/intake';
import { getPathByClientType } from '@/lib/intake/intake-paths';
import { IntakeResponses } from '@/types/intake';
import { useIntakeProgress } from '@/lib/intake/useIntakeProgress';

function IntakePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedPath = searchParams.get('path');
  const { saveProgress, loadProgress, isLoading } = useIntakeProgress();
  const [initialResponses, setInitialResponses] = useState<IntakeResponses>({});
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  // Load saved progress on mount
  useEffect(() => {
    const loadSavedProgress = async () => {
      try {
        const progress = await loadProgress();
        if (progress && progress.responses) {
          setInitialResponses(progress.responses);
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadSavedProgress();
  }, [loadProgress]);

  if (!selectedPath) {
    router.push('/get-started');
    return null;
  }

  // Get the intake path configuration
  const intakePath = getPathByClientType(selectedPath);

  if (!intakePath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-afya-light to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Path</h2>
          <p className="text-gray-600 mb-6">The selected intake path is not valid.</p>
          <button
            onClick={() => router.push('/get-started')}
            className="text-afya-primary hover:underline"
          >
            Return to path selection
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-afya-light to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-afya-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (responses: IntakeResponses) => {
    try {
      // Submit the intake
      const response = await fetch('/api/intake/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientType: selectedPath,
          responses
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit intake');
      }

      // Redirect to dashboard or success page
      router.push('/dashboard?intake=complete');
    } catch (error) {
      console.error('Failed to submit intake:', error);
      alert('Failed to submit intake. Please try again.');
    }
  };

  const handleSave = async (responses: IntakeResponses) => {
    try {
      await saveProgress({
        selectedPath,
        currentStep: 0, // This will be updated by the form
        responses,
        isComplete: false
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  return (
    <DynamicIntakeForm
      intakePath={intakePath}
      initialResponses={initialResponses}
      onSubmit={handleSubmit}
      onSave={handleSave}
      autoSaveInterval={30000} // Auto-save every 30 seconds
    />
  );
}

export default function IntakePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-afya-light to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-afya-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <IntakePageContent />
    </Suspense>
  );
}
