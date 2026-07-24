import * as React from 'react';
import { SectionProps } from './Section.types';
import './Section.tokens';

export const Section = React.forwardRef<HTMLElement, SectionProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-section ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Section.displayName = 'Section';
