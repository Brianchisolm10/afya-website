import { HTMLAttributes, forwardRef } from 'react';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'light' | 'dark' | 'gradient';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  containerWidth?: 'full' | 'container' | 'narrow';
}

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      children,
      variant = 'default',
      spacing = 'lg',
      containerWidth = 'container',
      className = '',
      ...props
    },
    ref
  ) => {
    // Base section styles
    const baseStyles = 'w-full';

    // Background color variants matching AFYA design system
    const variantStyles = {
      default: 'bg-white',
      light: 'bg-gray-50',
      dark: 'bg-gray-900 text-white',
      gradient: 'bg-gradient-to-br from-[#40E0D0]/10 to-[#9370DB]/10',
    };

    // Consistent section spacing using design system CSS variables
    const spacingStyles = {
      none: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
    };

    const spacingValues = {
      none: {},
      sm: { paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' },
      md: { paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-12)' },
      lg: { paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-16)' },
      xl: { paddingTop: 'var(--space-24)', paddingBottom: 'var(--space-24)' },
    };

    // Container width management
    const containerStyles = {
      full: 'w-full',
      container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
    };

    return (
      <section
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${spacingStyles[spacing]} ${className}`}
        style={{
          ...spacingValues[spacing],
          ...props.style,
        }}
        {...props}
      >
        <div className={containerStyles[containerWidth]}>
          {children}
        </div>
      </section>
    );
  }
);

Section.displayName = 'Section';

export default Section;
