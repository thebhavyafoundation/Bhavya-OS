import * as React from 'react';
import { BadgeProps } from './Badge.types';
import './Badge.tokens';

export const Badge = React.forwardRef<HTMLElement, BadgeProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-badge ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Badge.displayName = 'Badge';
