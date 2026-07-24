import * as React from 'react';
import { StackProps } from './Stack.types';
import './Stack.tokens';

export const Stack = React.forwardRef<HTMLElement, StackProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-stack ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Stack.displayName = 'Stack';
