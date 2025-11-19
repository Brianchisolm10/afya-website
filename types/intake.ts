/**
 * Question Block Library System Types
 * 
 * This file defines the core data structures for the dynamic intake system,
 * including questions, validation rules, conditional logic, and question blocks.
 */

// ============================================================================
// Question Types
// ============================================================================

export type QuestionType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'date'
  | 'range';

// ============================================================================
// Validation Rules
// ============================================================================

export type ValidationType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'min'
  | 'max'
  | 'pattern'
  | 'email'
  | 'url'
  | 'custom';

export interface ValidationRule {
  type: ValidationType;
  value?: any;
  message: string;
  customValidator?: (value: any) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// ============================================================================
// Conditional Logic
// ============================================================================

export type ConditionType =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'and'
  | 'or'
  | 'not'
  | 'isEmpty'
  | 'isNotEmpty';

export interface Condition {
  type: ConditionType;
  questionId?: string;
  value?: any;
  conditions?: Condition[]; // For nested logic (and, or, not)
}

export type ActionType = 'show' | 'hide' | 'skip' | 'require';

export interface Action {
  type: ActionType;
  targetBlockIds?: string[];
  targetQuestionIds?: string[];
}

export interface ConditionalRule {
  id: string;
  condition: Condition;
  action: Action;
}

// ============================================================================
// Question Definition
// ============================================================================

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  helpText?: string;
  options?: QuestionOption[];
  validation?: ValidationRule[];
  conditionalDisplay?: Condition;
  defaultValue?: any;
  
  // For range type
  min?: number;
  max?: number;
  step?: number;
  
  // For number type
  unit?: string;
  
  // Metadata
  order: number;
  isRequired?: boolean;
}

// ============================================================================
// Question Block
// ============================================================================

export type QuestionBlockCategory =
  | 'DEMOGRAPHICS'
  | 'NUTRITION'
  | 'TRAINING'
  | 'HEALTH'
  | 'PERFORMANCE'
  | 'YOUTH'
  | 'WELLNESS'
  | 'SITUATION_BASED'
  | 'GOALS'
  | 'PREFERENCES';

