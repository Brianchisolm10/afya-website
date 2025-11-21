import { z } from 'zod';

/**
 * Discovery Form Validation Schema
 * 
 * Simple, welcoming form to capture initial interest
 * without overwhelming prospective clients
 */

export const discoveryFormSchema = z.object({
  fullName: z.string()
    .min(2, 'Please enter your full name')
    .max(100, 'Name is too long'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  
  phone: z.string()
    .min(10, 'Please enter a valid phone number')
    .max(20, 'Phone number is too long')
    .regex(/^[\d\s\-\(\)\+]+$/, 'Please enter a valid phone number'),
  
  primaryGoal: z.enum(['nutrition', 'training', 'youth', 'general', 'other'], {
    errorMap: () => ({ message: 'Please select your primary goal' }),
  }),
  
  goalDescription: z.string()
    .max(500, 'Description is too long')
    .optional(),
  
  startTimeframe: z.enum(['asap', 'within_month', '1_3_months', 'exploring'], {
    errorMap: () => ({ message: 'Please select when you\'d like to start' }),
  }),
  
  referralSource: z.string()
    .max(100)
    .optional(),
});

export type DiscoveryFormData = z.infer<typeof discoveryFormSchema>;

/**
 * Primary goal options for dropdown
 */
export const PRIMARY_GOAL_OPTIONS = [
  { value: 'nutrition', label: 'Improve my nutrition and eating habits' },
  { value: 'training', label: 'Build strength and fitness' },
  { value: 'youth', label: 'Support youth/family wellness' },
  { value: 'general', label: 'General wellness (not sure yet)' },
  { value: 'other', label: 'Something else' },
] as const;

/**
 * Start timeframe options for dropdown
 */
export const START_TIMEFRAME_OPTIONS = [
  { value: 'asap', label: 'As soon as possible' },
  { value: 'within_month', label: 'Within the next month' },
  { value: '1_3_months', label: 'In 1-3 months' },
  { value: 'exploring', label: 'Just exploring options' },
] as const;

/**
 * Referral source options (optional)
 */
export const REFERRAL_SOURCE_OPTIONS = [
  { value: 'google', label: 'Google search' },
  { value: 'social', label: 'Social media' },
  { value: 'friend', label: 'Friend or family' },
  { value: 'event', label: 'AFYA event' },
  { value: 'other', label: 'Other' },
] as const;
