import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from 'react';

type BaseButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
};

type ButtonAsButton = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
    as?: 'button';
  };

type ButtonAsLink = BaseButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & {
    as: 'a';
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className = '',
      as = 'button',
      ...restProps
    } = props;

    // Base styles with consistent design system values
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const baseStyle = {
      fontWeight: 'var(--font-semibold)',
      borderRadius: 'var(--radius-md)',
      transitionDuration: 'var(--transition-base)',
    };

    // Variant styles matching AFYA design system
    const variantStyles = {
      primary:
        'bg-gradient-to-br from-[#40E0D0] to-[#9370DB] text-white hover:opacity-90 focus:ring-[#40E0D0] shadow-sm hover:shadow-md',
      secondary:
        'bg-[#9370DB] text-white hover:bg-[#8A2BE2] focus:ring-[#9370DB] shadow-sm hover:shadow-md',
      outline:
        'border-2 border-[#40E0D0] text-[#40E0D0] hover:bg-[#40E0D0] hover:text-white focus:ring-[#40E0D0] bg-white',
    };

    // Consistent sizing using design system spacing
    // All sizes meet minimum 44x44px touch target requirement
    const sizeStyles = {
      sm: 'min-h-[44px]',
      md: 'min-h-[44px]',
      lg: '',
    };

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

    const widthStyles = fullWidth ? 'w-full' : '';
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

    // Loading spinner component
    const loadingSpinner = isLoading && (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const combinedStyle = {
      ...baseStyle,
      ...sizeStyleValues[size],
    };

    if (as === 'a') {
      const anchorProps = restProps as AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={combinedClassName}
          style={combinedStyle}
          {...anchorProps}
        >
          {loadingSpinner}
          {children}
        </a>
      );
    }

    const { disabled, ...buttonProps } = restProps as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled || isLoading}
        className={combinedClassName}
        style={combinedStyle}
        {...buttonProps}
      >
        {loadingSpinner}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
