import * as React from 'react';
import { ButtonProps } from './Button.types';
import './Button.tokens'; // Assumes CSS variables for this component are loaded here

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      tone = 'institutional',
      loading = false,
      disabled = false,
      iconLeft,
      iconRight,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // In a real application, we would use a utility like clsx or tailwind-merge here.
    // For this primitive, we rely entirely on semantic CSS classes tied to our generated tokens.
    const baseClasses = `bdl-button bdl-button--${size} bdl-button--${variant} theme-${tone}`;
    const stateClasses = loading ? 'bdl-button--loading' : '';
    const combinedClasses = [baseClasses, stateClasses, className].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <span className="bdl-button__spinner" aria-hidden="true" />}
        {!loading && iconLeft && <span className="bdl-button__icon-left">{iconLeft}</span>}
        <span className="bdl-button__content">{children}</span>
        {!loading && iconRight && <span className="bdl-button__icon-right">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
