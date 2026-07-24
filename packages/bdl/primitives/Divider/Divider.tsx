import * as React from 'react';
import { DividerProps } from './Divider.types';
import './Divider.tokens';

export const Divider = React.forwardRef<HTMLElement, DividerProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-divider ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Divider.displayName = 'Divider';
