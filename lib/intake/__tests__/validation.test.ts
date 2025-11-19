/**
 * Validation Rules Tests
 * 
 * Tests for question validation logic
 */

import { describe, test, expect } from 'vitest';
import { QuestionValidator, Question, IntakeResponses } from '@/types/intake';

describe('QuestionValidator', () => {
  describe('required validation', () => {
    test('validates required field with value', () => {
      const question: Question = {
        id: 'full-name',
        type: 'text',
        label: 'Full Name',
        order: 1,
        validation: [{ type: 'required', message: 'Name is required' }]
      };
      
      const result = QuestionValidator.validateResponse(question, 'John Doe');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('validates required field without value', () => {
      const question: Question = {
        id: 'full-name',
        type: 'text',
        label: 'Full Name',
        order: 1,
        validation: [{ type: 'required', message: 'Name is required' }]
      };
      
      const result = QuestionValidator.validateResponse(question, '');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name is required');
    });
    
    test('validates required field with null', () => {
      const question: Question = {
        id: 'full-name',
        type: 'text',
        label: 'Full Name',
        order: 1,
        validation: [{ type: 'required', message: 'Name is required' }]
      };
      
      const result = QuestionValidator.validateResponse(question, null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name is required');
    });
  });
  
  describe('minLength validation', () => {
    test('validates minLength - valid', () => {
      const question: Question = {
        id: 'password',
        type: 'text',
        label: 'Password',
        order: 1,
        validation: [{ type: 'minLength', value: 8, message: 'Password must be at least 8 characters' }]
      };
      
      const result = QuestionValidator.validateResponse(question, 'password123');
      expect(result.isValid).toBe(true);
    });
    
    test('validates minLength - invalid', () => {
      const question: Question = {
        id: 'password',
        type: 'text',
        label: 'Password',
        order: 1,
        validation: [{ type: 'minLength', value: 8, message: 'Password must be at least 8 characters' }]
      };
      
      const result = QuestionValidator.validateResponse(question, 'pass');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters');
    });
  });
  
  describe('maxLength validation', () => {
    test('validates maxLength - valid', () => {
      const question: Question = {
        id: 'bio',
        type: 'textarea',
        label: 'Bio',
        order: 1,
        validation: [{ type: 'maxLength', value: 500, message: 'Bio must be less than 500 characters' }]
      };
      
      const result = QuestionValidator.validateResponse(question, 'Short bio');
      expect(result.isValid).toBe(true);
    });
    
    test('validates maxLength - invalid', () => {
      const question: Question = {
        id: 'bio',
        type: 'textarea',
        label: 'Bio',
        order: 1,
        validation: [{ type: 'maxLength', value: 10, message: 'Bio must be less than 10 characters' }]
      };
      
      const result = QuestionValidator.validateResponse(question, 'This is a very long bio');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Bio must be less than 10 characters');
    });
  });
  
  describe('min validation', () => {
    test('validates min number - valid', () => {
      const question: Question = {
        id: 'age',
        type: 'number',
        label: 'Age',
        order: 1,
        validation: [{ type: 'min', value: 18, message: 'Must be at least 18' }]
      };
      
      const result = QuestionValidator.validateResponse(question, 25);
      expect(result.isValid).toBe(true);
    });
    
    test('validates min number - invalid', () => {
      const question: Question = {
        id: 'age',
        type: 'number',
        label: 'Age',
        order: 1,
        validation: [{ type: 'min', value: 18, message: 'Must be at least 18' }]
      };
      
      const result = QuestionValidator.validateResponse(question, 15);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Must be at least 18');
    });
  });
  
  describe('max validation', () => {
    test('validates max number - valid', () => {
      const question: Question = {
        id: 'days-per-week',
        type: 'number',
        label: 'Days Per Week',
        order: 1,
        validation: [{ type: 'max', value: 7, message: 'Cannot exceed 7 days' }]
      };
      
      const result = QuestionValidator.validateResponse(question, 5);
      expect(result.isValid).toBe(true);
    });
    
    test('validates max number - invalid', () => {
      const question: Question = {
        id: 'days-per-week',
        type: 'number',
        label: 'Days Per Week',
        order: 1,
        validation: [{ type: 'max', value: 7, message: 'Cannot exceed 7 days' }]
      };
      
      const result = QuestionValidator.validateResponse(question, 10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Cannot exceed 7 days');
    });
  });
  
  describe('email validation', () => {
    test('validates email - valid', () => {
      const question: Question = {
        id: 'email',
        type: 'text',
        label: 'Email',
        order: 1,
        validation: [{ type: 'email', message: 'Invalid email format' }]
      };
      
      const result = QuestionValidator.validateResponse(question, 'test@example.com');
      expect(result.isValid).toBe(true);
    });
    
    test('validates email - invalid', () => {
      const question: Question = {
        id: 'email',
        type: 'text',
        label: 'Email',
        order: 1,
        validation: [{ type: 'email', message: 'Invalid email format' }]
      };
      
      const result = QuestionValidator.validateResponse(question, 'invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });
  });
  
  describe('pattern validation', () => {
    test('validates pattern - valid', () => {
      const question: Question = {
        id: 'phone',
        type: 'text',
        label: 'Phone',
        order: 1,
        validation: [{ 
          type: 'pattern', 
          value: '^\\d{3}-\\d{3}-\\d{4}$', 
          message: 'Phone must be in format XXX-XXX-XXXX' 
        }]
      };
      
      const result = QuestionValidator.validateResponse(question, '555-123-4567');
      expect(result.isValid).toBe(true);
    });
    
    test('validates pattern - invalid', () => {
      const question: Question = {
        id: 'phone',
        type: 'text',
        label: 'Phone',
        order: 1,
        validation: [{ 
          type: 'pattern', 
          value: '^\\d{3}-\\d{3}-\\d{4}$', 
          message: 'Phone must be in format XXX-XXX-XXXX' 
        }]
      };
      
      const result = QuestionValidator.validateResponse(question, '5551234567');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Phone must be in format XXX-XXX-XXXX');
    });
  });
  
  describe('multiple validation rules', () => {
    test('validates multiple rules - all pass', () => {
      const question: Question = {
        id: 'username',
        type: 'text',
        label: 'Username',
        order: 1,
        validation: [
          { type: 'required', message: 'Username is required' },
          { type: 'minLength', value: 3, message: 'Username must be at least 3 characters' },
          { type: 'maxLength', value: 20, message: 'Username must be less than 20 characters' }
        ]
      };
      
      const result = QuestionValidator.validateResponse(question, 'johndoe');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('validates multiple rules - some fail', () => {
      const question: Question = {
        id: 'username',
        type: 'text',
        label: 'Username',
        order: 1,
        validation: [
          { type: 'required', message: 'Username is required' },
          { type: 'minLength', value: 3, message: 'Username must be at least 3 characters' },
          { type: 'maxLength', value: 20, message: 'Username must be less than 20 characters' }
        ]
      };
      
      const result = QuestionValidator.validateResponse(question, 'ab');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Username must be at least 3 characters');
    });
  });
  
  describe('validateIntake', () => {
    test('validates complete intake - all valid', () => {
      const questions: Question[] = [
        {
          id: 'full-name',
          type: 'text',
          label: 'Full Name',
          order: 1,
          validation: [{ type: 'required', message: 'Name is required' }]
        },
        {
          id: 'email',
          type: 'text',
          label: 'Email',
          order: 2,
          validation: [
            { type: 'required', message: 'Email is required' },
            { type: 'email', message: 'Invalid email' }
          ]
        },
        {
          id: 'age',
          type: 'number',
          label: 'Age',
          order: 3,
          validation: [
            { type: 'required', message: 'Age is required' },
            { type: 'min', value: 18, message: 'Must be 18+' }
          ]
        }
      ];
      
      const responses: IntakeResponses = {
        'full-name': 'John Doe',
        'email': 'john@example.com',
        'age': 25
      };
      
      const result = QuestionValidator.validateIntake(questions, responses);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
    
    test('validates complete intake - some invalid', () => {
      const questions: Question[] = [
        {
          id: 'full-name',
          type: 'text',
          label: 'Full Name',
          order: 1,
          validation: [{ type: 'required', message: 'Name is required' }]
        },
        {
          id: 'email',
          type: 'text',
          label: 'Email',
          order: 2,
          validation: [
            { type: 'required', message: 'Email is required' },
            { type: 'email', message: 'Invalid email' }
          ]
        },
        {
          id: 'age',
          type: 'number',
          label: 'Age',
          order: 3,
          validation: [
            { type: 'required', message: 'Age is required' },
            { type: 'min', value: 18, message: 'Must be 18+' }
          ]
        }
      ];
      
      const responses: IntakeResponses = {
        'full-name': '',
        'email': 'invalid-email',
        'age': 15
      };
      
      const result = QuestionValidator.validateIntake(questions, responses);
      expect(result.isValid).toBe(false);
      expect(result.errors['full-name']).toContain('Name is required');
      expect(result.errors['email']).toContain('Invalid email');
      expect(result.errors['age']).toContain('Must be 18+');
    });
    
    test('validates intake with optional fields', () => {
      const questions: Question[] = [
        {
          id: 'full-name',
          type: 'text',
          label: 'Full Name',
          order: 1,
          validation: [{ type: 'required', message: 'Name is required' }]
        },
        {
          id: 'nickname',
          type: 'text',
          label: 'Nickname',
          order: 2,
          validation: [] // Optional field
        }
      ];
      
      const responses: IntakeResponses = {
        'full-name': 'John Doe'
        // nickname not provided
      };
      
      const result = QuestionValidator.validateIntake(questions, responses);
      expect(result.isValid).toBe(true);
    });
  });
});
