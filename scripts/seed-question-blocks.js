/**
 * Seed script for question blocks (JavaScript version)
 * Run with: node scripts/seed-question-blocks.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Question blocks data (converted from TypeScript)
const allQuestionBlocks = [
  {
    id: 'basic-demographics',
    name: 'Basic Demographics',
    category: 'DEMOGRAPHICS',
    order: 1,
    isActive: true,
    questions: [
      {
        id: 'full-name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'John Doe',
        order: 1,
        isRequired: true,
        validation: [
          { type: 'required', message: 'Name is required' },
          { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' }
        ]
      },
      {
        id: 'email',
        type: 'text',
        label: 'Email Address',
        placeholder: 'john@example.com',
        order: 2,
        isRequired: true,
        validation: [
          { type: 'required', message: 'Email is required' },
          { type: 'email', message: 'Please enter a valid email address' }
        ]
      },
      {
        id: 'date-of-birth',
        type: 'date',
        label: 'Date of Birth',
        order: 3,
        isRequired: true,
        validation: [
          { type: 'required', message: 'Date of birth is required' }
        ]
      },
      {
        id: 'gender',
        type: 'select',
        label: 'Gender',
        order: 4,
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'non-binary', label: 'Non-binary' },
          { value: 'prefer-not-to-say', label: 'Prefer not to say' }
        ],
