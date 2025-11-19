/**
 * Password strength validation result
 */
export interface PasswordStrengthResult {
  valid: boolean;
  score: number; // 0-4 (0=very weak, 4=very strong)
  messages: string[];
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
  };
}

/**
 * Sanitize string input to prevent XSS attacks
 * Escapes HTML special characters
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize email input
 * Converts to lowercase and trims whitespace
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }

  return email.toLowerCase().trim();
}

/**
 * Sanitize number input
 * Ensures the value is a valid number
 */
export function sanitizeNumber(input: any): number | null {
  const num = Number(input);
  return isNaN(num) ? null : num;
}

/**
 * Sanitize boolean input
 * Ensures the value is a valid boolean
 */
export function sanitizeBoolean(input: any): boolean {
  if (typeof input === 'boolean') {
    return input;
  }
  if (typeof input === 'string') {
    return input.toLowerCase() === 'true';
  }
  return Boolean(input);
}

/**
 * Sanitize array input
 * Ensures the value is an array and sanitizes each element
 */
export function sanitizeArray(input: any, sanitizer?: (item: any) => any): any[] {
  if (!Array.isArray(input)) {
    return [];
  }

  if (sanitizer) {
    return input.map(sanitizer);
  }

  return input;
}

/**
 * Sanitize object input
 * Recursively sanitizes all string values in an object
 */
export function sanitizeObject(input: any): any {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === 'string') {
    return sanitizeString(input);
  }

  if (typeof input === 'number' || typeof input === 'boolean') {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeObject);
  }

  if (typeof input === 'object') {
    const sanitized: any = {};
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(input[key]);
      }
    }
    return sanitized;
  }

  return input;
}

/**
 * Validate and sanitize intake responses
 * Ensures all user-provided data is safe
 */
export function sanitizeIntakeResponses(responses: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(responses)) {
    // Sanitize the key itself
    const sanitizedKey = sanitizeString(key);

    // Sanitize the value based on its type
    if (typeof value === 'string') {
      sanitized[sanitizedKey] = sanitizeString(value);
    } else if (typeof value === 'number') {
      sanitized[sanitizedKey] = value;
    } else if (typeof value === 'boolean') {
      sanitized[sanitizedKey] = value;
    } else if (Array.isArray(value)) {
      sanitized[sanitizedKey] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[sanitizedKey] = sanitizeObject(value);
    } else {
      sanitized[sanitizedKey] = value;
    }
  }

  return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize filename to prevent directory traversal
 */
export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') {
    return '';
  }

  // Remove directory traversal attempts
  return filename
    .replace(/\.\./g, '')
    .replace(/\//g, '')
    .replace(/\\/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Validate password strength according to requirements
 * Requirements: minimum 8 chars, uppercase, lowercase, number
 * @param password - Password to validate
 * @returns Validation result with score and messages
 */
export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const messages: string[] = [];
  
  if (!checks.minLength) {
    messages.push('Password must be at least 8 characters long');
  }
  if (!checks.hasUppercase) {
    messages.push('Password must contain at least one uppercase letter');
  }
  if (!checks.hasLowercase) {
    messages.push('Password must contain at least one lowercase letter');
  }
  if (!checks.hasNumber) {
    messages.push('Password must contain at least one number');
  }

  // Calculate strength score (0-4)
  let score = 0;
  if (checks.minLength) score++;
  if (checks.hasUppercase) score++;
  if (checks.hasLowercase) score++;
  if (checks.hasNumber) score++;

  // Bonus points for extra length and special characters
  if (password.length >= 12) score = Math.min(score + 0.5, 4);
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score = Math.min(score + 0.5, 4);

  const valid = checks.minLength && checks.hasUppercase && checks.hasLowercase && checks.hasNumber;

  return {
    valid,
    score: Math.floor(score),
    messages,
    checks,
  };
}
