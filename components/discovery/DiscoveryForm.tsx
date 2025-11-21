'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  discoveryFormSchema,
  type DiscoveryFormData,
  PRIMARY_GOAL_OPTIONS,
  START_TIMEFRAME_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
} from '@/lib/discovery/validation';

export default function DiscoveryForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<DiscoveryFormData>>({
    primaryGoal: undefined,
    startTimeframe: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof DiscoveryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = discoveryFormSchema.parse(formData);

      // Submit to API
      const response = await fetch('/api/discovery/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit form');
      }

      const result = await response.json();

      // Redirect to calendar booking page with lead ID
      router.push(`/book-call?lead=${result.leadId}`);
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        // API or network errors
        setErrors({ submit: error.message || 'Something went wrong. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="Your name"
          error={errors.fullName}
          required
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="your@email.com"
          error={errors.email}
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="(555) 123-4567"
          error={errors.phone}
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          We'll use this to confirm your discovery call
        </p>
      </div>

      {/* Primary Goal */}
      <div>
        <label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-700 mb-2">
          What's your primary goal? <span className="text-red-500">*</span>
        </label>
        <select
          id="primaryGoal"
          value={formData.primaryGoal || ''}
          onChange={(e) => handleChange('primaryGoal', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-afya-primary focus:border-transparent transition-all ${
            errors.primaryGoal ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Select your goal...</option>
          {PRIMARY_GOAL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.primaryGoal && (
          <p className="mt-1 text-sm text-red-600">{errors.primaryGoal}</p>
        )}
      </div>

      {/* Goal Description (Optional) */}
      <div>
        <label htmlFor="goalDescription" className="block text-sm font-medium text-gray-700 mb-2">
          Tell us more (optional)
        </label>
        <textarea
          id="goalDescription"
          value={formData.goalDescription || ''}
          onChange={(e) => handleChange('goalDescription', e.target.value)}
          placeholder="Share anything else you'd like us to know about your goals or situation..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afya-primary focus:border-transparent transition-all resize-none"
          maxLength={500}
        />
        <p className="mt-1 text-xs text-gray-500 text-right">
          {formData.goalDescription?.length || 0}/500
        </p>
      </div>

      {/* Start Timeframe */}
      <div>
        <label htmlFor="startTimeframe" className="block text-sm font-medium text-gray-700 mb-2">
          When would you like to start? <span className="text-red-500">*</span>
        </label>
        <select
          id="startTimeframe"
          value={formData.startTimeframe || ''}
          onChange={(e) => handleChange('startTimeframe', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-afya-primary focus:border-transparent transition-all ${
            errors.startTimeframe ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Select timeframe...</option>
          {START_TIMEFRAME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.startTimeframe && (
          <p className="mt-1 text-sm text-red-600">{errors.startTimeframe}</p>
        )}
      </div>

      {/* Referral Source (Optional) */}
      <div>
        <label htmlFor="referralSource" className="block text-sm font-medium text-gray-700 mb-2">
          How did you hear about AFYA? (optional)
        </label>
        <select
          id="referralSource"
          value={formData.referralSource || ''}
          onChange={(e) => handleChange('referralSource', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afya-primary focus:border-transparent transition-all"
        >
          <option value="">Select source...</option>
          {REFERRAL_SOURCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 text-lg"
      >
        {isSubmitting ? 'Submitting...' : 'Continue to Book Your Call'}
      </Button>

      {/* Privacy Note */}
      <p className="text-xs text-gray-500 text-center">
        By submitting this form, you agree to our{' '}
        <a href="/privacy" className="text-afya-primary hover:underline">
          Privacy Policy
        </a>
        . We'll never share your information.
      </p>
    </form>
  );
}
