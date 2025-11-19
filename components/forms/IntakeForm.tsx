'use client';

import { useState, FormEvent, useCallback, useMemo } from 'react';
import { useToast } from '@/components/Toast';
import { isValidEmail } from '@/lib/utils';

interface IntakeFormData {
  // Basic Information
  fullName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  heightInches: string;
  weightLbs: string;
  
  // Activity & Goals
  activityLevel: string;
  dailyMovementPattern: string;
  mainFitnessGoals: string;
  trainingExperience: string;
  trainingHistory: string;
  
  // Training Preferences
  daysPerWeek: string;
  sessionDuration: string;
  preferredWorkoutTime: string;
  availableEquipment: string;
  workoutLocation: string;
  trainingStyle: string;
  coachingStyle: string;
  
  // Motivation & Challenges
  motivation: string;
  biggestStruggle: string;
  
  // Health & Medical
  injuries: string;
  medicalConditions: string;
  medications: string;
  painOrDiscomfort: string;
  
  // Nutrition
  dietType: string;
  foodAllergies: string;
  foodsToAvoid: string;
  eatsBreakfast: string;
  eatsAnimalProducts: string;
  mealsPerDay: string;
  beverageConsumption: string;
  waterIntakeOz: string;
  typicalDayEating: string;
  favoriteMeals: string;
  preferredMacros: string;
  fastingPattern: string;
  culturalDietaryNeeds: string;
  
  // Program Delivery
  deliveryPreference: string;
  wantsWeeklyCheckins: string;
  
  // Sport-Specific (Optional)
  sportsPlayed: string;
  schoolGrade: string;
  eatsBeforePractice: string;
  staysHydrated: string;
  seasonMotivation: string;
  seasonChallenges: string;
}

interface IntakeFormProps {
  onSuccess: (data: { client: any; packets: any[] }) => void;
  onError: (error: string) => void;
}

