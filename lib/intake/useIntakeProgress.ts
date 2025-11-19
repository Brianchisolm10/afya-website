import { useState, useCallback } from 'react';
import { IntakeResponses } from '@/types/intake';

export interface IntakeProgressData {
  selectedPath?: string;
  currentStep: number;
  totalSteps?: number;
  responses: IntakeResponses;
  isComplete: boolean;
  lastSavedAt: Date;
}

export interface UseIntakeProgressReturn {
  saveProgress: (data: Partial<IntakeProgressData>) => Promise<void>;
  loadProgress: () => Promise<IntakeProgressData | null>;
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for managing intake progress (save/load)
 */
export function useIntakeProgress(): UseIntakeProgressReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveProgress = useCallback(async (data: Partial<IntakeProgressData>) => {
    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch('/api/intake/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save progress');
      }

      const result = await response.json();
      return result.progress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save progress';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const loadProgress = useCallback(async (): Promise<IntakeProgressData | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/intake/progress', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load progress');
      }

      const result = await response.json();
      return result.progress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load progress';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    saveProgress,
    loadProgress,
    isSaving,
    isLoading,
    error
  };
}
