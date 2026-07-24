import * as React from 'react';
import { SpinnerProps } from './Spinner.types';
import './Spinner.tokens';

export const Spinner = React.forwardRef<HTMLElement, SpinnerProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-spinner ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Spinner.displayName = 'Spinner';