export default function IntakeForm({ onSuccess, onError }: IntakeFormProps) {
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  
  const [formData, setFormData] = useState<IntakeFormData>({
    fullName: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    heightInches: '',
    weightLbs: '',
    activityLevel: '',
    dailyMovementPattern: '',
    mainFitnessGoals: '',
    trainingExperience: '',
    trainingHistory: '',
    daysPerWeek: '',
    sessionDuration: '',
    preferredWorkoutTime: '',
    availableEquipment: '',
    workoutLocation: '',
    trainingStyle: '',
    coachingStyle: '',
    motivation: '',
    biggestStruggle: '',
    injuries: '',
    medicalConditions: '',
    medications: '',
    painOrDiscomfort: '',
    dietType: '',
    foodAllergies: '',
    foodsToAvoid: '',
    eatsBreakfast: '',
    eatsAnimalProducts: '',
    mealsPerDay: '',
    beverageConsumption: '',
    waterIntakeOz: '',
    typicalDayEating: '',
    favoriteMeals: '',
    preferredMacros: '',
    fastingPattern: '',
    culturalDietaryNeeds: '',
    deliveryPreference: '',
    wantsWeeklyCheckins: '',
    sportsPlayed: '',
    schoolGrade: '',
    eatsBeforePractice: '',
    staysHydrated: '',
    seasonMotivation: '',
    seasonChallenges: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof IntakeFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof IntakeFormData, string>> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.gender) newErrors.gender = 'Please select your gender';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.heightInches) newErrors.heightInches = 'Height is required';
      if (!formData.weightLbs) newErrors.weightLbs = 'Weight is required';
    }

    if (step === 2) {
      if (!formData.activityLevel) newErrors.activityLevel = 'Activity level is required';
      if (!formData.mainFitnessGoals.trim()) newErrors.mainFitnessGoals = 'Please describe your goals';
      if (!formData.trainingExperience) newErrors.trainingExperience = 'Training experience is required';
    }

    if (step === 3) {
      if (!formData.daysPerWeek) newErrors.daysPerWeek = 'Please select training days per week';
      if (!formData.sessionDuration) newErrors.sessionDuration = 'Session duration is required';
      if (!formData.workoutLocation.trim()) newErrors.workoutLocation = 'Workout location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/intake/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit intake form');
      }

      toast.success('Welcome to AFYA!', 'Your intake form has been submitted successfully');
      onSuccess(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error('Submission Failed', errorMessage);
      onError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = useCallback((field: keyof IntakeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  const InputField = useCallback(({
    label,
    name,
    type = 'text',
    required = false,
    placeholder = '',
  }: {
    label: string;
    name: keyof IntakeFormData;
    type?: string;
    required?: boolean;
    placeholder?: string;
  }) => (
    <div key={name}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={(e) => handleChange(name, e.target.value)}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
          errors[name] ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        disabled={isSubmitting}
        autoComplete="off"
      />
      {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}
    </div>
  ), [formData, errors, isSubmitting, handleChange]);

  const TextAreaField = useCallback(({
    label,
    name,
    required = false,
    placeholder = '',
    rows = 3,
  }: {
    label: string;
    name: keyof IntakeFormData;
    required?: boolean;
    placeholder?: string;
    rows?: number;
  }) => (
    <div key={name}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={formData[name]}
        onChange={(e) => handleChange(name, e.target.value)}
        rows={rows}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
          errors[name] ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        disabled={isSubmitting}
        autoComplete="off"
      />
      {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}
    </div>
  ), [formData, errors, isSubmitting, handleChange]);

  const SelectField = useCallback(({
    label,
    name,
    options,
    required = false,
  }: {
    label: string;
    name: keyof IntakeFormData;
    options: { value: string; label: string }[];
    required?: boolean;
  }) => (
    <div key={name}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={(e) => handleChange(name, e.target.value)}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
          errors[name] ? 'border-red-500' : 'border-gray-300'
        }`}
        disabled={isSubmitting}
        autoComplete="off"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}
    </div>
  ), [formData, errors, isSubmitting, handleChange]);

  // Step 1: Basic Information
  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
      
      <InputField label="Full Name" name="fullName" required placeholder="John Doe" />
      <InputField label="Email Address" name="email" type="email" required placeholder="your.email@example.com" />
      
      <SelectField
        label="Sex/Gender"
        name="gender"
        required
        options={[
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'non-binary', label: 'Non-binary' },
          { value: 'prefer-not-to-say', label: 'Prefer not to say' },
        ]}
      />
      
      <InputField label="Date of Birth" name="dateOfBirth" type="date" required />
      
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Height (inches)" name="heightInches" type="number" required placeholder="70" />
        <InputField label="Weight (lbs)" name="weightLbs" type="number" required placeholder="150" />
      </div>
    </div>
  );

  // Step 2: Activity & Goals
  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity & Goals</h2>
      
      <SelectField
        label="Activity Level"
        name="activityLevel"
        required
        options={[
          { value: 'sedentary', label: 'Sedentary (little to no exercise)' },
          { value: 'lightly-active', label: 'Lightly Active (1-3 days/week)' },
          { value: 'moderately-active', label: 'Moderately Active (3-5 days/week)' },
          { value: 'very-active', label: 'Very Active (6-7 days/week)' },
          { value: 'extremely-active', label: 'Extremely Active (athlete/physical job)' },
        ]}
      />
      
      <TextAreaField
        label="Describe your daily movement pattern"
        name="dailyMovementPattern"
        placeholder="e.g., Desk job, walk 30 min daily, play basketball twice a week..."
        rows={3}
      />
      
      <TextAreaField
        label="Main fitness or sport goals"
        name="mainFitnessGoals"
        required
        placeholder="e.g., Lose 20 lbs, improve basketball performance, build muscle..."
        rows={3}
      />
      
      <SelectField
        label="Training experience level"
        name="trainingExperience"
        required
        options={[
          { value: 'beginner', label: 'Beginner (0-1 year)' },
          { value: 'intermediate', label: 'Intermediate (1-3 years)' },
          { value: 'advanced', label: 'Advanced (3-5 years)' },
          { value: 'expert', label: 'Expert (5+ years)' },
        ]}
      />
      
      <TextAreaField
        label="Training history"
        name="trainingHistory"
        placeholder="Types of training you've done before (e.g., CrossFit, running, weightlifting, yoga...)"
        rows={3}
      />
    </div>
  );

  // Step 3: Training Preferences
  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Training Preferences</h2>
      
      <SelectField
        label="How many days per week would you like to train?"
        name="daysPerWeek"
        required
        options={[
          { value: '1', label: '1 day' },
          { value: '2', label: '2 days' },
          { value: '3', label: '3 days' },
          { value: '4', label: '4 days' },
          { value: '5', label: '5 days' },
          { value: '6', label: '6 days' },
          { value: '7', label: '7 days' },
        ]}
      />
      
      <SelectField
        label="How long should each session last?"
        name="sessionDuration"
        required
        options={[
          { value: '15-30', label: '15-30 minutes' },
          { value: '30-45', label: '30-45 minutes' },
          { value: '45-60', label: '45-60 minutes' },
          { value: '60-90', label: '60-90 minutes' },
          { value: '90+', label: '90+ minutes' },
        ]}
      />
      
      <SelectField
        label="Preferred workout time of day"
        name="preferredWorkoutTime"
        options={[
          { value: 'early-morning', label: 'Early Morning (5-7 AM)' },
          { value: 'morning', label: 'Morning (7-10 AM)' },
          { value: 'midday', label: 'Midday (10 AM-2 PM)' },
          { value: 'afternoon', label: 'Afternoon (2-5 PM)' },
          { value: 'evening', label: 'Evening (5-8 PM)' },
          { value: 'night', label: 'Night (8 PM+)' },
          { value: 'flexible', label: 'Flexible' },
        ]}
      />
      
      <TextAreaField
        label="Equipment you have access to"
        name="availableEquipment"
        placeholder="e.g., Dumbbells, barbell, resistance bands, pull-up bar, none (bodyweight only)..."
        rows={2}
      />
      
      <InputField
        label="Where you plan to work out"
        name="workoutLocation"
        required
        placeholder="e.g., Home, commercial gym, school facility, park..."
      />
      
      <SelectField
        label="Preferred training style"
        name="trainingStyle"
        options={[
          { value: 'solo', label: 'Solo' },
          { value: 'partner', label: 'With a partner' },
          { value: 'small-group', label: 'Small group' },
          { value: 'flexible', label: 'Flexible' },
        ]}
      />
      
      <TextAreaField
        label="Coaching style you prefer"
        name="coachingStyle"
        placeholder="e.g., Motivational, technical/detailed, hands-off, accountability-focused..."
        rows={2}
      />
    </div>
  );

  // Step 4: Motivation & Health
  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Motivation & Health</h2>
      
      <TextAreaField
        label="What motivates you the most?"
        name="motivation"
        placeholder="e.g., Looking good, feeling strong, competing, health, family..."
        rows={2}
      />
      
      <TextAreaField
        label="What is your biggest struggle with staying consistent?"
        name="biggestStruggle"
        placeholder="e.g., Time management, motivation, soreness, diet..."
        rows={2}
      />
      
      <TextAreaField
        label="Current or past injuries"
        name="injuries"
        placeholder="List any injuries and their status (e.g., ACL tear 2020 - fully recovered, lower back pain - ongoing...)"
        rows={3}
      />
      
      <TextAreaField
        label="Medical conditions"
        name="medicalConditions"
        placeholder="e.g., Asthma, thyroid issues, diabetes, high blood pressure... (Leave blank if none)"
        rows={2}
      />
      
      <TextAreaField
        label="Medications or supplements"
        name="medications"
        placeholder="List any medications or supplements you currently take"
        rows={2}
      />
      
      <TextAreaField
        label="Any pain or discomfort during exercise?"
        name="painOrDiscomfort"
        placeholder="If yes, describe where and when it occurs"
        rows={2}
      />
    </div>
  );

  // Step 5: Nutrition (Part 1)
  const renderStep5 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Nutrition - Part 1</h2>
      
      <SelectField
        label="Do you follow any specific diet?"
        name="dietType"
        options={[
          { value: 'none', label: 'No specific diet' },
          { value: 'vegetarian', label: 'Vegetarian' },
          { value: 'vegan', label: 'Vegan' },
          { value: 'keto', label: 'Keto' },
          { value: 'paleo', label: 'Paleo' },
          { value: 'mediterranean', label: 'Mediterranean' },
          { value: 'low-carb', label: 'Low Carb' },
          { value: 'other', label: 'Other' },
        ]}
      />
      
      <TextAreaField
        label="List any food allergies or sensitivities"
        name="foodAllergies"
        placeholder="e.g., Peanuts, dairy, gluten, shellfish... (Leave blank if none)"
        rows={2}
      />
      
      <TextAreaField
        label="Foods you avoid for personal, health, or religious reasons"
        name="foodsToAvoid"
        placeholder="e.g., Pork, beef, processed foods..."
        rows={2}
      />
      
      <SelectField
        label="Do you eat breakfast?"
        name="eatsBreakfast"
        options={[
          { value: 'yes', label: 'Yes, regularly' },
          { value: 'sometimes', label: 'Sometimes' },
          { value: 'no', label: 'No, I skip breakfast' },
        ]}
      />
      
      <SelectField
        label="Do you eat animal products?"
        name="eatsAnimalProducts"
        options={[
          { value: 'yes-all', label: 'Yes, all types (meat, dairy, eggs)' },
          { value: 'some', label: 'Some (e.g., only dairy and eggs)' },
          { value: 'no', label: 'No, plant-based only' },
        ]}
      />
      
      <SelectField
        label="How many meals/snacks do you usually eat per day?"
        name="mealsPerDay"
        options={[
          { value: '1-2', label: '1-2' },
          { value: '3', label: '3' },
          { value: '4-5', label: '4-5' },
          { value: '6+', label: '6+' },
        ]}
      />
    </div>
  );

  // Step 6: Nutrition (Part 2)
  const renderStep6 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Nutrition - Part 2</h2>
      
      <TextAreaField
        label="Do you drink coffee, soda, or alcohol? List amount/frequency"
        name="beverageConsumption"
        placeholder="e.g., 2 cups coffee daily, 1 soda on weekends, social drinker..."
        rows={2}
      />
      
      <InputField
        label="How much water do you drink per day? (oz)"
        name="waterIntakeOz"
        type="number"
        placeholder="64"
      />
      
      <TextAreaField
        label="Describe a typical day of eating"
        name="typicalDayEating"
        placeholder="Breakfast: ..., Lunch: ..., Dinner: ..., Snacks: ..."
        rows={4}
      />
      
      <TextAreaField
        label="Favorite meals or go-to foods"
        name="favoriteMeals"
        placeholder="e.g., Chicken and rice, pasta, smoothies, tacos..."
        rows={2}
      />
      
      <TextAreaField
        label="Preferred sources of protein, carbs, and fats"
        name="preferredMacros"
        placeholder="Protein: ..., Carbs: ..., Fats: ..."
        rows={3}
      />
      
      <SelectField
        label="Do you follow a time-restricted eating pattern (fasting)?"
        name="fastingPattern"
        options={[
          { value: 'no', label: 'No' },
          { value: '16-8', label: 'Yes, 16:8 (16 hour fast, 8 hour eating window)' },
          { value: '18-6', label: 'Yes, 18:6' },
          { value: 'omad', label: 'Yes, OMAD (one meal a day)' },
          { value: 'other', label: 'Other pattern' },
        ]}
      />
      
      <TextAreaField
        label="Any cultural or religious dietary needs?"
        name="culturalDietaryNeeds"
        placeholder="e.g., Halal, Kosher, specific fasting periods..."
        rows={2}
      />
    </div>
  );

  // Step 7: Program Delivery & Sport-Specific
  const renderStep7 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Program Delivery & Additional Info</h2>
      
      <SelectField
        label="How would you like your program delivered?"
        name="deliveryPreference"
        options={[
          { value: 'pdf', label: 'PDF' },
          { value: 'google-doc', label: 'Google Doc' },
          { value: 'video', label: 'Video walkthrough' },
          { value: 'app', label: 'Mobile app (if available)' },
        ]}
      />
      
      <SelectField
        label="Do you want weekly check-ins?"
        name="wantsWeeklyCheckins"
        options={[
          { value: 'yes', label: 'Yes, weekly check-ins' },
          { value: 'biweekly', label: 'Every 2 weeks' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'no', label: 'No, I prefer to work independently' },
        ]}
      />
      
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sport-Specific (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">Fill this section if you're a student-athlete or play competitive sports</p>
        
        <InputField
          label="Sport(s) played"
          name="sportsPlayed"
          placeholder="e.g., Basketball, Soccer, Track & Field..."
        />
        
        <InputField
          label="School grade"
          name="schoolGrade"
          placeholder="e.g., 9th, 10th, College Freshman..."
        />
        
        <SelectField
          label="Do you eat before practice or games?"
          name="eatsBeforePractice"
          options={[
            { value: '', label: 'N/A' },
            { value: 'yes', label: 'Yes, always' },
            { value: 'sometimes', label: 'Sometimes' },
            { value: 'no', label: 'No' },
          ]}
        />
        
        <SelectField
          label="Do you stay hydrated during school/practice?"
          name="staysHydrated"
          options={[
            { value: '', label: 'N/A' },
            { value: 'yes', label: 'Yes, very well' },
            { value: 'somewhat', label: 'Somewhat' },
            { value: 'no', label: 'No, I struggle with this' },
          ]}
        />
        
        <TextAreaField
          label="What helps you stay motivated during the season?"
          name="seasonMotivation"
          placeholder="e.g., Team support, competition, coach feedback..."
          rows={2}
        />
        
        <TextAreaField
          label="What usually makes it hard for you to stay on track?"
          name="seasonChallenges"
          placeholder="e.g., Schoolwork, fatigue, social life, injuries..."
          rows={2}
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      {renderProgressBar()}
      
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
      {currentStep === 5 && renderStep5()}
      {currentStep === 6 && renderStep6()}
      {currentStep === 7 && renderStep7()}

      <div className="flex justify-between mt-8 pt-6 border-t">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePrevious}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
        )}
        
        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={handleNext}
            className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Next Step
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit & Start Your Journey'}
          </button>
        )}
      </div>
    </form>
  );
}
