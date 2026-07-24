import * as React from 'react';
import { SpacerProps } from './Spacer.types';
import './Spacer.tokens';

export const Spacer = React.forwardRef<HTMLElement, SpacerProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-spacer ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Spacer.displayName = 'Spacer';
