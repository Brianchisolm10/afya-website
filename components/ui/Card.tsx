import { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'flat' | 'hover';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'flat',
      padding = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    // Base styles with consistent border radius using CSS variables
    const baseStyles = 'bg-white';

    // Variant styles matching design requirements
    const variantStyles = {
      elevated: 'shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-shadow',
      flat: 'border border-gray-200',
      hover: 'shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-1 cursor-pointer',
    };

    // Consistent padding using design system spacing (CSS variables)
    const paddingStyles = {
      none: '',
      sm: '',      // Applied via style prop
      md: '',      // Applied via style prop
      lg: '',      // Applied via style prop
    };

    const paddingValues = {
      none: {},
      sm: { padding: 'var(--space-4)' },
      md: { padding: 'var(--space-6)' },
      lg: { padding: 'var(--space-8)' },
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
        style={{
          borderRadius: 'var(--radius-lg)',
          transitionDuration: 'var(--transition-base)',
          ...paddingValues[padding],
          ...props.style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
