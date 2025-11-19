'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  IntakePathConfig,
  QuestionBlock,
  Question,
  IntakeResponses,
  ConditionalLogicEvaluator,
  QuestionValidator,
  getDefaultValue
} from '@/types/intake';
import { getBlocksByIds } from '@/lib/intake/question-blocks';
import QuestionRenderer from './QuestionRenderer';
import ProgressTracker, { ProgressSection } from './ProgressTracker';
import { Button, Card } from '@/components/ui';

export interface DynamicIntakeFormProps {
  intakePath: IntakePathConfig;
  initialResponses?: IntakeResponses;
  onSubmit: (responses: IntakeResponses) => Promise<void>;
  onSave?: (responses: IntakeResponses) => Promise<void>;
  autoSaveInterval?: number; // milliseconds
}

export default function DynamicIntakeForm({
  intakePath,
  initialResponses = {},
  onSubmit,
  onSave,
  autoSaveInterval = 30000 // 30 seconds default
}: DynamicIntakeFormProps) {
  // State
  const [responses, setResponses] = useState<IntakeResponses>(initialResponses);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load question blocks
  const allBlocks = getBlocksByIds(intakePath.questionBlockIds);
  
  // Determine visible blocks based on branching logic
  const visibleBlockIds = ConditionalLogicEvaluator.getVisibleBlocks(
    allBlocks,
    intakePath.branchingRules,
    responses
  );
  
  const visibleBlocks = allBlocks.filter(block => 
    visibleBlockIds.includes(block.id)
  );

  // Get current block and visible questions
  const currentBlock = visibleBlocks[currentBlockIndex];
  const visibleQuestions = currentBlock
    ? ConditionalLogicEvaluator.getVisibleQuestions(currentBlock.questions, responses)
    : [];

  // Calculate progress sections
  const progressSections: ProgressSection[] = visibleBlocks.map((block, index) => ({
    name: block.name,
    blockIds: [block.id],
    isComplete: index < currentBlockIndex,
    isCurrent: index === currentBlockIndex
  }));

  // Handle response change
  const handleResponseChange = useCallback((questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    setHasUnsavedChanges(true);
    
    // Clear validation error for this question
    if (validationErrors[questionId]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  }, [validationErrors]);

  // Validate current block
  const validateCurrentBlock = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    
    for (const question of visibleQuestions) {
      const value = responses[question.id];
      const result = QuestionValidator.validateResponse(question, value);
      
      if (!result.isValid) {
        errors[question.id] = result.errors[0];
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [visibleQuestions, responses]);

  // Navigate to next block
  const handleNext = useCallback(() => {
    if (!validateCurrentBlock()) {
      // Scroll to first error
      const firstErrorElement = document.querySelector('[aria-invalid="true"]');
      firstErrorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    if (currentBlockIndex < visibleBlocks.length - 1) {
      setCurrentBlockIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [validateCurrentBlock, currentBlockIndex, visibleBlocks.length]);

  // Navigate to previous block
  const handlePrevious = useCallback(() => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentBlockIndex]);

  // Navigate to specific block
  const handleNavigateToBlock = useCallback((blockIndex: number) => {
    if (blockIndex >= 0 && blockIndex < visibleBlocks.length) {
      setCurrentBlockIndex(blockIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [visibleBlocks.length]);

  // Save progress
  const saveProgress = useCallback(async () => {
    if (!onSave || !hasUnsavedChanges) return;
    
    try {
      setIsSaving(true);
      await onSave(responses);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save progress:', error);
    } finally {
      setIsSaving(false);
    }
  }, [onSave, responses, hasUnsavedChanges]);

  // Auto-save effect
  useEffect(() => {
    if (!onSave || !hasUnsavedChanges) return;
    
    const timer = setTimeout(() => {
      saveProgress();
    }, autoSaveInterval);
    
    return () => clearTimeout(timer);
  }, [onSave, hasUnsavedChanges, autoSaveInterval, saveProgress]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    // Validate all visible questions across all blocks
    const allVisibleQuestions = visibleBlocks.flatMap(block =>
      ConditionalLogicEvaluator.getVisibleQuestions(block.questions, responses)
    );
    
    const validationResult = QuestionValidator.validateIntake(
      allVisibleQuestions,
      responses
    );
    
    if (!validationResult.isValid) {
      // Convert string[] errors to string (take first error)
      const errorMap: Record<string, string> = {};
      Object.entries(validationResult.errors).forEach(([key, errors]) => {
        errorMap[key] = Array.isArray(errors) ? errors[0] : errors;
      });
      setValidationErrors(errorMap);
      
      // Find the first block with errors and navigate to it
      for (let i = 0; i < visibleBlocks.length; i++) {
        const blockQuestions = ConditionalLogicEvaluator.getVisibleQuestions(
          visibleBlocks[i].questions,
          responses
        );
        const hasError = blockQuestions.some(q => validationResult.errors[q.id]);
        if (hasError) {
          setCurrentBlockIndex(i);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        }
      }
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit(responses);
    } catch (error) {
      console.error('Failed to submit intake:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [visibleBlocks, responses, onSubmit]);

  // Initialize default values for visible questions
  useEffect(() => {
    const newResponses = { ...responses };
    let hasChanges = false;
    
    for (const question of visibleQuestions) {
      if (responses[question.id] === undefined) {
        newResponses[question.id] = getDefaultValue(question);
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      setResponses(newResponses);
    }
  }, [currentBlock?.id]); // Only run when block changes

  if (!currentBlock) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No questions to display</p>
      </div>
    );
  }

  const isFirstBlock = currentBlockIndex === 0;
  const isLastBlock = currentBlockIndex === visibleBlocks.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-afya-light to-white">
      {/* Progress Tracker */}
      <ProgressTracker
        currentBlockIndex={currentBlockIndex}
        totalBlocks={visibleBlocks.length}
        sections={progressSections}
        onNavigate={handleNavigateToBlock}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Save Status */}
        {onSave && (
          <div className="mb-4 flex items-center justify-end text-sm">
            {isSaving ? (
              <span className="text-gray-500 flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : lastSaved ? (
              <span className="text-green-600 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            ) : hasUnsavedChanges ? (
              <span className="text-gray-500">Unsaved changes</span>
            ) : null}
          </div>
        )}

        {/* Question Block */}
        <Card variant="elevated" padding="lg" className="mb-6">
          {/* Block Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentBlock.title}
            </h2>
            {currentBlock.description && (
              <p className="text-gray-600">{currentBlock.description}</p>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {visibleQuestions.map((question) => (
              <QuestionRenderer
                key={question.id}
                question={question}
                value={responses[question.id]}
                onChange={(value) => handleResponseChange(question.id, value)}
                error={validationErrors[question.id]}
              />
            ))}
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstBlock}
            className={isFirstBlock ? 'invisible' : ''}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Button>

          <div className="flex items-center gap-3">
            {onSave && hasUnsavedChanges && (
              <Button
                variant="ghost"
                onClick={saveProgress}
                disabled={isSaving}
                size="sm"
              >
                Save Progress
              </Button>
            )}

            {isLastBlock ? (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
                isLoading={isSubmitting}
                size="lg"
              >
                Submit Intake
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNext}
                size="lg"
              >
                Next
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
