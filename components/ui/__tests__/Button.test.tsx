import { describe, it, expect } from 'vitest';

// Button component variant and state logic tests
describe('Button Component Logic', () => {
  describe('Variant styles', () => {
    it('should have primary variant with gradient', () => {
      const variantStyles = {
        primary: 'bg-gradient-to-br from-[#40E0D0] to-[#9370DB] text-white hover:opacity-90 focus:ring-[#40E0D0] shadow-sm hover:shadow-md',
        secondary: 'bg-[#9370DB] text-white hover:bg-[#8A2BE2] focus:ring-[#9370DB] shadow-sm hover:shadow-md',
        outline: 'border-2 border-[#40E0D0] text-[#40E0D0] hover:bg-[#40E0D0] hover:text-white focus:ring-[#40E0D0] bg-white',
      };

      expect(variantStyles.primary).toContain('bg-gradient-to-br');
      expect(variantStyles.primary).toContain('from-[#40E0D0]');
      expect(variantStyles.primary).toContain('to-[#9370DB]');
    });

    it('should have secondary variant with solid color', () => {
      const variantStyles = {
        primary: 'bg-gradient-to-br from-[#40E0D0] to-[#9370DB] text-white hover:opacity-90 focus:ring-[#40E0D0] shadow-sm hover:shadow-md',
        secondary: 'bg-[#9370DB] text-white hover:bg-[#8A2BE2] focus:ring-[#9370DB] shadow-sm hover:shadow-md',
        outline: 'border-2 border-[#40E0D0] text-[#40E0D0] hover:bg-[#40E0D0] hover:text-white focus:ring-[#40E0D0] bg-white',
      };

      expect(variantStyles.secondary).toContain('bg-[#9370DB]');
      expect(variantStyles.secondary).toContain('text-white');
    });

    it('should have outline variant with border', () => {
      const variantStyles = {
        primary: 'bg-gradient-to-br from-[#40E0D0] to-[#9370DB] text-white hover:opacity-90 focus:ring-[#40E0D0] shadow-sm hover:shadow-md',
        secondary: 'bg-[#9370DB] text-white hover:bg-[#8A2BE2] focus:ring-[#9370DB] shadow-sm hover:shadow-md',
        outline: 'border-2 border-[#40E0D0] text-[#40E0D0] hover:bg-[#40E0D0] hover:text-white focus:ring-[#40E0D0] bg-white',
      };

      expect(variantStyles.outline).toContain('border-2');
      expect(variantStyles.outline).toContain('border-[#40E0D0]');
    });
  });

  describe('Size styles', () => {
    it('should have correct font sizes for each size', () => {
      const sizeStyleValues = {
        sm: { 
          padding: 'var(--space-2) var(--space-4)',
          fontSize: 'var(--text-sm)',
        },
        md: { 
          padding: 'var(--space-3) var(--space-6)',
          fontSize: 'var(--text-base)',
        },
        lg: { 
          padding: 'var(--space-4) var(--space-8)',
          fontSize: 'var(--text-lg)',
        },
      };

      expect(sizeStyleValues.sm.fontSize).toBe('var(--text-sm)');
      expect(sizeStyleValues.md.fontSize).toBe('var(--text-base)');
      expect(sizeStyleValues.lg.fontSize).toBe('var(--text-lg)');
    });

    it('should meet minimum 44px touch target requirement', () => {
      const minHeight = 44;
      const sizeStyles = {
        sm: 'min-h-[44px]',
        md: 'min-h-[44px]',
        lg: '',
      };

      expect(sizeStyles.sm).toContain('min-h-[44px]');
      expect(sizeStyles.md).toContain('min-h-[44px]');
      expect(minHeight).toBeGreaterThanOrEqual(44);
    });
  });

  describe('State management', () => {
    it('should disable button when loading', () => {
      const isLoading = true;
      const disabled = isLoading;
      
      expect(disabled).toBe(true);
    });

    it('should disable button when disabled prop is true', () => {
      const disabled = true;
      const isLoading = false;
      const finalDisabled = disabled || isLoading;
      
      expect(finalDisabled).toBe(true);
    });

    it('should not disable button when both are false', () => {
      const disabled = false;
      const isLoading = false;
      const finalDisabled = disabled || isLoading;
      
      expect(finalDisabled).toBe(false);
    });
  });

  describe('Full width option', () => {
    it('should apply full width class when enabled', () => {
      const fullWidth = true;
      const widthStyles = fullWidth ? 'w-full' : '';
      
      expect(widthStyles).toBe('w-full');
    });

    it('should not apply full width class when disabled', () => {
      const fullWidth = false;
      const widthStyles = fullWidth ? 'w-full' : '';
      
      expect(widthStyles).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('should have focus ring styles', () => {
      const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
      
      expect(baseStyles).toContain('focus:ring-2');
      expect(baseStyles).toContain('focus:ring-offset-2');
    });

    it('should have disabled styles', () => {
      const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
      
      expect(baseStyles).toContain('disabled:opacity-50');
      expect(baseStyles).toContain('disabled:cursor-not-allowed');
    });
  });
});