export interface QuestionBlock {
  id: string;
  name: string;
  title: string;
  description?: string;
  category: QuestionBlockCategory;
  questions: Question[];
  order: number;
  isActive: boolean;
  conditionalDisplay?: Condition;
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// Intake Responses
// ============================================================================

export interface IntakeResponses {
  [questionId: string]: any;
}

export interface IntakeProgress {
  selectedPath?: string;
  currentStep: number;
  totalSteps?: number;
  responses: IntakeResponses;
  isComplete: boolean;
  lastSavedAt: Date;
}

// ============================================================================
// Intake Path Configuration
// ============================================================================

export interface IntakePathConfig {
  id: string;
  clientType: string;
  name: string;
  description: string;
  estimatedTime: string;
  questionBlockIds: string[];
  branchingRules: ConditionalRule[];
  isActive: boolean;
}

// ============================================================================
// Validation Logic
// ============================================================================

export class QuestionValidator {
  /**
   * Validates a single response against validation rules
   */
  static validateResponse(question: Question, value: any): ValidationResult {
    const errors: string[] = [];
    
    if (!question.validation || question.validation.length === 0) {
      return { isValid: true, errors: [] };
    }
    
    for (const rule of question.validation) {
      const error = this.validateRule(rule, value, question);
      if (error) {
        errors.push(error);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validates a single rule
   */
  private static validateRule(
    rule: ValidationRule,
    value: any,
    question: Question
  ): string | null {
    switch (rule.type) {
      case 'required':
        if (value === null || value === undefined || value === '' || 
            (Array.isArray(value) && value.length === 0)) {
          return rule.message;
        }
        break;
        
      case 'minLength':
        if (typeof value === 'string' && value.length < rule.value) {
          return rule.message;
        }
        break;
        
      case 'maxLength':
        if (typeof value === 'string' && value.length > rule.value) {
          return rule.message;
        }
        break;
        
      case 'min':
        if (typeof value === 'number' && value < rule.value) {
          return rule.message;
        }
        break;
        
      case 'max':
        if (typeof value === 'number' && value > rule.value) {
          return rule.message;
        }
        break;
        
      case 'pattern':
        if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
          return rule.message;
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof value === 'string' && !emailRegex.test(value)) {
          return rule.message;
        }
        break;
        
      case 'url':
        try {
          new URL(value);
        } catch {
          return rule.message;
        }
        break;
        
      case 'custom':
        if (rule.customValidator && !rule.customValidator(value)) {
          return rule.message;
        }
        break;
    }
    
    return null;
  }
  
  /**
   * Validates all responses in an intake
   */
  static validateIntake(
    questions: Question[],
    responses: IntakeResponses
  ): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};
    
    for (const question of questions) {
      const value = responses[question.id];
      const result = this.validateResponse(question, value);
      
      if (!result.isValid) {
        errors[question.id] = result.errors;
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

// ============================================================================
// Conditional Logic Evaluator
// ============================================================================

export class ConditionalLogicEvaluator {
  /**
   * Evaluates a condition against current responses
   */
  static evaluateCondition(
    condition: Condition,
    responses: IntakeResponses
  ): boolean {
    switch (condition.type) {
      case 'equals':
        return this.checkEquals(responses[condition.questionId!], condition.value);
        
      case 'notEquals':
        return !this.checkEquals(responses[condition.questionId!], condition.value);
        
      case 'contains':
        return this.checkContains(responses[condition.questionId!], condition.value);
        
      case 'notContains':
        return !this.checkContains(responses[condition.questionId!], condition.value);
        
      case 'greaterThan':
        return Number(responses[condition.questionId!]) > Number(condition.value);
        
      case 'lessThan':
        return Number(responses[condition.questionId!]) < Number(condition.value);
        
      case 'greaterThanOrEqual':
        return Number(responses[condition.questionId!]) >= Number(condition.value);
        
      case 'lessThanOrEqual':
        return Number(responses[condition.questionId!]) <= Number(condition.value);
        
      case 'isEmpty':
        const emptyValue = responses[condition.questionId!];
        return emptyValue === null || emptyValue === undefined || emptyValue === '' ||
               (Array.isArray(emptyValue) && emptyValue.length === 0);
        
      case 'isNotEmpty':
        const notEmptyValue = responses[condition.questionId!];
        return notEmptyValue !== null && notEmptyValue !== undefined && notEmptyValue !== '' &&
               (!Array.isArray(notEmptyValue) || notEmptyValue.length > 0);
        
      case 'and':
        return condition.conditions!.every(c => this.evaluateCondition(c, responses));
        
      case 'or':
        return condition.conditions!.some(c => this.evaluateCondition(c, responses));
        
      case 'not':
        return !this.evaluateCondition(condition.conditions![0], responses);
        
      default:
        return false;
    }
  }
  
  /**
   * Checks if two values are equal (handles arrays)
   */
  private static checkEquals(responseValue: any, conditionValue: any): boolean {
    if (Array.isArray(conditionValue)) {
      return conditionValue.includes(responseValue);
    }
    return responseValue === conditionValue;
  }
  
  /**
   * Checks if response contains value (for arrays or strings)
   */
  private static checkContains(responseValue: any, conditionValue: any): boolean {
    if (Array.isArray(responseValue)) {
      return responseValue.includes(conditionValue);
    }
    if (typeof responseValue === 'string') {
      return responseValue.includes(conditionValue);
    }
    return false;
  }
  
  /**
   * Determines which question blocks should be visible
   */
  static getVisibleBlocks(
    allBlocks: QuestionBlock[],
    branchingRules: ConditionalRule[],
    responses: IntakeResponses
  ): string[] {
    const visibleBlockIds = new Set<string>(
      allBlocks.map(b => b.id)
    );
    
    // Evaluate each branching rule
    for (const rule of branchingRules) {
      const conditionMet = this.evaluateCondition(rule.condition, responses);
      
      if (conditionMet) {
        // Apply the action
        const targetIds = rule.action.targetBlockIds || [];
        
        switch (rule.action.type) {
          case 'show':
            targetIds.forEach(id => visibleBlockIds.add(id));
            break;
          case 'hide':
          case 'skip':
            targetIds.forEach(id => visibleBlockIds.delete(id));
            break;
        }
      }
    }
    
    // Also check individual block conditional display
    for (const block of allBlocks) {
      if (block.conditionalDisplay) {
        const shouldShow = this.evaluateCondition(block.conditionalDisplay, responses);
        if (!shouldShow) {
          visibleBlockIds.delete(block.id);
        }
      }
    }
    
    return Array.from(visibleBlockIds);
  }
  
  /**
   * Determines which questions should be visible within blocks
   */
  static getVisibleQuestions(
    questions: Question[],
    responses: IntakeResponses
  ): Question[] {
    return questions.filter(question => {
      if (!question.conditionalDisplay) {
        return true;
      }
      return this.evaluateCondition(question.conditionalDisplay, responses);
    });
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Sanitizes user input based on question type
 */
export function sanitizeInput(value: any, type: QuestionType): any {
  if (value === null || value === undefined) {
    return value;
  }
  
  switch (type) {
    case 'text':
    case 'textarea':
      return String(value).trim();
      
    case 'number':
    case 'range':
      const num = Number(value);
      return isNaN(num) ? null : num;
      
    case 'select':
    case 'radio':
      return String(value);
      
    case 'multiselect':
    case 'checkbox':
      return Array.isArray(value) ? value : [value];
      
    case 'date':
      return value instanceof Date ? value : new Date(value);
      
    default:
      return value;
  }
}

/**
 * Gets default value for a question type
 */
export function getDefaultValue(question: Question): any {
  if (question.defaultValue !== undefined) {
    return question.defaultValue;
  }
  
  switch (question.type) {
    case 'text':
    case 'textarea':
    case 'select':
    case 'radio':
      return '';
      
    case 'number':
    case 'range':
      return question.min || 0;
      
    case 'multiselect':
    case 'checkbox':
      return [];
      
    case 'date':
      return null;
      
    default:
      return null;
  }
}

// ============================================================================
// Packet Template System Types
// ============================================================================

export type ContentBlockType = 
  | 'text'
  | 'table'
  | 'list'
  | 'chart'
  | 'image'
  | 'heading'
  | 'divider';

export interface FormattingOptions {
  bold?: boolean;
  italic?: boolean;
  fontSize?: string;
  color?: string;
  alignment?: 'left' | 'center' | 'right';
  headers?: string[];
  columns?: string[];
  listStyle?: 'bullet' | 'numbered';
  [key: string]: any;
}

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: string; // Can include {{placeholders}}
  dataSource?: string; // Path to client data (e.g., "client.fullName", "calculated.macros")
  formatting?: FormattingOptions;
  conditionalDisplay?: Condition;
  order: number;
}

export interface PacketSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  contentBlockIds: string[];
  conditionalDisplay?: Condition;
}

export interface PacketTemplate {
  id: string;
  name: string;
  packetType: string; // 'NUTRITION', 'WORKOUT', 'PERFORMANCE', 'YOUTH', 'RECOVERY', 'WELLNESS'
  clientType?: string; // Optional: specific client type this template is for
  sections: PacketSection[];
  contentBlocks: ContentBlock[];
  isDefault: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CalculatedValues {
  [key: string]: any;
}

export interface TemplateContext {
  client: any; // Client data from database
  calculated: CalculatedValues; // Derived values
  responses: IntakeResponses; // Raw intake responses
}

export interface PopulatedContent {
  sections: Array<{
    id: string;
    title: string;
    description?: string;
    blocks: Array<{
      id: string;
      type: ContentBlockType;
      content: string;
      formatting?: FormattingOptions;
    }>;
  }>;
  // Allow additional dynamic properties for packet-specific enhancements
  [key: string]: any;
}
