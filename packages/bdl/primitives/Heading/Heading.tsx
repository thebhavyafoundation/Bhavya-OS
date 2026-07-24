import * as React from 'react';
import { HeadingProps } from './Heading.types';
import './Heading.tokens';

export const Heading = React.forwardRef<HTMLElement, HeadingProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-heading ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Heading.displayName = 'Heading';
